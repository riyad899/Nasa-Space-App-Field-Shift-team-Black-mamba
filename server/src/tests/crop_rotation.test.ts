import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CropRotationService } from "../app/module/CropRotation/cropRotation.service.js";
import { normalizeCropName, SUPPORTED_CROPS } from "../app/module/CropRotation/cropRotation.constants.js";
import { validateCropSequence, aggregateEnvironmentalData } from "../app/module/CropRotation/cropRotation.utils.js";

describe("CropRotation Module Backend Test Suite", () => {
    // ─────────────────────────────────────────────────────────────────────────
    // 1. Crop Catalog & Name Normalization Tests
    // ─────────────────────────────────────────────────────────────────────────
    describe("Crop Catalog & Normalization", () => {
        it("should return the full catalog with all expected crops and properties", () => {
            const catalog = CropRotationService.getSupportedCropsCatalog();
            assert.ok(catalog.length >= 9, "Catalog should have at least 9 major crops");

            const cropIds = catalog.map((c) => c.id);
            assert.ok(cropIds.includes("rice_aman"));
            assert.ok(cropIds.includes("jute"));
            assert.ok(cropIds.includes("wheat"));
            assert.ok(cropIds.includes("potato"));
            assert.ok(cropIds.includes("lentils"));
            assert.ok(cropIds.includes("mustard"));
            assert.ok(cropIds.includes("chickpea"));

            for (const item of catalog) {
                assert.ok(item.nameEn);
                assert.ok(item.nameBn);
                assert.ok(item.family);
                assert.ok(item.suitableSeasons.length > 0);
                assert.ok(item.waterRequirementMm.average > 0);
                assert.ok(item.agronomicBenefits.length > 0);
            }
        });

        it("should normalize both English and Bengali crop inputs correctly", () => {
            assert.equal(normalizeCropName("Rice"), "rice_aman");
            assert.equal(normalizeCropName("ধান"), "rice_aman");
            assert.equal(normalizeCropName("রোপা আমন"), "rice_aman");
            assert.equal(normalizeCropName("Jute"), "jute");
            assert.equal(normalizeCropName("পাট"), "jute");
            assert.equal(normalizeCropName("Potato"), "potato");
            assert.equal(normalizeCropName("আলু"), "potato");
            assert.equal(normalizeCropName("Wheat"), "wheat");
            assert.equal(normalizeCropName("গম"), "wheat");
            assert.equal(normalizeCropName("Lentils"), "lentils");
            assert.equal(normalizeCropName("মসুর ডাল"), "lentils");
            assert.equal(normalizeCropName("Mustard"), "mustard");
            assert.equal(normalizeCropName("সরিষা"), "mustard");
            assert.equal(normalizeCropName("Chickpea"), "chickpea");
            assert.equal(normalizeCropName("ছোলা"), "chickpea");
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // 2. Crop Compatibility & Agronomic Sequence Validation
    // ─────────────────────────────────────────────────────────────────────────
    describe("Crop Compatibility & Agronomic Rules", () => {
        it("should flag critical disease risk when rotating Solanaceae consecutively (Potato -> Potato)", () => {
            const result = validateCropSequence("Potato", ["Potato", "Jute"]);
            assert.equal(result.isValid, false, "Consecutive Solanaceae should invalidate sequence");
            assert.ok(result.errors.length > 0);
            assert.ok(result.compatibilityIssues.some((i) => i.severity === "CRITICAL" && i.issue.includes("Late Blight")));
        });

        it("should warn on monoculture heavy feeder repetition (Rice -> Rice)", () => {
            const result = validateCropSequence("rice_aman", ["rice_aman", "wheat"]);
            assert.ok(result.warnings.some((w) => w.includes("monoculture") || w.includes("depletes")));
        });

        it("should identify positive biological nitrogen handoff following legumes", () => {
            const result = validateCropSequence("Lentils", ["Jute", "Rice"]);
            assert.equal(result.isValid, true);
            assert.ok(result.compatibilityIssues.some((i) => i.severity === "INFO" && i.issue.includes("nitrogen")));
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // 3. Environmental Aggregation Engine
    // ─────────────────────────────────────────────────────────────────────────
    describe("Environmental Aggregation Engine", () => {
        it("should accurately aggregate 2-year temperature, precipitation, and soil moisture metrics", () => {
            const mockNasaPower = [
                { date: "20230101", temperatureMean: 16.5, precipitation: 0 },
                { date: "20230615", temperatureMean: 36.2, precipitation: 32.5 },
                { date: "20231215", temperatureMean: 11.0, precipitation: 0 },
            ];
            const mockImerg = [
                { date: "20230101", meanRainfall: 0, isRainy: false, isHeavyRain: false },
                { date: "20230615", meanRainfall: 32.5, isRainy: true, isHeavyRain: true },
                { date: "20230720", meanRainfall: 15.0, isRainy: true, isHeavyRain: false },
            ];
            const mockSmap = [
                { date: "20230101", surfaceSm: 0.18, rootzoneSm: 0.22 },
                { date: "20230615", surfaceSm: 0.72, rootzoneSm: 0.65 },
                { date: "20230720", surfaceSm: 0.45, rootzoneSm: 0.48 },
            ];

            const { summary, coverage } = aggregateEnvironmentalData(
                mockNasaPower,
                mockImerg,
                mockSmap,
                3
            );

            assert.equal(summary.temperature.extremeHeatDays, 1);
            assert.equal(summary.temperature.frostOrColdStressDays, 1);
            assert.ok(summary.rainfall.totalRainfallMm > 40);
            assert.equal(summary.rainfall.heavyRainfallDays, 1);
            assert.equal(summary.soilMoisture.dryStressDays, 1);
            assert.equal(summary.soilMoisture.waterloggedDays, 1);
            assert.equal(coverage.isSufficient, true);
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // 4. Recommendation Engine with 3 Alternative Plans
    // ─────────────────────────────────────────────────────────────────────────
    describe("Crop Rotation Recommendation Engine", () => {
        it("should generate Plan A (Farmer Priority), Plan B (Soil Health), and Plan C (Climate Adaptation)", async () => {
            const analysis = await CropRotationService.analyzeCropRotation({
                district: "Rajshahi",
                preferredCrops: [
                    { crop: "Rice", priority: 1 },
                    { crop: "Potato", priority: 2 },
                    { crop: "Jute", priority: 3 },
                ],
                lastCultivatedCrop: "Rice (T. Aman)",
                analysisDateRange: {
                    start: "20230101",
                    end: "20241231",
                },
            });

            assert.ok(analysis.location.district === "Rajshahi");
            assert.ok(analysis.analysisPeriod.days === 731);
            assert.ok(analysis.plans.planA, "Plan A should exist");
            assert.ok(analysis.plans.planB, "Plan B should exist");
            assert.ok(analysis.plans.planC, "Plan C should exist");

            // Plan A assertions: Farmer Priority
            assert.equal(analysis.plans.planA.planId, "plan_a_farmer_priority");
            assert.ok(analysis.plans.planA.schedule.length === 3, "Plan A should cover 3 seasonal slots (Rabi, Kharif-I, Kharif-II)");
            assert.ok(analysis.plans.planA.metrics.farmerPreferenceFulfillmentPct >= 66);

            // Plan B assertions: Soil Health (must include legume or deep-taproot)
            assert.equal(analysis.plans.planB.planId, "plan_b_soil_health");
            assert.equal(analysis.plans.planB.metrics.legumeInclusion, true, "Plan B must enforce legume inclusion for N-fixation");
            assert.equal(analysis.plans.planB.metrics.soilNutrientBalance, "POSITIVE_REGENERATIVE");

            // Plan C assertions: Climate & Water Adaptation
            assert.equal(analysis.plans.planC.planId, "plan_c_climate_water");
            assert.equal(analysis.plans.planC.metrics.waterStressIndex, "LOW");

            // Planting & harvesting schedule verification
            for (const plan of [analysis.plans.planA, analysis.plans.planB, analysis.plans.planC]) {
                for (const item of plan.schedule) {
                    assert.ok(item.sequenceNumber >= 1 && item.sequenceNumber <= 3);
                    assert.ok(item.cropNameEn);
                    assert.ok(item.cropNameBn);
                    assert.ok(item.plantingWindow);
                    assert.ok(item.harvestingWindow);
                    assert.ok(item.growingDurationDays > 60);
                    assert.ok(item.transitionPeriodDays > 0);
                    assert.ok(item.waterConsiderations);
                    assert.ok(item.soilConsiderations);
                    assert.ok(item.reasonForSelection);
                }
            }
        });

        it("should respect excluded crops and document clear rationale with alternatives", async () => {
            const analysis = await CropRotationService.analyzeCropRotation({
                district: "Rangpur",
                preferredCrops: ["Rice", "Potato", "Jute"],
                excludedCrops: ["Potato"], // Farmer explicitly excludes potato
            });

            assert.ok(
                analysis.excludedCropsExplanation.some((e) => e.crop === "Potato" && e.suggestedAlternative),
                "Potato exclusion should have an explanation and suggested alternative"
            );

            // Neither Plan A nor Plan B should contain potato
            assert.ok(!analysis.plans.planA.schedule.some((s) => s.cropId === "potato"));
            assert.ok(!analysis.plans.planB.schedule.some((s) => s.cropId === "potato"));
        });

        it("should exclude lastCultivatedCrop so it is not suggested again in the rotation", async () => {
            const analysis = await CropRotationService.analyzeCropRotation({
                district: "Rajshahi",
                preferredCrops: ["Wheat", "Potato", "Jute"],
                lastCultivatedCrop: "Wheat", // Previous crop was Wheat
            });

            // Wheat must be documented in excluded crops explanation
            assert.ok(
                analysis.excludedCropsExplanation.some((e) => e.crop === "Wheat" && e.reason.includes("last cultivated crop")),
                "Last cultivated crop should be documented in excluded list"
            );

            // None of the plans should suggest wheat again
            assert.ok(!analysis.plans.planA.schedule.some((s) => s.cropId === "wheat"), "Plan A must not suggest wheat");
            assert.ok(!analysis.plans.planB.schedule.some((s) => s.cropId === "wheat"), "Plan B must not suggest wheat");
            assert.ok(!analysis.plans.planC.schedule.some((s) => s.cropId === "wheat"), "Plan C must not suggest wheat");
        });

        it("should handle missing soil info and fallback gracefully", async () => {
            const analysis = await CropRotationService.analyzeCropRotation({
                district: "Mymensingh",
                preferredCrops: ["Mustard", "Jute", "Rice"],
                // soilType and drainage intentionally omitted
            });

            assert.ok(analysis.farmerInputs.soilType);
            assert.ok(analysis.plans.planA.schedule.length === 3);
            assert.ok(analysis.confidenceScore > 75);
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // 5. Health Check
    // ─────────────────────────────────────────────────────────────────────────
    describe("Module Health", () => {
        it("should report operational status and connected dependencies", () => {
            const health = CropRotationService.getHealthStatus();
            assert.equal(health.status, "UP");
            assert.equal(health.module, "CropRotation");
            assert.ok(health.reusedModules.includes("NasaPower"));
            assert.ok(health.reusedModules.includes("IMERG"));
            assert.ok(health.reusedModules.includes("SMAP"));
            assert.equal(health.supportedDistrictsCount, 18);
        });
    });
});
