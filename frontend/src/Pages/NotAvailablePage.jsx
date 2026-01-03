import React from "react";
import { Construction } from "lucide-react";
import DashboardChildPageTemplate from "../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../ui/Cards/DashboardChildPageCard";

const NotAvailablePage = () => {
  return (
    <DashboardChildPageTemplate
      title="Coming Soon"
      desc="This feature is not available yet"
      width="max-w-4xl"
    >
      <DashboardChildPageCard>
        <div className="flex flex-col items-center justify-center min-h-[350px] text-center gap-4 px-4">
          
          {/* Icon */}
          <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700">
            <Construction size={48} className="text-gray-500 dark:text-gray-300" />
          </div>

          {/* Heading */}
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Coming Soon 🚧
          </h2>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-300 max-w-md">
            We are currently working on this section.  
            This feature is under development and will be available soon.
          </p>

          {/* Optional subtle hint */}
          <p className="text-sm text-gray-400">
            Thank you for your patience.
          </p>

        </div>
      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
};

export default NotAvailablePage;
