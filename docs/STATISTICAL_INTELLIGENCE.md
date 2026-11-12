# 📊 Statistical Intelligence & Modeling

[← Back to Main README](../README.md)

---

CropWise AI moves beyond raw indicators by applying rigorous statistical methodologies and machine learning models to identify agronomic relationships, predict environmental trends, and cluster vulnerability zones.

---

## 📈 Methodologies & Models

### 1. Descriptive Statistics
Provides baseline distribution metrics for all continuous environmental parameters:
- **Central Tendency:** Mean, Median, Mode
- **Dispersion:** Standard Deviation, Variance, Interquartile Range (IQR)
- **Shape Metrics:** Skewness (asymmetry), Kurtosis (tail heaviness)
- **Extremes:** Minimum, Maximum, Percentile cuts (P10, P25, P75, P90)

### 2. Bivariate Correlation Analysis
- **Pearson Product-Moment Correlation ($r$):**
  Identifies linear associations between continuous variables (e.g., surface temperature vs. NDVI, precipitation vs. soil moisture).
- **Spearman Rank-Order Correlation ($\rho$):**
  Detects non-linear, monotonic relationships resilient to outliers (e.g., Water Deficit Index vs. vegetation stress).

### 3. Ordinary Least Squares (OLS) Multiple Regression
Quantifies the influence of environmental drivers on target vegetation or moisture indicators.

```text
Target:
NDVI

Predictors:
Surface Temperature (LST), Precipitation, Soil Moisture

Equation:
NDVI = β₀ + β₁(Temperature) + β₂(Precipitation) + β₃(Soil Moisture) + ε
```

**Evaluation Diagnostics:**
- Coefficient of Determination ($R^2$ and Adjusted $R^2$)
- Mean Absolute Error (MAE) & Root Mean Squared Error (RMSE)
- Variance Inflation Factor (VIF) for multicollinearity screening
- Residual normality and homoscedasticity checks

### 4. Principal Component Analysis (PCA)
Reduces the high dimensionality of interconnected soil and environmental variables into orthogonal components.
- Uncovers the dominant axes of variance across districts.
- Eliminates collinearity before feeding into downstream classifiers.
- Evaluated via cumulative explained variance ratio (scree plot analysis).

### 5. K-Means Clustering
Segments regions into distinct agro-ecological clusters based on multivariable environmental profiles:
- **Optimization:** Silhouette score maximization and elbow method (inertia minimization).
- **Application:** Grouping districts facing similar drought, flood, or thermal risks to apply uniform intervention strategies.

### 6. Time-Series Decomposition & Anomaly Detection
- Evaluates seasonality, secular trends, and cyclical patterns across the historical records.
- Flags significant anomalies using modified Z-score methods and rolling standard deviations.

---

## 📑 Model Evaluation Matrix

| Method | Primary Purpose | Evaluation Metric | Key Assumptions |
| :--- | :--- | :--- | :--- |
| **Descriptive Stats** | Data distribution & spread | Mean, Std, IQR, Skew | Sample representativeness |
| **Pearson Correlation** | Linear association | Correlation $r$, $p$-value | Bivariate normality, linearity |
| **Spearman Correlation** | Monotonic relationship | Rank correlation $\rho$, $p$-value | Monotonic function |
| **OLS Regression** | Predictive modeling | $R^2$, Adj $R^2$, RMSE, MAE | Homoscedasticity, no multicollinearity |
| **PCA** | Dimensionality reduction | Cumulative explained variance | Linear feature combinations |
| **K-Means Clustering** | Agro-climatic grouping | Silhouette coefficient, Inertia | Spherical clusters, feature scaling |
| **Time-Series Analysis** | Trend & anomaly detection | Chronological rolling validation | Temporal continuity |

> [!NOTE]
> All time-dependent evaluations employ chronological train/validation splits rather than random shuffling to preserve temporal sequence integrity.

---

[← Back to Main README](../README.md) • [Next: Data Fusion →](DATA_FUSION.md)
