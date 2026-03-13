import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, TrendingUp } from 'lucide-react';
import { useAuthContext } from '../../modules/auth/context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/valuation', label: 'Valuation' },
    { to: '/sentiment', label: 'Sentiment' },
    { to: '/fraud-detection', label: 'Fraud Detection' },
    { to: '/recommendations', label: 'Recommendations' },
  ];

  const utilityItems = [
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600/20 text-primary-300">
                <TrendingUp className="h-4 w-4" />
              </span>
              <span className="text-xl font-semibold tracking-tight text-white">StockSense</span>
            </Link>

            <div className="ml-8 hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-500/15 text-primary-300'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {utilityItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-md px-2.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary-300'
                      : 'text-slate-300 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="flex items-center gap-3 border-l border-white/10 pl-4">
              {isAuthenticated ? (
                <>
                  <span className="max-w-[160px] truncate text-sm text-slate-400" title={user?.email}>
                    {user?.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="rounded-md border border-white/20 px-3 py-1.5 text-sm font-medium text-slate-200 transition-colors hover:border-white/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            className="inline-flex items-center justify-center rounded-md border border-white/20 p-2 text-slate-300 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 md:hidden"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="border-t border-white/10 py-4 md:hidden">
            <div className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-500/15 text-primary-300'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <div className="my-3 border-t border-white/10" />

              {utilityItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary-300'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <div className="mt-4 flex items-center gap-3 px-1">
                {isAuthenticated ? (
                  <>
                    <span className="max-w-[140px] truncate text-sm text-slate-400" title={user?.email}>
                      {user?.email}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="rounded-md border border-white/20 px-3 py-1.5 text-sm font-medium text-slate-200 transition-colors hover:border-white/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-500"
                    >
                      Get started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
