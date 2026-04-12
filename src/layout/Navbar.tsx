import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Search,
  Mail,
  Bell,
  Settings,
  Moon,
  Sun,
  User,
  LogOut,
  ChevronDown,
  CreditCard,
  Shield,
} from "lucide-react";
import { useTheme } from "@/context/DarkthemProvider";
import { useAuth } from "@/context/authContext";
import ProfileModal from "@/components/Login/ProfileDetials";

export default function ERPNavbar({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  return (
    <>
      <nav className="sticky top-2 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md bg-opacity-80 rounded-lg mr-1">
        <div className="px-4 h-16 flex items-center justify-between">
          {/* Left Section: Branding & Toggle */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={toggleSidebar}
            >
              <Menu size={20} />
            </Button>

            {/* Search Bar - Professional Desktop Look */}
            <div className="hidden md:flex items-center relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                size={16}
              />
              <input
                type="text"
                placeholder="Search everything..."
                className="pl-10 pr-4 py-2 w-64 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Right Section: Actions & Profile */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </Button>

            {/* Messages */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-600 dark:text-slate-400 rounded-full"
              >
                <Mail size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              </Button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-600 dark:text-slate-400 rounded-full"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 px-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                  4
                </span>
              </Button>
            </div>

            {/* Divider */}
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block"></div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                  {user?.name?.charAt(0) || "A"}
                </div>
                <div className="hidden lg:block text-left leading-none">
                  <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">
                    {user?.name || "Admin User"}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter mt-0.5">
                    {user?.role?.replace("_", " ")}
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Account Dialog / Dropdown */}
              {isProfileOpen && (
                <>
                  {/* Backdrop to close when clicking outside */}
                  <div
                    className="fixed inset-0 z-[-1]"
                    onClick={() => setIsProfileOpen(false)}
                  ></div>

                  <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in duration-150">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 truncate">
                        {user?.email || "admin@starhardware.com"}
                      </p>
                    </div>

                    <div className="p-1">
                      <button
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        onClick={() => setProfileOpen(true)}
                      >
                        <User size={16} /> My Profile
                      </button>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 p-1 mt-1">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <ProfileModal
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
          user={user}
        />
      </nav>
    </>
  );
}
