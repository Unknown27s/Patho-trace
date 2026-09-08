export const MODEL_URL = "https://f85c961f58a048488a.gradio.live/";
export const MODEL_API_BASE = MODEL_URL.replace(/\/$/, "");
export const MODEL_ENDPOINT = "/predict_mastitis";

// 16 features in exact model order: 14-day quantile-regression residuals
export const FEATURE_DEFS = [
  { key: "lnVAR_activity", group: "Activity", label: "lnVAR Activity", hint: "log-variance residual, 14d", step: "0.1" },
  { key: "acf_activity", group: "Activity", label: "ACF Activity", hint: "autocorrelation residual, 14d", step: "0.1" },
  { key: "lnVAR_rumination", group: "Rumination", label: "lnVAR Rumination", hint: "log-variance residual, 14d", step: "0.1" },
  { key: "acf_rumination", group: "Rumination", label: "ACF Rumination", hint: "autocorrelation residual, 14d", step: "0.1" },
  { key: "lnVAR_temperature", group: "Temperature", label: "lnVAR Temperature", hint: "log-variance residual, 14d", step: "0.1" },
  { key: "acf_temperature", group: "Temperature", label: "ACF Temperature", hint: "autocorrelation residual, 14d", step: "0.1" },
  { key: "lnVAR_milkyield", group: "Milk Yield", label: "lnVAR Milk Yield", hint: "log-variance residual, 14d", step: "0.1" },
  { key: "acf_milkyield", group: "Milk Yield", label: "ACF Milk Yield", hint: "autocorrelation residual, 14d", step: "0.1" },
  { key: "lnVAR_EC_LF", group: "EC · Left Front", label: "lnVAR EC LF", hint: "left-front conductivity residual", step: "0.1" },
  { key: "acf_EC_LF", group: "EC · Left Front", label: "ACF EC LF", hint: "left-front autocorrelation", step: "0.1" },
  { key: "lnVAR_EC_RF", group: "EC · Right Front", label: "lnVAR EC RF", hint: "right-front conductivity residual", step: "0.1" },
  { key: "acf_EC_RF", group: "EC · Right Front", label: "ACF EC RF", hint: "right-front autocorrelation", step: "0.1" },
  { key: "lnVAR_EC_LR", group: "EC · Left Rear", label: "lnVAR EC LR", hint: "left-rear conductivity residual", step: "0.1" },
  { key: "acf_EC_LR", group: "EC · Left Rear", label: "ACF EC LR", hint: "left-rear autocorrelation", step: "0.1" },
  { key: "lnVAR_EC_RR", group: "EC · Right Rear", label: "lnVAR EC RR", hint: "right-rear conductivity residual", step: "0.1" },
  { key: "acf_EC_RR", group: "EC · Right Rear", label: "ACF EC RR", hint: "right-rear autocorrelation", step: "0.1" },
];

export const FEATURE_ORDER = FEATURE_DEFS.map((f) => f.key);
