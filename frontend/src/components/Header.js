import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b-0 border-slate-800 rounded-none bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-light to-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand/20 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 group-hover:to-white transition-colors">
                Nitro<span className="text-brand-light">Scan</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-slate-800/50">
                  Dashboard
                </Link>
                <Link to="/scanner" className="text-sm font-medium text-brand-light hover:text-brand transition-colors px-3 py-2 rounded-lg hover:bg-brand/10">
                  Scanner
                </Link>
                <div className="h-6 w-px bg-slate-700 mx-2 hidden sm:block"></div>
                <Link to="/profile" className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex flex-col justify-center items-center overflow-hidden">
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-300 hidden sm:block group-hover:text-white transition-colors">
                    {user?.username}
                  </span>
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.reload();
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors focus:outline-none"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-premium px-5 py-2 text-sm shadow-brand/20 shadow-lg">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;