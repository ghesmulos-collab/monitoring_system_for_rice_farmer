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
          setSchedules(data);
        }
      } catch (err) {
        console.error("Failed to load:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  // --- GROUPING LOGIC ---
  const groupedData = schedules.reduce((acc: any, current) => {
    const id = current.crop_id;
    if (!acc[id]) {
      acc[id] = { ...current, tasks: [] };
    }
    acc[id].tasks.push({
      name: current.application_schedule,
      days: current.days_remaining
    });
    return acc;
  }, {});

  const finalRows = Object.values(groupedData);

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-[#0D6D32] text-xl font-semibold">View Suggested Schedules</h2>

      {/* Table Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="text-gray-700 font-medium text-sm">Fertilizer Schedule Recommendations</h3>
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-sm border-separate border-spacing-0">
            <thead className="bg-[#DCFCE7] text-gray-700">
              <tr>
                <th className="px-6 py-3 font-semibold first:rounded-l-lg border-b border-gray-300">Crop ID</th>
                <th className="px-6 py-3 font-semibold border-b border-gray-300">Growth Stage</th>
                <th className="px-6 py-3 font-semibold border-b border-gray-300">Fertilizer Type</th>
                <th className="px-6 py-3 font-semibold border-b border-gray-300">Application Schedule</th>
                <th className="px-6 py-3 font-semibold border-b border-gray-300">Expected Harvest Date</th>
                <th className="px-6 py-3 font-semibold border-b border-gray-300">Estimated Yield</th>
                <th className="px-6 py-3 font-semibold last:rounded-r-lg border-b border-gray-300">Days Remaining</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={7} className="p-10 text-center text-gray-400">Loading...</td></tr>
              ) : (
                finalRows.map((crop: any) => (
                  <tr key={crop.crop_id} className="text-gray-600 hover:bg-gray-50/50">
                    <td className="px-6 py-6 font-semibold text-sm border-b border-gray-300 align-top text-black">
                      {crop.crop_id}
                    </td>
                    <td className="px-6 py-6 font-normal text-sm border-b border-gray-300 align-top">
                      {crop.growth_stage}
                    </td>
                    <td className="px-6 py-6 font-normal text-sm border-b border-gray-300 align-top">
                      {crop.fertilizer_type}
                    </td>

                    {/* STACKED SCHEDULE COLUMN */}
                    <td className="px-6 py-6 font-normal text-sm border-b border-gray-300">
                      <div className="flex flex-col gap-4">
                        {crop.tasks.map((task: any, idx: number) => (
                          <div key={idx} className="italic text-gray-500 border-b border-gray-50 last:border-0 pb-1">
                            {task.name}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-6 font-normal text-sm border-b border-gray-300 align-top">
                      {crop.expected_harvest_date}
                    </td>
                    <td className="px-6 py-6 font-normal text-sm border-b border-gray-300 align-top">
                      {crop.estimated_yield}
                    </td>

                    {/* STACKED DAYS REMAINING COLUMN */}
                    <td className="px-6 py-6 font-normal text-sm border-b border-gray-300 last:border-r-0">
                      <div className="flex flex-col gap-4">
                        {crop.tasks.map((task: any, idx: number) => (
                          <div key={idx} className="h-[28px] flex items-center">
                            <span className="bg-[#DCFCE7] text-[#0D6D32] px-3 py-1 rounded text-xs font-bold">
                              {task.days} days
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {finalRows.map((crop: any) => (
          <div key={crop.crop_id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden border-t-4 border-t-[#DCFCE7]">
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
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <span className="text-gray-400 text-[10px] font-bold uppercase block tracking-wider">Schedules</span>
                {crop.tasks.map((task: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="italic text-gray-600">{task.name}</span>
                    <span className="text-[#27AE60] font-bold text-xs">{task.days}d</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-2">
                <div className="flex flex-col">
                   <span className="text-gray-400 text-[10px] font-bold uppercase">Harvest Date</span>
                   <span className="text-gray-700 font-semibold text-xs">{crop.expected_harvest_date}</span>
                </div>
                <div className="flex flex-col text-right">
                   <span className="text-gray-400 text-[10px] font-bold uppercase">Est. Yield</span>
                   <span className="text-gray-700 font-semibold text-xs">{crop.estimated_yield}</span>
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