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

        if (!res.ok) {
          console.error("API Error:", data?.error);
          setSchedules([]);
          return;
        }

        if (Array.isArray(data)) {
          const userSchedules = data.map((item: any) => {
            const harvestDate = new Date(item.expected_harvest_date);
            const today = new Date();
            const diffTime = harvestDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return {
              id: item.suggested_schedule_id || item.crop_id + item.application_schedule,
              crop_id: item.crop_id,
              growth_stage: item.growth_stage || "N/A",
              fertilizer_type: item.fertilizer_type || "N/A",
              application_schedule: item.application_schedule || "N/A",
              expected_harvest_date: item.expected_harvest_date
                ? new Date(item.expected_harvest_date).toISOString().split('T')[0]
                : "N/A",
              estimated_yield: item.estimated_yield || "N/A",
              days_remaining: item.days_remaining ?? diffDays ?? 0
            };
          });

          setSchedules(userSchedules);
        } else {
          setSchedules([]);
        }
      } catch (err) {
        console.error("Failed to load schedules:", err);
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  // --- LOGIC FOR CARDS: Grouping data by Crop ID ---
  const groupedCrops = schedules.reduce((acc: any, current) => {
    const id = current.crop_id;
    if (!acc[id]) {
      acc[id] = { ...current, allSchedules: [] };
    }
    acc[id].allSchedules.push({
      name: current.application_schedule,
      days: current.days_remaining
    });
    return acc;
  }, {});

  const displayCards = Object.values(groupedCrops) as any[];

  return (
    <div className="space-y-8">
      <h2 className="text-[#0D6D32] text-xl font-semibold mb-4">
        View Suggested Schedules
      </h2>

      {/* Table Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="text-gray-700 font-semibold text-sm">
            Fertilizer Schedule Recommendations
          </h3>
        </div>

        <div className="px-6 py-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-separate border-spacing-0">
              <thead className="bg-[#DCFCE7] text-gray-600 font-normal">
                <tr>
                  <th className="px-6 py-3 font-semibold border-b border-gray-300">Crop ID</th>
                  <th className="px-6 py-3 font-semibold border-b border-gray-300">Growth Stage</th>
                  <th className="px-6 py-3 font-semibold border-b border-gray-300">Fertilizer Type</th>
                  <th className="px-6 py-3 font-semibold border-b border-gray-300">Application Schedule</th>
                  <th className="px-6 py-3 font-semibold border-b border-gray-300">Expected Harvest Date</th>
                  <th className="px-6 py-3 font-semibold border-b border-gray-300">Estimated Yield</th>
                  <th className="px-6 py-3 font-semibold border-b border-gray-300">Days Remaining</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-gray-400">Loading schedules...</td>
                  </tr>
                ) : schedules.map((s, index) => {
                  const isDuplicate = index > 0 && schedules[index - 1].crop_id === s.crop_id;
                  return (
                    <tr key={s.id} className="text-gray-700">
                      <td className="px-5 py-4 border-b border-gray-300 font-bold">
                        {!isDuplicate ? s.crop_id : ""}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-300">
                        {!isDuplicate ? s.growth_stage : ""}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-300">
                        {!isDuplicate ? s.fertilizer_type : ""}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-300 italic text-[#4A5568]">
                        {s.application_schedule}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-300">
                        {!isDuplicate ? s.expected_harvest_date : ""}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-300">
                        {!isDuplicate ? s.estimated_yield : ""}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-300">
                        <span className="bg-[#DCFCE7] text-[#0D6D32] px-3 py-1 rounded text-xs font-bold whitespace-nowrap">
                          {s.days_remaining} days
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Cards Section - Matches Screenshot Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCards.map((crop: any) => (
          <div
            key={crop.crop_id}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col"
          >
            {/* Card Header */}
            <div className="bg-[#F0FFF4] w-full px-6 py-4 border-b border-gray-100">
              <h4 className="font-bold text-[#2D6A4F] text-lg">
                {crop.crop_id}
              </h4>
            </div>

            {/* Card Content */}
            <div className="p-6 space-y-5 flex-1">
              <div>
                <span className="text-[#718096] text-xs font-medium">Growth Stage</span>
                <p className="text-[#2D3748] text-sm mt-1">{crop.growth_stage}</p>
              </div>

              <div>
                <span className="text-[#718096] text-xs font-medium">Fertilizer Type</span>
                <p className="text-[#2D3748] text-sm mt-1">{crop.fertilizer_type}</p>
              </div>

              <div>
                <span className="text-[#718096] text-xs font-medium">Application Schedule</span>
                <p className="text-[#2D3748] text-sm mt-1">{crop.application_schedule}</p>
              </div>

              <div>
                <span className="text-[#718096] text-xs font-medium">Expected Harvest Date</span>
                <p className="text-[#2D3748] text-sm mt-1">{crop.expected_harvest_date}</p>
              </div>

              <div>
                <span className="text-[#718096] text-xs font-medium">Estimated Yield</span>
                <p className="text-[#2D3748] text-sm mt-1">{crop.estimated_yield}</p>
              </div>

              <div>
                <span className="text-[#718096] text-xs font-medium">Days Remaining</span>
                <div className="mt-2">
                  <span className="bg-[#DCFCE7] text-[#0D6D32] px-3 py-1.5 rounded-md text-sm font-semibold">
                    {crop.days_remaining} days
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewSuggestedSchedules;