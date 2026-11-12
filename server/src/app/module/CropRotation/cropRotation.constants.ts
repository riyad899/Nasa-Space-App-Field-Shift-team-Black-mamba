/**
 * CropWise AI — CropRotation Knowledge Base & Constants
 * Comprehensive agronomic database tailored for Bangladesh agro-ecological zones (AEZ)
 * Deterministic rules for crop families, thermal requirements, water needs, soil suitability,
 * and seasonal cropping calendars (Rabi, Kharif-I, Kharif-II).
 */

export interface ICropAgronomicProfile {
    id: string;
    nameEn: string;
    nameBn: string;
    family: string; // Poaceae, Fabaceae, Solanaceae, Malvaceae, Brassicaceae, etc.
    suitableSeasons: Array<"Rabi" | "Kharif-I" | "Kharif-II">;
    durationDays: { min: number; max: number; average: number };
    plantingWindow: {
        Rabi?: { startMonth: number; startDay: number; endMonth: number; endDay: number; label: string };
        "Kharif-I"?: { startMonth: number; startDay: number; endMonth: number; endDay: number; label: string };
        "Kharif-II"?: { startMonth: number; startDay: number; endMonth: number; endDay: number; label: string };
    };
    harvestingWindow: {
        Rabi?: { startMonth: number; startDay: number; endMonth: number; endDay: number; label: string };
        "Kharif-I"?: { startMonth: number; startDay: number; endMonth: number; endDay: number; label: string };
        "Kharif-II"?: { startMonth: number; startDay: number; endMonth: number; endDay: number; label: string };
    };
    waterRequirementMm: { min: number; max: number; average: number };
    waterNeedCategory: "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH";
    temperatureRangeC: { min: number; max: number; optimalMin: number; optimalMax: number };
    soilMoistureTolerance: {
        minVolumetric: number; // m3/m3
        maxVolumetric: number;
        waterloggingTolerance: "LOW" | "MODERATE" | "HIGH";
        droughtTolerance: "LOW" | "MODERATE" | "HIGH";
    };
    soilTypePreference: string[];
    nutrientImpact: "RESTORES_NITROGEN" | "HEAVY_FEEDER" | "MODERATE_FEEDER" | "LIGHT_FEEDER" | "AERATES_SUBSOIL";
    rootDepth: "SHALLOW" | "MEDIUM" | "DEEP";
    biomassContribution: "LOW" | "MEDIUM" | "HIGH";
    compatibleSuccessors: string[]; // Crop IDs that benefit from following this crop
    incompatibleSuccessors: string[]; // Crop IDs that MUST NOT immediately follow (disease/pest carryover)
    agronomicBenefits: string[];
    risks: string[];
}

export const SUPPORTED_CROPS: Record<string, ICropAgronomicProfile> = {
    rice_aman: {
        id: "rice_aman",
        nameEn: "Rice (T. Aman)",
        nameBn: "ধান (রোপা আমন)",
        family: "Poaceae",
        suitableSeasons: ["Kharif-II"],
        durationDays: { min: 115, max: 135, average: 125 },
        plantingWindow: {
            "Kharif-II": { startMonth: 7, startDay: 1, endMonth: 8, endDay: 15, label: "July 01 – August 15" },
        },
        harvestingWindow: {
            "Kharif-II": { startMonth: 11, startDay: 10, endMonth: 12, endDay: 20, label: "November 10 – December 20" },
        },
        waterRequirementMm: { min: 1100, max: 1450, average: 1250 },
        waterNeedCategory: "VERY_HIGH",
        temperatureRangeC: { min: 20, max: 37, optimalMin: 24, optimalMax: 32 },
        soilMoistureTolerance: {
            minVolumetric: 0.35,
            maxVolumetric: 0.95,
            waterloggingTolerance: "HIGH",
            droughtTolerance: "LOW",
        },
        soilTypePreference: ["Clay Loam", "Silty Clay", "Loam", "Alluvial Clay"],
        nutrientImpact: "HEAVY_FEEDER",
        rootDepth: "SHALLOW",
        biomassContribution: "MEDIUM",
        compatibleSuccessors: ["potato", "lentils", "mustard", "wheat", "chickpea", "vegetables"],
        incompatibleSuccessors: [],
        agronomicBenefits: [
            "Capitalizes on peak monsoon precipitation in Bangladesh",
            "Flooded paddy conditions suppress weeds and soil-borne pathogens",
            "Creates ideal puddle soil condition for subsequent winter moisture retention",
        ],
        risks: [
            "Severe yield loss if drought occurs during panicle initiation (October)",
            "Susceptible to flash flooding during seedling transplantation",
        ],
    },

    rice_boro: {
        id: "rice_boro",
        nameEn: "Rice (Boro)",
        nameBn: "ধান (বোরো)",
        family: "Poaceae",
        suitableSeasons: ["Rabi"],
        durationDays: { min: 135, max: 155, average: 145 },
        plantingWindow: {
            Rabi: { startMonth: 12, startDay: 15, endMonth: 1, endDay: 25, label: "December 15 – January 25" },
        },
        harvestingWindow: {
            Rabi: { startMonth: 4, startDay: 20, endMonth: 5, endDay: 25, label: "April 20 – May 25" },
        },
        waterRequirementMm: { min: 1000, max: 1300, average: 1150 },
        waterNeedCategory: "VERY_HIGH",
        temperatureRangeC: { min: 14, max: 35, optimalMin: 22, optimalMax: 30 },
        soilMoistureTolerance: {
            minVolumetric: 0.40,
            maxVolumetric: 0.95,
            waterloggingTolerance: "HIGH",
            droughtTolerance: "LOW",
        },
        soilTypePreference: ["Clay Loam", "Silty Clay", "Loam"],
        nutrientImpact: "HEAVY_FEEDER",
        rootDepth: "SHALLOW",
        biomassContribution: "MEDIUM",
        compatibleSuccessors: ["rice_aus", "vegetables"],
        incompatibleSuccessors: ["rice_boro"],
        agronomicBenefits: [
            "Highest grain yield potential among all Bangladesh rice ecotypes",
            "Avoids monsoon flood risks during harvest",
        ],
        risks: [
            "Extreme groundwater pumping and irrigation costs during dry winter",
            "Early flash flood risk in Haor basin during late April/May harvest",
        ],
    },

    rice_aus: {
        id: "rice_aus",
        nameEn: "Rice (Aus)",
        nameBn: "ধান (আউশ)",
        family: "Poaceae",
        suitableSeasons: ["Kharif-I"],
        durationDays: { min: 90, max: 110, average: 100 },
        plantingWindow: {
            "Kharif-I": { startMonth: 3, startDay: 25, endMonth: 5, endDay: 10, label: "March 25 – May 10" },
        },
        harvestingWindow: {
            "Kharif-I": { startMonth: 7, startDay: 1, endMonth: 8, endDay: 10, label: "July 01 – August 10" },
        },
        waterRequirementMm: { min: 550, max: 750, average: 650 },
        waterNeedCategory: "MODERATE",
        temperatureRangeC: { min: 22, max: 36, optimalMin: 26, optimalMax: 33 },
        soilMoistureTolerance: {
            minVolumetric: 0.28,
            maxVolumetric: 0.85,
            waterloggingTolerance: "MODERATE",
            droughtTolerance: "MODERATE",
        },
        soilTypePreference: ["Loam", "Clay Loam", "Sandy Loam"],
        nutrientImpact: "MODERATE_FEEDER",
        rootDepth: "SHALLOW",
        biomassContribution: "MEDIUM",
        compatibleSuccessors: ["rice_aman", "vegetables"],
        incompatibleSuccessors: [],
        agronomicBenefits: [
            "Relies on pre-monsoon convective rains, reducing irrigation energy",
            "Short duration allows seamless turnaround into Transplanted Aman",
        ],
        risks: [
            "Early summer heat stress or drought during April flowering",
            "Overlapping rains during harvest requiring artificial drying",
        ],
    },

    jute: {
        id: "jute",
        nameEn: "Jute",
        nameBn: "পাট",
        family: "Malvaceae",
        suitableSeasons: ["Kharif-I"],
        durationDays: { min: 110, max: 125, average: 118 },
        plantingWindow: {
            "Kharif-I": { startMonth: 3, startDay: 15, endMonth: 4, endDay: 30, label: "March 15 – April 30" },
        },
        harvestingWindow: {
            "Kharif-I": { startMonth: 7, startDay: 15, endMonth: 8, endDay: 25, label: "July 15 – August 25" },
        },
        waterRequirementMm: { min: 500, max: 750, average: 620 },
        waterNeedCategory: "MODERATE",
        temperatureRangeC: { min: 24, max: 38, optimalMin: 28, optimalMax: 35 },
        soilMoistureTolerance: {
            minVolumetric: 0.25,
            maxVolumetric: 0.85,
            waterloggingTolerance: "HIGH",
            droughtTolerance: "MODERATE",
        },
        soilTypePreference: ["Alluvial Silt Loam", "Loam", "Clay Loam"],
        nutrientImpact: "AERATES_SUBSOIL",
        rootDepth: "DEEP",
        biomassContribution: "HIGH",
        compatibleSuccessors: ["rice_aman", "potato", "mustard", "wheat"],
        incompatibleSuccessors: ["jute"],
        agronomicBenefits: [
            "Deep vigorous taproot punches through hardpan plow layers, improving drainage",
            "Sheds 2.5 to 3.5 tons of organic leaf biomass per hectare into the soil",
            "Breaks cereal pest, nematode, and fungal cycles effectively",
        ],
        risks: [
            "Requires adequate standing water bodies for traditional retting in July/August",
            "Seedling stage vulnerable to early heavy stagnant inundation",
        ],
    },

    wheat: {
        id: "wheat",
        nameEn: "Wheat",
        nameBn: "গম",
        family: "Poaceae",
        suitableSeasons: ["Rabi"],
        durationDays: { min: 105, max: 118, average: 112 },
        plantingWindow: {
            Rabi: { startMonth: 11, startDay: 15, endMonth: 12, endDay: 10, label: "November 15 – December 10" },
        },
        harvestingWindow: {
            Rabi: { startMonth: 3, startDay: 15, endMonth: 4, endDay: 10, label: "March 15 – April 10" },
        },
        waterRequirementMm: { min: 280, max: 380, average: 320 },
        waterNeedCategory: "LOW",
        temperatureRangeC: { min: 10, max: 26, optimalMin: 15, optimalMax: 22 },
        soilMoistureTolerance: {
            minVolumetric: 0.18,
            maxVolumetric: 0.65,
            waterloggingTolerance: "LOW",
            droughtTolerance: "MODERATE",
        },
        soilTypePreference: ["Loam", "Clay Loam", "Sandy Clay Loam"],
        nutrientImpact: "MODERATE_FEEDER",
        rootDepth: "MEDIUM",
        biomassContribution: "MEDIUM",
        compatibleSuccessors: ["jute", "rice_aus", "maize", "vegetables"],
        incompatibleSuccessors: ["wheat"],
        agronomicBenefits: [
            "Requires only 2-3 light irrigations, saving over 70% water compared to Boro rice",
            "Excellent rotation option following T. Aman in North and Western Bangladesh",
        ],
        risks: [
            "Terminal heat stress (>28°C) in late February/March causes shriveled grains",
            "High susceptibility to wheat blast (*Magnaporthe oryzae*) in humid southern districts",
        ],
    },

    potato: {
        id: "potato",
        nameEn: "Potato",
        nameBn: "আলু",
        family: "Solanaceae",
        suitableSeasons: ["Rabi"],
        durationDays: { min: 85, max: 98, average: 90 },
        plantingWindow: {
            Rabi: { startMonth: 11, startDay: 1, endMonth: 11, endDay: 30, label: "November 01 – November 30" },
        },
        harvestingWindow: {
            Rabi: { startMonth: 2, startDay: 5, endMonth: 3, endDay: 10, label: "February 05 – March 10" },
        },
        waterRequirementMm: { min: 350, max: 480, average: 400 },
        waterNeedCategory: "MODERATE",
        temperatureRangeC: { min: 10, max: 25, optimalMin: 15, optimalMax: 20 },
        soilMoistureTolerance: {
            minVolumetric: 0.22,
            maxVolumetric: 0.65,
            waterloggingTolerance: "LOW",
            droughtTolerance: "LOW",
        },
        soilTypePreference: ["Sandy Loam", "Silt Loam", "Light Loam"],
        nutrientImpact: "HEAVY_FEEDER",
        rootDepth: "SHALLOW",
        biomassContribution: "LOW",
        compatibleSuccessors: ["jute", "maize", "rice_aus", "vegetables"],
        incompatibleSuccessors: ["potato", "tomato", "eggplant"],
        agronomicBenefits: [
            "High economic cash return per hectare",
            "Short vegetative duration (90 days) frees land early for summer crops (Jute/Aus/Maize)",
            "Intensive tillage creates loose, aerated topsoil",
        ],
        risks: [
            "EXTREME RISK: Consecutive planting of Solanaceae triggers Late Blight (*Phytophthora infestans*)",
            "Rotting hazard under poor drainage or soil moisture exceeding field capacity (>0.70 m3/m3)",
        ],
    },

    maize: {
        id: "maize",
        nameEn: "Maize",
        nameBn: "ভুট্টা",
        family: "Poaceae",
        suitableSeasons: ["Rabi", "Kharif-I"],
        durationDays: { min: 120, max: 140, average: 130 },
        plantingWindow: {
            Rabi: { startMonth: 11, startDay: 1, endMonth: 12, endDay: 15, label: "November 01 – December 15" },
            "Kharif-I": { startMonth: 2, startDay: 15, endMonth: 3, endDay: 30, label: "February 15 – March 30" },
        },
        harvestingWindow: {
            Rabi: { startMonth: 3, startDay: 20, endMonth: 4, endDay: 30, label: "March 20 – April 30" },
            "Kharif-I": { startMonth: 6, startDay: 15, endMonth: 7, endDay: 30, label: "June 15 – July 30" },
        },
        waterRequirementMm: { min: 450, max: 650, average: 550 },
        waterNeedCategory: "MODERATE",
        temperatureRangeC: { min: 14, max: 36, optimalMin: 22, optimalMax: 30 },
        soilMoistureTolerance: {
            minVolumetric: 0.22,
            maxVolumetric: 0.75,
            waterloggingTolerance: "LOW",
            droughtTolerance: "MODERATE",
        },
        soilTypePreference: ["Loam", "Clay Loam", "Sandy Loam"],
        nutrientImpact: "HEAVY_FEEDER",
        rootDepth: "DEEP",
        biomassContribution: "HIGH",
        compatibleSuccessors: ["lentils", "chickpea", "rice_aman", "jute"],
        incompatibleSuccessors: ["maize"],
        agronomicBenefits: [
            "Extremely high yield potential and strong market demand for feed and starch",
            "Deep root network extracts subsoil moisture and nutrients",
            "Huge stover volume returned as soil organic mulch",
        ],
        risks: [
            "Severe nutrient depletion if not rotated with nitrogen-fixing pulses",
            "Highly sensitive to waterlogging during early seedling and tasseling stages",
        ],
    },

    lentils: {
        id: "lentils",
        nameEn: "Lentils",
        nameBn: "মসুর ডাল",
        family: "Fabaceae",
        suitableSeasons: ["Rabi"],
        durationDays: { min: 95, max: 110, average: 102 },
        plantingWindow: {
            Rabi: { startMonth: 10, startDay: 25, endMonth: 11, endDay: 25, label: "October 25 – November 25" },
        },
        harvestingWindow: {
            Rabi: { startMonth: 2, startDay: 15, endMonth: 3, endDay: 15, label: "February 15 – March 15" },
        },
        waterRequirementMm: { min: 150, max: 240, average: 190 },
        waterNeedCategory: "LOW",
        temperatureRangeC: { min: 10, max: 26, optimalMin: 14, optimalMax: 22 },
        soilMoistureTolerance: {
            minVolumetric: 0.16,
            maxVolumetric: 0.55,
            waterloggingTolerance: "LOW",
            droughtTolerance: "HIGH",
        },
        soilTypePreference: ["Loam", "Clay Loam", "Silt Loam"],
        nutrientImpact: "RESTORES_NITROGEN",
        rootDepth: "MEDIUM",
        biomassContribution: "MEDIUM",
        compatibleSuccessors: ["jute", "rice_aus", "maize", "rice_aman"],
        incompatibleSuccessors: ["lentils", "chickpea"],
        agronomicBenefits: [
            "Fixes 45 to 65 kg of atmospheric nitrogen per hectare via Rhizobium symbiosis",
            "Cuts synthetic urea fertilizer need for subsequent crop by 30-40%",
            "Extremely low water footprint, thriving on residual post-monsoon soil moisture",
        ],
        risks: [
            "Total mortality if surface waterlogging exceeds 24-48 hours",
            "High humidity and cloudy weather promote Stemphylium blight (*Stemphylium botryosum*)",
        ],
    },

    chickpea: {
        id: "chickpea",
        nameEn: "Chickpea",
        nameBn: "ছোলা",
        family: "Fabaceae",
        suitableSeasons: ["Rabi"],
        durationDays: { min: 105, max: 120, average: 112 },
        plantingWindow: {
            Rabi: { startMonth: 11, startDay: 1, endMonth: 11, endDay: 30, label: "November 01 – November 30" },
        },
        harvestingWindow: {
            Rabi: { startMonth: 3, startDay: 1, endMonth: 3, endDay: 31, label: "March 01 – March 31" },
        },
        waterRequirementMm: { min: 160, max: 250, average: 200 },
        waterNeedCategory: "LOW",
        temperatureRangeC: { min: 10, max: 28, optimalMin: 16, optimalMax: 24 },
        soilMoistureTolerance: {
            minVolumetric: 0.15,
            maxVolumetric: 0.50,
            waterloggingTolerance: "LOW",
            droughtTolerance: "HIGH",
        },
        soilTypePreference: ["Clay Loam", "Loam", "Barind Clay"],
        nutrientImpact: "RESTORES_NITROGEN",
        rootDepth: "DEEP",
        biomassContribution: "MEDIUM",
        compatibleSuccessors: ["jute", "rice_aus", "rice_aman"],
        incompatibleSuccessors: ["chickpea", "lentils"],
        agronomicBenefits: [
            "Exceptional deep taproot (>1 meter) accessing deep residual moisture in drought-prone zones",
            "Fixes 50 to 75 kg N/ha, radically improving soil health in Barind and High Ganges tracts",
            "Nutritious protein crop with stable market price",
        ],
        risks: [
            "Cannot tolerate stagnant water; soil must have adequate internal drainage",
            "Botrytis gray mold during warm humid flowering intervals",
        ],
    },

    mustard: {
        id: "mustard",
        nameEn: "Mustard",
        nameBn: "সরিষা",
        family: "Brassicaceae",
        suitableSeasons: ["Rabi"],
        durationDays: { min: 72, max: 85, average: 78 },
        plantingWindow: {
            Rabi: { startMonth: 10, startDay: 20, endMonth: 11, endDay: 20, label: "October 20 – November 20" },
        },
        harvestingWindow: {
            Rabi: { startMonth: 1, startDay: 10, endMonth: 2, endDay: 15, label: "January 10 – February 15" },
        },
        waterRequirementMm: { min: 180, max: 260, average: 220 },
        waterNeedCategory: "LOW",
        temperatureRangeC: { min: 10, max: 25, optimalMin: 15, optimalMax: 22 },
        soilMoistureTolerance: {
            minVolumetric: 0.18,
            maxVolumetric: 0.60,
            waterloggingTolerance: "LOW",
            droughtTolerance: "MODERATE",
        },
        soilTypePreference: ["Loam", "Sandy Loam", "Clay Loam"],
        nutrientImpact: "LIGHT_FEEDER",
        rootDepth: "MEDIUM",
        biomassContribution: "LOW",
        compatibleSuccessors: ["rice_boro", "rice_aus", "jute", "vegetables"],
        incompatibleSuccessors: ["mustard"],
        agronomicBenefits: [
            "Ultra-short duration (75-80 days) fits perfectly into T. Aman — Mustard — Boro triple cropping",
            "Root glucosinolates release natural biofumigants that suppress soil nematodes and fungi",
            "Vital domestic edible oilseed with high farmgate cash value",
        ],
        risks: [
            "Aphid infestation during flowering if daytime temperatures rise rapidly",
            "Foggy humid spells cause Alternaria blight",
        ],
    },

    vegetables: {
        id: "vegetables",
        nameEn: "Vegetables",
        nameBn: "সবজি",
        family: "Diverse",
        suitableSeasons: ["Rabi", "Kharif-I", "Kharif-II"],
        durationDays: { min: 65, max: 85, average: 75 },
        plantingWindow: {
            Rabi: { startMonth: 10, startDay: 15, endMonth: 11, endDay: 30, label: "October 15 – November 30" },
            "Kharif-I": { startMonth: 3, startDay: 1, endMonth: 4, endDay: 15, label: "March 01 – April 15" },
            "Kharif-II": { startMonth: 7, startDay: 1, endMonth: 8, endDay: 15, label: "July 01 – August 15" },
        },
        harvestingWindow: {
            Rabi: { startMonth: 12, startDay: 20, endMonth: 2, endDay: 15, label: "December 20 – February 15" },
            "Kharif-I": { startMonth: 5, startDay: 1, endMonth: 6, endDay: 15, label: "May 01 – June 15" },
            "Kharif-II": { startMonth: 9, startDay: 15, endMonth: 10, endDay: 30, label: "September 15 – October 30" },
        },
        waterRequirementMm: { min: 250, max: 400, average: 320 },
        waterNeedCategory: "MODERATE",
        temperatureRangeC: { min: 14, max: 34, optimalMin: 18, optimalMax: 28 },
        soilMoistureTolerance: {
            minVolumetric: 0.20,
            maxVolumetric: 0.70,
            waterloggingTolerance: "LOW",
            droughtTolerance: "LOW",
        },
        soilTypePreference: ["Sandy Loam", "Loam", "Rich Alluvial"],
        nutrientImpact: "LIGHT_FEEDER",
        rootDepth: "SHALLOW",
        biomassContribution: "LOW",
        compatibleSuccessors: ["rice_aman", "rice_aus", "wheat", "jute"],
        incompatibleSuccessors: [],
        agronomicBenefits: [
            "Quick cash turnover and continuous household nutrition",
            "High labor productivity and flexible gap filler in annual rotations",
        ],
        risks: [
            "High perishability and price volatility without cold storage access",
            "High susceptibility to unexpected torrential downpours causing damping-off",
        ],
    },
};

/**
 * Standard mapping aliases for fuzzy user input
 */
export const CROP_INPUT_ALIASES: Record<string, string> = {
    // English
    rice: "rice_aman",
    "rice (aman)": "rice_aman",
    "t. aman": "rice_aman",
    "t.aman": "rice_aman",
    "aman rice": "rice_aman",
    "rice (boro)": "rice_boro",
    "boro rice": "rice_boro",
    boro: "rice_boro",
    "rice (aus)": "rice_aus",
    "aus rice": "rice_aus",
    aus: "rice_aus",
    jute: "jute",
    wheat: "wheat",
    potato: "potato",
    maize: "maize",
    corn: "maize",
    lentils: "lentils",
    lentil: "lentils",
    "lentils (mosur)": "lentils",
    chickpea: "chickpea",
    chickpeas: "chickpea",
    gram: "chickpea",
    chola: "chickpea",
    mustard: "mustard",
    sorisha: "mustard",
    vegetables: "vegetables",
    vegetable: "vegetables",
    veg: "vegetables",

    // Bengali
    "ধান": "rice_aman",
    "আমন ধান": "rice_aman",
    "রোপা আমন": "rice_aman",
    "বোরো ধান": "rice_boro",
    "বোরো": "rice_boro",
    "আউশ ধান": "rice_aus",
    "আউশ": "rice_aus",
    "পাট": "jute",
    "গম": "wheat",
    "আলু": "potato",
    "ভুট্টা": "maize",
    "মসুর": "lentils",
    "মসুর ডাল": "lentils",
    "ডাল": "lentils",
    "ছোলা": "chickpea",
    "সরিষা": "mustard",
    "সবজি": "vegetables",
    "শাকসবজি": "vegetables",
};

/**
 * Normalizes any crop query or Bengali name to standard crop ID
 */
export function normalizeCropName(name: string): string | null {
    if (!name) return null;
    const clean = name.trim().toLowerCase();
    if (SUPPORTED_CROPS[clean]) return clean;
    if (CROP_INPUT_ALIASES[clean]) return CROP_INPUT_ALIASES[clean];

    // Substring fuzzy matching
    for (const [key, targetId] of Object.entries(CROP_INPUT_ALIASES)) {
        if (clean.includes(key) || key.includes(clean)) {
            return targetId;
        }
    }
    return null;
}

/**
 * Default date range: 2 years back from current date
 */
export const DEFAULT_ANALYSIS_DATE_RANGE = {
    start: "20230101",
    end: "20241231",
};

/**
 * Standard transition time between crops (days for land tillage, bed preparation, transplanting)
 */
export const DEFAULT_TRANSITION_DAYS = 14;
