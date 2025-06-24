type BrandTone = "funny" | "luxury" | "serious" | "creative" | "modern";
type BusinessType = "fashion" | "beauty" | "tech" | "real_estate" | "marketing";

export const selectTemplate = (tone: BrandTone, businessType: BusinessType) => {
  if (tone === "luxury" || businessType === "beauty") return "softPastel";
  if (businessType === "tech" || tone === "modern") return "boldMinimal";
  if (businessType === "fashion" || tone === "creative") return "gradientFocus";
  if (tone === "serious" || businessType === "real_estate") return "corporateSlide";
  return "boldMinimal";
};
