import React from 'react';
import { useMockData } from '../context/MockDataContext';
import { Bell, LogOut, User as UserIcon, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { currentUser, logout } = useMockData();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = {
    student: [
      { path: '/student', label: 'Dashboard' },
      { path: '/student/raise', label: 'Raise Complaint' },
    ],
    faculty: [
      { path: '/faculty', label: 'Dashboard' },
    ],
    admin: [
      { path: '/admin', label: 'Dashboard' },
    ]
  };

  const currentLinks = currentUser ? navLinks[currentUser.role] : [];

  return (
    <div className="min-h-screen flex flex-col bg-light-50">
      {/* Header */}
      <header className="bg-navy-900 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-navy-800"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gold-500 rounded-md flex items-center justify-center font-bold text-navy-900 text-sm">
                  GV
                </div>
                <span className="font-bold hidden sm:block tracking-wider">GVPIHLR | Smart Complaint System</span>
                <span className="font-bold sm:hidden tracking-wider">SCS</span>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {currentLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path ? 'bg-royal-600 text-white' : 'text-slate-300 hover:bg-navy-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-300 hover:text-white relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-300 border-l border-navy-700 pl-4">
                <UserIcon className="w-4 h-4" />
                <span>{currentUser?.name}</span>
              </div>
              <button 
                onClick={logout}
                className="p-2 text-slate-300 hover:text-red-400 transition-colors ml-2"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-800 border-t border-navy-700 text-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {currentLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path ? 'bg-royal-600' : 'hover:bg-navy-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">{title}</h1>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
};

export default Layout;
