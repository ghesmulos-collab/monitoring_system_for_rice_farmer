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
        const res = await fetch('/api/crops');
        const data = await res.json();

        if (Array.isArray(data)) {
          const userSchedules = data.map((item: any) => {
            // Calculate days remaining until harvest
            const harvestDate = new Date(item.expected_harvest_date);
            const today = new Date();
            const diffTime = harvestDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return {
              id: item.crop_id,
              crop_id: item.crop_id,
              growth_stage: item.growth_stage || "N/A",
              fertilizer_type: item.fertilizer_type || "N/A",
              // Default schedule based on rice farming standards
              application_schedule: "Every 2-3 weeks",
              expected_harvest_date: item.expected_harvest_date || "N/A",
              estimated_yield: item.estimated_yield ? `${item.estimated_yield} tons` : "N/A",
              days_remaining: diffDays > 0 ? diffDays : 0
            };
          });
          setSchedules(userSchedules);
        }
      } catch (err) {
        console.error("Failed to load schedules:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-[#0D6D32] text-xl font-semibold mb-4">View Suggested Schedules</h2>

      {/* Table Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="text-gray-700 font-semibold text-sm">Fertilizer Schedule Recommendations</h3>
        </div>
        <div className="px-6 py-4 border-b border-gray-50">
        <section className="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-separate border-spacing-0">
            <thead className="bg-[#DCFCE7] text-gray-600 font-normal">
              <tr>
                <th className="px-6 py-3 font-semibold text-sm border-b  border-gray-300 last:border-r-0">Crop ID</th>
                <th className="px-6 py-3 font-semibold text-sm border-b  border-gray-300 last:border-r-0">Growth Stage</th>
                <th className="px-6 py-3 font-semibold text-sm border-b  border-gray-300 last:border-r-0">Fertilizer Type</th>
                <th className="px-6 py-3 font-semibold text-sm border-b  border-gray-300 last:border-r-0">Application Schedule</th>
                <th className="px-6 py-3 font-semibold text-sm border-b  border-gray-300 last:border-r-0">Expected Harvest Date</th>
                <th className="px-6 py-3 font-semibold text-sm border-b  border-gray-300 last:border-r-0">Estimated Yield</th>
                <th className="px-6 py-3 font-semibold text-sm border-b  border-gray-300 last:border-r-0">Days Remaining</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="p-10 text-center text-gray-400">Loading schedules...</td></tr>
              ) : schedules.map((s) => (
                <tr key={s.id} className=" text-gray-700">
                  <td className="px-5 py-4 font-normal text-gray-700 border-b  border-gray-300 last:border-r-0">{s.crop_id}</td>
                  <td className="px-5 py-4 font-normal text-gray-700 border-b border-gray-300 last:border-r-0">{s.growth_stage}</td>
                  <td className="px-5 py-4 font-normal text-gray-700 border-b  border-gray-300 last:border-r-0">{s.fertilizer_type}</td>
                  <td className="px-5 py-4 font-normal text-gray-700 border-b  border-gray-300 last:border-r-0">{s.application_schedule}</td>
                  <td className="px-5 py-4 font-normal text-gray-700 border-b  border-gray-300 last:border-r-0">{s.expected_harvest_date}</td>
                  <td className="px-5 py-4 font-normal text-gray-700 border-b  border-gray-300 last:border-r-0 ">{s.estimated_yield}</td>
                  <td className="px-5 py-4 font-normal text-gray-700 border-b  border-gray-300 last:border-r-0">
                    <span className="bg-[#E9F7EF] text-[#27AE60] px-3 py-1 rounded-full text-xs font-bold">
                      {s.days_remaining} days
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </section>
        </div>
      </section>

      {/* Cards Section */}
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedules.map((s) => (
          <div 
            key={s.id} 
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
          >
            {/* HEADER: Color reaches side ends */}
            <div className="bg-[#E9F7EF] w-full px-6 py-4 border-b border-gray-100">
              <h4 className="font-normal text-[#016630] text-lg">
                {s.crop_id}
              </h4>
            </div>

              {/* CONTENT AREA: All fields included now */}
            <div className="p-6 space-y-4 flex-1">
              <div className="flex flex-col">
                <span className="text-gray-400 text-[10px] font-semibold ">Growth Stage</span>
                <span className="text-black font-normal">{s.growth_stage}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-gray-400 text-[10px] font-semibold">Fertilizer Type</span>
                <span className="text-black font-normal">{s.fertilizer_type}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-gray-400 text-[10px] font-semibold ">Application Schedule</span>
                <span className="text-black font-normal">{s.application_schedule}</span>
              </div>

              {/* NEW: Expected Harvest Date */}
              <div className="flex flex-col">
                <span className="text-gray-400 text-[10px] font-semibold">Expected Harvest Date</span>
                <span className="text-black font-normal">{s.expected_harvest_date}</span>
              </div>

              {/* NEW: Estimated Yield */}
              <div className="flex flex-col">
                <span className="text-gray-400 text-[10px] font-semibold ">Estimated Yield</span>
                <span className="text-black font-normal">{s.estimated_yield}</span>
              </div>

              <div className="pt-2">
                <span className="bg-[#E9F7EF] text-[#27AE60] px-4 py-1.5 rounded-full text-xs font-semibold inline-block">
                  {s.days_remaining} days remaining
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