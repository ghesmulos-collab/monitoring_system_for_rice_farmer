"use client";
import React, { useState, useEffect } from 'react';

interface Schedule {
  id: string;
  crop_id: string;
  growth_stage: string;
  fertilizer_type: string;
  application_schedule: string;
  expected_harvest_date: string;
  estimated_yield: string;
  days_remaining: number;
}

const ViewSuggestedSchedules: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await fetch('/api/crops/schedules');
        const data = await res.json();

        if (Array.isArray(data)) {
          const userSchedules = data.map((item: any) => ({
            id: item.suggested_schedule_id || Math.random().toString(),
            crop_id: item.crop_id,
            growth_stage: item.growth_stage || "N/A",
            fertilizer_type: item.fertilizer_type || "N/A",
            application_schedule: item.application_schedule || "N/A",
            expected_harvest_date: item.expected_harvest_date || "N/A",
            estimated_yield: item.estimated_yield || "N/A",
            days_remaining: item.days_remaining ?? 0
          }));

          // --- FIX: Group by Crop ID and only take the first/nearest schedule ---
          const uniqueCrops = userSchedules.reduce((acc: any, current) => {
            if (!acc[current.crop_id]) {
              acc[current.crop_id] = current;
            }
            return acc;
          }, {});

          setSchedules(Object.values(uniqueCrops));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  return (
    <div className="space-y-8 p-4">
      <h2 className="text-[#0D6D32] text-xl font-semibold mb-6">
        View Suggested Schedules
      </h2>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-10">
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="text-gray-700 font-medium text-sm">
            Fertilizer Schedule Recommendations
          </h3>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-sm border-separate border-spacing-0">
            <thead className="bg-[#DCFCE7] text-gray-700">
              <tr>
                <th className="px-6 py-3 font-semibold first:rounded-l-lg">Crop ID</th>
                <th className="px-6 py-3 font-semibold">Growth Stage</th>
                <th className="px-6 py-3 font-semibold">Fertilizer Type</th>
                <th className="px-6 py-3 font-semibold">Application Schedule</th>
                <th className="px-6 py-3 font-semibold">Expected Harvest Date</th>
                <th className="px-6 py-3 font-semibold">Estimated Yield</th>
                <th className="px-6 py-3 font-semibold last:rounded-r-lg text-center">Days Remaining</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={7} className="p-10 text-center text-gray-400">Loading...</td></tr>
              ) : schedules.map((s) => (
                <tr key={s.id} className="text-gray-600">
                  <td className="px-6 py-4 font-medium">{s.crop_id}</td>
                  <td className="px-6 py-4">{s.growth_stage}</td>
                  <td className="px-6 py-4">{s.fertilizer_type}</td>
                  <td className="px-6 py-4">{s.application_schedule}</td>
                  <td className="px-6 py-4">{s.expected_harvest_date}</td>
                  <td className="px-6 py-4">{s.estimated_yield}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-[#DCFCE7] text-[#0D6D32] px-3 py-1 rounded text-xs font-bold inline-block w-20">
                      {s.days_remaining} days
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedules.map((crop) => (
          <div key={crop.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden border-t-4 border-t-[#DCFCE7]">
            <div className="bg-[#F9FFF9] px-6 py-4 border-b border-gray-50">
              <h4 className="font-bold text-[#27AE60] text-lg uppercase tracking-wide">
                {crop.crop_id}
              </h4>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="text-gray-400 text-[10px] font-bold uppercase block tracking-wider">Growth Stage</span>
                <span className="text-gray-700 font-semibold">{crop.growth_stage}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] font-bold uppercase block tracking-wider">Fertilizer Type</span>
                <span className="text-gray-700 font-semibold">{crop.fertilizer_type}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] font-bold uppercase block tracking-wider">Application Schedule</span>
                <span className="text-gray-700 font-semibold">{crop.application_schedule}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] font-bold uppercase block tracking-wider">Expected Harvest Date</span>
                <span className="text-gray-700 font-semibold">{crop.expected_harvest_date}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] font-bold uppercase block tracking-wider">Estimated Yield</span>
                <span className="text-gray-700 font-semibold">{crop.estimated_yield}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] font-bold uppercase block tracking-wider mb-1">Days Remaining</span>
                <span className="bg-[#DCFCE7] text-[#0D6D32] px-3 py-1 rounded text-xs font-bold inline-block">
                  {crop.days_remaining} days
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewSuggestedSchedules;