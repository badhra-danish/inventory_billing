import { Button } from "@/components/ui/button";
import {
  ChevronsLeft,
  Search,
  Mail,
  Bell,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "@/context/DarkthemProvider";
export default function ERPNavbar({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  // const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  // const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm h-18 w-full">
      <div className="px-4 sm:px-3 h-18">
        <div className="flex items-center justify-between h-18">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Sidebar Toggle */}
            <Button
              className="p-1.5   rounded-full text-white transition-colors"
              onClick={toggleSidebar}
            >
              <ChevronsLeft size={20} />
            </Button>

            {/* Search Bar */}
            <div className="relative hidden sm:block">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search"
                className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-0.5 text-xs font-semibold text-gray-500 bg-white border border-gray-200 rounded">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
            >
              {theme === "light" ? <Moon /> : <Sun />}
            </button>
            {/* Mail */}
            <button className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
              <Mail size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                1
              </span>
            </button>

            {/* Settings */}
            <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
              <Settings size={20} />
            </button>

            {/* Profile */}
            {/* <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-lg overflow-hidden hover:ring-2 hover:ring-gray-200 transition-all"
              >
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                        alt="Profile"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          John Anderson
                        </p>
                        <p className="text-xs text-gray-500">Admin</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      My Profile
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Account Settings
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Preferences
                    </a>
                  </div>
                  <div className="border-t border-gray-200 py-2">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Sign Out
                    </a>
                  </div>
                </div>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </nav>
  );
}
