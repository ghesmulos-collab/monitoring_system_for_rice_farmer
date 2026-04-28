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
          <section className="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden">
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
                    // Logic to hide repeated text in the table
                    const isDuplicate = index > 0 && schedules[index - 1].crop_id === s.crop_id;

                    return (
                      <tr key={s.id} className={`text-gray-700 ${!isDuplicate ? 'bg-gray-50/30' : ''}`}>
                        <td className="px-5 py-4 border-b border-gray-300 font-bold">
                          {!isDuplicate ? s.crop_id : ""}
                        </td>
                        <td className="px-5 py-4 border-b border-gray-300">
                          {!isDuplicate ? s.growth_stage : ""}
                        </td>
                        <td className="px-5 py-4 border-b border-gray-300">
                          {!isDuplicate ? s.fertilizer_type : ""}
                        </td>
                        <td className="px-5 py-4 border-b border-gray-300 italic text-gray-600">
                          {s.application_schedule}
                        </td>
                        <td className="px-5 py-4 border-b border-gray-300">
                          {!isDuplicate ? s.expected_harvest_date : ""}
                        </td>
                        <td className="px-5 py-4 border-b border-gray-300">
                          {!isDuplicate ? s.estimated_yield : ""}
                        </td>
                        <td className="px-5 py-4 border-b border-gray-300">
                          <span className="bg-[#E9F7EF] text-[#27AE60] px-3 py-1 rounded-full text-xs font-bold">
                            {s.days_remaining} days
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCards.map((crop: any) => (
          <div
            key={crop.crop_id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
          >
            <div className="bg-[#E9F7EF] w-full px-6 py-4 border-b border-gray-100">
              <h4 className="font-bold text-[#016630] text-lg">
                {crop.crop_id}
              </h4>
            </div>

            <div className="p-6 space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[10px] font-semibold uppercase">Growth Stage</span>
                  <span className="text-black font-normal">{crop.growth_stage}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[10px] font-semibold uppercase">Fertilizer Type</span>
                  <span className="text-black font-normal">{crop.fertilizer_type}</span>
                </div>
              </div>

              {/* Internal list of schedules for this specific card */}
              <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                <span className="text-gray-400 text-[10px] font-semibold uppercase block border-b pb-1">Application Schedule</span>
                {crop.allSchedules.map((task: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{task.name}</span>
                    <span className="text-[#27AE60] font-bold text-xs">{task.days}d left</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-2">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[10px] font-semibold uppercase">Expected Harvest</span>
                  <span className="text-black font-normal">{crop.expected_harvest_date}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-gray-400 text-[10px] font-semibold uppercase">Estimated Yield</span>
                  <span className="text-black font-normal">{crop.estimated_yield}</span>
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