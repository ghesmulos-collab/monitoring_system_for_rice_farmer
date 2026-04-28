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
        const res = await fetch('/api/notifications');
        const data = await res.json();

        if (Array.isArray(data)) {
          const userRecords = data.map((item: any) => ({
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

  // --- FIXED DE-DUPLICATION LOGIC ---
  const uniqueNotifications = Array.from(
    notifications.reduce((map, obj) => {
      const existing = map.get(obj.crop_id);
      if (!existing || (!obj.isRead && existing.isRead)) {
        map.set(obj.crop_id, obj);
      }
      return map;
    }, new Map<string, Notification>()).values()
  );

  const customCellStyle = "px-6 py-4 font-normal text-xs border-b border-gray-100 last:border-r-0";

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-[#0D6D32] text-xl font-semibold tracking-tight">
        Fertilizer Notification
      </h2>

      {/* --- TABLE SECTION --- */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="text-gray-700 font-medium text-sm">
            Fertilizer Application Reminders
          </h3>
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-sm border-separate border-spacing-0">
            <thead className="bg-[#DCFCE7] text-gray-700">
              <tr>
                <th className={`${customCellStyle} font-semibold first:rounded-l-lg`}>Crop ID</th>
                <th className={`${customCellStyle} font-semibold`}>Fertilizer Type</th>
                <th className={`${customCellStyle} font-semibold`}>Application Date</th>
                <th className={`${customCellStyle} font-semibold`}>Notification Message</th>
                <th className={`${customCellStyle} font-semibold text-center last:rounded-r-lg`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center p-10 text-gray-400">Loading...</td></tr>
              ) : (
                uniqueNotifications.map((n) => (
                  <tr key={n.id} className="text-gray-600 hover:bg-gray-50/50">
                    <td className={customCellStyle}>{n.crop_id}</td>
                    <td className={customCellStyle}>{n.fertilizer_type}</td>
                    <td className={customCellStyle}>{n.application_date}</td>
                    <td className={`${customCellStyle} flex items-center gap-3`}>
                      {!n.isRead && <span className="w-2 h-2 bg-[#27AE60] rounded-full shrink-0" />}
                      <span className={n.isRead ? "text-gray-400" : "text-gray-700"}>{n.message}</span>
                    </td>
                    <td className={`${customCellStyle} text-center`}>
                      {n.isRead ? (
                        <span className="text-gray-400 text-xs italic">Read</span>
                      ) : (
                        <button
                          onClick={() => handleMarkAsRead(n.id)}
                          className="text-[#0D6D32] border border-[#0D6D32] px-4 py-1 rounded-md text-[11px] font-bold hover:bg-[#0D6D32] hover:text-white transition-all"
                        >
                          Mark as Read
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- CARDS SECTION: DESIGN MATCHING --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
        {uniqueNotifications.filter(n => !n.isRead).map((n) => (
          <div
            key={n.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex min-h-[150px]"
          >
            <div className="w-1.5 bg-[#27AE60]" />
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-gray-800 text-sm mb-3">
                  {n.fertilizer_type} - {n.crop_id}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  {n.message}
                </p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Scheduled: {n.application_date}
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => handleMarkAsRead(n.id)}
                  className="bg-[#0D6D32] text-white px-6 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-[#0a5a29] transition-all"
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