import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LanguageModal from './components/LanguageModal';
import SMSFallbackModal from './components/SMSFallbackModal';

// Citizen Pages
import WelcomeScreen from './pages/WelcomeScreen';
import RegisterScreen from './pages/RegisterScreen';
import CitizenHome from './pages/CitizenHome';
import ReportFire from './pages/ReportFire';
import OfflineConfirmation from './pages/OfflineConfirmation';
import OnlineConfirmation from './pages/OnlineConfirmation';

// Official Pages
import OfficialDashboard from './pages/OfficialDashboard';
import IncidentDetail from './pages/IncidentDetail';
import PreviousHistory from './pages/PreviousHistory';
import InteractiveMapView from './pages/InteractiveMapView';

// Services
import { translations } from './services/translations';
import { 
  getUserProfile, 
  saveUserProfile, 
  getPendingOfflineReports, 
  syncOfflineReportsWithServer 
} from './services/offlineStorage';

export default function App() {
  const [userProfile, setUserProfile] = useState(() => getUserProfile());
  const [currentLang, setCurrentLang] = useState(() => userProfile.language || 'en');
  const [currentRole, setCurrentRole] = useState(() => userProfile.role || 'citizen');
  const [currentView, setCurrentView] = useState(() => {
    return userProfile.signedIn ? (userProfile.role === 'official' ? 'official-dashboard' : 'home') : 'welcome';
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState('AGN-101');
  const [lastSubmittedReport, setLastSubmittedReport] = useState(null);
  const [myReports, setMyReports] = useState([]);
  const [syncToast, setSyncToast] = useState(null);

  // Active translation dictionary
  const t = translations[currentLang] || translations.en;

  // Track online/offline status and automatic background sync
  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      const res = await syncOfflineReportsWithServer();
      if (res && res.count > 0) {
        setSyncToast(`📶 Reconnected! Automatically synced ${res.count} pending fire report(s) to district officials.`);
        setTimeout(() => setSyncToast(null), 6000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check for any pending reports from previous offline sessions
    getPendingOfflineReports().then(pending => {
      if (pending && pending.length > 0) {
        setMyReports(pending);
      }
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Language Change
  const handleSelectLanguage = (langCode) => {
    setCurrentLang(langCode);
    const updated = { ...userProfile, language: langCode };
    setUserProfile(updated);
    saveUserProfile(updated);
  };

  // Toggle role (Citizen <-> Official)
  const handleSwitchRole = () => {
    if (currentRole === 'citizen') {
      setCurrentRole('official');
      setCurrentView('official-dashboard');
    } else {
      setCurrentRole('citizen');
      setCurrentView('home');
    }
  };

  // Toggle Online/Offline state (for demonstration & hackathon testing)
  const handleToggleOnline = async () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    if (nextState) {
      const res = await syncOfflineReportsWithServer();
      if (res && res.count > 0) {
        setSyncToast(`📶 Back online! Synced ${res.count} offline report(s) to officials.`);
        setTimeout(() => setSyncToast(null), 5000);
      }
    }
  };

  // Select Role from Welcome Screen
  const handleWelcomeRole = (role) => {
    setCurrentRole(role);
    setCurrentView('register');
  };

  // Registration Complete
  const handleRegisterSuccess = (profile) => {
    setUserProfile(profile);
    if (profile.role === 'official') {
      setCurrentRole('official');
      setCurrentView('official-dashboard');
    } else {
      setCurrentRole('citizen');
      setCurrentView('home');
    }
  };

  // Handle report submission
  const handleReportSuccess = (reportData) => {
    setLastSubmittedReport(reportData);
    setMyReports(prev => [reportData, ...prev]);

    if (reportData.isOffline) {
      setCurrentView('offline-confirm');
    } else {
      setCurrentView('online-confirm');
    }
  };

  // Handle incident navigation
  const handleSelectIncident = (inc) => {
    setSelectedIncidentId(inc.id || 'AGN-101');
    setCurrentView('incident-detail');
  };

  return (
    <div className="min-h-screen bg-paper text-pine-950 flex flex-col">
      
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onSwitchRole={handleSwitchRole}
        onOpenLanguage={() => setIsLanguageModalOpen(true)}
        currentLang={currentLang}
        isOnline={isOnline}
        onToggleOnline={handleToggleOnline}
        t={t}
      />

      {/* Auto-Sync Toast Notification */}
      {syncToast && (
        <div className="bg-emerald-800 text-white text-xs font-semibold py-2.5 px-4 text-center animate-in fade-in slide-in-from-top shadow-md z-40">
          {syncToast}
        </div>
      )}

      {/* Main Container Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* If in Official Workspace, show matching Figma Dark Sidebar */}
        {currentRole === 'official' && (
          <div className="hidden md:block">
            <Sidebar
              currentView={currentView}
              onNavigate={(view) => {
                if (view === 'sms-gateway') {
                  setIsSmsModalOpen(true);
                } else {
                  setCurrentView(view);
                }
              }}
              t={t}
            />
          </div>
        )}

        {/* Content View Router */}
        <main className="flex-1 pb-12">
          
          {/* CITIZEN VIEWS */}
          {currentRole === 'citizen' && (
            <>
              {currentView === 'welcome' && (
                <WelcomeScreen 
                  onSelectRole={handleWelcomeRole}
                  onOpenSignIn={() => setCurrentView('register')}
                  t={t}
                />
              )}

              {currentView === 'register' && (
                <RegisterScreen
                  initialRole={currentRole}
                  onRegisterSuccess={handleRegisterSuccess}
                  onSignInClick={() => setCurrentView('home')}
                  t={t}
                />
              )}

              {currentView === 'home' && (
                <CitizenHome
                  userProfile={userProfile}
                  onUpdateProfile={(updated) => setUserProfile(updated)}
                  myReports={myReports}
                  onStartReport={() => setCurrentView('report')}
                  onOpenSms={() => setIsSmsModalOpen(true)}
                  isOnline={isOnline}
                  t={t}
                />
              )}

              {currentView === 'report' && (
                <ReportFire
                  userProfile={userProfile}
                  isOnline={isOnline}
                  onSubmitSuccess={handleReportSuccess}
                  onBack={() => setCurrentView('home')}
                  t={t}
                />
              )}

              {currentView === 'offline-confirm' && (
                <OfflineConfirmation
                  report={lastSubmittedReport}
                  onBackHome={() => setCurrentView('home')}
                  t={t}
                />
              )}

              {currentView === 'online-confirm' && (
                <OnlineConfirmation
                  report={lastSubmittedReport}
                  onBackHome={() => setCurrentView('home')}
                  t={t}
                />
              )}
            </>
          )}

          {/* OFFICIAL VIEWS */}
          {currentRole === 'official' && (
            <>
              {/* Mobile official tab navigation */}
              <div className="md:hidden flex border-b border-gray-200 bg-white px-2 py-2 text-xs font-semibold overflow-x-auto gap-2">
                <button
                  onClick={() => setCurrentView('official-dashboard')}
                  className={`px-3 py-1.5 rounded-full ${currentView === 'official-dashboard' ? 'bg-pine-900 text-white' : 'text-gray-600'}`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView('previous-history')}
                  className={`px-3 py-1.5 rounded-full ${currentView === 'previous-history' ? 'bg-pine-900 text-white' : 'text-gray-600'}`}
                >
                  History
                </button>
                <button
                  onClick={() => setCurrentView('interactive-map')}
                  className={`px-3 py-1.5 rounded-full ${currentView === 'interactive-map' ? 'bg-pine-900 text-white' : 'text-gray-600'}`}
                >
                  Satellite Map
                </button>
                <button
                  onClick={() => setIsSmsModalOpen(true)}
                  className="px-3 py-1.5 rounded-full text-gray-600 bg-gray-100"
                >
                  SMS Gateway
                </button>
              </div>

              {currentView === 'official-dashboard' && (
                <OfficialDashboard
                  onSelectIncident={handleSelectIncident}
                  t={t}
                />
              )}

              {currentView === 'incident-detail' && (
                <IncidentDetail
                  incidentId={selectedIncidentId}
                  onBack={() => setCurrentView('official-dashboard')}
                  t={t}
                />
              )}

              {currentView === 'previous-history' && (
                <PreviousHistory
                  onBackToDashboard={() => setCurrentView('official-dashboard')}
                  onSelectIncident={handleSelectIncident}
                  t={t}
                />
              )}

              {currentView === 'interactive-map' && (
                <InteractiveMapView
                  onSelectIncident={handleSelectIncident}
                  t={t}
                />
              )}
            </>
          )}

        </main>
      </div>

      {/* Language Selection Modal */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLang={currentLang}
        onSelectLang={handleSelectLanguage}
        t={t}
      />

      {/* SMS Emergency Fallback Simulation Modal */}
      <SMSFallbackModal
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
        t={t}
      />

    </div>
  );
}
