"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EditFarmerRecord from '../components/EditFarmerRecord';
import InputCropDetails from '../components/InputCropDetails';
import UpdateActualYield from '../components/UpdateActualYield';
import ViewCropStatus from '../components/ViewCropStatus';
import FertilizerNotification from '../components/FertilizerNotification';
import ViewSuggestedSchedules from '../components/ViewSuggestedSchedules';
import GenerateCropDetailsReports from '../components/GenerateCropDetailsReports';

interface SidebarLinkProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState('edit-farmer');
  const [loggedInId, setLoggedInId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  useEffect(() => {
    const storedId = localStorage.getItem('farmerId');
    if (!storedId) {
      router.push('/');
    } else {
      setLoggedInId(storedId);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('farmerId');
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-[#f8faf9] overflow-hidden font-sans relative">
      
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#006d2e] text-white flex flex-col shrink-0 transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 text-xl font-bold border-b border-white/10 flex justify-between items-center">
          <span>Menu</span>
          {/* Close Button (Mobile Only) */}
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="lg:hidden text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarLink label="Edit Farmer Record" active={activeView === 'edit-farmer'} onClick={() => { setActiveView('edit-farmer'); setIsSidebarOpen(false); }} />
          <SidebarLink label="Input Crop Details" active={activeView === 'crop'} onClick={() => { setActiveView('crop'); setIsSidebarOpen(false); }} />
          <SidebarLink label="Update Actual Yield" active={activeView === 'yield'} onClick={() => { setActiveView('yield'); setIsSidebarOpen(false); }} />
          <SidebarLink label="View Crop Status" active={activeView === 'status'} onClick={() => { setActiveView('status'); setIsSidebarOpen(false); }} />
          <SidebarLink label="Fertilizer Notification" active={activeView === 'notif'} onClick={() => { setActiveView('notif'); setIsSidebarOpen(false); }} />
          <SidebarLink label="View Suggested Schedules" active={activeView === 'schedules'} onClick={() => { setActiveView('schedules'); setIsSidebarOpen(false); }} />
          <SidebarLink label="Generate Crop Details Reports" active={activeView === 'reports'} onClick={() => { setActiveView('reports'); setIsSidebarOpen(false); }} />
        </nav>
        
        <div className="p-4 mt-auto">
          <button 
            onClick={handleLogout} 
            className="flex items-center justify-center w-full p-3 bg-[#008137] hover:bg-[#005a26] rounded-lg text-sm font-semibold transition-all shadow-md"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-10 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Hamburger Menu Button (Mobile Only) */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-[#006d2e] hover:bg-gray-100 rounded-md text-2xl"
            >
              &#9776;
            </button>
            <h2 className="text-[#006d2e] font-semibold text-base lg:text-xl tracking-tight truncate max-w-[200px] sm:max-w-none">
              Rice Farmers System
            </h2>
          </div>
          <div className="text-gray-500 text-[11px] lg:text-[13px] hidden sm:block">
            Logged in: <span className="text-[#008137] font-bold ml-1">Farmer</span>
          </div>
        </header>

        {/* Dynamic Content Section */}
        <section className="flex-1 overflow-y-auto p-4 lg:p-10 bg-[#f8faf9]">
          <div className="max-w-[1400px] mx-auto">
            {activeView === 'edit-farmer' && <EditFarmerRecord />}
            {activeView === 'crop' && <InputCropDetails />}
            {activeView === 'yield' && <UpdateActualYield />}
            {activeView === 'status' && <ViewCropStatus />}
            {activeView === 'notif' && <FertilizerNotification />}
            {activeView === 'schedules' && <ViewSuggestedSchedules />}
            {activeView === 'reports' && <GenerateCropDetailsReports />}
            
            {!['edit-farmer', 'crop', 'yield', 'status', 'notif', 'schedules', 'reports'].includes(activeView) && (
              <div className="bg-white p-10 lg:p-20 rounded-2xl shadow-sm border border-gray-100 text-center">
                <h3 className="text-[#006d2e] text-2xl font-bold mb-2 capitalize">
                  {activeView.replace('-', ' ')}
                </h3>
                <p className="text-gray-400 italic">This module is currently under development.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function SidebarLink({ label, active, onClick }: SidebarLinkProps) {
  return (
    <button 
      onClick={onClick} 
      className={`w-full text-left px-4 py-3 rounded-md text-[14px] leading-tight transition-all duration-200 
        ${active 
          ? 'bg-[#008137] border-l-4 border-white font-bold text-white' 
          : 'text-white/80 hover:bg-white/10 hover:text-white'
        }`}
    >
      {label}
    </button>
  );
}