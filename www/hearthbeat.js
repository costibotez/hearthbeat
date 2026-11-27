// Hearthbeat dashboard: a friendly overview built from the sensor's live event stream.
// The classic ESPHome page (thresholds, LED, buttons) stays available under "Settings".
// The firmware reports its texts in English; they are translated here for display.

const LOGO = `<svg viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="9" fill="currentColor"/>
  <path d="M16 24.5s-5.2-3.2-6.9-6.4c-1.2-2.3.1-5.1 2.8-5.1 1.6 0 2.6.9 4.1 2.5 1.5-1.6 2.5-2.5 4.1-2.5 2.7 0 4 2.8 2.8 5.1-1.7 3.2-6.9 6.4-6.9 6.4z" fill="#fff"/>
  <path d="M10.2 9.6a9 9 0 0 1 11.6 0M7 6.4a13.5 13.5 0 0 1 18 0" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".75"/></svg>`;
const HEART = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-10-9.2C.3 8.5 2.2 4.5 6 4.5c2.2 0 3.6 1.2 6 3.6 2.4-2.4 3.8-3.6 6-3.6 3.8 0 5.7 4 4 7.3C19.5 16.4 12 21 12 21z"/></svg>`;
const ICONS = {
  calm: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`,
  warn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 7v6"/><circle cx="12" cy="17" r=".6" fill="currentColor"/></svg>`,
  alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 6v8"/><circle cx="12" cy="18" r=".6" fill="currentColor"/></svg>`,
  idle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5"/></svg>`,
};

// ---------------------------------------------------------------------------
// Translations
// ---------------------------------------------------------------------------
const LANGS = [
  ["ro", "🇷🇴", "Română"], ["en", "🇬🇧", "English"], ["zh", "🇨🇳", "中文"], ["hi", "🇮🇳", "हिन्दी"],
  ["es", "🇪🇸", "Español"], ["fr", "🇫🇷", "Français"], ["pt", "🇵🇹", "Português"],
  ["ru", "🇷🇺", "Русский"], ["de", "🇩🇪", "Deutsch"],
];

const T = {
  en: {
    st_moving: "Present, moving", movingHint: "Alerts pause while moving",
    tag: "Peace of mind for the people you love", connecting: "Connecting…", live: "Live", reconnecting: "Reconnecting…",
    settings: "Settings", back: "← Back to overview", now: "Now", loading: "Loading…",
    pulse: "Heart rate", breathing: "Breathing", avg: "1-minute average", avgNow: "1-minute average · now {v}",
    todayMin: "Today min", max: "max", sleep: "Sleep", bedtime: "Bedtime", wakeup: "Woke up", inBed: "Time in bed",
    wakings: "Night wakings", room: "Room", distance: "Distance from sensor", people: "People", light: "Light",
    moment: "Time of day", asleep: "asleep", seenNow: "Person detected now", lastSeen: "Last seen: {x}",
    never: "not seen since start", unknown: "unknown", minAgo: "{m} min ago", hAgo: "{h} h {m} min ago",
    st_empty: "Nobody in the room", st_visitor: "Visitor present, readings uncertain",
    st_far: "Present, too far for vital signs", st_rest: "In bed, resting", st_measuring: "Present, measuring…",
    st_calm: "Present, calm", alert: "Attention: {r}",
    r_radar: "the radar is not responding", r_fastbr: "fast breathing", r_slowbr: "slow breathing",
    r_highhr: "high heart rate", r_lowhr: "low heart rate", r_absent: "nobody seen for too long",
    d_day: "Day", d_evening: "Evening", d_night: "Night", d_sleep: "Probably asleep",
    radarOk: "Radar OK", radarBad: "Radar not responding", quality: "Data quality (1 h): {x}",
    wifi: "Wi-Fi: {x}", w1: "excellent", w2: "good", w3: "weak", w4: "very weak", up: "Running for {x}",
    note: "Values are estimated by a radar and do not replace a medical device.", lang: "Language",
  },
  ro: {
    st_moving: "Prezent, în mișcare", movingHint: "Alertele sunt în pauză cât se mișcă",
    tag: "Liniște sufletească pentru cei dragi", connecting: "Conectare…", live: "Live", reconnecting: "Reconectare…",
    settings: "Setări", back: "← Înapoi la rezumat", now: "Acum", loading: "Se încarcă…",
    pulse: "Puls", breathing: "Respirație", avg: "media pe 1 minut", avgNow: "media pe 1 minut · acum {v}",
    todayMin: "Azi minim", max: "maxim", sleep: "Somn", bedtime: "Culcare", wakeup: "Trezire", inBed: "Ore în pat",
    wakings: "Treziri noaptea", room: "Cameră", distance: "Distanță de senzor", people: "Persoane", light: "Lumină",
    moment: "Moment", asleep: "doarme", seenNow: "Persoană detectată acum", lastSeen: "Ultima dată văzut: {x}",
    never: "nevăzut de la pornire", unknown: "necunoscut", minAgo: "acum {m} min", hAgo: "acum {h} h {m} min",
    st_empty: "Nimeni în cameră", st_visitor: "Vizitator prezent, valori nesigure",
    st_far: "Prezent, prea departe pentru semne vitale", st_rest: "În pat, se odihnește", st_measuring: "Prezent, se măsoară…",
    st_calm: "Prezent, liniștit", alert: "Atenție: {r}",
    r_radar: "radarul nu răspunde", r_fastbr: "respirație rapidă", r_slowbr: "respirație lentă",
    r_highhr: "puls mare", r_lowhr: "puls mic", r_absent: "nimeni văzut de prea mult timp",
    d_day: "Zi", d_evening: "Seară", d_night: "Noapte", d_sleep: "Somn probabil",
    radarOk: "Radar OK", radarBad: "Radarul nu răspunde", quality: "Calitate date (1 h): {x}",
    wifi: "WiFi: {x}", w1: "excelent", w2: "bun", w3: "slab", w4: "foarte slab", up: "Pornit de {x}",
    note: "Valorile sunt estimate de un radar și nu înlocuiesc un dispozitiv medical.", lang: "Limbă",
  },
  zh: {
    st_moving: "有人，正在活动", movingHint: "活动时暂停警报",
    tag: "为您所爱的人带来安心", connecting: "连接中…", live: "实时", reconnecting: "重新连接中…",
    settings: "设置", back: "← 返回概览", now: "当前", loading: "加载中…",
    pulse: "心率", breathing: "呼吸", avg: "1 分钟平均值", avgNow: "1 分钟平均值 · 当前 {v}",
    todayMin: "今日最低", max: "最高", sleep: "睡眠", bedtime: "就寝", wakeup: "起床", inBed: "卧床时间",
    wakings: "夜间醒来", room: "房间", distance: "与传感器距离", people: "人数", light: "光照",
    moment: "时段", asleep: "睡眠中", seenNow: "当前检测到有人", lastSeen: "最后一次检测到：{x}",
    never: "启动后未检测到", unknown: "未知", minAgo: "{m} 分钟前", hAgo: "{h} 小时 {m} 分钟前",
    st_empty: "房间内无人", st_visitor: "有访客，读数可能不准", st_far: "有人，但距离太远无法测量生命体征",
    st_rest: "在床上休息", st_measuring: "有人，测量中…", st_calm: "有人，状态平稳", alert: "注意：{r}",
    r_radar: "雷达无响应", r_fastbr: "呼吸过快", r_slowbr: "呼吸过慢", r_highhr: "心率过高", r_lowhr: "心率过低",
    r_absent: "长时间未检测到人", d_day: "白天", d_evening: "傍晚", d_night: "夜间", d_sleep: "可能在睡觉",
    radarOk: "雷达正常", radarBad: "雷达无响应", quality: "数据质量（1 小时）：{x}",
    wifi: "Wi-Fi：{x}", w1: "极好", w2: "良好", w3: "较弱", w4: "很弱", up: "已运行 {x}",
    note: "数值由雷达估算，不能替代医疗设备。", lang: "语言",
  },
  hi: {
    st_moving: "मौजूद, चल-फिर रहे हैं", movingHint: "चलते-फिरते समय अलर्ट रुके रहते हैं",
    tag: "अपनों के लिए सुकून", connecting: "कनेक्ट हो रहा है…", live: "लाइव", reconnecting: "फिर से कनेक्ट हो रहा है…",
    settings: "सेटिंग्स", back: "← सारांश पर वापस", now: "अभी", loading: "लोड हो रहा है…",
    pulse: "हृदय गति", breathing: "साँस", avg: "1 मिनट का औसत", avgNow: "1 मिनट का औसत · अभी {v}",
    todayMin: "आज न्यूनतम", max: "अधिकतम", sleep: "नींद", bedtime: "सोने का समय", wakeup: "जागने का समय", inBed: "बिस्तर में समय",
    wakings: "रात में जागना", room: "कमरा", distance: "सेंसर से दूरी", people: "लोग", light: "रोशनी",
    moment: "दिन का समय", asleep: "सो रहे हैं", seenNow: "अभी व्यक्ति मौजूद है", lastSeen: "आख़िरी बार देखा गया: {x}",
    never: "शुरू होने के बाद से नहीं देखा गया", unknown: "अज्ञात", minAgo: "{m} मिनट पहले", hAgo: "{h} घंटे {m} मिनट पहले",
    st_empty: "कमरे में कोई नहीं", st_visitor: "मेहमान मौजूद, माप अनिश्चित", st_far: "मौजूद, पर वाइटल साइन के लिए बहुत दूर",
    st_rest: "बिस्तर में आराम कर रहे हैं", st_measuring: "मौजूद, माप हो रहा है…", st_calm: "मौजूद, शांत", alert: "ध्यान दें: {r}",
    r_radar: "रडार जवाब नहीं दे रहा", r_fastbr: "तेज़ साँस", r_slowbr: "धीमी साँस", r_highhr: "हृदय गति ज़्यादा",
    r_lowhr: "हृदय गति कम", r_absent: "बहुत देर से कोई नहीं दिखा", d_day: "दिन", d_evening: "शाम", d_night: "रात",
    d_sleep: "शायद सो रहे हैं", radarOk: "रडार ठीक", radarBad: "रडार जवाब नहीं दे रहा", quality: "डेटा गुणवत्ता (1 घंटा): {x}",
    wifi: "वाई-फ़ाई: {x}", w1: "उत्कृष्ट", w2: "अच्छा", w3: "कमज़ोर", w4: "बहुत कमज़ोर", up: "{x} से चालू",
    note: "ये मान रडार द्वारा अनुमानित हैं और किसी चिकित्सा उपकरण का विकल्प नहीं हैं।", lang: "भाषा",
  },
  es: {
    st_moving: "Presente, en movimiento", movingHint: "Las alertas se pausan mientras se mueve",
    tag: "Tranquilidad para quienes más quieres", connecting: "Conectando…", live: "En vivo", reconnecting: "Reconectando…",
    settings: "Ajustes", back: "← Volver al resumen", now: "Ahora", loading: "Cargando…",
    pulse: "Pulso", breathing: "Respiración", avg: "media de 1 minuto", avgNow: "media de 1 minuto · ahora {v}",
    todayMin: "Hoy mín.", max: "máx.", sleep: "Sueño", bedtime: "Acostarse", wakeup: "Despertar", inBed: "Tiempo en cama",
    wakings: "Despertares nocturnos", room: "Habitación", distance: "Distancia al sensor", people: "Personas", light: "Luz",
    moment: "Momento", asleep: "durmiendo", seenNow: "Persona detectada ahora", lastSeen: "Visto por última vez: {x}",
    never: "no visto desde el inicio", unknown: "desconocido", minAgo: "hace {m} min", hAgo: "hace {h} h {m} min",
    st_empty: "Nadie en la habitación", st_visitor: "Visita presente, lecturas inciertas",
    st_far: "Presente, demasiado lejos para los signos vitales", st_rest: "En la cama, descansando",
    st_measuring: "Presente, midiendo…", st_calm: "Presente, tranquilo", alert: "Atención: {r}",
    r_radar: "el radar no responde", r_fastbr: "respiración rápida", r_slowbr: "respiración lenta",
    r_highhr: "pulso alto", r_lowhr: "pulso bajo", r_absent: "nadie visto durante demasiado tiempo",
    d_day: "Día", d_evening: "Tarde", d_night: "Noche", d_sleep: "Probablemente durmiendo",
    radarOk: "Radar OK", radarBad: "El radar no responde", quality: "Calidad de datos (1 h): {x}",
    wifi: "Wi-Fi: {x}", w1: "excelente", w2: "buena", w3: "débil", w4: "muy débil", up: "Encendido hace {x}",
    note: "Los valores son estimados por un radar y no sustituyen a un dispositivo médico.", lang: "Idioma",
  },
  fr: {
    st_moving: "Présent, en mouvement", movingHint: "Alertes en pause pendant le mouvement",
    tag: "La sérénité pour ceux que vous aimez", connecting: "Connexion…", live: "En direct", reconnecting: "Reconnexion…",
    settings: "Réglages", back: "← Retour au résumé", now: "Maintenant", loading: "Chargement…",
    pulse: "Pouls", breathing: "Respiration", avg: "moyenne sur 1 minute", avgNow: "moyenne sur 1 minute · actuel {v}",
    todayMin: "Auj. min", max: "max", sleep: "Sommeil", bedtime: "Coucher", wakeup: "Réveil", inBed: "Temps au lit",
    wakings: "Réveils nocturnes", room: "Pièce", distance: "Distance au capteur", people: "Personnes", light: "Lumière",
    moment: "Moment", asleep: "endormi", seenNow: "Personne détectée maintenant", lastSeen: "Vu pour la dernière fois : {x}",
    never: "pas vu depuis le démarrage", unknown: "inconnu", minAgo: "il y a {m} min", hAgo: "il y a {h} h {m} min",
    st_empty: "Personne dans la pièce", st_visitor: "Visiteur présent, mesures incertaines",
    st_far: "Présent, trop loin pour les signes vitaux", st_rest: "Au lit, se repose", st_measuring: "Présent, mesure en cours…",
    st_calm: "Présent, calme", alert: "Attention : {r}",
    r_radar: "le radar ne répond pas", r_fastbr: "respiration rapide", r_slowbr: "respiration lente",
    r_highhr: "pouls élevé", r_lowhr: "pouls bas", r_absent: "personne vu depuis trop longtemps",
    d_day: "Jour", d_evening: "Soir", d_night: "Nuit", d_sleep: "Probablement endormi",
    radarOk: "Radar OK", radarBad: "Le radar ne répond pas", quality: "Qualité des données (1 h) : {x}",
    wifi: "Wi-Fi : {x}", w1: "excellent", w2: "bon", w3: "faible", w4: "très faible", up: "Allumé depuis {x}",
    note: "Les valeurs sont estimées par un radar et ne remplacent pas un dispositif médical.", lang: "Langue",
  },
  pt: {
    st_moving: "Presente, em movimento", movingHint: "Alertas pausados enquanto se move",
    tag: "Tranquilidade para quem você ama", connecting: "Conectando…", live: "Ao vivo", reconnecting: "Reconectando…",
    settings: "Configurações", back: "← Voltar ao resumo", now: "Agora", loading: "Carregando…",
    pulse: "Pulso", breathing: "Respiração", avg: "média de 1 minuto", avgNow: "média de 1 minuto · agora {v}",
    todayMin: "Hoje mín.", max: "máx.", sleep: "Sono", bedtime: "Deitou-se", wakeup: "Acordou", inBed: "Tempo na cama",
    wakings: "Despertares noturnos", room: "Quarto", distance: "Distância do sensor", people: "Pessoas", light: "Luz",
    moment: "Período", asleep: "dormindo", seenNow: "Pessoa detectada agora", lastSeen: "Visto pela última vez: {x}",
    never: "não visto desde o início", unknown: "desconhecido", minAgo: "há {m} min", hAgo: "há {h} h {m} min",
    st_empty: "Ninguém no quarto", st_visitor: "Visita presente, leituras incertas",
    st_far: "Presente, longe demais para sinais vitais", st_rest: "Na cama, descansando", st_measuring: "Presente, medindo…",
    st_calm: "Presente, tranquilo", alert: "Atenção: {r}",
    r_radar: "o radar não responde", r_fastbr: "respiração rápida", r_slowbr: "respiração lenta",
    r_highhr: "pulso alto", r_lowhr: "pulso baixo", r_absent: "ninguém visto há muito tempo",
    d_day: "Dia", d_evening: "Noite", d_night: "Madrugada", d_sleep: "Provavelmente dormindo",
    radarOk: "Radar OK", radarBad: "O radar não responde", quality: "Qualidade dos dados (1 h): {x}",
    wifi: "Wi-Fi: {x}", w1: "excelente", w2: "bom", w3: "fraco", w4: "muito fraco", up: "Ligado há {x}",
    note: "Os valores são estimados por um radar e não substituem um dispositivo médico.", lang: "Idioma",
  },
  ru: {
    st_moving: "Человек рядом, двигается", movingHint: "Оповещения приостановлены во время движения",
    tag: "Спокойствие за тех, кого вы любите", connecting: "Подключение…", live: "В эфире", reconnecting: "Переподключение…",
    settings: "Настройки", back: "← Назад к обзору", now: "Сейчас", loading: "Загрузка…",
    pulse: "Пульс", breathing: "Дыхание", avg: "среднее за 1 минуту", avgNow: "среднее за 1 минуту · сейчас {v}",
    todayMin: "Сегодня мин.", max: "макс.", sleep: "Сон", bedtime: "Отход ко сну", wakeup: "Подъём", inBed: "Время в постели",
    wakings: "Ночные пробуждения", room: "Комната", distance: "Расстояние до датчика", people: "Люди", light: "Освещённость",
    moment: "Время суток", asleep: "спит", seenNow: "Человек обнаружен сейчас", lastSeen: "Последний раз замечен: {x}",
    never: "не замечен с момента запуска", unknown: "неизвестно", minAgo: "{m} мин назад", hAgo: "{h} ч {m} мин назад",
    st_empty: "В комнате никого", st_visitor: "Есть гость, показания неточны",
    st_far: "Человек слишком далеко для измерения", st_rest: "В постели, отдыхает", st_measuring: "Человек рядом, идёт измерение…",
    st_calm: "Человек рядом, всё спокойно", alert: "Внимание: {r}",
    r_radar: "радар не отвечает", r_fastbr: "учащённое дыхание", r_slowbr: "замедленное дыхание",
    r_highhr: "высокий пульс", r_lowhr: "низкий пульс", r_absent: "никого не видно слишком долго",
    d_day: "День", d_evening: "Вечер", d_night: "Ночь", d_sleep: "Вероятно, спит",
    radarOk: "Радар в норме", radarBad: "Радар не отвечает", quality: "Качество данных (1 ч): {x}",
    wifi: "Wi-Fi: {x}", w1: "отличный", w2: "хороший", w3: "слабый", w4: "очень слабый", up: "Работает {x}",
    note: "Значения оцениваются радаром и не заменяют медицинский прибор.", lang: "Язык",
  },
  de: {
    st_moving: "Anwesend, in Bewegung", movingHint: "Warnungen pausieren bei Bewegung",
    tag: "Gelassenheit für Ihre Liebsten", connecting: "Verbinde…", live: "Live", reconnecting: "Verbinde erneut…",
    settings: "Einstellungen", back: "← Zurück zur Übersicht", now: "Jetzt", loading: "Lädt…",
    pulse: "Puls", breathing: "Atmung", avg: "1-Minuten-Mittel", avgNow: "1-Minuten-Mittel · jetzt {v}",
    todayMin: "Heute min.", max: "max.", sleep: "Schlaf", bedtime: "Zu Bett", wakeup: "Aufgewacht", inBed: "Zeit im Bett",
    wakings: "Nächtliches Aufwachen", room: "Raum", distance: "Abstand zum Sensor", people: "Personen", light: "Licht",
    moment: "Tageszeit", asleep: "schläft", seenNow: "Person jetzt erkannt", lastSeen: "Zuletzt gesehen: {x}",
    never: "seit dem Start nicht gesehen", unknown: "unbekannt", minAgo: "vor {m} Min.", hAgo: "vor {h} Std. {m} Min.",
    st_empty: "Niemand im Raum", st_visitor: "Besuch anwesend, Werte unsicher",
    st_far: "Anwesend, zu weit weg für Vitalwerte", st_rest: "Im Bett, ruht sich aus", st_measuring: "Anwesend, misst…",
    st_calm: "Anwesend, ruhig", alert: "Achtung: {r}",
    r_radar: "Radar antwortet nicht", r_fastbr: "schnelle Atmung", r_slowbr: "langsame Atmung",
    r_highhr: "hoher Puls", r_lowhr: "niedriger Puls", r_absent: "zu lange niemand gesehen",
    d_day: "Tag", d_evening: "Abend", d_night: "Nacht", d_sleep: "Schläft wahrscheinlich",
    radarOk: "Radar OK", radarBad: "Radar antwortet nicht", quality: "Datenqualität (1 Std.): {x}",
    wifi: "WLAN: {x}", w1: "ausgezeichnet", w2: "gut", w3: "schwach", w4: "sehr schwach", up: "Läuft seit {x}",
    note: "Die Werte werden von einem Radar geschätzt und ersetzen kein Medizinprodukt.", lang: "Sprache",
  },
};


// Settings page texts
const TS = {
  en: { s_test: "Send test notification", s_lang: "Language", s_lang_h: "Remembered on this device", s_alerts: "Alerts", s_alerts_h: "Show an alert when this lasts at least one minute:",
    s_brh: "Breathing faster than", s_brl: "Breathing slower than", s_hrh: "Heart rate above", s_hrl: "Heart rate below", s_abs: "Nobody seen for more than",
    u_br: "breaths / min", u_hr: "beats / min", u_h: "hours", s_led: "Status light",
    l0: "Always show status", l1: "Show status, off in the dark", l2: "Always off", l3: "Manual control", s_dark: "The room counts as dark below", u_lx: "lux",
    s_dev: "Sensor", s_reset: "Reset today's min / max", s_restart: "Restart sensor", s_restart_c: "Restart the sensor now? Readings pause for about 30 seconds.",
    s_save: "Save changes", s_saving: "Saving…", s_saved: "Saved", s_err: "Could not save. Check the connection and try again.", s_undo: "Undo", s_adv: "Advanced (technical) settings", s_done: "Done", s_unsaved: "You have unsaved changes" },
  ro: { s_test: "Trimite o notificare de test", s_lang: "Limbă", s_lang_h: "Se păstrează pe acest dispozitiv", s_alerts: "Alerte", s_alerts_h: "Arată o alertă când situația durează cel puțin un minut:",
    s_brh: "Respirația e mai rapidă de", s_brl: "Respirația e mai lentă de", s_hrh: "Pulsul e peste", s_hrl: "Pulsul e sub", s_abs: "Nimeni nu e văzut mai mult de",
    u_br: "respirații / min", u_hr: "bătăi / min", u_h: "ore", s_led: "Lumina de stare",
    l0: "Arată mereu starea", l1: "Arată starea, stinsă pe întuneric", l2: "Mereu stinsă", l3: "Control manual", s_dark: "Camera e considerată întunecată sub", u_lx: "lux",
    s_dev: "Senzor", s_reset: "Resetează minimul / maximul de azi", s_restart: "Repornește senzorul", s_restart_c: "Repornești senzorul acum? Citirile se opresc circa 30 de secunde.",
    s_save: "Salvează", s_saving: "Se salvează…", s_saved: "Salvat", s_err: "Nu s-a putut salva. Verifică conexiunea și încearcă din nou.", s_undo: "Anulează", s_adv: "Setări avansate (tehnice)", s_done: "Gata", s_unsaved: "Ai modificări nesalvate" },
  zh: { s_test: "发送测试通知", s_lang: "语言", s_lang_h: "仅保存在此设备上", s_alerts: "警报", s_alerts_h: "以下情况持续至少一分钟时发出警报：",
    s_brh: "呼吸快于", s_brl: "呼吸慢于", s_hrh: "心率高于", s_hrl: "心率低于", s_abs: "超过以下时间未检测到人",
    u_br: "次/分钟", u_hr: "次/分钟", u_h: "小时", s_led: "状态指示灯",
    l0: "始终显示状态", l1: "显示状态，黑暗时关闭", l2: "始终关闭", l3: "手动控制", s_dark: "光照低于此值视为黑暗", u_lx: "勒克斯",
    s_dev: "传感器", s_reset: "重置今日最低 / 最高值", s_restart: "重启传感器", s_restart_c: "现在重启传感器吗？读数将暂停约 30 秒。",
    s_save: "保存更改", s_saving: "保存中…", s_saved: "已保存", s_err: "无法保存。请检查连接后重试。", s_undo: "撤销", s_adv: "高级（技术）设置", s_done: "完成", s_unsaved: "有未保存的更改" },
  hi: { s_test: "टेस्ट सूचना भेजें", s_lang: "भाषा", s_lang_h: "इस डिवाइस पर याद रखी जाती है", s_alerts: "अलर्ट", s_alerts_h: "जब यह कम से कम एक मिनट तक रहे तो अलर्ट दिखाएँ:",
    s_brh: "साँस इससे तेज़", s_brl: "साँस इससे धीमी", s_hrh: "हृदय गति इससे ऊपर", s_hrl: "हृदय गति इससे नीचे", s_abs: "इससे ज़्यादा समय तक कोई न दिखे",
    u_br: "साँस / मिनट", u_hr: "धड़कन / मिनट", u_h: "घंटे", s_led: "स्टेटस लाइट",
    l0: "हमेशा स्टेटस दिखाएँ", l1: "स्टेटस दिखाएँ, अंधेरे में बंद", l2: "हमेशा बंद", l3: "मैन्युअल नियंत्रण", s_dark: "इससे कम रोशनी पर कमरा अंधेरा माना जाए", u_lx: "लक्स",
    s_dev: "सेंसर", s_reset: "आज का न्यूनतम / अधिकतम रीसेट करें", s_restart: "सेंसर रीस्टार्ट करें", s_restart_c: "सेंसर अभी रीस्टार्ट करें? माप लगभग 30 सेकंड के लिए रुकेंगे।",
    s_save: "बदलाव सेव करें", s_saving: "सेव हो रहा है…", s_saved: "सेव हो गया", s_err: "सेव नहीं हो सका। कनेक्शन जाँचें और फिर कोशिश करें।", s_undo: "पूर्ववत करें", s_adv: "उन्नत (तकनीकी) सेटिंग्स", s_done: "हो गया", s_unsaved: "बदलाव सेव नहीं हुए हैं" },
  es: { s_test: "Enviar notificación de prueba", s_lang: "Idioma", s_lang_h: "Se recuerda en este dispositivo", s_alerts: "Alertas", s_alerts_h: "Mostrar una alerta cuando esto dure al menos un minuto:",
    s_brh: "Respiración más rápida de", s_brl: "Respiración más lenta de", s_hrh: "Pulso por encima de", s_hrl: "Pulso por debajo de", s_abs: "Nadie visto durante más de",
    u_br: "resp. / min", u_hr: "latidos / min", u_h: "horas", s_led: "Luz de estado",
    l0: "Mostrar siempre el estado", l1: "Mostrar estado, apagada a oscuras", l2: "Siempre apagada", l3: "Control manual", s_dark: "La habitación se considera oscura por debajo de", u_lx: "lux",
    s_dev: "Sensor", s_reset: "Reiniciar mín. / máx. de hoy", s_restart: "Reiniciar sensor", s_restart_c: "¿Reiniciar el sensor ahora? Las lecturas se pausan unos 30 segundos.",
    s_save: "Guardar cambios", s_saving: "Guardando…", s_saved: "Guardado", s_err: "No se pudo guardar. Revisa la conexión e inténtalo de nuevo.", s_undo: "Deshacer", s_adv: "Ajustes avanzados (técnicos)", s_done: "Listo", s_unsaved: "Tienes cambios sin guardar" },
  fr: { s_test: "Envoyer une notification de test", s_lang: "Langue", s_lang_h: "Mémorisée sur cet appareil", s_alerts: "Alertes", s_alerts_h: "Afficher une alerte quand cela dure au moins une minute :",
    s_brh: "Respiration plus rapide que", s_brl: "Respiration plus lente que", s_hrh: "Pouls au-dessus de", s_hrl: "Pouls en dessous de", s_abs: "Personne vu depuis plus de",
    u_br: "resp. / min", u_hr: "battements / min", u_h: "heures", s_led: "Voyant d'état",
    l0: "Toujours afficher l'état", l1: "Afficher l'état, éteint dans le noir", l2: "Toujours éteint", l3: "Contrôle manuel", s_dark: "La pièce est considérée sombre sous", u_lx: "lux",
    s_dev: "Capteur", s_reset: "Réinitialiser min / max du jour", s_restart: "Redémarrer le capteur", s_restart_c: "Redémarrer le capteur maintenant ? Les mesures s'arrêtent environ 30 secondes.",
    s_save: "Enregistrer", s_saving: "Enregistrement…", s_saved: "Enregistré", s_err: "Échec de l'enregistrement. Vérifiez la connexion et réessayez.", s_undo: "Annuler", s_adv: "Réglages avancés (techniques)", s_done: "Terminé", s_unsaved: "Modifications non enregistrées" },
  pt: { s_test: "Enviar notificação de teste", s_lang: "Idioma", s_lang_h: "Lembrado neste dispositivo", s_alerts: "Alertas", s_alerts_h: "Mostrar um alerta quando isto durar pelo menos um minuto:",
    s_brh: "Respiração mais rápida que", s_brl: "Respiração mais lenta que", s_hrh: "Pulso acima de", s_hrl: "Pulso abaixo de", s_abs: "Ninguém visto por mais de",
    u_br: "resp. / min", u_hr: "batimentos / min", u_h: "horas", s_led: "Luz de estado",
    l0: "Mostrar sempre o estado", l1: "Mostrar estado, apagada no escuro", l2: "Sempre apagada", l3: "Controle manual", s_dark: "O quarto é considerado escuro abaixo de", u_lx: "lux",
    s_dev: "Sensor", s_reset: "Zerar mín. / máx. de hoje", s_restart: "Reiniciar sensor", s_restart_c: "Reiniciar o sensor agora? As leituras param por cerca de 30 segundos.",
    s_save: "Salvar alterações", s_saving: "Salvando…", s_saved: "Salvo", s_err: "Não foi possível salvar. Verifique a conexão e tente novamente.", s_undo: "Desfazer", s_adv: "Configurações avançadas (técnicas)", s_done: "Pronto", s_unsaved: "Há alterações não salvas" },
  ru: { s_test: "Отправить тестовое уведомление", s_lang: "Язык", s_lang_h: "Запоминается на этом устройстве", s_alerts: "Оповещения", s_alerts_h: "Показывать оповещение, если это длится не меньше минуты:",
    s_brh: "Дыхание чаще", s_brl: "Дыхание реже", s_hrh: "Пульс выше", s_hrl: "Пульс ниже", s_abs: "Никого не видно дольше",
    u_br: "вдохов / мин", u_hr: "ударов / мин", u_h: "часов", s_led: "Индикатор состояния",
    l0: "Всегда показывать состояние", l1: "Показывать, выключать в темноте", l2: "Всегда выключен", l3: "Ручное управление", s_dark: "Комната считается тёмной ниже", u_lx: "лк",
    s_dev: "Датчик", s_reset: "Сбросить мин. / макс. за сегодня", s_restart: "Перезапустить датчик", s_restart_c: "Перезапустить датчик сейчас? Показания прервутся примерно на 30 секунд.",
    s_save: "Сохранить", s_saving: "Сохранение…", s_saved: "Сохранено", s_err: "Не удалось сохранить. Проверьте соединение и попробуйте снова.", s_undo: "Отменить", s_adv: "Расширенные (технические) настройки", s_done: "Готово", s_unsaved: "Есть несохранённые изменения" },
  de: { s_test: "Testbenachrichtigung senden", s_lang: "Sprache", s_lang_h: "Wird auf diesem Gerät gespeichert", s_alerts: "Warnungen", s_alerts_h: "Warnung anzeigen, wenn dies mindestens eine Minute anhält:",
    s_brh: "Atmung schneller als", s_brl: "Atmung langsamer als", s_hrh: "Puls über", s_hrl: "Puls unter", s_abs: "Niemand gesehen seit mehr als",
    u_br: "Atemzüge / Min.", u_hr: "Schläge / Min.", u_h: "Stunden", s_led: "Statuslicht",
    l0: "Status immer anzeigen", l1: "Status anzeigen, im Dunkeln aus", l2: "Immer aus", l3: "Manuelle Steuerung", s_dark: "Der Raum gilt als dunkel unter", u_lx: "Lux",
    s_dev: "Sensor", s_reset: "Heutiges Min. / Max. zurücksetzen", s_restart: "Sensor neu starten", s_restart_c: "Sensor jetzt neu starten? Die Messung pausiert etwa 30 Sekunden.",
    s_save: "Änderungen speichern", s_saving: "Speichere…", s_saved: "Gespeichert", s_err: "Speichern fehlgeschlagen. Verbindung prüfen und erneut versuchen.", s_undo: "Rückgängig", s_adv: "Erweiterte (technische) Einstellungen", s_done: "Fertig", s_unsaved: "Ungespeicherte Änderungen" },
};
for (const k of Object.keys(TS)) Object.assign(T[k], TS[k]);

// Editable settings: firmware entity name, label key, unit key, limits
const NUMS = [
  ["Breathing high threshold", "s_brh", "u_br", 10, 40, 1],
  ["Breathing low threshold", "s_brl", "u_br", 3, 15, 1],
  ["Heart rate high threshold", "s_hrh", "u_hr", 70, 180, 1],
  ["Heart rate low threshold", "s_hrl", "u_hr", 30, 70, 1],
  ["Absence alert after hours", "s_abs", "u_h", 0.5, 24, 0.5],
];
const DARK = ["Darkness threshold", "s_dark", "u_lx", 0, 50, 0.5];

// Telegram settings texts, and default notification messages per language (\n = line break)
const TT = {
 "en": {
  "s_tg": "Telegram notifications",
  "s_tg_h": "Messages from your Telegram bot. Words like {room} are filled in automatically; type \\n for a new line.",
  "s_chat": "Chat ID",
  "s_chat_h": "Your private chat, or a family group (group IDs start with −).",
  "ev0": "When an alert starts",
  "ev1": "When an alert clears",
  "ev2": "When the sensor comes online",
  "ev3": "Morning summary",
  "s_hour": "Send the summary at",
  "s_ph": "Placeholders",
  "s_def": "Use default texts in this language"
 },
 "ro": {
  "s_tg": "Notificări Telegram",
  "s_tg_h": "Mesaje de la botul tău de Telegram. Cuvintele ca {room} se completează automat; scrie \\n pentru rând nou.",
  "s_chat": "ID chat",
  "s_chat_h": "Chatul tău privat sau un grup de familie (ID-urile de grup încep cu −).",
  "ev0": "Când începe o alertă",
  "ev1": "Când se încheie o alertă",
  "ev2": "Când senzorul revine online",
  "ev3": "Rezumatul de dimineață",
  "s_hour": "Trimite rezumatul la ora",
  "s_ph": "Câmpuri automate",
  "s_def": "Folosește textele implicite în această limbă"
 },
 "zh": {
  "s_tg": "Telegram 通知",
  "s_tg_h": "来自您的 Telegram 机器人的消息。{room} 等字段会自动填写；输入 \\n 换行。",
  "s_chat": "聊天 ID",
  "s_chat_h": "您的私聊或家庭群组（群组 ID 以 − 开头）。",
  "ev0": "警报开始时",
  "ev1": "警报解除时",
  "ev2": "传感器上线时",
  "ev3": "早间摘要",
  "s_hour": "摘要发送时间",
  "s_ph": "自动字段",
  "s_def": "使用此语言的默认文本"
 },
 "hi": {
  "s_tg": "Telegram सूचनाएँ",
  "s_tg_h": "आपके Telegram बॉट के संदेश। {room} जैसे शब्द अपने-आप भर जाते हैं; नई पंक्ति के लिए \\n लिखें।",
  "s_chat": "चैट ID",
  "s_chat_h": "आपकी निजी चैट या परिवार का ग्रुप (ग्रुप ID − से शुरू होती है)।",
  "ev0": "जब अलर्ट शुरू हो",
  "ev1": "जब अलर्ट ख़त्म हो",
  "ev2": "जब सेंसर ऑनलाइन आए",
  "ev3": "सुबह का सारांश",
  "s_hour": "सारांश भेजने का समय",
  "s_ph": "अपने-आप भरने वाले शब्द",
  "s_def": "इस भाषा के डिफ़ॉल्ट टेक्स्ट इस्तेमाल करें"
 },
 "es": {
  "s_tg": "Notificaciones de Telegram",
  "s_tg_h": "Mensajes de tu bot de Telegram. Palabras como {room} se rellenan solas; escribe \\n para un salto de línea.",
  "s_chat": "ID del chat",
  "s_chat_h": "Tu chat privado o un grupo familiar (los ID de grupo empiezan por −).",
  "ev0": "Cuando empieza una alerta",
  "ev1": "Cuando termina una alerta",
  "ev2": "Cuando el sensor vuelve a estar en línea",
  "ev3": "Resumen de la mañana",
  "s_hour": "Enviar el resumen a las",
  "s_ph": "Campos automáticos",
  "s_def": "Usar los textos predeterminados en este idioma"
 },
 "fr": {
  "s_tg": "Notifications Telegram",
  "s_tg_h": "Messages de votre bot Telegram. Les mots comme {room} sont remplis automatiquement ; tapez \\n pour un retour à la ligne.",
  "s_chat": "ID du chat",
  "s_chat_h": "Votre chat privé ou un groupe familial (les ID de groupe commencent par −).",
  "ev0": "Quand une alerte commence",
  "ev1": "Quand une alerte se termine",
  "ev2": "Quand le capteur revient en ligne",
  "ev3": "Résumé du matin",
  "s_hour": "Envoyer le résumé à",
  "s_ph": "Champs automatiques",
  "s_def": "Utiliser les textes par défaut dans cette langue"
 },
 "pt": {
  "s_tg": "Notificações do Telegram",
  "s_tg_h": "Mensagens do seu bot do Telegram. Palavras como {room} são preenchidas automaticamente; digite \\n para quebrar a linha.",
  "s_chat": "ID do chat",
  "s_chat_h": "Seu chat privado ou um grupo da família (IDs de grupo começam com −).",
  "ev0": "Quando um alerta começa",
  "ev1": "Quando um alerta termina",
  "ev2": "Quando o sensor volta a ficar online",
  "ev3": "Resumo da manhã",
  "s_hour": "Enviar o resumo às",
  "s_ph": "Campos automáticos",
  "s_def": "Usar os textos padrão neste idioma"
 },
 "ru": {
  "s_tg": "Уведомления Telegram",
  "s_tg_h": "Сообщения от вашего Telegram-бота. Слова вроде {room} подставляются автоматически; \\n — новая строка.",
  "s_chat": "ID чата",
  "s_chat_h": "Ваш личный чат или семейная группа (ID группы начинается с −).",
  "ev0": "Когда начинается тревога",
  "ev1": "Когда тревога снята",
  "ev2": "Когда датчик снова в сети",
  "ev3": "Утренняя сводка",
  "s_hour": "Отправлять сводку в",
  "s_ph": "Подстановки",
  "s_def": "Использовать стандартные тексты на этом языке"
 },
 "de": {
  "s_tg": "Telegram-Benachrichtigungen",
  "s_tg_h": "Nachrichten Ihres Telegram-Bots. Wörter wie {room} werden automatisch ersetzt; \\n für einen Zeilenumbruch.",
  "s_chat": "Chat-ID",
  "s_chat_h": "Ihr privater Chat oder eine Familiengruppe (Gruppen-IDs beginnen mit −).",
  "ev0": "Wenn eine Warnung beginnt",
  "ev1": "Wenn eine Warnung endet",
  "ev2": "Wenn der Sensor wieder online ist",
  "ev3": "Morgenzusammenfassung",
  "s_hour": "Zusammenfassung senden um",
  "s_ph": "Platzhalter",
  "s_def": "Standardtexte in dieser Sprache verwenden"
 }
};
for (const k of Object.keys(TT)) Object.assign(T[k], TT[k]);
for (const k of Object.keys(T)) T[k].u_clock = ":00";
const TG_DEFAULTS = {
 "en": [
  "🔴 {room}: {reason}\\nHeart rate {hr} bpm · breathing {br} /min · {time}",
  "✅ {room}: alert cleared · {status}",
  "🟢 {room}: sensor online · {status}",
  "☀️ {room}, good morning! Bed {bed} → up {wake} · {inbed} in bed · {wakings} night wakings\\nHeart rate {hrmin}–{hrmax} bpm · breathing {brmin}–{brmax} /min\\nNow: {status}"
 ],
 "ro": [
  "🔴 {room}: {reason}\\nPuls {hr} bpm · respirație {br} /min · {time}",
  "✅ {room}: alerta s-a încheiat · {status}",
  "🟢 {room}: senzorul e din nou online · {status}",
  "☀️ {room}, bună dimineața! Culcare {bed} → trezire {wake} · {inbed} în pat · {wakings} treziri\\nPuls {hrmin}–{hrmax} bpm · respirație {brmin}–{brmax} /min\\nAcum: {status}"
 ],
 "zh": [
  "🔴 {room}：{reason}\\n心率 {hr} 次/分 · 呼吸 {br} 次/分 · {time}",
  "✅ {room}：警报已解除 · {status}",
  "🟢 {room}：传感器已上线 · {status}",
  "☀️ {room}，早上好！就寝 {bed} → 起床 {wake} · 卧床 {inbed} · 夜醒 {wakings} 次\\n心率 {hrmin}–{hrmax} · 呼吸 {brmin}–{brmax}\\n当前：{status}"
 ],
 "hi": [
  "🔴 {room}: {reason}\\nहृदय गति {hr} · साँस {br} · {time}",
  "✅ {room}: अलर्ट ख़त्म · {status}",
  "🟢 {room}: सेंसर ऑनलाइन · {status}",
  "☀️ {room}, सुप्रभात! सोए {bed} → उठे {wake} · {inbed} बिस्तर में · {wakings} बार जागे\\nहृदय {hrmin}–{hrmax} · साँस {brmin}–{brmax}\\nअभी: {status}"
 ],
 "es": [
  "🔴 {room}: {reason}\\nPulso {hr} lpm · respiración {br} /min · {time}",
  "✅ {room}: alerta terminada · {status}",
  "🟢 {room}: sensor en línea · {status}",
  "☀️ {room}, ¡buenos días! Se acostó {bed} → se levantó {wake} · {inbed} en cama · {wakings} despertares\\nPulso {hrmin}–{hrmax} lpm · respiración {brmin}–{brmax} /min\\nAhora: {status}"
 ],
 "fr": [
  "🔴 {room} : {reason}\\nPouls {hr} bpm · respiration {br} /min · {time}",
  "✅ {room} : alerte terminée · {status}",
  "🟢 {room} : capteur en ligne · {status}",
  "☀️ {room}, bonjour ! Coucher {bed} → lever {wake} · {inbed} au lit · {wakings} réveils\\nPouls {hrmin}–{hrmax} bpm · respiration {brmin}–{brmax} /min\\nMaintenant : {status}"
 ],
 "pt": [
  "🔴 {room}: {reason}\\nPulso {hr} bpm · respiração {br} /min · {time}",
  "✅ {room}: alerta encerrado · {status}",
  "🟢 {room}: sensor online · {status}",
  "☀️ {room}, bom dia! Deitou {bed} → levantou {wake} · {inbed} na cama · {wakings} despertares\\nPulso {hrmin}–{hrmax} bpm · respiração {brmin}–{brmax} /min\\nAgora: {status}"
 ],
 "ru": [
  "🔴 {room}: {reason}\\nПульс {hr} · дыхание {br}/мин · {time}",
  "✅ {room}: тревога снята · {status}",
  "🟢 {room}: датчик снова в сети · {status}",
  "☀️ {room}, доброе утро! Лёг {bed} → встал {wake} · в постели {inbed} · просыпался {wakings} р.\\nПульс {hrmin}–{hrmax} · дыхание {brmin}–{brmax}\\nСейчас: {status}"
 ],
 "de": [
  "🔴 {room}: {reason}\\nPuls {hr} bpm · Atmung {br} /min · {time}",
  "✅ {room}: Warnung beendet · {status}",
  "🟢 {room}: Sensor wieder online · {status}",
  "☀️ {room}, guten Morgen! Zu Bett {bed} → auf {wake} · {inbed} im Bett · {wakings}× wach\\nPuls {hrmin}–{hrmax} bpm · Atmung {brmin}–{brmax} /min\\nJetzt: {status}"
 ]
};
// Telegram events: switch name, message name, label key
const TC = {"en": {"s_cmds": "Reply to chat commands", "s_cmds_h": "Send /status, /sleep, /today or /help to the bot and the sensor answers in this chat."}, "ro": {"s_cmds": "Răspunde la comenzi în chat", "s_cmds_h": "Trimite /status, /sleep, /today sau /help botului și senzorul răspunde în acest chat."}, "zh": {"s_cmds": "回复聊天命令", "s_cmds_h": "向机器人发送 /status、/sleep、/today 或 /help，传感器会在此聊天中回复。"}, "hi": {"s_cmds": "चैट कमांड का जवाब दें", "s_cmds_h": "बॉट को /status, /sleep, /today या /help भेजें, सेंसर इसी चैट में जवाब देगा।"}, "es": {"s_cmds": "Responder a comandos del chat", "s_cmds_h": "Envía /status, /sleep, /today o /help al bot y el sensor responde en este chat."}, "fr": {"s_cmds": "Répondre aux commandes du chat", "s_cmds_h": "Envoyez /status, /sleep, /today ou /help au bot et le capteur répond dans ce chat."}, "pt": {"s_cmds": "Responder a comandos no chat", "s_cmds_h": "Envie /status, /sleep, /today ou /help ao bot e o sensor responde neste chat."}, "ru": {"s_cmds": "Отвечать на команды в чате", "s_cmds_h": "Отправьте боту /status, /sleep, /today или /help — датчик ответит в этом чате."}, "de": {"s_cmds": "Auf Chat-Befehle antworten", "s_cmds_h": "Senden Sie /status, /sleep, /today oder /help an den Bot – der Sensor antwortet in diesem Chat."}};
for (const k of Object.keys(TC)) Object.assign(T[k], TC[k]);
const TG_EVENTS = [
  ["Telegram alert started", "Message alert started", "ev0"],
  ["Telegram alert cleared", "Message alert cleared", "ev1"],
  ["Telegram sensor online", "Message sensor online", "ev2"],
  ["Telegram morning summary", "Message morning summary", "ev3"],
];
const TG_HOUR = ["Morning summary hour", "s_hour", "u_clock", 0, 23, 1];
const TG_PLACEHOLDERS = ["room", "status", "reason", "hr", "br", "time", "bed", "wake", "inbed", "wakings", "hrmin", "hrmax", "brmin", "brmax"];

// Settings menu group titles
const TG2 = {"en": {"g_pref": "Preferences", "g_mon": "Monitoring", "g_notif": "Notifications", "g_sensor": "Sensor", "on": "On", "off": "Off"}, "ro": {"g_pref": "Preferințe", "g_mon": "Monitorizare", "g_notif": "Notificări", "g_sensor": "Senzor", "on": "Pornit", "off": "Oprit"}, "zh": {"g_pref": "偏好设置", "g_mon": "监测", "g_notif": "通知", "g_sensor": "传感器", "on": "开", "off": "关"}, "hi": {"g_pref": "पसंद", "g_mon": "निगरानी", "g_notif": "सूचनाएँ", "g_sensor": "सेंसर", "on": "चालू", "off": "बंद"}, "es": {"g_pref": "Preferencias", "g_mon": "Monitorización", "g_notif": "Notificaciones", "g_sensor": "Sensor", "on": "Activado", "off": "Desactivado"}, "fr": {"g_pref": "Préférences", "g_mon": "Surveillance", "g_notif": "Notifications", "g_sensor": "Capteur", "on": "Activé", "off": "Désactivé"}, "pt": {"g_pref": "Preferências", "g_mon": "Monitoramento", "g_notif": "Notificações", "g_sensor": "Sensor", "on": "Ligado", "off": "Desligado"}, "ru": {"g_pref": "Предпочтения", "g_mon": "Мониторинг", "g_notif": "Уведомления", "g_sensor": "Датчик", "on": "Вкл.", "off": "Выкл."}, "de": {"g_pref": "Präferenzen", "g_mon": "Überwachung", "g_notif": "Benachrichtigungen", "g_sensor": "Sensor", "on": "An", "off": "Aus"}};
for (const k of Object.keys(TG2)) Object.assign(T[k], TG2[k]);

// Line icons for the settings menu
const SI = {
  globe: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/></svg>',
  light: '<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/></svg>',
  bell: '<svg viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16zM10 20.5a2 2 0 0 0 4 0"/></svg>',
  send: '<svg viewBox="0 0 24 24"><path d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7z"/></svg>',
  reset: '<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4.5h4.5"/></svg>',
  power: '<svg viewBox="0 0 24 24"><path d="M12 3v8M7.1 6.3a7.5 7.5 0 1 0 9.8 0"/></svg>',
  code: '<svg viewBox="0 0 24 24"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/></svg>',
  home: '<svg viewBox="0 0 24 24"><path d="M4 11.5 12 5l8 6.5M6 10v9h12v-9"/></svg>',
  gear: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 3-.6 2.4a7 7 0 0 0-1.5.9l-2.4-.7-2 3.4 1.8 1.7a7 7 0 0 0 0 1.8l-1.8 1.7 2 3.4 2.4-.7a7 7 0 0 0 1.5.9l.6 2.4h4l.6-2.4a7 7 0 0 0 1.5-.9l2.4.7 2-3.4-1.8-1.7a7 7 0 0 0 0-1.8l1.8-1.7-2-3.4-2.4.7a7 7 0 0 0-1.5-.9L14 3z"/><circle cx="12" cy="11.6" r="3"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  text: '<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h10M4 18h7"/></svg>',
  test: '<svg viewBox="0 0 24 24"><path d="M5 12.5 9.5 17 19 7.5"/></svg>',
};
const CHEV = '<svg class="ap-chev" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg>';
const navItem = (page, icon, label, valueId) =>
  `<button type="button" class="ap-item" data-go="${page}"><span class="ap-ic">${SI[icon]}</span><span class="ap-il" data-t="${label}"></span><span class="ap-iv" id="${valueId}"></span>${CHEV}</button>`;
const actItem = (id, icon, label, cls = "") =>
  `<button type="button" class="ap-item ${cls}" id="${id}"><span class="ap-ic">${SI[icon]}</span><span class="ap-il" data-t="${label}"></span></button>`;
const PAGE_TITLES = { setup: "s_setup", rooms: "s_rooms", home: "settings", lang: "s_lang", light: "s_led", alerts: "s_alerts", telegram: "s_tg" };
let page = "home";
function autosize(area) {
  if (!area.offsetParent) return;  // not visible yet; sized again when its page opens
  area.style.height = "auto";
  area.style.height = area.scrollHeight + 2 + "px";
}
function showPage(pg) {
  page = pg;
  for (const el of document.querySelectorAll("#ap-set .ap-page")) el.hidden = el.dataset.page !== pg;
  $("ap-stitle").textContent = t(PAGE_TITLES[pg]);
  $("ap-sback").hidden = pg === "home";
  scrollTo(0, 0);
  for (const a of document.querySelectorAll("#ap-set textarea")) autosize(a);
  if (pg === "rooms") scanSensors();
  if (pg === "telegram") {
    refreshHousehold();
    if (household?.role === "primary") scanSensors();
  }
}

// Rooms texts
const TR = {"en": {"s_rooms": "Rooms", "s_thisroom": "This sensor", "s_others": "Other rooms", "s_add": "Add a room", "s_rname": "Room name", "s_raddr": "Address", "s_rooms_h": "Enter each sensor's address, e.g. hearthbeat-kitchen.local or 192.168.1.60. When you switch rooms, the list is copied to that sensor too.", "s_manage": "Manage rooms…", "s_noroom": "No other rooms yet", "s_remove": "Remove"}, "ro": {"s_rooms": "Camere", "s_thisroom": "Acest senzor", "s_others": "Alte camere", "s_add": "Adaugă o cameră", "s_rname": "Numele camerei", "s_raddr": "Adresă", "s_rooms_h": "Scrie adresa fiecărui senzor, de ex. hearthbeat-bucatarie.local sau 192.168.1.60. Când treci în altă cameră, lista se copiază și pe acel senzor.", "s_manage": "Gestionează camerele…", "s_noroom": "Nicio altă cameră încă", "s_remove": "Șterge"}, "zh": {"s_rooms": "房间", "s_thisroom": "此传感器", "s_others": "其他房间", "s_add": "添加房间", "s_rname": "房间名称", "s_raddr": "地址", "s_rooms_h": "输入每个传感器的地址，例如 hearthbeat-kitchen.local 或 192.168.1.60。切换房间时，列表也会复制到该传感器。", "s_manage": "管理房间…", "s_noroom": "还没有其他房间", "s_remove": "移除"}, "hi": {"s_rooms": "कमरे", "s_thisroom": "यह सेंसर", "s_others": "दूसरे कमरे", "s_add": "कमरा जोड़ें", "s_rname": "कमरे का नाम", "s_raddr": "पता", "s_rooms_h": "हर सेंसर का पता लिखें, जैसे hearthbeat-kitchen.local या 192.168.1.60। कमरा बदलने पर सूची उस सेंसर पर भी कॉपी हो जाती है।", "s_manage": "कमरे प्रबंधित करें…", "s_noroom": "अभी कोई दूसरा कमरा नहीं", "s_remove": "हटाएँ"}, "es": {"s_rooms": "Habitaciones", "s_thisroom": "Este sensor", "s_others": "Otras habitaciones", "s_add": "Añadir una habitación", "s_rname": "Nombre", "s_raddr": "Dirección", "s_rooms_h": "Escribe la dirección de cada sensor, p. ej. hearthbeat-kitchen.local o 192.168.1.60. Al cambiar de habitación, la lista se copia también a ese sensor.", "s_manage": "Gestionar habitaciones…", "s_noroom": "Aún no hay otras habitaciones", "s_remove": "Quitar"}, "fr": {"s_rooms": "Pièces", "s_thisroom": "Ce capteur", "s_others": "Autres pièces", "s_add": "Ajouter une pièce", "s_rname": "Nom de la pièce", "s_raddr": "Adresse", "s_rooms_h": "Saisissez l'adresse de chaque capteur, p. ex. hearthbeat-kitchen.local ou 192.168.1.60. En changeant de pièce, la liste est aussi copiée sur ce capteur.", "s_manage": "Gérer les pièces…", "s_noroom": "Aucune autre pièce pour l'instant", "s_remove": "Retirer"}, "pt": {"s_rooms": "Cômodos", "s_thisroom": "Este sensor", "s_others": "Outros cômodos", "s_add": "Adicionar cômodo", "s_rname": "Nome do cômodo", "s_raddr": "Endereço", "s_rooms_h": "Digite o endereço de cada sensor, ex. hearthbeat-kitchen.local ou 192.168.1.60. Ao trocar de cômodo, a lista também é copiada para esse sensor.", "s_manage": "Gerenciar cômodos…", "s_noroom": "Nenhum outro cômodo ainda", "s_remove": "Remover"}, "ru": {"s_rooms": "Комнаты", "s_thisroom": "Этот датчик", "s_others": "Другие комнаты", "s_add": "Добавить комнату", "s_rname": "Название комнаты", "s_raddr": "Адрес", "s_rooms_h": "Введите адрес каждого датчика, например hearthbeat-kitchen.local или 192.168.1.60. При переходе в другую комнату список копируется и на тот датчик.", "s_manage": "Управление комнатами…", "s_noroom": "Других комнат пока нет", "s_remove": "Удалить"}, "de": {"s_rooms": "Räume", "s_thisroom": "Dieser Sensor", "s_others": "Andere Räume", "s_add": "Raum hinzufügen", "s_rname": "Raumname", "s_raddr": "Adresse", "s_rooms_h": "Geben Sie die Adresse jedes Sensors ein, z. B. hearthbeat-kitchen.local oder 192.168.1.60. Beim Raumwechsel wird die Liste auch auf diesen Sensor kopiert.", "s_manage": "Räume verwalten…", "s_noroom": "Noch keine anderen Räume", "s_remove": "Entfernen"}};
for (const k of Object.keys(TR)) Object.assign(T[k], TR[k]);

const SENSOR_TEXT = {
  en: { s_add: "Add a sensor", s_scan: "Scan for sensors", s_scan_busy: "Looking for Hearthbeat sensors…", s_scan_none: "No new sensors found. Make sure the sensor has joined this Wi-Fi network.", s_scan_error: "Could not scan. Try again or enter the address manually.", s_manual: "Enter address manually", s_install: "Install Hearthbeat on a compatible kit" },
  ro: { s_add: "Adaugă un senzor", s_scan: "Caută senzori", s_scan_busy: "Se caută senzori Hearthbeat…", s_scan_none: "Nu s-au găsit senzori noi. Asigură-te că senzorul este conectat la această rețea Wi-Fi.", s_scan_error: "Căutarea a eșuat. Încearcă din nou sau introdu adresa manual.", s_manual: "Introdu adresa manual", s_install: "Instalează Hearthbeat pe un kit compatibil" },
  zh: { s_add: "添加传感器", s_scan: "搜索传感器", s_scan_busy: "正在搜索 Hearthbeat 传感器…", s_scan_none: "未找到新传感器。请确认传感器已连接到此 Wi-Fi 网络。", s_scan_error: "无法搜索。请重试或手动输入地址。", s_manual: "手动输入地址", s_install: "在兼容套件上安装 Hearthbeat" },
  hi: { s_add: "सेंसर जोड़ें", s_scan: "सेंसर खोजें", s_scan_busy: "Hearthbeat सेंसर खोजे जा रहे हैं…", s_scan_none: "कोई नया सेंसर नहीं मिला। सुनिश्चित करें कि सेंसर इस Wi-Fi नेटवर्क से जुड़ा है।", s_scan_error: "खोज नहीं हो सकी। फिर कोशिश करें या पता दर्ज करें।", s_manual: "पता खुद दर्ज करें", s_install: "संगत किट पर Hearthbeat इंस्टॉल करें" },
  es: { s_add: "Añadir un sensor", s_scan: "Buscar sensores", s_scan_busy: "Buscando sensores Hearthbeat…", s_scan_none: "No se encontraron sensores nuevos. Comprueba que el sensor esté conectado a esta red Wi-Fi.", s_scan_error: "No se pudo buscar. Vuelve a intentarlo o introduce la dirección manualmente.", s_manual: "Introducir la dirección manualmente", s_install: "Instalar Hearthbeat en un kit compatible" },
  fr: { s_add: "Ajouter un capteur", s_scan: "Rechercher des capteurs", s_scan_busy: "Recherche de capteurs Hearthbeat…", s_scan_none: "Aucun nouveau capteur trouvé. Vérifiez que le capteur est connecté à ce réseau Wi-Fi.", s_scan_error: "La recherche a échoué. Réessayez ou saisissez l’adresse manuellement.", s_manual: "Saisir l’adresse manuellement", s_install: "Installer Hearthbeat sur un kit compatible" },
  pt: { s_add: "Adicionar um sensor", s_scan: "Procurar sensores", s_scan_busy: "Procurando sensores Hearthbeat…", s_scan_none: "Nenhum sensor novo encontrado. Verifique se o sensor está conectado a esta rede Wi-Fi.", s_scan_error: "A busca falhou. Tente novamente ou digite o endereço manualmente.", s_manual: "Digitar o endereço manualmente", s_install: "Instalar Hearthbeat em um kit compatível" },
  ru: { s_add: "Добавить датчик", s_scan: "Найти датчики", s_scan_busy: "Поиск датчиков Hearthbeat…", s_scan_none: "Новые датчики не найдены. Убедитесь, что датчик подключён к этой сети Wi-Fi.", s_scan_error: "Не удалось выполнить поиск. Повторите попытку или введите адрес вручную.", s_manual: "Ввести адрес вручную", s_install: "Установить Hearthbeat на совместимый комплект" },
  de: { s_add: "Sensor hinzufügen", s_scan: "Sensoren suchen", s_scan_busy: "Hearthbeat-Sensoren werden gesucht…", s_scan_none: "Keine neuen Sensoren gefunden. Prüfe, ob der Sensor mit diesem WLAN verbunden ist.", s_scan_error: "Suche fehlgeschlagen. Versuche es erneut oder gib die Adresse manuell ein.", s_manual: "Adresse manuell eingeben", s_install: "Hearthbeat auf einem kompatiblen Kit installieren" },
};
for (const k of Object.keys(SENSOR_TEXT)) Object.assign(T[k], SENSOR_TEXT[k]);

Object.assign(T.en, {
  h_overview: "Home overview", h_check: "Check sensors", h_online: "Online", h_unreached: "Not reached",
  h_last: "Last check-in {x}", h_never: "No check-in yet", h_scan_error: "Could not check the other sensors. Try again.",
  h_scan_busy: "Checking sensors…", h_offline: "Sensor offline", h_waiting: "Waiting for readings",
  h_last_reading: "Last reading {x}", h_previous: "Last recorded reading",
  s_room_emoji: "Room emoji", s_edit_room: "Edit room", s_limit: "This sensor's room list is full.",
  s_bad_emoji: "Choose a room emoji or enter one emoji.",
  s_bad_address: "Enter a different sensor's local address.",
  s_room_saved: "{x} added", s_room_updated: "{x} updated", g_cancel: "Cancel",
  g_wifi: "Connect to Wi-Fi", g_place: "Check placement", g_alert: "Send a test alert",
  g_wifi_ok: "Connected to your home Wi-Fi.", g_place_hint: "Set the sensor where you want it, then stand or sit in the area it should monitor.",
  g_detected: "Presence detected. Is the sensor where you want it?", g_wait_presence: "Step into the area the sensor faces to check detection.",
  g_placement_ok: "Placement checked", g_continue: "Save and continue",
  g_telegram: "Set up Telegram", g_alert_hint: "Send a test alert and check that it arrives on your phone.",
  g_alert_requested: "Look for the test message in Telegram.",
  g_confirm_alert: "I received it", g_skip_alert: "Finish without Telegram", g_done: "Setup complete",
});
Object.assign(T.ro, {
  h_overview: "Toate camerele", h_check: "Verifică senzorii", h_online: "Online", h_unreached: "Indisponibil",
  h_last: "Ultima conexiune {x}", h_never: "Fără conexiuni înregistrate", h_scan_error: "Ceilalți senzori nu au putut fi verificați. Încearcă din nou.",
  h_scan_busy: "Se verifică senzorii…", h_offline: "Senzor deconectat", h_waiting: "Se așteaptă date",
  h_last_reading: "Ultima măsurătoare {x}", h_previous: "Ultima măsurătoare înregistrată",
  s_room_emoji: "Emoji pentru cameră", s_edit_room: "Editează camera", s_limit: "Lista de camere a senzorului este plină.",
  s_bad_emoji: "Alege sau introdu un singur emoji.",
  s_bad_address: "Introdu adresa locală a altui senzor.",
  s_room_saved: "Camera {x} a fost adăugată", s_room_updated: "Camera {x} a fost actualizată", g_cancel: "Anulează",
  g_wifi: "Conectează la Wi-Fi", g_place: "Verifică amplasarea", g_alert: "Trimite o alertă de test",
  g_wifi_ok: "Conectat la rețeaua Wi-Fi de acasă.", g_place_hint: "Așază senzorul în locul ales, apoi stai în zona pe care vrei să o monitorizezi.",
  g_detected: "Prezență detectată. Senzorul este în locul dorit?", g_wait_presence: "Intră în zona spre care este orientat senzorul pentru a verifica detecția.",
  g_placement_ok: "Am verificat amplasarea", g_continue: "Salvează și continuă",
  g_telegram: "Configurează Telegram", g_alert_hint: "Trimite o alertă de test și verifică dacă o primești pe telefon.",
  g_alert_requested: "Verifică dacă a sosit mesajul de test în Telegram.",
  g_confirm_alert: "Am primit mesajul", g_skip_alert: "Termină fără Telegram", g_done: "Configurare finalizată",
});
Object.assign(T.es, {
  h_overview: "Vista del hogar", h_check: "Comprobar sensores", h_online: "En línea", h_unreached: "Sin conexión",
  h_last: "Última conexión {x}", h_never: "Sin conexiones registradas", h_scan_error: "No se pudo comprobar los demás sensores. Inténtalo de nuevo.",
  h_scan_busy: "Comprobando sensores…", h_offline: "Sensor desconectado", h_waiting: "Esperando mediciones",
  h_last_reading: "Última medición {x}", h_previous: "Última medición registrada",
  s_room_emoji: "Emoji de la habitación", s_edit_room: "Editar habitación", s_limit: "La lista de habitaciones del sensor está llena.",
  s_bad_emoji: "Elige o introduce un solo emoji.", s_bad_address: "Introduce la dirección local de otro sensor.",
  s_room_saved: "Se añadió {x}", s_room_updated: "Se actualizó {x}", g_cancel: "Cancelar",
  g_wifi: "Conectar a Wi-Fi", g_place: "Comprobar la ubicación", g_alert: "Enviar una alerta de prueba",
  g_wifi_ok: "Conectado a tu red Wi-Fi doméstica.", g_place_hint: "Coloca el sensor y ponte de pie o siéntate en el área que quieres vigilar.",
  g_detected: "Se detectó presencia. ¿Está el sensor en el lugar que quieres?", g_wait_presence: "Entra en el área que cubre el sensor para comprobar la detección.",
  g_placement_ok: "Ubicación comprobada", g_continue: "Guardar y continuar",
  g_telegram: "Configurar Telegram", g_alert_hint: "Envía una alerta de prueba y comprueba que llega al teléfono.",
  g_alert_requested: "Busca el mensaje de prueba en Telegram.", g_confirm_alert: "Lo recibí",
  g_skip_alert: "Terminar sin Telegram", g_done: "Configuración completada",
});
Object.assign(T.fr, {
  h_overview: "Vue du domicile", h_check: "Vérifier les capteurs", h_online: "En ligne", h_unreached: "Injoignable",
  h_last: "Dernier contact {x}", h_never: "Aucun contact enregistré", h_scan_error: "Impossible de vérifier les autres capteurs. Réessayez.",
  h_scan_busy: "Vérification des capteurs…", h_offline: "Capteur hors ligne", h_waiting: "En attente de mesures",
  h_last_reading: "Dernière mesure {x}", h_previous: "Dernière mesure enregistrée",
  s_room_emoji: "Emoji de la pièce", s_edit_room: "Modifier la pièce", s_limit: "La liste des pièces du capteur est pleine.",
  s_bad_emoji: "Choisissez ou saisissez un seul emoji.", s_bad_address: "Saisissez l’adresse locale d’un autre capteur.",
  s_room_saved: "{x} ajouté", s_room_updated: "{x} mis à jour", g_cancel: "Annuler",
  g_wifi: "Se connecter au Wi-Fi", g_place: "Vérifier l’emplacement", g_alert: "Envoyer une alerte de test",
  g_wifi_ok: "Connecté au Wi-Fi du domicile.", g_place_hint: "Placez le capteur, puis asseyez-vous ou tenez-vous debout dans la zone à surveiller.",
  g_detected: "Présence détectée. Le capteur est-il au bon endroit ?", g_wait_presence: "Entrez dans la zone couverte pour vérifier la détection.",
  g_placement_ok: "Emplacement vérifié", g_continue: "Enregistrer et continuer",
  g_telegram: "Configurer Telegram", g_alert_hint: "Envoyez une alerte de test et vérifiez sa réception sur le téléphone.",
  g_alert_requested: "Vérifiez la réception du message de test dans Telegram.", g_confirm_alert: "Je l’ai reçu",
  g_skip_alert: "Terminer sans Telegram", g_done: "Configuration terminée",
});
Object.assign(T.pt, {
  h_overview: "Visão da casa", h_check: "Verificar sensores", h_online: "Online", h_unreached: "Sem resposta",
  h_last: "Último contato {x}", h_never: "Nenhum contato registrado", h_scan_error: "Não foi possível verificar os outros sensores. Tente novamente.",
  h_scan_busy: "Verificando sensores…", h_offline: "Sensor offline", h_waiting: "Aguardando medições",
  h_last_reading: "Última medição {x}", h_previous: "Última medição registrada",
  s_room_emoji: "Emoji do cômodo", s_edit_room: "Editar cômodo", s_limit: "A lista de cômodos do sensor está cheia.",
  s_bad_emoji: "Escolha ou digite um único emoji.", s_bad_address: "Digite o endereço local de outro sensor.",
  s_room_saved: "{x} adicionado", s_room_updated: "{x} atualizado", g_cancel: "Cancelar",
  g_wifi: "Conectar ao Wi-Fi", g_place: "Verificar o posicionamento", g_alert: "Enviar um alerta de teste",
  g_wifi_ok: "Conectado à rede Wi-Fi de casa.", g_place_hint: "Coloque o sensor no local desejado e fique em pé ou sentado na área a monitorar.",
  g_detected: "Presença detectada. O sensor está onde você deseja?", g_wait_presence: "Entre na área coberta pelo sensor para verificar a detecção.",
  g_placement_ok: "Posicionamento verificado", g_continue: "Salvar e continuar",
  g_telegram: "Configurar Telegram", g_alert_hint: "Envie um alerta de teste e confira se ele chega ao seu celular.",
  g_alert_requested: "Procure a mensagem de teste no Telegram.", g_confirm_alert: "Recebi o alerta",
  g_skip_alert: "Concluir sem Telegram", g_done: "Configuração concluída",
});
Object.assign(T.de, {
  h_overview: "Hausübersicht", h_check: "Sensoren prüfen", h_online: "Online", h_unreached: "Nicht erreichbar",
  h_last: "Letzter Kontakt {x}", h_never: "Noch kein Kontakt", h_scan_error: "Die anderen Sensoren konnten nicht geprüft werden. Versuche es erneut.",
  h_scan_busy: "Sensoren werden geprüft…", h_offline: "Sensor offline", h_waiting: "Warte auf Messwerte",
  h_last_reading: "Letzter Messwert {x}", h_previous: "Zuletzt erfasster Messwert",
  s_room_emoji: "Raum-Emoji", s_edit_room: "Raum bearbeiten", s_limit: "Die Raumliste des Sensors ist voll.",
  s_bad_emoji: "Wähle ein Emoji oder gib ein einzelnes Emoji ein.", s_bad_address: "Gib die lokale Adresse eines anderen Sensors ein.",
  s_room_saved: "{x} hinzugefügt", s_room_updated: "{x} aktualisiert", g_cancel: "Abbrechen",
  g_wifi: "Mit WLAN verbinden", g_place: "Standort prüfen", g_alert: "Testmeldung senden",
  g_wifi_ok: "Mit dem Heim-WLAN verbunden.", g_place_hint: "Stelle den Sensor auf und setze oder stelle dich in den gewünschten Bereich.",
  g_detected: "Anwesenheit erkannt. Steht der Sensor am gewünschten Ort?", g_wait_presence: "Betritt den erfassten Bereich, um die Erkennung zu prüfen.",
  g_placement_ok: "Standort geprüft", g_continue: "Speichern und weiter",
  g_telegram: "Telegram einrichten", g_alert_hint: "Sende eine Testmeldung und überprüfe, ob sie auf deinem Handy ankommt.",
  g_alert_requested: "Suche die Testmeldung in Telegram.", g_confirm_alert: "Meldung erhalten",
  g_skip_alert: "Ohne Telegram abschließen", g_done: "Einrichtung abgeschlossen",
});
Object.assign(T.ru, {
  h_overview: "Обзор дома", h_check: "Проверить датчики", h_online: "В сети", h_unreached: "Нет ответа",
  h_last: "Последняя связь {x}", h_never: "Датчик ещё не отвечал", h_scan_error: "Не удалось проверить другие датчики. Повторите попытку.",
  h_scan_busy: "Проверка датчиков…", h_offline: "Датчик не в сети", h_waiting: "Ожидание показаний",
  h_last_reading: "Последнее показание {x}", h_previous: "Последнее сохранённое показание",
  s_room_emoji: "Эмодзи комнаты", s_edit_room: "Изменить комнату", s_limit: "Список комнат датчика заполнен.",
  s_bad_emoji: "Выберите или введите один эмодзи.", s_bad_address: "Введите локальный адрес другого датчика.",
  s_room_saved: "Комната «{x}» добавлена", s_room_updated: "Комната «{x}» обновлена", g_cancel: "Отмена",
  g_wifi: "Подключиться к Wi-Fi", g_place: "Проверить расположение", g_alert: "Отправить тестовое уведомление",
  g_wifi_ok: "Подключено к домашней сети Wi-Fi.", g_place_hint: "Разместите датчик и встаньте или сядьте в зоне наблюдения.",
  g_detected: "Датчик обнаружил присутствие. Он стоит в нужном месте?", g_wait_presence: "Войдите в зону действия датчика, чтобы проверить обнаружение.",
  g_placement_ok: "Расположение проверено", g_continue: "Сохранить и продолжить",
  g_telegram: "Настроить Telegram", g_alert_hint: "Отправьте тестовое уведомление и проверьте, пришло ли оно на телефон.",
  g_alert_requested: "Проверьте тестовое сообщение в Telegram.", g_confirm_alert: "Сообщение получено",
  g_skip_alert: "Завершить без Telegram", g_done: "Настройка завершена",
});
Object.assign(T.zh, {
  h_overview: "家庭概览", h_check: "检查传感器", h_online: "在线", h_unreached: "无响应",
  h_last: "上次响应 {x}", h_never: "暂无响应记录", h_scan_error: "无法检查其他传感器，请重试。",
  h_scan_busy: "正在检查传感器…", h_offline: "传感器离线", h_waiting: "正在等待读数",
  h_last_reading: "上次读数 {x}", h_previous: "最近记录的读数",
  s_room_emoji: "房间表情符号", s_edit_room: "编辑房间", s_limit: "此传感器的房间列表已满。",
  s_bad_emoji: "请选择或输入一个表情符号。", s_bad_address: "请输入其他传感器的本地地址。",
  s_room_saved: "已添加 {x}", s_room_updated: "已更新 {x}", g_cancel: "取消",
  g_wifi: "连接 Wi-Fi", g_place: "检查摆放位置", g_alert: "发送测试提醒",
  g_wifi_ok: "已连接家庭 Wi-Fi。", g_place_hint: "把传感器放到所需位置，然后站在或坐在需要监测的区域内。",
  g_detected: "检测到有人。传感器的位置合适吗？", g_wait_presence: "请进入传感器覆盖的区域，检查是否能检测到你。",
  g_placement_ok: "已检查位置", g_continue: "保存并继续",
  g_telegram: "设置 Telegram", g_alert_hint: "发送测试提醒，并检查手机是否收到。",
  g_alert_requested: "请在 Telegram 中查看测试消息。", g_confirm_alert: "我已收到",
  g_skip_alert: "跳过 Telegram 并完成", g_done: "设置完成",
});
Object.assign(T.hi, {
  h_overview: "घर का अवलोकन", h_check: "सेंसर जाँचें", h_online: "ऑनलाइन", h_unreached: "कोई जवाब नहीं",
  h_last: "आखिरी संपर्क {x}", h_never: "अभी संपर्क दर्ज नहीं हुआ", h_scan_error: "दूसरे सेंसरों की जाँच नहीं हो सकी। फिर कोशिश करें।",
  h_scan_busy: "सेंसरों की जाँच हो रही है…", h_offline: "सेंसर ऑफ़लाइन है", h_waiting: "रीडिंग का इंतज़ार है",
  h_last_reading: "आखिरी रीडिंग {x}", h_previous: "आखिरी दर्ज रीडिंग",
  s_room_emoji: "कमरे का इमोजी", s_edit_room: "कमरा संपादित करें", s_limit: "इस सेंसर की कमरों की सूची भर गई है।",
  s_bad_emoji: "एक इमोजी चुनें या दर्ज करें।", s_bad_address: "किसी दूसरे सेंसर का स्थानीय पता दर्ज करें।",
  s_room_saved: "{x} जोड़ा गया", s_room_updated: "{x} अपडेट किया गया", g_cancel: "रद्द करें",
  g_wifi: "Wi-Fi से कनेक्ट करें", g_place: "सेंसर की जगह जाँचें", g_alert: "टेस्ट अलर्ट भेजें",
  g_wifi_ok: "घर के Wi-Fi से कनेक्ट है।", g_place_hint: "सेंसर को चुनी हुई जगह पर रखें और उस क्षेत्र में खड़े हों या बैठें जिसकी निगरानी करनी है।",
  g_detected: "किसी की मौजूदगी पाई गई। क्या सेंसर सही जगह पर है?", g_wait_presence: "पहचान की जाँच के लिए सेंसर के सामने वाले क्षेत्र में जाएँ।",
  g_placement_ok: "जगह जाँच ली", g_continue: "सेव करें और आगे बढ़ें",
  g_telegram: "Telegram सेट करें", g_alert_hint: "टेस्ट अलर्ट भेजें और देखें कि वह आपके फ़ोन पर आया या नहीं।",
  g_alert_requested: "Telegram में टेस्ट संदेश देखें।", g_confirm_alert: "मुझे मिल गया",
  g_skip_alert: "Telegram के बिना पूरा करें", g_done: "सेटअप पूरा हुआ",
});
for (const [locale, message] of Object.entries({
  en: "The room name is too long.",
  ro: "Numele camerei este prea lung.",
  es: "El nombre de la habitación es demasiado largo.",
  fr: "Le nom de la pièce est trop long.",
  pt: "O nome do cômodo é muito longo.",
  de: "Der Raumname ist zu lang.",
  ru: "Название комнаты слишком длинное.",
  zh: "房间名称太长。",
  hi: "कमरे का नाम बहुत लंबा है।",
})) T[locale].s_room_name_length = message;

// Rooms: this sensor's name is "text/Room name"; the other rooms are stored on the sensor in
// "text/Rooms" as "Name=address;Name=address". An emoji is part of the label on older firmware.
const SELF_HOST = location.host;
const ROOMS_KEY = "text/Rooms";
const NAME_KEY = "text/Room name";
const ICON_KEY = "text/Room emoji";
const DEFAULT_EMOJI = "🏠";
const ROOM_EMOJIS = ["🏠", "🛏️", "🛋️", "🍳", "🛁", "🪴", "📚", "🎮", "🧸", "🚪"];
const byteLength = (value) => new TextEncoder().encode(value).length;
const emojiPattern = /^(?:(?:\p{Regional_Indicator}{2})|(?:[#*0-9]\uFE0F?\u20E3)|(?:\p{Extended_Pictographic}\uFE0F?\p{Emoji_Modifier}?(?:\u200D\p{Extended_Pictographic}\uFE0F?\p{Emoji_Modifier}?)*))$/u;
const validEmoji = (value) => emojiPattern.test(value) && byteLength(value) <= 48;
function roomLabel(value) {
  const [first, ...rest] = value.trim().split(" ");
  return rest.join(" ").trim() && validEmoji(first)
    ? { emoji: first, name: rest.join(" ").trim() }
    : { name: value.trim(), emoji: "" };
}
function cleanHost(value) {
  const candidate = value.trim().replace(/^https?:\/\//i, "").split("/")[0];
  if (!/^(?:\[[0-9a-f:]+\]|[a-z0-9.-]+)(?::\d+)?$/i.test(candidate)) return "";
  try { return new URL(`http://${candidate}`).host.toLowerCase(); } catch { return ""; }
}
let selfLocalHost = "";
const isSelf = (host) => [SELF_HOST, selfLocalHost, txt("text_sensor/IP address")].includes(host);
function parseRooms(s) {
  return (s || "").split(";").map((x) => {
    const i = x.lastIndexOf("=");
    return i > 0 ? { ...roomLabel(x.slice(0, i)), host: cleanHost(x.slice(i + 1)) } : null;
  }).filter((r) => r && r.name && r.host);
}
const serializeRooms = (list) => list.map(({ name, host, emoji }) =>
  `${emoji && validEmoji(emoji) ? emoji + " " : ""}${name.replace(/[=;]/g, " ")}=${host}`).join(";");
const myRoom = () => draft[NAME_KEY] ?? current(NAME_KEY) ?? "";
const myEmoji = () => draft[ICON_KEY] ?? (current(ICON_KEY) || linkedEmoji);
let linkedEmoji = "";
const displayEmoji = (value) => validEmoji(value || "") ? value : DEFAULT_EMOJI;
function otherRooms() {
  return parseRooms(current(ROOMS_KEY)).filter((r) => !isSelf(r.host));
}
function roomUrl(host) {
  const all = [{ name: myRoom() || SELF_HOST, emoji: myEmoji(), host: selfLocalHost || SELF_HOST }, ...otherRooms()];
  return `${location.protocol}//${host}/#rooms=${encodeURIComponent(serializeRooms(all))}`;
}
const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const DISCOVERY_URL = "/hearthbeat/sensors";
const HOUSEHOLD_URL = "/hearthbeat/household";
const HOUSEHOLD_TEXT = {
  en: {
    th_title: "Household Telegram", th_primary: "Use this sensor for the household",
    th_primary_help: "Set up your bot and chat here. Linked rooms send their alerts through this sensor, and /status shows every linked room.",
    th_bot_needed: "Save a bot token and chat ID before linking rooms.",
    th_connect: "Connect to Telegram", th_unlink: "Remove from household",
    th_connected: "Connected to the household bot", th_connecting: "Waiting for the primary sensor",
    th_join: "Join household Telegram", th_invitation: "Use the Telegram bot on {x} for this room.",
    th_linked: "Linked", th_pending: "Waiting for this room to join", th_no_rooms: "Add your sensors in Rooms to connect them here.",
    th_no_compatible: "No compatible room sensors found. Check their Wi-Fi and software updates.",
    th_leave: "Leave household Telegram", th_stop: "Turn off household Telegram",
    th_leave_confirm: "This sensor will return to its individual Telegram settings. Continue?",
    th_stop_confirm: "Linked rooms will stop sending alerts through this sensor. Continue?",
    th_unlink_confirm: "Stop receiving alerts from {x} through this bot?",
    th_failed: "Could not save household Telegram settings. Check the connection and try again.",
    th_join_failed: "Could not reach the primary sensor. Reopen the invitation from that sensor to retry.",
    th_invite_failed: "The room was saved. Connect it later in Telegram notifications.",
    th_wait: "Checking for linked sensors…", th_finish: "Finish setup",
  },
  ro: {
    th_title: "Telegram pentru casă", th_primary: "Folosește acest senzor pentru întreaga casă",
    th_primary_help: "Configurează botul și chatul aici. Camerele conectate trimit alertele prin acest senzor, iar /status afișează toate camerele conectate.",
    th_bot_needed: "Salvează tokenul botului și ID-ul chatului înainte de a conecta camerele.",
    th_connect: "Conectează la Telegram", th_unlink: "Deconectează de la casă",
    th_connected: "Conectat la botul casei", th_connecting: "Se așteaptă senzorul principal",
    th_join: "Folosește Telegramul casei", th_invitation: "Folosește botul Telegram de pe {x} pentru această cameră.",
    th_linked: "Conectat", th_pending: "Se așteaptă conectarea camerei", th_no_rooms: "Adaugă senzori în Camere pentru a-i conecta aici.",
    th_no_compatible: "Nu s-au găsit senzori compatibili. Verifică rețeaua Wi-Fi și actualizările software.",
    th_leave: "Părăsește Telegramul casei", th_stop: "Dezactivează Telegramul casei",
    th_leave_confirm: "Senzorul va reveni la setările Telegram individuale. Continui?",
    th_stop_confirm: "Camerele conectate nu vor mai trimite alerte prin acest senzor. Continui?",
    th_unlink_confirm: "Oprești alertele pentru {x} prin acest bot?",
    th_failed: "Setările Telegram pentru casă nu au putut fi salvate. Verifică legătura și încearcă din nou.",
    th_join_failed: "Senzorul principal nu a răspuns. Redeschide invitația de pe acel senzor pentru a reîncerca.",
    th_invite_failed: "Camera a fost salvată. O poți conecta ulterior din Notificări Telegram.",
    th_wait: "Se caută senzorii conectați…", th_finish: "Termină configurarea",
  },
};
for (const [locale, strings] of Object.entries(HOUSEHOLD_TEXT)) Object.assign(T[locale], strings);

let household = null;
let householdRefresh;
let pendingHousehold = null;
let householdInviteOpened = false;
let householdBusy = false;
let householdMarkup = "";

async function householdApi(fields) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const options = { cache: "no-store", credentials: "same-origin", signal: controller.signal };
    if (fields) Object.assign(options, {
      method: "POST", body: new URLSearchParams(fields),
      headers: { "X-Hearthbeat-Setup": "1" },
    });
    const response = await fetch(HOUSEHOLD_URL, options);
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function refreshHousehold() {
  if (householdBusy || householdRefresh) return householdRefresh;
  householdRefresh = householdApi().then((state) => {
    if (state) household = state;
    else if (household?.role === "room") household = { ...household, connected: false };
    renderHousehold();
    renderSetupGuide();
    showHouseholdInvite();
  }).finally(() => { householdRefresh = null; });
  return householdRefresh;
}

function readHouseholdInvite() {
  if (!location.hash.startsWith("#household=")) return;
  const fields = new URLSearchParams(location.hash.slice(1));
  history.replaceState(null, "", location.pathname + location.search);
  try {
    const info = JSON.parse(fields.get("household"));
    if (typeof info?.host === "string" && /^[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?\.local$/.test(info.host) &&
        /^[a-f0-9]{6}$/.test(info.id) && /^[a-f0-9]{64}$/.test(info.key))
      pendingHousehold = { invite: info, rooms: fields.get("rooms") || "" };
  } catch { /* invalid invitation */ }
}

function showHouseholdInvite() {
  if (!pendingHousehold || !household || householdInviteOpened || !S["switch/Telegram alert started"]) return;
  householdInviteOpened = true;
  showView("settings");
  showPage("telegram");
  if (household.self !== pendingHousehold.invite.id || household.role === "primary") {
    pendingHousehold = null;
    $("ap-household-result").textContent = t("th_failed");
  }
  renderHousehold();
}

async function householdAction(fields) {
  if (householdBusy) return false;
  await householdRefresh;
  if (householdBusy) return false;
  householdBusy = true;
  renderHousehold();
  let success;
  try { success = !!await householdApi(fields); }
  finally { householdBusy = false; }
  await refreshHousehold();
  $("ap-household-result").textContent = success ? "" : t("th_failed");
  return success;
}

async function inviteRoom(room) {
  const sensor = sensorAt(room.host);
  if (household?.role !== "primary" || !household.ready || !sensor?.household) return false;
  const invitation = await householdApi({ action: "invite", id: sensor.id, name: room.name });
  if (!invitation) return false;
  const target = new URL(roomUrl(sensor.host));
  const roomList = new URLSearchParams(target.hash.slice(1)).get("rooms") || "";
  target.hash = new URLSearchParams({ household: JSON.stringify(invitation), rooms: roomList }).toString();
  location.assign(target.href);
  return true;
}

function renderHousehold() {
  const panel = $("ap-household");
  if (!panel) return;
  const role = household?.role;
  const joining = role === "joining";
  const linked = joining || role === "room";
  const primary = role === "primary";
  const invitation = pendingHousehold && household?.self === pendingHousehold.invite.id &&
    role !== "primary" ? pendingHousehold.invite : null;
  panel.hidden = !household;
  $("ap-household-join-box").hidden = !invitation;
  $("ap-household-join").disabled = householdBusy;
  $("ap-household-invitation").textContent = invitation ? t("th_invitation", { x: invitation.host }) : "";
  $("ap-household-enable").hidden = role !== "standalone" || !!invitation;
  $("ap-household-enable").disabled = householdBusy;
  $("ap-household-leave").hidden = !primary && !linked;
  $("ap-household-leave").disabled = householdBusy;
  $("ap-household-leave").textContent = t(joining ? "g_cancel" : primary ? "th_stop" : "th_leave");
  $("ap-household-description").textContent = t(household?.joinFailed ? "th_join_failed"
    : linked ? (!joining && household.connected ? "th_connected" : "th_connecting") : "th_primary_help");
  $("ap-household-needs-bot").hidden = !primary || household.ready;
  $("ap-bot-config").hidden = linked;
  $("ap-bot-commands").hidden = linked;
  $("ap-test").disabled = linked && (joining || !household.connected);
  $("ap-household-rooms").hidden = !primary;

  const peers = new Map((household?.peers || []).map((peer) => [peer.id, peer]));
  const available = primary ? otherRooms().flatMap((room) => {
    const sensor = sensorAt(room.host);
    return sensor?.household ? [{ room, id: sensor.id, peer: peers.get(sensor.id) }] : [];
  }) : [];
  const usedIds = new Set(available.map(({ id }) => id));
  const unreachable = [...peers.values()].filter((peer) => !usedIds.has(peer.id))
    .map((peer) => ({ room: { name: peer.name }, id: peer.id, peer }));
  const rows = [...available, ...unreachable];
  const markup = rows.length ? rows.map(({ room, id, peer }) => `
    <div class="ap-item ap-household-room"><span class="ap-il ap-rlink">${escapeHtml(room.name)}<small>${escapeHtml(t(peer ? peer.connected ? "th_linked" : peer.joined ? "h_unreached" : "th_pending" : "th_connect"))}</small></span>
      ${room.host && (!peer || !peer.connected) ? `<button type="button" class="ap-btn" data-invite="${escapeHtml(id)}" ${household?.ready ? "" : "disabled"}>${escapeHtml(t("th_connect"))}</button>` : ""}
      ${peer ? `<button type="button" class="ap-btn ap-danger" data-unlink="${escapeHtml(id)}">${escapeHtml(t("th_unlink"))}</button>` : ""}
    </div>`).join("") : `<div class="ap-item ap-empty">${escapeHtml(t(scanStatus === "s_scan_busy" ? "th_wait" :
      otherRooms().length ? "th_no_compatible" : "th_no_rooms"))}</div>`;
  if (markup === householdMarkup) return;
  householdMarkup = markup;
  const rooms = $("ap-household-rooms");
  rooms.innerHTML = markup;
  for (const button of rooms.querySelectorAll("[data-invite]")) {
    button.onclick = async () => {
      button.disabled = true;
      const row = rows.find(({ id }) => id === button.dataset.invite);
      if (!await inviteRoom(row.room)) {
        $("ap-household-result").textContent = t("th_failed");
        button.disabled = false;
      }
    };
  }
  for (const button of rooms.querySelectorAll("[data-unlink]")) {
    button.onclick = () => {
      const row = rows.find(({ id }) => id === button.dataset.unlink);
      if (confirm(t("th_unlink_confirm", { x: row.room.name })))
        householdAction({ action: "remove", id: row.id });
    };
  }
}

let scanStatus = "";
let lastScanAt = 0;
let discoveredSensors = [];
let roomSaveActive = false;
let sensorFormRoom = null;
const CHECKIN_KEY = "hearthbeat-room-checkins";
let overview = location.hash === "#home-overview";
let checkins = {};
try { checkins = JSON.parse(localStorage.getItem(CHECKIN_KEY)) || {}; } catch { /* start without history */ }
const sensorAt = (host) => discoveredSensors.find((sensor) => sensor.host === host.toLowerCase() || sensor.ip === host);

function renderDiscovery() {
  const scanButton = $("ap-scan-sensors");
  scanButton.disabled = scanStatus === "s_scan_busy";
  const newSensors = discoveredSensors.filter((sensor) => !otherRooms().some((room) => sensorAt(room.host) === sensor));
  const list = $("ap-discovered-sensors");
  list.hidden = !newSensors.length;
  list.replaceChildren(...newSensors.map((sensor) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ap-item";
    button.innerHTML = `<span class="ap-ic">${SI.plus}</span><span class="ap-il">Hearthbeat ${escapeHtml(sensor.id)}</span>${CHEV}`;
    button.onclick = () => showSensorForm({ host: sensor.host, id: sensor.id });
    return button;
  }));
  const message = scanStatus || (lastScanAt && !newSensors.length ? "s_scan_none" : "");
  $("ap-scan-status").textContent = message ? t(message) : "";
}

async function scanSensors() {
  if (scanStatus === "s_scan_busy") return;
  scanStatus = "s_scan_busy";
  renderDiscovery();
  renderOverview();
  renderHousehold();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6500);
  try {
    const readScan = async (method) => {
      const response = await fetch(DISCOVERY_URL, { method, cache: "no-store", signal: controller.signal });
      if (!response.ok) throw new Error("Discovery request failed");
      return response.json();
    };
    let result = await readScan("POST");
    while (result.scanning) {
      await new Promise((resolve) => setTimeout(resolve, 450));
      result = await readScan("GET");
    }
    if (typeof result.self === "string") selfLocalHost = cleanHost(result.self);
    const byId = new Map();
    for (const sensor of result.sensors) {
      if (typeof sensor.host !== "string" || typeof sensor.id !== "string" ||
          !/^[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?\.local$/i.test(sensor.host) ||
          !/^[a-f\d]{6}$/i.test(sensor.id) || isSelf(sensor.host.toLowerCase()) || sensor.ip === SELF_HOST)
        continue;
      byId.set(sensor.id.toLowerCase(), { ...sensor, host: sensor.host.toLowerCase() });
    }
    discoveredSensors = [...byId.values()].sort((a, b) => a.host.localeCompare(b.host));
    const now = Date.now();
    checkins = Object.fromEntries(otherRooms().flatMap(({ host }) => {
      const time = sensorAt(host) ? now : checkins[host];
      return Number.isFinite(time) ? [[host, time]] : [];
    }));
    localStorage.setItem(CHECKIN_KEY, JSON.stringify(checkins));
    scanStatus = "";
    lastScanAt = now;
  } catch {
    scanStatus = "s_scan_error";
  } finally {
    clearTimeout(timeout);
  }
  renderDiscovery();
  renderRoomsPage();
  renderOverview();
  renderHousehold();
}

function emojiInput(id) {
  return `<label class="ap-item ap-field"><span class="ap-il" data-t="s_room_emoji"></span>
    <input type="text" id="${id}" list="ap-room-emojis" maxlength="32" autocomplete="off" spellcheck="false" placeholder="${DEFAULT_EMOJI}">
  </label>`;
}

function showSensorForm(sensor = {}) {
  sensorFormRoom = sensor;
  const address = $("ap-new-host");
  $("ap-sensor-form").hidden = false;
  $("ap-new-label").hidden = !sensor.id;
  $("ap-new-label").textContent = sensor.id ? `Hearthbeat ${sensor.id}` : "";
  $("ap-new-address").hidden = !!sensor.host;
  address.required = !sensor.host;
  address.value = sensor.host || "";
  $("ap-new-name").value = sensor.name || "";
  const input = $("ap-new-emoji");
  input.value = sensor.emoji || DEFAULT_EMOJI;
  input.setCustomValidity("");
  renderRoomPresets();
  $("ap-add-sensor").textContent = t(sensor.name ? "s_save" : "s_add");
  setRoomFeedback("");
  $("ap-new-name").focus();
}

function renderRoomPresets() {
  const emoji = $("ap-new-emoji").value.trim();
  for (const button of $("ap-room-presets").querySelectorAll("button")) {
    button.setAttribute("aria-pressed", String(emoji === button.value));
  }
}

function setRoomFeedback(message, bad = false) {
  const status = $("ap-room-feedback");
  status.textContent = message;
  status.classList.toggle("bad", bad);
}

async function saveRooms(rooms) {
  const value = serializeRooms(rooms);
  if (byteLength(value) > 255) return "s_limit";
  if (value === current(ROOMS_KEY)) return "";
  if (roomSaveActive || !S[ROOMS_KEY]) return "s_err";
  roomSaveActive = true;
  const ok = await post("/text/Rooms/set", `value=${encodeURIComponent(value)}`);
  roomSaveActive = false;
  if (!ok) return "s_err";
  S[ROOMS_KEY] = { ...S[ROOMS_KEY], value, state: value };
  renderRoomMenu();
  renderRoomsPage();
  renderDiscovery();
  renderOverview();
  renderHousehold();
  return "";
}

// Merge a room list passed in the URL, once the sensor's own list has arrived
let roomsMerged = false;
function mergeRoomsFromUrl() {
  if (roomsMerged || !S[ROOMS_KEY]) return;
  const m = location.hash.match(/^#rooms=(.*)$/);
  if (!m) return;
  roomsMerged = true;
  history.replaceState(null, "", location.pathname + location.search);
  let incoming;
  try { incoming = parseRooms(decodeURIComponent(m[1])); } catch { return; }
  const byHost = new Map(otherRooms().map((r) => [r.host, r]));
  for (const room of incoming) {
    if (isSelf(room.host)) {
      if (room.emoji) {
        linkedEmoji = room.emoji;
        syncLinkedEmoji();
      }
      continue;
    }
    byHost.set(room.host, { ...room, emoji: room.emoji || byHost.get(room.host)?.emoji });
  }
  saveRooms([...byHost.values()]);
}

function syncLinkedEmoji() {
  if (!S[ICON_KEY] || !linkedEmoji || linkedEmoji === current(ICON_KEY) || ICON_KEY in draft) return;
  const value = linkedEmoji;
  post("/text/Room%20emoji/set", `value=${encodeURIComponent(value)}`).then((ok) => {
    if (ok) S[ICON_KEY] = { ...S[ICON_KEY], value, state: value };
  });
}

function openRooms(fromAdd = false) {
  showView("settings");
  showPage("rooms");
  if (fromAdd) {
    $("ap-add-title").scrollIntoView({ block: "start" });
    $("ap-add-title").focus({ preventScroll: true });
  }
}

function timeAgo(time) {
  const seconds = Math.max(0, Math.floor((Date.now() - time) / 1000));
  const unit = seconds < 60 ? "second" : seconds < 3600 ? "minute" : seconds < 86400 ? "hour" : "day";
  const size = { second: 1, minute: 60, hour: 3600, day: 86400 }[unit];
  return new Intl.RelativeTimeFormat(lang, { numeric: "auto", style: "short" }).format(-Math.floor(seconds / size), unit);
}

function showOverview(show) {
  overview = show;
  const hash = show ? "#home-overview" : "";
  history.replaceState(null, "", location.pathname + location.search + hash);
  $("ap-overview").hidden = !show;
  $("ap-room-dashboard").hidden = show;
  $("ap-room-view").setAttribute("aria-pressed", String(!show));
  $("ap-home-view").setAttribute("aria-pressed", String(show));
  scrollTo(0, 0);
  if (show) scanSensors();
  renderOverview();
}

function renderOverview() {
  if (!overview) return;
  const scanning = scanStatus === "s_scan_busy";
  const failed = scanStatus === "s_scan_error";
  const peerResultsAreFresh = !failed && streamIsLive() && Date.now() - lastScanAt < CONTACT_TIMEOUT_MS;
  $("ap-overview-scan").disabled = scanning;
  $("ap-overview-status").textContent = scanning ? t("h_scan_busy") : failed ? t("h_scan_error") : "";
  const rooms = [{ name: myRoom() || t("room"), emoji: myEmoji(), own: true }, ...otherRooms()];
  const markup = rooms.map((room) => {
    const reached = room.own ? streamIsLive() : peerResultsAreFresh && !!sensorAt(room.host);
    const last = room.own ? lastContactAt : checkins[room.host];
    const status = reached ? t("h_online") : room.own
      ? t(connected === null ? "connecting" : "h_offline")
      : peerResultsAreFresh ? t("h_unreached") : scanning ? t("h_scan_busy") : "–";
    const content = `<span class="ap-overview-icon" aria-hidden="true">${escapeHtml(displayEmoji(room.emoji))}</span>
      <span class="ap-overview-name"><strong>${escapeHtml(room.name)}</strong>
      <span class="ap-overview-state${reached ? " online" : ""}">${escapeHtml(status)}</span>
      <small>${escapeHtml(last ? t("h_last", { x: timeAgo(last) }) : t("h_never"))}</small></span>${CHEV}`;
    return room.own
      ? `<button type="button" class="ap-card ap-overview-room" id="ap-overview-current">${content}</button>`
      : `<a class="ap-card ap-overview-room" href="${escapeHtml(roomUrl(room.host))}">${content}</a>`;
  }).join("");
  const grid = $("ap-overview-rooms");
  if (markup === overviewMarkup) return;
  overviewMarkup = markup;
  const previous = document.activeElement;
  const href = previous?.getAttribute("href");
  const hadFocus = grid.contains(previous);
  grid.innerHTML = markup;
  $("ap-overview-current").onclick = () => showOverview(false);
  if (hadFocus) {
    const next = href ? [...grid.querySelectorAll("a")].find((link) => link.getAttribute("href") === href) : $("ap-overview-current");
    next?.focus({ preventScroll: true });
  }
}
let overviewMarkup = "";

function renderRoomMenu() {
  const menu = $("ap-room-menu");
  if (!menu) return;
  const rooms = otherRooms();
  menu.innerHTML = `<button type="button" class="on" id="ap-current-room"><span aria-hidden="true">${escapeHtml(displayEmoji(myEmoji()))}</span>${escapeHtml(myRoom() || t("room"))}<b class="ap-check">✓</b></button>`
    + rooms.map((r) => `<a href="${escapeHtml(roomUrl(r.host))}"><span aria-hidden="true">${escapeHtml(displayEmoji(r.emoji))}</span>${escapeHtml(r.name)}</a>`).join("")
    + `<hr><button type="button" id="ap-room-overview"><span aria-hidden="true">▣</span>${escapeHtml(t("h_overview"))}</button>
    <button type="button" id="ap-room-add"><span aria-hidden="true">＋</span>${escapeHtml(t("s_add"))}</button>
    <button type="button" id="ap-room-manage"><span aria-hidden="true">⚙️</span>${escapeHtml(t("s_manage"))}</button>`;
  $("ap-current-room").onclick = () => showOverview(false);
  $("ap-room-overview").onclick = () => showOverview(true);
  $("ap-room-add").onclick = () => openRooms(true);
  $("ap-room-manage").onclick = () => openRooms();
}

function renderRoomsPage() {
  const box = $("ap-rooms-list");
  if (!box) return;
  const rooms = otherRooms();
  box.innerHTML = rooms.length ? rooms.map((r) => {
    const sensor = sensorAt(r.host);
    const version = sensor?.version ? `v${sensor.version}` : "";
    const update = sensor?.update;
    const status = update === "current" ? t("s_upd_ok") : update === "installing" ? t("s_upd_busy") : "";
    const updateLabel = update && !status ? t("s_upd_new", { v: update }) : "";
    return `
    <div class="ap-item"><span class="ap-ic" aria-hidden="true">${escapeHtml(displayEmoji(r.emoji))}</span>
      <a class="ap-il ap-rlink" href="${escapeHtml(roomUrl(r.host))}">${escapeHtml(r.name)}${version || status ? `<small>${escapeHtml([version, status].filter(Boolean).join(" · "))}</small>` : ""}</a>
      ${updateLabel ? `<a class="ap-sensor-update" href="${escapeHtml(roomUrl(r.host).split("#")[0])}#software-update">${escapeHtml(updateLabel)}</a>` : ""}
      <button type="button" class="ap-room-edit" data-edit="${escapeHtml(r.host)}" aria-label="${escapeHtml(t("s_edit_room") + " " + r.name)}" title="${escapeHtml(t("s_edit_room"))}">${SI.text}</button>
      <button type="button" class="ap-rm" data-host="${escapeHtml(r.host)}" aria-label="${escapeHtml(t("s_remove") + " " + r.name)}" title="${escapeHtml(t("s_remove"))}">×</button>
    </div>`;
  }).join("") : `<div class="ap-item ap-empty">${escapeHtml(t("s_noroom"))}</div>`;
  for (const b of box.querySelectorAll("[data-edit]")) b.onclick = () => {
    const room = rooms.find((r) => r.host === b.dataset.edit);
    showSensorForm(room);
  };
  for (const b of box.querySelectorAll(".ap-rm")) b.onclick = async () => {
    const room = rooms.find((r) => r.host === b.dataset.host);
    if (!confirm(`${t("s_remove")} ${room.name}?`)) return;
    const error = await saveRooms(otherRooms().filter((r) => r.host !== room.host));
    setRoomFeedback(t(error || "s_saved"), !!error);
  };
}

// Setup / update texts (ready-made build)
const TU = {"en": {"b_setup": "Finish setting up this sensor", "b_setup_h": "Name the room, set the time zone and choose your own password.", "b_setup_go": "Set up", "s_setup": "Setup", "s_tz": "Time zone", "s_tz_use": "Use this phone's time zone", "s_login": "Dashboard login", "s_user": "Username", "s_pass": "New password", "s_pass2": "Repeat password", "s_pass_h": "At least 8 characters. After saving, log in again with the new password.", "s_pass_bad": "The passwords don't match or are shorter than 8 characters.", "s_token": "Bot token", "s_token_ph": "Paste a token to replace the saved one", "s_update": "Software update", "s_upd_ok": "Up to date", "s_upd_new": "Update to {v}", "s_upd_c": "Install version {v}? The sensor restarts and is back in about a minute.", "s_upd_busy": "Installing…", "s_addr": "This sensor's address: {x}"}, "ro": {"b_setup": "Termină configurarea senzorului", "b_setup_h": "Denumește camera, alege fusul orar și o parolă proprie.", "b_setup_go": "Configurează", "s_setup": "Configurare", "s_tz": "Fus orar", "s_tz_use": "Folosește fusul orar al telefonului", "s_login": "Autentificare", "s_user": "Utilizator", "s_pass": "Parolă nouă", "s_pass2": "Repetă parola", "s_pass_h": "Minimum 8 caractere. După salvare, autentifică-te din nou cu parola nouă.", "s_pass_bad": "Parolele nu coincid sau au mai puțin de 8 caractere.", "s_token": "Token bot", "s_token_ph": "Lipește un token pentru a-l înlocui pe cel salvat", "s_update": "Actualizare software", "s_upd_ok": "Ultima versiune", "s_upd_new": "Actualizează la {v}", "s_upd_c": "Instalezi versiunea {v}? Senzorul repornește și revine în circa un minut.", "s_upd_busy": "Se instalează…", "s_addr": "Adresa acestui senzor: {x}"}, "zh": {"b_setup": "完成此传感器的设置", "b_setup_h": "为房间命名、设置时区并选择您自己的密码。", "b_setup_go": "设置", "s_setup": "设置向导", "s_tz": "时区", "s_tz_use": "使用此手机的时区", "s_login": "仪表板登录", "s_user": "用户名", "s_pass": "新密码", "s_pass2": "重复密码", "s_pass_h": "至少 8 个字符。保存后请使用新密码重新登录。", "s_pass_bad": "两次输入的密码不一致或少于 8 个字符。", "s_token": "机器人令牌", "s_token_ph": "粘贴令牌以替换已保存的令牌", "s_update": "软件更新", "s_upd_ok": "已是最新版本", "s_upd_new": "更新到 {v}", "s_upd_c": "安装版本 {v}？传感器将重启，约一分钟后恢复。", "s_upd_busy": "正在安装…", "s_addr": "此传感器的地址：{x}"}, "hi": {"b_setup": "इस सेंसर की सेटिंग पूरी करें", "b_setup_h": "कमरे का नाम रखें, टाइम ज़ोन चुनें और अपना पासवर्ड सेट करें।", "b_setup_go": "सेट करें", "s_setup": "सेटअप", "s_tz": "टाइम ज़ोन", "s_tz_use": "इस फ़ोन का टाइम ज़ोन इस्तेमाल करें", "s_login": "डैशबोर्ड लॉगिन", "s_user": "यूज़रनेम", "s_pass": "नया पासवर्ड", "s_pass2": "पासवर्ड दोबारा लिखें", "s_pass_h": "कम से कम 8 अक्षर। सेव करने के बाद नए पासवर्ड से फिर लॉगिन करें।", "s_pass_bad": "पासवर्ड मेल नहीं खाते या 8 अक्षरों से छोटे हैं।", "s_token": "बॉट टोकन", "s_token_ph": "सेव टोकन बदलने के लिए नया टोकन चिपकाएँ", "s_update": "सॉफ़्टवेयर अपडेट", "s_upd_ok": "नवीनतम संस्करण", "s_upd_new": "{v} पर अपडेट करें", "s_upd_c": "संस्करण {v} इंस्टॉल करें? सेंसर रीस्टार्ट होगा और लगभग एक मिनट में वापस आएगा।", "s_upd_busy": "इंस्टॉल हो रहा है…", "s_addr": "इस सेंसर का पता: {x}"}, "es": {"b_setup": "Termina de configurar este sensor", "b_setup_h": "Pon nombre a la habitación, elige la zona horaria y tu propia contraseña.", "b_setup_go": "Configurar", "s_setup": "Configuración", "s_tz": "Zona horaria", "s_tz_use": "Usar la zona horaria de este teléfono", "s_login": "Acceso al panel", "s_user": "Usuario", "s_pass": "Nueva contraseña", "s_pass2": "Repite la contraseña", "s_pass_h": "Al menos 8 caracteres. Después de guardar, vuelve a iniciar sesión con la nueva contraseña.", "s_pass_bad": "Las contraseñas no coinciden o tienen menos de 8 caracteres.", "s_token": "Token del bot", "s_token_ph": "Pega un token para reemplazar el guardado", "s_update": "Actualización de software", "s_upd_ok": "Actualizado", "s_upd_new": "Actualizar a {v}", "s_upd_c": "¿Instalar la versión {v}? El sensor se reinicia y vuelve en un minuto aproximadamente.", "s_upd_busy": "Instalando…", "s_addr": "Dirección de este sensor: {x}"}, "fr": {"b_setup": "Terminez la configuration de ce capteur", "b_setup_h": "Nommez la pièce, choisissez le fuseau horaire et votre propre mot de passe.", "b_setup_go": "Configurer", "s_setup": "Configuration", "s_tz": "Fuseau horaire", "s_tz_use": "Utiliser le fuseau horaire de ce téléphone", "s_login": "Connexion au tableau de bord", "s_user": "Nom d'utilisateur", "s_pass": "Nouveau mot de passe", "s_pass2": "Répéter le mot de passe", "s_pass_h": "Au moins 8 caractères. Après l'enregistrement, reconnectez-vous avec le nouveau mot de passe.", "s_pass_bad": "Les mots de passe ne correspondent pas ou font moins de 8 caractères.", "s_token": "Jeton du bot", "s_token_ph": "Collez un jeton pour remplacer celui enregistré", "s_update": "Mise à jour logicielle", "s_upd_ok": "À jour", "s_upd_new": "Mettre à jour vers {v}", "s_upd_c": "Installer la version {v} ? Le capteur redémarre et revient dans environ une minute.", "s_upd_busy": "Installation…", "s_addr": "Adresse de ce capteur : {x}"}, "pt": {"b_setup": "Conclua a configuração deste sensor", "b_setup_h": "Dê um nome ao cômodo, escolha o fuso horário e sua própria senha.", "b_setup_go": "Configurar", "s_setup": "Configuração", "s_tz": "Fuso horário", "s_tz_use": "Usar o fuso horário deste telefone", "s_login": "Acesso ao painel", "s_user": "Usuário", "s_pass": "Nova senha", "s_pass2": "Repita a senha", "s_pass_h": "Pelo menos 8 caracteres. Depois de salvar, entre novamente com a nova senha.", "s_pass_bad": "As senhas não coincidem ou têm menos de 8 caracteres.", "s_token": "Token do bot", "s_token_ph": "Cole um token para substituir o salvo", "s_update": "Atualização de software", "s_upd_ok": "Atualizado", "s_upd_new": "Atualizar para {v}", "s_upd_c": "Instalar a versão {v}? O sensor reinicia e volta em cerca de um minuto.", "s_upd_busy": "Instalando…", "s_addr": "Endereço deste sensor: {x}"}, "ru": {"b_setup": "Завершите настройку датчика", "b_setup_h": "Назовите комнату, выберите часовой пояс и свой пароль.", "b_setup_go": "Настроить", "s_setup": "Настройка", "s_tz": "Часовой пояс", "s_tz_use": "Использовать часовой пояс телефона", "s_login": "Вход в панель", "s_user": "Имя пользователя", "s_pass": "Новый пароль", "s_pass2": "Повторите пароль", "s_pass_h": "Не менее 8 символов. После сохранения войдите снова с новым паролем.", "s_pass_bad": "Пароли не совпадают или короче 8 символов.", "s_token": "Токен бота", "s_token_ph": "Вставьте токен, чтобы заменить сохранённый", "s_update": "Обновление ПО", "s_upd_ok": "Установлена последняя версия", "s_upd_new": "Обновить до {v}", "s_upd_c": "Установить версию {v}? Датчик перезапустится и вернётся примерно через минуту.", "s_upd_busy": "Установка…", "s_addr": "Адрес этого датчика: {x}"}, "de": {"b_setup": "Einrichtung dieses Sensors abschließen", "b_setup_h": "Raum benennen, Zeitzone wählen und ein eigenes Passwort festlegen.", "b_setup_go": "Einrichten", "s_setup": "Einrichtung", "s_tz": "Zeitzone", "s_tz_use": "Zeitzone dieses Telefons verwenden", "s_login": "Anmeldung", "s_user": "Benutzername", "s_pass": "Neues Passwort", "s_pass2": "Passwort wiederholen", "s_pass_h": "Mindestens 8 Zeichen. Nach dem Speichern mit dem neuen Passwort erneut anmelden.", "s_pass_bad": "Die Passwörter stimmen nicht überein oder sind kürzer als 8 Zeichen.", "s_token": "Bot-Token", "s_token_ph": "Token einfügen, um den gespeicherten zu ersetzen", "s_update": "Software-Update", "s_upd_ok": "Aktuell", "s_upd_new": "Auf {v} aktualisieren", "s_upd_c": "Version {v} installieren? Der Sensor startet neu und ist in etwa einer Minute zurück.", "s_upd_busy": "Wird installiert…", "s_addr": "Adresse dieses Sensors: {x}"}};
for (const k of Object.keys(TU)) Object.assign(T[k], TU[k]);

// Ready-made build: these entities exist only there, so the matching UI stays hidden on personal builds
const hasGeneric = () => !!S["text/Dashboard password"];
const PHONE_TZ = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return ""; } })();
function renderTzOptions() {
  const sel = $("ap-tz");
  const opts = (S["select/Time zone"] && S["select/Time zone"].option) || [];
  if (!sel || !opts.length || sel.options.length === opts.length) return;
  sel.innerHTML = opts.map((o) => `<option value="${escapeHtml(o)}">${escapeHtml(o.replace(/_/g, " "))}</option>`).join("");
}
function updateInfo() {
  const u = S["update/Firmware update"];
  if (!u) return null;
  return { state: String(u.state || ""), latest: u.value || "", current: u.current_version || "" };
}
const TK = {"en": {"s_hakey": "Home Assistant key", "s_hakey_h": "Home Assistant asks for this key when it finds the sensor. Tap to copy.", "s_copied": "Copied"}, "ro": {"s_hakey": "Cheie Home Assistant", "s_hakey_h": "Home Assistant cere această cheie când găsește senzorul. Atinge pentru a copia.", "s_copied": "Copiat"}, "zh": {"s_hakey": "Home Assistant 密钥", "s_hakey_h": "Home Assistant 发现传感器时会要求输入此密钥。点按即可复制。", "s_copied": "已复制"}, "hi": {"s_hakey": "Home Assistant कुंजी", "s_hakey_h": "सेंसर मिलने पर Home Assistant यह कुंजी माँगता है। कॉपी करने के लिए टैप करें।", "s_copied": "कॉपी हो गया"}, "es": {"s_hakey": "Clave de Home Assistant", "s_hakey_h": "Home Assistant pide esta clave cuando encuentra el sensor. Toca para copiar.", "s_copied": "Copiado"}, "fr": {"s_hakey": "Clé Home Assistant", "s_hakey_h": "Home Assistant demande cette clé lorsqu'il trouve le capteur. Touchez pour copier.", "s_copied": "Copié"}, "pt": {"s_hakey": "Chave do Home Assistant", "s_hakey_h": "O Home Assistant pede esta chave quando encontra o sensor. Toque para copiar.", "s_copied": "Copiado"}, "ru": {"s_hakey": "Ключ Home Assistant", "s_hakey_h": "Home Assistant запросит этот ключ, когда найдёт датчик. Нажмите, чтобы скопировать.", "s_copied": "Скопировано"}, "de": {"s_hakey": "Home-Assistant-Schlüssel", "s_hakey_h": "Home Assistant fragt nach diesem Schlüssel, wenn es den Sensor findet. Zum Kopieren tippen.", "s_copied": "Kopiert"}};
for (const k of Object.keys(TK)) Object.assign(T[k], TK[k]);
const TC2 = {"en": {"s_upd_chk": "Checking for updates…"}, "ro": {"s_upd_chk": "Se caută actualizări…"}, "zh": {"s_upd_chk": "正在检查更新…"}, "hi": {"s_upd_chk": "अपडेट देखे जा रहे हैं…"}, "es": {"s_upd_chk": "Buscando actualizaciones…"}, "fr": {"s_upd_chk": "Recherche de mises à jour…"}, "pt": {"s_upd_chk": "Procurando atualizações…"}, "ru": {"s_upd_chk": "Проверка обновлений…"}, "de": {"s_upd_chk": "Suche nach Updates…"}};
for (const k of Object.keys(TC2)) Object.assign(T[k], TC2[k]);
const LED_OPTS = ["Status", "Status, off in the dark", "Off", "Manual"];

// Firmware texts (English) -> translation keys
const STATUS_KEYS = {
  "Nobody in the room": "st_empty", "Visitor present, readings uncertain": "st_visitor",
  "Present, too far for vital signs": "st_far", "In bed, resting": "st_rest",
  "Present, measuring...": "st_measuring", "Present, calm": "st_calm", "Present, moving": "st_moving",
};
const REASON_KEYS = {
  "Radar not responding": "r_radar", "Fast breathing": "r_fastbr", "Slow breathing": "r_slowbr",
  "High heart rate": "r_highhr", "Low heart rate": "r_lowhr", "Nobody seen for too long": "r_absent",
};
const DAY_KEYS = { "Day": "d_day", "Evening": "d_evening", "Night": "d_night", "Probably asleep": "d_sleep" };

function pickLang() {
  const saved = localStorage.getItem("hearthbeat-lang");
  if (saved && T[saved]) return saved;
  for (const l of navigator.languages || [navigator.language || "en"]) {
    const code = l.slice(0, 2).toLowerCase();
    if (T[code]) return code;
  }
  return "en";
}
let lang = pickLang();
const t = (k, vars = {}) => (T[lang][k] ?? T.en[k] ?? k).replace(/\{(\w+)\}/g, (m, n) => (n in vars ? vars[n] : m));

function trStatus(s) {
  if (!s) return t("loading");
  if (s.startsWith("ALERT: ")) {
    const r = s.slice(7);
    return t("alert", { r: REASON_KEYS[r] ? t(REASON_KEYS[r]) : r });
  }
  return STATUS_KEYS[s] ? t(STATUS_KEYS[s]) : s;
}
function trSeen(s) {
  if (s === "Not seen since start") return t("never");
  if (s === "Unknown") return t("unknown");
  let m = s.match(/^(\d+) h (\d+) min ago$/);
  if (m) return t("hAgo", { h: m[1], m: m[2] });
  m = s.match(/^(\d+) min ago$/);
  if (m) return t("minAgo", { m: m[1] });
  return s;
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const S = {};                       // latest state per entity name_id
const hist = { hr: [], br: [] };    // recent raw readings for the sparklines
const HIST_MS = 15 * 60 * 1000;
const CONTACT_TIMEOUT_MS = 45 * 1000;
let connected = null;
let lastContactAt = 0;
let streamOpenedAt = 0;
let lastReadingAt = 0;
const streamIsLive = () => connected === true && Date.now() - lastContactAt < CONTACT_TIMEOUT_MS;

const $ = (id) => document.getElementById(id);
const num = (k) => { const v = S[k] && S[k].value; return typeof v === "number" && isFinite(v) ? v : null; };
const txt = (k) => (S[k] && S[k].state != null ? String(S[k].state) : null);
const on = (k) => S[k] && (S[k].value === true || S[k].state === "ON");
const fmt = (v, d = 0) => (v == null ? "–" : v.toFixed(d));

function build() {
  const root = document.createElement("div");
  root.id = "ap";
  root.innerHTML = `
  <header class="ap-head">
    <div class="ap-brand"><div class="ap-logo">${LOGO}</div>
      <div><div class="ap-word">Hearthbeat</div><div class="ap-tag" data-t="tag"></div></div></div>
    <div class="ap-head-r">
      <span class="ap-live" id="ap-live"><i></i><span id="ap-live-t"></span></span>
      <div class="ap-lang ap-roomsw">
        <button type="button" class="ap-room" id="ap-room-btn" aria-expanded="false" aria-controls="ap-room-menu"><span id="ap-room">–</span><svg viewBox="0 0 24 24"><path d="m7 10 5 5 5-5"/></svg></button>
        <div class="ap-menu" id="ap-room-menu" hidden></div>
      </div>
      <div class="ap-lang">
        <button class="ap-btn ap-flag" id="ap-lang-btn" aria-haspopup="true" aria-expanded="false"></button>
        <div class="ap-menu" id="ap-lang-menu" role="menu" hidden></div>
      </div>
      <button type="button" class="ap-btn ap-settings-btn" id="ap-adv">${SI.gear}</button>
    </div>
  </header>

  <nav class="ap-view-switch">
    <button type="button" class="ap-btn" id="ap-room-view" aria-pressed="true" data-t="s_thisroom"></button>
    <button type="button" class="ap-btn" id="ap-home-view" aria-pressed="false" data-t="h_overview"></button>
  </nav>
  <section id="ap-overview" hidden>
    <div class="ap-overview-heading">
      <h1 data-t="s_rooms"></h1>
      <button type="button" class="ap-btn" id="ap-overview-scan" data-t="h_check"></button>
    </div>
    <p class="ap-hint" id="ap-overview-status" role="status"></p>
    <div class="ap-grid" id="ap-overview-rooms"></div>
    <button type="button" class="ap-btn ap-primary ap-overview-add" id="ap-overview-add" data-t="s_add"></button>
  </section>

  <div id="ap-room-dashboard">
  <p class="ap-setup-result" id="ap-setup-result" role="status"></p>
  <div class="ap-grid">
    <section class="ap-card ap-span ap-setup" id="ap-setup-card" hidden>
      <div><b data-t="b_setup"></b><p data-t="b_setup_h"></p></div>
      <button type="button" class="ap-btn ap-primary" id="ap-setup-go" data-t="b_setup_go"></button>
    </section>
    <section class="ap-card ap-hero ap-span" id="ap-hero">
      <div class="ap-dot" id="ap-dot">${ICONS.idle}</div>
      <div role="status"><div class="ap-label" id="ap-status-label" data-t="now"></div><h1 id="ap-status"></h1><p id="ap-seen"></p></div>
    </section>

    <section class="ap-card">
      <div class="ap-vital-top"><span class="ap-label" data-t="pulse"></span><span class="ap-icon ap-heart" id="ap-heart">${HEART}</span></div>
      <div class="ap-big"><b id="ap-hr">–</b><span>bpm</span></div>
      <div class="ap-sub" id="ap-hr-sub"></div>
      <svg class="ap-spark" id="ap-hr-spark" viewBox="0 0 300 56" preserveAspectRatio="none"></svg>
      <div class="ap-range"><span><span data-t="todayMin"></span> <b id="ap-hr-min">–</b></span><span><span data-t="max"></span> <b id="ap-hr-max">–</b></span></div>
    </section>

    <section class="ap-card">
      <div class="ap-vital-top"><span class="ap-label" data-t="breathing"></span><span class="ap-lung" id="ap-lung"></span></div>
      <div class="ap-big"><b id="ap-br">–</b><span>/ min</span></div>
      <div class="ap-sub" id="ap-br-sub"></div>
      <svg class="ap-spark" id="ap-br-spark" viewBox="0 0 300 56" preserveAspectRatio="none"></svg>
      <div class="ap-range"><span><span data-t="todayMin"></span> <b id="ap-br-min">–</b></span><span><span data-t="max"></span> <b id="ap-br-max">–</b></span></div>
    </section>

    <section class="ap-card">
      <div class="ap-label" data-t="sleep"></div>
      <div class="ap-stats">
        <div class="ap-stat"><div class="v" id="ap-bed">–</div><div class="k" data-t="bedtime"></div></div>
        <div class="ap-stat"><div class="v" id="ap-wake">–</div><div class="k" data-t="wakeup"></div></div>
        <div class="ap-stat"><div class="v" id="ap-hours">–</div><div class="k" data-t="inBed"></div></div>
        <div class="ap-stat"><div class="v" id="ap-ups">–</div><div class="k" data-t="wakings"></div></div>
      </div>
    </section>

    <section class="ap-card">
      <div class="ap-label" data-t="room"></div>
      <div class="ap-stats">
        <div class="ap-stat"><div class="v" id="ap-dist">–</div><div class="k" data-t="distance"></div></div>
        <div class="ap-stat"><div class="v" id="ap-people">–</div><div class="k" data-t="people"></div></div>
        <div class="ap-stat"><div class="v" id="ap-lux">–</div><div class="k" data-t="light"></div></div>
        <div class="ap-stat"><div class="v" id="ap-day">–</div><div class="k" data-t="moment"></div></div>
      </div>
    </section>
  </div>

  <footer class="ap-foot" id="ap-foot"></footer>
  <div class="ap-note" data-t="note"></div>
  </div>`;
  document.body.prepend(root);

  const back = document.createElement("div");
  back.id = "ap-back";
  back.innerHTML = `<div class="ap-brand"><div class="ap-logo">${LOGO}</div><div class="ap-word" data-t="settings"></div></div>
    <button class="ap-btn" id="ap-home" data-t="s_done"></button>`;
  document.body.prepend(back);

  $("ap-adv").onclick = () => showView("settings");
  $("ap-home").onclick = () => showView("settings");
  $("ap-room-view").onclick = () => showOverview(false);
  $("ap-home-view").onclick = () => showOverview(true);
  $("ap-overview-add").onclick = () => openRooms(true);
  $("ap-overview-scan").onclick = scanSensors;
  buildSettings();

  // Language menu
  const btn = $("ap-lang-btn"), menu = $("ap-lang-menu");
  menu.innerHTML = LANGS.map(([c, f, n]) => `<button role="menuitem" data-l="${c}"><span>${f}</span>${n}</button>`).join("");
  const close = () => { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); };
  btn.onclick = (e) => { e.stopPropagation(); menu.hidden = !menu.hidden; btn.setAttribute("aria-expanded", String(!menu.hidden)); };
  menu.onclick = (e) => {
    const b = e.target.closest("button[data-l]");
    if (!b) return;
    lang = b.dataset.l;
    localStorage.setItem("hearthbeat-lang", lang);
    close();
    applyLang();
  };
  document.addEventListener("click", close);
  const rbtn = $("ap-room-btn"), rmenu = $("ap-room-menu");
  const closeRooms = () => { rmenu.hidden = true; rbtn.setAttribute("aria-expanded", "false"); };
  rbtn.onclick = (e) => {
    e.stopPropagation();
    if (!rmenu.hidden) { closeRooms(); return; }
    renderRoomMenu();
    rmenu.hidden = false;
    rbtn.setAttribute("aria-expanded", "true");
    close();
  };
  document.addEventListener("click", closeRooms);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !rmenu.hidden) { closeRooms(); rbtn.focus(); }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}


// ---------------------------------------------------------------------------
// Friendly settings page (thresholds, status light, language, sensor actions)
// ---------------------------------------------------------------------------
const draft = {};   // unsaved edits: "number/<name>" or "select/LED mode" -> value

const SETUP_KEY = "hearthbeat-setup-progress";
let setupProgress = localStorage.getItem(SETUP_KEY) || "";
let testRequested = false;
let setupSaving = false;
const setupPending = () => on("binary_sensor/Setup needed") || (!!setupProgress && setupProgress !== "done");
function setSetupProgress(progress) {
  setupProgress = progress;
  localStorage.setItem(SETUP_KEY, progress);
  renderSetupGuide();
}

function renderSetupGuide() {
  const needed = on("binary_sensor/Setup needed");
  const guided = hasGeneric() && setupPending();
  const placementDone = setupProgress === "alerts" || setupProgress === "done";
  const ready = streamIsLive() && on("binary_sensor/Presence") && !on("binary_sensor/Radar not responding");
  const hasTelegram = !!S["button/Send test notification"];
  const linked = household?.role === "room" || household?.role === "joining";
  const telegramReady = hasTelegram && (linked ? household.role === "room" && household.connected : !!current("text/Telegram chat ID") &&
    (!S["text/Telegram bot token"] || !!current("text/Telegram bot token")));
  $("ap-setup-checklist").hidden = !guided;
  $("ap-setup-network").textContent = streamIsLive() ? t("g_wifi_ok") : t("connecting");
  $("ap-setup-room-form").hidden = guided && !needed;
  $("ap-setup-next").hidden = !guided || !needed;
  $("ap-setup-next").disabled = setupSaving || !streamIsLive();
  $("ap-setup-placement").hidden = !guided || needed || placementDone;
  $("ap-placement-state").textContent = t(ready ? "g_detected" : "g_wait_presence");
  $("ap-placement-ok").disabled = !ready;
  $("ap-setup-alerts").hidden = !guided || needed || !placementDone;
  $("ap-setup-tg").hidden = !hasTelegram || linked;
  $("ap-setup-alert-hint").textContent = t(linked ? (telegramReady ? "th_connected" : "th_connecting") : "g_alert_hint");
  $("ap-setup-skip").textContent = t(linked ? "th_finish" : "g_skip_alert");
  $("ap-setup-test").hidden = !telegramReady;
  $("ap-setup-confirm").hidden = !testRequested;
  $("ap-setup-options").hidden = guided;
  const complete = [streamIsLive(), !needed, placementDone, setupProgress === "done"];
  const active = Math.max(0, complete.indexOf(false));
  [...$("ap-setup-checklist").children].forEach((item, index) => {
    item.classList.toggle("complete", complete[index]);
    if (index === active) item.setAttribute("aria-current", "step"); else item.removeAttribute("aria-current");
  });
}

function openSetupGuide() {
  if (!setupProgress) setSetupProgress("room");
  showView("settings");
  showPage("setup");
}

function showView(v) {
  document.body.classList.toggle("ap-settings", v === "settings");
  document.body.classList.toggle("ap-advanced", v === "advanced");
  scrollTo(0, 0);
  if (v === "settings") { showPage("home"); refreshSettings(true); }
}

function numRow([name, label, unit, min, max, step]) {
  return `<div class="ap-row" data-num="${name}">
    <label class="ap-row-l"><span data-t="${label}"></span><small class="ap-row-u" data-t="${unit}"></small></label>
    <div class="ap-step">
      <button type="button" class="ap-stepb" data-d="-1" aria-label="−">−</button>
      <input type="number" inputmode="decimal" min="${min}" max="${max}" step="${step}">
      <button type="button" class="ap-stepb" data-d="1" aria-label="+">+</button>
      <span class="ap-unit" data-t="${unit}"></span>
    </div></div>`;
}

function buildSettings() {
  const el = document.createElement("div");
  el.id = "ap-set";
  el.innerHTML = `
  <datalist id="ap-room-emojis">${ROOM_EMOJIS.map((emoji) => `<option value="${emoji}"></option>`).join("")}</datalist>
  <header class="ap-shead">
    <button type="button" class="ap-sback" id="ap-sback" hidden><svg viewBox="0 0 24 24"><path d="m15 5-7 7 7 7"/></svg><span data-t="settings"></span></button>
    <h1 class="ap-stitle" id="ap-stitle"></h1>
    <button type="button" class="ap-btn" id="ap-set-done" data-t="s_done"></button>
  </header>

  <div class="ap-page" data-page="home">
    <div id="ap-g-setup" hidden>
      <div class="ap-list ap-first">${navItem("setup", "power", "s_setup", "ap-v-setup")}</div>
    </div>
    <div class="ap-gtitle" data-t="g_pref"></div>
    <div class="ap-list">${navItem("rooms", "home", "s_rooms", "ap-v-rooms")}${navItem("lang", "globe", "s_lang", "ap-v-lang")}${navItem("light", "light", "s_led", "ap-v-light")}</div>
    <div class="ap-gtitle" data-t="g_mon"></div>
    <div class="ap-list">${navItem("alerts", "bell", "s_alerts", "ap-v-alerts")}</div>
    <div id="ap-g-notif" hidden>
      <div class="ap-gtitle" data-t="g_notif"></div>
      <div class="ap-list">${navItem("telegram", "send", "s_tg", "ap-v-tg")}</div>
    </div>
    <div class="ap-gtitle" data-t="g_sensor"></div>
    <div class="ap-list">
      <button type="button" class="ap-item" id="ap-upd" hidden><span class="ap-ic">${SI.reset}</span><span class="ap-il" data-t="s_update"></span><span class="ap-iv" id="ap-v-upd"></span></button>
      ${actItem("ap-reset", "reset", "s_reset")}
      ${actItem("ap-restart", "power", "s_restart", "ap-danger")}
      <button type="button" class="ap-item" id="ap-adv-link"><span class="ap-ic">${SI.code}</span><span class="ap-il" data-t="s_adv"></span>${CHEV}</button>
    </div>
    <div class="ap-about" id="ap-about"></div>
  </div>

  <div class="ap-page" data-page="setup" hidden>
    <ol class="ap-setup-checklist" id="ap-setup-checklist" hidden>
      <li><span data-t="g_wifi"></span><small id="ap-setup-network"></small></li>
      <li data-t="s_rname"></li><li data-t="g_place"></li><li data-t="g_alert"></li>
    </ol>
    <div id="ap-setup-room-form">
    <div class="ap-gtitle" data-t="b_setup_h"></div>
    <div class="ap-list">
      <label class="ap-item ap-field"><span class="ap-il" data-t="s_rname"></span><input type="text" id="ap-setup-room" maxlength="32" autocomplete="off"></label>
      <label class="ap-item ap-field"><span class="ap-il" data-t="s_tz"></span><select id="ap-tz"></select></label>
      <button type="button" class="ap-item ap-accent" id="ap-tz-phone" hidden><span class="ap-ic">${SI.globe}</span><span class="ap-il"></span></button>
    </div>
    <div class="ap-gtitle" data-t="s_login"></div>
    <div class="ap-list">
      <label class="ap-item ap-field"><span class="ap-il" data-t="s_user"></span><input type="text" id="ap-user" maxlength="32" autocomplete="username" autocapitalize="off"></label>
      <label class="ap-item ap-field"><span class="ap-il" data-t="s_pass"></span><input type="password" id="ap-pass" maxlength="64" autocomplete="new-password"></label>
      <label class="ap-item ap-field"><span class="ap-il" data-t="s_pass2"></span><input type="password" id="ap-pass2" maxlength="64" autocomplete="new-password"></label>
    </div>
    <div class="ap-gfoot" id="ap-pass-msg" data-t="s_pass_h"></div>
    <div class="ap-actions"><button type="button" class="ap-btn ap-primary" id="ap-setup-next" data-t="g_continue" hidden></button></div>
    </div>
    <div class="ap-card ap-guide-card" id="ap-setup-placement" hidden>
      <h2 data-t="g_place"></h2>
      <p data-t="g_place_hint"></p><p class="ap-hint" id="ap-placement-state" role="status"></p>
      <button type="button" class="ap-btn ap-primary" id="ap-placement-ok" data-t="g_placement_ok"></button>
    </div>
    <div class="ap-card ap-guide-card" id="ap-setup-alerts" hidden>
      <h2 data-t="g_alert"></h2><p id="ap-setup-alert-hint"></p>
      <div class="ap-actions">
        <button type="button" class="ap-btn" id="ap-setup-tg" data-t="g_telegram"></button>
        <button type="button" class="ap-btn ap-primary" id="ap-setup-test" data-t="s_test" hidden></button>
        <button type="button" class="ap-btn ap-primary" id="ap-setup-confirm" data-t="g_confirm_alert" hidden></button>
        <button type="button" class="ap-btn" id="ap-setup-skip" data-t="g_skip_alert"></button>
      </div>
      <p class="ap-hint" id="ap-setup-alert-state" role="status"></p>
    </div>
    <div id="ap-setup-options">
    <div class="ap-list">${navItem("telegram", "send", "s_tg", "ap-v-tg2")}</div>
    <div id="ap-hakey-box" hidden>
      <div class="ap-list"><button type="button" class="ap-item" id="ap-hakey"><span class="ap-ic">${SI.code}</span><span class="ap-il" data-t="s_hakey"></span><span class="ap-iv ap-mono" id="ap-v-hakey"></span></button></div>
      <div class="ap-gfoot" data-t="s_hakey_h"></div>
    </div>
    </div>
  </div>

  <div class="ap-page" data-page="rooms" hidden>
    <div class="ap-gtitle" data-t="s_thisroom"></div>
    <div class="ap-list"><label class="ap-item ap-field"><span class="ap-il" data-t="s_rname"></span>
      <input type="text" id="ap-room-name" maxlength="32" autocomplete="off"></label>
      <div id="ap-own-emoji" hidden>${emojiInput("ap-room-emoji")}</div>
    </div>
    <div class="ap-gtitle" data-t="s_others"></div>
    <div class="ap-list" id="ap-rooms-list"></div>
    <div class="ap-gtitle" id="ap-add-title" data-t="s_add" tabindex="-1"></div>
    <div class="ap-list">
      ${actItem("ap-scan-sensors", "plus", "s_scan", "ap-accent")}
    </div>
    <div class="ap-gfoot" id="ap-scan-status" role="status"></div>
    <div class="ap-list" id="ap-discovered-sensors" hidden></div>
    <form class="ap-list" id="ap-sensor-form" hidden>
      <div class="ap-item ap-device-id" id="ap-new-label" hidden></div>
      <label class="ap-item ap-field"><span class="ap-il" data-t="s_rname"></span><input type="text" id="ap-new-name" maxlength="32" autocomplete="off" required></label>
      ${emojiInput("ap-new-emoji")}
      <div class="ap-room-presets" id="ap-room-presets">${ROOM_EMOJIS.map((emoji) =>
        `<button type="button" class="ap-btn" value="${emoji}" aria-pressed="false">${emoji}</button>`).join("")}
      </div>
      <label class="ap-item ap-field" id="ap-new-address"><span class="ap-il" data-t="s_raddr"></span><input type="text" id="ap-new-host" placeholder="hearthbeat-kitchen.local" autocapitalize="off" autocomplete="off" spellcheck="false"></label>
      <div class="ap-item ap-room-form-actions">
        <button type="button" class="ap-btn" id="ap-room-cancel" data-t="g_cancel"></button>
        <button type="submit" class="ap-btn ap-primary" id="ap-add-sensor"></button>
      </div>
    </form>
    <div class="ap-gfoot" id="ap-room-feedback" role="status" tabindex="-1"></div>
    <div class="ap-list ap-sensor-options">
      ${actItem("ap-manual-sensor", "text", "s_manual")}
      <a class="ap-item" href="https://costibotez.github.io/hearthbeat/" target="_blank" rel="noopener noreferrer"><span class="ap-ic">${SI.code}</span><span class="ap-il" data-t="s_install"></span>${CHEV}</a>
    </div>
    <div class="ap-gfoot" id="ap-self-addr"></div>
  </div>

  <div class="ap-page" data-page="lang" hidden>
    <div class="ap-list ap-langs">${LANGS.map(([c, f, n]) => `<button type="button" class="ap-item" data-l="${c}"><span class="ap-ic ap-flagic">${f}</span><span class="ap-il">${n}</span><span class="ap-check">✓</span></button>`).join("")}</div>
    <div class="ap-gfoot" data-t="s_lang_h"></div>
  </div>

  <div class="ap-page" data-page="light" hidden>
    <div class="ap-list">${LED_OPTS.map((o, i) => `<label class="ap-item ap-radio"><input type="radio" name="ap-led" value="${o}"><span class="ap-il" data-t="l${i}"></span><span class="ap-check">✓</span></label>`).join("")}</div>
    <div class="ap-list">${numRow(DARK)}</div>
  </div>

  <div class="ap-page" data-page="alerts" hidden>
    <div class="ap-gtitle" data-t="s_alerts_h"></div>
    <div class="ap-list">${NUMS.map(numRow).join("")}</div>
  </div>

  <div class="ap-page" data-page="telegram" hidden>
    <button type="button" class="ap-btn ap-guide-return" id="ap-setup-return" data-t="g_continue" hidden></button>
    <div id="ap-household" hidden>
      <div class="ap-gtitle" data-t="th_title"></div>
      <div class="ap-card ap-household-card">
        <p id="ap-household-description"></p>
        <p class="ap-hint" id="ap-household-needs-bot" data-t="th_bot_needed" hidden></p>
        <div class="ap-actions">
          <button type="button" class="ap-btn ap-primary" id="ap-household-enable" data-t="th_primary" hidden></button>
          <button type="button" class="ap-btn" id="ap-household-leave" hidden></button>
        </div>
        <div id="ap-household-join-box" hidden>
          <p id="ap-household-invitation"></p>
          <div class="ap-actions">
            <button type="button" class="ap-btn ap-primary" id="ap-household-join" data-t="th_join"></button>
            <button type="button" class="ap-btn" id="ap-household-cancel" data-t="g_cancel"></button>
          </div>
        </div>
        <p id="ap-household-result" class="ap-hint" role="status"></p>
      </div>
      <div class="ap-list" id="ap-household-rooms" hidden></div>
    </div>
    <div id="ap-bot-config">
    <div class="ap-gtitle" data-t="s_tg_h"></div>
    <div class="ap-list" id="ap-token-row" hidden><label class="ap-item ap-field"><span class="ap-il" data-t="s_token"></span>
      <input type="password" id="ap-token" maxlength="64" autocomplete="off" spellcheck="false"></label></div>
    <div class="ap-list"><label class="ap-item ap-field"><span class="ap-il" data-t="s_chat"></span>
      <input type="text" id="ap-tg-chat" inputmode="numeric" maxlength="32" autocomplete="off"></label></div>
    <div class="ap-gfoot" data-t="s_chat_h"></div>
    </div>
    ${TG_EVENTS.map(([sw, msg, label], i) => `
    <div class="ap-list ap-tg-ev" data-sw="${sw}" data-msg="${msg}">
      <label class="ap-item ap-toggle"><span class="ap-il" data-t="${label}"></span><input type="checkbox"><span class="ap-track"></span></label>
      <div class="ap-item ap-ta"><textarea rows="${i === 3 ? 4 : 2}" maxlength="255" spellcheck="false"></textarea></div>
      ${i === 3 ? numRow(TG_HOUR) : ""}
    </div>`).join("")}
    <div id="ap-bot-commands">
    <div class="ap-list ap-tg-cmd" data-sw="Telegram chat commands">
      <label class="ap-item ap-toggle"><span class="ap-il" data-t="s_cmds"></span><input type="checkbox"><span class="ap-track"></span></label>
    </div>
    <div class="ap-gfoot" data-t="s_cmds_h"></div>
    </div>
    <div class="ap-gfoot"><span data-t="s_ph"></span>: ${TG_PLACEHOLDERS.map((p) => `<code>{${p}}</code>`).join(" ")}</div>
    <div class="ap-list">${actItem("ap-tg-def", "text", "s_def")}${actItem("ap-test", "send", "s_test")}</div>
  </div>

  <div class="ap-savebar" id="ap-savebar">
    <span id="ap-save-msg" role="status"></span>
    <div><button type="button" class="ap-btn" id="ap-undo" data-t="s_undo"></button>
    <button type="button" class="ap-btn ap-primary" id="ap-save" data-t="s_save"></button></div>
  </div>`;
  document.body.prepend(el);

  $("ap-set-done").onclick = () => {
    if (Object.keys(draft).length && !confirm(t("s_unsaved") + ". " + t("s_undo") + "?")) return;
    clearDraft();
    showView("home");
  };
  $("ap-adv-link").onclick = () => showView("advanced");
  $("ap-sback").onclick = () => showPage("home");
  for (const b of el.querySelectorAll("[data-go]")) b.onclick = () => showPage(b.dataset.go);

  el.querySelector(".ap-langs").onclick = (e) => {
    const b = e.target.closest("button[data-l]");
    if (!b) return;
    lang = b.dataset.l;
    localStorage.setItem("hearthbeat-lang", lang);
    applyLang();
  };

  for (const row of el.querySelectorAll(".ap-row")) {
    const name = row.dataset.num, input = row.querySelector("input");
    const set = (v) => {
      const min = +input.min, max = +input.max, step = +input.step;
      v = Math.min(max, Math.max(min, Math.round(v / step) * step));
      input.value = v;
      markDraft("number/" + name, v);
    };
    row.querySelectorAll(".ap-stepb").forEach((b) => (b.onclick = () => set((+input.value || 0) + (+b.dataset.d) * (+input.step))));
    input.onchange = () => { if (input.value !== "") set(+input.value); };
  }
  for (const r of el.querySelectorAll('input[name="ap-led"]')) r.onchange = () => markDraft("select/LED mode", r.value);

  // Telegram
  $("ap-household-enable").onclick = async () => {
    if (await householdAction({ action: "primary" })) scanSensors();
  };
  $("ap-household-leave").onclick = () => {
    if (household?.role === "joining") { householdAction({ action: "cancel_join" }); return; }
    if (confirm(t(household?.role === "primary" ? "th_stop_confirm" : "th_leave_confirm")))
      householdAction({ action: "leave" });
  };
  $("ap-household-cancel").onclick = () => {
    pendingHousehold = null;
    $("ap-household-result").textContent = "";
    renderHousehold();
  };
  $("ap-household-join").onclick = async () => {
    if (!pendingHousehold) return;
    const { invite, rooms } = pendingHousehold;
    if (!await householdAction({ action: "join", host: invite.host, id: invite.id, key: invite.key })) return;
    pendingHousehold = null;
    if (rooms) {
      history.replaceState(null, "", location.pathname + location.search + "#rooms=" + encodeURIComponent(rooms));
      mergeRoomsFromUrl();
    }
    renderHousehold();
    if (on("binary_sensor/Setup needed")) {
      const ownRoom = parseRooms(rooms).find(({ host }) => isSelf(host));
      if (ownRoom && byteLength(ownRoom.name) <= 32) markDraft(NAME_KEY, ownRoom.name);
      openSetupGuide();
    }
  };
  $("ap-tg-chat").oninput = (e) => markDraft("text/Telegram chat ID", e.target.value.trim());
  for (const ev of el.querySelectorAll(".ap-tg-ev")) {
    const box = ev.querySelector('input[type="checkbox"]'), area = ev.querySelector("textarea");
    box.onchange = () => { markDraft("switch/" + ev.dataset.sw, box.checked); ev.classList.toggle("off", !box.checked); };
    area.oninput = () => { autosize(area); markDraft("text/" + ev.dataset.msg, area.value.replace(/\r?\n/g, "\\n")); };
  }
  // Setup (ready-made build)
  $("ap-setup-room").oninput = (e) => editOwnRoomName(e.target);
  $("ap-tz").onchange = (e) => markDraft("select/Time zone", e.target.value);
  $("ap-tz-phone").onclick = () => { $("ap-tz").value = PHONE_TZ; markDraft("select/Time zone", PHONE_TZ); };
  $("ap-user").oninput = (e) => { const v = e.target.value.trim(); if (v) markDraft("text/Dashboard username", v); };
  const checkPass = () => {
    const a = $("ap-pass").value, b = $("ap-pass2").value, msg = $("ap-pass-msg");
    if (!a && !b) { delete draft["text/Dashboard password"]; msg.textContent = t("s_pass_h"); msg.classList.remove("bad"); updateSaveBar(); return; }
    const ok = a.length >= 8 && a === b;
    msg.textContent = ok || !b ? t("s_pass_h") : t("s_pass_bad");
    msg.classList.toggle("bad", !ok && !!b);
    if (ok) draft["text/Dashboard password"] = a; else delete draft["text/Dashboard password"];
    updateSaveBar();
  };
  $("ap-pass").oninput = checkPass;
  $("ap-pass2").oninput = checkPass;
  $("ap-token").oninput = (e) => { const v = e.target.value.trim(); if (v) draft["text/Telegram bot token"] = v; else delete draft["text/Telegram bot token"]; updateSaveBar(); };
  $("ap-upd").onclick = () => {
    const u = updateInfo();
    if (!u) return;
    if (u.state !== "UPDATE AVAILABLE") {
      if (S["button/Check for updates"]) post(`/button/${encodeURIComponent("Check for updates")}/press`).then((ok) => flash(ok ? t("s_upd_chk") : t("s_err"), !ok));
      return;
    }
    if (!confirm(t("s_upd_c", { v: u.latest }))) return;
    post(`/update/${encodeURIComponent("Firmware update")}/install`).then((ok) => flash(ok ? t("s_upd_busy") : t("s_err"), !ok));
  };
  $("ap-hakey").onclick = () => {
    const k = txt("text_sensor/Home Assistant key");
    if (!k) return;
    const done = () => flash(t("s_copied") + " ✓");
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(k).then(done, () => prompt(t("s_hakey"), k));
    else prompt(t("s_hakey"), k);  // plain http: let the user copy from a prompt
  };
  $("ap-setup-go").onclick = openSetupGuide;
  $("ap-setup-next").onclick = async () => {
    const room = $("ap-setup-room");
    if (!editOwnRoomName(room)) { room.focus(); return; }
    if (!draft["text/Dashboard password"]) {
      $("ap-pass-msg").textContent = t("s_pass_bad");
      $("ap-pass-msg").classList.add("bad");
      $("ap-pass").focus();
      return;
    }
    if (!setupProgress) setSetupProgress("room");
    setupSaving = true;
    renderSetupGuide();
    const ok = await save([NAME_KEY, "select/Time zone", "text/Dashboard username", "text/Dashboard password"]);
    setupSaving = false;
    if (ok) {
      // The browser must authenticate again after the password changes.
      history.replaceState(null, "", location.pathname + location.search + "#setup");
      location.reload();
    } else renderSetupGuide();
  };
  $("ap-placement-ok").onclick = () => setSetupProgress("alerts");
  $("ap-setup-tg").onclick = () => showPage("telegram");
  $("ap-setup-return").onclick = async () => {
    if (await save(Object.keys(draft).filter((key) => /Telegram|Message |Morning summary/.test(key)))) showPage("setup");
  };
  $("ap-setup-test").onclick = async (e) => {
    const button = e.currentTarget;
    button.disabled = true;
    const ok = await sendTestAlert();
    testRequested = ok;
    $("ap-setup-alert-state").textContent = t(ok ? "g_alert_requested" : "s_err");
    button.disabled = false;
    renderSetupGuide();
  };
  const finishSetup = () => {
    setSetupProgress("done");
    history.replaceState(null, "", location.pathname + location.search);
    showView("home");
    $("ap-setup-result").textContent = t("g_done");
    render();
  };
  $("ap-setup-confirm").onclick = finishSetup;
  $("ap-setup-skip").onclick = finishSetup;

  // Rooms
  $("ap-room-name").oninput = (e) => editOwnRoomName(e.target);
  $("ap-room-emoji").oninput = (e) => {
    const input = e.target, emoji = input.value.trim();
    const valid = !emoji || validEmoji(emoji);
    input.setCustomValidity(valid ? "" : t("s_bad_emoji"));
    if (valid) markDraft(ICON_KEY, emoji || DEFAULT_EMOJI);
    else { delete draft[ICON_KEY]; updateSaveBar(); input.reportValidity(); }
  };
  $("ap-scan-sensors").onclick = scanSensors;
  $("ap-manual-sensor").onclick = () => showSensorForm();
  $("ap-room-cancel").onclick = () => {
    $("ap-sensor-form").hidden = true;
    sensorFormRoom = null;
    setRoomFeedback("");
  };
  $("ap-new-emoji").oninput = (e) => {
    e.target.setCustomValidity("");
    renderRoomPresets();
  };
  $("ap-room-presets").onclick = (e) => {
    const button = e.target.closest("button");
    if (!button) return;
    $("ap-new-emoji").value = button.value;
    $("ap-new-emoji").setCustomValidity("");
    renderRoomPresets();
  };
  $("ap-sensor-form").onsubmit = async (e) => {
    e.preventDefault();
    if (roomSaveActive) return;
    const name = $("ap-new-name").value.trim();
    const emojiInput = $("ap-new-emoji");
    const emoji = emojiInput.value.trim() || DEFAULT_EMOJI;
    const host = sensorFormRoom?.host || cleanHost($("ap-new-host").value);
    if (!name) { $("ap-new-name").focus(); return; }
    if (!validEmoji(emoji)) {
      emojiInput.setCustomValidity(t("s_bad_emoji"));
      emojiInput.reportValidity();
      return;
    }
    if (!host || isSelf(host)) {
      setRoomFeedback(t("s_bad_address"), true);
      if (!$("ap-new-address").hidden) $("ap-new-host").focus();
      return;
    }
    const sensor = sensorAt(host);
    const rooms = otherRooms();
    const match = (r) => r.host === host || (sensor && sensorAt(r.host) === sensor);
    const room = { name, host, emoji };
    const editing = rooms.some(match);
    const list = editing ? rooms.map((r) => match(r) ? room : r) : [...rooms, room];
    const button = $("ap-add-sensor");
    button.disabled = true;
    $("ap-room-cancel").disabled = true;
    try {
      const error = await saveRooms(list);
      setRoomFeedback(t(error || (editing ? "s_room_updated" : "s_room_saved"), { x: name }), !!error);
      if (!error) {
        $("ap-sensor-form").hidden = true;
        sensorFormRoom = null;
        $("ap-room-feedback").focus();
        if (!editing && household?.role === "primary" && household.ready && sensor?.household &&
            !await inviteRoom(room)) setRoomFeedback(t("th_invite_failed"), true);
      }
    } finally {
      button.disabled = false;
      $("ap-room-cancel").disabled = false;
    }
  };

  const cmdBox = el.querySelector(".ap-tg-cmd input");
  cmdBox.onchange = () => markDraft("switch/Telegram chat commands", cmdBox.checked);
  $("ap-tg-def").onclick = () => {
    const d = TG_DEFAULTS[lang] || TG_DEFAULTS.en;
    el.querySelectorAll(".ap-tg-ev").forEach((ev, i) => {
      ev.querySelector("textarea").value = d[i].replace(/\\n/g, "\n");
      autosize(ev.querySelector("textarea"));
      markDraft("text/" + ev.dataset.msg, d[i]);
    });
  };

  $("ap-undo").onclick = () => { clearDraft(); refreshSettings(true); renderDiscovery(); };
  $("ap-save").onclick = () => save();
  $("ap-reset").onclick = () => post(`/button/${encodeURIComponent("Reset min and max today")}/press`).then((ok) => flash(ok ? t("s_saved") : t("s_err"), !ok));
  $("ap-test").onclick = () => sendTestAlert().then((ok) => flash(ok ? "✓" : t("s_err"), !ok));
  $("ap-restart").onclick = () => { if (confirm(t("s_restart_c"))) post(`/button/${encodeURIComponent("Restart sensor")}/press`); };
}

function current(key) {
  const s = S[key];
  if (!s) return null;
  if (key.startsWith("select/") || key.startsWith("text/")) return s.state ?? s.value;
  return s.value;
}

function markDraft(key, v) {
  if (String(current(key)) === String(v)) delete draft[key]; else draft[key] = v;
  updateSaveBar();
}
function editOwnRoomName(input) {
  const name = input.value.trim();
  const tooLong = byteLength(name) > 32;
  input.setCustomValidity(tooLong ? t("s_room_name_length") : "");
  if (name && !tooLong) markDraft(NAME_KEY, name);
  else { delete draft[NAME_KEY]; updateSaveBar(); }
  if (tooLong) input.reportValidity();
  return !!name && !tooLong;
}
function clearDraft() { for (const k of Object.keys(draft)) delete draft[k]; updateSaveBar(); }

function updateSaveBar(msg, bad) {
  const dirty = Object.keys(draft).length > 0;
  $("ap-savebar").hidden = (!dirty && !msg) || (page === "setup" && setupPending() && !msg);
  $("ap-savebar").classList.toggle("show", dirty || !!msg);
  $("ap-save").disabled = !dirty || settingsSaving;
  $("ap-undo").hidden = !dirty;
  const m = $("ap-save-msg");
  m.textContent = msg || (dirty ? t("s_unsaved") : "");
  m.classList.toggle("bad", !!bad);
}
let flashTimer;
function flash(msg, bad) {
  updateSaveBar(msg, bad);
  clearTimeout(flashTimer);
  flashTimer = setTimeout(() => updateSaveBar(), 2500);
}

// Show the sensor's current values in fields the user is not editing
function refreshSettings(force) {
  const el = $("ap-set");
  if (!el || (!force && !document.body.classList.contains("ap-settings"))) return;
  for (const row of el.querySelectorAll(".ap-row")) {
    const key = "number/" + row.dataset.num, input = row.querySelector("input");
    if (key in draft || document.activeElement === input) continue;
    const v = current(key);
    input.value = v == null ? "" : v;
  }
  if (!("select/LED mode" in draft)) {
    const v = current("select/LED mode");
    for (const r of el.querySelectorAll('input[name="ap-led"]')) r.checked = r.value === v;
  }
  for (const b of el.querySelectorAll(".ap-langs button")) b.classList.toggle("on", b.dataset.l === lang);
  const gen = hasGeneric();
  $("ap-g-setup").hidden = !gen;
  $("ap-token-row").hidden = !S["text/Telegram bot token"];
  if (gen) {
    renderTzOptions();
    const tz = $("ap-tz");
    if (!("select/Time zone" in draft) && document.activeElement !== tz) tz.value = current("select/Time zone") ?? "UTC";
    const phoneOk = PHONE_TZ && [...tz.options].some((o) => o.value === PHONE_TZ) && tz.value !== PHONE_TZ;
    $("ap-tz-phone").hidden = !phoneOk;
    if (phoneOk) $("ap-tz-phone").querySelector(".ap-il").textContent = `${t("s_tz_use")} (${PHONE_TZ.replace(/_/g, " ")})`;
    const sr = $("ap-setup-room");
    if (!("text/Room name" in draft) && document.activeElement !== sr) sr.value = current("text/Room name") ?? "";
    const us = $("ap-user");
    if (!("text/Dashboard username" in draft) && document.activeElement !== us) us.value = current("text/Dashboard username") ?? "";
    const hk = txt("text_sensor/Home Assistant key");
    $("ap-hakey-box").hidden = !hk;
    if (hk) $("ap-v-hakey").textContent = hk.slice(0, 6) + "…" + hk.slice(-4);
    $("ap-v-setup").textContent = on("binary_sensor/Setup needed") ? "!" : "✓";
  }
  const u = updateInfo();
  $("ap-upd").hidden = !u;
  if (u) $("ap-v-upd").textContent = u.state === "UPDATE AVAILABLE" ? t("s_upd_new", { v: u.latest })
    : u.state === "INSTALLING" ? t("s_upd_busy") : `${t("s_upd_ok")}${u.current ? " · " + u.current : ""}`;
  $("ap-self-addr").textContent = t("s_addr", { x: SELF_HOST });
  const rn = $("ap-room-name");
  if (!("text/Room name" in draft) && document.activeElement !== rn) rn.value = current("text/Room name") ?? "";
  const icon = $("ap-room-emoji");
  $("ap-own-emoji").hidden = !S[ICON_KEY];
  if (!(ICON_KEY in draft) && document.activeElement !== icon) icon.value = myEmoji();
  if (page === "rooms") renderRoomsPage();
  $("ap-v-rooms").textContent = myRoom();
  // Current values shown in the menu
  const cur = LANGS.find((l) => l[0] === lang);
  $("ap-v-lang").textContent = `${cur[1]} ${cur[2]}`;
  const led = "select/LED mode" in draft ? draft["select/LED mode"] : current("select/LED mode");
  $("ap-v-light").textContent = LED_OPTS.includes(led) ? t("l" + LED_OPTS.indexOf(led)) : "";
  const hl = current("number/Heart rate low threshold"), hh = current("number/Heart rate high threshold");
  $("ap-v-alerts").textContent = hl != null && hh != null ? `${hl}–${hh} bpm` : "";
  const tgOn = TG_EVENTS.some(([sw]) => current("switch/" + sw) === true);
  $("ap-v-tg").textContent = t(tgOn ? "on" : "off");
  $("ap-v-tg2").textContent = t(tgOn ? "on" : "off");
  const room = current("text/Room name"), ver = txt("text_sensor/Firmware version");
  $("ap-about").textContent = ["Hearthbeat", room, ver && ver.split(" ")[0]].filter(Boolean).join(" · ");
  const hasTg = !!S["switch/Telegram alert started"];
  $("ap-g-notif").hidden = !hasTg;
  $("ap-setup-return").hidden = !setupPending();
  if (!hasTg && page === "telegram") showPage("home");
  if (hasTg) {
    const cmdBox = el.querySelector(".ap-tg-cmd input");
    el.querySelector(".ap-tg-cmd").hidden = !S["switch/Telegram chat commands"];
    if (!("switch/Telegram chat commands" in draft)) cmdBox.checked = current("switch/Telegram chat commands") !== false;
    const chat = $("ap-tg-chat");
    if (!("text/Telegram chat ID" in draft) && document.activeElement !== chat) chat.value = current("text/Telegram chat ID") ?? "";
    for (const ev of el.querySelectorAll(".ap-tg-ev")) {
      const box = ev.querySelector('input[type="checkbox"]'), area = ev.querySelector("textarea");
      if (!(("switch/" + ev.dataset.sw) in draft)) box.checked = current("switch/" + ev.dataset.sw) !== false;
      ev.classList.toggle("off", !box.checked);
      if (!(("text/" + ev.dataset.msg) in draft) && document.activeElement !== area)
        area.value = (current("text/" + ev.dataset.msg) ?? "").replace(/\\n/g, "\n");
      autosize(area);
    }
  }
  renderSetupGuide();
  renderHousehold();
  updateSaveBar();
}

function post(url, body = "") {
  // Always send a (possibly empty) form body: the sensor requires Content-Length, and long texts fit there
  return fetch(url, { method: "POST", body, credentials: "same-origin",
    headers: { "Content-Type": "application/x-www-form-urlencoded" } }).then((r) => r.ok).catch(() => false);
}

const sendTestAlert = () => post("/button/Send%20test%20notification/press");
let settingsSaving = false;
async function save(keys = Object.keys(draft)) {
  if (settingsSaving) return false;
  settingsSaving = true;
  const btn = $("ap-save");
  btn.disabled = true;
  btn.textContent = t("s_saving");
  let ok = true;
  for (const key of keys) {
    if (!(key in draft)) continue;
    if (!ok && key === "text/Dashboard password") continue;
    const v = draft[key];
    const [domain, name] = [key.slice(0, key.indexOf("/")), key.slice(key.indexOf("/") + 1)];
    const base = `/${domain}/${encodeURIComponent(name)}`;
    let done;
    if (domain === "switch") done = await post(`${base}/${v ? "turn_on" : "turn_off"}`);
    else if (domain === "text") done = await post(`${base}/set`, `value=${encodeURIComponent(v)}`);
    else done = await post(`${base}/set?${domain === "select" ? "option" : "value"}=${encodeURIComponent(v)}`);
    if (done) {
      S[key] = Object.assign(S[key] || {}, domain === "switch" ? { value: v, state: v ? "ON" : "OFF" }
        : domain === "select" || domain === "text" ? { state: v, value: v } : { value: +v, state: String(v) });
      if (draft[key] === v) delete draft[key];
    } else ok = false;
  }
  settingsSaving = false;
  btn.textContent = t("s_save");
  refreshSettings(true);
  if (page === "telegram") refreshHousehold();
  render();
  renderRoomMenu();
  if (!("text/Dashboard password" in draft)) { $("ap-pass").value = ""; $("ap-pass2").value = ""; }
  if (!("text/Telegram bot token" in draft)) $("ap-token").value = "";
  flash(ok ? t("s_saved") + " ✓" : t("s_err"), !ok);
  return ok;
}

function applyLang() {
  document.documentElement.lang = lang;
  for (const el of document.querySelectorAll("[data-t]")) el.textContent = t(el.dataset.t);
  $("ap-adv").setAttribute("aria-label", t("settings"));
  $("ap-adv").title = t("settings");
  const cur = LANGS.find((l) => l[0] === lang);
  $("ap-lang-btn").innerHTML = `<span>${cur[1]}</span>${cur[0].toUpperCase()}`;
  $("ap-lang-btn").title = t("lang");
  for (const b of $("ap-lang-menu").querySelectorAll("button")) b.classList.toggle("on", b.dataset.l === lang);
  setLive(connected);
  render();
  refreshSettings(true);
  renderDiscovery();
  renderOverview();
  if ($("ap-stitle")) $("ap-stitle").textContent = t(PAGE_TITLES[page]);
}

function setLive(state) {
  connected = state;
  refreshConnection();
  schedule();
}

function refreshConnection() {
  const live = streamIsLive();
  $("ap-live").classList.toggle("on", live);
  $("ap-live-t").textContent = t(live ? "live" : connected === null ? "connecting" : "reconnecting");
}

function spark(id, data, color) {
  const el = $(id);
  const now = Date.now();
  const pts = data.filter((p) => now - p.t < HIST_MS);
  if (pts.length < 2) { el.innerHTML = ""; return; }
  let lo = Math.min(...pts.map((p) => p.v)), hi = Math.max(...pts.map((p) => p.v));
  if (hi - lo < 6) { const m = (hi + lo) / 2; lo = m - 3; hi = m + 3; }
  const x = (tm) => 300 * (1 - (now - tm) / HIST_MS);
  const y = (v) => 50 - 44 * (v - lo) / (hi - lo);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${x(p.t).toFixed(1)},${y(p.v).toFixed(1)}`).join("");
  const last = pts[pts.length - 1];
  el.innerHTML = `<path d="${d}L${x(last.t).toFixed(1)},56L${x(pts[0].t).toFixed(1)},56Z" fill="${color}" opacity=".10"/>
    <path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
}

function render() {
  const sc = $("ap-setup-card");
  sc.hidden = !hasGeneric() || !setupPending();
  refreshConnection();
  renderSetupGuide();
  renderOverview();
  // Status hero
  const status = txt("text_sensor/Status");
  const live = streamIsLive();
  const stale = !live || !lastReadingAt || lastReadingAt < streamOpenedAt;
  let mood = "calm";
  if (stale || !status) mood = connected === false || lastContactAt > 0 && !live ? "warn" : "idle";
  else if (status.startsWith("ALERT")) mood = "alert";
  else if (status.startsWith("Nobody")) mood = "idle";
  else if (/Visitor|too far|measuring/.test(status)) mood = "warn";
  $("ap-hero").className = `ap-card ap-hero ap-span ${mood}`;
  $("ap-dot").innerHTML = ICONS[mood];
  const seen = txt("text_sensor/Last seen");
  const statusTitle = stale
    ? t(connected === false || lastContactAt > 0 && !live ? "h_offline" : "h_waiting")
    : trStatus(status);
  const statusDetails = stale ? (lastReadingAt ? t("h_last_reading", { x: timeAgo(lastReadingAt) }) : "")
    : status === "Present, moving" ? t("movingHint")
    : seen ? (seen === "Now" ? t("seenNow") : t("lastSeen", { x: trSeen(seen) })) : "";
  $("ap-status-label").hidden = stale;
  if ($("ap-status").textContent !== statusTitle) $("ap-status").textContent = statusTitle;
  if ($("ap-seen").textContent !== statusDetails) $("ap-seen").textContent = statusDetails;

  // Vitals: show the 1-minute average, fall back to the live value
  const hrAvg = num("sensor/Heart rate 1 min average"), hrRaw = num("sensor/Heart rate");
  const brAvg = num("sensor/Breathing rate 1 min average"), brRaw = num("sensor/Breathing rate");
  const present = on("binary_sensor/Presence");
  const hr = present ? (hrAvg ?? (hrRaw > 0 ? hrRaw : null)) : null;
  const br = present ? (brAvg ?? (brRaw > 0 ? brRaw : null)) : null;
  $("ap-hr").textContent = fmt(hr);
  $("ap-br").textContent = fmt(br);
  $("ap-hr-sub").textContent = stale ? (hr ? t("h_previous") : "") : present && hrRaw > 0 ? t("avgNow", { v: fmt(hrRaw) }) : t("avg");
  $("ap-br-sub").textContent = stale ? (br ? t("h_previous") : "") : present && brRaw > 0 ? t("avgNow", { v: fmt(brRaw) }) : t("avg");
  const heart = $("ap-heart"), lung = $("ap-lung");
  heart.classList.toggle("beat", !!hr && !stale);
  if (hr) heart.style.setProperty("--period", `${(60 / hr).toFixed(2)}s`);
  lung.classList.toggle("breathe", !!br && !stale);
  if (br) lung.style.setProperty("--period", `${(60 / br).toFixed(2)}s`);
  $("ap-hr-min").textContent = fmt(num("sensor/Heart rate min today"));
  $("ap-hr-max").textContent = fmt(num("sensor/Heart rate max today"));
  $("ap-br-min").textContent = fmt(num("sensor/Breathing rate min today"));
  $("ap-br-max").textContent = fmt(num("sensor/Breathing rate max today"));
  const css = getComputedStyle(document.documentElement);
  spark("ap-hr-spark", hist.hr, css.getPropertyValue("--heart").trim());
  spark("ap-br-spark", hist.br, css.getPropertyValue("--breath").trim());

  // Sleep
  const bed = txt("text_sensor/Bedtime"), wake = txt("text_sensor/Wake-up time");
  $("ap-bed").textContent = /^\d/.test(bed || "") ? bed : "–";
  $("ap-wake").textContent = /^\d/.test(wake || "") ? wake : (wake === "Still asleep" ? t("asleep") : "–");
  const hrs = num("sensor/Time in bed");
  $("ap-hours").textContent = hrs == null ? "–" : `${Math.floor(hrs)}h ${String(Math.round((hrs % 1) * 60)).padStart(2, "0")}`;
  $("ap-ups").textContent = fmt(num("sensor/Night wakings"));

  // Room
  const d = num("sensor/Distance");
  $("ap-dist").textContent = present && d > 0 ? `${(d / 100).toFixed(1)} m` : "–";
  $("ap-people").textContent = present ? fmt(num("sensor/People count")) : "0";
  const lux = num("sensor/Ambient light");
  $("ap-lux").textContent = lux == null ? "–" : `${lux < 10 ? lux.toFixed(1) : Math.round(lux)} lx`;
  const day = txt("text_sensor/Time of day");
  $("ap-day").textContent = day ? (DAY_KEYS[day] ? t(DAY_KEYS[day]) : "–") : "–";
  const name = myRoom();
  $("ap-room").textContent = name ? `${displayEmoji(myEmoji())} ${name}` : "–";

  // Footer diagnostics
  const q = num("sensor/Data quality last hour");
  const wifi = num("sensor/WiFi signal");
  const up = txt("text_sensor/Uptime");
  $("ap-foot").innerHTML = [
    on("binary_sensor/Radar not responding") ? `<span class="bad">${t("radarBad")}</span>` : `<span>${t("radarOk")}</span>`,
    `<span>${t("quality", { x: q == null ? "–" : Math.round(q) + "%" })}</span>`,
    `<span>${t("wifi", { x: wifi == null ? "–" : t(wifi >= -60 ? "w1" : wifi >= -70 ? "w2" : wifi >= -80 ? "w3" : "w4") })}</span>`,
    up ? `<span>${t("up", { x: up })}</span>` : "",
  ].join("");
}

function connect() {
  const es = new EventSource("/events");
  es.addEventListener("open", () => {
    streamOpenedAt = lastContactAt = Date.now();
    setLive(true);
    refreshHousehold();
  });
  es.addEventListener("error", () => setLive(false));
  es.addEventListener("ping", () => {
    lastContactAt = Date.now();
    schedule();
  });
  let setupOpened = false;
  es.addEventListener("state", (e) => {
    let d; try { d = JSON.parse(e.data); } catch { return; }
    if (!d.name_id) return;
    S[d.name_id] = Object.assign(S[d.name_id] || {}, d);
    const now = Date.now();
    lastContactAt = now;
    if (d.name_id === "text_sensor/Status") lastReadingAt = now;
    if (d.name_id === "sensor/Heart rate" && d.value > 0) hist.hr.push({ t: now, v: d.value });
    if (d.name_id === "sensor/Breathing rate" && d.value > 0) hist.br.push({ t: now, v: d.value });
    for (const k of ["hr", "br"]) while (hist[k].length && now - hist[k][0].t > HIST_MS) hist[k].shift();
    schedule();
    if (/^(number|select|button|switch|text|update|binary_sensor\/Setup)/.test(d.name_id)) refreshSettings();
    if (d.name_id === ROOMS_KEY) {
      mergeRoomsFromUrl();
      renderDiscovery();
    }
    if (d.name_id === ICON_KEY) syncLinkedEmoji();
    if (d.name_id === "switch/Telegram alert started") showHouseholdInvite();
    if (!setupOpened && location.hash === "#setup" && hasGeneric() && S["binary_sensor/Setup needed"]) {
      setupOpened = true;
      openSetupGuide();
    }
    if (d.name_id === "update/Firmware update" && location.hash === "#software-update") {
      history.replaceState(null, "", location.pathname + location.search);
      showView("settings");
      const control = $("ap-upd");
      control.focus({ preventScroll: true });
      control.scrollIntoView({ block: "center" });
    }
  });
}

let pending = false;
function schedule() {
  if (pending) return;
  pending = true;
  requestAnimationFrame(() => { pending = false; render(); });
}

readHouseholdInvite();
build();
applyLang();
connect();
if (overview) showOverview(true);
setInterval(render, 5000);
setInterval(() => {
  if (overview && !document.body.classList.contains("ap-settings") && !document.hidden && streamIsLive()) scanSensors();
}, 30000);
setInterval(() => {
  if (household && document.body.classList.contains("ap-settings") && !document.hidden &&
      (page === "telegram" || page === "setup")) refreshHousehold();
}, 10000);
