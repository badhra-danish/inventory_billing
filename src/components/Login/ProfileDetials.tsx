import React from "react";
import { createPortal } from "react-dom";
import {
  X,
  Mail,
  Shield,
  Smartphone,
  Globe,
  MapPin,
  Calendar,
  Camera,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export default function ProfileModal({
  isOpen,
  onClose,
  user,
}: ProfileModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 1. Backdrop Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* 2. Modal Container */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 bg-white/20 hover:bg-white/40 dark:bg-slate-800/50 rounded-full text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header/Cover Image Section */}
        <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
          <div className="absolute -bottom-12 left-8 flex items-end gap-5">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl border-4 border-white dark:border-slate-900 bg-slate-100 flex items-center justify-center text-4xl font-bold text-blue-600 shadow-xl overflow-hidden">
                {user?.name?.charAt(0) || "A"}
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                <Camera size={16} />
              </button>
            </div>
            <div className="mb-2 pb-1">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                {user?.name || "John Anderson"}
              </h2>
              <p className="text-slate-500 font-medium mt-1">
                {user?.role?.replace("_", " ") || "Administrator"}
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="pt-16 px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            {/* Left Column: Personal Info */}
            <div className="space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Account Details
              </h4>

              <InfoRow
                icon={<Mail size={18} />}
                label="Email Address"
                value={user?.email || "admin@starhardware.com"}
              />
              <InfoRow
                icon={<Smartphone size={18} />}
                label="Phone Number"
                value={user?.shop?.phone}
              />
              <InfoRow
                icon={<MapPin size={18} />}
                label="Location"
                value={user?.shop?.address}
              />
            </div>

            {/* Right Column: System Info */}
            <div className="space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                System Permissions
              </h4>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="text-green-500" size={20} />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Full System Access
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your account has Super Admin privileges. you can manage
                  products, users, and financial reports.
                </p>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-xl py-6">
                  <Edit2 size={16} className="mr-2" /> Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl py-6 border-slate-200"
                >
                  <Calendar size={16} className="mr-2" /> Activity Log
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            <Globe size={12} /> Last Login: Today, 12:45 PM
          </div>
          <div className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">
            STAR Hardware ERP v2.0
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 text-blue-500 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
}
