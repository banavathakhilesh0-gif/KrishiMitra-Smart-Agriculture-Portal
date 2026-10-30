import React, { useState } from 'react';
import { 
  Sprout, 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  PhoneCall, 
  ShieldCheck, 
  LayoutDashboard, 
  Leaf, 
  Activity, 
  CloudSun, 
  TrendingUp, 
  FlaskConical, 
  Landmark, 
  MessageSquare
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Sprout },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'crop-advisor', label: 'AI Crop Advisor', icon: Leaf },
    { id: 'disease-detection', label: 'Disease Scan', icon: Activity },
    { id: 'weather', label: 'Weather', icon: CloudSun },
    { id: 'market-prices', label: 'Mandi Prices', icon: TrendingUp },
    { id: 'fertilizer-advisor', label: 'Fertilizer & Water', icon: FlaskConical },
    { id: 'government-schemes', label: 'Govt Schemes', icon: Landmark },
    { id: 'expert-support', label: 'Ask Expert', icon: MessageSquare },
  ];

  if (currentUser?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin Panel', icon: ShieldCheck });
  }

  const handleNavClick = (id: string) => {
    setCurrentPage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
      {/* Top Kisan Helpline Banner */}
      <div className="bg-emerald-950 text-emerald-100 text-xs px-4 py-1.5 flex justify-between items-center transition-colors">
        <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap">
          <span className="inline-flex items-center gap-1.5 font-medium text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Kisan Call Centre Toll-Free:
          </span>
          <a href="tel:18001801551" className="text-white hover:text-emerald-300 font-bold flex items-center gap-1">
            <PhoneCall className="w-3 h-3 text-emerald-400" />
            1800-180-1551
          </a>
          <span className="text-emerald-400/50 hidden md:inline">|</span>
          <span className="hidden md:inline text-emerald-200/90">
            Available 6:00 AM to 10:00 PM • 22 Indian Regional Languages
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-900/80 text-[11px] font-semibold text-emerald-200 border border-emerald-800">
            ICAR & Agri-Tech Aligned
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-xl tracking-tight text-emerald-950">
                  Krishi<span className="text-emerald-600">Mitra</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded">
                  Portal
                </span>
              </div>
              <p className="text-[10px] font-medium text-emerald-700/80 -mt-0.5">
                कृषि मित्र • Smart Agri Advisory
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-700 hover:text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-700'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Auth Section */}
          <div className="hidden sm:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2.5 bg-stone-100/90 border border-stone-200/80 pl-3 pr-1.5 py-1.5 rounded-xl">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-stone-900 leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] font-medium text-emerald-700 capitalize">
                    {currentUser.role === 'admin' ? '🛡️ Administrator' : `📍 ${currentUser.state || 'Punjab'}`}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white px-4 py-2 rounded-xl text-xs xl:text-sm font-bold shadow-md shadow-emerald-800/20 transition-all cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                Farmer Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            {!currentUser && (
              <button
                onClick={onOpenAuth}
                className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200"
              >
                Sign In
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-emerald-100 bg-white px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          {currentUser && (
            <div className="mb-4 p-3 bg-emerald-50/80 rounded-xl border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-900">{currentUser.name}</p>
                  <p className="text-xs text-emerald-800 font-medium">
                    {currentUser.role === 'admin' ? 'System Admin' : `${currentUser.state || 'Farmer'}, ${currentUser.district || 'India'}`}
                  </p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="text-xs text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-md font-semibold"
              >
                Logout
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-colors ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-700 hover:bg-emerald-50 hover:text-emerald-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-700'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
