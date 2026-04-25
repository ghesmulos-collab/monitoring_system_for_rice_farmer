"use client";
import React, { useState, useEffect } from 'react';

interface CropStatusRecord {
  id: string;
  crop_id: string;
  growth_stage: string;
  status: 'Healthy' | 'Near Harvest' | 'Needs Fertilizer';
}

const ViewCropStatus: React.FC = () => {
  const [cropStatuses, setCropStatuses] = useState<CropStatusRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        // Fetch real data from your existing API route
        const res = await fetch('/api/crops');
        const data = await res.json();

        if (Array.isArray(data)) {
          // Map database records to the status view format
          const realData = data.map((item: any) => ({
            id: item.crop_id, // Use crop_id as the unique key
            crop_id: item.crop_id,
            growth_stage: item.growth_stage,
            // Logic to determine status based on the growth stage in MySQL
            status: determineStatus(item.growth_stage)
          }));
          setCropStatuses(realData);
        }
      } catch (err) {
        console.error("Failed to load crop status:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatusData();
  }, []);

  // Helper logic to set the tag based on the stage from your database
  const determineStatus = (stage: string): CropStatusRecord['status'] => {
    if (stage === 'Harvested' || stage === 'Ripening') return 'Near Harvest';
    if (stage === 'Vegetative') return 'Needs Fertilizer';
    return 'Healthy'; // Default for 'Land Preparation', 'Sowing', etc.
  };

  const renderStatusTag = (status: CropStatusRecord['status']) => {
    switch (status) {
      case 'Healthy':
        return <span className="bg-[#E9F7EF] text-[#27AE60] text-[11px] font-bold px-3 py-1 rounded-full">Healthy</span>;
      case 'Near Harvest':
        return <span className="bg-[#FFF8E1] text-[#F1C40F] text-[11px] font-bold px-3 py-1 rounded-full">Near Harvest</span>;
      case 'Needs Fertilizer':
        return <span className="bg-[#FDEDEC] text-[#E74C3C] text-[11px] font-bold px-3 py-1 rounded-full">Needs Fertilizer</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-[#0D6D32] text-xl font-semibold mb-4">View Crop Status</h2>
      
      <section className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="font-semibold text-gray-700 text-sm">Crop Status Overview</h3>
        </div>
        <div className="px-6 py-4 border-b border-gray-50">
        <section className="bg-white rounded-xl shadow-sm border-r border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#DCFCE7] text-gray-600">
              <tr className="text-sm tracking-wider">
                <th className="px-6 py-3 font-semibold text-sm border-b  border-gray-300 last:border-r-0">Crop ID</th>
                <th className="px-6 py-3 font-semibold text-sm border-b  border-gray-300 last:border-r-0">Growth Stage</th>
                <th className="px-6 py-3 font-semibold text-sm border-b  border-gray-300 last:border-r-0">Crop Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-gray-400">Loading status...</td>
                </tr>
              ) : cropStatuses.length > 0 ? (
                cropStatuses.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0">{row.crop_id}</td>
                    <td className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0">{row.growth_stage}</td>
                    <td className="px-6 py-3 font-normal text-sm border-b  border-gray-300 last:border-r-0">{renderStatusTag(row.status)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-gray-400">No crop records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </section>
        </div>
      </section>
    </div>
  );
};

export default ViewCropStatus;