#pragma once

#include <cstring>
#include <mdns.h>

#include "esphome/components/json/json_util.h"
#include "esphome/components/web_server_base/web_server_base.h"
#include "esphome/core/application.h"

namespace hearthbeat {

class DiscoveryHandler final : public AsyncWebHandler {
 public:
  bool canHandle(AsyncWebServerRequest *request) const override {
    if (request->method() != HTTP_GET && request->method() != HTTP_POST)
      return false;
    char url[AsyncWebServerRequest::URL_BUF_SIZE];
    return request->url_to(url) == "/hearthbeat/sensors";
  }

  void handleRequest(AsyncWebServerRequest *request) override {
    collect_results();
    if (request->method() == HTTP_POST && search_ == nullptr) {
      search_ = mdns_query_async_new(nullptr, "_hearthbeat", "_tcp", MDNS_TYPE_PTR, 2400, 16, nullptr);
      if (search_ == nullptr) {
        request->send(500);
        return;
      }
    }
    if (search_ != nullptr) {
      request->send(200, "application/json", R"({"scanning":true})");
      return;
    }
    request->send(200, "application/json", results_.c_str());
  }

 private:
  static const char *txt_value(const mdns_result_t &service, const char *key) {
    for (size_t i = 0; i < service.txt_count; ++i) {
      const auto &item = service.txt[i];
      if (item.key != nullptr && item.value != nullptr && std::strcmp(item.key, key) == 0)
        return item.value;
    }
    return "";
  }

  // ESP-IDF handles both requests on its HTTP server task. Poll the mDNS task
  // without blocking requests to the live dashboard.
  void collect_results() {
    mdns_result_t *results = nullptr;
    if (search_ == nullptr || !mdns_query_async_get_results(search_, 0, &results, nullptr))
      return;

    const auto data = esphome::json::build_json([&](JsonObject root) {
      root["self"] = esphome::App.get_name() + ".local";
      auto sensors = root["sensors"].to<JsonArray>();
      for (const auto *service = results; service != nullptr; service = service->next) {
        const char *id = txt_value(*service, "id");
        if (service->hostname == nullptr || service->port != 80 ||
            esphome::App.get_name() == service->hostname || std::strlen(id) != 6)
          continue;

        auto sensor = sensors.add<JsonObject>();
        sensor["host"] = std::string(service->hostname) + ".local";
        sensor["id"] = id;
        sensor["version"] = txt_value(*service, "version");
        sensor["update"] = txt_value(*service, "update");
        sensor["household"] = std::strcmp(txt_value(*service, "household"), "1") == 0;
        for (const auto *address = service->addr; address != nullptr; address = address->next) {
          if (address->addr.type == ESP_IPADDR_TYPE_V4) {
            char ip[16];
            std::snprintf(ip, sizeof(ip), IPSTR, IP2STR(&address->addr.u_addr.ip4));
            sensor["ip"] = std::string(ip);
            break;
          }
        }
      }
    });
    results_ = data.c_str();
    mdns_query_results_free(results);
    mdns_query_async_delete(search_);
    search_ = nullptr;
  }

  mdns_search_once_t *search_{nullptr};
  std::string results_{R"({"sensors":[]})"};
};

}  // namespace hearthbeat
