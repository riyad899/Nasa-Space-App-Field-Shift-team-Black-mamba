export interface IDescriptiveStats {
  variable: string;
  count: number;
  mean: number;
  median: number;
  stdDev: number;
  variance: number;
  skewness: number;
  kurtosis: number;
  min: number;
  max: number;
  q25: number;
  q75: number;
  iqr: number;
}

export interface ICorrelationCell {
  variableX: string;
  variableY: string;
  coefficient: number; // Pearson r or Spearman rho
  pValue: number;
  statisticallySignificant: boolean; // p < 0.05
  significanceLevel: "p < 0.001" | "p < 0.01" | "p < 0.05" | "not significant";
  direction: "positive" | "negative" | "neutral";
  strength: "very strong" | "strong" | "moderate" | "weak" | "negligible";
}

export interface ICorrelationMatrixResult {
  method: "pearson" | "spearman";
  variables: string[];
  matrix: ICorrelationCell[][];
  summaryInsights: string[];
}

export interface IRegressionModelResult {
  targetVariable: string;
  predictorVariables: string[];
  coefficients: Record<string, number>;
  intercept: number;
  rSquared: number;
  adjustedRSquared: number;
  mae: number;
  rmse: number;
  fStatistic?: number;
  pValue?: number;
  sampleCount: number;
  residuals: { date: string; actual: number; predicted: number; residual: number }[];
  equationString: string;
  interpretation: string;
}

export interface ITimeSeriesDecomposition {
  variable: string;
  series: {
    date: string;
    observed: number;
    trend: number;
    seasonal: number;
    residual: number;
    isAnomaly: boolean;
    anomalyScore?: number;
  }[];
  trendSlopePerYear: number;
  seasonalityStrengthPct: number;
  anomalyCount: number;
}

export interface IPCAComponent {
  componentName: string; // PC1, PC2, etc.
  eigenvalue: number;
  explainedVarianceRatio: number; // 0.0 - 1.0
  cumulativeVarianceRatio: number;
  loadings: Record<string, number>;
  primaryDominantFeature: string;
}

export interface IPCAResult {
  features: string[];
  sampleSize: number;
  components: IPCAComponent[];
  screeData: { component: string; varianceExplainedPct: number; cumulativePct: number }[];
  projectedSamples?: { id: string | number; pc1: number; pc2: number; label?: string }[];
  interpretation: string[];
}

export interface IClusterResult {
  clusterIndex: number;
  clusterName: string;
  sampleCount: number;
  percentage: number;
  centroid: Record<string, number>;
  description: string;
  agronomicVulnerability: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
}

export interface IKMeansResult {
  k: number;
  features: string[];
  iterationsRun: number;
  inertia: number;
  silhouetteScore: number;
  clusters: IClusterResult[];
  dataPoints: {
    date?: string;
    district?: string;
    values: Record<string, number>;
    cluster: number;
  }[];
  interpretation: string;
}

export interface IMethodComparisonRow {
  methodId: string;
  methodName: string;
  category: "Correlation" | "Regression" | "Dimensionality Reduction" | "Unsupervised Clustering" | "Descriptive";
  primaryQuestionAnswered: string;
  mathematicalBasis: string;
  sampleCountUsed: number;
  goodnessOfFitOrMetric: string;
  keyFinding: string;
  statisticalAssumptions: string[];
  limitationsAndUncertainty: string[];
  suitabilityScore: number; // 0-100 rating for this dataset
}

export interface IStatisticalOverviewResponse {
  district: string;
  dateRange: { from: string; to: string; totalDays: number };
  descriptiveStats: IDescriptiveStats[];
  pearsonMatrix: ICorrelationMatrixResult;
  spearmanMatrix: ICorrelationMatrixResult;
  linearRegressionNDVI: IRegressionModelResult; // NDVI as function of Soil Moisture & Precip
  soilPca: IPCAResult;
  kmeansClustering: IKMeansResult;
  timeSeriesDecomposition: ITimeSeriesDecomposition;
  methodComparisonMatrix: IMethodComparisonRow[];
  agronomicSynthesis: {
    hydroDeficitDeductions: string[];
    soilBufferingInsights: string[];
    vulnerabilityLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
    recommendations: string[];
  };
}
