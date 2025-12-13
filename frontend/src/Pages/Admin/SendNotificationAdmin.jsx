import React from "react";
import {
  ArrowLeft,
  ChevronDown,
  Send,
  Mail,
  Users,
  Calendar,
} from "lucide-react";
import NavigateBackButton from "../../ui/Buttons/NavigateBackButton";

export default function SendNotificationAdmin() {
  return (
    <div className="mainDiv min-h-max bg-white dark:bg-[#000000] p-4 md:p-8 font-sans transition-colors duration-200">
      <div className="headerDiv max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <NavigateBackButton />
          <div className="titleDiv">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-[#f3f4f6]">
              Send Notifications
            </h1>
            <p className="text-gray-500 dark:text-[#9ca3af] mt-1">
              Send announcements and notifications to students and faculty
            </p>
          </div>
        </div>

        <div className="contentDiv space-y-6 border border-gray-200 dark:border-[#1F2937] rounded-lg p-6">
          <div className="gridDiv grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="sendToDiv flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Send To{" "}
                <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <div className="optionDiv relative">
                <select className="w-full border border-gray-300 dark:border-[#1F2937] rounded-md px-3 py-2.5 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-[#f3f4f6] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none cursor-pointer">
                  <option>All Users</option>
                  <option>All Students</option>
                  <option>All Faculty</option>
                  <option>Specific Class</option>
                  <option>Individual User</option>
                </select>
                <div className="downIconDiv absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-500 dark:text-[#9ca3af]" />
                </div>
              </div>
            </div>
            
          </div>
          <div className="titleDiv flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Title <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter notification title"
              className="w-full border border-gray-300 dark:border-[#1F2937] rounded-md px-3 py-2.5 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-[#f3f4f6] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="messageDiv flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Message <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <textarea
              rows={6}
              placeholder="Enter your message here..."
              className="w-full border border-gray-300 dark:border-[#1F2937] rounded-md px-3 py-2.5 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-[#f3f4f6] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
            />
          </div>
          <div className="notificationButton flex flex-col sm:flex-row gap-4 pt-2">
            <button className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black px-6 py-2.5 rounded-md text-sm font-medium transition-colors">
              <Send size={16} />
              Send Notification
            </button>

            <button className="px-6 py-2.5 rounded-md text-sm font-medium text-gray-700 dark:text-[#f3f4f6] bg-white dark:bg-transparent border border-gray-300 dark:border-[#1F2937] hover:bg-gray-50 dark:hover:bg-[#1F2937] transition-colors">
              Save as Draft
            </button>
          </div>
        </div>

        <div className="recentNotification mt-12">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-[#f3f4f6] mb-4">
            Recent Notifications
          </h2>

          <div className="notificationDiv flex flex-col gap-3">
            <div className="Noti-1 flex items-center p-4 border border-gray-200 dark:border-[#1F2937] rounded-lg bg-white dark:bg-[#1a1a1a]">
              <div className="shrink-0 h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Mail size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900 dark:text-[#f3f4f6]">
                  Exam Schedule Released
                </p>
                <p className="text-xs text-gray-500 dark:text-[#9ca3af] mt-0.5">
                  All Students • 2 hours ago
                </p>
              </div>
            </div>
            <div className="Noti-2 flex items-center p-4 border border-gray-200 dark:border-[#1F2937] rounded-lg bg-white dark:bg-[#1a1a1a]">
              <div className="shrink-0 h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Users size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900 dark:text-[#f3f4f6]">
                  Faculty Meeting Tomorrow
                </p>
                <p className="text-xs text-gray-500 dark:text-[#9ca3af] mt-0.5">
                  All Faculty • 1 day ago
                </p>
              </div>
            </div>
            <div className="Noti-3 flex items-center p-4 border border-gray-200 dark:border-[#1F2937] rounded-lg bg-white dark:bg-[#1a1a1a]">
              <div className="shrink-0 h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Calendar size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900 dark:text-[#f3f4f6]">
                  Holiday Announcement
                </p>
                <p className="text-xs text-gray-500 dark:text-[#9ca3af] mt-0.5">
                  All Users • 2 days ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
