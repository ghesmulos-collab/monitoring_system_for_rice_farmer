import React, { useState, useEffect } from 'react';

// Interface matching your 'Input Crop Details' database structure
interface CropRecord {
  crop_id: string;
  planting_date: string;
  growth_stage: string;
  harvest_date: string;
  estimated_yield: string;
  actual_yield: string;
  production_cost?: string; // Optional field for the cost column
}

interface CropReport {
  report_id: string;
  crop_id: string;
  total_yield: string;
  total_production_cost: string; // Updated from 'status' to 'total_production_cost'
}

const GenerateCropDetailsReports: React.FC = () => {
  const [reports, setReports] = useState<CropReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        setLoading(true);
        // Correct path based on your folder structure
        const response = await fetch('/api/crops');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        const data: CropRecord[] = await response.json();

        // Dynamically transform Input Crop Details into the visual report format
        const transformedData = data.map((crop, index) => ({
          report_id: `RPT-00${index + 1}`,
          crop_id: crop.crop_id,
          // Prefers actual yield over estimated yield
          total_yield: crop.actual_yield && crop.actual_yield !== "0" 
            ? `${crop.actual_yield} tons` 
            : `${crop.estimated_yield} tons (estimated)`,
          // Maps cost data or a placeholder to match the UI
          total_production_cost: crop.production_cost ? `₱${crop.production_cost}` : "₱0.00"
        }));

        setReports(transformedData);
        setError(null);
      } catch (err) {
        console.error("Connection Error:", err);
        setError("Could not connect to crop records.");
      } finally {
        setLoading(false);
      }
    };

    fetchCrops();
  }, []);

  return (
    <div className="space-y-8 p-2">
      <div className="flex justify-between items-center">
        <h2 className="text-[#0D6D32] text-xl font-semibold">Generate Crop Details Reports</h2>
        <button className="bg-[#00843D] hover:bg-[#006B31] text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-sm active:scale-95">
          Generate Report
        </button>
      </div>

      {/* 1. Summary Table Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="text-gray-700 font-semibold text-sm">Crop Production Summary Reports</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left text-xs border-separate border-spacing-0">
              <thead className="bg-[#DCFCE7] text-gray-600 font-semibold">
                <tr>
                  <th className="px-6 py-3 font-semibold text-sm border-b border-gray-300">Report ID</th>
                  <th className="px-6 py-3 font-semibold text-sm border-b border-gray-300">Crop ID</th>
                  <th className="px-6 py-3 font-semibold text-sm border-b border-gray-300">Total Yield</th>
                  {/* Updated Column Header to match UI */}
                  <th className="px-6 py-3 font-semibold text-sm border-b border-gray-300">Total Production Cost</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  <tr><td colSpan={4} className="p-10 text-center text-gray-400">Syncing database records...</td></tr>
                ) : error ? (
                  <tr><td colSpan={4} className="p-10 text-center text-red-400">{error}</td></tr>
                ) : reports.length > 0 ? (
                  reports.map((rpt) => (
                    <tr key={rpt.report_id} className="text-gray-800 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3 border-b border-gray-300">{rpt.report_id}</td>
                      <td className="px-6 py-3 border-b border-gray-300">{rpt.crop_id}</td>
                      <td className="px-6 py-3 border-b border-gray-300">{rpt.total_yield}</td>
                      <td className="px-6 py-3 border-b border-gray-300 ">{rpt.total_production_cost}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="p-10 text-center text-gray-400">No records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 2. Detailed Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {!loading && reports.map((rpt) => (
          <div key={rpt.report_id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#E9F7EF] px-6 py-3 border-b border-gray-50">
              <span className="text-[#27AE60] font-normal text-sm">{rpt.report_id}</span>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex flex-col">
                <span className="text-gray-400 text-[10px] font-semibold ">Crop ID</span>
                <span className="text-gray-800 font-normal text-lg">{rpt.crop_id}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 text-[10px] font-semibold ">Total Yield</span>
                <span className="text-gray-800 font-normal text-lg">{rpt.total_yield}</span>
              </div>
              <div className="flex flex-col">
                {/* Updated Label to match UI */}
                <span className="text-gray-400 text-[10px] font-semibold">Total Production Cost</span>
                <span className="text-gray-800 font-normal text-lg">{rpt.total_production_cost}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenerateCropDetailsReports;