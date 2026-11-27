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
const t = (k, vars = {}) => (T[lang][k] ?? T.en[k] ?? k).replace(/\{(\w+)\}/g, (_, n) => vars[n] ?? "");

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
let connected = null;

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
      <span class="ap-room" id="ap-room">–</span>
      <div class="ap-lang">
        <button class="ap-btn ap-flag" id="ap-lang-btn" aria-haspopup="true" aria-expanded="false"></button>
        <div class="ap-menu" id="ap-lang-menu" role="menu" hidden></div>
      </div>
      <button class="ap-btn" id="ap-adv" data-t="settings"></button>
    </div>
  </header>

  <div class="ap-grid">
    <section class="ap-card ap-hero ap-span" id="ap-hero">
      <div class="ap-dot" id="ap-dot">${ICONS.idle}</div>
      <div><div class="ap-label" data-t="now"></div><h1 id="ap-status"></h1><p id="ap-seen"></p></div>
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
  <div class="ap-note" data-t="note"></div>`;
  document.body.prepend(root);

  const back = document.createElement("div");
  back.id = "ap-back";
  back.innerHTML = `<div class="ap-brand"><div class="ap-logo">${LOGO}</div><div class="ap-word" data-t="settings"></div></div>
    <button class="ap-btn" id="ap-home" data-t="s_done"></button>`;
  document.body.prepend(back);

  $("ap-adv").onclick = () => showView("settings");
  $("ap-home").onclick = () => showView("settings");
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
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}


// ---------------------------------------------------------------------------
// Friendly settings page (thresholds, status light, language, sensor actions)
// ---------------------------------------------------------------------------
const draft = {};   // unsaved edits: "number/<name>" or "select/LED mode" -> value

function showView(v) {
  document.body.classList.toggle("ap-settings", v === "settings");
  document.body.classList.toggle("ap-advanced", v === "advanced");
  scrollTo(0, 0);
  if (v === "settings") refreshSettings(true);
}

function numRow([name, label, unit, min, max, step]) {
  return `<div class="ap-row" data-num="${name}">
    <label class="ap-row-l" data-t="${label}"></label>
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
  <header class="ap-head">
    <div class="ap-brand"><div class="ap-logo">${LOGO}</div><div class="ap-word" data-t="settings"></div></div>
    <button class="ap-btn" id="ap-set-done" data-t="s_done"></button>
  </header>

  <section class="ap-card ap-sec">
    <div class="ap-label" data-t="s_lang"></div>
    <div class="ap-langs">${LANGS.map(([c, f, n]) => `<button type="button" class="ap-chip" data-l="${c}"><span>${f}</span>${n}</button>`).join("")}</div>
    <div class="ap-hint" data-t="s_lang_h"></div>
  </section>

  <section class="ap-card ap-sec">
    <div class="ap-label" data-t="s_alerts"></div>
    <div class="ap-hint" data-t="s_alerts_h"></div>
    ${NUMS.map(numRow).join("")}
  </section>

  <section class="ap-card ap-sec">
    <div class="ap-label" data-t="s_led"></div>
    <div class="ap-radios">${LED_OPTS.map((o, i) => `<label class="ap-radio"><input type="radio" name="ap-led" value="${o}"><span data-t="l${i}"></span></label>`).join("")}</div>
    ${numRow(DARK)}
  </section>

  <section class="ap-card ap-sec">
    <div class="ap-label" data-t="s_dev"></div>
    <div class="ap-actions">
      <button type="button" class="ap-btn" id="ap-reset" data-t="s_reset"></button>
      <button type="button" class="ap-btn" id="ap-restart" data-t="s_restart"></button>
      <button type="button" class="ap-btn" id="ap-test" data-t="s_test" hidden></button>
    </div>
    <a href="#" class="ap-adv-link" id="ap-adv-link" data-t="s_adv"></a>
  </section>

  <div class="ap-savebar" id="ap-savebar">
    <span id="ap-save-msg"></span>
    <div><button type="button" class="ap-btn" id="ap-undo" data-t="s_undo"></button>
    <button type="button" class="ap-btn ap-primary" id="ap-save" data-t="s_save"></button></div>
  </div>`;
  document.body.prepend(el);

  $("ap-set-done").onclick = () => {
    if (Object.keys(draft).length && !confirm(t("s_unsaved") + ". " + t("s_undo") + "?")) return;
    clearDraft();
    showView("home");
  };
  $("ap-adv-link").onclick = (e) => { e.preventDefault(); showView("advanced"); };

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

  $("ap-undo").onclick = () => { clearDraft(); refreshSettings(true); };
  $("ap-save").onclick = save;
  $("ap-reset").onclick = () => post(`/button/${encodeURIComponent("Reset min and max today")}/press`).then((ok) => flash(ok ? t("s_saved") : t("s_err"), !ok));
  $("ap-test").onclick = () => post(`/button/${encodeURIComponent("Send test notification")}/press`).then((ok) => flash(ok ? "✓" : t("s_err"), !ok));
  $("ap-restart").onclick = () => { if (confirm(t("s_restart_c"))) post(`/button/${encodeURIComponent("Restart sensor")}/press`); };
}

function current(key) {
  const s = S[key];
  if (!s) return null;
  return key.startsWith("select/") ? s.state ?? s.value : s.value;
}

function markDraft(key, v) {
  if (String(current(key)) === String(v)) delete draft[key]; else draft[key] = v;
  updateSaveBar();
}
function clearDraft() { for (const k of Object.keys(draft)) delete draft[k]; updateSaveBar(); }

function updateSaveBar(msg, bad) {
  const dirty = Object.keys(draft).length > 0;
  $("ap-savebar").classList.toggle("show", dirty || !!msg);
  $("ap-save").disabled = !dirty;
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
  $("ap-test").hidden = !S["button/Send test notification"];
  updateSaveBar();
}

function post(url) {
  // An explicit empty body makes browsers send Content-Length: 0, which the sensor requires
  return fetch(url, { method: "POST", body: "", credentials: "same-origin" }).then((r) => r.ok).catch(() => false);
}

async function save() {
  const btn = $("ap-save");
  btn.disabled = true;
  btn.textContent = t("s_saving");
  let ok = true;
  for (const [key, v] of Object.entries(draft)) {
    const [domain, name] = [key.slice(0, key.indexOf("/")), key.slice(key.indexOf("/") + 1)];
    const q = domain === "select" ? `option=${encodeURIComponent(v)}` : `value=${encodeURIComponent(v)}`;
    if (await post(`/${domain}/${encodeURIComponent(name)}/set?${q}`)) {
      S[key] = Object.assign(S[key] || {}, domain === "select" ? { state: v, value: v } : { value: +v, state: String(v) });
      delete draft[key];
    } else ok = false;
  }
  btn.textContent = t("s_save");
  flash(ok ? t("s_saved") + " ✓" : t("s_err"), !ok);
  refreshSettings(true);
}

function applyLang() {
  document.documentElement.lang = lang;
  for (const el of document.querySelectorAll("[data-t]")) el.textContent = t(el.dataset.t);
  const cur = LANGS.find((l) => l[0] === lang);
  $("ap-lang-btn").innerHTML = `<span>${cur[1]}</span>${cur[0].toUpperCase()}`;
  $("ap-lang-btn").title = t("lang");
  for (const b of $("ap-lang-menu").querySelectorAll("button")) b.classList.toggle("on", b.dataset.l === lang);
  setLive(connected);
  render();
  refreshSettings(true);
}

function setLive(state) {
  connected = state;
  $("ap-live").classList.toggle("on", state === true);
  $("ap-live-t").textContent = state === true ? t("live") : state === false ? t("reconnecting") : t("connecting");
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
  // Status hero
  const status = txt("text_sensor/Status");
  let mood = "calm";
  if (!status) mood = "idle";
  else if (status.startsWith("ALERT")) mood = "alert";
  else if (status.startsWith("Nobody")) mood = "idle";
  else if (/Visitor|too far|measuring/.test(status)) mood = "warn";
  $("ap-hero").className = `ap-card ap-hero ap-span ${mood}`;
  $("ap-dot").innerHTML = ICONS[mood];
  $("ap-status").textContent = trStatus(status);
  const seen = txt("text_sensor/Last seen");
  $("ap-seen").textContent = status === "Present, moving" ? t("movingHint")
    : seen ? (seen === "Now" ? t("seenNow") : t("lastSeen", { x: trSeen(seen) })) : "";

  // Vitals: show the 1-minute average, fall back to the live value
  const hrAvg = num("sensor/Heart rate 1 min average"), hrRaw = num("sensor/Heart rate");
  const brAvg = num("sensor/Breathing rate 1 min average"), brRaw = num("sensor/Breathing rate");
  const present = on("binary_sensor/Presence");
  const hr = present ? (hrAvg ?? (hrRaw > 0 ? hrRaw : null)) : null;
  const br = present ? (brAvg ?? (brRaw > 0 ? brRaw : null)) : null;
  $("ap-hr").textContent = fmt(hr);
  $("ap-br").textContent = fmt(br);
  $("ap-hr-sub").textContent = present && hrRaw > 0 ? t("avgNow", { v: fmt(hrRaw) }) : t("avg");
  $("ap-br-sub").textContent = present && brRaw > 0 ? t("avgNow", { v: fmt(brRaw) }) : t("avg");
  const heart = $("ap-heart"), lung = $("ap-lung");
  heart.classList.toggle("beat", !!hr);
  if (hr) heart.style.setProperty("--period", `${(60 / hr).toFixed(2)}s`);
  lung.classList.toggle("breathe", !!br);
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
  $("ap-room").textContent = txt("text_sensor/Room") || "–";

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
  es.addEventListener("open", () => setLive(true));
  es.addEventListener("error", () => setLive(false));
  es.addEventListener("state", (e) => {
    let d; try { d = JSON.parse(e.data); } catch { return; }
    if (!d.name_id) return;
    S[d.name_id] = Object.assign(S[d.name_id] || {}, d);
    const now = Date.now();
    if (d.name_id === "sensor/Heart rate" && d.value > 0) hist.hr.push({ t: now, v: d.value });
    if (d.name_id === "sensor/Breathing rate" && d.value > 0) hist.br.push({ t: now, v: d.value });
    for (const k of ["hr", "br"]) while (hist[k].length && now - hist[k][0].t > HIST_MS) hist[k].shift();
    schedule();
    if (/^(number|select|button)\//.test(d.name_id)) refreshSettings();
  });
}

let pending = false;
function schedule() {
  if (pending) return;
  pending = true;
  requestAnimationFrame(() => { pending = false; render(); });
}

build();
applyLang();
connect();
setInterval(render, 15000);
