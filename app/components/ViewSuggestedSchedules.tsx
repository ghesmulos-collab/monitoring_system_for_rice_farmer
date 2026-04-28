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
      acc[id] = { 
        ...current, 
        tasks: [] 
      };
    }
    acc[id].tasks.push({
      name: current.application_schedule,
      days: current.days_remaining
    });
    return acc;
  }, {});

  const finalRows = Object.values(groupedData);

  // Exact style string requested
  const customCellStyle = "px-6 py-3 font-normal text-sm border-b border-gray-300 last:border-r-0";

  return (
    <div className="p-6 space-y-16">
      <h2 className="text-[#0D6D32] text-xl font-semibold">View Suggested Schedules</h2>

      {/* --- TABLE SECTION: ONE CROP PER ROW --- */}
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
                <th className={`${customCellStyle} font-semibold text-center`}>Application Schedule</th>
                <th className={`${customCellStyle} font-semibold`}>Expected Harvest Date</th>
                <th className={`${customCellStyle} font-semibold`}>Estimated Yield</th>
                <th className={`${customCellStyle} font-semibold text-center last:rounded-r-lg`}>Days Remaining</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-10 text-center text-gray-400">Loading...</td></tr>
              ) : (
                finalRows.map((crop: any) => (
                  <tr key={crop.crop_id} className="text-gray-600 hover:bg-gray-50/50">
                    {/* Fixed Info columns align to top */}
                    <td className={`${customCellStyle} font-semibold text-black align-top pt-6`}>{crop.crop_id}</td>
                    <td className={`${customCellStyle} align-top pt-6`}>{crop.growth_stage}</td>
                    <td className={`${customCellStyle} align-top pt-6`}>{crop.fertilizer_type}</td>
                    
                    {/* Multi-line Schedule column */}
                    <td className={`${customCellStyle} pt-4 pb-4`}>
                      <div className="flex flex-col space-y-4">
                        {crop.tasks.map((task: any, idx: number) => (
                          <div key={idx} className="italic text-gray-500 py-1 flex items-center justify-center min-h-[32px]">
                            {task.name}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className={`${customCellStyle} align-top pt-6`}>{crop.expected_harvest_date}</td>
                    <td className={`${customCellStyle} align-top pt-6`}>{crop.estimated_yield}</td>

                    {/* Multi-line Days Remaining column */}
                    <td className={`${customCellStyle} pt-4 pb-4`}>
                      <div className="flex flex-col space-y-4 items-center">
                        {crop.tasks.map((task: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-center min-h-[32px]">
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

      {/* --- CARDS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {!loading && finalRows.map((crop: any) => (
          <div key={crop.crop_id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-white px-6 py-4 border-b border-gray-50">
              <h4 className="font-bold text-[#27AE60] text-lg">
                {crop.crop_id}
              </h4>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">Growth Stage</p>
                  <p className="text-gray-800 font-medium text-sm mt-1">{crop.growth_stage}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">Fertilizer Type</p>
                  <p className="text-gray-800 font-medium text-sm mt-1">{crop.fertilizer_type}</p>
                </div>
              </div>

              {/* Boxed Schedules Area */}
              <div className="bg-[#F8FBFA] p-4 rounded-xl border border-[#E8F5EE] space-y-3">
                <p className="text-[#27AE60] text-[10px] font-black uppercase tracking-widest border-b border-[#E8F5EE] pb-2">Schedules</p>
                {crop.tasks.map((task: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="italic text-gray-600 text-sm">{task.name}</span>
                    <span className="text-[#27AE60] font-bold text-xs">{task.days}d</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase">Harvest Date</p>
                  <p className="text-gray-700 font-medium text-xs mt-0.5">{crop.expected_harvest_date}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-[10px] font-bold uppercase">Est. Yield</p>
                  <p className="text-gray-700 font-medium text-xs mt-0.5">{crop.estimated_yield}</p>
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