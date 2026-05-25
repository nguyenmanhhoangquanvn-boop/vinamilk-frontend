import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiUser, FiLogOut, FiShoppingCart, FiHeart,
  FiSettings, FiPackage, FiMenu, FiX, FiChevronDown,
  FiBookOpen, FiAward,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ThemeToggle from "./ThemeToggle";

// ΓöÇΓöÇΓöÇ Avatar initials ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const Avatar = ({ name }) => {
  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(-2).join("").toUpperCase()
    : "U";
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-sky-400
                    flex items-center justify-center text-white text-sm font-bold shadow-md select-none">
      {initials}
    </div>
  );
};

// ΓöÇΓöÇΓöÇ Navbar ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const Navbar = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef(null);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    setDropOpen(false);
    logout();
    toast.success("─É├ú ─æ─âng xuß║Ñt th├ánh c├┤ng!");
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Trang chß╗º" },
    { to: "/products", label: "Sß║ún phß║⌐m" },
    { to: "/categories", label: "Danh mß╗Ñc" },
    { to: "/blog", label: "Blog" },
    { to: "/about", label: "Giß╗¢i thiß╗çu" },
  ];

  const dropItems = [
    { icon: FiUser, label: "Hß╗ô s╞í c├í nh├ón", to: "/profile" },
    { icon: FiPackage, label: "─É╞ín h├áng cß╗ºa t├┤i", to: "/orders" },
    { icon: FiAward, label: "Vinamilk Rewards", to: "/rewards" },
  ];

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <nav
      className={`sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md
        border-b border-slate-100 dark:border-slate-700 transition-all duration-300
        ${scrolled ? "shadow-md shadow-slate-200/50 dark:shadow-slate-900/50" : "shadow-sm"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-sky-400 rounded-xl
                          flex items-center justify-center font-black text-white text-base shadow
                          group-hover:shadow-blue-300 dark:group-hover:shadow-blue-900 transition-shadow">
            V
          </div>
          <span className="font-black text-blue-700 dark:text-blue-400 text-lg tracking-wide hidden sm:block">
            Vinamilk
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={label}
              to={to}
              className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all
                ${isActive(to)
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                  : "text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800"
                }`}
            >
              {label}
              {isActive(to) && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <ThemeToggle size="sm" />

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400
                       hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all"
          >
            <FiShoppingCart size={20} />
            {totalItems > 0 && (
              <motion.span
                key={totalItems}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white
                           text-[9px] font-black rounded-full flex items-center justify-center px-1"
              >
                {totalItems > 99 ? "99+" : totalItems}
              </motion.span>
            )}
          </Link>

          {isLoggedIn ? (
            /* Avatar dropdown */
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl
                           hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <Avatar name={user?.fullName} />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight max-w-[100px] truncate">
                    {user?.fullName || "T├ái khoß║ún"}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight max-w-[100px] truncate">
                    {user?.email}
                  </p>
                </div>
                <FiChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform hidden sm:block ${dropOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {dropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl
                               border border-slate-100 dark:border-slate-700 overflow-hidden z-50"
                  >
                    {/* User info header */}
                    <div className="px-4 py-3.5 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-slate-800 dark:to-slate-800
                                    border-b border-slate-100 dark:border-slate-700">
                      <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{user?.fullName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1.5">
                      {dropItems.map(({ icon: Icon, label, to }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setDropOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300
                                     hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400
                                     transition-all font-medium"
                        >
                          <Icon size={15} className="text-slate-400" />
                          {label}
                        </Link>
                      ))}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-slate-100 dark:border-slate-700 p-1.5">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400
                                   hover:bg-red-50 dark:hover:bg-slate-800 rounded-xl transition-all font-semibold"
                      >
                        <FiLogOut size={15} />
                        ─É─âng xuß║Ñt
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Login / Register buttons */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400
                           border border-blue-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-800
                           transition-all hidden sm:block"
              >
                ─É─âng nhß║¡p
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all shadow-sm hover:shadow-md"
                style={{ background: "linear-gradient(90deg,#0057b8,#0099e6)" }}
              >
                ─É─âng k├╜
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400
                       hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            aria-label="Toggle mobile menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mobileOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={label}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
                    ${isActive(to)
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                >
                  {label}
                </Link>
              ))}

              {isLoggedIn && (
                <>
                  <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1" />
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300
                               hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-all"
                  >
                    <FiUser size={14} /> Hß╗ô s╞í c├í nh├ón
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300
                               hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-all"
                  >
                    <FiPackage size={14} /> ─É╞ín h├áng cß╗ºa t├┤i
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold
                               text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 transition-all text-left"
                  >
                    <FiLogOut size={14} /> ─É─âng xuß║Ñt
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
