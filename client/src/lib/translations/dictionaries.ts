export type Language = "EN" | "BN";

export const DICTIONARY = {
  EN: {
    // Navigation
    nav_home: "Home",
    nav_climate_analysis: "Climate Analysis",
    nav_recommendations: "Recommendations",
    nav_crop_rotation: "Crop Rotation",
    nav_farm_intelligence: "Farm Intelligence",
    nav_data_fusion: "Data Fusion",
    nav_statistical_intelligence: "Statistical Intelligence",
    nav_why_this_result: "Why This Result?",
    nav_ask_ai: "Ask CropWise AI",
    nav_learn: "Learn",
    nav_about: "About",
    nav_device_status: "Device Status",
    nav_device_overview: "Device Overview",
    nav_relay_control: "Relay Control",
    nav_timers_schedules: "Timers & Schedules",
    nav_automation_rules: "Automation Rules",
    nav_sensor_monitoring: "Sensor Monitoring",
    nav_activity_logs: "Activity Logs",
    nav_voice_assistant: "Voice Assistant",
    nav_device_settings: "Device Settings",
    tagline: "Adapting Farms with NASA Data",

    // Common & Actions
    analyze: "Analyze",
    update_analysis: "Update Analysis",
    retry: "Retry",
    view_details: "View Details",
    calendar: "Planting Calendar",
    analysis_id: "ID",
    notifications: "Notifications",
    guest: "Guest",
    signin: "Sign In",
    profile: "My Profile",
    logout: "Log Out",

    // Hero Section
    hero_title: "Climate Analysis",
    hero_desc: "Insights from NASA Earth observations to help you make better farming decisions.",
    quote_healthy_fields: "Healthy Fields\nBrighter Tomorrows",
    quote_adapting: "Adapting today for a more secure tomorrow.",

    // Filter Bar
    filter_location: "Location",
    filter_crop: "Crop",
    filter_priority: "Farm Priority",
    filter_select_location: "Select Location",
    filter_select_crop: "Select Crop",
    filter_select_priority: "Select Priority",
    filter_hint_ai: "💡 Not sure? Ask CropWise AI or explore our learning section!",
    filter_hint_nasa: "ⓘ Your data is analyzed using NASA Earth observations.",

    // Metrics
    metric_rainfall: "Rainfall Summary",
    metric_rainfall_note: "Trend",
    metric_temperature: "Temperature Profile",
    metric_temperature_note: "Max",
    metric_moisture: "Root-zone Moisture",
    metric_moisture_surface: "Surface moisture",
    metric_risk: "Risk & Resilience",
    metric_water_req: "Water Req",

    // Charts
    chart_rainfall_title: "Rainfall Pattern Comparison",
    chart_temp_title: "Temperature Trend",
    chart_hist_legend: "2001–2012 (Historical)",
    chart_recent_legend: "2013–2025 (Recent)",
    chart_rainfall_axis: "Rainfall (mm)",
    chart_temp_axis: "Temperature (°C)",

    // Recommendation Banner
    rec_badge: "Recommended Planting Window",
    rec_primary_crop: "Primary Crop",
    rec_water: "Water",
    rec_risk: "Risk",
    rec_based_on: "Based on NASA Earth observations and CropWise AI models, the optimal planting window for",
    rec_in: "in",
    rec_is: "is identified as",
    rec_to: "to",
    rec_with: "with",
    rec_water_req: "water requirement and",
    rec_risk_level: "risk level.",
    rec_alternatives: "Viable alternatives include:",
    rec_why_title: "Why this recommendation",

    // Farmer Advice
    advice_title: "Actionable Farmer Advice",
    advice_badge: "Field Recommendations",

    // Provenance
    data_sources: "Data Sources:",
    ai_powered: "AI Powered:",
    ai_model: "Model:",

    // Loading & Error States
    loading_title: "Querying NASA Earth Data & Running AI Analysis",
    loading_desc: "Processing satellite observations from NASA POWER, GPM IMERG & SMAP for",
    loading_status: "Analyzing climate patterns...",
    error_title: "Analysis Error",
    error_host_hint: "Ensure the backend service is running at",

    // Empty State
    empty_title: "Ready to analyze your farm?",
    empty_desc: "Select your location, crop, and farming priority to begin your NASA-powered analysis.",
    step1_title: "Choose your farm",
    step1_desc: "Select your location, crop and priority.",
    step2_title: "Analyze NASA data",
    step2_desc: "We process real satellite data and climate trends.",
    step3_title: "Get actionable insights",
    step3_desc: "Receive personalized recommendations for a more resilient tomorrow.",
    empty_slogan: "Same Land. New Possibilities.",

    // Ask AI Bar
    ask_ai_title: "Need help? Ask CropWise AI",
    ask_ai_subtitle: "Get simple explanations, farming tips, or learn how it works in Bangla or English.",
    ask_ai_placeholder: "Ask how CropWise AI works...",

    // Map section
    map_title: "Farm Location & Satellite Coverage",
  },

  BN: {
    // Navigation
    nav_home: "হোম",
    nav_climate_analysis: "জলবায়ু বিশ্লেষণ",
    nav_recommendations: "সুপারিশসমূহ",
    nav_crop_rotation: "ফসল আবর্তন",
    nav_farm_intelligence: "ফার্ম ইন্টেলিজেন্স",
    nav_data_fusion: "ডেটা ফিউশন",
    nav_statistical_intelligence: "পরিসংখ্যানগত বুদ্ধিমত্তা",
    nav_why_this_result: "কেন এই ফলাফল?",
    nav_ask_ai: "ক্রপওয়াইজ এআইকে জিজ্ঞাসা করুন",
    nav_learn: "শিখুন",
    nav_about: "আমাদের সম্পর্কে",
    nav_device_status: "ডিভাইস স্ট্যাটাস",
    nav_device_overview: "ডিভাইস ওভারভিউ",
    nav_relay_control: "রিলে কন্ট্রোল",
    nav_timers_schedules: "টাইমার ও শিডিউল",
    nav_automation_rules: "অটোমেশন রুলস",
    nav_sensor_monitoring: "সেন্সর মনিটরিং",
    nav_activity_logs: "অ্যাক্টিভিটি লগ",
    nav_voice_assistant: "ভয়েস অ্যাসিস্ট্যান্ট",
    nav_device_settings: "ডিভাইস ও মোটর সেটিংস",
    tagline: "নাসার তথ্যে আধুনিক কৃষি",

    // Common & Actions
    analyze: "বিশ্লেষণ করুন",
    update_analysis: "বিশ্লেষণ আপডেট করুন",
    retry: "পুনরায় চেষ্টা করুন",
    view_details: "বিস্তারিত দেখুন",
    calendar: "রোপণ ক্যালেন্ডার",
    analysis_id: "আইডি",
    notifications: "বিজ্ঞপ্তি",
    guest: "অতিথি",
    signin: "লগইন",
    profile: "আমার প্রোফাইল",
    logout: "লগআউট",

    // Hero Section
    hero_title: "জলবায়ু বিশ্লেষণ",
    hero_desc: "আপনার কৃষিকাজে সঠিক সিদ্ধান্ত গ্রহণে সহায়তার জন্য নাসা আর্থ অবজারভেশনের বিশ্লেষণ।",
    quote_healthy_fields: "সুস্থ মাঠ\nউজ্জ্বল ভবিষ্যৎ",
    quote_adapting: "আজকের সচেতন অভিযোজন, আগামী দিনের খাদ্য নিরাপত্তা।",

    // Filter Bar
    filter_location: "অবস্থান (জেলা)",
    filter_crop: "ফসল",
    filter_priority: "খামারের অগ্রাধিকার",
    filter_select_location: "অবস্থান নির্বাচন করুন",
    filter_select_crop: "ফসল নির্বাচন করুন",
    filter_select_priority: "অগ্রাধিকার নির্বাচন করুন",
    filter_hint_ai: "💡 নিশ্চিত নন? ক্রপওয়াইজ এআইকে জিজ্ঞাসা করুন বা আমাদের শিখন বিভাগটি দেখুন!",
    filter_hint_nasa: "ⓘ আপনার তথ্য নাসার স্যাটেলাইট আর্থ অবজারভেশন দ্বারা বিশ্লেষিত।",

    // Metrics
    metric_rainfall: "বৃষ্টিপাতের সারাংশ",
    metric_rainfall_note: "প্রবণতা",
    metric_temperature: "তাপমাত্রার তথ্য",
    metric_temperature_note: "সর্বোচ্চ",
    metric_moisture: "মূল অঞ্চলের আর্দ্রতা",
    metric_moisture_surface: "পৃষ্ঠভাগের আর্দ্রতা",
    metric_risk: "ঝুঁকি ও সহনশীলতা",
    metric_water_req: "পানির চাহিদা",

    // Charts
    chart_rainfall_title: "বৃষ্টিপাতের ঐতিহাসিক তুলনা",
    chart_temp_title: "তাপমাত্রার প্রবণতা",
    chart_hist_legend: "২০০১–২০১২ (ঐতিহাসিক)",
    chart_recent_legend: "২০১৩–২০২৫ (সাম্প্রতিক)",
    chart_rainfall_axis: "বৃষ্টিপাত (মি.মি.)",
    chart_temp_axis: "তাপমাত্রা (°সে.)",

    // Recommendation Banner
    rec_badge: "প্রস্তাবিত রোপণ সময়সীমা",
    rec_primary_crop: "প্রধান ফসল",
    rec_water: "পানির চাহিদা",
    rec_risk: "ঝুঁকি",
    rec_based_on: "নাসার স্যাটেলাইট পর্যবেক্ষণ ও ক্রপওয়াইজ এআই মডেল অনুসারে,",
    rec_in: "-এ",
    rec_is: "ফসলের জন্য সর্বোত্তম রোপণ সময় নির্ধারণ করা হয়েছে",
    rec_to: "থেকে",
    rec_with: "। এতে পানির চাহিদা",
    rec_water_req: "এবং ঝুঁকি স্তর",
    rec_risk_level: "হিসেবে চিহ্নিত।",
    rec_alternatives: "অন্যান্য উপযোগী বিকল্প ফসল:",
    rec_why_title: "কেন এই সুপারিশ?",

    // Farmer Advice
    advice_title: "কৃষকদের জন্য মাঠপর্যায়ের পরামর্শ",
    advice_badge: "মাঠের নির্দেশনা",

    // Provenance
    data_sources: "তথ্যের উৎস:",
    ai_powered: "এআই চালিত:",
    ai_model: "মডেল:",

    // Loading & Error States
    loading_title: "নাসার উপগ্রহ উপাত্ত সংগ্রহ ও এআই বিশ্লেষণ চলছে",
    loading_desc: "নাসা POWER, GPM IMERG এবং SMAP স্যাটেলাইট থেকে তথ্য সংগ্রহ ও বিশ্লেষণ করা হচ্ছে:",
    loading_status: "জলবায়ুর ধরন বিশ্লেষণ করা হচ্ছে...",
    error_title: "বিশ্লেষণে ত্রুটি হয়েছে",
    error_host_hint: "নিশ্চিত করুন ব্যাকএন্ড সার্ভার চালু রয়েছে এখানে:",

    // Empty State
    empty_title: "আপনার খামার বিশ্লেষণ করতে প্রস্তুত?",
    empty_desc: "নাসার স্যাটেলাইট ভিত্তিক বিশ্লেষণ শুরু করতে আপনার জেলা, ফসল এবং খামারের অগ্রাধিকার নির্বাচন করুন।",
    step1_title: "খামার নির্বাচন করুন",
    step1_desc: "আপনার অবস্থান, ফসল এবং অগ্রাধিকার বেছে নিন।",
    step2_title: "নাসার তথ্য বিশ্লেষণ",
    step2_desc: "আমরা বাস্তব স্যাটেলাইট ডাটা ও জলবায়ুর ধারা বিশ্লেষণ করি।",
    step3_title: "সুপারিশ গ্রহণ করুন",
    step3_desc: "একটি সুরক্ষিত ও ফলপ্রসূ আগামীর জন্য বাস্তবমুখী পরামর্শ গ্রহণ করুন।",
    empty_slogan: "একই জমি। নতুন সম্ভাবনা।",

    // Ask AI Bar
    ask_ai_title: "সাহায্য প্রয়োজন? ক্রপওয়াইজ এআইকে জিজ্ঞাসা করুন",
    ask_ai_subtitle: "সহজ ব্যাখ্যা, কৃষি পরামর্শ বা সিস্টেমটি কীভাবে কাজ করে তা বাংলা বা ইংরেজিতে জানুন।",
    ask_ai_placeholder: "ক্রপওয়াইজ এআই কীভাবে কাজ করে জিজ্ঞাসা করুন...",

    // Map section
    map_title: "খামারের অবস্থান ও স্যাটেলাইট কভারেজ",
  },
} as const;

// Location translations
export const LOCATION_NAMES: Record<string, { en: string; bn: string }> = {
  Mymensingh: { en: "Mymensingh", bn: "ময়মনসিংহ" },
  Rajshahi: { en: "Rajshahi", bn: "রাজশাহী" },
  Rangpur: { en: "Rangpur", bn: "রংপুর" },
  Dhaka: { en: "Dhaka", bn: "ঢাকা" },
  Chittagong: { en: "Chittagong", bn: "চট্টগ্রাম" },
  Sylhet: { en: "Sylhet", bn: "সিলেট" },
  Khulna: { en: "Khulna", bn: "খুলনা" },
  Barisal: { en: "Barisal", bn: "বরিশাল" },
  Dinajpur: { en: "Dinajpur", bn: "দিনাজপুর" },
  Bogura: { en: "Bogura", bn: "বগুড়া" },
  Comilla: { en: "Comilla", bn: "কুমিল্লা" },
  Jessore: { en: "Jessore", bn: "যশোর" },
  Pabna: { en: "Pabna", bn: "পাবনা" },
  Tangail: { en: "Tangail", bn: "টাঙ্গাইল" },
  Kushtia: { en: "Kushtia", bn: "কুষ্টিয়া" },
  Sirajganj: { en: "Sirajganj", bn: "সিরাজগঞ্জ" },
  Faridpur: { en: "Faridpur", bn: "ফরিদপুর" },
  Natore: { en: "Natore", bn: "নাটোর" },
};

// Crop translations
export const CROP_NAMES: Record<string, { en: string; bn: string }> = {
  "Aman Rice": { en: "Aman Rice", bn: "আমন ধান" },
  "Boro Rice": { en: "Boro Rice", bn: "বোরো ধান" },
  "Aus Rice": { en: "Aus Rice", bn: "আউশ ধান" },
  Maize: { en: "Maize", bn: "ভুট্টা" },
  Mustard: { en: "Mustard", bn: "সরিষা" },
  Wheat: { en: "Wheat", bn: "গম" },
  Potato: { en: "Potato", bn: "আলু" },
  Jute: { en: "Jute", bn: "পাট" },
  "Lentil (Pulses)": { en: "Lentil (Pulses)", bn: "মসুর ডাল" },
  Sugarcane: { en: "Sugarcane", bn: "আখ" },
  Onion: { en: "Onion", bn: "পেঁয়াজ" },
  "Chili / Spices": { en: "Chili / Spices", bn: "মরিচ ও মশলা" },
  Vegetables: { en: "Vegetables", bn: "শাকসবজি" },
  rice: { en: "Rice", bn: "ধান" },
  maize: { en: "Maize", bn: "ভুট্টা" },
  mustard: { en: "Mustard", bn: "সরিষা" },
  wheat: { en: "Wheat", bn: "গম" },
  potato: { en: "Potato", bn: "আলু" },
  jute: { en: "Jute", bn: "পাট" },
  lentil: { en: "Lentil", bn: "ডাল" },
  sugarcane: { en: "Sugarcane", bn: "আখ" },
  onion: { en: "Onion", bn: "পেঁয়াজ" },
  chili: { en: "Chili", bn: "মরিচ" },
  vegetables: { en: "Vegetables", bn: "সবজি" },
};

// Priority translations
export const PRIORITY_NAMES: Record<string, { en: string; bn: string }> = {
  "Save Water": { en: "Save Water", bn: "পানি সাশ্রয়" },
  "Maximize Yield": { en: "Maximize Yield", bn: "ফলন বৃদ্ধি" },
  "Climate Resilience": { en: "Climate Resilience", bn: "জলবায়ু সহনশীলতা" },
  "Low Risk / Cost Minimization": { en: "Low Risk / Cost Minimization", bn: "কম ঝুঁকি ও খরচ সংকোচন" },
  "Fast Harvest / Early Maturing": { en: "Fast Harvest / Early Maturing", bn: "দ্রুত কর্তন / আগাম ফসল" },
  "Soil Health & Regeneration": { en: "Soil Health & Regeneration", bn: "মাটির উর্বরতা ও স্বাস্থ্য রক্ষা" },
  "Pest & Disease Resistance": { en: "Pest & Disease Resistance", bn: "কীট ও রোগবালাই প্রতিরোধ" },
  "High Market Profit": { en: "High Market Profit", bn: "বাজারে অধিক লাভ" },
};

// Common terms mapping
export const TERM_MAP: Record<string, { en: string; bn: string }> = {
  low: { en: "Low", bn: "কম" },
  moderate: { en: "Moderate", bn: "মাঝারি" },
  high: { en: "High", bn: "উচ্চ" },
  severe: { en: "Severe", bn: "তীব্র" },
  stable: { en: "Stable", bn: "স্থিতিশীল" },
  increasing: { en: "Increasing", bn: "ক্রমবর্ধমান" },
  decreasing: { en: "Decreasing", bn: "হ্রাসমান" },
  water_saving: { en: "Water Saving", bn: "পানি সাশ্রয়" },
  water_stress: { en: "Water Stress", bn: "পানির অভাব / খরা ঝুঁকি" },
  thermal_stress: { en: "Thermal Stress", bn: "তাপমাত্রা জনিত চাপ" },
  "Soil moisture": { en: "Soil moisture", bn: "মাটির আর্দ্রতা" },
  Rainfall: { en: "Rainfall", bn: "বৃষ্টিপাত" },
  Temperature: { en: "Temperature", bn: "তাপমাত্রা" },
};

export const MONTH_NAMES: Record<string, { en: string; bn: string }> = {
  Jan: { en: "Jan", bn: "জানু" },
  Feb: { en: "Feb", bn: "ফেব্রু" },
  Mar: { en: "Mar", bn: "মার্চ" },
  Apr: { en: "Apr", bn: "এপ্রিল" },
  May: { en: "May", bn: "মে" },
  Jun: { en: "Jun", bn: "জুন" },
  Jul: { en: "Jul", bn: "জুলাই" },
  Aug: { en: "Aug", bn: "আগস্ট" },
  Sep: { en: "Sep", bn: "সেপ্টে" },
  Oct: { en: "Oct", bn: "অক্টো" },
  Nov: { en: "Nov", bn: "নভে" },
  Dec: { en: "Dec", bn: "ডিসে" },
};
