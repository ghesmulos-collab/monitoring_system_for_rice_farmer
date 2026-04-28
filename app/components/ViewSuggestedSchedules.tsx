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

  // --- STRICT DE-DUPLICATION & GROUPING ---
  // This ensures each Crop ID only creates one entry
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

  // Exact styling from your request
  const customCellStyle = "px-6 py-4 font-normal text-sm border-b border-gray-300 last:border-r-0 font-semibold";

  return (
    <div className="p-6 space-y-10">
      <h2 className="text-[#0D6D32] text-xl font-semibold">View Suggested Schedules</h2>

      {/* --- TABLE SECTION: ONE ROW PER CROP --- */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-sm border-separate border-spacing-0">
            <thead className="bg-[#DCFCE7] text-gray-700">
              <tr>
                <th className={customCellStyle}>Crop ID</th>
                <th className={customCellStyle}>Growth Stage</th>
                <th className={customCellStyle}>Fertilizer Type</th>
                <th className={customCellStyle}>Application Schedule</th>
                <th className={customCellStyle}>Expected Harvest Date</th>
                <th className={customCellStyle}>Estimated Yield</th>
                <th className={customCellStyle}>Days Remaining</th>
              </tr>
            </thead>
            <tbody>
              {!loading && finalRows.map((crop: any) => (
                <tr key={crop.crop_id} className="text-gray-600">
                  <td className={customCellStyle}>{crop.crop_id}</td>
                  <td className={customCellStyle}>{crop.growth_stage}</td>
                  <td className={customCellStyle}>{crop.fertilizer_type}</td>
                  <td className={customCellStyle}>
                    {/* Joins schedules to keep the row height small */}
                    {crop.tasks[0]?.name}
                  </td>
                  <td className={customCellStyle}>{crop.expected_harvest_date}</td>
                  <td className={customCellStyle}>{crop.estimated_yield}</td>
                  <td className={customCellStyle}>
                    <span className="bg-[#DCFCE7] text-[#0D6D32] px-3 py-1 rounded-full text-[10px] font-bold">
                      {crop.tasks[0]?.days} days
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- CARDS SECTION: NO DUPLICATES --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {!loading && finalRows.map((crop: any) => (
          <div key={crop.crop_id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h4 className="text-[#27AE60] font-bold text-lg border-b border-gray-50 pb-2 mb-4">
              {crop.crop_id}
            </h4>
            
            {/* Vertical labels matching your design */}
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-xs font-medium">Growth Stage</p>
                <p className="text-gray-800 text-sm font-semibold">{crop.growth_stage}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs font-medium">Fertilizer Type</p>
                <p className="text-gray-800 text-sm font-semibold">{crop.fertilizer_type}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs font-medium">Application Schedule</p>
                <p className="text-gray-800 text-sm font-semibold">{crop.tasks[0]?.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs font-medium">Expected Harvest Date</p>
                <p className="text-gray-800 text-sm font-semibold">{crop.expected_harvest_date}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs font-medium">Estimated Yield</p>
                <p className="text-gray-800 text-sm font-semibold">{crop.estimated_yield}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs font-medium mb-1">Days Remaining</p>
                <span className="bg-[#DCFCE7] text-[#0D6D32] px-3 py-1 rounded text-[10px] font-bold inline-block">
                  {crop.tasks[0]?.days} days
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