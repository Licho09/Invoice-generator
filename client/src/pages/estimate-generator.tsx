import { useState } from "react";
import EstimateForm from "@/components/estimate-form";
import EstimatePreview from "@/components/estimate-preview";
import { ServiceItem, EstimateData } from "@/lib/estimate-utils";

export default function EstimateGenerator() {
  const [showPreview, setShowPreview] = useState(false);
  const [estimateData, setEstimateData] = useState<EstimateData | null>(null);

  const handleGenerateEstimate = (data: EstimateData) => {
    setEstimateData(data);
    setShowPreview(true);
  };

  const handleBackToForm = () => {
    setShowPreview(false);
  };

  if (showPreview && estimateData) {
    return (
      <EstimatePreview 
        data={estimateData} 
        onBackToForm={handleBackToForm}
      />
    );
  }

  return (
    <EstimateForm onGenerateEstimate={handleGenerateEstimate} />
  );
}
