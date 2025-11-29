
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Landing, About, Learn } from './pages/Views';
import { Blog } from './pages/Blog';
import { Support } from './pages/Support';
import { UserDashboard } from './components/UserDashboard';
import { ReportModal } from './components/ReportModal';
import { AuthModal } from './components/AuthModal';
import { PageView, User } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('landing');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check local storage for theme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
       setIsDarkMode(true);
    }
    
    // Check local storage for user session
    const storedUser = localStorage.getItem('safehaven_user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLogin = (newUser: User) => {
      setUser(newUser);
      localStorage.setItem('safehaven_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('safehaven_user');
      if (currentPage === 'dashboard' || currentPage === 'admin') {
          setCurrentPage('landing');
      }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <Landing 
            onNavigate={setCurrentPage} 
            onOpenReport={() => setIsReportModalOpen(true)} 
          />
        );
      case 'about':
        return <About />;
      case 'blog':
        return <Blog currentUser={user} />;
      case 'support':
        return <Support currentUser={user} onOpenAuth={() => setIsAuthModalOpen(true)} />;
      case 'learn':
        return <Learn />;
      case 'dashboard':
        return <UserDashboard currentUser={user} />;
      default:
        return (
          <Landing 
            onNavigate={setCurrentPage} 
            onOpenReport={() => setIsReportModalOpen(true)} 
          />
        );
    }
  };

  return (
    <>
      <Layout 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        currentUser={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      >
        {renderPage()}
      </Layout>
      
      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        currentUser={user}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </>
  );
}

export default App;