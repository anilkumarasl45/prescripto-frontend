import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Calendar, LogOut } from "lucide-react";

import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    navigate("/");
    setShowDropdown(false);
  };

  const navItems = [
    { path: "/", label: "HOME" },
    { path: "/doctors", label: "DOCTORS" },
    { path: "/about", label: "ABOUT" },
    { path: "/contact", label: "CONTACT" },
    { path: "/blogs", label: "BLOGS" },
  ];

  const dropdownItems = [
    { icon: User, label: "My Profile", action: () => navigate("/profile") },
    { icon: Calendar, label: "My Appointments", action: () => navigate("/my-appointments") },
    { icon: LogOut, label: "Logout", action: logout },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm"
    >
      <div className="flex items-center justify-between py-3 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="cursor-pointer"
        >
          <img className="w-32 sm:w-36 md:w-44 h-auto" src={assets.logo} alt="Logo" />
        </motion.div>

        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `relative py-2 px-3 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-primary"
                      : "text-neutral-700 hover:text-primary"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {token && userData ? (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 p-2 rounded-xl hover:bg-neutral-100 transition-colors"
              >
                <img
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-primary/20"
                  src={userData.image}
                  alt="Profile"
                />
                <motion.div
                  animate={{ rotate: showDropdown ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="hidden lg:block"
                >
                  <svg className="w-4 h-4 text-neutral-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 sm:w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-neutral-200 py-2 z-50"
                  >
                    {dropdownItems.map((item, index) => (
                      <motion.button
                        key={item.label}
                        whileHover={{ backgroundColor: "#f8fafc" }}
                        onClick={() => {
                          item.action();
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left text-neutral-700 hover:text-primary transition-colors text-sm"
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="font-medium">{item.label}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="hidden sm:block bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-300"
            >
              Create Account
            </motion.button>
          )}

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMenu(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-700" />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex items-center justify-between max-h-screen p-4 sm:p-6 border-b border-neutral-200 bg-white">
                <img className="w-28 sm:w-32" src={assets.logo} alt="Logo" />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowMenu(false)}
                  className="p-2 rounded-xl hover:bg-neutral-100 transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-700" />
                </motion.button>
              </div>

              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-white h-full">
                {token && userData ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 sm:p-4 bg-neutral-50 rounded-xl">
                      <img
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-primary/20"
                        src={userData.image}
                        alt="Profile"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-neutral-800 text-sm sm:text-base truncate">{userData.name}</p>
                        <p className="text-xs sm:text-sm text-neutral-500 truncate">{userData.email}</p>
                      </div>
                    </div>
                    {dropdownItems.map((item, index) => (
                      <motion.button
                        key={item.label}
                        whileHover={{ x: 5 }}
                        onClick={() => {
                          item.action();
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 p-3 text-left text-neutral-700 hover:text-primary hover:bg-neutral-50 rounded-xl transition-colors"
                      >
                        <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-medium text-sm sm:text-base">{item.label}</span>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      navigate("/login");
                      setShowMenu(false);
                    }}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base hover:shadow-lg transition-all duration-300"
                  >
                    Create Account
                  </motion.button>
                )}

                <div className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <NavLink
                        to={item.path}
                        onClick={() => setShowMenu(false)}
                        className={({ isActive }) =>
                          `block p-3 rounded-xl font-medium transition-colors text-sm sm:text-base ${
                            isActive
                              ? "bg-primary text-white"
                              : "text-neutral-700 hover:bg-neutral-100"
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;