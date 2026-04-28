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

  // Apply your specific requested style string
  const customCellStyle = "px-6 py-3 font-normal text-sm border-b border-gray-300 last:border-r-0";

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-[#0D6D32] text-xl font-semibold">View Suggested Schedules</h2>

      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="text-gray-700 font-medium text-sm">Fertilizer Schedule Recommendations</h3>
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-sm border-separate border-spacing-0">
            <thead className="bg-[#DCFCE7] text-gray-700">
              <tr>
                <th className={`${customCellStyle} font-semibold first:rounded-l-lg`}>Crop ID</th>
                <th className={`${customCellStyle} font-semibold`}>Growth Stage</th>
                <th className={`${customCellStyle} font-semibold`}>Fertilizer Type</th>
                <th className={`${customCellStyle} font-semibold`}>Application Schedule</th>
                <th className={`${customCellStyle} font-semibold`}>Expected Harvest Date</th>
                <th className={`${customCellStyle} font-semibold`}>Estimated Yield</th>
                <th className={`${customCellStyle} font-semibold last:rounded-r-lg`}>Days Remaining</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-10 text-center text-gray-400">Loading...</td></tr>
              ) : (
                finalRows.map((crop: any) => (
                  <tr key={crop.crop_id} className="text-gray-600 hover:bg-gray-50/50">
                    {/* Added font-semibold to the ID as requested in your string */}
                    <td className={`${customCellStyle} font-semibold text-black align-top`}>{crop.crop_id}</td>
                    <td className={`${customCellStyle} align-top`}>{crop.growth_stage}</td>
                    <td className={`${customCellStyle} align-top`}>{crop.fertilizer_type}</td>

                    {/* STACKED SCHEDULE COLUMN */}
                    <td className={customCellStyle}>
                      <div className="flex flex-col gap-4">
                        {crop.tasks.map((task: any, idx: number) => (
                          <div key={idx} className="italic text-gray-500 pb-1">
                            {task.name}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className={`${customCellStyle} align-top`}>{crop.expected_harvest_date}</td>
                    <td className={`${customCellStyle} align-top`}>{crop.estimated_yield}</td>

                    {/* STACKED DAYS REMAINING COLUMN */}
                    <td className={customCellStyle}>
                      <div className="flex flex-col gap-4">
                        {crop.tasks.map((task: any, idx: number) => (
                          <div key={idx} className="h-[24px] flex items-center">
                            <span className="bg-[#DCFCE7] text-[#0D6D32] px-3 py-1 rounded text-[10px] font-bold">
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
    </div>
  );
};

export default ViewSuggestedSchedules;