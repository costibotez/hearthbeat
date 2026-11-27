#pragma once

#include <algorithm>
#include <array>
#include <cstdint>
#include <cstdlib>
#include <cstdio>
#include <cstring>
#include <ctime>
#include <deque>
#include <mutex>
#include <optional>
#include <string>
#include <string_view>

#include "aes/esp_aes_gcm.h"
#include "esp_http_client.h"
#include "esp_log.h"
#include "esp_random.h"
#include "esp_timer.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "mdns.h"
#include "mbedtls/gcm.h"
#include "mbedtls/md.h"

#include "esphome/components/json/json_util.h"
#include "esphome/components/web_server_base/web_server_base.h"
#include "esphome/core/alloc_helpers.h"
#include "esphome/core/application.h"
#include "esphome/core/preferences.h"

namespace hearthbeat::household {

using Key = std::array<uint8_t, 32>;
constexpr auto ADMIN_PATH = "/hearthbeat/household";
constexpr auto CHALLENGE_PATH = "/hearthbeat/household/challenge";
constexpr auto REPORT_PATH = "/hearthbeat/household/report";
constexpr size_t MAX_ROOMS = 8;
constexpr size_t MAX_PENDING = 10;
// ESPHome limits URL-encoded POST bodies to 1024 bytes, including the packet's hex encoding.
constexpr size_t MAX_PAYLOAD = 430;
constexpr uint64_t CHECK_IN_MS = 20000;
constexpr uint64_t EXPIRE_MS = 65000;
constexpr uint64_t INVITE_MS = 10 * 60 * 1000;
constexpr uint64_t JOIN_TIMEOUT_MS = 45000;

enum class Role : uint8_t { STANDALONE, PRIMARY, ROOM };

inline uint64_t millis64() { return esp_timer_get_time() / 1000; }
inline bool is_id(std::string_view value) {
  return value.size() == 6 && value.find_first_not_of("0123456789abcdef") == std::string_view::npos;
}
inline bool is_host(std::string_view value) {
  if (!value.ends_with(".local") || value.size() > 69) return false;
  value.remove_suffix(6);
  return !value.empty() && value.front() != '-' && value.back() != '-' &&
         value.find_first_not_of("abcdefghijklmnopqrstuvwxyz0123456789-") == std::string_view::npos;
}

inline std::string hex(const uint8_t *bytes, size_t size) {
  constexpr char digits[] = "0123456789abcdef";
  std::string result(size * 2, '0');
  for (size_t i = 0; i < size; ++i) {
    result[2 * i] = digits[bytes[i] >> 4];
    result[2 * i + 1] = digits[bytes[i] & 15];
  }
  return result;
}
inline bool unhex(std::string_view value, uint8_t *out, size_t size) {
  if (value.size() != size * 2) return false;
  constexpr std::string_view digits = "0123456789abcdef";
  for (size_t i = 0; i < size; ++i) {
    const auto high = digits.find(value[2 * i]), low = digits.find(value[2 * i + 1]);
    if (high == digits.npos || low == digits.npos) return false;
    out[i] = static_cast<uint8_t>((high << 4) | low);
  }
  return true;
}

inline std::string shorten(std::string_view value, size_t limit) {
  if (value.size() <= limit) return std::string(value);
  size_t end = limit - 3;
  while (end && (static_cast<unsigned char>(value[end]) & 0xc0) == 0x80) --end;
  return std::string(value.substr(0, end)) + "...";
}

inline std::string associated(std::string_view id, std::string_view challenge, uint64_t sequence) {
  return std::string(id) + "/" + std::string(challenge) + "/" + std::to_string(sequence);
}

inline std::string acknowledge(const Key &key, const std::string &context) {
  std::array<uint8_t, 32> digest{};
  const std::string data = "hearthbeat-ack/" + context;
  if (mbedtls_md_hmac(mbedtls_md_info_from_type(MBEDTLS_MD_SHA256), key.data(), key.size(),
                      reinterpret_cast<const uint8_t *>(data.data()), data.size(), digest.data()) != 0) return {};
  return hex(digest.data(), digest.size());
}
inline bool matches_ack(std::string_view expected, std::string_view actual) {
  if (expected.size() != 64 || actual.size() != expected.size()) return false;
  uint8_t diff = 0;
  for (size_t i = 0; i < expected.size(); ++i) diff |= static_cast<uint8_t>(expected[i] ^ actual[i]);
  return diff == 0;
}

inline std::string seal(const Key &key, const std::string &context, const std::string &plain) {
  constexpr size_t nonce_size = 12, tag_size = 16;
  std::array<uint8_t, nonce_size + tag_size + MAX_PAYLOAD> packet{};
  if (plain.empty() || plain.size() > MAX_PAYLOAD) return {};
  esp_fill_random(packet.data(), nonce_size);
  esp_gcm_context gcm;
  esp_aes_gcm_init(&gcm);
  const bool ok = esp_aes_gcm_setkey(&gcm, MBEDTLS_CIPHER_ID_AES, key.data(), 256) == 0 &&
    esp_aes_gcm_crypt_and_tag(&gcm, MBEDTLS_GCM_ENCRYPT, plain.size(), packet.data(), nonce_size,
      reinterpret_cast<const uint8_t *>(context.data()), context.size(),
      reinterpret_cast<const uint8_t *>(plain.data()), packet.data() + nonce_size + tag_size,
      tag_size, packet.data() + nonce_size) == 0;
  esp_aes_gcm_free(&gcm);
  return ok ? hex(packet.data(), nonce_size + tag_size + plain.size()) : "";
}

inline std::string open(const Key &key, const std::string &context, std::string_view value) {
  constexpr size_t nonce_size = 12, tag_size = 16, overhead = nonce_size + tag_size;
  const size_t count = value.size() / 2;
  if (count <= overhead || count > overhead + MAX_PAYLOAD) return {};
  std::array<uint8_t, overhead + MAX_PAYLOAD> packet{};
  if (!unhex(value, packet.data(), count)) return {};
  std::string plain(count - overhead, '\0');
  esp_gcm_context gcm;
  esp_aes_gcm_init(&gcm);
  const bool ok = esp_aes_gcm_setkey(&gcm, MBEDTLS_CIPHER_ID_AES, key.data(), 256) == 0 &&
    esp_aes_gcm_auth_decrypt(&gcm, plain.size(), packet.data(), nonce_size,
      reinterpret_cast<const uint8_t *>(context.data()), context.size(), packet.data() + nonce_size,
      tag_size, packet.data() + overhead, reinterpret_cast<uint8_t *>(plain.data())) == 0;
  esp_aes_gcm_free(&gcm);
  return ok ? plain : "";
}

struct PeerConfig {
  char id[7]{};
  char name[33]{};
  Key key{};
  bool joined{false};
};
struct PeerState {
  uint64_t sequence{0};
  uint64_t last_seen{0};
  uint64_t invite_until{0};
  std::string status;
  std::string last_event;
};
struct Config {
  Role role{Role::STANDALONE};
  char primary[70]{};
  Key key{};
  std::array<PeerConfig, MAX_ROOMS> peers{};
};
struct Event {
  std::string id;
  std::string text;
};
struct Invitation {
  std::string host;
  Key key;
  uint64_t expires;
};

class Household {
 public:
  void start() {
    self_ = esphome::get_mac_address().substr(6);
    address_ = esphome::App.get_name() + ".local";
    std::array<uint8_t, 12> nonce{};
    esp_fill_random(nonce.data(), nonce.size());
    challenge_ = hex(nonce.data(), nonce.size());
    preference_ = esphome::global_preferences->make_preference<Config>(0x48425431);
    preference_.load(&config_);
  }

  bool is_room() {
    std::lock_guard<std::mutex> guard(mutex_);
    return config_.role == Role::ROOM;
  }

  bool queue(const std::string &message) {
    std::lock_guard<std::mutex> guard(mutex_);
    if (config_.role != Role::ROOM) return false;
    if (outgoing_.size() == MAX_PENDING) {
      ESP_LOGW("household", "Room's notification queue is full");
      return true;
    }
    std::array<uint8_t, 8> id{};
    esp_fill_random(id.data(), id.size());
    outgoing_.push_back({hex(id.data(), id.size()), shorten(message, MAX_PAYLOAD - 17)});
    next_attempt_ = 0;
    return true;
  }

  template<typename Send> void forward_event(Send send) {
    std::lock_guard<std::mutex> guard(mutex_);
    if (config_.role == Role::PRIMARY && bot_ready_ && !incoming_.empty() && send(incoming_.front()))
      incoming_.pop_front();
  }

  void tick(const std::string &status, bool wifi, bool bot_ready) {
    Config config_to_save;
    bool save = false;
    {
      std::lock_guard<std::mutex> guard(mutex_);
      bot_ready_ = bot_ready;
      wifi_ = wifi;
      status_ = shorten(status, 220);
      const auto now = millis64();
      if (invitation_ && now >= invitation_->expires) {
        invitation_.reset();
        join_failed_ = true;
      }
      for (size_t i = 0; i < config_.peers.size(); ++i) {
        auto &peer = config_.peers[i];
        if (peer.id[0] && !peer.joined && now >= states_[i].invite_until) {
          peer = PeerConfig{};
          states_[i] = PeerState{};
        }
      }
      if (dirty_) {
        config_to_save = config_;
        for (auto &peer : config_to_save.peers)
          if (!peer.joined) peer = PeerConfig{};
        dirty_ = false;
        save = true;
      }
      if (wifi && (invitation_ || config_.role == Role::ROOM) && worker_ == nullptr) {
        xTaskCreate(&Household::run_worker, "hb-household", 6144, this, 1, &worker_);
      }
    }
    if (save) {
      preference_.save(&config_to_save);
      esphome::global_preferences->sync();
    }
  }

  std::string append_rooms(std::string own) {
    std::lock_guard<std::mutex> guard(mutex_);
    if (config_.role != Role::PRIMARY) return own;
    for (size_t i = 0; i < config_.peers.size(); ++i) {
      const auto &peer = config_.peers[i];
      const auto &state = states_[i];
      if (!peer.joined) continue;
      own += "\n\n";
      if (recent(state.last_seen) && !state.status.empty()) own += state.status;
      else own += std::string("⚪ ") + peer.name + ": sensor not reached";
    }
    return own;
  }

  void admin(AsyncWebServerRequest *request) {
    std::unique_lock<std::mutex> guard(mutex_);
    if (request->method() == HTTP_GET) {
      const auto data = esphome::json::build_json([&](JsonObject root) {
        root["role"] = invitation_ ? "joining" : config_.role == Role::PRIMARY ? "primary" :
          config_.role == Role::ROOM ? "room" : "standalone";
        root["self"] = self_;
        root["ready"] = bot_ready_;
        root["joinFailed"] = join_failed_;
        root["connected"] = recent(last_ack_);
        auto peers = root["peers"].to<JsonArray>();
        for (size_t i = 0; i < config_.peers.size(); ++i) {
          if (!config_.peers[i].id[0]) continue;
          auto peer = peers.add<JsonObject>();
          peer["id"] = config_.peers[i].id;
          peer["name"] = config_.peers[i].name;
          peer["joined"] = config_.peers[i].joined;
          peer["connected"] = recent(states_[i].last_seen);
        }
      });
      reply(guard, request, 200, "application/json", data.c_str());
      return;
    }

    if (request->get_header("X-Hearthbeat-Setup").value_or("") != "1" ||
        request->get_header("Sec-Fetch-Site").value_or("") == "cross-site") {
      reply(guard, request, 409);
      return;
    }
    const std::string action = request->arg("action");
    if (action == "primary" && config_.role != Role::ROOM && !invitation_) {
      config_.role = Role::PRIMARY;
      join_failed_ = false;
    } else if (action == "cancel_join" && invitation_) {
      invitation_.reset();
      reply(guard, request, 200, "application/json", "{}");
      return;
    } else if (action == "leave") {
      config_ = Config{};
      states_ = {};
      incoming_.clear();
      outgoing_.clear();
      invitation_.reset();
      join_failed_ = false;
      last_ack_ = 0;
      last_report_ = 0;
    } else if (action == "join" && config_.role != Role::PRIMARY) {
      const std::string host = request->arg("host");
      Key key{};
      if (!is_host(host) || host == address_ || request->arg("id") != self_ ||
          !unhex(request->arg("key"), key.data(), key.size())) {
        reply(guard, request, 409);
        return;
      }
      // Keep the current Telegram settings active until the primary proves it has this key.
      invitation_ = Invitation{host, key, millis64() + JOIN_TIMEOUT_MS};
      join_failed_ = false;
      next_attempt_ = 0;
      reply(guard, request, 200, "application/json", "{}");
      return;
    } else if (config_.role == Role::PRIMARY && (action == "remove" || (action == "invite" && bot_ready_))) {
      admin_peer(guard, request, action);
      return;
    } else {
      reply(guard, request, 409);
      return;
    }
    dirty_ = true;
    reply(guard, request, 200, "application/json", "{}");
  }

  void report(AsyncWebServerRequest *request) {
    std::unique_lock<std::mutex> guard(mutex_);
    if (config_.role != Role::PRIMARY || !bot_ready_) { reply(guard, request, 404); return; }
    if (request->method() == HTTP_GET) {
      reply(guard, request, 200, "text/plain", challenge_.c_str());
      return;
    }
    const std::string id = request->arg("id"), seq = request->arg("seq");
    const int index = find_peer(id);
    const auto now = static_cast<uint64_t>(std::time(nullptr));
    if (index < 0 || seq.size() != 13 || seq.find_first_not_of("0123456789") != std::string::npos) {
      reply(guard, request, 409);
      return;
    }
    auto &state = states_[index];
    auto &peer = config_.peers[index];
    const uint64_t sequence = std::strtoull(seq.c_str(), nullptr, 10);
    const auto timestamp = sequence / 1000;
    if (timestamp + 120 < now || timestamp > now + 120 || sequence <= state.sequence ||
        (!peer.joined && millis64() >= state.invite_until)) {
      reply(guard, request, 409);
      return;
    }
    const auto &key = peer.key;
    const auto context = associated(id, challenge_, sequence);
    const std::string payload = open(key, context, request->arg("packet"));
    if (payload.size() >= 2 && payload[0] == 's') {
      state.status = payload.substr(1);
    } else if (payload.size() >= 18 && payload[0] == 'm') {
      const std::string event = payload.substr(1, 16);
      if (event != state.last_event) {
        if (incoming_.size() == MAX_PENDING) { reply(guard, request, 409); return; }
        incoming_.push_back(payload.substr(17));
        state.last_event = event;
      }
    } else {
      reply(guard, request, 409);
      return;
    }
    state.sequence = sequence;
    state.last_seen = millis64();
    if (!peer.joined) {
      peer.joined = true;
      dirty_ = true;
    }
    const auto ack = acknowledge(key, context);
    reply(guard, request, 200, "text/plain", ack.c_str());
  }

 private:
  static void reply(std::unique_lock<std::mutex> &guard, AsyncWebServerRequest *request,
                    int code, const char *type = nullptr, const char *body = nullptr) {
    guard.unlock();
    request->send(code, type, body);
  }

  static bool recent(uint64_t when) { return when && millis64() - when <= EXPIRE_MS; }
  int find_peer(std::string_view id) const {
    if (!is_id(id)) return -1;
    for (size_t i = 0; i < config_.peers.size(); ++i)
      if (id == config_.peers[i].id) return static_cast<int>(i);
    return -1;
  }

  void admin_peer(std::unique_lock<std::mutex> &guard, AsyncWebServerRequest *request, const std::string &action) {
    const std::string id = request->arg("id"), name = request->arg("name");
    if (!is_id(id) || id == self_) { reply(guard, request, 409); return; }
    int index = find_peer(id);
    if (action == "remove") {
      if (index >= 0) {
        config_.peers[index] = PeerConfig{};
        states_[index] = PeerState{};
        dirty_ = true;
      }
      reply(guard, request, 200, "application/json", "{}");
      return;
    }
    if (index < 0) {
      for (size_t i = 0; i < config_.peers.size(); ++i)
        if (!config_.peers[i].id[0]) { index = static_cast<int>(i); break; }
      if (index < 0) { reply(guard, request, 409); return; }
      auto &peer = config_.peers[index];
      std::memcpy(peer.id, id.c_str(), id.size() + 1);
      esp_fill_random(peer.key.data(), peer.key.size());
    }
    auto &peer = config_.peers[index];
    if (!peer.joined) states_[index].invite_until = millis64() + INVITE_MS;
    const auto label = shorten(name.empty() ? id : name, sizeof(peer.name) - 1);
    std::memcpy(peer.name, label.c_str(), label.size() + 1);
    if (peer.joined) dirty_ = true;
    const auto data = esphome::json::build_json([&](JsonObject root) {
      root["host"] = address_;
      root["id"] = peer.id;
      root["key"] = hex(peer.key.data(), peer.key.size());
    });
    guard.unlock();
    auto *response = request->beginResponse(200, "application/json", std::string(data.c_str()));
    response->addHeader("Cache-Control", "no-store");
    request->send(response);
  }

  static esp_err_t collect(esp_http_client_event_t *event) {
    if (event->event_id == HTTP_EVENT_ON_DATA && event->user_data && event->data_len > 0) {
      auto &text = *static_cast<std::string *>(event->user_data);
      if (text.size() + event->data_len <= 128)
        text.append(static_cast<const char *>(event->data), event->data_len);
    }
    return ESP_OK;
  }
  static std::string http(const std::string &url, const std::string &body = "") {
    std::string response;
    esp_http_client_config_t config{};
    config.url = url.c_str();
    config.timeout_ms = 2000;
    config.disable_auto_redirect = true;
    config.event_handler = collect;
    config.user_data = &response;
    config.buffer_size = 512;
    config.buffer_size_tx = 1400;
    auto client = esp_http_client_init(&config);
    if (!client) return {};
    if (!body.empty()) {
      esp_http_client_set_method(client, HTTP_METHOD_POST);
      esp_http_client_set_header(client, "Content-Type", "application/x-www-form-urlencoded");
      esp_http_client_set_post_field(client, body.data(), body.size());
    }
    const bool ok = esp_http_client_perform(client) == ESP_OK && esp_http_client_get_status_code(client) == 200;
    esp_http_client_cleanup(client);
    return ok ? response : "";
  }

  void send_report() {
    std::string host, plain, event_id;
    Key key{};
    bool joining = false;
    {
      std::lock_guard<std::mutex> guard(mutex_);
      const auto now = millis64();
      if (!wifi_ || (!invitation_ && config_.role != Role::ROOM) || now < next_attempt_) return;
      if (invitation_) {
        joining = true;
        host = invitation_->host;
        key = invitation_->key;
        plain = "s" + status_;
      } else {
        host = config_.primary;
        key = config_.key;
        if (now - last_report_ >= CHECK_IN_MS || !last_report_) plain = "s" + status_;
        else if (!outgoing_.empty()) {
          const auto &event = outgoing_.front();
          event_id = event.id;
          plain = "m" + event.id + event.text;
        } else return;
      }
      next_attempt_ = now + 3000;
    }
    const uint64_t timestamp = std::time(nullptr);
    if (timestamp < 1700000000) return;
    const std::string url = "http://" + host;
    const std::string challenge = http(url + CHALLENGE_PATH);
    std::array<uint8_t, 12> decoded{};
    if (!unhex(challenge, decoded.data(), decoded.size())) return;
    sequence_ = std::max(sequence_ + 1, timestamp * 1000 + millis64() % 1000);
    const auto context = associated(self_, challenge, sequence_);
    const auto packet = seal(key, context, plain);
    if (packet.empty()) return;
    const auto body = "id=" + self_ + "&seq=" + std::to_string(sequence_) + "&packet=" + packet;
    if (!matches_ack(acknowledge(key, context), http(url + REPORT_PATH, body))) return;

    std::lock_guard<std::mutex> guard(mutex_);
    if (joining) {
      if (!invitation_ || host != invitation_->host || key != invitation_->key) return;
      if (key != config_.key || host != config_.primary) outgoing_.clear();
      config_ = Config{};
      config_.role = Role::ROOM;
      config_.key = key;
      std::memcpy(config_.primary, host.c_str(), host.size() + 1);
      invitation_.reset();
      dirty_ = true;
    }
    if (config_.role != Role::ROOM || key != config_.key || host != config_.primary) return;
    last_ack_ = millis64();
    if (event_id.empty()) last_report_ = last_ack_;
    else if (!outgoing_.empty() && outgoing_.front().id == event_id) outgoing_.pop_front();
    next_attempt_ = last_ack_ + 500;
  }

  static void run_worker(void *context) {
    auto &home = *static_cast<Household *>(context);
    for (;;) {
      home.send_report();
      vTaskDelay(pdMS_TO_TICKS(500));
    }
  }

  std::mutex mutex_;
  Config config_{};
  std::array<PeerState, MAX_ROOMS> states_{};
  std::optional<Invitation> invitation_;
  esphome::ESPPreferenceObject preference_;
  std::deque<Event> outgoing_;
  std::deque<std::string> incoming_;
  std::string self_, address_, challenge_, status_;
  TaskHandle_t worker_{nullptr};
  uint64_t last_ack_{0}, last_report_{0}, next_attempt_{0};
  uint64_t sequence_{0};  // accessed only by the network worker
  bool wifi_{false}, bot_ready_{false}, dirty_{false}, join_failed_{false};
};

inline Household home;

class AdminHandler final : public AsyncWebHandler {
 public:
  bool canHandle(AsyncWebServerRequest *request) const override {
    char url[AsyncWebServerRequest::URL_BUF_SIZE];
    return (request->method() == HTTP_GET || request->method() == HTTP_POST) &&
           request->url_to(url) == ADMIN_PATH;
  }
  void handleRequest(AsyncWebServerRequest *request) override { home.admin(request); }
};

class ReportHandler final : public AsyncWebHandler {
 public:
  bool canHandle(AsyncWebServerRequest *request) const override {
    char url[AsyncWebServerRequest::URL_BUF_SIZE];
    const auto path = request->url_to(url);
    return (request->method() == HTTP_GET && path == CHALLENGE_PATH) ||
           (request->method() == HTTP_POST && path == REPORT_PATH);
  }
  void handleRequest(AsyncWebServerRequest *request) override { home.report(request); }
};

inline void setup() {
  home.start();
  static AdminHandler admin;
  static ReportHandler reports;
  auto *server = esphome::web_server_base::global_web_server_base;
  server->add_handler(&admin);
  // The report handler authenticates and decrypts each frame using the paired room's key.
  server->add_handler_without_auth(&reports);
  mdns_service_txt_item_set("_hearthbeat", "_tcp", "household", "1");
}

}  // namespace hearthbeat::household
