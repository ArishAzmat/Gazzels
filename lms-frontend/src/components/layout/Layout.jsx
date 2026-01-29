import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-0">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden overflow-y-auto w-full max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
