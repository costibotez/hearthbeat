// Small helpers for Hearthbeat's Telegram messages.
#pragma once
#include <cmath>
#include <cstdio>
#include <string>
#include <utility>
#include <vector>

// Replace {placeholders} in a message template and turn a typed "\n" into a line break.
inline std::string hb_fill(std::string text, const std::vector<std::pair<std::string, std::string>> &vars) {
  for (const auto &kv : vars) {
    const std::string key = "{" + kv.first + "}";
    size_t pos = 0;
    while ((pos = text.find(key, pos)) != std::string::npos) {
      text.replace(pos, key.size(), kv.second);
      pos += kv.second.size();
    }
  }
  size_t pos = 0;
  while ((pos = text.find("\\n", pos)) != std::string::npos) {
    text.replace(pos, 2, "\n");
    pos += 1;
  }
  return text;
}

// A whole number, or a dash when there is no reading.
inline std::string hb_num(float x) {
  if (std::isnan(x)) return "–";
  char buf[16];
  snprintf(buf, sizeof(buf), "%.0f", x);
  return buf;
}
