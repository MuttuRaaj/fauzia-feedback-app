export type LangCode = "en" | "hi" | "mr";

export const TRANSLATIONS: Record<
  LangCode,
  {
    langName: string;
    hospitalName: string;
    managedBy: string;
    badgeText: string;
    heroTitle: string;
    heroSubtitle: string;
    wardLabel: string;
    roomLabel: string;
    patientNameLabel: string;
    patientNamePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    overallPrompt: string;
    ratingLabels: Record<number, string>;
    deptHeading: string;
    doctorLabel: string;
    nursingLabel: string;
    hygieneLabel: string;
    foodLabel: string;
    tagsHeading: string;
    tags: string[];
    commentLabel: string;
    commentPlaceholder: string;
    submitBtn: string;
    submittingBtn: string;
    thankYouTitle: string;
    thankYouHighMsg: string;
    googleReviewBtn: string;
    thankYouLowMsg: string;
    submitAnotherBtn: string;
    openDashboardLink: string;
  }
> = {
  en: {
    langName: "English",
    hospitalName: "FAUZIA MATERNITY & NURSING HOME",
    managedBy: "Managed by Elite4Ever HealthCare LLP",
    badgeText: "Bedside Patient Care Survey",
    heroTitle: "How was your care & stay with us?",
    heroSubtitle:
      "Your honest feedback helps our doctors, nursing team, and ward staff serve you and your family better.",
    wardLabel: "Ward / Department",
    roomLabel: "Room / Bed No.",
    patientNameLabel: "Patient / Attendant Name (Optional)",
    patientNamePlaceholder: "e.g. Ayesha Shaikh",
    phoneLabel: "Mobile Number (Optional)",
    phonePlaceholder: "10-digit mobile number",
    overallPrompt: "Overall Experience",
    ratingLabels: {
      1: "Very Poor - Needs Immediate Attention",
      2: "Below Expectations",
      3: "Average / Satisfactory",
      4: "Good Care & Comfort",
      5: "Excellent Care & Warm Hospitality",
    },
    deptHeading: "Rate Specific Care Areas",
    doctorLabel: "Doctors & Consultation",
    nursingLabel: "Nursing & Maternity Care",
    hygieneLabel: "Room Cleanliness & Hygiene",
    foodLabel: "Diet & Canteen Service",
    tagsHeading: "What stood out during your stay?",
    tags: [
      "Caring Nurses",
      "Attentive Doctors",
      "Spotless Room",
      "Quick Response",
      "Smooth Admission/Discharge",
      "Polite Support Staff",
    ],
    commentLabel: "Additional Suggestions or Concerns",
    commentPlaceholder: "Share any message for the Medical Director or Nursing Matron...",
    submitBtn: "Submit Feedback",
    submittingBtn: "Submitting...",
    thankYouTitle: "Thank You for Your Feedback!",
    thankYouHighMsg:
      "We are delighted that your care at Fauzia Maternity & Nursing Home was positive. If you have 30 seconds, please share your experience on Google.",
    googleReviewBtn: "Rate Us on Google",
    thankYouLowMsg:
      "We sincerely apologize for falling short. A priority alert has been sent directly to our Hospital Management & Nursing Matron for immediate follow-up.",
    submitAnotherBtn: "Submit Another Response",
    openDashboardLink: "Open Hospital Admin Dashboard",
  },
  hi: {
    langName: "हिंदी",
    hospitalName: "फ़ौज़िया मैटरनिटी एंड नर्सिंग होम",
    managedBy: "Managed by Elite4Ever HealthCare LLP",
    badgeText: "मरीज़ देखभाल फ़ीडबैक",
    heroTitle: "हमारे यहाँ आपकी देखभाल और अनुभव कैसा रहा?",
    heroSubtitle:
      "आपकी ईमानदार राय हमारे डॉक्टरों, नर्सिंग टीम और स्टाफ को आपकी और आपके परिवार की बेहतर सेवा करने में मदद करती है।",
    wardLabel: "वार्ड / विभाग",
    roomLabel: "रूम / बेड नंबर",
    patientNameLabel: "मरीज़ या परिजन का नाम (वैकल्पिक)",
    patientNamePlaceholder: "जैसे: आयशा शेख",
    phoneLabel: "मोबाइल नंबर (वैकल्पिक)",
    phonePlaceholder: "10 अंकों का मोबाइल नंबर",
    overallPrompt: "समग्र अनुभव",
    ratingLabels: {
      1: "बहुत ख़राब - तुरंत ध्यान देने की आवश्यकता",
      2: "उम्मीद से कम",
      3: "सामान्य / संतोषजनक",
      4: "अच्छी देखभाल और सुविधा",
      5: "उत्कृष्ट देखभाल और आत्मीय व्यवहार",
    },
    deptHeading: "विशिष्ट सेवाओं को रेटिंग दें",
    doctorLabel: "डॉक्टर और परामर्श",
    nursingLabel: "नर्सिंग और मैटरनिटी केयर",
    hygieneLabel: "कमरे की सफ़ाई और स्वच्छता",
    foodLabel: "भोजन और कैंटीन सेवा",
    tagsHeading: "आपको क्या सबसे अच्छा लगा?",
    tags: [
      "दयालु नर्सें",
      "ध्यान देने वाले डॉक्टर",
      "साफ़-सुथरा कमरा",
      "तुरंत सहायता",
      "आसान भर्ती/डिस्चार्ज",
      "विनम्र स्टाफ",
    ],
    commentLabel: "अतिरिक्त सुझाव या शिकायत",
    commentPlaceholder: "मेडिकल डायरेक्टर या मैट्रन के लिए अपना संदेश लिखें...",
    submitBtn: "फ़ीडबैक भेजें",
    submittingBtn: "भेजा जा रहा है...",
    thankYouTitle: "आपके फ़ीडबैक के लिए धन्यवाद!",
    thankYouHighMsg:
      "हमें खुशी है कि फ़ौज़िया मैटरनिटी एंड नर्सिंग होम में आपका अनुभव अच्छा रहा। कृपया Google पर भी अपनी राय साझा करें।",
    googleReviewBtn: "Google पर रेटिंग दें",
    thankYouLowMsg:
      "असुविधा के लिए हम क्षमा चाहते हैं। तुरंत कार्रवाई के लिए हमारी अस्पताल प्रबंधन टीम और मैट्रन को अलर्ट भेज दिया गया है।",
    submitAnotherBtn: "एक और फ़ीडबैक भरें",
    openDashboardLink: "हॉस्पिटल एडमिन डैशबोर्ड खोलें",
  },
  mr: {
    langName: "मराठी",
    hospitalName: "फौझिया मॅटर्निटी अँड नर्सिंग होम",
    managedBy: "Managed by Elite4Ever HealthCare LLP",
    badgeText: "रुग्ण सेवा अभिप्राय",
    heroTitle: "आमच्या येथील उपचार आणि अनुभव कसा वाटला?",
    heroSubtitle:
      "तुमचा प्रामाणिक अभिप्राय आमच्या डॉक्टरांना, नर्सिंग टीमला आणि कर्मचाऱ्यांना अधिक चांगली सेवा देण्यास मदत करतो.",
    wardLabel: "वॉर्ड / विभाग",
    roomLabel: "रूम / बेड क्रमांक",
    patientNameLabel: "रुग्ण किंवा नातेवाईकाचे नाव (ऐच्छिक)",
    patientNamePlaceholder: "उदा. आयेशा शेख",
    phoneLabel: "मोबाईल क्रमांक (ऐच्छिक)",
    phonePlaceholder: "१० अंकी मोबाईल क्रमांक",
    overallPrompt: "एकूण अनुभव",
    ratingLabels: {
      1: "अत्यंत खराब - तात्काळ लक्ष देणे आवश्यक",
      2: "अपेक्षेपेक्षा कमी",
      3: "सर्वसाधारण / समाधानकारक",
      4: "चांगली काळजी आणि सोय",
      5: "उत्कृष्ट उपचार आणि आपुलकीची सेवा",
    },
    deptHeading: "विशिष्ट विभागांना रेटिंग द्या",
    doctorLabel: "डॉक्टर आणि सल्ला",
    nursingLabel: "नर्सिंग आणि मॅटर्निटी सेवा",
    hygieneLabel: "खोलीची स्वच्छता",
    foodLabel: "आहार आणि कँटीन सेवा",
    tagsHeading: "मुक्कामादरम्यान कोणती गोष्ट विशेष वाटली?",
    tags: [
      "काळजी घेणाऱ्या परिचारिका",
      "लक्ष देणारे डॉक्टर",
      "स्वच्छ खोली",
      "त्वरित प्रतिसाद",
      "सुलभ प्रवेश/डिस्चार्ज",
      "नम्र कर्मचारी",
    ],
    commentLabel: "अतिरिक्त सूचना किंवा तक्रार",
    commentPlaceholder: "वैद्यकीय संचालक किंवा मॅट्रन यांच्यासाठी संदेश लिहा...",
    submitBtn: "अभिप्राय पाठवा",
    submittingBtn: "पाठवले जात आहे...",
    thankYouTitle: "तुमच्या अभिप्रायाबद्दल धन्यवाद!",
    thankYouHighMsg:
      "फौझिया मॅटर्निटी अँड नर्सिंग होममधील तुमचा अनुभव सकारात्मक राहिल्याचा आम्हाला आनंद आहे. कृपया Google वरही अभिप्राय द्या.",
    googleReviewBtn: "Google वर रेटिंग द्या",
    thankYouLowMsg:
      "गैरसोयीबद्दल आम्ही दिलगीर आहोत. तात्काळ कार्यवाहीसाठी रुग्णालय व्यवस्थापनाला आणि मॅट्रन यांना अलर्ट पाठवला आहे.",
    submitAnotherBtn: "दुसरा अभिप्राय नोंदवा",
    openDashboardLink: "हॉस्पिटल अ‍ॅडमिन डैशबोर्ड उघडा",
  },
};

export const WARDS = [
  "Maternity Suite",
  "Private Room",
  "Semi-Private Ward",
  "General Ward",
  "NICU / Nursery",
  "OPD & Consultation",
];