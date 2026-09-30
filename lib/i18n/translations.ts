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
      liveMap: 'Live Map',
      dashboard: 'Dashboard',
      aiAnalysis: 'AI Analysis',
      admin: 'Admin',
      reportEmergency: 'Report Emergency',
      navigate: 'Navigate',
      openLiveMap: 'Open Live Map',
    },
    hero: {
      demoChip: 'AI Advisory · 47 active incidents',
      headline1: 'AI-Powered',
      headline2: 'Disaster Response',
      headline3: 'Platform',
      body: 'SANKET Bharat is designed to turn millions of citizen reports, satellite passes and sensor feeds into one triaged, ranked incident list — then route the right rescue team to the right street.',
      cta_report: 'Report Emergency',
      cta_map: 'Open Live Map',
      stat_triage_value: 'Human-authorised',
      stat_triage_label: 'AI-assisted triage',
      stat_score_label: 'AI Priority Score',
      stat_langs_label: 'Languages planned',
      stat_lives_label: 'Lives assisted',
      scroll: 'Scroll',
    },
    features: {
      eyebrow: 'Capabilities',
      titlePart1: 'Eight systems working as',
      titleGradient: 'one response brain',
      description: 'Each module targets a failure mode that has cost lives in real disasters — noisy duplicate reporting, misinformation, blind resource allocation and language exclusion.',
    },
    pipeline: {
      eyebrow: 'Pipeline',
      titlePart1: 'From a citizen report to an',
      titleGradient: 'explainable response decision',
      titlePart2: 'with human authority in control',
      description: 'Each stage is traceable. Available evidence, AI recommendations and human decisions are presented together to support transparent disaster-response coordination.',
      stageLabels: {
        'INTAKE': 'INTAKE',
        'ANALYSIS': 'ANALYSIS',
        'EVIDENCE': 'EVIDENCE',
        'HUMAN REVIEW': 'HUMAN REVIEW',
        'COORDINATION': 'COORDINATION',
      },
    },
    statistics: {
      eyebrow: 'Platform capabilities',
      titlePart1: 'What SANKET Bharat is built to',
      titleGradient: 'deliver',
      description: 'The figures below illustrate the intended design capabilities and architectural targets of the platform.',
    },
    about: {
      eyebrow: 'About',
      titlePart1: 'The deadliest hour is the one',
      titleGradient: 'nobody could see',
    },
    faq: {
      eyebrow: 'Questions',
      titlePart1: 'The things control rooms',
      titleGradient: 'actually ask us',
      description: 'Verification, model inputs, offline behaviour and integration — answered without the marketing layer.',
    },
    report: {
      badge: 'Citizen intake',
      title: 'Report an',
      titleGradient: 'emergency',
      subtitle: 'Share what you see. SANKET Bharat evaluates the signal and routes it to the right response teams. Submissions are reviewed by authorized human responders before any action is taken.',
      secureIntake: 'Secure intake',
      section1Title: 'What is happening?',
      section1Eyebrow: '01 / Signal type',
      section2Title: 'Where is it happening?',
      section2Eyebrow: '02 / Geospatial signal',
      section3Title: 'Tell us what you know',
      section3Eyebrow: '03 / Incident details',
      section4Title: 'How can responders reach you?',
      section4Eyebrow: '04 / Reporter details',
      locationPlaceholder: 'Enter a landmark, street or area',
      locationSrLabel: 'Manual location',
      coordinatesLabel: 'Coordinates detected:',
      useCurrentLocation: 'Use current location',
      locating: 'Locating...',
      descriptionLabel: 'Description',
      descriptionHint: 'Be specific about what you see',
      descriptionPlaceholder: 'Describe the situation, visible damage, hazards and anything responders should know...',
      peopleAffectedLabel: 'People affected',
      peopleAffectedHint: 'Approximate count',
      severityLabel: 'Urgency / severity',
      addImageLabel: 'Add an image',
      addImageHint: 'Optional · JPG, PNG up to 10 MB',
      browse: 'Browse',
      nameLabel: 'Name',
      namePlaceholder: 'Your full name',
      contactLabel: 'Contact number',
      aiPreviewTitle: 'AI verification preview',
      aiPreviewBody: 'SANKET Bharat will cross-check your report against nearby signals before triage. Values below are an AI-generated preview pending human review.',
      aiConfidenceLabel: 'AI Confidence',
      detectedTypeLabel: 'Detected type',
      severityDisplayLabel: 'Severity',
      duplicateWarning: 'Possible duplicate: 1 similar signal detected within 2.4 km. AI will merge only if confirmed.',
      beforeSubmitTitle: 'Before you submit',
      beforeSubmitBody: 'Only report what you can observe firsthand. If you are in immediate danger, move to safety first and call local emergency services.',
      submitButton: 'Submit emergency report',
      encryptedLabel: 'Encrypted intake · No account required',
      types: { Flood: 'Flood', Fire: 'Fire', Earthquake: 'Earthquake', Cyclone: 'Cyclone', Landslide: 'Landslide', Other: 'Other' },
      severity: { Moderate: 'Moderate', High: 'High', Critical: 'Critical' },
      successBadge: 'Report received',
      successHeadline: 'Help is being coordinated.',
      successBody: 'Your report has been registered and routed to the Admin Verification Queue for human review.',
      incidentIdLabel: 'Incident ID',
      awaitingVerification: 'Awaiting Human Verification',
      submitAnother: 'Submit another report',
      viewInAdmin: 'View in Admin Verification Queue',
      onlineBadge: 'ONLINE',
      offlineBadge: 'OFFLINE',
      offlineFeedbackMode: 'Offline mode — your report is safely queued on this device.',
      offlineFeedbackSyncing: 'Connection restored — syncing queued reports.',
      offlineFeedbackSynced: 'Report synchronized successfully.',
      offlineSavedTitle: 'Report saved offline',
      offlineSavedBody: 'Report saved offline. It will sync automatically when connectivity returns.',
      localIdLabel: 'Local Queue ID',
      offlineQueueTitle: 'Offline Queue',
      offlineQueueWaiting: 'Offline queue: {count} reports waiting',
      offlineQueueSynced: 'All reports synchronized',
      offlineStatusQueued: 'Queued',
      offlineStatusSyncing: 'Syncing',
      offlineStatusSynced: 'Synced',
      offlineStatusFailed: 'Failed / Retry',
      retrySync: 'Retry Sync',
      syncNow: 'Sync Now',
      relayTitle: 'Offline Relay Network',
      relayBadge: 'COMING SOON',
      relayText: 'When internet access is unavailable, future SANKET Bharat mobile apps will support nearby-device store-and-forward communication using supported Bluetooth/Wi-Fi technologies.',
      relaySecondaryText: 'Queued emergency reports could move between participating nearby devices until one reaches connectivity and uploads them to the SANKET Bharat network.',
    },
    dashboard: {
      panelIncidentTrend: 'Incident trend',
      hintIncidentTrend: 'Reports vs verified · 24h',
      panelSeverityDist: 'Severity distribution',
      hintSeverityDist: 'By hazard type',
      panelResponseTime: 'Response time analytics',
      hintResponseTime: 'Median minutes by state',
      panelPressureHeat: 'Pressure heatmap',
      hintPressureHeat: '72h event density',
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
        'Team assignment': 'Team assignment',
      },
      workflowDetails: {
        'Citizen signal received': 'Citizen signal received',
        'Type and severity inferred': 'Type and severity inferred',
        'Evidence scored': 'Evidence scored',
        'Authority evaluates context': 'Authority evaluates context',
        'Final decision recorded': 'Final decision recorded',
        'Response is coordinated': 'Response is coordinated',
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
      headerTitle: 'Admin Control Center',
      headerSubtitle: 'Human-in-the-Loop',
    },
    aiAnalysis: {
      eyebrow: 'AI Analysis',
      title: 'Evidence & Explainability',
      description: 'Each AI recommendation is accompanied by the evidence that produced it, so human authorities can make informed decisions.',
      incidentSelectorLabel: 'Select incident',
      panelSignalIngestion: 'Signal Ingestion',
      panelSocialSource: 'Social Source Simulation',
      panelEvidence: 'Evidence & Explainability',
      panelAiRecommendation: 'AI Recommendation',
      noIncidentSelected: 'Select an incident above to view AI analysis.',
      metricsAiScore: 'AI Priority Score',
      metricsConfidence: 'AI Confidence',
      metricsSeverity: 'Severity',
      metricsStatus: 'Status',
    },
    liveMap: {
      title: 'Live Incident Map',
      allSeverities: 'All severities',
      allTypes: 'All types',
      filterLabel: 'Filters',
      incidentCount: 'incidents',
      noIncidents: 'No incidents match the current filters.',
    },
    footer: {
      tagline: 'Triaged citizen reports, explainable severity scoring and resource routing — every consequential decision reviewed by authorized human authority.',
      prototypeBadge: 'Human-in-the-Loop · AI-Assisted',
      reportEmergency: 'Report Emergency',
      copyright: '© {year} SANKET Bharat. Built for disaster resilience.',
      langNote: 'Multilingual support: English + Hindi. Additional Indian language support planned.',
    },
    common: {
      loading: 'Loading...',
      status: {
        Active: 'Active',
        Resolved: 'Resolved',
        Monitoring: 'Monitoring',
        Dispatched: 'Dispatched',
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
      prototypeLabel: 'Human-in-the-Loop · AI-Assisted',
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
      liveMap: 'लाइव मैप',
      dashboard: 'डैशबोर्ड',
      aiAnalysis: 'AI विश्लेषण',
      admin: 'एडमिन',
      reportEmergency: 'आपातकाल रिपोर्ट करें',
      navigate: 'नेविगेट करें',
      openLiveMap: 'लाइव मैप खोलें',
    },
    hero: {
      demoChip: 'AI सलाह · 47 सक्रिय घटनाएँ',
      headline1: 'AI-संचालित',
      headline2: 'आपदा प्रतिक्रिया',
      headline3: 'प्लेटफ़ॉर्म',
      body: 'SANKET Bharat को लाखों नागरिक रिपोर्ट, उपग्रह डेटा और सेंसर फ़ीड को एक त्रियाजित, क्रमबद्ध घटना सूची में बदलने के लिए डिज़ाइन किया गया है — फिर सही बचाव दल को सही स्थान पर भेजा जाता है।',
      cta_report: 'आपातकाल रिपोर्ट करें',
      cta_map: 'लाइव मैप खोलें',
      stat_triage_value: 'मानव-अधिकृत',
      stat_triage_label: 'AI-सहायक ट्रायज',
      stat_score_label: 'AI प्राथमिकता स्कोर',
      stat_langs_label: 'नियोजित भाषाएँ',
      stat_lives_label: 'सहायता प्राप्त',
      scroll: 'स्क्रॉल करें',
    },
    features: {
      eyebrow: 'क्षमताएँ',
      titlePart1: 'आठ प्रणालियाँ मिलकर काम करती हैं',
      titleGradient: 'एक प्रतिक्रिया मस्तिष्क',
      description: 'प्रत्येक मॉड्यूल एक ऐसी विफलता को लक्षित करता है जिसने वास्तविक आपदाओं में जानें ली हैं।',
    },
    pipeline: {
      eyebrow: 'पाइपलाइन',
      titlePart1: 'एक नागरिक रिपोर्ट से',
      titleGradient: 'स्पष्ट प्रतिक्रिया निर्णय',
      titlePart2: 'मानव अधिकार के नियंत्रण में',
      description: 'प्रत्येक चरण अनुरेखनीय है। उपलब्ध साक्ष्य, AI अनुशंसाएँ और मानव निर्णय पारदर्शी आपदा-प्रतिक्रिया समन्वय का समर्थन करने के लिए एक साथ प्रस्तुत किए जाते हैं।',
      stageLabels: {
        'INTAKE': 'स्वागत',
        'ANALYSIS': 'विश्लेषण',
        'EVIDENCE': 'साक्ष्य',
        'HUMAN REVIEW': 'मानव समीक्षा',
        'COORDINATION': 'समन्वय',
      },
    },
    statistics: {
      eyebrow: 'प्लेटफ़ॉर्म क्षमताएँ',
      titlePart1: 'SANKET Bharat किसके लिए बनाया गया है',
      titleGradient: 'प्रदान करना',
      description: 'नीचे दिए गए आंकड़े प्लेटफ़ॉर्म के इच्छित डिज़ाइन क्षमताओं और वास्तुकला लक्ष्यों को दर्शाते हैं।',
    },
    about: {
      eyebrow: 'परिचय',
      titlePart1: 'सबसे घातक घंटा वह है जिसे',
      titleGradient: 'कोई देख नहीं सका',
    },
    faq: {
      eyebrow: 'प्रश्न',
      titlePart1: 'वे बातें जो नियंत्रण कक्ष',
      titleGradient: 'वास्तव में हमसे पूछते हैं',
      description: 'सत्यापन, मॉडल इनपुट, ऑफलाइन व्यवहार और एकीकरण — मार्केटिंग के बिना उत्तर दिए गए।',
    },
    report: {
      badge: 'नागरिक सेवन',
      title: 'रिपोर्ट करें एक',
      titleGradient: 'आपातकाल',
      subtitle: 'जो आप देखते हैं उसे साझा करें। SANKET Bharat संकेत का मूल्यांकन करता है और इसे सही प्रतिक्रिया टीमों को भेजता है। सबमिशन की समीक्षा अधिकृत मानव प्रतिसादकों द्वारा की जाती है।',
      secureIntake: 'सुरक्षित सेवन',
      section1Title: 'क्या हो रहा है?',
      section1Eyebrow: '01 / संकेत प्रकार',
      section2Title: 'यह कहाँ हो रहा है?',
      section2Eyebrow: '02 / भौगोलिक संकेत',
      section3Title: 'हमें बताएं जो आप जानते हैं',
      section3Eyebrow: '03 / घटना विवरण',
      section4Title: 'बचावकर्मी आप तक कैसे पहुँच सकते हैं?',
      section4Eyebrow: '04 / रिपोर्टर विवरण',
      locationPlaceholder: 'एक स्थल, सड़क या क्षेत्र दर्ज करें',
      locationSrLabel: 'मैनुअल स्थान',
      coordinatesLabel: 'निर्देशांक का पता चला:',
      useCurrentLocation: 'वर्तमान स्थान का उपयोग करें',
      locating: 'स्थान ढूंढ रहा है...',
      descriptionLabel: 'विवरण',
      descriptionHint: 'आप जो देखते हैं उसके बारे में विशिष्ट रहें',
      descriptionPlaceholder: 'स्थिति, दृश्यमान क्षति, खतरों और कुछ भी जो बचावकर्मियों को जानना चाहिए, उसका वर्णन करें...',
      peopleAffectedLabel: 'प्रभावित लोग',
      peopleAffectedHint: 'अनुमानित संख्या',
      severityLabel: 'तात्कालिकता / गंभीरता',
      addImageLabel: 'एक छवि जोड़ें',
      addImageHint: 'वैकल्पिक · JPG, PNG 10 MB तक',
      browse: 'ब्राउज़ करें',
      nameLabel: 'नाम',
      namePlaceholder: 'आपका पूरा नाम',
      contactLabel: 'संपर्क नंबर',
      aiPreviewTitle: 'AI सत्यापन पूर्वावलोकन',
      aiPreviewBody: 'SANKET Bharat त्रायज से पहले आपकी रिपोर्ट को आस-पास के संकेतों के साथ क्रॉस-चेक करेगा। नीचे के मान AI-जनित पूर्वावलोकन हैं जो मानव समीक्षा के अधीन हैं।',
      aiConfidenceLabel: 'AI विश्वास',
      detectedTypeLabel: 'पहचाना गया प्रकार',
      severityDisplayLabel: 'गंभीरता',
      duplicateWarning: 'संभावित डुप्लीकेट: 2.4 किमी के भीतर 1 समान संकेत पाया गया। AI केवल पुष्टि होने पर मर्ज करेगा।',
      beforeSubmitTitle: 'सबमिट करने से पहले',
      beforeSubmitBody: 'केवल वही रिपोर्ट करें जो आप प्रत्यक्ष रूप से देख सकते हैं। यदि आप तत्काल खतरे में हैं, तो पहले सुरक्षित स्थान पर जाएं और स्थानीय आपातकालीन सेवाओं को कॉल करें।',
      submitButton: 'आपातकालीन रिपोर्ट सबमिट करें',
      encryptedLabel: 'एन्क्रिप्टेड सेवन · कोई खाता आवश्यक नहीं',
      types: { Flood: 'बाढ़', Fire: 'आग', Earthquake: 'भूकंप', Cyclone: 'चक्रवात', Landslide: 'भूस्खलन', Other: 'अन्य' },
      severity: { Moderate: 'मध्यम', High: 'उच्च', Critical: 'गंभीर' },
      successBadge: 'रिपोर्ट प्राप्त हुई',
      successHeadline: 'सहायता समन्वित हो रही है।',
      successBody: 'आपकी रिपोर्ट पंजीकृत की गई है और मानव समीक्षा के लिए एडमिन सत्यापन कतार में भेजी गई है।',
      incidentIdLabel: 'घटना आईडी',
      awaitingVerification: 'मानव सत्यापन की प्रतीक्षा में',
      submitAnother: 'एक और रिपोर्ट सबमिट करें',
      viewInAdmin: 'एडमिन सत्यापन कतार में देखें',
      onlineBadge: 'ऑनलाइन',
      offlineBadge: 'ऑफ़लाइन',
      offlineFeedbackMode: 'ऑफ़लाइन मोड — आपकी रिपोर्ट इस डिवाइस पर सुरक्षित रूप से कतारबद्ध है।',
      offlineFeedbackSyncing: 'कनेक्शन बहाल — कतारबद्ध रिपोर्ट सिंक हो रही हैं।',
      offlineFeedbackSynced: 'रिपोर्ट सफलतापूर्वक सिंक्रनाइज़ हो गई।',
      offlineSavedTitle: 'रिपोर्ट ऑफ़लाइन सहेजी गई',
      offlineSavedBody: 'रिपोर्ट ऑफ़लाइन सहेजी गई। कनेक्टिविटी वापस आने पर यह स्वचालित रूप से सिंक हो जाएगी।',
      localIdLabel: 'स्थानीय कतार आईडी',
      offlineQueueTitle: 'ऑफ़लाइन कतार',
      offlineQueueWaiting: 'ऑफ़लाइन कतार: {count} रिपोर्ट प्रतीक्षारत',
      offlineQueueSynced: 'सभी रिपोर्ट सिंक्रनाइज़ हैं',
      offlineStatusQueued: 'कतारबद्ध',
      offlineStatusSyncing: 'सिंकिंग',
      offlineStatusSynced: 'सिंक्रनाइज़',
      offlineStatusFailed: 'विफल / पुनः प्रयास',
      retrySync: 'पुनः सिंक प्रयास',
      syncNow: 'अभी सिंक करें',
      relayTitle: 'ऑफ़लाइन रिले नेटवर्क',
      relayBadge: 'शीघ्र आ रहा है',
      relayText: 'जब इंटरनेट का उपयोग अनुपलब्ध हो, तो भविष्य के संकेत भारत मोबाइल ऐप समर्थित ब्लूटूथ/वाई-फ़ाई तकनीकों का उपयोग करके निकटवर्ती-डिवाइस स्टोर-एंड-फ़ॉरवर्ड संचार का समर्थन करेंगे।',
      relaySecondaryText: 'कतारबद्ध आपातकालीन रिपोर्ट भाग लेने वाले नजदीकी उपकरणों के बीच तब तक स्थानांतरित हो सकती हैं जब तक कि कोई कनेक्टिविटी तक न पहुंच जाए और उन्हें संकेत भारत नेटवर्क पर अपलोड न कर दे।',
    },
    dashboard: {
      panelIncidentTrend: 'घटना प्रवृत्ति',
      hintIncidentTrend: 'रिपोर्ट बनाम सत्यापित · 24 घंटे',
      panelSeverityDist: 'गंभीरता वितरण',
      hintSeverityDist: 'खतरे के प्रकार अनुसार',
      panelResponseTime: 'प्रतिक्रिया समय विश्लेषण',
      hintResponseTime: 'राज्य अनुसार माध्यिका मिनट',
      panelPressureHeat: 'दबाव हीटमैप',
      hintPressureHeat: '72 घंटे घटना घनत्व',
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
        'Team assignment': 'टीम असाइनमेंट',
      },
      workflowDetails: {
        'Citizen signal received': 'नागरिक संकेत प्राप्त',
        'Type and severity inferred': 'प्रकार और गंभीरता अनुमानित',
        'Evidence scored': 'साक्ष्य स्कोर किए गए',
        'Authority evaluates context': 'प्राधिकरण संदर्भ का मूल्यांकन करता है',
        'Final decision recorded': 'अंतिम निर्णय दर्ज',
        'Response is coordinated': 'प्रतिक्रिया समन्वित है',
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
      headerTitle: 'एडमिन नियंत्रण केंद्र',
      headerSubtitle: 'मानव-नियंत्रित',
    },
    aiAnalysis: {
      eyebrow: 'AI विश्लेषण',
      title: 'साक्ष्य और स्पष्टीकरण',
      description: 'प्रत्येक AI अनुशंसा उस साक्ष्य के साथ होती है जिसने इसे उत्पन्न किया, ताकि मानव अधिकारी सूचित निर्णय ले सकें।',
      incidentSelectorLabel: 'घटना चुनें',
      panelSignalIngestion: 'संकेत अंतर्ग्रहण',
      panelSocialSource: 'सामाजिक स्रोत अनुकरण',
      panelEvidence: 'साक्ष्य और स्पष्टीकरण',
      panelAiRecommendation: 'AI अनुशंसा',
      noIncidentSelected: 'AI विश्लेषण देखने के लिए ऊपर से एक घटना चुनें।',
      metricsAiScore: 'AI प्राथमिकता स्कोर',
      metricsConfidence: 'AI विश्वास',
      metricsSeverity: 'गंभीरता',
      metricsStatus: 'स्थिति',
    },
    liveMap: {
      title: 'लाइव घटना मैप',
      allSeverities: 'सभी गंभीरताएँ',
      allTypes: 'सभी प्रकार',
      filterLabel: 'फ़िल्टर',
      incidentCount: 'घटनाएँ',
      noIncidents: 'वर्तमान फ़िल्टर से कोई घटना मेल नहीं खाती।',
    },
    footer: {
      tagline: 'त्रियाजित नागरिक रिपोर्ट, स्पष्ट गंभीरता स्कोरिंग और संसाधन रूटिंग — प्रत्येक महत्वपूर्ण निर्णय अधिकृत मानव प्राधिकरण द्वारा समीक्षित।',
      prototypeBadge: 'मानव-नियंत्रित · AI-सहायक',
      reportEmergency: 'आपातकाल रिपोर्ट करें',
      copyright: '© {year} SANKET Bharat. आपदा लचीलेपन के लिए निर्मित।',
      langNote: 'बहुभाषी समर्थन: English + Hindi। अतिरिक्त भारतीय भाषा समर्थन नियोजित।',
    },
    common: {
      loading: 'लोड हो रहा है...',
      status: {
        Active: 'सक्रिय',
        Resolved: 'हल हुआ',
        Monitoring: 'निगरानी',
        Dispatched: 'भेजा गया',
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
      prototypeLabel: 'मानव-नियंत्रित · AI-सहायक',
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
