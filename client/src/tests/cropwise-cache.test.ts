import assert from "node:assert/strict";
import {
  CROPWISE_AI_STALE_TIME,
  CROPWISE_AI_GC_TIME,
  isCropWiseAiQueryKey,
  restoreCropWiseAiCache,
} from "../lib/cropwise-cache-persister";
import {
  createQueryClient,
  cropwiseQueryKeys,
  cropwiseQueryOptions,
} from "../lib/query-client";

console.log("==================================================");
console.log("🧪 Testing CropWise AI 20-Minute Cache & Isolation");
console.log("==================================================");

// 1. Test Query Options & Isolation
assert.equal(CROPWISE_AI_STALE_TIME, 20 * 60 * 1000, "CropWise staleTime must be exactly 20 minutes");
assert.equal(CROPWISE_AI_GC_TIME, 30 * 60 * 1000, "CropWise gcTime must be 30 minutes");
assert.equal(cropwiseQueryOptions.staleTime, 20 * 60 * 1000);

const testClient = createQueryClient();
assert.equal(
  testClient.getDefaultOptions().queries?.staleTime,
  0,
  "Default queries must have normal standard staleTime (0), NOT 20 minutes"
);
console.log("✅ Verified: 20-minute policy applies ONLY to CropWise AI, not globally.");

// 2. Test Query Key Identification
const validAnalysisKey = cropwiseQueryKeys.analysis("Dhaka", "Aman Rice", "rainfed");
const validTransparencyKey = cropwiseQueryKeys.transparency("aman_123");
const unrelatedUserKey = ["user-analysis-history", "guest"];
const unrelatedDeviceKey = ["device-telemetry", "dev_1"];

assert.equal(isCropWiseAiQueryKey(validAnalysisKey), true, "CropWise analysis key should match");
assert.equal(isCropWiseAiQueryKey(validTransparencyKey), true, "CropWise transparency key should match");
assert.equal(isCropWiseAiQueryKey(unrelatedUserKey), false, "User history must NOT match CropWise special cache");
assert.equal(isCropWiseAiQueryKey(unrelatedDeviceKey), false, "Device telemetry must NOT match CropWise special cache");
console.log("✅ Verified: Query keys properly isolate CropWise AI data from all other queries.");

// 3. Test Browser Storage Expiration (Mocking localStorage)
const mockStorage = new Map<string, string>();
(global as any).window = {
  localStorage: {
    getItem: (key: string) => mockStorage.get(key) || null,
    setItem: (key: string, value: string) => mockStorage.set(key, value),
    removeItem: (key: string) => mockStorage.delete(key),
  },
};

const now = Date.now();
const testData = [
  // Fresh CropWise entry (10 mins old) -> SHOULD RESTORE
  {
    queryKey: cropwiseQueryKeys.analysis("rajshahi", "aman_rice", "rainfed"),
    data: { analysisId: "aman_fresh_1", shiftDays: 5 },
    timestamp: now - 10 * 60 * 1000,
  },
  // Expired CropWise entry (25 mins old) -> MUST DISCARD
  {
    queryKey: cropwiseQueryKeys.analysis("mymensingh", "aman_rice", "rainfed"),
    data: { analysisId: "aman_expired_2", shiftDays: -3 },
    timestamp: now - 25 * 60 * 1000,
  },
  // Unrelated query (should never be restored)
  {
    queryKey: ["unrelated-settings"],
    data: { theme: "dark" },
    timestamp: now - 2 * 60 * 1000,
  },
];

mockStorage.set("cropwise-ai:browser-cache-v1", JSON.stringify(testData));

const restoreClient = createQueryClient();
restoreCropWiseAiCache(restoreClient);

// Verify fresh entry was restored
const restoredFresh = restoreClient.getQueryData(cropwiseQueryKeys.analysis("rajshahi", "aman_rice", "rainfed"));
assert.ok(restoredFresh, "Fresh (10m) CropWise entry must be restored");
assert.equal((restoredFresh as any).analysisId, "aman_fresh_1");

// Verify expired entry was NOT restored
const restoredExpired = restoreClient.getQueryData(cropwiseQueryKeys.analysis("mymensingh", "aman_rice", "rainfed"));
assert.equal(restoredExpired, undefined, "Expired (>20m) CropWise entry must NOT be restored");

// Verify unrelated entry was NOT restored
const restoredUnrelated = restoreClient.getQueryData(["unrelated-settings"]);
assert.equal(restoredUnrelated, undefined, "Unrelated query must NOT be restored");

console.log("✅ Verified: Restores only valid CropWise AI data (<20m); expired and unrelated data are discarded.");

console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY!");
