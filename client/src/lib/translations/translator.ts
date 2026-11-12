// Smart translation dictionary for agricultural AI responses
const PHRASE_TRANSLATIONS: Record<string, string> = {
  // Why this result & factors
  "Root-zone soil moisture is": "মূল অঞ্চলের মাটির আর্দ্রতা হলো",
  "Observed/projected rainfall for the period is": "উক্ত সময়ের জন্য পর্যবেক্ষণকৃত ও পূর্বাভাসকৃত বৃষ্টিপাত হলো",
  "Mean ambient temperature is": "গড় বায়ুমণ্ডলীয় তাপমাত্রা হলো",
  "Crops with matching water profiles are prioritized for steady emergence.":
    "সুষ্ঠু অঙ্কুরোদগম ও বৃদ্ধির জন্য পানির চাহিদার সাথে সামঞ্জস্যপূর্ণ ফসলকে অগ্রাধিকার দেওয়া হয়েছে।",
  "Supplementary irrigation needs are minimized with the recommended choice.":
    "প্রস্তাবিত ফসল নির্বাচনের মাধ্যমে অতিরিক্ত সেচের প্রয়োজনীয়তা সর্বনিম্ন রাখা সম্ভব।",
  "Favorable germination conditions reduce vegetative thermal stress.":
    "অনুকূল অঙ্কুরোদগম পরিবেশ ফসলের প্রাথমিক বৃদ্ধি পর্যায়ে তাপজনিত চাপ কমায়।",

  // Farmer advice lines
  "Monitor root-zone soil moisture before sowing or transplanting":
    "বীজ বপন বা চারা রোপণের পূর্বে মূল অঞ্চলের মাটির আর্দ্রতা পরীক্ষা করুন",
  "Ensure secondary irrigation channels are clear in case of low precipitation":
    "বৃষ্টিপাত কম হলে যাতে সেচ দেওয়া যায় সেজন্য বিকল্প সেচনালা প্রস্তুত রাখুন",
  "Select certified seed varieties well adapted to local climate conditions":
    "স্থানীয় আবহাওয়ার সাথে খাপ খাইয়ে নিতে সক্ষম প্রত্যয়িত জাতের মানসম্পন্ন বীজ নির্বাচন করুন",
  "Apply balanced fertilizer based on soil testing and moisture availability":
    "মাটি পরীক্ষা ও পর্যাপ্ত আর্দ্রতার উপস্থিতি বিবেচনা করে সুষম সার প্রয়োগ করুন",
  "Prepare seedbed with appropriate organic matter to retain moisture":
    "মাটির আর্দ্রতা ধরে রাখার জন্য পর্যাপ্ত জৈব সার মিশিয়ে বীজতলা প্রস্তুত করুন",
  "Adopt water-saving techniques such as Alternate Wetting and Drying (AWD)":
    "পর্যায়ক্রমে ভেজানো ও শুকানো (এডাব্লিউডি) এর মতো পানি সাশ্রয়ী পদ্ধতি ব্যবহার করুন",

  // Risks
  "Soil moisture reserve supports healthy initial root development.":
    "মাটিতে বিদ্যমান আর্দ্রতার মজুদ প্রাথমিক মূল সুসংগঠিতভাবে বিকাশে সহায়তা করে।",
  "Higher temperatures may affect crop development.":
    "অতিরিক্ত তাপমাত্রা ফসলের স্বাভাবিক বৃদ্ধি ও ফলনে প্রভাব ফেলতে পারে।",
  "Rainy season now starts later in recent years.":
    "সাম্প্রতিক বছরগুলোতে বর্ষা মৌসুম তুলনামূলক দেরিতে শুরু হতে দেখা যাচ্ছে।",
  "Soil moisture is sufficient for transplanting soon.":
    "নিকট ভবিষ্যতে চারা রোপণের জন্য মাটির আর্দ্রতা সন্তোষজনক অবস্থায় রয়েছে।",
  "Vegetation condition looks healthy for the season.":
    "মৌসুমের এই সময়ে উদ্ভিদের সামগ্রিক স্বাস্থ্য ও সবুজ ভাব ভালো লক্ষ্য করা যাচ্ছে।",
  "Recent observed and projected precipitation for the analyzed window.":
    "বিশ্লেষিত সময়ের জন্য সাম্প্রতিক পরিলক্ষিত ও পূর্বাভাসকৃত বৃষ্টিপাত।",
  "Mean ambient temperature across the target crop vegetative phase.":
    "উদ্দিষ্ট ফসলের অঙ্গজ বৃদ্ধি পর্যায়ে প্রত্যাশিত গড় তাপমাত্রা।",
};

// In-memory cache for dynamic translations
const dynamicCache = new Map<string, string>();

/**
 * Translates arbitrary text from English to Bengali.
 * 1. Checks exact phrase match dictionary.
 * 2. Checks cached translation.
 * 3. Substitutes matched phrase fragments.
 * 4. Fallback to free Google Translate endpoint with timeout for any dynamic content.
 */
export async function translateToBengali(text: string): Promise<string> {
  if (!text || typeof text !== "string") return text;
  const trimmed = text.trim();
  if (!trimmed) return text;

  // 1. Exact match in local agricultural dictionary
  if (PHRASE_TRANSLATIONS[trimmed]) {
    return PHRASE_TRANSLATIONS[trimmed];
  }

  // 2. In-memory cache
  if (dynamicCache.has(trimmed)) {
    return dynamicCache.get(trimmed)!;
  }

  // 3. Substring replacement for common patterns
  let translated = trimmed;
  for (const [enPattern, bnReplacement] of Object.entries(PHRASE_TRANSLATIONS)) {
    if (translated.includes(enPattern)) {
      translated = translated.replace(enPattern, bnReplacement);
    }
  }

  if (translated !== trimmed) {
    dynamicCache.set(trimmed, translated);
    return translated;
  }

  // 4. Client-side lightweight translation fallback
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bn&dt=t&q=${encodeURIComponent(
      trimmed
    )}`;

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const result = data[0].map((item: any) => item[0]).join("");
        if (result) {
          dynamicCache.set(trimmed, result);
          return result;
        }
      }
    }
  } catch {
    // If offline or timeout, return best-effort text
  }

  return trimmed;
}

/**
 * Synchronous best-effort translation for immediate render.
 */
export function translateToBengaliSync(text: string): string {
  if (!text || typeof text !== "string") return text;
  const trimmed = text.trim();
  if (PHRASE_TRANSLATIONS[trimmed]) {
    return PHRASE_TRANSLATIONS[trimmed];
  }
  if (dynamicCache.has(trimmed)) {
    return dynamicCache.get(trimmed)!;
  }

  let translated = trimmed;
  for (const [enPattern, bnReplacement] of Object.entries(PHRASE_TRANSLATIONS)) {
    if (translated.includes(enPattern)) {
      translated = translated.replace(enPattern, bnReplacement);
    }
  }

  return translated;
}
