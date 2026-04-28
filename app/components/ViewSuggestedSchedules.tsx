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

  // The style string you requested
  const customCellStyle = "px-6 py-3 font-normal text-sm border-b border-gray-300 last:border-r-0";

  return (
    <div className="p-6 space-y-12">
      <h2 className="text-[#0D6D32] text-xl font-semibold">View Suggested Schedules</h2>

      {/* --- TABLE SECTION --- */}
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
                  <React.Fragment key={crop.crop_id}>
                    {crop.tasks.map((task: any, index: number) => (
                      <tr key={`${crop.crop_id}-${index}`} className="text-gray-600">
                        {/* Only show these values on the first task of the group */}
                        <td className={`${customCellStyle} font-bold text-black`}>
                          {index === 0 ? crop.crop_id : ""}
                        </td>
                        <td className={customCellStyle}>
                          {index === 0 ? crop.growth_stage : ""}
                        </td>
                        <td className={customCellStyle}>
                          {index === 0 ? crop.fertilizer_type : ""}
                        </td>
                        
                        {/* Always show the task name */}
                        <td className={`${customCellStyle} italic text-gray-500`}>
                          {task.name}
                        </td>

                        {/* Only show these values on the first task of the group */}
                        <td className={customCellStyle}>
                          {index === 0 ? crop.expected_harvest_date : ""}
                        </td>
                        <td className={customCellStyle}>
                          {index === 0 ? crop.estimated_yield : ""}
                        </td>

                        {/* Always show the days remaining badge */}
                        <td className={customCellStyle}>
                          <div className="flex items-center">
                            <span className="bg-[#DCFCE7] text-[#0D6D32] px-3 py-1 rounded-full text-[10px] font-bold">
                              {task.days} days
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- CARDS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
        {!loading && finalRows.map((crop: any) => (
          <div key={crop.crop_id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-[#F9FFF9] px-6 py-4 border-b border-gray-100">
              <h4 className="font-bold text-[#27AE60] text-lg">
                {crop.crop_id}
              </h4>
            </div>

            <div className="p-6 space-y-6 flex-grow">
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Growth Stage</p>
                  <p className="text-gray-700 font-semibold text-sm">{crop.growth_stage}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Fertilizer Type</p>
                  <p className="text-gray-700 font-semibold text-sm">{crop.fertilizer_type}</p>
                </div>
              </div>

              <div className="bg-[#F8FBFA] p-4 rounded-lg border border-gray-100 space-y-3">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider border-b border-gray-200 pb-1">Schedules</p>
                {crop.tasks.map((task: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="italic text-gray-600 text-sm">{task.name}</span>
                    <span className="bg-[#DCFCE7] text-[#0D6D32] px-2 py-0.5 rounded text-[10px] font-bold">
                      {task.days}d
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-end pt-2 border-t border-gray-50">
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase">Harvest Date</p>
                  <p className="text-gray-700 font-medium text-xs">{crop.expected_harvest_date}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-[10px] font-bold uppercase">Est. Yield</p>
                  <p className="text-gray-700 font-medium text-xs">{crop.estimated_yield}</p>
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