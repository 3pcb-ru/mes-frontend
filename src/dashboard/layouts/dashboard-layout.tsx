import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardHeader } from '../components/header';
import { DashboardSidebar } from '../components/sidebar';

import { useAuth } from '@/features/auth/store/auth.store';
import { AiChatComponent } from '@/features/vibe/components/ai-chat';

export function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { detailedProfile, fetchProfile, isLoadingProfile } = useAuth();

    useEffect(() => {
        const isIncomplete = detailedProfile && detailedProfile.organizationId && !detailedProfile.organization;
        if ((!detailedProfile || isIncomplete) && !isLoadingProfile) {
            fetchProfile();
        }
    }, [detailedProfile, fetchProfile, isLoadingProfile]);

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Sidebar */}
            <DashboardSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            {/* Main content */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
                <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                <main className="p-4 md:p-6">
                    <Outlet />
                </main>
            </div>

            {/* AI Vibe Assistant */}
            <AiChatComponent />
        </div>
    );
}
