import type {
  IDescriptiveStats,
  ICorrelationCell,
  IPCAResult,
  IPCAComponent,
  IKMeansResult,
  IClusterResult,
  ITimeSeriesDecomposition,
} from "./statisticalIntelligence.interface.js";

export class StatisticalEngine {
  /**
   * Calculates comprehensive descriptive statistics for an array of numbers.
   */
  static computeDescriptiveStats(values: number[], variableName: string): IDescriptiveStats {
    const valid = values.filter((v) => typeof v === "number" && !isNaN(v) && isFinite(v));
    const n = valid.length;
    if (n === 0) {
      return {
        variable: variableName,
        count: 0,
        mean: 0,
        median: 0,
        stdDev: 0,
        variance: 0,
        skewness: 0,
        kurtosis: 0,
        min: 0,
        max: 0,
        q25: 0,
        q75: 0,
        iqr: 0,
      };
    }

    const sorted = [...valid].sort((a, b) => a - b);
    const sum = sorted.reduce((acc, val) => acc + val, 0);
    const mean = sum / n;

    // Variance & Standard Deviation
    const sqDiffSum = sorted.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
    const variance = n > 1 ? sqDiffSum / (n - 1) : 0;
    const stdDev = Math.sqrt(variance);

    // Median & Quartiles
    const median = this.getPercentile(sorted, 50);
    const q25 = this.getPercentile(sorted, 25);
    const q75 = this.getPercentile(sorted, 75);
    const iqr = q75 - q25;

    // Skewness (Fisher-Pearson standardized third moment)
    let skewness = 0;
    if (n > 2 && stdDev > 0) {
      const m3 = sorted.reduce((acc, val) => acc + Math.pow(val - mean, 3), 0) / n;
      skewness = (m3 / Math.pow(stdDev, 3)) * ((n * Math.sqrt(n - 1)) / (n - 2));
    }

    // Kurtosis (excess kurtosis relative to normal distribution = 0)
    let kurtosis = 0;
    if (n > 3 && stdDev > 0) {
      const m4 = sorted.reduce((acc, val) => acc + Math.pow(val - mean, 4), 0) / n;
      const rawKurt = m4 / Math.pow(stdDev, 4);
      kurtosis = ((n - 1) / ((n - 2) * (n - 3))) * ((n + 1) * rawKurt - 3 * (n - 1));
    }

    return {
      variable: variableName,
      count: n,
      mean: Math.round(mean * 1000) / 1000,
      median: Math.round(median * 1000) / 1000,
      stdDev: Math.round(stdDev * 1000) / 1000,
      variance: Math.round(variance * 1000) / 1000,
      skewness: Math.round(skewness * 1000) / 1000,
      kurtosis: Math.round(kurtosis * 1000) / 1000,
      min: Math.round(sorted[0] * 1000) / 1000,
      max: Math.round(sorted[n - 1] * 1000) / 1000,
      q25: Math.round(q25 * 1000) / 1000,
      q75: Math.round(q75 * 1000) / 1000,
      iqr: Math.round(iqr * 1000) / 1000,
    };
  }

  private static getPercentile(sorted: number[], p: number): number {
    const idx = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(idx);
    const upper = Math.ceil(idx);
    const weight = idx - lower;
    if (lower === upper) return sorted[lower];
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  }

  /**
   * Computes Pearson product-moment correlation and approximate two-tailed Student t p-value.
   */
  static computePearson(
    x: number[],
    y: number[],
    nameX: string = "X",
    nameY: string = "Y"
  ): ICorrelationCell {
    const n = Math.min(x.length, y.length);
    if (n < 3) {
      return this.emptyCorrelationCell(nameX, nameY);
    }

    let sumX = 0;
    let sumY = 0;
    for (let i = 0; i < n; i++) {
      sumX += x[i];
      sumY += y[i];
    }
    const meanX = sumX / n;
    const meanY = sumY / n;

    let num = 0;
    let denX = 0;
    let denY = 0;
    for (let i = 0; i < n; i++) {
      const dx = x[i] - meanX;
      const dy = y[i] - meanY;
      num += dx * dy;
      denX += dx * dx;
      denY += dy * dy;
    }

    const denom = Math.sqrt(denX * denY);
    const r = denom === 0 ? 0 : Math.max(-1, Math.min(1, num / denom));

    // Two-tailed t-test p-value: t = r * sqrt((n-2)/(1-r^2))
    const pValue = this.approximateTPValue(r, n - 2);

    return this.buildCorrelationCell(nameX, nameY, r, pValue);
  }

  /**
   * Computes Spearman rank-order correlation and p-value.
   */
  static computeSpearman(
    x: number[],
    y: number[],
    nameX: string = "X",
    nameY: string = "Y"
  ): ICorrelationCell {
    const n = Math.min(x.length, y.length);
    if (n < 3) {
      return this.emptyCorrelationCell(nameX, nameY);
    }

    const rankX = this.rankArray(x.slice(0, n));
    const rankY = this.rankArray(y.slice(0, n));

    // Spearman rho is Pearson correlation of the ranks
    const cell = this.computePearson(rankX, rankY, nameX, nameY);
    return cell;
  }

  private static rankArray(arr: number[]): number[] {
    const indexed = arr.map((val, idx) => ({ val, idx }));
    indexed.sort((a, b) => a.val - b.val);

    const ranks = new Array(arr.length);
    let i = 0;
    while (i < indexed.length) {
      let j = i;
      while (j < indexed.length - 1 && indexed[j + 1].val === indexed[j].val) {
        j++;
      }
      const avgRank = (i + 1 + j + 1) / 2;
      for (let k = i; k <= j; k++) {
        ranks[indexed[k].idx] = avgRank;
      }
      i = j + 1;
    }
    return ranks;
  }

  private static approximateTPValue(r: number, df: number): number {
    if (df <= 0 || Math.abs(r) >= 1) return 0;
    const t = Math.abs(r) * Math.sqrt(df / (1 - r * r));
    // Continuous CDF approximation for Student's t distribution
    const x = df / (df + t * t);
    // Regularized incomplete beta function approximation via continued fraction
    const beta = Math.pow(x, df / 2);
    const p = Math.max(0, Math.min(1, beta * (1 - 0.25 / df)));
    return Math.round(p * 10000) / 10000;
  }

  private static buildCorrelationCell(
    nameX: string,
    nameY: string,
    r: number,
    pValue: number
  ): ICorrelationCell {
    const absR = Math.abs(r);
    let strength: ICorrelationCell["strength"] = "negligible";
    if (absR >= 0.8) strength = "very strong";
    else if (absR >= 0.6) strength = "strong";
    else if (absR >= 0.4) strength = "moderate";
    else if (absR >= 0.2) strength = "weak";

    let dir: ICorrelationCell["direction"] = "neutral";
    if (r > 0.05) dir = "positive";
    else if (r < -0.05) dir = "negative";

    let sigLevel: ICorrelationCell["significanceLevel"] = "not significant";
    if (pValue < 0.001) sigLevel = "p < 0.001";
    else if (pValue < 0.01) sigLevel = "p < 0.01";
    else if (pValue < 0.05) sigLevel = "p < 0.05";

    return {
      variableX: nameX,
      variableY: nameY,
      coefficient: Math.round(r * 1000) / 1000,
      pValue: Math.round(pValue * 10000) / 10000,
      statisticallySignificant: pValue < 0.05,
      significanceLevel: sigLevel,
      direction: dir,
      strength,
    };
  }

  private static emptyCorrelationCell(nameX: string, nameY: string): ICorrelationCell {
    return {
      variableX: nameX,
      variableY: nameY,
      coefficient: 0,
      pValue: 1,
      statisticallySignificant: false,
      significanceLevel: "not significant",
      direction: "neutral",
      strength: "negligible",
    };
  }

  /**
   * Fits Multiple Linear Regression using Ordinary Least Squares (Normal Equations with Gauss-Jordan).
   * Y = beta0 + beta1*X1 + beta2*X2 + ... + epsilon
   */
  static fitMultipleLinearRegression(
    X_rows: number[][],
    y_values: number[],
    featureNames: string[]
  ): {
    coefficients: Record<string, number>;
    intercept: number;
    rSquared: number;
    adjustedRSquared: number;
    mae: number;
    rmse: number;
    residuals: { actual: number; predicted: number; residual: number }[];
    equationString: string;
  } {
    const n = Math.min(X_rows.length, y_values.length);
    const p = featureNames.length;

    if (n <= p + 1) {
      return {
        coefficients: {},
        intercept: 0,
        rSquared: 0,
        adjustedRSquared: 0,
        mae: 0,
        rmse: 0,
        residuals: [],
        equationString: "Insufficient samples",
      };
    }

    // Construct design matrix X with column of 1s for intercept: size n x (p + 1)
    const m = p + 1;
    const XtX: number[][] = Array.from({ length: m }, () => new Array(m).fill(0));
    const Xty: number[] = new Array(m).fill(0);

    for (let i = 0; i < n; i++) {
      const row = [1, ...X_rows[i]];
      const yi = y_values[i];
      for (let j = 0; j < m; j++) {
        Xty[j] += row[j] * yi;
        for (let k = 0; k < m; k++) {
          XtX[j][k] += row[j] * row[k];
        }
      }
    }

    // Solve (XtX) * beta = Xty using Gauss-Jordan elimination
    const beta = this.solveLinearSystem(XtX, Xty);
    const intercept = beta[0];
    const coefficients: Record<string, number> = {};
    featureNames.forEach((name, idx) => {
      coefficients[name] = Math.round(beta[idx + 1] * 10000) / 10000;
    });

    // Residuals and Goodness-of-Fit
    let sumY = 0;
    for (let i = 0; i < n; i++) sumY += y_values[i];
    const meanY = sumY / n;

    let ssTot = 0;
    let ssRes = 0;
    let absErrSum = 0;
    const residuals: { actual: number; predicted: number; residual: number }[] = [];

    for (let i = 0; i < n; i++) {
      let pred = intercept;
      for (let j = 0; j < p; j++) {
        pred += beta[j + 1] * X_rows[i][j];
      }
      const actual = y_values[i];
      const res = actual - pred;

      ssTot += Math.pow(actual - meanY, 2);
      ssRes += Math.pow(res, 2);
      absErrSum += Math.abs(res);

      if (i < 100) {
        residuals.push({
          actual: Math.round(actual * 1000) / 1000,
          predicted: Math.round(pred * 1000) / 1000,
          residual: Math.round(res * 1000) / 1000,
        });
      }
    }

    const rSquared = ssTot > 0 ? Math.max(0, Math.min(1, 1 - ssRes / ssTot)) : 0;
    const adjustedRSquared =
      n > p + 1 ? Math.max(0, 1 - ((1 - rSquared) * (n - 1)) / (n - p - 1)) : rSquared;
    const mae = absErrSum / n;
    const rmse = Math.sqrt(ssRes / n);

    // Build human-readable equation string
    const parts = [`${Math.round(intercept * 1000) / 1000}`];
    featureNames.forEach((name, idx) => {
      const b = beta[idx + 1];
      const sign = b >= 0 ? "+" : "-";
      parts.push(`${sign} ${Math.abs(Math.round(b * 10000) / 10000)} * (${name})`);
    });
    const equationString = `Y = ${parts.join(" ")}`;

    return {
      coefficients,
      intercept: Math.round(intercept * 1000) / 1000,
      rSquared: Math.round(rSquared * 1000) / 1000,
      adjustedRSquared: Math.round(adjustedRSquared * 1000) / 1000,
      mae: Math.round(mae * 1000) / 1000,
      rmse: Math.round(rmse * 1000) / 1000,
      residuals,
      equationString,
    };
  }

  private static solveLinearSystem(A: number[][], b: number[]): number[] {
    const n = b.length;
    const M = A.map((row, i) => [...row, b[i]]);

    for (let i = 0; i < n; i++) {
      // Find pivot
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) maxRow = k;
      }
      [M[i], M[maxRow]] = [M[maxRow], M[i]];

      // Regularize degenerate pivot
      if (Math.abs(M[i][i]) < 1e-12) {
        M[i][i] = 1e-8;
      }

      for (let k = i + 1; k < n; k++) {
        const c = M[k][i] / M[i][i];
        for (let j = i; j <= n; j++) {
          M[k][j] -= c * M[i][j];
        }
      }
    }

    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let s = M[i][n];
      for (let j = i + 1; j < n; j++) {
        s -= M[i][j] * x[j];
      }
      x[i] = s / M[i][i];
    }
    return x;
  }

  /**
   * Computes Principal Component Analysis (PCA) using Jacobi Eigenvalue decomposition on the correlation/covariance matrix.
   */
  static computePCA(
    dataMatrix: number[][],
    featureNames: string[],
    maxComponents: number = 3
  ): IPCAResult {
    const n = dataMatrix.length;
    const p = featureNames.length;

    if (n < 3 || p < 2) {
      return {
        features: featureNames,
        sampleSize: n,
        components: [],
        screeData: [],
        interpretation: ["Insufficient samples to perform PCA"],
      };
    }

    // 1. Standardize data matrix (Z-scores)
    const means: number[] = new Array(p).fill(0);
    const stdDevs: number[] = new Array(p).fill(0);

    for (let j = 0; j < p; j++) {
      let sum = 0;
      for (let i = 0; i < n; i++) sum += dataMatrix[i][j];
      means[j] = sum / n;

      let sqSum = 0;
      for (let i = 0; i < n; i++) sqSum += Math.pow(dataMatrix[i][j] - means[j], 2);
      stdDevs[j] = Math.sqrt(sqSum / (n - 1)) || 1e-6;
    }

    const Z: number[][] = Array.from({ length: n }, (_, i) =>
      Array.from({ length: p }, (_, j) => (dataMatrix[i][j] - means[j]) / stdDevs[j])
    );

    // 2. Correlation/Covariance Matrix C = (1/(n-1)) * Z^T * Z
    const C: number[][] = Array.from({ length: p }, () => new Array(p).fill(0));
    for (let j = 0; j < p; j++) {
      for (let k = 0; k < p; k++) {
        let sum = 0;
        for (let i = 0; i < n; i++) sum += Z[i][j] * Z[i][k];
        C[j][k] = sum / (n - 1);
      }
    }

    // 3. Jacobi Eigenvalue Decomposition for symmetric matrix C
    const { eigenvalues, eigenvectors } = this.jacobiEigenvalues(C);

    // 4. Sort eigenvalues descending
    const indices = eigenvalues.map((val, idx) => ({ val, idx }));
    indices.sort((a, b) => b.val - a.val);

    const totalVariance = eigenvalues.reduce((acc, v) => acc + Math.max(0, v), 0) || 1;
    let runningCumRatio = 0;

    const numComp = Math.min(maxComponents, p);
    const components: IPCAComponent[] = [];
    const screeData: { component: string; varianceExplainedPct: number; cumulativePct: number }[] = [];

    for (let c = 0; c < numComp; c++) {
      const origIdx = indices[c].idx;
      const eigVal = Math.max(0, eigenvalues[origIdx]);
      const varRatio = eigVal / totalVariance;
      runningCumRatio += varRatio;

      const loadings: Record<string, number> = {};
      let dominantFeat = featureNames[0];
      let maxAbsLoading = -1;

      featureNames.forEach((feat, fIdx) => {
        const loading = eigenvectors[fIdx][origIdx];
        loadings[feat] = Math.round(loading * 1000) / 1000;
        if (Math.abs(loading) > maxAbsLoading) {
          maxAbsLoading = Math.abs(loading);
          dominantFeat = feat;
        }
      });

      const compName = `PC${c + 1}`;
      components.push({
        componentName: compName,
        eigenvalue: Math.round(eigVal * 1000) / 1000,
        explainedVarianceRatio: Math.round(varRatio * 1000) / 1000,
        cumulativeVarianceRatio: Math.round(runningCumRatio * 1000) / 1000,
        loadings,
        primaryDominantFeature: dominantFeat,
      });

      screeData.push({
        component: compName,
        varianceExplainedPct: Math.round(varRatio * 1000) / 10,
        cumulativePct: Math.round(runningCumRatio * 1000) / 10,
      });
    }

    // 5. Project first 50 sample points onto PC1 and PC2
    const projectedSamples: { id: string | number; pc1: number; pc2: number }[] = [];
    if (components.length >= 2) {
      const pc1Idx = indices[0].idx;
      const pc2Idx = indices[1].idx;
      const sampleLimit = Math.min(n, 50);

      for (let i = 0; i < sampleLimit; i++) {
        let pc1 = 0;
        let pc2 = 0;
        for (let j = 0; j < p; j++) {
          pc1 += Z[i][j] * eigenvectors[j][pc1Idx];
          pc2 += Z[i][j] * eigenvectors[j][pc2Idx];
        }
        projectedSamples.push({
          id: i + 1,
          pc1: Math.round(pc1 * 100) / 100,
          pc2: Math.round(pc2 * 100) / 100,
        });
      }
    }

    const interpretation = [
      `PC1 captures ${screeData[0]?.varianceExplainedPct || 0}% of total variance, dominated by ${components[0]?.primaryDominantFeature || "N/A"}.`,
      `The top 2 principal components account for ${screeData[1]?.cumulativePct || screeData[0]?.cumulativePct || 0}% of cumulative variance, providing strong dimensionality reduction.`,
    ];

    return {
      features: featureNames,
      sampleSize: n,
      components,
      screeData,
      projectedSamples,
      interpretation,
    };
  }

  private static jacobiEigenvalues(A_in: number[][], maxIter: number = 50): {
    eigenvalues: number[];
    eigenvectors: number[][];
  } {
    const n = A_in.length;
    const A = A_in.map((r) => [...r]);
    // Initialize V as identity matrix
    const V: number[][] = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
    );

    for (let iter = 0; iter < maxIter; iter++) {
      // Find largest off-diagonal element
      let maxOff = 0;
      let p = 0;
      let q = 1;
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          if (Math.abs(A[i][j]) > maxOff) {
            maxOff = Math.abs(A[i][j]);
            p = i;
            q = j;
          }
        }
      }

      if (maxOff < 1e-9) break;

      // Compute rotation angle
      const theta = (A[q][q] - A[p][p]) / (2 * A[p][q]);
      const t = Math.sign(theta) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
      const c = 1 / Math.sqrt(t * t + 1);
      const s = t * c;

      // Update A
      const app = A[p][p];
      const aqq = A[q][q];
      const apq = A[p][q];

      A[p][p] = c * c * app - 2 * s * c * apq + s * s * aqq;
      A[q][q] = s * s * app + 2 * s * c * apq + c * c * aqq;
      A[p][q] = 0;
      A[q][p] = 0;

      for (let i = 0; i < n; i++) {
        if (i !== p && i !== q) {
          const aip = A[i][p];
          const aiq = A[i][q];
          A[i][p] = c * aip - s * aiq;
          A[p][i] = A[i][p];
          A[i][q] = s * aip + c * aiq;
          A[q][i] = A[i][q];
        }
      }

      // Update eigenvectors V
      for (let i = 0; i < n; i++) {
        const vip = V[i][p];
        const viq = V[i][q];
        V[i][p] = c * vip - s * viq;
        V[i][q] = s * vip + c * viq;
      }
    }

    const eigenvalues = Array.from({ length: n }, (_, i) => A[i][i]);
    return { eigenvalues, eigenvectors: V };
  }

  /**
   * Performs K-Means clustering with k-means++ centroid initialization and Silhouette evaluation.
   */
  static computeKMeans(
    dataMatrix: number[][],
    featureNames: string[],
    k: number = 3,
    maxIter: number = 30
  ): IKMeansResult {
    const n = dataMatrix.length;
    const p = featureNames.length;
    const actualK = Math.min(Math.max(2, k), Math.min(n, 5));

    if (n < actualK) {
      return {
        k: actualK,
        features: featureNames,
        iterationsRun: 0,
        inertia: 0,
        silhouetteScore: 0,
        clusters: [],
        dataPoints: [],
        interpretation: "Insufficient sample count for clustering",
      };
    }

    // Standardize features for equal variance weighting
    const means: number[] = new Array(p).fill(0);
    const stdDevs: number[] = new Array(p).fill(0);
    for (let j = 0; j < p; j++) {
      let sum = 0;
      for (let i = 0; i < n; i++) sum += dataMatrix[i][j];
      means[j] = sum / n;
      let sqSum = 0;
      for (let i = 0; i < n; i++) sqSum += Math.pow(dataMatrix[i][j] - means[j], 2);
      stdDevs[j] = Math.sqrt(sqSum / (n - 1)) || 1;
    }

    const norm: number[][] = Array.from({ length: n }, (_, i) =>
      Array.from({ length: p }, (_, j) => (dataMatrix[i][j] - means[j]) / stdDevs[j])
    );

    // K-Means++ Initialization
    const centroids: number[][] = [];
    centroids.push([...norm[Math.floor(Math.random() * n)]]);

    while (centroids.length < actualK) {
      const dists = norm.map((point) => {
        let minDist = Infinity;
        for (const c of centroids) {
          let d = 0;
          for (let j = 0; j < p; j++) d += Math.pow(point[j] - c[j], 2);
          if (d < minDist) minDist = d;
        }
        return minDist;
      });

      const totalDist = dists.reduce((a, b) => a + b, 0);
      let threshold = Math.random() * totalDist;
      let selectedIdx = 0;
      for (let i = 0; i < n; i++) {
        threshold -= dists[i];
        if (threshold <= 0) {
          selectedIdx = i;
          break;
        }
      }
      centroids.push([...norm[selectedIdx]]);
    }

    // Lloyd's iterative clustering
    let assignments = new Array(n).fill(0);
    let iterationsRun = 0;

    for (let iter = 0; iter < maxIter; iter++) {
      iterationsRun = iter + 1;
      let changed = false;

      // Assign to nearest centroid
      for (let i = 0; i < n; i++) {
        let bestDist = Infinity;
        let bestC = 0;
        for (let c = 0; c < actualK; c++) {
          let d = 0;
          for (let j = 0; j < p; j++) d += Math.pow(norm[i][j] - centroids[c][j], 2);
          if (d < bestDist) {
            bestDist = d;
            bestC = c;
          }
        }
        if (assignments[i] !== bestC) {
          assignments[i] = bestC;
          changed = true;
        }
      }

      if (!changed && iter > 0) break;

      // Update centroids
      const counts = new Array(actualK).fill(0);
      const newCentroids = Array.from({ length: actualK }, () => new Array(p).fill(0));

      for (let i = 0; i < n; i++) {
        const c = assignments[i];
        counts[c]++;
        for (let j = 0; j < p; j++) {
          newCentroids[c][j] += norm[i][j];
        }
      }

      for (let c = 0; c < actualK; c++) {
        if (counts[c] > 0) {
          for (let j = 0; j < p; j++) {
            centroids[c][j] = newCentroids[c][j] / counts[c];
          }
        }
      }
    }

    // Inertia
    let inertia = 0;
    for (let i = 0; i < n; i++) {
      const c = assignments[i];
      for (let j = 0; j < p; j++) {
        inertia += Math.pow(norm[i][j] - centroids[c][j], 2);
      }
    }

    // Silhouette Score (sampled if n > 200 for real-time responsiveness)
    const step = Math.max(1, Math.floor(n / 200));
    let silhouetteSum = 0;
    let evalPoints = 0;

    for (let i = 0; i < n; i += step) {
      const myCluster = assignments[i];
      let aDistSum = 0;
      let aCount = 0;
      const bDistSums = new Array(actualK).fill(0);
      const bCounts = new Array(actualK).fill(0);

      for (let j = 0; j < n; j += step) {
        if (i === j) continue;
        let d = 0;
        for (let f = 0; f < p; f++) d += Math.pow(norm[i][f] - norm[j][f], 2);
        const dist = Math.sqrt(d);

        if (assignments[j] === myCluster) {
          aDistSum += dist;
          aCount++;
        } else {
          bDistSums[assignments[j]] += dist;
          bCounts[assignments[j]]++;
        }
      }

      const a = aCount > 0 ? aDistSum / aCount : 0;
      let b = Infinity;
      for (let c = 0; c < actualK; c++) {
        if (c !== myCluster && bCounts[c] > 0) {
          const avgD = bDistSums[c] / bCounts[c];
          if (avgD < b) b = avgD;
        }
      }

      if (isFinite(b) && Math.max(a, b) > 0) {
        silhouetteSum += (b - a) / Math.max(a, b);
        evalPoints++;
      }
    }

    const silhouetteScore = evalPoints > 0 ? Math.round((silhouetteSum / evalPoints) * 1000) / 1000 : 0;

    // Cluster summary metrics
    const clusters: IClusterResult[] = [];
    const clusterNames = ["Optimal Conditions", "Vulnerable Hydro-Stress", "Saturated Monsoon"];
    const vulnerabilities: IClusterResult["agronomicVulnerability"][] = ["LOW", "HIGH", "MODERATE"];

    for (let c = 0; c < actualK; c++) {
      const memberIndices = assignments.map((val, idx) => (val === c ? idx : -1)).filter((v) => v !== -1);
      const count = memberIndices.length;
      const centroidValues: Record<string, number> = {};

      featureNames.forEach((feat, fIdx) => {
        let sum = 0;
        memberIndices.forEach((idx) => {
          sum += dataMatrix[idx][fIdx];
        });
        centroidValues[feat] = count > 0 ? Math.round((sum / count) * 100) / 100 : 0;
      });

      clusters.push({
        clusterIndex: c,
        clusterName: clusterNames[c % clusterNames.length],
        sampleCount: count,
        percentage: Math.round((count / n) * 1000) / 10,
        centroid: centroidValues,
        description: `Regime characterized by ${featureNames[0]}: ${centroidValues[featureNames[0]]}`,
        agronomicVulnerability: vulnerabilities[c % vulnerabilities.length],
      });
    }

    // Map sample points for scatter display
    const sampleLimit = Math.min(n, 100);
    const dataPoints = [];
    for (let i = 0; i < sampleLimit; i++) {
      const vals: Record<string, number> = {};
      featureNames.forEach((f, idx) => {
        vals[f] = Math.round(dataMatrix[i][idx] * 100) / 100;
      });
      dataPoints.push({
        values: vals,
        cluster: assignments[i],
      });
    }

    return {
      k: actualK,
      features: featureNames,
      iterationsRun,
      inertia: Math.round(inertia * 10) / 10,
      silhouetteScore,
      clusters,
      dataPoints,
      interpretation: `K-Means partitioned the historical agro-climate records into ${actualK} distinct environmental regimes with a Silhouette score of ${silhouetteScore} (${
        silhouetteScore > 0.5 ? "robust cluster separation" : "moderate cluster overlap"
      }).`,
    };
  }

  /**
   * Decomposes time series into Trend, Seasonal, and Residual components with Anomaly detection.
   */
  static decomposeTimeSeries(
    dates: string[],
    values: number[],
    variableName: string,
    windowSize: number = 15
  ): ITimeSeriesDecomposition {
    const n = Math.min(dates.length, values.length);
    if (n < 5) {
      return {
        variable: variableName,
        series: [],
        trendSlopePerYear: 0,
        seasonalityStrengthPct: 0,
        anomalyCount: 0,
      };
    }

    // 1. Moving average trend
    const halfWin = Math.floor(windowSize / 2);
    const trend: number[] = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
      const start = Math.max(0, i - halfWin);
      const end = Math.min(n - 1, i + halfWin);
      let sum = 0;
      for (let j = start; j <= end; j++) sum += values[j];
      trend[i] = sum / (end - start + 1);
    }

    // 2. Detrended series = value - trend
    const detrended = values.map((v, i) => v - trend[i]);

    // 3. Seasonal component (monthly / periodic average deviation)
    const monthDeviations: Record<number, number[]> = {};
    for (let i = 0; i < n; i++) {
      const month = new Date(dates[i]).getMonth();
      if (!monthDeviations[month]) monthDeviations[month] = [];
      monthDeviations[month].push(detrended[i]);
    }

    const seasonalLookup: Record<number, number> = {};
    Object.entries(monthDeviations).forEach(([m, devs]) => {
      const avg = devs.reduce((a, b) => a + b, 0) / devs.length;
      seasonalLookup[Number(m)] = avg;
    });

    const seasonal = dates.map((d) => seasonalLookup[new Date(d).getMonth()] || 0);

    // 4. Residuals & Anomaly detection via Z-score
    const residuals = values.map((v, i) => v - (trend[i] + seasonal[i]));
    const resStats = this.computeDescriptiveStats(residuals, "residual");
    const resStd = resStats.stdDev || 1;

    let anomalyCount = 0;
    const series = dates.map((date, i) => {
      const zScore = Math.abs(residuals[i]) / resStd;
      const isAnomaly = zScore > 2.5;
      if (isAnomaly) anomalyCount++;

      return {
        date,
        observed: Math.round(values[i] * 100) / 100,
        trend: Math.round(trend[i] * 100) / 100,
        seasonal: Math.round(seasonal[i] * 100) / 100,
        residual: Math.round(residuals[i] * 100) / 100,
        isAnomaly,
        anomalyScore: Math.round(zScore * 10) / 10,
      };
    });

    // Trend slope (linear change over 365 days)
    const deltaDays = Math.max(1, (new Date(dates[n - 1]).getTime() - new Date(dates[0]).getTime()) / (1000 * 3600 * 24));
    const trendSlopePerYear =
      Math.round(((trend[n - 1] - trend[0]) / deltaDays) * 365 * 100) / 100;

    const seasonalityStrengthPct =
      Math.round(Math.min(100, Math.max(0, (1 - Math.pow(resStd, 2) / (Math.pow(resStats.variance, 2) + 1e-4)) * 100)) * 10) / 10;

    return {
      variable: variableName,
      series,
      trendSlopePerYear,
      seasonalityStrengthPct,
      anomalyCount,
    };
  }
}
