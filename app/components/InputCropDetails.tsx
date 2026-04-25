"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';

interface CropRecord {
  crop_id: string;
  planting_date: string;
  growth_stage: string;
  expected_harvest_date: string;
  estimated_yield: string;
  actual_yield: string;
}

const SEED_TYPES = ["RC Mestiso 19", "NSIC Rc 222", "PSB Rc 18", "Inbred Rice", "Hybrid Rice"];
const GROWTH_STAGES = ["Land Preparation", "Sowing", "Vegetative", "Reproductive", "Ripening", "Harvested"];
const FERTILIZER_TYPES = ["Nitrogen (Urea)", "Phosphorus", "Potassium", "Complete (14-14-14)", "Organic"];
const IRRIGATION_METHODS = ["Flood Irrigation", "Sprinkler", "Drip Irrigation", "Rainfed", "Alternate Wetting and Drying (AWD)"];

const InputCropDetails: React.FC = () => {
  const [records, setRecords] = useState<CropRecord[]>([]);

  const [formData, setFormData] = useState({
    cropId: '',
    productionCost: '',
    plantingDate: '',
    seedType: '',
    growthStage: '',
    fertilizerType: '',
    quantityApplied: '',
    applicationDate: '',
    irrigationMethod: '',
    expectedHarvest: '',
    estimatedYield: '',
    marketPrice: ''
  });

  const [toast, setToast] = useState({
    message: "",
    type: "success" as "success" | "error",
    visible: false
  });

  const showToast = (message: string, type: "success" | "error", time = 3000) => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), time);
  };

  // ✅ Only allow 0+ numbers
  const sanitizeNumber = (value: string) => {
    let cleaned = "";
    let dotUsed = false;

    for (let i = 0; i < value.length; i++) {
      const ch = value[i];

      if (ch >= '0' && ch <= '9') cleaned += ch;
      else if (ch === '.' && !dotUsed) {
        cleaned += ch;
        dotUsed = true;
      }
    }

    return cleaned;
  };

  const fetchRecords = async () => {
    try {
      const res = await fetch(`/api/crops?t=${Date.now()}`);
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load records:", err);
      showToast("Failed to load records", "error");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    const numericFields = ["productionCost", "quantityApplied", "estimatedYield", "marketPrice"];

    if (numericFields.includes(name)) {
      const sanitized = sanitizeNumber(value);
      setFormData(prev => ({ ...prev, [name]: sanitized }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.cropId.trim() || !formData.plantingDate) {
      showToast("Please fill in Crop ID and Planting Date.", "error");
      return;
    }

    try {
      const res = await fetch('/api/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Failed to save crop", "error");
        return;
      }

      const syncPayload = {
        crop_id: formData.cropId,
        planting_date: formData.plantingDate,
        status_name: formData.growthStage || 'Land Preparation',
        fertilizer_type: formData.fertilizerType,
        total_yield: formData.estimatedYield,
        total_production: formData.productionCost
      };

      await Promise.all([
        fetch('/api/crops/schedules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(syncPayload)
        }),
        fetch('/api/crops/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            crop_id: syncPayload.crop_id,
            status_name: syncPayload.status_name,
            remarks: 'Initial planting record created.'
          })
        }),
        fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            crop_id: syncPayload.crop_id,
            fertilizer_type: syncPayload.fertilizer_type
          })
        }),
        fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            crop_id: syncPayload.crop_id,
            total_yield: syncPayload.total_yield,
            total_production: syncPayload.total_production
          })
        })
      ]);

      showToast("Success of Transaction!", "success");
      handleClear();
      fetchRecords();

    } catch (error) {
      console.error(error);
      showToast("Network error. Check backend.", "error");
    }
  };

  const handleClear = () => {
    setFormData({
      cropId: '',
      productionCost: '',
      plantingDate: '',
      seedType: '',
      growthStage: '',
      fertilizerType: '',
      quantityApplied: '',
      applicationDate: '',
      irrigationMethod: '',
      expectedHarvest: '',
      estimatedYield: '',
      marketPrice: ''
    });
  };

  const selectClassName =
    "p-2.5 bg-[#F1F3F4] text-black border-none rounded focus:ring-1 focus:ring-green-500 text-sm outline-none w-full block appearance-none cursor-pointer";

  return (
    <div className="space-y-6">

      {toast.visible && (
        <div className={`fixed top-5 right-5 px-6 py-3 rounded-lg shadow-lg text-white text-sm font-semibold z-[9999]
          ${toast.type === "success" ? "bg-green-600" : "bg-red-500"}`}>
          {toast.type === "success" ? "✅" : "⚠️"} {toast.message}
        </div>
      )}

      <h2 className="text-[#0D6D32] text-xl font-semibold mb-4">Input Crop Details</h2>

      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-gray-700 font-bold text-sm mb-6 border-b pb-2">Crop Production Data Form</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Crop ID</label>
            <input name="cropId" value={formData.cropId} onChange={handleInputChange}
              className="p-2.5 bg-[#F1F3F4] text-black border-none rounded focus:ring-1 focus:ring-green-500 text-sm outline-none w-full"
              placeholder="e.g., CRP-001" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Production Cost (₱)</label>
            <input name="productionCost" value={formData.productionCost} onChange={handleInputChange}
              inputMode="decimal"
              className="p-2.5 bg-[#F1F3F4] text-black border-none rounded focus:ring-1 focus:ring-green-500 text-sm outline-none w-full"
              placeholder="e.g., 45000" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Planting Date</label>
            <input type="date" name="plantingDate" value={formData.plantingDate} onChange={handleInputChange}
              className="p-2.5 bg-[#F1F3F4] text-black border-none rounded focus:ring-1 focus:ring-green-500 text-sm outline-none w-full" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Seed Type</label>
            <select name="seedType" value={formData.seedType} onChange={handleInputChange} className={selectClassName}>
              <option value="">Select Seed Type</option>
              {SEED_TYPES.map(type => <option key={type}>{type}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Growth Stage</label>
            <select name="growthStage" value={formData.growthStage} onChange={handleInputChange} className={selectClassName}>
              <option value="">Select Growth Stage</option>
              {GROWTH_STAGES.map(stage => <option key={stage}>{stage}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Fertilizer Type</label>
            <select name="fertilizerType" value={formData.fertilizerType} onChange={handleInputChange} className={selectClassName}>
              <option value="">Select Fertilizer Type</option>
              {FERTILIZER_TYPES.map(type => <option key={type}>{type}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Quantity Applied (KG)</label>
            <input name="quantityApplied" value={formData.quantityApplied} onChange={handleInputChange}
              inputMode="decimal"
              className="p-2.5 bg-[#F1F3F4] text-black border-none rounded focus:ring-1 focus:ring-green-500 text-sm outline-none w-full"
              placeholder="e.g., 50" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Application Date</label>
            <input type="date" name="applicationDate" value={formData.applicationDate} onChange={handleInputChange}
              className="p-2.5 bg-[#F1F3F4] text-black border-none rounded focus:ring-1 focus:ring-green-500 text-sm outline-none w-full" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Irrigation Method</label>
            <select name="irrigationMethod" value={formData.irrigationMethod} onChange={handleInputChange} className={selectClassName}>
              <option value="">Select Irrigation Method</option>
              {IRRIGATION_METHODS.map(method => <option key={method}>{method}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Expected Harvest Date</label>
            <input type="date" name="expectedHarvest" value={formData.expectedHarvest} onChange={handleInputChange}
              className="p-2.5 bg-[#F1F3F4] text-black border-none rounded focus:ring-1 focus:ring-green-500 text-sm outline-none w-full" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Estimated Yield (Tons)</label>
            <input name="estimatedYield" value={formData.estimatedYield} onChange={handleInputChange}
              inputMode="decimal"
              className="p-2.5 bg-[#F1F3F4] text-black border-none rounded focus:ring-1 focus:ring-green-500 text-sm outline-none w-full"
              placeholder="e.g., 5.5" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Market Price (₱)</label>
            <input name="marketPrice" value={formData.marketPrice} onChange={handleInputChange}
              inputMode="decimal"
              className="p-2.5 bg-[#F1F3F4] text-black border-none rounded focus:ring-1 focus:ring-green-500 text-sm outline-none w-full"
              placeholder="e.g., 20000" />
          </div>

        </div>

        <div className="mt-8 flex gap-3">
          <button onClick={handleSave} className="bg-[#0D6D32] text-white px-8 py-2 rounded font-semibold text-sm hover:bg-[#0a5628]">Save</button>
          <button onClick={handleClear} className="bg-white border border-[#0D6D32] text-[#0D6D32] px-8 py-2 rounded font-semibold text-sm hover:bg-green-50">Clear</button>
        </div>
      </section>

      {/* TABLE */}
      <section className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-700 text-sm">Crop Records</h3>
        </div>
        <div className="px-6 py-4 border-b border-gray-50">
        <div className="bg-white rounded-xl shadow-sm border-r border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#DCFCE7] text-gray-700">
                <tr className="text-sm">
                  <th className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0 font-semibold">Crop ID</th>
                  <th className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0 font-semibold">Planting Date</th>
                  <th className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0 font-semibold">Growth Stage</th>
                  <th className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0 font-semibold">Expected Harvest</th>
                  <th className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0 font-semibold">Estimated Yield</th>
                  <th className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0 font-semibold">Actual Yield</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                {records.length > 0 ? records.map(row => (
                  <tr key={row.crop_id}>
                    <td className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0">{row.crop_id}</td>
                    <td className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0 ">{row.planting_date ? new Date(row.planting_date).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0">{row.growth_stage}</td>
                    <td className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0">{row.expected_harvest_date ? new Date(row.expected_harvest_date).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0">{row.estimated_yield}</td>
                    <td className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0">{row.actual_yield || '—'}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">No records found.</td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>
        </div>  
      </section>

    </div>
  );
};

export default InputCropDetails;