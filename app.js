(function () {
  const MAX_CONFIDENCE_DELTA = 18;
  const STORAGE_KEY = "tiramola-state-v1";

  const baseState = {
    brand: {
      name: "Τιραμόλα",
      type: "Nursery",
      location: "Cyprus",
      ageRange: "0-5",
      positioning: ["bright", "playful", "safe", "modern"],
    },
    quiz: {
      answers: {},
      scores: { A: 0, B: 0, C: 0 },
      tone: {
        energy: 0,
        calm: 0,
        modern: 0,
        classic: 0,
        minimal: 0,
        expressive: 0,
        local: 0,
        global: 0,
      },
    },
    theme: {
      palette: {},
      typography: {},
      ui: {},
    },
    result: {
      recommendedRoute: "B",
      confidence: 0,
      explanationBullets: [],
      topMatches: ["B"],
    },
    concepts: {
      A: {},
      B: {},
      C: {},
    },
    ui: {
      lang: "el",
      showMeter: false,
    },
  };

  const palettes = {
    A: {
      name: "Mediterranean Bright",
      bg: "#FFF6E8",
      surface: "#FFFFFF",
      primary: "#18A8B5",
      primary700: "#0E6E86",
      accent: "#FF7A59",
      accent2: "#F4C84A",
      text: "#1E2F3A",
      textMuted: "#334155",
      border: "#CFE8E2",
    },
    B: {
      name: "Curiosity Pop",
      bg: "#FFF7EC",
      surface: "#FFFFFF",
      primary: "#12B8A6",
      primary700: "#0B7C73",
      accent: "#F85A96",
      accent2: "#FFD95A",
      text: "#1A2740",
      textMuted: "#334155",
      border: "#CBEDE4",
    },
    C: {
      name: "Modern Trust",
      bg: "#F8F4EE",
      surface: "#FFFFFF",
      primary: "#0D7A83",
      primary700: "#0F2A4A",
      accent: "#E86A7C",
      accent2: "#E9C46A",
      text: "#16253D",
      textMuted: "#334155",
      border: "#D6DEE6",
    },
  };

  const typographyByRoute = {
    A: { heading: "Nunito", body: "Inter" },
    B: { heading: "Baloo 2", body: "Inter" },
    C: { heading: "Poppins", body: "Inter" },
  };

  const nurseryConfig = {
    A: {
      keyPrefix: "na",
      emojis: [
        { e: "\uD83C\uDF0A", x: 5, y: 12, s: 38, d: 6 },
        { e: "\u2764\uFE0F", x: 88, y: 8, s: 28, d: 4.5 },
        { e: "\u2600\uFE0F", x: 15, y: 72, s: 32, d: 5.2 },
        { e: "\u2601\uFE0F", x: 92, y: 65, s: 26, d: 7 },
        { e: "\uD83C\uDF3A", x: 42, y: 5, s: 22, d: 3.8 },
        { e: "\u26F5", x: 75, y: 18, s: 34, d: 5.8 },
        { e: "\u2693", x: 8, y: 42, s: 30, d: 4.2 },
        { e: "\uD83D\uDD4A\uFE0F", x: 95, y: 38, s: 24, d: 6.5 },
        { e: "\uD83C\uDF3B", x: 28, y: 82, s: 28, d: 5 },
        { e: "\uD83C\uDF1F", x: 68, y: 78, s: 30, d: 4 },
        { e: "\uD83D\uDC1A", x: 52, y: 88, s: 26, d: 7.5 },
        { e: "\uD83C\uDF08", x: 35, y: 15, s: 36, d: 8 },
        { e: "\uD83E\uDD8B", x: 82, y: 48, s: 24, d: 5.5 },
        { e: "\uD83C\uDF38", x: 60, y: 70, s: 22, d: 6.2 },
        { e: "\uD83C\uDF3F", x: 20, y: 55, s: 20, d: 4.8 },
        { e: "\uD83C\uDF3C", x: 48, y: 45, s: 20, d: 7.2 },
      ],
      programIcons: ["\uD83C\uDF3B", "\uD83D\uDC23", "\u2600\uFE0F"],
      philIcons: ["\uD83C\uDF3F", "\uD83D\uDEE1\uFE0F", "\u2764\uFE0F", "\uD83C\uDF3A"],
    },
    B: {
      keyPrefix: "nb",
      emojis: [
        { e: "\uD83C\uDF08", x: 5, y: 12, s: 38, d: 6 },
        { e: "\u2B50", x: 88, y: 8, s: 28, d: 4.5 },
        { e: "\uD83C\uDFA8", x: 15, y: 72, s: 32, d: 5.2 },
        { e: "\uD83E\uDDE9", x: 92, y: 65, s: 26, d: 7 },
        { e: "\uD83C\uDF1F", x: 42, y: 5, s: 22, d: 3.8 },
        { e: "\uD83C\uDF88", x: 75, y: 18, s: 34, d: 5.8 },
        { e: "\uD83E\uDD8B", x: 8, y: 42, s: 30, d: 4.2 },
        { e: "\uD83C\uDFB5", x: 95, y: 38, s: 24, d: 6.5 },
        { e: "\uD83C\uDF3B", x: 28, y: 82, s: 28, d: 5 },
        { e: "\uD83C\uDF89", x: 68, y: 78, s: 30, d: 4 },
        { e: "\u2764\uFE0F", x: 52, y: 88, s: 26, d: 7.5 },
        { e: "\u2601\uFE0F", x: 35, y: 15, s: 36, d: 8 },
        { e: "\uD83C\uDF4E", x: 82, y: 48, s: 24, d: 5.5 },
        { e: "\uD83D\uDD8D\uFE0F", x: 60, y: 70, s: 22, d: 6.2 },
        { e: "\u270F\uFE0F", x: 20, y: 55, s: 20, d: 4.8 },
        { e: "\uD83C\uDFB6", x: 48, y: 45, s: 20, d: 7.2 },
      ],
      programIcons: ["\uD83C\uDFA8", "\uD83C\uDF7C", "\u2600\uFE0F"],
      philIcons: ["\uD83E\uDDE9", "\uD83C\uDF3F", "\u2764\uFE0F", "\uD83C\uDF3B"],
    },
    C: {
      keyPrefix: "nc",
      emojis: [
        { e: "\uD83E\uDDF1", x: 5, y: 12, s: 38, d: 6 },
        { e: "\uD83E\uDDE9", x: 88, y: 8, s: 28, d: 4.5 },
        { e: "\uD83D\uDD36", x: 15, y: 72, s: 32, d: 5.2 },
        { e: "\u270F\uFE0F", x: 92, y: 65, s: 26, d: 7 },
        { e: "\uD83D\uDCD6", x: 42, y: 5, s: 22, d: 3.8 },
        { e: "\u2B50", x: 75, y: 18, s: 34, d: 5.8 },
        { e: "\uD83D\uDCA1", x: 8, y: 42, s: 30, d: 4.2 },
        { e: "\uD83E\uDDED", x: 95, y: 38, s: 24, d: 6.5 },
        { e: "\uD83C\uDFAF", x: 28, y: 82, s: 28, d: 5 },
        { e: "\uD83D\uDD2D", x: 68, y: 78, s: 30, d: 4 },
        { e: "\u2728", x: 52, y: 88, s: 26, d: 7.5 },
        { e: "\u2B55", x: 35, y: 15, s: 36, d: 8 },
        { e: "\uD83D\uDCCF", x: 82, y: 48, s: 24, d: 5.5 },
        { e: "\uD83D\uDD27", x: 60, y: 70, s: 22, d: 6.2 },
        { e: "\uD83C\uDF1F", x: 20, y: 55, s: 20, d: 4.8 },
        { e: "\uD83C\uDFD7\uFE0F", x: 48, y: 45, s: 20, d: 7.2 },
      ],
      programIcons: ["\uD83D\uDCDA", "\uD83E\uDDF8", "\uD83C\uDFD6\uFE0F"],
      philIcons: ["\uD83E\uDDE9", "\uD83D\uDD12", "\uD83E\uDDE0", "\uD83C\uDF31"],
    },
  };

  const i18n = {
    el: {
      start: "Ξεκίνα",
      introTitle: "Το Εργαστήριο Ταυτότητας της Τιραμόλα",
      introBody:
        "Σε 9 διασκεδαστικές ερωτήσεις θα ανακαλύψουμε ποια οπτική ταυτότητα ταιριάζει καλύτερα στο σχολείο σου \u2014 με χρώματα, λογότυπα και ολοκληρωμένες προτάσεις σχεδιασμού.",
      landingTagline: "Ας βρούμε μαζί την ταυτότητα του σχολείου σου!",
      navQuiz: "Ερωτηματολόγιο",
      navResult: "Το αποτέλεσμα σου",
      navConcepts: "Κατευθύνσεις",
      navCompare: "Σύγκριση",
      navPitch: "Παρουσίαση",
      navDeck: "Πλήρης παρουσίαση",
      stageFlow: "Ροή εμπειρίας",
      stageIntro: "Εισαγωγή",
      next: "Επόμενο",
      prev: "Πίσω",
      finish: "Ολοκλήρωση",
      confidence: "Βεβαιότητα",
      yourFit: "Το αποτέλεσμα σου",
      topMatches: "Κορυφαίες επιλογές",
      chooseThis: "Διάλεξε αυτό",
      viewFullPitch: "Δες την πλήρη παρουσίαση",
      seeVariants: "Δες παραλλαγές",
      refine: "Θέλω βελτίωση",
      share: "Αντιγραφή συνδέσμου παρουσίασης",
      brandCore: "Βασικά στοιχεία μάρκας",
      ageRange: "Ηλικίες",
      dynamicTheme: "Δυναμικό οπτικό θέμα",
      primary: "Κύριο",
      outline: "Περίγραμμα",
      questionShort: "Ε",
      value: "Τιμή",
      completion: "Συμπλήρωση",
      resetQuiz: "Επαναφορά",
      recommendedRoute: "Προτεινόμενη κατεύθυνση",
      whyRoute: "Γιατί αυτή η κατεύθυνση",
      themePreview: "Προεπισκόπηση θέματος",
      family: "Οικογένεια",
      typography: "Τυπογραφία",
      compareCta: "Σύγκριση",
      conceptsGallery: "Συλλογή Κατευθύνσεων",
      conceptsIntro: "3 ολοκληρωμένες κατευθύνσεις λογοτύπου με διατάξεις, κανόνες εικονιδίου και προσομοιώσεις εφαρμογών.",
      mockupCarousel: "Δείγματα εφαρμογών ανά κατεύθυνση",
      compareTitle: "Σύγκριση A έναντι B έναντι C",
      compareKey: "Κριτήριο",
      compareConcept: "Κατεύθυνση",
      compareMarkFocus: "Κεντρική ιδέα σήματος",
      compareBestFor: "Ιδανικό για",
      compareRisk: "Πιθανό ρίσκο",
      compareBestForA: "Ισορροπία εμπιστοσύνης και ζεστασιάς",
      compareBestForB: "Παιχνιδιάρικη παρουσία με έμφαση στα κοινωνικά δίκτυα",
      compareBestForC: "Κλιμακώσιμη, ποιοτική και καθαρή ταυτότητα",
      compareRiskA: "Μπορεί να φανεί υπερβολικά ήπιο με αδύναμες τονικές αντιθέσεις",
      compareRiskB: "Μπορεί να γίνει φορτωμένο χωρίς όρια",
      compareRiskC: "Μπορεί να φανεί αυστηρό με στενό διάστιχο",
      pitchTitle: "Παρουσίαση Σχεδιαστικής Κατεύθυνσης",
      pitchIntro: "Αυτή η σελίδα είναι η τελική παρουσίαση με βάση τις απαντήσεις σου.",
      pitchSection1: "1) Προτεινόμενη Κατεύθυνση",
      pitchSection2: "2) Οπτικό Σύστημα",
      pitchSection3: "3) Ιστορία Λογοτύπου",
      pitchSection4: "4) Προσομοιώσεις εφαρμογών",
      pitchHeroEyebrow: "Τελική Δημιουργική Κατεύθυνση",
      pitchPersonality: "Προσωπικότητα Μάρκας",
      pitchPromise: "Κεντρική Υπόσχεση",
      pitchSignature: "Χαρακτηριστικά Σήματος",
      pitchCraft: "Τόνος & Τεχνική Ποιότητα",
      pitchLaunch: "Ιδέα Πρώτης Παρουσίασης",
      pitchBrief: "Σύντομο δημιουργικό περίγραμμα",
      pitchApplications: "Κρίσιμες Εφαρμογές",
      pitchCompareHintTitle: "Θες έξτρα σιγουριά;",
      runnerUp: "Δεύτερη επιλογή",
      points: "πόντοι",
      paletteFamily: "Οικογένεια παλέτας",
      uiStyle: "Ύφος διεπαφής",
      radius: "στρογγυλότητα",
      primaryCta: "Κύρια ενέργεια",
      markConcept: "Ιδέα σήματος",
      wordmarkLabel: "Λεκτικό σήμα",
      styleLabel: "Ύφος",
      wordmarkRules: "Κανόνες λεκτικού σήματος",
      styleDirection: "Κατεύθυνση ύφους",
      lockups: "Διατάξεις",
      iconRules: "Κανόνες εικονιδίου",
      suggestedTaglines: "Προτεινόμενα συνθήματα",
      compareRoutesCta: "Σύγκριση με άλλες κατευθύνσεις",
      copyPitchSummary: "Αντιγραφή σύνοψης παρουσίασης",
      brandTitle: "Εργαστήριο Ταυτότητας Τιραμόλα",
      routeLabel: "Κατεύθυνση",
      secondary: "Δευτερεύον",
      variantsAndMockups: "Παραλλαγές και προσομοιώσεις εφαρμογών",
      mockupsLabel: "Προσομοιώσεις",
      doLabel: "Συνιστάται",
      dontLabel: "Αποφυγή",
      copied: "Αντιγράφηκε",
      linkCopied: "Ο σύνδεσμος αντιγράφηκε",
      footer: "Διαδραστική επιλογή κατεύθυνσης • Προεπισκόπηση οπτικού ύφους • Σύγκριση προτάσεων • Παρουσίαση χωρίς σύνδεση",
      pitchSummaryTitle: "Τιραμόλα Παρουσίαση Σχεδιασμού",
      pitchSummaryRoute: "Προτεινόμενη κατεύθυνση",
      pitchSummaryFamily: "Οικογένεια θέματος",
      answerCount: "Απαντημένες",
      incompleteTitle: "Χρειάζονται όλες οι απαντήσεις",
      incompleteBody: "Για αξιόπιστη πρόταση, ολοκλήρωσε και τις 9 ερωτήσεις πριν δεις αποτέλεσμα ή παρουσίαση.",
      continueQuiz: "Συνέχισε το ερωτηματολόγιο",
      showMeter: "Δες προσωρινή βαθμολογία",
      hideMeter: "Κρύψε προσωρινή βαθμολογία",
      comparisonHint: "Η βεβαιότητα είναι χαμηλή ή υπάρχει κοντινή ισοβαθμία. Καλό επόμενο βήμα: σύγκριση κατευθύνσεων.",
      tieNotice: "Ισοβαθμία: προτείνεται σύγκριση κατευθύνσεων.",
      readinessHigh: "Υψηλή ετοιμότητα",
      readinessMedium: "Μέτρια ετοιμότητα",
      readinessLow: "Χαμηλή ετοιμότητα",
      pitchReadiness: "Ετοιμότητα πρότασης",
      nextStepsTitle: "Επόμενα βήματα",
      nextStep1: "Κλείσε την κύρια κατεύθυνση και ζήτησε 2-3 παραλλαγές λογοτύπου.",
      nextStep2: "Έλεγξε το σύμβολο σε μικρά μεγέθη (24 και 32 εικονοστοιχεία) και σε μονόχρωμη χρήση.",
      nextStep3: "Επικύρωσε προσομοιώσεις σε επιγραφή, εικονίδιο κοινωνικών δικτύων και έντυπα πριν την τελική παράδοση.",
      secondaryTheme: "Δευτερεύον",
      sampleUiTitle: "Δείγμα στυλ κουμπιών",
      samplePrimary: "Κύριο στυλ",
      sampleSecondary: "Δευτερεύον στυλ",
      journeyTitle: "Πώς θα προχωρήσουμε",
      journeyStep1: "1. Απαντάς 9 σύντομες ερωτήσεις",
      journeyStep2: "2. Υπολογίζεται η καταλληλότερη κατεύθυνση",
      journeyStep3: "3. Βλέπεις την τελική παρουσίαση με προτάσεις",
      brandTypeLabel: "Παιδικός σταθμός",
      brandLocationLabel: "Κύπρος",
      themeFamilyA: "Μεσογειακή Φωτεινή",
      themeFamilyB: "Ποπ Περιέργεια",
      themeFamilyC: "Σύγχρονη Εμπιστοσύνη",
      briefTitle: "Σύντομο δημιουργικό περίγραμμα",
      briefIntro: "Με βάση τις απαντήσεις σου, αυτή είναι η προτεινόμενη κατεύθυνση πριν περάσεις στην πλήρη παρουσίαση.",
      deckTitle: "Πλήρης Παρουσίαση Σχεδιαστικής Κατεύθυνσης",
      deckIntro: "Παρακάτω βλέπεις την ολοκληρωμένη πρόταση με λογότυπα, προσομοιώσεις και εφαρμογές για την επιλεγμένη κατεύθυνση.",
      logoSystem: "Σύστημα Λογοτύπου",
      logoPrimaryPh: "Κύριο λογότυπο",
      logoSecondaryPh: "Δευτερεύον λογότυπο",
      logoIconPh: "Εικονίδιο",
      logoHorizontalPh: "Οριζόντια διάταξη",
      logoStackedPh: "Κάθετη διάταξη",
      logoMonoPh: "Μονόχρωμη έκδοση",
      mockupGallery: "Κύριες προσομοιώσεις",
      appsShowcase: "Πρόσθετες εφαρμογές",
      phSignage: "Εξωτερική επιγραφή",
      phSocial: "Ανάρτηση κοινωνικών δικτύων",
      phUniform: "Στολή προσωπικού",
      phStationery: "Επιστολόχαρτο / έντυπα",
      phSticker: "Αυτοκόλλητα",
      phPlayground: "Σήμανση χώρου παιχνιδιού",
      phWebHero: "Κεντρική ενότητα ιστοσελίδας",
      phBag: "Πάνινη τσάντα",
      expHeroEyebrow: "Ανακαλύψτε την Κατεύθυνση",
      expBrandStory: "Ιστορία Ταυτότητας",
      expVisualShowcase: "Οπτική Παρουσίαση",
      expPaletteTitle: "Χρωματική Παλέτα",
      expTypographyTitle: "Τυπογραφία",
      expSelectRoute: "Επιλογή αυτής",
      expViewPitch: "Δες την πλήρη παρουσίαση",
      expViewExperience: "Δες την εμπειρία",
      expPromise: "Υπόσχεση",
      expPersonality: "Προσωπικότητα",
      expHeadingFont: "Γραμματοσειρά Τίτλων",
      expBodyFont: "Γραμματοσειρά Κειμένου",
      expSignatureFeatures: "Χαρακτηριστικά Σχεδιασμού",
      expMarkConcept: "Ιδέα Σήματος",
      nbHeroTagline: "Η περιέργεια είναι μάθηση",
      nbHeroSub: "Παιδικός σταθμός & νηπιαγωγείο στη Λευκωσία",
      nbHeroCta: "Κλείστε ξενάγηση",
      nbHeroBadge: "Ηλικίες 0–5 ετών",
      nbAboutTitle: "Καλώς ήρθατε στην Τιραμόλα",
      nbAboutText: "Στον παιδικό σταθμό Τιραμόλα, κάθε μέρα είναι μια νέα περιπέτεια. Μέσα από το παιχνίδι, τη δημιουργικότητα και την εξερεύνηση, τα παιδιά ανακαλύπτουν τον κόσμο γύρω τους σε ένα ασφαλές και χαρούμενο περιβάλλον.",
      nbProgramsTitle: "Τα προγράμματά μας",
      nbProg1Title: "Νηπιαγωγείο",
      nbProg1Text: "Δημιουργικό πρόγραμμα για παιδιά 3\u20135 ετών με μουσική, τέχνη και πρώτες ανακαλύψεις.",
      nbProg2Title: "Βρεφικό τμήμα",
      nbProg2Text: "Τρυφερή φροντίδα για τα πιο μικρά μας, σε ένα ζεστό και ασφαλές περιβάλλον.",
      nbProg3Title: "Καλοκαιρινό Camp",
      nbProg3Text: "Παιχνίδι, νερό, φύση και περιπέτεια κάθε καλοκαίρι.",
      nbPhilosophyTitle: "Η φιλοσοφία μας",
      nbPhilosophyIntro: "Πιστεύουμε ότι κάθε παιδί γεννιέται εξερευνητής. Η αποστολή μας είναι να καλλιεργήσουμε αυτή τη φυσική περιέργεια μέσα από ένα περιβάλλον που εμπνέει.",
      nbPhil1Title: "Μάθηση μέσα από το παιχνίδι",
      nbPhil1Text: "Το παιχνίδι δεν είναι διάλειμμα από τη μάθηση — είναι ο τρόπος που μαθαίνουν τα παιδιά. Κάθε δραστηριότητα σχεδιάζεται για να ενθαρρύνει τη δημιουργικότητα και τη συνεργασία.",
      nbPhil2Title: "Ασφαλής εξερεύνηση",
      nbPhil2Text: "Φωτεινοί, ανοιχτοί χώροι σχεδιασμένοι ειδικά για μικρά χέρια και μεγάλα όνειρα. Κάθε γωνιά είναι μια πρόσκληση για ανακάλυψη.",
      nbPhil3Title: "Συναισθηματική ανάπτυξη",
      nbPhil3Text: "Βοηθάμε τα παιδιά να αναγνωρίζουν και να εκφράζουν τα συναισθήματά τους, χτίζοντας αυτοπεποίθηση και ενσυναίσθηση από νωρίς.",
      nbPhil4Title: "Φύση & αισθήσεις",
      nbPhil4Text: "Αισθητηριακό παιχνίδι, κήπος, φυσικά υλικά — τα παιδιά μαθαίνουν με όλες τους τις αισθήσεις.",
      nbWhyTitle: "Γιατί Τιραμόλα;",
      nbWhy1: "Εκπαιδευτικοί με πάθος και εμπειρία",
      nbWhy2: "Ασφαλείς, φωτεινοί χώροι σχεδιασμένοι για παιδιά",
      nbWhy3: "Πρόγραμμα βασισμένο στην περιέργεια και το παιχνίδι",
      nbWhy4: "Στην καρδιά της Λευκωσίας, εύκολη πρόσβαση",
      nbContactTitle: "Επικοινωνία",
      nbAddress: "Αρχιεπισκόπου Μακαρίου ΙΙΙ, Λευκωσία 1021, Κύπρος",
      nbPhone: "+357 22 436090",
      nbHours: "Δευτέρα \u2013 Παρασκευή: 7:00 \u2013 17:30",
      nbContactCta: "Καλέστε μας",
      nbMapCta: "Δείτε στο χάρτη",
      naHeroTagline: "Κάθε μέρα αρχίζει με αγάπη",
      naHeroSub: "Παιδικός σταθμός & νηπιαγωγείο στη Λευκωσία",
      naHeroCta: "Κλείστε ξενάγηση",
      naHeroBadge: "Ηλικίες 0–5 ετών",
      naAboutTitle: "Καλώς ήρθατε στην Τιραμόλα",
      naAboutText: "Στον παιδικό σταθμό Τιραμόλα, κάθε παιδί βρίσκει ένα ασφαλές λιμάνι. Με ζεστασιά, υπομονή και αγάπη, δημιουργούμε ένα περιβάλλον όπου τα παιδιά νιώθουν σπίτι τους και αναπτύσσονται με αυτοπεποίθηση.",
      naProgramsTitle: "Τα προγράμματά μας",
      naProg1Title: "Νηπιαγωγείο",
      naProg1Text: "Ένα ήρεμο και δημιουργικό πρόγραμμα για παιδιά 3–5 ετών, με τραγούδι, ζωγραφική και ήρεμες ανακαλύψεις.",
      naProg2Title: "Βρεφικό τμήμα",
      naProg2Text: "Απαλή φροντίδα και θαλπωρή για τα πιο μικρά μας, σε ένα ζεστό και γαλήνιο περιβάλλον.",
      naProg3Title: "Καλοκαιρινό Camp",
      naProg3Text: "Φύση, νερό, μουσική και ήρεμη περιπέτεια κάθε καλοκαίρι.",
      naPhilosophyTitle: "Η φιλοσοφία μας",
      naPhilosophyIntro: "Πιστεύουμε ότι κάθε παιδί χρειάζεται ένα ασφαλές λιμάνι — έναν χώρο γεμάτο ζεστασιά, όπου η μάθηση γεννιέται μέσα από τη φροντίδα.",
      naPhil1Title: "Ήρεμη μάθηση",
      naPhil1Text: "Σε ένα γαλήνιο περιβάλλον, τα παιδιά ανακαλύπτουν τον κόσμο με το δικό τους ρυθμό, χωρίς πίεση.",
      naPhil2Title: "Ασφαλές λιμάνι",
      naPhil2Text: "Φωτεινοί, προστατευμένοι χώροι σχεδιασμένοι ώστε κάθε παιδί να νιώθει σπίτι του.",
      naPhil3Title: "Συναισθηματικά θεμέλια",
      naPhil3Text: "Χτίζουμε αυτοπεποίθηση και ενσυναίσθηση μέσα από τρυφερή καθοδήγηση και αγάπη.",
      naPhil4Title: "Φύση & ηρεμία",
      naPhil4Text: "Κήπος, φυσικά υλικά και αισθητηριακό παιχνίδι — μαθαίνουμε ακούγοντας τη φύση.",
      naWhyTitle: "Γιατί Τιραμόλα;",
      naWhy1: "Εκπαιδευτικοί με ζεστασιά και εμπειρία",
      naWhy2: "Ασφαλείς, φωτεινοί χώροι γεμάτοι φροντίδα",
      naWhy3: "Πρόγραμμα που σέβεται τον ρυθμό κάθε παιδιού",
      naWhy4: "Στην καρδιά της Λευκωσίας, εύκολη πρόσβαση",
      naContactTitle: "Επικοινωνία",
      naAddress: "Αρχιεπισκόπου Μακαρίου ΙΙΙ, Λευκωσία 1021, Κύπρος",
      naPhone: "+357 22 436090",
      naHours: "Δευτέρα – Παρασκευή: 7:00 – 17:30",
      naContactCta: "Καλέστε μας",
      naMapCta: "Δείτε στο χάρτη",
      ncHeroTagline: "Χτίζουμε σταθερά θεμέλια",
      ncHeroSub: "Παιδικός σταθμός & νηπιαγωγείο στη Λευκωσία",
      ncHeroCta: "Κλείστε ξενάγηση",
      ncHeroBadge: "Ηλικίες 0–5 ετών",
      ncAboutTitle: "Καλώς ήρθατε στην Τιραμόλα",
      ncAboutText: "Στον παιδικό σταθμό Τιραμόλα, η ποιοτική φροντίδα συναντά τη σύγχρονη παιδαγωγική. Προσφέρουμε ένα οργανωμένο, ασφαλές περιβάλλον όπου κάθε παιδί αναπτύσσει τις δεξιότητές του με σιγουριά.",
      ncProgramsTitle: "Τα προγράμματά μας",
      ncProg1Title: "Νηπιαγωγείο",
      ncProg1Text: "Δομημένο πρόγραμμα για παιδιά 3–5 ετών με πρώτη ανάγνωση, λογική σκέψη και δημιουργικότητα.",
      ncProg2Title: "Βρεφικό τμήμα",
      ncProg2Text: "Επαγγελματική φροντίδα για τα πιο μικρά μας, σε ένα σύγχρονο και ασφαλές περιβάλλον.",
      ncProg3Title: "Καλοκαιρινό Camp",
      ncProg3Text: "Οργανωμένες δραστηριότητες, αθλητισμός και δημιουργική απασχόληση κάθε καλοκαίρι.",
      ncPhilosophyTitle: "Η φιλοσοφία μας",
      ncPhilosophyIntro: "Πιστεύουμε ότι η σταθερότητα και η δομή χτίζουν σιγουριά. Η αποστολή μας είναι να προσφέρουμε ποιοτική εκπαίδευση με σύγχρονες μεθόδους.",
      ncPhil1Title: "Δομημένη μάθηση",
      ncPhil1Text: "Σαφές πρόγραμμα με μετρήσιμους στόχους, σχεδιασμένο από παιδαγωγούς με εμπειρία.",
      ncPhil2Title: "Ασφάλεια & ποιότητα",
      ncPhil2Text: "Σύγχρονες εγκαταστάσεις, αυστηρά πρωτόκολλα ασφαλείας και καθαρότητας.",
      ncPhil3Title: "Κριτική σκέψη",
      ncPhil3Text: "Ενθαρρύνουμε τα παιδιά να ρωτούν, να πειραματίζονται και να σκέφτονται δημιουργικά.",
      ncPhil4Title: "Σταθερή πρόοδος",
      ncPhil4Text: "Τακτική αξιολόγηση και επικοινωνία με τους γονείς για τη συνεχή ανάπτυξη κάθε παιδιού.",
      ncWhyTitle: "Γιατί Τιραμόλα;",
      ncWhy1: "Εξειδικευμένοι παιδαγωγοί με σύγχρονη κατάρτιση",
      ncWhy2: "Σύγχρονοι, ασφαλείς χώροι υψηλών προδιαγραφών",
      ncWhy3: "Πρόγραμμα με σαφείς στόχους και μετρήσιμα αποτελέσματα",
      ncWhy4: "Στην καρδιά της Λευκωσίας, εύκολη πρόσβαση",
      ncContactTitle: "Επικοινωνία",
      ncAddress: "Αρχιεπισκόπου Μακαρίου ΙΙΙ, Λευκωσία 1021, Κύπρος",
      ncPhone: "+357 22 436090",
      ncHours: "Δευτέρα – Παρασκευή: 7:00 – 17:30",
      ncContactCta: "Καλέστε μας",
      ncMapCta: "Δείτε στο χάρτη",
      landingStep1Title: "Απάντησε 9 Διασκεδαστικές Ερωτήσεις",
      landingStep1Body: "Πες μας για την προσωπικότητα του σχολείου σου, τις προτιμήσεις ύφους και τι σου αρέσει περισσότερο.",
      landingStep2Title: "Βρες το Ιδανικό Ταίρι",
      landingStep2Body: "Υπολογίζουμε ποια από τις 3 σχεδιαστικές κατευθύνσεις ταιριάζει καλύτερα στον παιδικό σου σταθμό.",
      landingStep3Title: "Δες το Πακέτο Ταυτότητας",
      landingStep3Body: "Εξερεύνησε το ολοκληρωμένο πακέτο — λογότυπα, χρώματα, προσομοιώσεις και έτοιμη παρουσίαση.",
      q1Text: "Θέλεις το λογότυπο να δείχνει περισσότερο",
      q1Opt1: "Ασφάλεια και φροντίδα",
      q1Opt2: "Κίνηση και περιέργεια",
      q1Opt3: "Καθαρότητα και κύρος",
      q2Text: "Πόσο παιχνιδιάρικο να είναι;",
      q3Text: "Πόσο 'Μεσόγειο' να θυμίζει;",
      q4Text: "Τι προτιμάς ως βασικό σχήμα;",
      q4Opt1: "Καμπύλες σαν κύμα, αγκαλιά",
      q4Opt2: "Σπείρα, περιστροφή, κίνηση",
      q4Opt3: "Σταθερό γράμμα T, μονογράφημα",
      q5Text: "Πού θα το βλέπουν πιο συχνά;",
      q5Opt1: "Επιγραφή και τοίχος σχολείου",
      q5Opt2: "Κοινωνικά δίκτυα, εικονίδιο, αυτοκόλλητο",
      q5Opt3: "Σε όλα ισότιμα",
      q6Text: "Τυπογραφία",
      q6Opt1: "Πολύ στρογγυλεμένη, παιδική",
      q6Opt2: "Σύγχρονη, καθαρή, φιλική",
      q6Opt3: "Πιο σοβαρή, αλλά ζεστή",
      q7Text: "Πόσα χρώματα αντέχεις;",
      q7Opt1: "1 έως 2",
      q7Opt2: "2 έως 3",
      q7Opt3: "3 έως 4 με ένταση",
      q8Text: "Προτιμάς το λογότυπο να έχει κρυφό νόημα;",
      q8Opt1: "Ναι, κρυφό T μέσα στο σχήμα",
      q8Opt2: "Όχι, να είναι ξεκάθαρο",
      q8Opt3: "Λίγο, αλλά όχι υπερβολές",
      q9Text: "Αν η Τιραμόλα ήταν χαρακτήρας, θα ήταν",
      q9Opt1: "Ήρεμος προστάτης",
      q9Opt2: "Περίεργος εξερευνητής",
      q9Opt3: "Έξυπνος οργανωτής",
      tapReveal: "Πάτα για αποκάλυψη",
    },
    en: {
      start: "Start",
      introTitle: "Welcome to the Tiramola Identity Workshop",
      introBody:
        "In just 9 fun questions, we'll discover which visual identity fits your nursery best \u2014 complete with colours, logos, and a ready-to-use design pack.",
      landingTagline: "Let's find the perfect identity for your school!",
      navQuiz: "Quiz",
      navResult: "Your Fit",
      navConcepts: "Concepts",
      navCompare: "Compare",
      navPitch: "Pitch",
      navDeck: "Full Presentation",
      stageFlow: "Experience flow",
      stageIntro: "Intro",
      next: "Next",
      prev: "Back",
      finish: "Finish",
      confidence: "Confidence",
      yourFit: "Your result",
      topMatches: "Top matches",
      chooseThis: "Choose this",
      viewFullPitch: "View full pitch",
      seeVariants: "See variants",
      refine: "I want refinement",
      share: "Copy Share Link",
      brandCore: "Brand Core",
      ageRange: "Age range",
      dynamicTheme: "Dynamic UI Theme",
      primary: "Primary",
      outline: "Outline",
      questionShort: "Q",
      value: "Value",
      completion: "Completion",
      resetQuiz: "Reset",
      recommendedRoute: "Recommended route",
      whyRoute: "Why this route",
      themePreview: "Theme preview",
      family: "Family",
      typography: "Typography",
      compareCta: "Compare",
      conceptsGallery: "Concepts Gallery",
      conceptsIntro: "3 complete logo directions with lockups, icon rules and mockups.",
      mockupCarousel: "Application previews by route",
      compareTitle: "Compare A vs B vs C",
      compareKey: "Key",
      compareConcept: "Concept",
      compareMarkFocus: "Mark focus",
      compareBestFor: "Best for",
      compareRisk: "Potential risk",
      compareBestForA: "Balanced trust + warmth",
      compareBestForB: "Playful social-first visibility",
      compareBestForC: "Scalable premium-friendly clarity",
      compareRiskA: "Can feel too safe if accents are weak",
      compareRiskB: "Can feel too busy without limits",
      compareRiskC: "Can feel too formal if spacing is tight",
      pitchTitle: "Design Pitch",
      pitchIntro: "This page is the final pitch based on your responses.",
      pitchSection1: "1) Recommended Direction",
      pitchSection2: "2) Visual System",
      pitchSection3: "3) Logo Concept Story",
      pitchSection4: "4) Mockup Applications",
      pitchHeroEyebrow: "Final Creative Direction",
      pitchPersonality: "Brand Personality",
      pitchPromise: "Core Promise",
      pitchSignature: "Signature Mark Features",
      pitchCraft: "Tone & Craft Quality",
      pitchLaunch: "First Reveal Idea",
      pitchBrief: "Short Creative Brief",
      pitchApplications: "Priority Applications",
      pitchCompareHintTitle: "Need extra confidence?",
      runnerUp: "Runner-up",
      points: "points",
      paletteFamily: "Palette family",
      uiStyle: "UI style",
      radius: "radius",
      primaryCta: "Primary CTA",
      markConcept: "Mark concept",
      wordmarkLabel: "Wordmark",
      styleLabel: "Style",
      wordmarkRules: "Wordmark rules",
      styleDirection: "Style direction",
      lockups: "Lockups",
      iconRules: "Icon rules",
      suggestedTaglines: "Suggested taglines",
      compareRoutesCta: "Compare other routes",
      copyPitchSummary: "Copy Pitch Summary",
      footer: "Interactive route matching • Visual theme preview • Concept comparison • Shareable presentation",
      pitchSummaryTitle: "Tiramola Design Pitch",
      pitchSummaryRoute: "Recommended Route",
      pitchSummaryFamily: "Theme Family",
      brandTitle: "Tiramola Identity Lab",
      routeLabel: "Route",
      secondary: "Secondary",
      variantsAndMockups: "Variants and mockups",
      mockupsLabel: "Mockups",
      doLabel: "Do",
      dontLabel: "Don't",
      copied: "Copied",
      linkCopied: "Link Copied",
      answerCount: "Answered",
      incompleteTitle: "All answers are required",
      incompleteBody: "For a reliable recommendation, complete all 9 questions before viewing result or pitch.",
      continueQuiz: "Continue quiz",
      showMeter: "Show interim score",
      hideMeter: "Hide interim score",
      comparisonHint: "Confidence is low or there is a close tie. Next best step: compare routes.",
      tieNotice: "Tie: compare mode is recommended.",
      readinessHigh: "High readiness",
      readinessMedium: "Medium readiness",
      readinessLow: "Low readiness",
      pitchReadiness: "Recommendation readiness",
      nextStepsTitle: "Next steps",
      nextStep1: "Lock the main route and request 2-3 logo variants.",
      nextStep2: "Check mark legibility at small sizes (24px, 32px) and one-color use.",
      nextStep3: "Validate mockups in signage, social icon and stationery before final delivery.",
      secondaryTheme: "Secondary",
      sampleUiTitle: "Button style sample",
      samplePrimary: "Primary style",
      sampleSecondary: "Secondary style",
      journeyTitle: "How it works",
      journeyStep1: "1. Answer 9 quick questions",
      journeyStep2: "2. We calculate the best-fit route",
      journeyStep3: "3. You get the final design pitch",
      brandTypeLabel: "Nursery",
      brandLocationLabel: "Cyprus",
      themeFamilyA: "Mediterranean Bright",
      themeFamilyB: "Curiosity Pop",
      themeFamilyC: "Modern Trust",
      briefTitle: "Creative Brief Summary",
      briefIntro: "Based on your answers, this is the recommended direction before moving into the full presentation.",
      deckTitle: "Full Design Direction Pitch",
      deckIntro: "Below is the complete proposal with logos, mockups and branded applications for the selected direction.",
      logoSystem: "Logo System",
      logoPrimaryPh: "Primary logo",
      logoSecondaryPh: "Secondary logo",
      logoIconPh: "Icon mark",
      logoHorizontalPh: "Horizontal lockup",
      logoStackedPh: "Stacked lockup",
      logoMonoPh: "Monochrome version",
      mockupGallery: "Mockup Gallery",
      appsShowcase: "Application Showcase",
      phSignage: "Outdoor signage",
      phSocial: "Social post",
      phUniform: "Staff uniform",
      phStationery: "Stationery",
      phSticker: "Sticker sheet",
      phPlayground: "Playground signage",
      phWebHero: "Website hero",
      phBag: "Tote bag",
      expHeroEyebrow: "Discover Route",
      expBrandStory: "Brand Story",
      expVisualShowcase: "Visual Showcase",
      expPaletteTitle: "Color Palette",
      expTypographyTitle: "Typography",
      expSelectRoute: "Select this route",
      expViewPitch: "View full pitch",
      expViewExperience: "View experience",
      expPromise: "Promise",
      expPersonality: "Personality",
      expHeadingFont: "Heading Font",
      expBodyFont: "Body Font",
      expSignatureFeatures: "Design Features",
      expMarkConcept: "Mark Concept",
      nbHeroTagline: "Curiosity is learning",
      nbHeroSub: "Nursery & kindergarten in Nicosia",
      nbHeroCta: "Book a tour",
      nbHeroBadge: "Ages 0–5",
      nbAboutTitle: "Welcome to Tiramola",
      nbAboutText: "At Tiramola kindergarten, every day is a new adventure. Through play, creativity and exploration, children discover the world around them in a safe and joyful environment.",
      nbProgramsTitle: "Our programmes",
      nbProg1Title: "Kindergarten",
      nbProg1Text: "Creative programme for children 3\u20135 with music, art and first discoveries.",
      nbProg2Title: "Infant care",
      nbProg2Text: "Tender care for our youngest, in a warm and secure setting.",
      nbProg3Title: "Summer Camp",
      nbProg3Text: "Play, water, nature and adventure every summer.",
      nbPhilosophyTitle: "Our philosophy",
      nbPhilosophyIntro: "We believe every child is born an explorer. Our mission is to nurture that natural curiosity through an environment that inspires.",
      nbPhil1Title: "Learning through play",
      nbPhil1Text: "Play isn't a break from learning — it's how children learn. Every activity is designed to encourage creativity and collaboration.",
      nbPhil2Title: "Safe exploration",
      nbPhil2Text: "Bright, open spaces designed for little hands and big dreams. Every corner is an invitation to discover.",
      nbPhil3Title: "Emotional growth",
      nbPhil3Text: "We help children recognise and express their feelings, building confidence and empathy from an early age.",
      nbPhil4Title: "Nature & senses",
      nbPhil4Text: "Sensory play, gardening, natural materials — children learn with all their senses.",
      nbWhyTitle: "Why Tiramola?",
      nbWhy1: "Passionate and experienced educators",
      nbWhy2: "Safe, bright spaces designed for children",
      nbWhy3: "Curriculum built on curiosity and play",
      nbWhy4: "In the heart of Nicosia, easy access",
      nbContactTitle: "Contact",
      nbAddress: "Archiepiskopou Makariou III, Nicosia 1021, Cyprus",
      nbPhone: "+357 22 436090",
      nbHours: "Monday \u2013 Friday: 7:00 \u2013 17:30",
      nbContactCta: "Call us",
      nbMapCta: "View on map",
      naHeroTagline: "Every day begins with love",
      naHeroSub: "Nursery & kindergarten in Nicosia",
      naHeroCta: "Book a tour",
      naHeroBadge: "Ages 0–5",
      naAboutTitle: "Welcome to Tiramola",
      naAboutText: "At Tiramola kindergarten, every child finds a safe harbour. With warmth, patience and love, we create a space where children feel at home and grow with confidence.",
      naProgramsTitle: "Our programmes",
      naProg1Title: "Kindergarten",
      naProg1Text: "A calm, creative programme for children 3–5 with singing, painting and gentle discoveries.",
      naProg2Title: "Infant care",
      naProg2Text: "Soft care and warmth for our youngest, in a cosy and peaceful setting.",
      naProg3Title: "Summer Camp",
      naProg3Text: "Nature, water, music and gentle adventure every summer.",
      naPhilosophyTitle: "Our philosophy",
      naPhilosophyIntro: "We believe every child needs a safe harbour — a space full of warmth where learning is born from care.",
      naPhil1Title: "Gentle learning",
      naPhil1Text: "In a peaceful setting, children discover the world at their own pace, without pressure.",
      naPhil2Title: "Safe harbour",
      naPhil2Text: "Bright, protected spaces designed so every child feels at home.",
      naPhil3Title: "Emotional foundations",
      naPhil3Text: "We build confidence and empathy through tender guidance and love.",
      naPhil4Title: "Nature & calm",
      naPhil4Text: "Garden, natural materials and sensory play — we learn by listening to nature.",
      naWhyTitle: "Why Tiramola?",
      naWhy1: "Warm and experienced educators",
      naWhy2: "Safe, bright spaces full of care",
      naWhy3: "A programme that respects each child's rhythm",
      naWhy4: "In the heart of Nicosia, easy access",
      naContactTitle: "Contact",
      naAddress: "Archiepiskopou Makariou III, Nicosia 1021, Cyprus",
      naPhone: "+357 22 436090",
      naHours: "Monday – Friday: 7:00 – 17:30",
      naContactCta: "Call us",
      naMapCta: "View on map",
      ncHeroTagline: "Building strong foundations",
      ncHeroSub: "Nursery & kindergarten in Nicosia",
      ncHeroCta: "Book a tour",
      ncHeroBadge: "Ages 0–5",
      ncAboutTitle: "Welcome to Tiramola",
      ncAboutText: "At Tiramola kindergarten, quality care meets modern pedagogy. We offer a structured, safe environment where every child develops their skills with confidence.",
      ncProgramsTitle: "Our programmes",
      ncProg1Title: "Kindergarten",
      ncProg1Text: "A structured programme for children 3–5 with early literacy, logical thinking and creativity.",
      ncProg2Title: "Infant care",
      ncProg2Text: "Professional care for our youngest, in a modern and secure setting.",
      ncProg3Title: "Summer Camp",
      ncProg3Text: "Organised activities, sports and creative play every summer.",
      ncPhilosophyTitle: "Our philosophy",
      ncPhilosophyIntro: "We believe that structure and consistency build confidence. Our mission is to deliver quality education through modern methods.",
      ncPhil1Title: "Structured learning",
      ncPhil1Text: "A clear curriculum with measurable goals, designed by experienced educators.",
      ncPhil2Title: "Safety & quality",
      ncPhil2Text: "Modern facilities with strict safety and hygiene protocols.",
      ncPhil3Title: "Critical thinking",
      ncPhil3Text: "We encourage children to ask questions, experiment and think creatively.",
      ncPhil4Title: "Steady progress",
      ncPhil4Text: "Regular assessment and parent communication for every child's continuous development.",
      ncWhyTitle: "Why Tiramola?",
      ncWhy1: "Specialised educators with modern training",
      ncWhy2: "Modern, safe spaces to the highest standards",
      ncWhy3: "A programme with clear goals and measurable outcomes",
      ncWhy4: "In the heart of Nicosia, easy access",
      ncContactTitle: "Contact",
      ncAddress: "Archiepiskopou Makariou III, Nicosia 1021, Cyprus",
      ncPhone: "+357 22 436090",
      ncHours: "Monday – Friday: 7:00 – 17:30",
      ncContactCta: "Call us",
      ncMapCta: "View on map",
      landingStep1Title: "Answer 9 Fun Questions",
      landingStep1Body: "Tell us about your school's personality, style preferences, and what matters most to you.",
      landingStep2Title: "Get Your Perfect Match",
      landingStep2Body: "We'll calculate which of 3 design directions fits your nursery best.",
      landingStep3Title: "See Your Identity Pack",
      landingStep3Body: "Explore your complete brand package — logos, colours, mockups, and a ready-to-use pitch deck.",
      q1Text: "What should the logo convey most?",
      q1Opt1: "Safety and care",
      q1Opt2: "Movement and curiosity",
      q1Opt3: "Clarity and prestige",
      q2Text: "How playful should it be?",
      q3Text: "How 'Mediterranean' should it feel?",
      q4Text: "What basic shape do you prefer?",
      q4Opt1: "Curves like a wave, an embrace",
      q4Opt2: "Spiral, rotation, movement",
      q4Opt3: "Solid letter T, monogram",
      q5Text: "Where will it be seen most often?",
      q5Opt1: "School sign and wall",
      q5Opt2: "Social media, icon, sticker",
      q5Opt3: "Equally everywhere",
      q6Text: "Typography",
      q6Opt1: "Very rounded, childlike",
      q6Opt2: "Modern, clean, friendly",
      q6Opt3: "More serious, but warm",
      q7Text: "How many colours can you handle?",
      q7Opt1: "1 to 2",
      q7Opt2: "2 to 3",
      q7Opt3: "3 to 4, bold",
      q8Text: "Should the logo have a hidden meaning?",
      q8Opt1: "Yes, a hidden T inside the shape",
      q8Opt2: "No, keep it straightforward",
      q8Opt3: "A little, but nothing excessive",
      q9Text: "If Tiramola were a character, it would be",
      q9Opt1: "A calm protector",
      q9Opt2: "A curious explorer",
      q9Opt3: "A clever organiser",
      tapReveal: "Tap to reveal",
    },
  };

  const questions = [
    {
      id: "q1",
      type: "single",
      textKey: "q1Text",
      options: [
        { labelKey: "q1Opt1", scores: { A: 3, C: 1 }, tone: { calm: 2 } },
        { labelKey: "q1Opt2", scores: { B: 3, A: 1 }, tone: { energy: 2 } },
        { labelKey: "q1Opt3", scores: { C: 3, A: 1 }, tone: { modern: 1, minimal: 1 } },
      ],
    },
    {
      id: "q2",
      type: "slider",
      min: 1,
      max: 5,
      default: 3,
      textKey: "q2Text",
      map(value) {
        if (value <= 2) {
          return { scores: { C: 2, A: 1 }, tone: { minimal: 2 } };
        }
        if (value === 3) {
          return { scores: { A: 2, B: 2 }, tone: { calm: 1, energy: 1 } };
        }
        return {
          scores: { B: 3, A: 1 },
          tone: { expressive: 2, energy: 2 },
        };
      },
    },
    {
      id: "q3",
      type: "slider",
      min: 1,
      max: 5,
      default: 3,
      textKey: "q3Text",
      map(value) {
        if (value <= 2) {
          return { scores: { C: 2 }, tone: { global: 2 } };
        }
        if (value === 3) {
          return { scores: { A: 2, C: 1 }, tone: { local: 1 } };
        }
        return { scores: { A: 3, B: 1 }, tone: { local: 2 } };
      },
    },
    {
      id: "q4",
      type: "single",
      textKey: "q4Text",
      options: [
        { labelKey: "q4Opt1", scores: { A: 3, B: 1 }, tone: { calm: 1 } },
        { labelKey: "q4Opt2", scores: { B: 3 }, tone: { energy: 1 } },
        { labelKey: "q4Opt3", scores: { C: 3 }, tone: { modern: 1 } },
      ],
    },
    {
      id: "q5",
      type: "single",
      textKey: "q5Text",
      options: [
        { labelKey: "q5Opt1", scores: { C: 2, A: 2 }, tone: { classic: 1 } },
        { labelKey: "q5Opt2", scores: { B: 3, C: 1 }, tone: { expressive: 1 } },
        { labelKey: "q5Opt3", scores: { A: 2, B: 2, C: 2 }, tone: { modern: 1 } },
      ],
    },
    {
      id: "q6",
      type: "single",
      textKey: "q6Text",
      options: [
        { labelKey: "q6Opt1", scores: { B: 2, A: 1 }, tone: { expressive: 1 } },
        { labelKey: "q6Opt2", scores: { A: 2, C: 2 }, tone: { modern: 1 } },
        { labelKey: "q6Opt3", scores: { C: 3 }, tone: { classic: 1 } },
      ],
    },
    {
      id: "q7",
      type: "single",
      textKey: "q7Text",
      options: [
        { labelKey: "q7Opt1", scores: { C: 2, A: 1 }, tone: { minimal: 2 } },
        { labelKey: "q7Opt2", scores: { A: 2, B: 2 }, tone: { modern: 1 } },
        { labelKey: "q7Opt3", scores: { B: 3 }, tone: { expressive: 2 } },
      ],
    },
    {
      id: "q8",
      type: "single",
      textKey: "q8Text",
      options: [
        { labelKey: "q8Opt1", scores: { B: 2, A: 2 }, tone: { expressive: 1 } },
        { labelKey: "q8Opt2", scores: { C: 3 }, tone: { minimal: 1 } },
        { labelKey: "q8Opt3", scores: { A: 2, C: 1 }, tone: { calm: 1 } },
      ],
    },
    {
      id: "q9",
      type: "single",
      textKey: "q9Text",
      options: [
        { labelKey: "q9Opt1", scores: { A: 3 }, tone: { calm: 2 } },
        { labelKey: "q9Opt2", scores: { B: 3 }, tone: { energy: 2, expressive: 1 } },
        { labelKey: "q9Opt3", scores: { C: 3 }, tone: { modern: 1, minimal: 1 } },
      ],
    },
  ];

  const conceptPacks = {
    A: {
      name: "Κύμα Αγκαλιάς",
      packLabel: "Safe Harbour Wave",
      markDescription:
        "Μία απλή καμπύλη σαν κύμα που σχηματίζει προστατευτικό τόξο πάνω από μία τελεία, με διακριτικό T στην κίνηση της γραμμής.",
      style: "Smooth line, 1-2 strokes, no clipart.",
      wordmarkRules:
        "Rounded sans, low contrast, slightly increased tracking for clarity.",
      palette: ["#1FB6C9", "#0B5B8A", "#F6E7C8", "#FFD24A", "#FF6B6B", "#12323A", "#FFFFFF"],
      lockups: [
        "Horizontal: mark left, wordmark right",
        "Stacked: mark top, wordmark under",
        "Icon only: mark in circle badge",
      ],
      iconRules: "Works at 24px, no detail thinner than 2px.",
      mockups: [
        "School signage on light wall",
        "Uniform badge embroidery (1 color)",
        "Classroom wall decal",
        "Instagram profile circle",
        "A4 letterhead header",
      ],
      do: [
        "Use wide breathing room around the arc",
        "Keep line weight consistent",
        "Support one-color applications",
      ],
      dont: [
        "Do not add illustrative faces or clipart",
        "Avoid very thin tails",
        "Avoid more than 2 key strokes",
      ],
      taglines: [
        "Παίζουμε, μεγαλώνουμε, νιώθουμε ασφαλείς",
        "Χαρά και φροντίδα κάθε μέρα",
      ],
    },
    B: {
      name: "Σπείρα Περιέργειας",
      packLabel: "Curiosity Spiral",
      markDescription:
        "Σπείρα που θυμίζει ήλιο ή σαλιγκάρι, με κρυφό T στον αρνητικό χώρο ή μικρή εγκοπή.",
      style: "Bold shapes, sticker feel, high contrast, playful.",
      wordmarkRules: "Friendly display heading with clean supporting body font.",
      palette: ["#19C2B1", "#FF4FB2", "#FFE14D", "#5CC8FF", "#B7F5D8", "#132235", "#FFFFFF"],
      lockups: [
        "Horizontal",
        "Stacked",
        "Icon only: swirl in rounded square",
      ],
      iconRules: "Readable motion at small sizes, max 2 internal turns.",
      mockups: [
        "Sticker sheet for kids badges",
        "Social post templates with doodles",
        "Website hero with subtle animated rotation",
        "Tote bag print",
        "Playground sign",
      ],
      do: [
        "Keep swirl center open enough",
        "Limit internal turns to 2",
        "Use high contrast combinations",
      ],
      dont: [
        "No tiny decorative fragments",
        "Do not over-rotate wordmark",
        "Avoid gradients in tiny icon sizes",
      ],
      taglines: ["Η περιέργεια είναι μάθηση", "Μικρές ανακαλύψεις, μεγάλα χαμόγελα"],
    },
    C: {
      name: "Το T που Χαμογελά",
      packLabel: "Bold T Monogram",
      markDescription:
        "Στιβαρό γράμμα T από στρογγυλεμένα σχήματα, με προαιρετικό χαμόγελο σε αρνητικό χώρο ή μικρή τελεία-φύλλο.",
      style: "Geometric, scalable, premium but friendly.",
      wordmarkRules: "Modern rounded sans with careful kerning.",
      palette: ["#0E7C86", "#0B1F3B", "#FFF4E6", "#FFC857", "#FF7A90", "#334155", "#FFFFFF"],
      lockups: [
        "Primary: monogram + Tiramola",
        "Secondary: wordmark only",
        "Icon: monogram in circle",
      ],
      iconRules: "No thin lines; clean silhouette only.",
      mockups: [
        "Large outdoor sign",
        "Staff t-shirts",
        "Official docs and invoice header",
        "App icon",
        "Directional signage inside school",
      ],
      do: [
        "Preserve block balance in T arms",
        "Prioritize monochrome legibility",
        "Use wider spacing for formal docs",
      ],
      dont: [
        "Do not add handwritten style",
        "Avoid tiny smile cuts",
        "Do not stretch monogram proportions",
      ],
      taglines: ["Σταθερή φροντίδα, χαρούμενη μάθηση", "Μαθαίνουμε με ασφάλεια"],
    },
  };

  const designAssets = {
    A: {
      logos: {
        primary: "assets/designs/A/logos/primary.png",
        secondary: "assets/designs/A/logos/secondary.png",
        icon: "assets/designs/A/logos/icon.png",
        horizontal: "assets/designs/A/logos/horizontal.png",
        stacked: "assets/designs/A/logos/stacked.png",
        mono: "assets/designs/A/logos/mono.png",
      },
      mockups: {
        signage: "assets/designs/A/mockups/signage.jpg",
        social: "assets/designs/A/mockups/social.jpg",
        webhero: "assets/designs/A/mockups/webhero.jpg",
        uniform: "assets/designs/A/mockups/uniform.jpg",
        stationery: "assets/designs/A/mockups/stationery.jpg",
        sticker: "",
        playground: "",
        tote: "",
      },
    },
    B: {
      logos: {
        primary: "assets/designs/B/logos/primary.png",
        secondary: "assets/designs/B/logos/secondary.png",
        icon: "assets/designs/B/logos/icon.png",
        horizontal: "",
        stacked: "assets/designs/B/logos/stacked.png",
        mono: "assets/designs/B/logos/mono.png",
      },
      mockups: {
        signage: "assets/designs/B/mockups/signage.jpg",
        social: "assets/designs/B/mockups/social.jpg",
        webhero: "assets/designs/B/mockups/webhero.jpg",
        uniform: "assets/designs/B/mockups/uniform.jpg",
        stationery: "assets/designs/B/mockups/stationery.jpg",
        sticker: "assets/designs/B/mockups/sticker.jpg",
        playground: "assets/designs/B/mockups/playground.jpg",
        tote: "assets/designs/B/mockups/tote.jpg",
      },
    },
    C: {
      logos: {
        primary: "assets/designs/C/logos/primary.png",
        secondary: "assets/designs/C/logos/secondary.png",
        icon: "assets/designs/C/logos/icon.png",
        horizontal: "",
        stacked: "",
        mono: "assets/designs/C/logos/mono.png",
      },
      mockups: {
        signage: "assets/designs/C/mockups/signage.jpg",
        social: "assets/designs/C/mockups/Social.jpg",
        webhero: "assets/designs/C/mockups/webhero.jpg",
        uniform: "",
        stationery: "assets/designs/C/mockups/stationery.jpg",
        sticker: "",
        playground: "assets/designs/C/mockups/playground.jpg",
        tote: "assets/designs/C/mockups/tote.jpg",
      },
    },
  };

  let state = hydrateState();

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function isLightColor(hex) {
    const c = hex.replace("#", "");
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 160;
  }

  function safeStorageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (_err) {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (_err) {
      // Storage can be blocked in privacy modes or strict browser settings.
    }
  }

  function hydrateState() {
    const url = new URL(window.location.href);
    const encoded = url.searchParams.get("s");
    if (encoded) {
      try {
        const decoded = decodeURIComponent(escape(atob(encoded)));
        const parsed = JSON.parse(decoded);
        return recomputeFromAnswers({ ...clone(baseState), ...parsed });
      } catch (_err) {
        // fallback to storage/default
      }
    }
    const raw = safeStorageGet(STORAGE_KEY);
    if (!raw) {
      return recomputeFromAnswers(clone(baseState));
    }
    try {
      const parsed = JSON.parse(raw);
      return recomputeFromAnswers({ ...clone(baseState), ...parsed });
    } catch (_err) {
      return recomputeFromAnswers(clone(baseState));
    }
  }

  function saveState() {
    safeStorageSet(STORAGE_KEY, JSON.stringify(state));
  }

  async function copyText(text) {
    if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(text);
      return true;
    }
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return !!ok;
    } catch (_err) {
      return false;
    }
  }

  function routeFromHash() {
    const raw = window.location.hash.replace("#", "") || "/";
    return raw.startsWith("/") ? raw : `/${raw}`;
  }

  function hashQueryParam(key) {
    const hash = window.location.hash.replace("#", "");
    const query = hash.includes("?") ? hash.split("?")[1] : "";
    const params = new URLSearchParams(query);
    return params.get(key);
  }

  function navigate(path) {
    window.location.hash = path;
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }

  function setThemeVars(theme) {
    const root = document.documentElement;
    root.style.setProperty("--bg", theme.palette.bg);
    root.style.setProperty("--surface", theme.palette.surface);
    root.style.setProperty("--primary", theme.palette.primary);
    root.style.setProperty("--primary-700", theme.palette.primary700);
    root.style.setProperty("--accent", theme.palette.accent);
    root.style.setProperty("--accent-2", theme.palette.accent2);
    root.style.setProperty("--text", theme.palette.text);
    root.style.setProperty("--text-muted", theme.palette.textMuted);
    root.style.setProperty("--border", theme.palette.border);
    root.style.setProperty("--radius", `${theme.ui.radius}px`);
    root.style.setProperty("--heading-font", theme.typography.heading);
    root.style.setProperty("--body-font", theme.typography.body);
  }

  function applyContribution(contribution, scores, tone) {
    Object.entries(contribution.scores || {}).forEach(([k, v]) => {
      scores[k] += v;
    });
    Object.entries(contribution.tone || {}).forEach(([k, v]) => {
      tone[k] += v;
    });
  }

  function recomputeFromAnswers(inputState) {
    const next = clone(inputState);
    const scores = { A: 0, B: 0, C: 0 };
    const tone = {
      energy: 0,
      calm: 0,
      modern: 0,
      classic: 0,
      minimal: 0,
      expressive: 0,
      local: 0,
      global: 0,
    };

    questions.forEach((q) => {
      const answer = next.quiz.answers[q.id];
      if (answer === undefined || answer === null) {
        return;
      }
      if (q.type === "single") {
        const option = q.options[answer];
        if (option) {
          applyContribution(option, scores, tone);
        }
        return;
      }
      if (q.type === "slider") {
        applyContribution(q.map(Number(answer)), scores, tone);
      }
    });

    next.quiz.scores = scores;
    next.quiz.tone = tone;

    const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topScore = ranked[0][1];
    const secondScore = ranked[1][1];
    const topMatches = ranked.filter(([, score]) => score === topScore).map(([k]) => k);
    const delta = topScore - secondScore;
    const confidence = clamp(delta / MAX_CONFIDENCE_DELTA, 0.2, 0.9);

    next.result = {
      recommendedRoute: ranked[0][0],
      confidence: Number(confidence.toFixed(2)),
      explanationBullets: explanationBullets(next.quiz, ranked[0][0]),
      topMatches,
    };

    next.theme = generateTheme(next.result.recommendedRoute, tone);
    next.concepts = conceptPacks;

    return next;
  }

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  function explanationBullets(quiz, route) {
    const bullets = [];
    const t = quiz.tone;
    if (route === "A") {
      bullets.push("Έδειξες προτίμηση σε ασφάλεια, φροντίδα και ισορροπημένη παιχνιδιάρικη έκφραση.");
      bullets.push(t.local >= 2 ? "Τοπικός/Μεσογειακός χαρακτήρας επηρεάζει τη χρωματική κατεύθυνση." : "Η ταυτότητα μένει καθαρή και ευανάγνωστη σε όλα τα σημεία επαφής.");
      bullets.push("Η κατεύθυνση A ισορροπεί φιλικό ύφος με αξιοπιστία για γονείς.");
      return bullets;
    }
    if (route === "B") {
      bullets.push("Οι απαντήσεις σου ευνοούν κίνηση, περιέργεια και υψηλή εκφραστικότητα.");
      bullets.push(t.energy >= 3 ? "Η υψηλή ενέργεια μεταφράζεται σε πιο έντονες τονικές αντιθέσεις και παιχνιδιάρικες μικρο-κινήσεις." : "Η παιχνιδιάρικη κατεύθυνση μένει ελεγχόμενη για καθαρή αναγνωρισιμότητα.");
      bullets.push("Η κατεύθυνση B δίνει ισχυρή παρουσία σε κοινωνικά δίκτυα και εικονίδια.");
      return bullets;
    }
    bullets.push("Έδειξες προτίμηση σε καθαρότητα, δομή και ποιοτική, φιλική αίσθηση.");
    bullets.push(t.minimal >= 2 ? "Η μινιμαλιστική τάση περιορίζει τα χρώματα διεπαφής για πιο καθαρή εμπειρία." : "Η σύγχρονη τυπογραφική κατεύθυνση αυξάνει αναγνωσιμότητα και κύρος.");
    bullets.push("Η κατεύθυνση C είναι η πιο κλιμακώσιμη επιλογή για επιγραφή και επίσημα σημεία επαφής.");
    return bullets;
  }

  function generateTheme(route, tone) {
    const base = clone(palettes[route]);
    const theme = {
      palette: {
        bg: base.bg,
        surface: base.surface,
        primary: base.primary,
        primary700: base.primary700,
        accent: base.accent,
        accent2: base.accent2,
        text: base.text,
        textMuted: base.textMuted,
        border: base.border,
      },
      typography: typographyByRoute[route],
      ui: {
        radius: 20,
        buttonStyle: "filled-primary, outline-accent",
        iconStyle: route === "B" ? "sticker-bold" : route === "A" ? "wave-soft" : "geo-clean",
        illustrationStyle: route === "B" ? "swirl-dots" : route === "A" ? "smooth-wave-lines" : "clean-geometry",
      },
      meta: {
        family: base.name,
      },
    };

    if (tone.calm > tone.energy) {
      theme.palette.bg = route === "A" ? "#F6E7C8" : "#FFF4E6";
    }

    if (tone.energy >= 3) {
      theme.ui.radius = 24;
      theme.palette.accent = route === "C" ? "#FF7A90" : theme.palette.accent;
      theme.palette.accent2 = route === "A" ? "#FFD24A" : "#FFE14D";
    }

    if (tone.minimal >= 2) {
      theme.ui.radius = 14;
      theme.palette.accent2 = theme.palette.surface;
      theme.palette.border = route === "C" ? "#CAD3E0" : "#D5E4E4";
      theme.ui.buttonStyle = "filled-primary, subtle-ghost";
    }

    if (tone.expressive >= 3) {
      theme.ui.radius = Math.max(theme.ui.radius, 24);
      theme.ui.illustrationStyle = route === "B" ? "swirl-dots-gradients" : "accent-confetti";
    }

    return theme;
  }

  function setAnswer(questionId, value, skipRender) {
    state.quiz.answers[questionId] = value;
    state = recomputeFromAnswers(state);
    saveState();
    if (!skipRender) render();
  }

  function currentLang() {
    return i18n[state.ui.lang] || i18n.el;
  }

  function isGreek() {
    return state.ui.lang === "el";
  }

  function localizedPositioning(list) {
    if (!isGreek()) {
      return list;
    }
    const map = {
      bright: "φωτεινό",
      playful: "παιχνιδιάρικο",
      safe: "ασφαλές",
      modern: "σύγχρονο",
    };
    return list.map((item) => map[item] || item);
  }

  function localizedBrand() {
    const t = currentLang();
    if (isGreek()) {
      return {
        name: "Τιραμόλα",
        type: t.brandTypeLabel,
        location: t.brandLocationLabel,
      };
    }
    return {
      name: "Tiramola",
      type: t.brandTypeLabel,
      location: t.brandLocationLabel,
    };
  }

  function localizedThemeFamilyByRoute(route) {
    const t = currentLang();
    if (route === "A") return t.themeFamilyA;
    if (route === "B") return t.themeFamilyB;
    return t.themeFamilyC;
  }

  function localizedUiStyle(styleToken) {
    if (!isGreek()) {
      return styleToken;
    }
    const map = {
      "swirl-dots": "σπείρα με διακριτικές κουκκίδες",
      "swirl-dots-gradients": "σπείρα με ήπιες διαβαθμίσεις",
      "smooth-wave-lines": "ομαλές κυματιστές γραμμές",
      "clean-geometry": "καθαρή γεωμετρία",
      "accent-confetti": "έμφαση με διάσπαρτες πινελιές",
    };
    return map[styleToken] || styleToken;
  }

  function routeAssetBundle(route) {
    if (route === "A" || route === "B" || route === "C") {
      return designAssets[route];
    }
    return designAssets.A;
  }

  const revealEmojis = ["🎨", "🖼️", "👀", "✨", "🎁", "🪄"];
  let revealEmojiIndex = 0;

  function assetFigure(label, src, extraClass) {
    if (!src) {
      return "";
    }
    const emoji = revealEmojis[revealEmojiIndex % revealEmojis.length];
    revealEmojiIndex++;
    const t = currentLang();
    return `
      <figure class="asset-card asset-placeholder ${extraClass || ""}" data-src="${src}">
        <div class="reveal-tap">
          <span class="reveal-icon">${emoji}</span>
          <span class="reveal-label">${t.tapReveal}</span>
        </div>
        <img alt="${label}" decoding="async" style="display:none" />
        <figcaption>${label}</figcaption>
      </figure>
    `;
  }

  const confettiSets = [
    ["🎉", "🥳", "⭐"], ["🎊", "✨", "💫"], ["🎈", "🪅", "🎀"],
    ["🌟", "💥", "🔥"], ["🦋", "🌸", "🌺"], ["🍭", "🧁", "🎂"],
  ];
  let confettiSetIndex = 0;

  function spawnConfettiBurst(card) {
    const set = confettiSets[confettiSetIndex % confettiSets.length];
    confettiSetIndex++;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const count = 12 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      el.className = "emoji-particle";
      el.textContent = set[Math.floor(Math.random() * set.length)];
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const dist = 60 + Math.random() * 80;
      el.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
      el.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
      el.style.left = `${cx}px`;
      el.style.top = `${cy}px`;
      el.style.animationDelay = `${Math.random() * 80}ms`;
      document.body.appendChild(el);
      el.addEventListener("animationend", () => el.remove());
      setTimeout(() => { if (el.parentNode) el.remove(); }, 1500);
    }
  }

  function routeNarrative(route) {
    const greek = isGreek();
    if (route === "A") {
      return greek
        ? {
            personality: "Ήρεμη, προστατευτική και φωτεινή.",
            promise: "Η Τιραμόλα μοιάζει με ασφαλές λιμάνι που καλλιεργεί αυτοπεποίθηση μέσα από παιχνίδι.",
            signature: [
              "Απαλές καμπύλες με καθαρή αναγνωρισιμότητα σε μικρά μεγέθη.",
              "Λεκτικό σήμα με ήπιο ρυθμό και καθαρότητα για γονείς.",
              "Σταθερή χρωματική βάση με θερμές πινελιές χαράς.",
            ],
            craft: [
              "Καθαρή γεωμετρία χωρίς περιττές λεπτομέρειες.",
              "Συνέπεια σε μονόχρωμες εφαρμογές.",
              "Ισορροπία ζεστασιάς και αξιοπιστίας.",
            ],
            launch: "Μικρή καμπάνια «Κάθε μέρα νιώθω ασφαλής» με επιγραφή, εικονίδιο κοινωνικών δικτύων και αυτοκόλλητα τάξης.",
          }
        : {
            personality: "Calm, protective and bright.",
            promise: "Tiramola feels like a safe harbour that builds confidence through play.",
            signature: [
              "Soft curves with clear recognition at small sizes.",
              "Wordmark rhythm that remains readable for parents.",
              "Stable base colors with warm joyful accents.",
            ],
            craft: [
              "Clean geometry without unnecessary detail.",
              "Strong one-color consistency.",
              "Balanced warmth and trust.",
            ],
            launch: "Launch with a small “Safe every day” campaign across signage, social icon and class stickers.",
          };
    }
    if (route === "B") {
      return greek
        ? {
            personality: "Περίεργη, χαρούμενη και γεμάτη ενέργεια.",
            promise: "Η Τιραμόλα αποπνέει ανακάλυψη και κίνηση που γίνεται μάθηση.",
            signature: [
              "Σήμα με έντονο ρυθμό και άμεση αναγνωσιμότητα.",
              "Παιχνιδιάρικη αντίθεση χρωμάτων χωρίς οπτική κόπωση.",
              "Ισχυρή απόδοση σε κοινωνικά δίκτυα και εικονίδια εφαρμογών.",
            ],
            craft: [
              "Περιορισμένη πολυπλοκότητα για καθαρό περίγραμμα.",
              "Σταθερό αποτέλεσμα σε μικρές ψηφιακές διαστάσεις.",
              "Ελεγχόμενη ένταση με φιλικό χαρακτήρα.",
            ],
            launch: "Εβδομάδα λανσαρίσματος με θεματικά αυτοκόλλητα, κινούμενη κεντρική εικόνα και πρότυπα αναρτήσεων ανακάλυψης.",
          }
        : {
            personality: "Curious, joyful and energetic.",
            promise: "Tiramola communicates discovery and movement that turns into learning.",
            signature: [
              "A bold rhythm mark with immediate recognition.",
              "Playful contrast without visual fatigue.",
              "Strong behavior in social and app icon contexts.",
            ],
            craft: [
              "Limited complexity for a clean silhouette.",
              "Stable behavior at small digital sizes.",
              "Controlled intensity with a friendly feel.",
            ],
            launch: "Launch week with thematic stickers, animated hero visual and discovery-focused social templates.",
          };
    }
    return greek
      ? {
          personality: "Σίγουρη, οργανωμένη και σύγχρονη.",
          promise: "Η Τιραμόλα δείχνει σταθερότητα και ποιοτική φροντίδα με καθαρή ταυτότητα.",
          signature: [
            "Στιβαρό μονογράφημα που ξεχωρίζει άμεσα.",
            "Εξαιρετική καθαρότητα σε επιγραφή και έγγραφα.",
            "Τυπογραφία με φιλικό αλλά ώριμο χαρακτήρα.",
          ],
          craft: [
            "Ισχυρό σχήμα για μακροχρόνια χρήση.",
            "Συνεπής απόδοση σε φυσικά και ψηφιακά μέσα.",
            "Κομψότητα χωρίς ψυχρότητα.",
          ],
          launch: "Πρώτη παρουσίαση με εξωτερική σήμανση, έντυπα υποδοχής και app icon για συνεκτικό premium αποτέλεσμα.",
        }
      : {
          personality: "Confident, structured and modern.",
          promise: "Tiramola shows stability and quality care through a clean identity system.",
          signature: [
            "A strong monogram with instant distinction.",
            "Excellent clarity on signage and documents.",
            "Typography with friendly but mature tone.",
          ],
          craft: [
            "Durable shape language for long-term use.",
            "Consistent behavior across physical and digital media.",
            "Polish without coldness.",
          ],
          launch: "Reveal first on outdoor signage, welcome stationery and app icon for a cohesive premium rollout.",
        };
  }

  function localizedPackLabel(route, fallback) {
    if (!isGreek()) {
      return fallback;
    }
    const labels = {
      A: "Κύμα Ασφαλούς Αγκαλιάς",
      B: "Σπείρα Περιέργειας",
      C: "Έντονο Μονόγραμμα T",
    };
    return labels[route] || fallback;
  }

  function localizedConceptText(text) {
    if (!isGreek()) {
      return text;
    }
    const map = {
      "Smooth line, 1-2 strokes, no clipart.": "Ομαλές γραμμές, 1-2 διαδρομές, χωρίς εικονογράφηση τύπου clip-art.",
      "Rounded sans, low contrast, slightly increased tracking for clarity.": "Στρογγυλεμένη sans serif, χαμηλή τονική αντίθεση, ελαφρώς αυξημένο διάκενο χαρακτήρων για καθαρότητα.",
      "Horizontal: mark left, wordmark right": "Οριζόντιο: σήμα αριστερά, λεκτικό σήμα δεξιά",
      "Stacked: mark top, wordmark under": "Κάθετο: σήμα επάνω, λεκτικό σήμα κάτω",
      "Icon only: mark in circle badge": "Μόνο εικονίδιο: σήμα σε κυκλικό έμβλημα",
      "Works at 24px, no detail thinner than 2px.": "Λειτουργεί στα 24px, χωρίς λεπτομέρειες κάτω από 2px.",
      "School signage on light wall": "Εξωτερική επιγραφή σχολείου σε ανοιχτό τοίχο",
      "Uniform badge embroidery (1 color)": "Κεντημένο έμβλημα στη στολή (1 χρώμα)",
      "Classroom wall decal": "Αυτοκόλλητο τοίχου αίθουσας",
      "Instagram profile circle": "Κυκλικό εικονίδιο Instagram",
      "A4 letterhead header": "Κεφαλίδα επιστολόχαρτου A4",
      "Use wide breathing room around the arc": "Χρησιμοποίησε αρκετό κενό γύρω από το τόξο",
      "Keep line weight consistent": "Κράτησε σταθερό πάχος γραμμής",
      "Support one-color applications": "Υποστήριξε μονόχρωμες εφαρμογές",
      "Do not add illustrative faces or clipart": "Μην προσθέτεις πρόσωπα ή clip-art",
      "Avoid very thin tails": "Απόφυγε πολύ λεπτές απολήξεις",
      "Avoid more than 2 key strokes": "Απόφυγε πάνω από 2 βασικές διαδρομές",
      "Bold shapes, sticker feel, high contrast, playful.": "Έντονα σχήματα, αίσθηση αυτοκόλλητου, υψηλή αντίθεση, παιχνιδιάρικο ύφος.",
      "Friendly display heading with clean supporting body font.": "Φιλική γραμματοσειρά τίτλων με καθαρή συνοδευτική γραμματοσειρά κειμένου.",
      "Horizontal": "Οριζόντιο",
      "Stacked": "Κάθετο",
      "Icon only: swirl in rounded square": "Μόνο εικονίδιο: σπείρα σε στρογγυλεμένο τετράγωνο",
      "Readable motion at small sizes, max 2 internal turns.": "Ευανάγνωστη κίνηση σε μικρά μεγέθη, έως 2 εσωτερικές στροφές.",
      "Sticker sheet for kids badges": "Φύλλο αυτοκόλλητων με παιδικά εμβλήματα",
      "Social post templates with doodles": "Πρότυπα αναρτήσεων κοινωνικών δικτύων με σκίτσα",
      "Website hero with subtle animated rotation": "Κεντρική ενότητα ιστοσελίδας με διακριτική περιστροφή",
      "Tote bag print": "Εκτύπωση σε πάνινη τσάντα",
      "Playground sign": "Σήμανση χώρου παιχνιδιού",
      "Keep swirl center open enough": "Κράτησε ανοιχτό το κέντρο της σπείρας",
      "Limit internal turns to 2": "Περιορισμός εσωτερικών στροφών σε 2",
      "Use high contrast combinations": "Χρησιμοποίησε συνδυασμούς υψηλής αντίθεσης",
      "No tiny decorative fragments": "Απόφυγε μικροσκοπικά διακοσμητικά στοιχεία",
      "Do not over-rotate wordmark": "Μην υπερ-περιστρέφεις το λεκτικό σήμα",
      "Avoid gradients in tiny icon sizes": "Απόφυγε διαβαθμίσεις σε πολύ μικρά εικονίδια",
      "Geometric, scalable, premium but friendly.": "Γεωμετρικό, κλιμακώσιμο, ποιοτικό αλλά φιλικό.",
      "Modern rounded sans with careful kerning.": "Σύγχρονη στρογγυλεμένη sans serif με προσεκτικό κέρνινγκ.",
      "Primary: monogram + Tiramola": "Κύριο: μονογράφημα + Τιραμόλα",
      "Secondary: wordmark only": "Δευτερεύον: μόνο λεκτικό σήμα",
      "Icon: monogram in circle": "Εικονίδιο: μονογράφημα σε κύκλο",
      "No thin lines; clean silhouette only.": "Χωρίς λεπτές γραμμές, μόνο καθαρή σιλουέτα.",
      "Large outdoor sign": "Μεγάλη εξωτερική επιγραφή",
      "Staff t-shirts": "Μπλούζες προσωπικού",
      "Official docs and invoice header": "Επίσημα έγγραφα και κεφαλίδα παραστατικών",
      "App icon": "Εικονίδιο εφαρμογής",
      "Directional signage inside school": "Εσωτερική σήμανση κατεύθυνσης στο σχολείο",
      "Preserve block balance in T arms": "Διατήρησε την ισορροπία blocks στα χέρια του T",
      "Prioritize monochrome legibility": "Δώσε προτεραιότητα στη μονόχρωμη αναγνωσιμότητα",
      "Use wider spacing for formal docs": "Χρησιμοποίησε πιο άνετα διαστήματα σε επίσημα έγγραφα",
      "Do not add handwritten style": "Μην προσθέτεις χειρόγραφο ύφος",
      "Avoid tiny smile cuts": "Απόφυγε πολύ μικρά smile cuts",
      "Do not stretch monogram proportions": "Μην παραμορφώνεις τις αναλογίες του μονογράμματος",
    };
    return map[text] || text;
  }

  function localizedConcept(route) {
    const base = conceptPacks[route];
    return {
      ...base,
      packLabel: localizedPackLabel(route, base.packLabel),
      style: localizedConceptText(base.style),
      wordmarkRules: localizedConceptText(base.wordmarkRules),
      lockups: base.lockups.map(localizedConceptText),
      iconRules: localizedConceptText(base.iconRules),
      mockups: base.mockups.map(localizedConceptText),
      do: base.do.map(localizedConceptText),
      dont: base.dont.map(localizedConceptText),
    };
  }

  function journeyPanel() {
    const t = currentLang();
    const steps = [
      { icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/><line x1="6" y1="7" x2="14" y2="7" stroke="currentColor" stroke-width="1.2"/><line x1="6" y1="10" x2="14" y2="10" stroke="currentColor" stroke-width="1.2"/><line x1="6" y1="13" x2="10" y2="13" stroke="currentColor" stroke-width="1.2"/></svg>', text: "\u270F\uFE0F " + t.journeyStep1 },
      { icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l2.5 5 5.5.8-4 3.9.9 5.3L10 14.5 5.1 17l.9-5.3-4-3.9 5.5-.8L10 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>', text: "\u2B50 " + t.journeyStep2 },
      { icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M6 9h8M6 12h5" stroke="currentColor" stroke-width="1.2"/></svg>', text: "\uD83C\uDF89 " + t.journeyStep3 },
    ];
    return `
      <div class="journey-panel" aria-label="${t.journeyTitle}">
        <h3>${t.journeyTitle}</h3>
        <ol class="journey-timeline">
          ${steps.map((s, i) => `
            <li>
              <span class="journey-icon">${s.icon}</span>
              <span class="journey-text">${s.text}</span>
              ${i < steps.length - 1 ? '<span class="journey-connector-fun" aria-hidden="true"><span></span><span></span><span></span></span>' : ""}
            </li>
          `).join("")}
        </ol>
      </div>
    `;
  }

  function brandMark(route) {
    const r = route && palettes[route] ? route : "B";
    const p = palettes[r];
    const id = `bmGrad${r}`;
    let inner = "";
    if (r === "A") {
      inner = `
        <path d="M10 28 Q20 10 30 28" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none"/>
        <circle cx="20" cy="30" r="3" fill="#fff" opacity="0.85"/>
        <path d="M8 24 Q20 6 32 24" stroke="#fff" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.45"/>`;
    } else if (r === "B") {
      inner = `
        <path d="M20 28 A4 4 0 0 1 20 20 A6 6 0 0 0 20 8" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none"/>
        <circle cx="26" cy="12" r="2.5" fill="#fff" opacity="0.8"/>`;
    } else {
      inner = `
        <rect x="12" y="10" width="16" height="4" rx="1.5" fill="#fff"/>
        <rect x="18" y="10" width="4" height="20" rx="1.5" fill="#fff"/>
        <path d="M14 33 Q20 30 26 33" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.7"/>`;
    }
    return `<span class="brand-mark"><svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${p.primary}"/><stop offset="100%" stop-color="${p.accent}"/></linearGradient></defs>
      <rect width="40" height="40" rx="12" fill="url(#${id})"/>${inner}
    </svg></span>`;
  }

  function topBar() {
    return `
      <div class="topbar">
        <div class="lang-switch">
          <button type="button" data-lang-toggle="el" class="${state.ui.lang === "el" ? "active" : ""}" aria-pressed="${state.ui.lang === "el"}">EL</button>
          <button type="button" data-lang-toggle="en" class="${state.ui.lang === "en" ? "active" : ""}" aria-pressed="${state.ui.lang === "en"}">EN</button>
        </div>
      </div>
    `;
  }

  function stageForPath(path) {
    const clean = path.split("?")[0];
    if (clean.startsWith("/quiz")) return "quiz";
    if (clean.startsWith("/result")) return "result";
    if (clean.startsWith("/concepts")) return "concepts";
    if (clean.startsWith("/pitch-deck") || clean.startsWith("/pitch")) return "pitch";
    if (clean.startsWith("/experience")) return "experience";
    return "intro";
  }

  function stageRail(path, routeContext) {
    const t = currentLang();
    const steps = [
      { id: "intro", label: t.stageIntro, nav: "/" },
      { id: "quiz", label: t.navQuiz, nav: "/quiz?q=1" },
      { id: "result", label: t.navResult, nav: "/result" },
      { id: "concepts", label: t.navConcepts, nav: "/concepts" },
      { id: "pitch", label: t.navDeck, nav: `/pitch-deck?route=${routeContext || state.result.recommendedRoute}` },
    ];
    const current = stageForPath(path);
    const currentIndex = steps.findIndex((s) => s.id === current);
    return `
      <nav class="stage-rail" aria-label="${t.stageFlow}">
        <span class="stage-rail-label">${t.stageFlow}</span>
        <div class="stage-rail-track">
          ${steps
            .map((step, idx) => {
              const stateClass = idx < currentIndex ? "done" : idx === currentIndex ? "current" : "upcoming";
              return `
                <button class="stage-step ${stateClass}" data-nav="${step.nav}" aria-current="${idx === currentIndex ? "step" : "false"}">
                  <i>${idx + 1}</i>
                  <b>${step.label}</b>
                </button>
              `;
            })
            .join("")}
        </div>
      </nav>
    `;
  }

  function ambientLayer() {
    const route = state.result.recommendedRoute;
    const shapeClass = route === "A" ? "arc" : route === "C" ? "" : "circle";
    return `
      <div class="ambient-layer" aria-hidden="true">
        <span class="ambient-dot d1"></span>
        <span class="ambient-dot d2"></span>
        <span class="ambient-dot d3"></span>
        <span class="ambient-dot d4"></span>
        <span class="ambient-dot d5"></span>
        <span class="ambient-dot d6"></span>
        <span class="ambient-dot d7"></span>
        <span class="ambient-dot d8"></span>
        <span class="ambient-dot d9"></span>
        <span class="ambient-dot d10"></span>
        <span class="ambient-star s1">\u2726</span>
        <span class="ambient-star s2">\u2605</span>
        <span class="ambient-star s3">\u2726</span>
        <span class="ambient-star s4">\u2764</span>
        <span class="ambient-star s5">\u2726</span>
        <span class="ambient-star s6">\u2605</span>
        <span class="ambient-shape sh1 ${shapeClass}"></span>
        <span class="ambient-shape sh2 ${shapeClass}"></span>
        <span class="ambient-shape sh3 ${shapeClass}"></span>
        <span class="ambient-shape sh4 ${shapeClass}"></span>
      </div>
    `;
  }

  function landingDecorations() {
    const route = state.result.recommendedRoute;
    const p = palettes[route];
    const cloud = (x, y, s, o) => `<svg class="nursery-deco nursery-cloud" style="left:${x}%;top:${y}%;opacity:${o}" width="${s}" height="${s * 0.6}" viewBox="0 0 50 30" fill="none"><ellipse cx="25" cy="20" rx="20" ry="10" fill="${p.primary}" opacity="0.5"/><circle cx="15" cy="14" r="9" fill="${p.primary}" opacity="0.45"/><circle cx="30" cy="11" r="11" fill="${p.primary}" opacity="0.4"/><circle cx="22" cy="8" r="8" fill="${p.accent2}" opacity="0.3"/></svg>`;
    const flower = (x, y, s, o, c) => `<svg class="nursery-deco nursery-flower" style="left:${x}%;top:${y}%;opacity:${o}" width="${s}" height="${s}" viewBox="0 0 30 30" fill="none"><circle cx="15" cy="15" r="5" fill="${c}"/><circle cx="15" cy="6" r="4.5" fill="${c}" opacity="0.6"/><circle cx="15" cy="24" r="4.5" fill="${c}" opacity="0.6"/><circle cx="6" cy="15" r="4.5" fill="${c}" opacity="0.6"/><circle cx="24" cy="15" r="4.5" fill="${c}" opacity="0.6"/><circle cx="15" cy="15" r="3" fill="${p.accent2}"/></svg>`;
    const block = (x, y, s, o, letter, c) => `<span class="nursery-deco nursery-block" style="left:${x}%;top:${y}%;width:${s}px;height:${s}px;border-color:${c};opacity:${o}">${letter}</span>`;
    return `
      <div class="nursery-deco-layer" aria-hidden="true">
        ${cloud(3, 12, 48, 0.5)}
        ${cloud(82, 8, 40, 0.4)}
        ${flower(92, 55, 28, 0.5, p.accent)}
        ${flower(6, 72, 24, 0.45, p.primary)}
        ${block(88, 78, 26, 0.4, "T", p.accent)}
        ${block(8, 38, 22, 0.35, "\u2605", p.accent2)}
        <svg class="nursery-deco nursery-rainbow" style="left:72%;top:25%;opacity:0.4" width="80" height="44" viewBox="0 0 80 44" fill="none">
          <path d="M5 44 Q40 0 75 44" stroke="${p.accent}" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M12 44 Q40 7 68 44" stroke="${p.accent2}" stroke-width="3" stroke-linecap="round"/>
          <path d="M19 44 Q40 14 61 44" stroke="${p.primary}" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <span class="nursery-deco nursery-butterfly" style="left:48%;top:6%;opacity:0.35">
          <svg width="28" height="22" viewBox="0 0 28 22" fill="none"><ellipse cx="9" cy="9" rx="8" ry="9" fill="${p.accent}" opacity="0.6"/><ellipse cx="19" cy="9" rx="8" ry="9" fill="${p.accent2}" opacity="0.55"/><ellipse cx="9" cy="16" rx="5" ry="6" fill="${p.accent}" opacity="0.45"/><ellipse cx="19" cy="16" rx="5" ry="6" fill="${p.accent2}" opacity="0.4"/><line x1="14" y1="3" x2="14" y2="22" stroke="${p.primary}" stroke-width="1.5"/></svg>
        </span>
      </div>
    `;
  }

  function heroIllustration() {
    const route = state.result.recommendedRoute;
    const p = palettes[route];
    let routeShapes = "";
    if (route === "A") {
      routeShapes = `
        <path d="M0 320 Q100 240 200 300 Q300 220 400 280 Q500 200 600 260 Q700 180 800 240" stroke="${p.primary}" stroke-width="4" fill="none" opacity="0.3" class="hero-wave"/>
        <path d="M0 350 Q120 270 240 330 Q360 250 480 310 Q600 230 720 290 Q800 260 800 280" stroke="${p.accent}" stroke-width="3" fill="none" opacity="0.25" class="hero-wave"/>
        <path d="M0 370 Q150 300 300 360 Q450 280 600 340 Q750 260 800 310" stroke="${p.accent2}" stroke-width="2.5" fill="none" opacity="0.2" class="hero-wave"/>
        <circle cx="680" cy="60" r="45" fill="${p.accent}" opacity="0.15" class="hero-shape hero-shape-1"/>
        <path d="M640 60 L680 20 L720 60" stroke="${p.accent2}" stroke-width="2.5" fill="none" opacity="0.35"/>
        <path d="M650 60 L680 30 L710 60" stroke="${p.accent}" stroke-width="2" fill="none" opacity="0.25"/>
        <circle cx="680" cy="60" r="30" stroke="${p.accent2}" stroke-width="2" fill="none" opacity="0.2" class="hero-shape hero-shape-6"/>`;
    } else if (route === "B") {
      routeShapes = `
        <path d="M120 200 A50 50 0 0 1 120 100 A80 80 0 0 0 120 360" stroke="${p.primary}" stroke-width="4" fill="none" opacity="0.25" class="hero-spin"/>
        <path d="M680 180 A35 35 0 0 1 680 110 A55 55 0 0 0 680 250" stroke="${p.accent}" stroke-width="3" fill="none" opacity="0.2" class="hero-spin"/>
        <circle cx="400" cy="60" r="6" fill="${p.accent}" opacity="0.5" class="hero-doodle"/>
        <circle cx="200" cy="50" r="5" fill="${p.accent2}" opacity="0.45" class="hero-doodle"/>
        <circle cx="600" cy="80" r="7" fill="${p.primary}" opacity="0.4" class="hero-doodle"/>
        <rect x="500" y="280" width="40" height="40" rx="6" stroke="${p.accent}" stroke-width="2.5" fill="none" opacity="0.25" transform="rotate(12 520 300)" class="hero-shape hero-shape-7"/>
        <rect x="80" y="300" width="35" height="35" rx="5" stroke="${p.accent2}" stroke-width="2" fill="none" opacity="0.2" transform="rotate(-8 97 317)"/>`;
    } else {
      routeShapes = `
        <line x1="100" y1="0" x2="100" y2="400" stroke="${p.primary}" stroke-width="1" opacity="0.1"/>
        <line x1="260" y1="0" x2="260" y2="400" stroke="${p.primary}" stroke-width="1" opacity="0.08"/>
        <line x1="420" y1="0" x2="420" y2="400" stroke="${p.primary}" stroke-width="1" opacity="0.1"/>
        <line x1="580" y1="0" x2="580" y2="400" stroke="${p.primary}" stroke-width="1" opacity="0.08"/>
        <line x1="0" y1="120" x2="800" y2="120" stroke="${p.border}" stroke-width="1" opacity="0.12"/>
        <line x1="0" y1="280" x2="800" y2="280" stroke="${p.border}" stroke-width="1" opacity="0.1"/>
        <rect x="140" y="60" width="90" height="70" rx="6" stroke="${p.primary}" stroke-width="2" fill="none" opacity="0.15" class="hero-shape hero-shape-1"/>
        <rect x="540" y="180" width="70" height="90" rx="4" stroke="${p.accent}" stroke-width="2" fill="none" opacity="0.12"/>
        <rect x="350" y="140" width="50" height="120" rx="3" stroke="${p.accent2}" stroke-width="1.5" fill="none" opacity="0.1"/>
        <circle cx="700" cy="80" r="25" stroke="${p.primary}" stroke-width="2" fill="none" opacity="0.12" class="hero-shape hero-shape-2"/>`;
    }
    const sharedDoodles = `
      <path d="M60 80 Q70 55 80 65 Q90 55 100 80" stroke="${p.accent}" stroke-width="2" fill="none" opacity="0.35" stroke-linecap="round" class="hero-doodle"/>
      <path d="M710 320 Q720 295 730 305 Q740 295 750 320" stroke="${p.accent2}" stroke-width="2" fill="none" opacity="0.3" stroke-linecap="round" class="hero-doodle"/>
      <path d="M320 30 L325 15 L330 30 L315 22 L335 22 Z" fill="${p.accent2}" opacity="0.4" class="hero-doodle"/>
      <path d="M550 350 L554 338 L558 350 L545 343 L563 343 Z" fill="${p.accent}" opacity="0.35" class="hero-doodle"/>
      <path d="M170 340 L174 328 L178 340 L165 333 L183 333 Z" fill="${p.primary}" opacity="0.3" class="hero-doodle"/>
      <path d="M460 40 Q465 25 470 30 Q475 25 480 40 L470 50 Z" fill="${p.accent}" opacity="0.35" class="hero-doodle"/>
      <path d="M250 360 Q255 345 260 350 Q265 345 270 360 L260 370 Z" fill="${p.accent2}" opacity="0.3" class="hero-doodle"/>
      <path d="M380 80 Q400 60 420 80 Q418 66 416 70 Q400 56 384 70 Q382 66 380 80 Z" fill="${p.accent}" opacity="0.25"/>
      <rect x="620" y="350" width="22" height="22" rx="4" stroke="${p.primary}" stroke-width="2" fill="none" opacity="0.25" transform="rotate(10 631 361)" class="hero-doodle"/>
      <text x="626" y="367" font-size="11" font-weight="700" fill="${p.primary}" opacity="0.25" font-family="sans-serif">A</text>
      <rect x="40" y="220" width="22" height="22" rx="4" stroke="${p.accent2}" stroke-width="2" fill="none" opacity="0.2" transform="rotate(-5 51 231)" class="hero-doodle"/>
      <text x="46" y="237" font-size="11" font-weight="700" fill="${p.accent2}" opacity="0.2" font-family="sans-serif">B</text>
      <circle cx="300" cy="200" r="20" fill="${p.primary}" opacity="0.08"/>
      <circle cx="500" cy="120" r="15" fill="${p.accent}" opacity="0.1"/>
      <circle cx="160" cy="160" r="10" fill="${p.accent2}" opacity="0.15" class="hero-dot"/>
      <circle cx="640" cy="200" r="8" fill="${p.primary}" opacity="0.2" class="hero-dot"/>
      <circle cx="350" cy="280" r="6" fill="${p.accent}" opacity="0.3" class="hero-dot"/>
      <circle cx="480" cy="180" r="4" fill="${p.accent2}" opacity="0.35" class="hero-dot"/>
      <path d="M730 140 Q740 120 750 130 Q755 120 760 140 L770 130 Z" fill="none" stroke="${p.accent2}" stroke-width="1.5" opacity="0.2"/>
    `;
    return `
      <div class="hero-illustration" aria-hidden="true">
        <svg viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          ${routeShapes}
          ${sharedDoodles}
        </svg>
      </div>
    `;
  }

  function landingMascotSvg(route) {
    const p = palettes[route] || palettes.B;
    if (route === "A") {
      return `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="26" r="16" fill="${p.accent2}" opacity="0.85"/>
        <circle cx="24" cy="26" r="12" fill="${p.accent}" opacity="0.3"/>
        <line x1="24" y1="6" x2="24" y2="14" stroke="${p.accent2}" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="10" y1="12" x2="15" y2="18" stroke="${p.accent2}" stroke-width="2" stroke-linecap="round"/>
        <line x1="38" y1="12" x2="33" y2="18" stroke="${p.accent2}" stroke-width="2" stroke-linecap="round"/>
        <line x1="6" y1="24" x2="12" y2="26" stroke="${p.accent2}" stroke-width="2" stroke-linecap="round"/>
        <line x1="42" y1="24" x2="36" y2="26" stroke="${p.accent2}" stroke-width="2" stroke-linecap="round"/>
        <circle cx="20" cy="24" r="2" fill="${p.text}"/>
        <circle cx="28" cy="24" r="2" fill="${p.text}"/>
        <path d="M20 30 Q24 34 28 30" stroke="${p.text}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      </svg>`;
    } else if (route === "B") {
      return `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 38 A8 8 0 0 1 24 22 A12 12 0 0 0 24 46" stroke="${p.accent}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M24 32 A4 4 0 0 1 24 24 A6 6 0 0 0 24 36" stroke="${p.accent2}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <circle cx="24" cy="12" r="8" fill="${p.accent}" opacity="0.2"/>
        <circle cx="24" cy="12" r="5" fill="${p.accent2}" opacity="0.7"/>
        <circle cx="22" cy="11" r="1.5" fill="${p.text}"/>
        <circle cx="26" cy="11" r="1.5" fill="${p.text}"/>
        <path d="M22 14 Q24 17 26 14" stroke="${p.text}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      </svg>`;
    }
    return `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="28" height="28" rx="6" fill="${p.primary}" opacity="0.15"/>
      <path d="M16 18 L24 8 L32 18" stroke="${p.accent2}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16 30 L24 40 L32 30" stroke="${p.accent}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="24" cy="24" r="6" fill="${p.accent2}" opacity="0.6"/>
      <circle cx="22" cy="23" r="1.5" fill="${p.text}"/>
      <circle cx="26" cy="23" r="1.5" fill="${p.text}"/>
      <path d="M22 26 Q24 28.5 26 26" stroke="${p.text}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    </svg>`;
  }

  function landingConfetti(route) {
    const p = palettes[route] || palettes.B;
    const colors = [p.primary, p.accent, p.accent2, p.primary700];
    const pieces = [];
    for (let i = 0; i < 12; i++) {
      const color = colors[i % colors.length];
      const left = Math.round((i / 12) * 100 + Math.sin(i * 2.3) * 8);
      const delay = (i * 0.4).toFixed(2);
      const dur = (4 + (i % 3) * 0.8).toFixed(2);
      const size = 5 + (i % 4) * 2;
      const shape = i % 3 === 0 ? "border-radius:50%;" : i % 3 === 1 ? "border-radius:2px;transform:rotate(" + (i * 30) + "deg);" : "border-radius:2px;width:" + (size + 3) + "px;height:" + Math.max(3, size - 3) + "px;";
      pieces.push(`<span class="confetti-piece landing-confetti-piece" style="left:${left}%;background:${color};width:${size}px;height:${size}px;${shape}animation-delay:${delay}s;animation-duration:${dur}s"></span>`);
    }
    return pieces.join("");
  }

  function emojiRain() {
    const emojis = ["\uD83C\uDF08", "\u2B50", "\uD83C\uDFA8", "\uD83D\uDD8D\uFE0F", "\u270F\uFE0F", "\uD83E\uDD8B", "\uD83C\uDF38", "\uD83C\uDF88", "\uD83C\uDF89", "\uD83C\uDF1F", "\uD83D\uDCAB", "\uD83C\uDFB5", "\u2764\uFE0F", "\uD83E\uDDE9", "\u2601\uFE0F", "\uD83C\uDF3B", "\uD83C\uDF4E"];
    const count = 32;
    const spans = [];
    for (let i = 0; i < count; i++) {
      const emoji = emojis[i % emojis.length];
      const left = ((i * 3.17) % 100).toFixed(1);
      const top = ((i * 7.13 + i * i * 0.37) % 100).toFixed(1);
      const size = 18 + (i % 5) * 4.5;
      const opacity = (0.25 + (i % 7) * 0.045).toFixed(2);
      const delay = (-(i * 0.6)).toFixed(1);
      spans.push(`<span style="left:${left}%;top:${top}%;font-size:${size}px;opacity:${opacity};animation-delay:${delay}s">${emoji}</span>`);
    }
    return `<div class="emoji-rain" aria-hidden="true">${spans.join("")}</div>`;
  }

  function renderLanding() {
    const t = currentLang();
    return `
      <section class="page landing-page">
        ${emojiRain()}
        <div class="landing-hero">
          <h1>${t.brandTitle}</h1>
          <p class="landing-subtitle">${t.landingTagline}</p>
        </div>
        <div class="landing-steps">
          <div class="landing-step">
            <span class="landing-step-emoji">\uD83D\uDCDD</span>
            <h3>${t.landingStep1Title}</h3>
            <p>${t.landingStep1Body}</p>
          </div>
          <div class="landing-step">
            <span class="landing-step-emoji">\u2B50</span>
            <h3>${t.landingStep2Title}</h3>
            <p>${t.landingStep2Body}</p>
          </div>
          <div class="landing-step">
            <span class="landing-step-emoji">\uD83C\uDF81</span>
            <h3>${t.landingStep3Title}</h3>
            <p>${t.landingStep3Body}</p>
          </div>
        </div>
        <div class="cta-row cta-row-hero">
          <button class="primary primary-hero" data-nav="/quiz">${t.start} \u2192</button>
        </div>
      </section>
    `;
  }

  function isAnswered(question, answerValue) {
    if (question.type === "slider") {
      return typeof answerValue === "number";
    }
    return typeof answerValue === "number";
  }

  function answeredCount() {
    return questions.reduce((count, q) => {
      return count + (isAnswered(q, state.quiz.answers[q.id]) ? 1 : 0);
    }, 0);
  }

  function quizCompletion() {
    return answeredCount() / questions.length;
  }

  function isQuizComplete() {
    return answeredCount() >= questions.length;
  }

  function resetQuiz() {
    state.quiz.answers = {};
    state = recomputeFromAnswers(state);
    saveState();
    navigate("/quiz?q=1");
  }

  function recommendationReadiness() {
    if (!isQuizComplete()) {
      return "low";
    }
    const conf = Math.round(state.result.confidence * 100);
    if (conf >= 70) {
      return "high";
    }
    if (conf >= 50) {
      return "medium";
    }
    return "low";
  }

  const optionIcons = {
    q1: [
      '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2C6 2 2 6 2 11s4 9 9 9 9-4 9-9-4-9-9-9z" stroke="currentColor" stroke-width="1.5"/><path d="M7 11l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 4c3 4 7 3 7 8s-3 7-7 7-7-2-7-7 4-4 7-8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
      '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="4" y="4" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="7" x2="11" y2="15" stroke="currentColor" stroke-width="1.5"/><line x1="7" y1="11" x2="15" y2="11" stroke="currentColor" stroke-width="1.5"/></svg>',
    ],
    q4: [
      '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 15 Q11 3 19 15" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
      '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 3a8 8 0 0 1 0 16 6 6 0 0 1 0-12 4 4 0 0 1 0 8" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
      '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M8 4h6v14H8V4zM4 4h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    ],
    q5: [
      '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="6" width="16" height="12" rx="1" stroke="currentColor" stroke-width="1.5"/><path d="M7 6V4h8v2" stroke="currentColor" stroke-width="1.5"/></svg>',
      '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="5" y="3" width="12" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/><circle cx="11" cy="16" r="1.5" fill="currentColor"/></svg>',
      '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5"/><path d="M11 7v4h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    ],
    q6: [
      '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 18 Q6 6 11 6 Q16 6 18 18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
      '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M5 17h12M5 11h12M8 5h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
      '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 4h14M7 4v14h8V4" stroke="currentColor" stroke-width="1.5"/></svg>',
    ],
    q7: [
      '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.5"/></svg>',
      '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="8" cy="11" r="4" stroke="currentColor" stroke-width="1.5"/><circle cx="15" cy="11" r="4" stroke="currentColor" stroke-width="1.5"/></svg>',
      '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="6" cy="11" r="3" stroke="currentColor" stroke-width="1.3"/><circle cx="11" cy="11" r="3" stroke="currentColor" stroke-width="1.3"/><circle cx="16" cy="11" r="3" stroke="currentColor" stroke-width="1.3"/></svg>',
    ],
    q8: [
      '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5"/><path d="M9 9l4 4M13 9l-4 4" stroke="currentColor" stroke-width="1.3" opacity="0.5"/></svg>',
      '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5"/><circle cx="11" cy="11" r="3" fill="currentColor" opacity="0.3"/></svg>',
      '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 11h14M11 4v14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/><circle cx="11" cy="11" r="3" stroke="currentColor" stroke-width="1.5"/></svg>',
    ],
    q9: [
      '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 3C7 3 4 7 4 11s3 8 7 8 7-4 7-8-3-8-7-8z" stroke="currentColor" stroke-width="1.5"/><path d="M8 13a4 4 0 0 0 6 0" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
      '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="9" r="1" fill="currentColor"/><circle cx="14" cy="9" r="1" fill="currentColor"/><path d="M7 13c1 3 7 3 8 0" stroke="currentColor" stroke-width="1.3" fill="none"/></svg>',
      '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="4" y="4" width="14" height="14" rx="3" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="9" r="1" fill="currentColor"/><circle cx="14" cy="9" r="1" fill="currentColor"/><line x1="8" y1="14" x2="14" y2="14" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    ],
  };

  const sliderLabels = {
    q2: { min: "\uD83D\uDE0C", max: "\uD83E\uDD29" },
    q3: { min: "\uD83C\uDF0D", max: "\u2600\uFE0F" },
  };

  let lastQuizIdx = -1;

  function renderQuiz() {
    const t = currentLang();
    const idx = Number(hashQueryParam("q") || 1) - 1;
    const safeIdx = clamp(idx, 0, questions.length - 1);
    const q = questions[safeIdx];
    let answer = state.quiz.answers[q.id];

    const slideDir = lastQuizIdx < 0 ? "" : safeIdx > lastQuizIdx ? "slide-from-right" : safeIdx < lastQuizIdx ? "slide-from-left" : "";
    lastQuizIdx = safeIdx;

    let content = "";
    if (q.type === "single") {
      const icons = optionIcons[q.id] || [];
      content = `
        <fieldset class="options-fieldset">
          <legend class="sr-only">${t[q.textKey]}</legend>
          <div class="options">
          ${q.options
            .map(
              (opt, i) => `
            <button class="option ${answer === i ? "active" : ""}" data-answer="${i}" data-question="${q.id}">
              ${icons[i] ? `<span class="option-icon" aria-hidden="true">${icons[i]}</span>` : ""}
              <span class="option-label">${t[opt.labelKey]}</span>
            </button>
          `
            )
            .join("")}
          </div>
        </fieldset>
      `;
    } else {
      const current = answer !== undefined ? answer : q.default;
      const labels = sliderLabels[q.id] || {};
      content = `
        <div class="slider-wrap">
          <strong data-slider-value="${q.id}">${t.value}: ${current}</strong>
          <div class="slider-container">
            ${labels.min ? `<span class="slider-label-min">${labels.min}</span>` : ""}
            <input type="range" min="${q.min}" max="${q.max}" value="${current}" data-slider="${q.id}" />
            ${labels.max ? `<span class="slider-label-max">${labels.max}</span>` : ""}
          </div>
        </div>
      `;
    }

    const nextPath = safeIdx + 1 >= questions.length ? "/result" : `/quiz?q=${safeIdx + 2}`;
    const prevPath = safeIdx === 0 ? "/" : `/quiz?q=${safeIdx}`;
    const currentAnswered = isAnswered(q, answer);
    const answered = answeredCount();

    return `
      <section class="page">
        <h1>${t.navQuiz}</h1>
        <div class="progress"><div style="width:${Math.round((answered / questions.length) * 100)}%"></div></div>
        <p aria-live="polite">${t.questionShort}${safeIdx + 1}/${questions.length} \u2022 ${t.answerCount}: ${answered}/${questions.length}</p>
        <div class="quiz-stepper" aria-hidden="true">
          ${questions
            .map((_, i) => {
              const status = isAnswered(questions[i], state.quiz.answers[questions[i].id])
                ? (i === safeIdx ? "current done" : "done")
                : (i === safeIdx ? "current" : "upcoming");
              return `<span class="quiz-step-dot ${status}">${i + 1}</span>`;
            })
            .join("")}
        </div>
        <div class="quiz-card ${slideDir}">
          <h3>${t[q.textKey]}</h3>
          ${content}
        </div>

        <div class="cta-row">
          <button class="ghost" data-nav="${prevPath}">${t.prev}</button>
          <button class="primary" data-nav="${nextPath}" ${currentAnswered ? "" : "disabled"}>${safeIdx + 1 === questions.length ? t.finish : t.next}</button>
        </div>
        <p class="notice">${t.completion}: ${Math.round(quizCompletion() * 100)}% <a href="#" class="quiz-reset-link" data-quiz-reset>${t.resetQuiz}</a></p>
      </section>
    `;
  }

  function confettiLayer(route) {
    const p = palettes[route];
    const colors = [p.primary, p.accent, p.accent2, p.primary700];
    const pieces = [];
    for (let i = 0; i < 28; i++) {
      const color = colors[i % colors.length];
      const left = Math.round(Math.random() * 100);
      const delay = (Math.random() * 0.8).toFixed(2);
      const dur = (1.8 + Math.random() * 1.4).toFixed(2);
      const size = 6 + Math.round(Math.random() * 6);
      const shape = i % 3 === 0 ? "border-radius:50%;" : i % 3 === 1 ? "border-radius:2px;transform:rotate(" + Math.round(Math.random() * 360) + "deg);" : "border-radius:2px;width:" + (size + 4) + "px;height:" + Math.max(3, size - 3) + "px;";
      pieces.push(`<span class="confetti-piece" style="left:${left}%;background:${color};width:${size}px;height:${size}px;${shape}animation-delay:${delay}s;animation-duration:${dur}s"></span>`);
    }
    return `<div class="confetti-layer" aria-hidden="true">${pieces.join("")}</div>`;
  }

  function confidenceGauge(conf, route) {
    const p = palettes[route];
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (conf / 100) * circumference;
    return `
      <div class="confidence-gauge">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="${radius}" stroke="${p.border}" stroke-width="8" fill="none" opacity="0.5"/>
          <circle cx="50" cy="50" r="${radius}" stroke="url(#gaugeGrad)" stroke-width="8" fill="none"
            stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
            stroke-linecap="round" transform="rotate(-90 50 50)"
            class="gauge-ring"/>
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="${p.accent}"/>
              <stop offset="50%" stop-color="${p.accent2}"/>
              <stop offset="100%" stop-color="${p.primary}"/>
            </linearGradient>
          </defs>
        </svg>
        <span class="gauge-value" data-gauge-target="${conf}">0%</span>
      </div>
    `;
  }

  function routeRevealBadge(route) {
    const p = palettes[route];
    return `
      <div class="route-badge-wrap">
        <div class="route-badge" style="background:linear-gradient(135deg, ${p.primary}, ${p.primary700})">
          <span class="route-badge-letter">${route}</span>
        </div>
        <span class="route-badge-label">${localizedPackLabel(route, conceptPacks[route].packLabel)}</span>
      </div>
    `;
  }

  function renderResult() {
    const t = currentLang();
    const route = state.result.recommendedRoute;
    const tie = state.result.topMatches.length > 1;
    const conf = Math.round(state.result.confidence * 100);
    const readiness = recommendationReadiness();
    const readinessLabel = readiness === "high" ? t.readinessHigh : readiness === "medium" ? t.readinessMedium : t.readinessLow;

    return `
      <section class="page confetti">
        ${confettiLayer(route)}
        <h1>${t.briefTitle}</h1>
        <p>${t.briefIntro}</p>

        <div class="result-reveal">
          ${routeRevealBadge(route)}
          ${confidenceGauge(conf, route)}
        </div>

        <div class="grid-2">
          <div class="card">
            <h3>${t.whyRoute}</h3>
            <ul class="stagger-list">
              ${state.result.explanationBullets.map((b) => `<li>${b}</li>`).join("")}
            </ul>
            <p class="notice"><strong>${t.pitchReadiness}:</strong> ${readinessLabel}</p>
            ${tie ? `<p><strong>${t.topMatches}:</strong> ${state.result.topMatches.join(" / ")}</p>` : ""}
          </div>
          <div class="theme-preview">
            <h3>${t.themePreview}</h3>
            <p>${t.family}: ${localizedThemeFamilyByRoute(route)}</p>
            <p>${t.typography}: ${state.theme.typography.heading} + ${state.theme.typography.body}</p>
            <div class="palette-row">
              ${Object.values(state.theme.palette)
                .map((c) => `<span class="swatch" style="background:${c}" title="${c}"></span>`)
                .join("")}
            </div>
            <div class="result-scores">
              <p class="notice" style="margin-bottom:8px"><strong>${t.routeLabel}</strong></p>
              ${["A", "B", "C"].map((r) => {
                const val = state.quiz.scores[r];
                const max = Math.max(1, ...Object.values(state.quiz.scores));
                const width = Math.round((val / max) * 100);
                const isWinner = r === route;
                return `<div class="mini-meter${isWinner ? " winner" : ""}"><strong>${r}</strong><div class="mini-meter-track"><div class="mini-meter-fill" style="width:${width}%"></div></div><span>${val}</span></div>`;
              }).join("")}
            </div>
          </div>
        </div>

        <div class="cta-row">
          <button class="primary" data-nav="/pitch-deck?route=${route}">${t.viewFullPitch} \u2192</button>
        </div>
      </section>
    `;
  }

  function renderIncompleteGate() {
    const t = currentLang();
    const dynamicBody = isGreek()
      ? `Για αξιόπιστη πρόταση, ολοκλήρωσε και τις ${questions.length} ερωτήσεις πριν δεις αποτέλεσμα ή παρουσίαση.`
      : `For a reliable recommendation, complete all ${questions.length} questions before viewing result or pitch.`;
    return `
      <section class="page">
        <h1>${t.incompleteTitle}</h1>
        <p>${dynamicBody}</p>
        <p class="notice">${t.answerCount}: ${answeredCount()}/${questions.length}</p>
        <div class="cta-row">
          <button class="primary" data-nav="/quiz?q=${Math.min(answeredCount() + 1, questions.length)}">${t.continueQuiz}</button>
          <button class="ghost" data-nav="/">${t.prev}</button>
        </div>
      </section>
    `;
  }

  function conceptCard(route) {
    const t = currentLang();
    const c = localizedConcept(route);
    const narrative = routeNarrative(route);
    const isRecommended = route === state.result.recommendedRoute;
    const p = palettes[route];
    return `
      <article class="card concept-premium scroll-reveal" style="--concept-color:${p.primary}">
        ${isRecommended ? `<span class="concept-badge">${isGreek() ? "\u2605 \u03A0\u03C1\u03CC\u03C4\u03B1\u03C3\u03B7" : "\u2605 Recommended"}</span>` : ""}
        <div class="concept-head">
          <h3>${route} \u2022 ${c.name}</h3>
          <span class="chip">${c.packLabel}</span>
        </div>
        <p>${narrative.personality}</p>
        <p><strong>${t.pitchPromise}:</strong> ${narrative.promise}</p>
        <div class="palette-row">
          ${c.palette.slice(0, 5).map((hex) => `<span class="swatch" style="background:${hex}" title="${hex}"></span>`).join("")}
        </div>
        <details class="concept-details">
          <summary><strong>${t.variantsAndMockups}</strong></summary>
          <p><strong>${t.markConcept}:</strong> ${c.markDescription}</p>
          <p><strong>${t.lockups}:</strong> ${c.lockups.join(" • ")}</p>
          <p><strong>${t.iconRules}:</strong> ${c.iconRules}</p>
          <p><strong>${t.mockupsLabel}:</strong> ${c.mockups.join(" • ")}</p>
          <p><strong>${t.wordmarkRules}:</strong> ${c.wordmarkRules}</p>
          <p><strong>${t.styleDirection}:</strong> ${c.style}</p>
          <p><strong>${t.doLabel}:</strong> ${c.do.join(" • ")}</p>
          <p><strong>${t.dontLabel}:</strong> ${c.dont.join(" • ")}</p>
          <p><strong>${t.suggestedTaglines}:</strong> ${c.taglines.join(" | ")}</p>
        </details>
        <div class="cta-row">
          <button class="primary" data-pick-route="${route}">${t.chooseThis}</button>
        </div>
      </article>
    `;
  }

  function renderConcepts() {
    const t = currentLang();
    return `
      <section class="page">
        <h1>${t.conceptsGallery}</h1>
        <p>${t.conceptsIntro}</p>
        <div class="grid-3">
          ${conceptCard("A")}
          ${conceptCard("B")}
          ${conceptCard("C")}
        </div>
      </section>
    `;
  }

  function renderCompare() {
    const t = currentLang();
    const rec = state.result.recommendedRoute;
    return `
      <section class="page">
        <h1>${t.compareTitle}</h1>
        <div class="compare">
          <table>
            <thead>
              <tr>
                <th>${t.compareKey}</th>
                <th class="compare-col-route${rec === "A" ? " compare-recommended" : ""}" style="border-top:3px solid ${palettes.A.primary}">A</th>
                <th class="compare-col-route${rec === "B" ? " compare-recommended" : ""}" style="border-top:3px solid ${palettes.B.primary}">B</th>
                <th class="compare-col-route${rec === "C" ? " compare-recommended" : ""}" style="border-top:3px solid ${palettes.C.primary}">C</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${t.compareConcept}</td>
                <td>${conceptPacks.A.name}</td>
                <td>${conceptPacks.B.name}</td>
                <td>${conceptPacks.C.name}</td>
              </tr>
              <tr>
                <td>${t.compareMarkFocus}</td>
                <td>${conceptPacks.A.markDescription}</td>
                <td>${conceptPacks.B.markDescription}</td>
                <td>${conceptPacks.C.markDescription}</td>
              </tr>
              <tr>
                <td>${t.typography}</td>
                <td>Nunito + Inter</td>
                <td>Baloo 2 + Inter</td>
                <td>Poppins + Inter</td>
              </tr>
              <tr>
                <td>${t.compareBestFor}</td>
                <td>${t.compareBestForA}</td>
                <td>${t.compareBestForB}</td>
                <td>${t.compareBestForC}</td>
              </tr>
              <tr>
                <td>${t.compareRisk}</td>
                <td>${t.compareRiskA}</td>
                <td>${t.compareRiskB}</td>
                <td>${t.compareRiskC}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  function stateShareLink() {
    const payload = {
      quiz: state.quiz,
      ui: state.ui,
    };
    const packed = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const url = new URL(window.location.href);
    url.searchParams.set("s", packed);
    url.hash = "/result";
    return url.toString();
  }

  function experienceHeroIllustration(route, p) {
    let shapes = "";
    if (route === "A") {
      shapes = `
        <path d="M50 300 Q200 100 400 280 Q550 150 750 300" stroke="${p.primary}" stroke-width="4" fill="none" opacity="0.2"/>
        <path d="M80 320 Q250 130 450 300 Q580 180 720 310" stroke="${p.accent}" stroke-width="2.5" fill="none" opacity="0.15"/>
        <circle cx="200" cy="200" r="80" stroke="${p.primary}" stroke-width="2" fill="none" opacity="0.12"/>
        <circle cx="600" cy="180" r="50" stroke="${p.accent2}" stroke-width="2" fill="none" opacity="0.15"/>
        <circle cx="400" cy="120" r="12" fill="${p.accent2}" opacity="0.25"/>
        <circle cx="150" cy="150" r="8" fill="${p.accent}" opacity="0.2"/>
        <circle cx="650" cy="280" r="6" fill="${p.primary}" opacity="0.2"/>
        <path d="M100 350 Q180 310 260 350" stroke="${p.accent2}" stroke-width="2" fill="none" opacity="0.12"/>`;
    } else if (route === "B") {
      shapes = `
        <path d="M400 200 A60 60 0 0 1 400 80 A100 100 0 0 0 400 380" stroke="${p.primary}" stroke-width="4" fill="none" opacity="0.18"/>
        <path d="M200 200 A30 30 0 0 1 200 140 A50 50 0 0 0 200 260" stroke="${p.accent}" stroke-width="3" fill="none" opacity="0.15"/>
        <circle cx="150" cy="100" r="10" fill="${p.accent}" opacity="0.3"/>
        <circle cx="650" cy="120" r="14" fill="${p.accent2}" opacity="0.25"/>
        <circle cx="500" cy="80" r="7" fill="${p.primary}" opacity="0.2"/>
        <circle cx="300" cy="320" r="9" fill="${p.accent}" opacity="0.2"/>
        <rect x="600" y="200" width="50" height="50" rx="8" stroke="${p.accent2}" stroke-width="2" fill="none" opacity="0.15" transform="rotate(15 625 225)"/>
        <rect x="100" y="250" width="35" height="35" rx="6" stroke="${p.primary}" stroke-width="2" fill="none" opacity="0.12" transform="rotate(-10 117 267)"/>
        <circle cx="700" cy="320" r="5" fill="${p.accent}" opacity="0.35"/>
        <circle cx="250" cy="80" r="4" fill="${p.accent2}" opacity="0.3"/>`;
    } else {
      shapes = `
        <line x1="100" y1="0" x2="100" y2="400" stroke="${p.primary}" stroke-width="1" opacity="0.08"/>
        <line x1="250" y1="0" x2="250" y2="400" stroke="${p.primary}" stroke-width="1" opacity="0.08"/>
        <line x1="400" y1="0" x2="400" y2="400" stroke="${p.primary}" stroke-width="1" opacity="0.08"/>
        <line x1="550" y1="0" x2="550" y2="400" stroke="${p.primary}" stroke-width="1" opacity="0.08"/>
        <line x1="700" y1="0" x2="700" y2="400" stroke="${p.primary}" stroke-width="1" opacity="0.08"/>
        <rect x="150" y="80" width="120" height="80" rx="4" stroke="${p.primary}" stroke-width="2" fill="none" opacity="0.1"/>
        <rect x="500" y="200" width="100" height="100" rx="4" stroke="${p.accent}" stroke-width="2" fill="none" opacity="0.1"/>
        <rect x="350" y="150" width="60" height="140" rx="3" stroke="${p.accent2}" stroke-width="1.5" fill="none" opacity="0.1"/>
        <line x1="0" y1="200" x2="800" y2="200" stroke="${p.border}" stroke-width="1" opacity="0.15"/>
        <line x1="0" y1="300" x2="800" y2="300" stroke="${p.border}" stroke-width="1" opacity="0.1"/>`;
    }
    return `<div class="exp-hero-illustration" aria-hidden="true">
      <svg viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">${shapes}</svg>
    </div>`;
  }

  function nurseryFloatingEmojis(route) {
    const items = nurseryConfig[route].emojis;
    return items.map((it, i) =>
      `<span class="nb-float" style="left:${it.x}%;top:${it.y}%;font-size:${it.s}px;animation-duration:${it.d}s;animation-delay:${(i * 0.3).toFixed(1)}s">${it.e}</span>`
    ).join("");
  }

  /* ---------- Route-specific hero builders ---------- */

  function nurseryHeroA(k, assets) {
    return `
      <div class="nb-hero nb-hero--a">
        <div class="nb-hero-floats" aria-hidden="true">${nurseryFloatingEmojis("A")}</div>
        <div class="nb-hero-content nb-hero--a-layout">
          <div class="nb-hero--a-visual">
            <img src="${assets.logos.primary}" alt="\u03A4\u03B9\u03C1\u03B1\u03BC\u03CC\u03BB\u03B1" class="nb-hero-logo" />
            <svg class="nb-hero--a-horizon" viewBox="0 0 400 120" aria-hidden="true">
              <circle cx="200" cy="120" r="60" fill="var(--n-accent2)" opacity="0.3"/>
              <path d="M0,90 Q100,50 200,70 Q300,90 400,60" stroke="var(--n-primary)" stroke-width="2.5" fill="none" opacity="0.4"/>
              <path d="M0,100 Q100,70 200,85 Q300,100 400,75" stroke="var(--n-accent)" stroke-width="1.5" fill="none" opacity="0.25"/>
            </svg>
          </div>
          <div class="nb-hero--a-text">
            <h1 class="nb-hero-tagline">${k("HeroTagline")}</h1>
            <p class="nb-hero-sub">${k("HeroSub")}</p>
            <div class="nb-hero-actions">
              <a href="tel:+35722436090" class="nb-hero-cta">${k("HeroCta")}</a>
              <span class="nb-hero-badge">${k("HeroBadge")}</span>
            </div>
          </div>
        </div>
        <div class="nb-hero-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 140" preserveAspectRatio="none">
            <path d="M0,100 Q240,60 480,85 Q720,110 960,75 Q1200,40 1440,70 L1440,140 L0,140Z" fill="#fff" opacity="0.5"/>
            <path d="M0,110 Q360,70 720,95 Q1080,120 1440,80 L1440,140 L0,140Z" fill="#fff"/>
          </svg>
        </div>
      </div>`;
  }

  function nurseryHeroB(k, assets) {
    return `
      <div class="nb-hero nb-hero--b">
        <div class="nb-hero-floats" aria-hidden="true">${nurseryFloatingEmojis("B")}</div>
        ${confettiLayer("B")}
        <div class="nb-hero-content">
          <img src="${assets.logos.primary}" alt="\u03A4\u03B9\u03C1\u03B1\u03BC\u03CC\u03BB\u03B1" class="nb-hero-logo" />
          <h1 class="nb-hero-tagline">${k("HeroTagline")}</h1>
          <p class="nb-hero-sub">${k("HeroSub")}</p>
          <div class="nb-hero-actions">
            <a href="tel:+35722436090" class="nb-hero-cta">${k("HeroCta")}</a>
            <span class="nb-hero-badge">${k("HeroBadge")}</span>
          </div>
        </div>
        <div class="nb-hero-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none"><path d="M0,64 C360,120 720,0 1080,64 C1260,96 1380,80 1440,64 L1440,120 L0,120Z" fill="#fff"/></svg>
        </div>
      </div>`;
  }

  function nurseryHeroC(k, assets) {
    return `
      <div class="nb-hero nb-hero--c">
        <div class="nb-hero--c-grid" aria-hidden="true">
          <svg viewBox="0 0 600 400" fill="none">
            <rect x="40" y="40" width="120" height="120" rx="8" stroke="var(--n-primary)" stroke-width="2" opacity="0.1"/>
            <rect x="200" y="80" width="80" height="80" rx="6" stroke="var(--n-accent)" stroke-width="1.5" opacity="0.08"/>
            <rect x="320" y="30" width="160" height="160" rx="10" stroke="var(--n-primary)" stroke-width="2" opacity="0.06"/>
            <rect x="440" y="220" width="100" height="100" rx="8" stroke="var(--n-accent2)" stroke-width="1.5" opacity="0.1"/>
            <rect x="100" y="240" width="60" height="60" rx="4" stroke="var(--n-border)" stroke-width="1" opacity="0.12"/>
            <line x1="0" y1="200" x2="600" y2="200" stroke="var(--n-border)" stroke-width="1" opacity="0.08"/>
            <line x1="300" y1="0" x2="300" y2="400" stroke="var(--n-border)" stroke-width="1" opacity="0.08"/>
          </svg>
        </div>
        <div class="nb-hero-floats" aria-hidden="true">${nurseryFloatingEmojis("C")}</div>
        <div class="nb-hero-content nb-hero--c-layout">
          <div class="nb-hero--c-main">
            <img src="${assets.logos.primary}" alt="\u03A4\u03B9\u03C1\u03B1\u03BC\u03CC\u03BB\u03B1" class="nb-hero-logo nb-hero--c-logo" />
            <h1 class="nb-hero-tagline">${k("HeroTagline")}</h1>
            <p class="nb-hero-sub">${k("HeroSub")}</p>
            <div class="nb-hero-actions">
              <a href="tel:+35722436090" class="nb-hero-cta">${k("HeroCta")}</a>
              <span class="nb-hero-badge">${k("HeroBadge")}</span>
            </div>
          </div>
          <div class="nb-hero--c-aside" aria-hidden="true">
            <img src="${assets.logos.primary}" alt="" class="nb-hero--c-wordmark" />
          </div>
        </div>
        <div class="nb-hero-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none"><path d="M0,100 L1440,20 L1440,120 L0,120Z" fill="#fff"/></svg>
        </div>
      </div>`;
  }

  function nurseryHero(route, k, assets) {
    if (route === "A") return nurseryHeroA(k, assets);
    if (route === "C") return nurseryHeroC(k, assets);
    return nurseryHeroB(k, assets);
  }

  function renderNurseryPage(route) {
    const t = currentLang();
    const cfg = nurseryConfig[route];
    const k = (suffix) => t[cfg.keyPrefix + suffix];
    const assets = routeAssetBundle(route);
    const icons = cfg.programIcons;
    const phil = cfg.philIcons;
    return `
      <section class="page nb-page" data-nursery-route="${route}">
        ${nurseryHero(route, k, assets)}

        <div class="nb-section nb-about scroll-reveal">
          <h2>${k("AboutTitle")}</h2>
          <p>${k("AboutText")}</p>
        </div>

        <div class="nb-section scroll-reveal">
          <h2>${k("ProgramsTitle")}</h2>
          <div class="nb-programs">
            <div class="nb-program-card">
              <span class="nb-program-icon">${icons[0]}</span>
              <h3>${k("Prog1Title")}</h3>
              <p>${k("Prog1Text")}</p>
            </div>
            <div class="nb-program-card">
              <span class="nb-program-icon">${icons[1]}</span>
              <h3>${k("Prog2Title")}</h3>
              <p>${k("Prog2Text")}</p>
            </div>
            <div class="nb-program-card">
              <span class="nb-program-icon">${icons[2]}</span>
              <h3>${k("Prog3Title")}</h3>
              <p>${k("Prog3Text")}</p>
            </div>
          </div>
        </div>

        <div class="nb-philosophy scroll-reveal">
          <h2>${k("PhilosophyTitle")}</h2>
          <p class="nb-philosophy-intro">${k("PhilosophyIntro")}</p>
          <div class="nb-philosophy-grid">
            <div class="nb-phil-card">
              <span class="nb-phil-icon">${phil[0]}</span>
              <h3>${k("Phil1Title")}</h3>
              <p>${k("Phil1Text")}</p>
            </div>
            <div class="nb-phil-card">
              <span class="nb-phil-icon">${phil[1]}</span>
              <h3>${k("Phil2Title")}</h3>
              <p>${k("Phil2Text")}</p>
            </div>
            <div class="nb-phil-card">
              <span class="nb-phil-icon">${phil[2]}</span>
              <h3>${k("Phil3Title")}</h3>
              <p>${k("Phil3Text")}</p>
            </div>
            <div class="nb-phil-card">
              <span class="nb-phil-icon">${phil[3]}</span>
              <h3>${k("Phil4Title")}</h3>
              <p>${k("Phil4Text")}</p>
            </div>
          </div>
        </div>

        <div class="nb-section scroll-reveal">
          <h2>${k("WhyTitle")}</h2>
          <div class="nb-why-grid">
            ${[1,2,3,4].map(i => {
              const badge = route === "C" ? i : "\u2713";
              return `<div class="nb-why-item"><span class="nb-why-check">${badge}</span> ${k("Why" + i)}</div>`;
            }).join("\n            ")}
          </div>
        </div>

        <div class="nb-contact scroll-reveal">
          <h2>${k("ContactTitle")}</h2>
          <div class="nb-contact-info">
            <p><span class="nb-contact-icon">\uD83D\uDCCD</span> ${k("Address")}</p>
            <p><span class="nb-contact-icon">\uD83D\uDCDE</span> ${k("Phone")}</p>
            <p><span class="nb-contact-icon">\uD83D\uDD50</span> ${k("Hours")}</p>
          </div>
          <div class="nb-contact-ctas">
            <a href="tel:+35722436090" class="nb-cta-primary">${k("ContactCta")}</a>
            <a href="https://maps.app.goo.gl/5oVZrkgCwvAgorVS9" target="_blank" rel="noopener" class="nb-cta-secondary">${k("MapCta")}</a>
          </div>
        </div>

        <div class="nb-nav-ctas">
          <button class="primary" data-pick-route="${route}">${t.expSelectRoute}</button>
          <button class="secondary" data-nav="/pitch-deck?route=${route}">${t.expViewPitch}</button>
          <button class="ghost" data-nav="/concepts">${t.seeVariants}</button>
        </div>
      </section>
    `;
  }

  function renderExperience() {
    const route = hashQueryParam("route") || state.result.recommendedRoute || "B";
    return renderNurseryPage(route);
  }

  function renderPitchDeck() {
    const t = currentLang();
    const pickedRoute = hashQueryParam("route") || state.result.recommendedRoute;
    const pickedConcept = localizedConcept(pickedRoute) || localizedConcept(state.result.recommendedRoute);
    const assets = routeAssetBundle(pickedRoute);
    const ranked = Object.entries(state.quiz.scores).sort((a, b) => b[1] - a[1]);
    const runnerUp = ranked.find(([r]) => r !== pickedRoute) || ranked[1] || null;
    const conf = Math.round(state.result.confidence * 100);
    const readiness = recommendationReadiness();
    const readinessLabel = readiness === "high" ? t.readinessHigh : readiness === "medium" ? t.readinessMedium : t.readinessLow;
    const narrative = routeNarrative(pickedRoute);
    const p = palettes[pickedRoute];
    const typo = typographyByRoute[pickedRoute];
    const paletteEntries = [
      { color: p.primary, role: "Primary" },
      { color: p.accent, role: "Accent" },
      { color: p.accent2, role: "Accent 2" },
      { color: p.bg, role: "Background" },
      { color: p.primary700, role: "Primary Dark" },
      { color: p.border, role: "Border" },
    ];

    return `
      <section class="page">
        <div class="pitch-hero">
          <h1>${t.deckTitle}</h1>
          <p>${t.deckIntro}</p>
          <div class="pitch-meta">
            <span class="chip">${t.routeLabel} ${pickedRoute}</span>
            <span class="chip">${pickedConcept.name}</span>
            <span class="chip">${localizedThemeFamilyByRoute(pickedRoute)}</span>
          </div>
          <div class="confidence-wrap" aria-label="${t.confidence}">
            <div class="confidence-bar"><span style="width:${conf}%"></span></div>
            <p class="notice">${t.confidence}: <strong>${conf}%</strong> • ${t.pitchReadiness}: <strong>${readinessLabel}</strong></p>
          </div>
        </div>

        <div class="grid-2">
          <div class="card concept-premium scroll-reveal">
            <p class="section-eyebrow">01</p>
            <h3>${t.pitchPersonality}</h3>
            <p class="pitch-quote">${narrative.personality}</p>
            <p><strong>${t.pitchPromise}:</strong> ${narrative.promise}</p>
            <p><strong>${t.pitchLaunch}:</strong> ${narrative.launch}</p>
            <ul>
              ${state.result.explanationBullets.map((b) => `<li>${b}</li>`).join("")}
            </ul>
            ${runnerUp ? `<p class="notice"><strong>${t.runnerUp}:</strong> ${t.routeLabel} ${runnerUp[0]} (${runnerUp[1]} ${t.points})</p>` : ""}
          </div>
          <div class="card concept-premium scroll-reveal">
            <p class="section-eyebrow">02</p>
            <h3>${t.pitchSection2}</h3>
            <p>${t.paletteFamily}: ${localizedThemeFamilyByRoute(pickedRoute)}</p>
            <p>${t.typography}: ${state.theme.typography.heading} + ${state.theme.typography.body}</p>
            <p>${t.uiStyle}: ${localizedUiStyle(state.theme.ui.illustrationStyle)}, ${t.radius} ${state.theme.ui.radius}px</p>
            <div class="palette-row">
              ${Object.values(state.theme.palette)
                .map((c) => `<span class="swatch" style="background:${c}" title="${c}"></span>`)
                .join("")}
            </div>
          </div>
        </div>

        <div class="card concept-premium card-dark scroll-reveal">
          <p class="section-eyebrow">03</p>
          <h3>${t.logoSystem}</h3>
          <div class="assets-grid assets-grid-logos">
            ${assetFigure(t.logoPrimaryPh, assets.logos.primary, "asset-wide")}
            ${assetFigure(t.logoSecondaryPh, assets.logos.secondary)}
            ${assetFigure(t.logoIconPh, assets.logos.icon)}
            ${assetFigure(t.logoHorizontalPh, assets.logos.horizontal)}
            ${assetFigure(t.logoStackedPh, assets.logos.stacked)}
            ${assetFigure(t.logoMonoPh, assets.logos.mono)}
          </div>
        </div>

        <div class="grid-2">
          <div class="card concept-premium scroll-reveal">
            <h3>${t.pitchSignature}</h3>
            <ul>
              ${narrative.signature.map((line) => `<li>${line}</li>`).join("")}
            </ul>
          </div>
          <div class="card concept-premium scroll-reveal">
            <h3>${t.pitchCraft}</h3>
            <ul>
              ${narrative.craft.map((line) => `<li>${line}</li>`).join("")}
            </ul>
          </div>
        </div>

        <div class="card concept-premium scroll-reveal">
          <p class="section-eyebrow">04</p>
          <h3>${t.pitchBrief}</h3>
          <p><strong>${t.markConcept}:</strong> ${pickedConcept.markDescription}</p>
          <p><strong>${t.wordmarkRules}:</strong> ${pickedConcept.wordmarkRules}</p>
          <p><strong>${t.styleDirection}:</strong> ${pickedConcept.style}</p>
          <p><strong>${t.lockups}:</strong> ${pickedConcept.lockups.join(" • ")}</p>
          <p><strong>${t.iconRules}:</strong> ${pickedConcept.iconRules}</p>
          <p><strong>${t.suggestedTaglines}:</strong> ${pickedConcept.taglines.join(" | ")}</p>
        </div>

        <div class="card concept-premium scroll-reveal">
          <p class="section-eyebrow">05</p>
          <h3>${t.mockupGallery}</h3>
          <div class="assets-grid">
            ${assetFigure(t.phSignage, assets.mockups.signage)}
            ${assetFigure(t.phSocial, assets.mockups.social)}
            ${assetFigure(t.phWebHero, assets.mockups.webhero)}
            ${assetFigure(t.phUniform, assets.mockups.uniform)}
            ${assetFigure(t.phStationery, assets.mockups.stationery)}
            ${assetFigure(t.phSticker, assets.mockups.sticker)}
          </div>
        </div>

        <div class="card concept-premium scroll-reveal">
          <h3>${t.appsShowcase}</h3>
          <div class="assets-grid">
            ${assetFigure(t.phPlayground, assets.mockups.playground)}
            ${assetFigure(t.phBag, assets.mockups.tote)}
            ${assetFigure(t.logoIconPh, assets.logos.icon)}
          </div>
        </div>

        <div class="scroll-reveal">
          <p class="section-eyebrow">06</p>
          <h3>${t.expPaletteTitle}</h3>
          <div class="exp-color-grid">
            ${paletteEntries.map((e) => `
              <div class="exp-color-card" style="background:${e.color};color:${isLightColor(e.color) ? "#1a1a1a" : "#ffffff"};border-radius:${pickedRoute === "A" ? "16px" : pickedRoute === "B" ? "20px" : "8px"}">
                <span class="exp-color-hex">${e.color}</span>
                <span class="exp-color-role">${e.role}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="grid-2 scroll-reveal">
          <div class="card concept-premium">
            <h3>${t.expHeadingFont}</h3>
            <p class="exp-type-name">${typo.heading}</p>
            <p class="exp-type-sample-heading" style="font-family:'${typo.heading}',sans-serif">${isGreek() ? "Τιραμόλα" : "Tiramola"}</p>
            <p style="font-family:'${typo.heading}',sans-serif">${isGreek() ? "Παίζουμε, μεγαλώνουμε, νιώθουμε ασφαλείς" : "We play, we grow, we feel safe"}</p>
          </div>
          <div class="card concept-premium">
            <h3>${t.expBodyFont}</h3>
            <p class="exp-type-name">${typo.body}</p>
            <p class="exp-type-sample-body" style="font-family:'${typo.body}',sans-serif">${isGreek() ? "Τιραμόλα" : "Tiramola"}</p>
            <p style="font-family:'${typo.body}',sans-serif">${isGreek() ? "Η εκπαίδευση και η φροντίδα πάνε μαζί σε κάθε βήμα." : "Education and care go hand in hand at every step."}</p>
          </div>
        </div>

        <div class="cta-row">
          <button class="primary" data-nav="/concepts">${t.seeVariants}</button>
          <button class="secondary" data-nav="/experience?route=${pickedRoute}">${t.expViewExperience}</button>
        </div>

        <div class="card concept-premium">
          <h3>${t.nextStepsTitle}</h3>
          <ol>
            <li>${t.nextStep1}</li>
            <li>${t.nextStep2}</li>
            <li>${t.nextStep3}</li>
          </ol>
        </div>
      </section>
    `;
  }

  function render() {
    revealEmojiIndex = 0;
    const app = document.getElementById("app");
    const path = routeFromHash();
    const t = currentLang();
    const routeContext = hashQueryParam("route") || state.result.recommendedRoute;
    document.title = isGreek() ? "Εργαστήριο Ταυτότητας Τιραμόλα" : "Tiramola Identity Lab";
    document.documentElement.lang = isGreek() ? "el" : "en";
    document.body.setAttribute("data-page", path.split("?")[0].replace("/", "") || "landing");
    document.body.setAttribute("data-ui-lang", state.ui.lang);
    document.body.setAttribute("data-route", routeContext);

    let body = "";
    if (path.startsWith("/quiz")) {
      body = renderQuiz();
    } else if (path.startsWith("/result")) {
      body = isQuizComplete() ? renderResult() : renderIncompleteGate();
    } else if (path.startsWith("/concepts")) {
      body = renderConcepts();
    } else if (path.startsWith("/pitch-deck")) {
      body = isQuizComplete() ? renderPitchDeck() : renderIncompleteGate();
    } else if (path.startsWith("/pitch")) {
      body = isQuizComplete() ? renderPitchDeck() : renderIncompleteGate();
    } else if (path.startsWith("/experience")) {
      body = renderExperience();
    } else {
      body = renderLanding();
    }

    setThemeVars(state.theme);

    app.innerHTML = `
      <div class="scroll-progress" aria-hidden="true"><span></span></div>
      ${ambientLayer()}
      ${body}
      <footer>
        ${stageRail(path, routeContext)}
        ${topBar()}
        <p class="footer-note">${t.footer}</p>
      </footer>
    `;

    bindEvents();
    updateScrollProgress();
  }

  function updateScrollProgress() {
    const bar = document.querySelector(".scroll-progress span");
    if (!bar) {
      return;
    }
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight <= 0 ? 0 : Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
    bar.style.width = `${pct}%`;
  }

  let delegatedListenerBound = false;

  function bindEvents() {
    if (!delegatedListenerBound) {
      const app = document.getElementById("app");
      app.addEventListener("click", (e) => {
        const nav = e.target.closest("[data-nav]");
        if (nav) {
          navigate(nav.getAttribute("data-nav"));
          return;
        }

        const reveal = e.target.closest(".asset-placeholder");
        if (reveal) {
          const img = reveal.querySelector("img");
          const src = reveal.getAttribute("data-src");
          if (img && src) {
            spawnConfettiBurst(reveal);
            reveal.classList.remove("asset-placeholder");
            reveal.classList.add("asset-loading");
            reveal.querySelector(".reveal-tap").remove();
            img.addEventListener("load", function () {
              this.closest(".asset-card").classList.remove("asset-loading");
              this.classList.add("asset-loaded");
              this.style.display = "";
            });
            img.addEventListener("error", function () {
              const fig = this.closest("figure");
              if (fig) fig.remove();
            });
            img.src = src;
          }
          return;
        }

        const answer = e.target.closest("[data-answer]");
        if (answer) {
          const qid = answer.getAttribute("data-question");
          const value = Number(answer.getAttribute("data-answer"));
          setAnswer(qid, value);
          return;
        }

        const langToggle = e.target.closest("[data-lang-toggle]");
        if (langToggle) {
          const nextLang = langToggle.getAttribute("data-lang-toggle");
          if (nextLang !== state.ui.lang) {
            state.ui.lang = nextLang;
            saveState();
            render();
          }
          return;
        }

        const pickRoute = e.target.closest("[data-pick-route]");
        if (pickRoute) {
          navigate(`/pitch-deck?route=${pickRoute.getAttribute("data-pick-route")}`);
          return;
        }

        const toggleMeter = e.target.closest("[data-toggle-meter]");
        if (toggleMeter) {
          state.ui.showMeter = !state.ui.showMeter;
          saveState();
          render();
          return;
        }

        const copySummary = e.target.closest("[data-copy-summary]");
        if (copySummary) {
          const t = currentLang();
          const pickedRoute = hashQueryParam("route") || state.result.recommendedRoute;
          const pickedConcept = conceptPacks[pickedRoute] || conceptPacks[state.result.recommendedRoute];
          const summaryText = [
            `${t.pitchSummaryTitle}`,
            `${t.pitchSummaryRoute}: ${pickedRoute} (${localizedPackLabel(pickedRoute, pickedConcept.packLabel)})`,
            `${t.confidence}: ${Math.round(state.result.confidence * 100)}%`,
            ...state.result.explanationBullets,
            `${t.pitchSummaryFamily}: ${localizedThemeFamilyByRoute(pickedRoute)}`,
            `${t.typography}: ${state.theme.typography.heading} + ${state.theme.typography.body}`,
          ].join("\\n");
          copyText(summaryText).then((copied) => {
            copySummary.textContent = copied ? t.copied : t.share;
          });
          return;
        }

        const shareBtn = e.target.closest("[data-copy-share]");
        if (shareBtn) {
          const t = currentLang();
          const pickedRoute = hashQueryParam("route") || state.result.recommendedRoute;
          copyText(stateShareLink().replace("#/result", `#/pitch-deck?route=${pickedRoute}`)).then((copied) => {
            shareBtn.textContent = copied ? t.linkCopied : t.share;
          });
          return;
        }

        const quizReset = e.target.closest("[data-quiz-reset]");
        if (quizReset) {
          e.preventDefault();
          resetQuiz();
          return;
        }
      });

      app.addEventListener("input", (e) => {
        const slider = e.target.closest("[data-slider]");
        if (slider) {
          const qid = slider.getAttribute("data-slider");
          const value = Number(slider.value);
          const label = document.querySelector(`[data-slider-value="${qid}"]`);
          if (label) {
            label.textContent = `${currentLang().value}: ${value}`;
          }
        }
      });

      app.addEventListener("change", (e) => {
        const slider = e.target.closest("[data-slider]");
        if (slider) {
          setAnswer(slider.getAttribute("data-slider"), Number(slider.value), true);
          const nextBtn = document.querySelector(".cta-row .primary[data-nav]");
          if (nextBtn) nextBtn.removeAttribute("disabled");
          const notice = document.querySelector(".page > .notice");
          if (notice) {
            const t = currentLang();
            notice.innerHTML = `${t.completion}: ${Math.round(quizCompletion() * 100)}% <a href="#" class="quiz-reset-link" data-quiz-reset>${t.resetQuiz}</a>`;
          }
        }
      });

      delegatedListenerBound = true;
    }

    const gaugeEl = document.querySelector("[data-gauge-target]");
    if (gaugeEl) {
      const target = Number(gaugeEl.getAttribute("data-gauge-target"));
      let current = 0;
      const step = () => {
        current = Math.min(current + 1, target);
        gaugeEl.textContent = current + "%";
        if (current < target) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    if (typeof IntersectionObserver !== "undefined") {
      const revealCards = document.querySelectorAll(".scroll-reveal");
      if (revealCards.length) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.05, rootMargin: "0px 0px 200px 0px" }
        );
        revealCards.forEach((el) => observer.observe(el));
      }
    }
  }

  let scrollRAF = null;
  function throttledScrollProgress() {
    if (scrollRAF) return;
    scrollRAF = requestAnimationFrame(() => {
      updateScrollProgress();
      scrollRAF = null;
    });
  }

  window.addEventListener("hashchange", () => {
    render();
    requestAnimationFrame(() => window.scrollTo(0, 0));
  });
  window.addEventListener("scroll", throttledScrollProgress, { passive: true });
  window.addEventListener("resize", throttledScrollProgress);
  window.addEventListener("load", () => {
    state = recomputeFromAnswers(state);
    saveState();
    render();
  });
})();
