// Time zones offered in the ready-made build: tz database name -> POSIX rule for the clock.
// Generated together with the option list in hearthbeat-generic.yaml; keep them in sync.
#pragma once
#include <cstring>
#include <string>

inline const char *hb_posix_tz(const std::string &name) {
  static const char *const table[][2] = {
      {"UTC", "UTC0"},
      {"Europe/London", "GMT0BST,M3.5.0/1,M10.5.0"},
      {"Europe/Dublin", "IST-1GMT0,M10.5.0,M3.5.0/1"},
      {"Europe/Lisbon", "WET0WEST,M3.5.0/1,M10.5.0"},
      {"Europe/Paris", "CET-1CEST,M3.5.0,M10.5.0/3"},
      {"Europe/Berlin", "CET-1CEST,M3.5.0,M10.5.0/3"},
      {"Europe/Madrid", "CET-1CEST,M3.5.0,M10.5.0/3"},
      {"Europe/Rome", "CET-1CEST,M3.5.0,M10.5.0/3"},
      {"Europe/Amsterdam", "CET-1CEST,M3.5.0,M10.5.0/3"},
      {"Europe/Warsaw", "CET-1CEST,M3.5.0,M10.5.0/3"},
      {"Europe/Bucharest", "EET-2EEST,M3.5.0/3,M10.5.0/4"},
      {"Europe/Athens", "EET-2EEST,M3.5.0/3,M10.5.0/4"},
      {"Europe/Kyiv", "EET-2EEST,M3.5.0/3,M10.5.0/4"},
      {"Europe/Chisinau", "EET-2EEST,M3.5.0,M10.5.0/3"},
      {"Europe/Istanbul", "<+03>-3"},
      {"Europe/Moscow", "MSK-3"},
      {"Asia/Dubai", "<+04>-4"},
      {"Asia/Karachi", "PKT-5"},
      {"Asia/Kolkata", "IST-5:30"},
      {"Asia/Dhaka", "<+06>-6"},
      {"Asia/Bangkok", "<+07>-7"},
      {"Asia/Ho_Chi_Minh", "<+07>-7"},
      {"Asia/Jakarta", "WIB-7"},
      {"Asia/Singapore", "<+08>-8"},
      {"Asia/Kuala_Lumpur", "<+08>-8"},
      {"Asia/Manila", "PST-8"},
      {"Asia/Shanghai", "CST-8"},
      {"Asia/Hong_Kong", "HKT-8"},
      {"Asia/Taipei", "CST-8"},
      {"Asia/Seoul", "KST-9"},
      {"Asia/Tokyo", "JST-9"},
      {"Australia/Perth", "AWST-8"},
      {"Australia/Sydney", "AEST-10AEDT,M10.1.0,M4.1.0/3"},
      {"Pacific/Auckland", "NZST-12NZDT,M9.5.0,M4.1.0/3"},
      {"Africa/Lagos", "WAT-1"},
      {"Africa/Cairo", "EET-2EEST,M4.5.5/0,M10.5.4/24"},
      {"Africa/Johannesburg", "SAST-2"},
      {"Africa/Nairobi", "EAT-3"},
      {"America/New_York", "EST5EDT,M3.2.0,M11.1.0"},
      {"America/Chicago", "CST6CDT,M3.2.0,M11.1.0"},
      {"America/Denver", "MST7MDT,M3.2.0,M11.1.0"},
      {"America/Phoenix", "MST7"},
      {"America/Los_Angeles", "PST8PDT,M3.2.0,M11.1.0"},
      {"America/Toronto", "EST5EDT,M3.2.0,M11.1.0"},
      {"America/Mexico_City", "CST6"},
      {"America/Bogota", "<-05>5"},
      {"America/Sao_Paulo", "<-03>3"},
      {"America/Argentina/Buenos_Aires", "<-03>3"},
  };
  for (const auto &row : table)
    if (name == row[0]) return row[1];
  return "UTC0";
}
