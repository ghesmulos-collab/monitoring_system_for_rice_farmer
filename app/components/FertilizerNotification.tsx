"use client";
import React, { useState, useEffect } from 'react';

interface Notification {
  id: string;
  crop_id: string;
  fertilizer_type: string;
  application_date: string;
  message: string;
  isRead: boolean;
}

const FertilizerNotification: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchYourInput = async () => {
      try {
        const res = await fetch('/api/crops');
        const data = await res.json();

        if (Array.isArray(data)) {
          const userRecords = data.map((item: any) => ({
            id: item.crop_id,
            crop_id: item.crop_id,
            // Match the exact column names from your database
            fertilizer_type: item.fertilizer_type || "N/A",
            application_date: item.application_date || "N/A",
            message: `Apply ${item.fertilizer_type || 'Fertilizer'} today for Crop ID ${item.crop_id}.`,
            isRead: false 
          }));
          
          setNotifications(userRecords);
        }
      } catch (err) {
        console.error("Failed to load records:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchYourInput();
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  return (
    <div className="space-y-8">
      <h2 className="text-[#0D6D32] text-xl font-semibold mb-4 tracking-tight">Fertilizer Notification</h2>

      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="text-gray-700 font-semibold text-sm">Fertilizer Application Reminders</h3>
        </div>
        <div className="px-6 py-4 border-b border-gray-50">
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#DCFCE7] text-gray-600 font-semibold">
              <tr>
                <th className="px-6 py-3 font-semibold border-r border-gray-100">Crop ID</th>
                <th className="px-6 py-3 font-semibold border-r border-gray-100">Fertilizer Type</th>
                <th className="px-6 py-3 font-semibold border-r border-gray-100">Application Date</th>
                <th className="px-6 py-3 font-semibold border-r border-gray-100">Notification Message</th>
                <th className="px-6 py-3 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400 italic">Fetching your data...</td></tr>
              ) : notifications.length > 0 ? (
                notifications.map((n) => (
                  <tr key={n.id} className="text-gray-700 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 border-r border-gray-50">{n.crop_id}</td>
                    <td className="px-6 py-4 border-r border-gray-50">{n.fertilizer_type}</td>
                    <td className="px-6 py-4 border-r border-gray-50">{n.application_date}</td>
                    <td className="px-6 py-4 border-r border-gray-50 flex items-center gap-2">
                      {!n.isRead && <span className="w-2 h-2 bg-[#27AE60] rounded-full"></span>}
                      {n.message}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {n.isRead ? (
                        <span className="text-gray-400 italic text-xs">Read</span>
                      ) : (
                        <button 
                          onClick={() => handleMarkAsRead(n.id)}
                          className="text-[#0D6D32] border border-[#0D6D32] px-3 py-1 rounded hover:bg-green-50 text-xs font-semibold transition-all"
                        >
                          Mark as Read
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400 italic">
                    No records found in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </section>
        </div>
      </section>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notifications.filter(n => !n.isRead).map((n) => (
          <div 
            key={n.id} 
            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex"
          >
            {/* 1. THE GREEN VERTICAL BAR: Starts from the very top */}
            <div className="w-1.5 bg-[#27AE60] shrink-0" />

            {/* 2. RIGHT SIDE CONTENT CONTAINER */}
            <div className="flex-1 flex flex-col p-6">
              {/* Header Title: No green background, just clean text */}
              <h4 className="font-semibold text-gray-800 mb-4 text-sm">
                {n.fertilizer_type} - {n.crop_id}
              </h4>

              {/* Message and Schedule */}
              <div className="mb-4">
                <p className="font-normal text-sm text-gray-800 mb-2">
                  {n.message}
                </p>
                <p className="text-[10px] text-gray-400 font-semibold tracking-widest">
                  Scheduled: {n.application_date}
                </p>
              </div>

              {/* Action Button */}
              <div>
                <button 
                  onClick={() => handleMarkAsRead(n.id)}
                  className="bg-[#0D6D32] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#0a5628] transition-all"
                >
                  Mark as Read
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FertilizerNotification;