/**
 * Centralized translation dictionary for SANKET Bharat.
 * Supports: English (en) and Hindi (hi).
 *
 * Rules:
 *  - Technical identifiers (INC-XXXX, API field names, URLs) are NOT translated.
 *  - No new claims are introduced via translation.
 */

export type Lang = 'en' | 'hi'

export interface TranslationDict {
  nav: {
    home: string
    liveMap: string
    dashboard: string
    aiAnalysis: string
    admin: string
    reportEmergency: string
    navigate: string
    openLiveMap: string
  }
  hero: {
    demoChip: string
    headline1: string
    headline2: string
    headline3: string
    body: string
    cta_report: string
    cta_map: string
    stat_triage_value: string
    stat_triage_label: string
    stat_score_label: string
    stat_langs_label: string
    stat_lives_label: string
    scroll: string
  }
  features: {
    eyebrow: string
    titlePart1: string
    titleGradient: string
    description: string
  }
  pipeline: {
    eyebrow: string
    titlePart1: string
    titleGradient: string
    titlePart2: string
    description: string
    stageLabels: Record<string, string>
  }
  statistics: {
    eyebrow: string
    titlePart1: string
    titleGradient: string
    description: string
  }
  about: {
    eyebrow: string
    titlePart1: string
    titleGradient: string
  }
  faq: {
    eyebrow: string
    titlePart1: string
    titleGradient: string
    description: string
  }
  report: {
    badge: string
    title: string
    titleGradient: string
    subtitle: string
    secureIntake: string
    section1Title: string
    section1Eyebrow: string
    section2Title: string
    section2Eyebrow: string
    section3Title: string
    section3Eyebrow: string
    section4Title: string
    section4Eyebrow: string
    locationPlaceholder: string
    locationSrLabel: string
    coordinatesLabel: string
    useCurrentLocation: string
    locating: string
    descriptionLabel: string
    descriptionHint: string
    descriptionPlaceholder: string
    peopleAffectedLabel: string
    peopleAffectedHint: string
    severityLabel: string
    addImageLabel: string
    addImageHint: string
    browse: string
    nameLabel: string
    namePlaceholder: string
    contactLabel: string
    aiPreviewTitle: string
    aiPreviewBody: string
    aiConfidenceLabel: string
    detectedTypeLabel: string
    severityDisplayLabel: string
    duplicateWarning: string
    beforeSubmitTitle: string
    beforeSubmitBody: string
    submitButton: string
    encryptedLabel: string
    types: Record<string, string>
    severity: Record<string, string>
    successBadge: string
    successHeadline: string
    successBody: string
    incidentIdLabel: string
    awaitingVerification: string
    submitAnother: string
    viewInAdmin: string
    onlineBadge: string
    offlineBadge: string
    offlineFeedbackMode: string
    offlineFeedbackSyncing: string
    offlineFeedbackSynced: string
    offlineSavedTitle: string
    offlineSavedBody: string
    localIdLabel: string
    offlineQueueTitle: string
    offlineQueueWaiting: string
    offlineQueueSynced: string
    offlineStatusQueued: string
    offlineStatusSyncing: string
    offlineStatusSynced: string
    offlineStatusFailed: string
    retrySync: string
    syncNow: string
    relayTitle: string
    relayBadge: string
    relayText: string
    relaySecondaryText: string
  }
  dashboard: {
    panelIncidentTrend: string
    hintIncidentTrend: string
    panelSeverityDist: string
    hintSeverityDist: string
    panelResponseTime: string
    hintResponseTime: string
    panelPressureHeat: string
    hintPressureHeat: string
    panelCritical: string
    panelAlertFeed: string
  }
  admin: {
    workflowTitle: string
    workflowSteps: Record<string, string>
    workflowDetails: Record<string, string>
    alertsTitle: string
    activityTitle: string
    alertItems: Record<string, string>
    tabOverview: string
    tabVerification: string
    tabEvidence: string
    tabAiReview: string
    tabAudit: string
    tabIncidents: string
    headerTitle: string
    headerSubtitle: string
  }
  aiAnalysis: {
    eyebrow: string
    title: string
    description: string
    incidentSelectorLabel: string
    panelSignalIngestion: string
    panelSocialSource: string
    panelEvidence: string
    panelAiRecommendation: string
    noIncidentSelected: string
    metricsAiScore: string
    metricsConfidence: string
    metricsSeverity: string
    metricsStatus: string
  }
  liveMap: {
    title: string
    allSeverities: string
    allTypes: string
    filterLabel: string
    incidentCount: string
    noIncidents: string
  }
  footer: {
    tagline: string
    prototypeBadge: string
    reportEmergency: string
    copyright: string
    langNote: string
  }
  common: {
    loading: string
    status: Record<string, string>
    severity: Record<string, string>
    prototypeLabel: string
    humanInLoop: string
    viewDetails: string
    approve: string
    reject: string
    close: string
  }
  langSelector: {
    label: string
    en: string
    hi: string
    note: string
  }
}

export const translations: Record<Lang, TranslationDict> = {
  en: {
    nav: {
      home: 'Home',
      liveMap: "Demo Map",
      dashboard: 'Dashboard',
      aiAnalysis: "Demo Analysis",
      admin: 'Admin',
      reportEmergency: "Try Demo Intake",
      navigate: 'Navigate',
      openLiveMap: "Open Demo Map",
    },
    hero: {
      demoChip: "Browser-only demo · synthetic data",
      headline1: "Human-led",
      headline2: "Crisis Review",
      headline3: "Prototype",
      body: "Explore local intake, illustrative source notes and simulated review. No authority, live feed, model service or dispatch is connected.",
      cta_report: "Try Demo Intake",
      cta_map: "Open Demo Map",
      stat_triage_value: "Simulated",
      stat_triage_label: "Review workflow",
      stat_score_label: "Model confidence",
      stat_langs_label: "Partial interface languages",
      stat_lives_label: "Emergency outcomes",
      scroll: 'Scroll',
    },
    features: {
      eyebrow: 'Capabilities',
      titlePart1: "Explore the current",
      titleGradient: "demo modules",
      description: "Local prototype capabilities and their limits. No operational AI or emergency service is implemented.",
    },
    pipeline: {
      eyebrow: 'Pipeline',
      titlePart1: "From local input to",
      titleGradient: "simulated review",
      titlePart2: "inside this browser",
      description: "These steps demonstrate a proposed human review workflow. They do not establish authority receipt or response.",
      stageLabels: {
        'INTAKE': 'INTAKE',
        'ANALYSIS': 'ANALYSIS',
        'EVIDENCE': 'EVIDENCE',
        'HUMAN REVIEW': 'HUMAN REVIEW',
        'COORDINATION': 'COORDINATION',
      },
    },
    statistics: {
      eyebrow: "Measured outcomes unavailable",
      titlePart1: "What has",
      titleGradient: "not been established",
      description: "No real emergency outcomes, operational throughput, model accuracy or response-time results have been measured.",
    },
    about: {
      eyebrow: 'About',
      titlePart1: 'The deadliest hour is the one',
      titleGradient: 'nobody could see',
    },
    faq: {
      eyebrow: 'Questions',
      titlePart1: "Understand the",
      titleGradient: "prototype limits",
      description: 'Verification, model inputs, offline behaviour and integration — answered without the marketing layer.',
    },
    report: {
      badge: "Demo input only",
      title: "Try a",
      titleGradient: "demo report",
      subtitle: "Use synthetic details only. This adds a local browser example; no authority receives it and no help or dispatch is arranged. For real emergencies use established emergency services.",
      secureIntake: "Local browser demo",
      section1Title: 'What is happening?',
      section1Eyebrow: '01 / Signal type',
      section2Title: 'Where is it happening?',
      section2Eyebrow: '02 / Geospatial signal',
      section3Title: 'Tell us what you know',
      section3Eyebrow: '03 / Incident details',
      section4Title: "Optional synthetic contact details",
      section4Eyebrow: '04 / Reporter details',
      locationPlaceholder: 'Enter a landmark, street or area',
      locationSrLabel: 'Manual location',
      coordinatesLabel: "Coordinates:",
      useCurrentLocation: "Location capture unavailable",
      locating: "Not available",
      descriptionLabel: 'Description',
      descriptionHint: 'Be specific about what you see',
      descriptionPlaceholder: 'Describe the situation, visible damage, hazards and anything responders should know...',
      peopleAffectedLabel: 'People affected',
      peopleAffectedHint: 'Approximate count',
      severityLabel: 'Urgency / severity',
      addImageLabel: 'Add an image',
      addImageHint: "Optional image selection · local storage only",
      browse: 'Browse',
      nameLabel: 'Name',
      namePlaceholder: 'Your full name',
      contactLabel: 'Contact number',
      aiPreviewTitle: "Demo input summary",
      aiPreviewBody: "Hazard and urgency are selected by you. Authenticity, duplicate matching, location and model confidence are not assessed.",
      aiConfidenceLabel: "Model confidence",
      detectedTypeLabel: "Selected type",
      severityDisplayLabel: 'Severity',
      duplicateWarning: "Duplicate matching: not available. No nearby report search is performed.",
      beforeSubmitTitle: 'Before you submit',
      beforeSubmitBody: 'Only report what you can observe firsthand. If you are in immediate danger, move to safety first and call local emergency services.',
      submitButton: "Add Local Demo Report",
      encryptedLabel: "Stored in this browser · No authority receipt",
      types: { Flood: 'Flood', Fire: 'Fire', Earthquake: 'Earthquake', Cyclone: 'Cyclone', Landslide: 'Landslide', Other: 'Other' },
      severity: { Moderate: 'Moderate', High: 'High', Critical: 'Critical' },
      successBadge: "Local demo input added",
      successHeadline: "Added to this browser demo.",
      successBody: "No authority has received this example. No help, dispatch or communication was arranged. It appears in this browser’s simulated review queue.",
      incidentIdLabel: 'Incident ID',
      awaitingVerification: "Pending simulated review",
      submitAnother: 'Submit another report',
      viewInAdmin: 'View in Admin Verification Queue',
      onlineBadge: "Browser reports online",
      offlineBadge: "Browser reports offline",
      offlineFeedbackMode: "Local IndexedDB queue only; nothing sent.",
      offlineFeedbackSyncing: "Copying local queued examples into this browser demo.",
      offlineFeedbackSynced: "Copied locally; no server or authority receipt.",
      offlineSavedTitle: "Example queued on this device",
      offlineSavedBody: "Stored in IndexedDB on this device. While the app is open, it can be copied into local demo state. No upload or background delivery exists.",
      localIdLabel: 'Local Queue ID',
      offlineQueueTitle: "Local Offline Queue",
      offlineQueueWaiting: 'Offline queue: {count} reports waiting',
      offlineQueueSynced: "Examples copied locally",
      offlineStatusQueued: 'Queued',
      offlineStatusSyncing: "Copying locally",
      offlineStatusSynced: "Copied locally",
      offlineStatusFailed: 'Failed / Retry',
      retrySync: "Retry Local Copy",
      syncNow: "Copy to Local Demo",
      relayTitle: 'Offline Relay Network',
      relayBadge: "NOT IMPLEMENTED",
      relayText: "Nearby-device relay is a future concept, not an implemented capability.",
      relaySecondaryText: "No Bluetooth, Wi-Fi relay, messaging fallback or server upload is provided.",
    },
    dashboard: {
      panelIncidentTrend: 'Incident trend',
      hintIncidentTrend: "Illustrative chart · fixed sample values",
      panelSeverityDist: 'Severity distribution',
      hintSeverityDist: "Illustrative sample mix",
      panelResponseTime: 'Response time analytics',
      hintResponseTime: "Illustrative chart · not measured",
      panelPressureHeat: 'Pressure heatmap',
      hintPressureHeat: "Illustrative matrix · not sensor data",
      panelCritical: 'Critical incidents',
      panelAlertFeed: 'Alert feed',
    },
    admin: {
      workflowTitle: 'Human-in-the-Loop Workflow',
      workflowSteps: {
        'Incoming report': 'Incoming report',
        'AI analysis': 'AI analysis',
        'Confidence / risk': 'Confidence / risk',
        'Human review': 'Human review',
        'Verified or rejected': 'Verified or rejected',
        'Team assignment': "Assignment unavailable",
      },
      workflowDetails: {
        'Citizen signal received': 'Citizen signal received',
        'Type and severity inferred': "User-selected fields",
        'Evidence scored': "Illustrative notes inspected",
        'Authority evaluates context': "Simulated review only",
        'Final decision recorded': 'Final decision recorded',
        'Response is coordinated': "No operational handoff",
      },
      alertsTitle: 'System Alerts',
      activityTitle: 'Recent Activity',
      alertItems: {
        'Critical incidents awaiting review': 'Critical incidents awaiting review',
        'Low-confidence AI outputs': 'Low-confidence AI outputs',
        'Resource allocation active': 'Resource allocation active',
      },
      tabOverview: 'Overview',
      tabVerification: 'Verification Queue',
      tabEvidence: 'Evidence & Explainability',
      tabAiReview: 'AI Recommendation Review',
      tabAudit: 'Audit Trail',
      tabIncidents: 'All Incidents',
      headerTitle: "Demo Review Workspace",
      headerSubtitle: "Local simulated review",
    },
    aiAnalysis: {
      eyebrow: 'AI Analysis',
      title: 'Evidence & Explainability',
      description: "Inspect fictional source notes and template suggestions. No authenticity or risk model is running.",
      incidentSelectorLabel: 'Select incident',
      panelSignalIngestion: 'Signal Ingestion',
      panelSocialSource: 'Social Source Simulation',
      panelEvidence: 'Evidence & Explainability',
      panelAiRecommendation: "Template suggestion",
      noIncidentSelected: 'Select an incident above to view AI analysis.',
      metricsAiScore: 'AI Priority Score',
      metricsConfidence: 'AI Confidence',
      metricsSeverity: 'Severity',
      metricsStatus: 'Status',
    },
    liveMap: {
      title: "Demo Incident Map",
      allSeverities: 'All severities',
      allTypes: 'All types',
      filterLabel: 'Filters',
      incidentCount: 'incidents',
      noIncidents: 'No incidents match the current filters.',
    },
    footer: {
      tagline: "Browser-only demonstration of local intake and human review. No authority or dispatch service is connected.",
      prototypeBadge: "DEMO ONLY · SYNTHETIC DATA",
      reportEmergency: "Try Demo Intake",
      copyright: '© {year} SANKET Bharat. Built for disaster resilience.',
      langNote: "Partial English/Hindi interface. Speech and other languages unavailable.",
    },
    common: {
      loading: 'Loading...',
      status: {
        Active: 'Active',
        Resolved: 'Resolved',
        Monitoring: 'Monitoring',
        Dispatched: "Assignment unavailable",
        Pending: 'Pending',
        Approved: 'Approved',
        Rejected: 'Rejected',
        Modified: 'Modified',
        Escalated: 'Escalated',
        'Marked duplicate': 'Marked duplicate',
      },
      severity: {
        Critical: 'Critical',
        High: 'High',
        Moderate: 'Moderate',
        Low: 'Low',
      },
      prototypeLabel: "DEMO ONLY",
      humanInLoop: 'Human-in-the-Loop',
      viewDetails: 'View Details',
      approve: 'Approve',
      reject: 'Reject',
      close: 'Close',
    },
    langSelector: {
      label: 'Language',
      en: 'EN',
      hi: 'हि',
      note: 'English + Hindi',
    },
  },
  hi: {
    nav: {
      home: 'होम',
      liveMap: "डेमो मैप",
      dashboard: 'डैशबोर्ड',
      aiAnalysis: "डेमो विश्लेषण",
      admin: 'एडमिन',
      reportEmergency: "डेमो इनपुट आज़माएँ",
      navigate: 'नेविगेट करें',
      openLiveMap: "डेमो मैप खोलें",
    },
    hero: {
      demoChip: "केवल ब्राउज़र डेमो · काल्पनिक डेटा",
      headline1: "मानव समीक्षा",
      headline2: "संकट समीक्षा",
      headline3: "प्रोटोटाइप",
      body: "स्थानीय इनपुट, काल्पनिक स्रोत और समीक्षा का डेमो। कोई प्राधिकरण, लाइव फ़ीड, मॉडल सेवा या टीम भेजने की व्यवस्था जुड़ी नहीं है।",
      cta_report: "डेमो इनपुट आज़माएँ",
      cta_map: "डेमो मैप खोलें",
      stat_triage_value: "काल्पनिक",
      stat_triage_label: "समीक्षा प्रक्रिया",
      stat_score_label: "मॉडल विश्वास स्कोर",
      stat_langs_label: "आंशिक इंटरफ़ेस भाषाएँ",
      stat_lives_label: "आपातकालीन परिणाम",
      scroll: 'स्क्रॉल करें',
    },
    features: {
      eyebrow: 'क्षमताएँ',
      titlePart1: "मौजूदा डेमो की",
      titleGradient: "सुविधाएँ",
      description: "स्थानीय प्रोटोटाइप की सुविधाएँ और सीमाएँ। परिचालन AI या आपातकाल सेवा लागू नहीं है।",
    },
    pipeline: {
      eyebrow: 'पाइपलाइन',
      titlePart1: "स्थानीय इनपुट से",
      titleGradient: "काल्पनिक समीक्षा",
      titlePart2: "इस ब्राउज़र में",
      description: "यह प्रस्तावित मानव समीक्षा का डेमो है। इससे प्राधिकरण को रिपोर्ट मिलने या कार्रवाई होने की पुष्टि नहीं होती।",
      stageLabels: {
        'INTAKE': 'स्वागत',
        'ANALYSIS': 'विश्लेषण',
        'EVIDENCE': 'साक्ष्य',
        'HUMAN REVIEW': 'मानव समीक्षा',
        'COORDINATION': 'समन्वय',
      },
    },
    statistics: {
      eyebrow: "मापे गए परिणाम उपलब्ध नहीं",
      titlePart1: "अभी क्या",
      titleGradient: "प्रमाणित नहीं है",
      description: "वास्तविक आपातकालीन परिणाम, परिचालन क्षमता, मॉडल सटीकता या प्रतिक्रिया समय मापा नहीं गया है।",
    },
    about: {
      eyebrow: 'परिचय',
      titlePart1: 'सबसे घातक घंटा वह है जिसे',
      titleGradient: 'कोई देख नहीं सका',
    },
    faq: {
      eyebrow: 'प्रश्न',
      titlePart1: "समझें",
      titleGradient: "प्रोटोटाइप की सीमाएँ",
      description: 'सत्यापन, मॉडल इनपुट, ऑफलाइन व्यवहार और एकीकरण — मार्केटिंग के बिना उत्तर दिए गए।',
    },
    report: {
      badge: "केवल डेमो इनपुट",
      title: "आज़माएँ",
      titleGradient: "डेमो रिपोर्ट",
      subtitle: "केवल काल्पनिक जानकारी भरें। यह उदाहरण ब्राउज़र में रहता है; किसी प्राधिकरण को नहीं भेजा जाता और सहायता या टीम नहीं भेजी जाती। वास्तविक आपातकाल में स्थापित आपातकालीन सेवाओं का उपयोग करें।",
      secureIntake: "स्थानीय ब्राउज़र डेमो",
      section1Title: 'क्या हो रहा है?',
      section1Eyebrow: '01 / संकेत प्रकार',
      section2Title: 'यह कहाँ हो रहा है?',
      section2Eyebrow: '02 / भौगोलिक संकेत',
      section3Title: 'हमें बताएं जो आप जानते हैं',
      section3Eyebrow: '03 / घटना विवरण',
      section4Title: "वैकल्पिक काल्पनिक संपर्क विवरण",
      section4Eyebrow: '04 / रिपोर्टर विवरण',
      locationPlaceholder: 'एक स्थल, सड़क या क्षेत्र दर्ज करें',
      locationSrLabel: 'मैनुअल स्थान',
      coordinatesLabel: "निर्देशांक:",
      useCurrentLocation: "स्थान प्राप्त करना उपलब्ध नहीं",
      locating: "उपलब्ध नहीं",
      descriptionLabel: 'विवरण',
      descriptionHint: 'आप जो देखते हैं उसके बारे में विशिष्ट रहें',
      descriptionPlaceholder: 'स्थिति, दृश्यमान क्षति, खतरों और कुछ भी जो बचावकर्मियों को जानना चाहिए, उसका वर्णन करें...',
      peopleAffectedLabel: 'प्रभावित लोग',
      peopleAffectedHint: 'अनुमानित संख्या',
      severityLabel: 'तात्कालिकता / गंभीरता',
      addImageLabel: 'एक छवि जोड़ें',
      addImageHint: "वैकल्पिक चित्र · केवल स्थानीय संग्रह",
      browse: 'ब्राउज़ करें',
      nameLabel: 'नाम',
      namePlaceholder: 'आपका पूरा नाम',
      contactLabel: 'संपर्क नंबर',
      aiPreviewTitle: "डेमो इनपुट सारांश",
      aiPreviewBody: "खतरा और तात्कालिकता आप चुनते हैं। प्रामाणिकता, डुप्लिकेट मिलान, स्थान और मॉडल स्कोर का आकलन नहीं होता।",
      aiConfidenceLabel: "मॉडल विश्वास स्कोर",
      detectedTypeLabel: "चुना गया प्रकार",
      severityDisplayLabel: 'गंभीरता',
      duplicateWarning: "डुप्लिकेट मिलान उपलब्ध नहीं। आसपास की रिपोर्ट खोजी नहीं जाती।",
      beforeSubmitTitle: 'सबमिट करने से पहले',
      beforeSubmitBody: 'केवल वही रिपोर्ट करें जो आप प्रत्यक्ष रूप से देख सकते हैं। यदि आप तत्काल खतरे में हैं, तो पहले सुरक्षित स्थान पर जाएं और स्थानीय आपातकालीन सेवाओं को कॉल करें।',
      submitButton: "स्थानीय डेमो रिपोर्ट जोड़ें",
      encryptedLabel: "इस ब्राउज़र में संग्रह · प्राधिकरण को नहीं भेजा गया",
      types: { Flood: 'बाढ़', Fire: 'आग', Earthquake: 'भूकंप', Cyclone: 'चक्रवात', Landslide: 'भूस्खलन', Other: 'अन्य' },
      severity: { Moderate: 'मध्यम', High: 'उच्च', Critical: 'गंभीर' },
      successBadge: "स्थानीय डेमो इनपुट जोड़ा गया",
      successHeadline: "इस ब्राउज़र डेमो में जोड़ा गया।",
      successBody: "यह उदाहरण किसी प्राधिकरण को नहीं मिला। सहायता, टीम या संदेश नहीं भेजे गए। यह ब्राउज़र की काल्पनिक समीक्षा कतार में दिखाई देता है।",
      incidentIdLabel: 'घटना आईडी',
      awaitingVerification: "काल्पनिक समीक्षा लंबित",
      submitAnother: 'एक और रिपोर्ट सबमिट करें',
      viewInAdmin: 'एडमिन सत्यापन कतार में देखें',
      onlineBadge: "ब्राउज़र ऑनलाइन संकेत देता है",
      offlineBadge: "ब्राउज़र ऑफ़लाइन संकेत देता है",
      offlineFeedbackMode: "केवल स्थानीय IndexedDB कतार; कुछ नहीं भेजा गया।",
      offlineFeedbackSyncing: "स्थानीय उदाहरण इस ब्राउज़र डेमो में कॉपी हो रहे हैं।",
      offlineFeedbackSynced: "स्थानीय कॉपी; सर्वर या प्राधिकरण को नहीं भेजा गया।",
      offlineSavedTitle: "इस उपकरण पर उदाहरण कतार में रखा गया",
      offlineSavedBody: "इस उपकरण के IndexedDB में संग्रह। ऐप खुला रहने पर स्थानीय डेमो में कॉपी हो सकता है। अपलोड या बैकग्राउंड डिलीवरी लागू नहीं है।",
      localIdLabel: 'स्थानीय कतार आईडी',
      offlineQueueTitle: "स्थानीय ऑफ़लाइन कतार",
      offlineQueueWaiting: 'ऑफ़लाइन कतार: {count} रिपोर्ट प्रतीक्षारत',
      offlineQueueSynced: "उदाहरण स्थानीय रूप से कॉपी हुए",
      offlineStatusQueued: 'कतारबद्ध',
      offlineStatusSyncing: "स्थानीय कॉपी जारी",
      offlineStatusSynced: "स्थानीय कॉपी हुई",
      offlineStatusFailed: 'विफल / पुनः प्रयास',
      retrySync: "स्थानीय कॉपी फिर आज़माएँ",
      syncNow: "स्थानीय डेमो में कॉपी करें",
      relayTitle: 'ऑफ़लाइन रिले नेटवर्क',
      relayBadge: "लागू नहीं",
      relayText: "पास के उपकरण से संदेश भेजना भविष्य की अवधारणा है, लागू सुविधा नहीं।",
      relaySecondaryText: "Bluetooth, Wi-Fi रिले, वैकल्पिक संदेश या सर्वर अपलोड उपलब्ध नहीं है।",
    },
    dashboard: {
      panelIncidentTrend: 'घटना प्रवृत्ति',
      hintIncidentTrend: "काल्पनिक चार्ट · स्थिर उदाहरण",
      panelSeverityDist: 'गंभीरता वितरण',
      hintSeverityDist: "काल्पनिक उदाहरण वितरण",
      panelResponseTime: 'प्रतिक्रिया समय विश्लेषण',
      hintResponseTime: "काल्पनिक चार्ट · मापा नहीं गया",
      panelPressureHeat: 'दबाव हीटमैप',
      hintPressureHeat: "काल्पनिक मैट्रिक्स · सेंसर डेटा नहीं",
      panelCritical: 'गंभीर घटनाएँ',
      panelAlertFeed: 'अलर्ट फ़ीड',
    },
    admin: {
      workflowTitle: 'मानव-नियंत्रित कार्यप्रवाह',
      workflowSteps: {
        'Incoming report': 'आने वाली रिपोर्ट',
        'AI analysis': 'AI विश्लेषण',
        'Confidence / risk': 'विश्वास / जोखिम',
        'Human review': 'मानव समीक्षा',
        'Verified or rejected': 'सत्यापित या अस्वीकृत',
        'Team assignment': "असाइनमेंट उपलब्ध नहीं",
      },
      workflowDetails: {
        'Citizen signal received': 'नागरिक संकेत प्राप्त',
        'Type and severity inferred': "उपयोगकर्ता के चुने विवरण",
        'Evidence scored': "काल्पनिक स्रोत देखे गए",
        'Authority evaluates context': "केवल काल्पनिक समीक्षा",
        'Final decision recorded': 'अंतिम निर्णय दर्ज',
        'Response is coordinated': "कोई परिचालन हस्तांतरण नहीं",
      },
      alertsTitle: 'सिस्टम अलर्ट',
      activityTitle: 'हालिया गतिविधि',
      alertItems: {
        'Critical incidents awaiting review': 'समीक्षा के लिए गंभीर घटनाएँ प्रतीक्षारत',
        'Low-confidence AI outputs': 'कम विश्वास वाले AI आउटपुट',
        'Resource allocation active': 'संसाधन आवंटन सक्रिय',
      },
      tabOverview: 'अवलोकन',
      tabVerification: 'सत्यापन कतार',
      tabEvidence: 'साक्ष्य और स्पष्टीकरण',
      tabAiReview: 'AI अनुशंसा समीक्षा',
      tabAudit: 'ऑडिट ट्रेल',
      tabIncidents: 'सभी घटनाएँ',
      headerTitle: "डेमो समीक्षा कार्यक्षेत्र",
      headerSubtitle: "स्थानीय काल्पनिक समीक्षा",
    },
    aiAnalysis: {
      eyebrow: 'AI विश्लेषण',
      title: 'साक्ष्य और स्पष्टीकरण',
      description: "काल्पनिक स्रोत और टेम्पलेट सुझाव देखें। प्रामाणिकता या जोखिम मॉडल नहीं चल रहा।",
      incidentSelectorLabel: 'घटना चुनें',
      panelSignalIngestion: 'संकेत अंतर्ग्रहण',
      panelSocialSource: 'सामाजिक स्रोत अनुकरण',
      panelEvidence: 'साक्ष्य और स्पष्टीकरण',
      panelAiRecommendation: "टेम्पलेट सुझाव",
      noIncidentSelected: 'AI विश्लेषण देखने के लिए ऊपर से एक घटना चुनें।',
      metricsAiScore: 'AI प्राथमिकता स्कोर',
      metricsConfidence: 'AI विश्वास',
      metricsSeverity: 'गंभीरता',
      metricsStatus: 'स्थिति',
    },
    liveMap: {
      title: "डेमो घटना मैप",
      allSeverities: 'सभी गंभीरताएँ',
      allTypes: 'सभी प्रकार',
      filterLabel: 'फ़िल्टर',
      incidentCount: 'घटनाएँ',
      noIncidents: 'वर्तमान फ़िल्टर से कोई घटना मेल नहीं खाती।',
    },
    footer: {
      tagline: "स्थानीय इनपुट और मानव समीक्षा का ब्राउज़र डेमो। कोई प्राधिकरण या टीम भेजने की सेवा जुड़ी नहीं है।",
      prototypeBadge: "केवल डेमो · काल्पनिक डेटा",
      reportEmergency: "डेमो इनपुट आज़माएँ",
      copyright: '© {year} SANKET Bharat. आपदा लचीलेपन के लिए निर्मित।',
      langNote: "आंशिक अंग्रेज़ी/हिंदी इंटरफ़ेस। आवाज़ और अन्य भाषाएँ उपलब्ध नहीं।",
    },
    common: {
      loading: 'लोड हो रहा है...',
      status: {
        Active: 'सक्रिय',
        Resolved: 'हल हुआ',
        Monitoring: 'निगरानी',
        Dispatched: "असाइनमेंट उपलब्ध नहीं",
        Pending: 'लंबित',
        Approved: 'स्वीकृत',
        Rejected: 'अस्वीकृत',
        Modified: 'संशोधित',
        Escalated: 'बढ़ाया गया',
        'Marked duplicate': 'डुप्लीकेट चिह्नित',
      },
      severity: {
        Critical: 'गंभीर',
        High: 'उच्च',
        Moderate: 'मध्यम',
        Low: 'निम्न',
      },
      prototypeLabel: "केवल डेमो",
      humanInLoop: 'मानव-नियंत्रित',
      viewDetails: 'विवरण देखें',
      approve: 'स्वीकृत करें',
      reject: 'अस्वीकार करें',
      close: 'बंद करें',
    },
    langSelector: {
      label: 'भाषा',
      en: 'EN',
      hi: 'हि',
      note: 'English + Hindi',
    },
  },
}
