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
    const fetchNotifications = async () => {
      try {
        // ✅ FIXED: correct API source
        const res = await fetch('/api/notifications');
        const data = await res.json();

        if (Array.isArray(data)) {
          const userRecords = data.map((item: any) => ({
            // ✅ FIXED: use real DB columns
            id: item.notification_id,
            crop_id: item.crop_id,
            fertilizer_type: item.recommended_fertilizer,
            application_date: item.application_date,
            message: item.notification_message,
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

    fetchNotifications();
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  return (
    <div className="space-y-8">
      <h2 className="text-[#0D6D32] text-xl font-semibold mb-4 tracking-tight">
        Fertilizer Notification
      </h2>

      {/* Table Section (UNCHANGED DESIGN) */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="text-gray-700 font-semibold text-sm">
            Fertilizer Application Reminders
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#DCFCE7] text-gray-600 font-semibold">
              <tr>
                <th className="px-6 py-3">Crop ID</th>
                <th className="px-6 py-3">Fertilizer Type</th>
                <th className="px-6 py-3">Application Date</th>
                <th className="px-6 py-3">Notification Message</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center p-10 text-gray-400">
                    Fetching your data...
                  </td>
                </tr>
              ) : notifications.length > 0 ? (
                notifications.map((n) => (
                  <tr key={n.id} className="text-gray-700">
                    <td className="px-6 py-4">{n.crop_id}</td>
                    <td className="px-6 py-4">{n.fertilizer_type}</td>
                    <td className="px-6 py-4">{n.application_date}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      {!n.isRead && <span className="w-2 h-2 bg-[#27AE60] rounded-full"></span>}
                      {n.message}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {n.isRead ? (
                        <span className="text-gray-400 text-xs">Read</span>
                      ) : (
                        <button
                          onClick={() => handleMarkAsRead(n.id)}
                          className="text-[#0D6D32] border border-[#0D6D32] px-3 py-1 rounded text-xs"
                        >
                          Mark as Read
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-10 text-gray-400">
                    No records found in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Cards Section (UNCHANGED DESIGN) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notifications.filter(n => !n.isRead).map((n) => (
          <div
            key={n.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex"
          >
            <div className="w-1.5 bg-[#27AE60]" />

            <div className="flex-1 p-6">
              <h4 className="font-semibold text-gray-800 mb-4 text-sm">
                {n.fertilizer_type} - {n.crop_id}
              </h4>

              <p className="text-sm text-gray-800 mb-2">
                {n.message}
              </p>

              <p className="text-[10px] text-gray-400 font-semibold">
                Scheduled: {n.application_date}
              </p>

              <button
                onClick={() => handleMarkAsRead(n.id)}
                className="mt-4 bg-[#0D6D32] text-white px-4 py-2 rounded-lg text-xs"
              >
                Mark as Read
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FertilizerNotification;