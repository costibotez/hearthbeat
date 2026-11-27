// Outgoing HTTPS for Hearthbeat (Telegram, and cloud reports when hearthbeat-cloud.yaml is used),
// done in a background task so the main loop never waits on the network.
//
// The main loop queues requests with hb_tg::send() / hb_tg::poll(); a FreeRTOS task performs them over one
// kept-alive HTTPS connection (one TLS handshake instead of one per request) and hands poll responses back
// through hb_tg::take_result(), which the main loop reads.
#pragma once
#include <deque>
#include <string>

#include "esp_crt_bundle.h"
#include "esp_http_client.h"
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include "freertos/semphr.h"
#include "freertos/task.h"

namespace hb_tg {

struct Job {
  std::string url;
  std::string body;  // JSON body for POST; empty for GET
  bool is_poll;
  std::string bearer = "";  // optional "Authorization: Bearer ..." value
};

static SemaphoreHandle_t lock_ = nullptr;
static std::deque<Job> jobs_;
static std::deque<std::string> results_;
static bool poll_pending_ = false;
static constexpr size_t MAX_JOBS = 8;
static constexpr size_t MAX_RESPONSE = 8192;

static esp_err_t on_event_(esp_http_client_event_t *e) {
  if (e->event_id == HTTP_EVENT_ON_DATA && e->user_data != nullptr) {
    auto *out = static_cast<std::string *>(e->user_data);
    if (out->size() + e->data_len <= MAX_RESPONSE) out->append(static_cast<const char *>(e->data), e->data_len);
  }
  return ESP_OK;
}

static void worker_(void *) {
  esp_http_client_handle_t client = nullptr;
  std::string response;
  for (;;) {
    Job job;
    bool have = false;
    xSemaphoreTake(lock_, portMAX_DELAY);
    if (!jobs_.empty()) {
      job = std::move(jobs_.front());
      jobs_.pop_front();
      have = true;
    }
    xSemaphoreGive(lock_);
    if (!have) {
      vTaskDelay(pdMS_TO_TICKS(100));
      continue;
    }

    if (client == nullptr) {
      esp_http_client_config_t cfg = {};
      cfg.url = job.url.c_str();
      cfg.event_handler = on_event_;
      cfg.user_data = &response;
      cfg.crt_bundle_attach = esp_crt_bundle_attach;
      cfg.timeout_ms = 10000;
      cfg.keep_alive_enable = true;
      cfg.buffer_size = 2048;
      cfg.buffer_size_tx = 1536;
      client = esp_http_client_init(&cfg);
      if (client == nullptr) {
        ESP_LOGW("telegram", "could not create HTTPS client");
        vTaskDelay(pdMS_TO_TICKS(5000));
        continue;
      }
    }

    response.clear();
    esp_http_client_set_url(client, job.url.c_str());
    if (job.body.empty()) {
      esp_http_client_set_method(client, HTTP_METHOD_GET);
      esp_http_client_set_post_field(client, nullptr, 0);
    } else {
      esp_http_client_set_method(client, HTTP_METHOD_POST);
      esp_http_client_set_header(client, "Content-Type", "application/json");
      esp_http_client_set_post_field(client, job.body.c_str(), job.body.size());
    }
    if (!job.bearer.empty()) {
      esp_http_client_set_header(client, "Authorization", ("Bearer " + job.bearer).c_str());
    } else {
      esp_http_client_delete_header(client, "Authorization");
    }
    esp_err_t err = esp_http_client_perform(client);
    int status = err == ESP_OK ? esp_http_client_get_status_code(client) : 0;

    if (err != ESP_OK) {
      // Connection broken (Wi-Fi drop, server closed it): start fresh next time
      esp_http_client_cleanup(client);
      client = nullptr;
    }
    if (err != ESP_OK || status != 200) {
      if (!job.bearer.empty())
        ESP_LOGW("cloud", "report failed (%s, HTTP %d) - check cloud_url and the device key", esp_err_to_name(err), status);
      else if (!job.is_poll || err != ESP_OK)
        ESP_LOGW("telegram", "%s failed (%s, HTTP %d) - check the bot token, chat ID and internet",
                 job.is_poll ? "checking for messages" : "sending a message", esp_err_to_name(err), status);
    }

    xSemaphoreTake(lock_, portMAX_DELAY);
    if (job.is_poll) {
      poll_pending_ = false;
      if (err == ESP_OK && status == 200) results_.push_back(response);
    }
    xSemaphoreGive(lock_);
  }
}

inline void start_() {
  if (lock_ != nullptr) return;
  lock_ = xSemaphoreCreateMutex();
  // Low priority; TLS needs a roomy stack
  xTaskCreate(worker_, "telegram", 10240, nullptr, 1, nullptr);
}

inline void enqueue_(Job job) {
  start_();
  xSemaphoreTake(lock_, portMAX_DELAY);
  if (jobs_.size() < MAX_JOBS) {
    if (job.is_poll) poll_pending_ = true;
    jobs_.push_back(std::move(job));
  }
  xSemaphoreGive(lock_);
}

// Queue a POST with a JSON body (sendMessage, setMyCommands, ...)
inline void send(const std::string &url, const std::string &json_body) { enqueue_({url, json_body, false}); }

// Queue a JSON POST with a bearer token (cloud reports); skipped if the queue is busy
inline void post_with_key(const std::string &url, const std::string &json_body, const std::string &bearer) {
  enqueue_({url, json_body, false, bearer});
}

// Queue a getUpdates request, unless one is already waiting
inline void poll(const std::string &url) {
  start_();
  xSemaphoreTake(lock_, portMAX_DELAY);
  bool busy = poll_pending_;
  xSemaphoreGive(lock_);
  if (!busy) enqueue_({url, "", true});
}

// Take the next getUpdates response, if one has arrived
inline bool take_result(std::string &out) {
  if (lock_ == nullptr) return false;
  xSemaphoreTake(lock_, portMAX_DELAY);
  bool have = !results_.empty();
  if (have) {
    out = std::move(results_.front());
    results_.pop_front();
  }
  xSemaphoreGive(lock_);
  return have;
}

}  // namespace hb_tg
