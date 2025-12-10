import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Moon } from "lucide-react";
import ThemeButton from "../ui/Buttons/ThemeButton";
import { useTheme } from "../context/ThemeContext";

function AboutUs() {
  const { theme } = useTheme();
  return (
    <div className="min-h-screen w-screen bg-[--aboutUs-bg] dark:bg-[--aboutUs-bg] p-6 md:p-10">
      <div className="max-w-[95%] mx-auto mb-12 flex justify-between items-center">
        <Link to="/">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <ArrowLeft className={`w-4 h-4 stroke-[2.5] ${theme === "light" ? "text-black" : "text-white"}`}/>
            <span className="text-[15px] font-normal text-gray-900 dark:text-gray-100">Back</span>
          </button>
        </Link>

        <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <ThemeButton />
        </button>
      </div>

      <div className="max-w-[70%] mx-auto px-4">
        <h1 className="text-[26px] md:text-[28px] font-normal text-gray-900 dark:text-gray-100 text-center mb-10">
          About Our College ERP System
        </h1>

        <div className="space-y-5 mb-14">
          <p className="text-[16px] leading-[1.8] text-gray-700 dark:text-gray-300">
            Welcome to our comprehensive College Enterprise Resource Planning
            (ERP) System. This innovative platform is designed to streamline and
            automate various administrative and academic processes within
            educational institutions.
          </p>

          <p className="text-[16px] leading-[1.8] text-gray-700 dark:text-gray-300">
            Our ERP system integrates multiple functionalities including student
            management, faculty administration, course scheduling, attendance
            tracking, grade management, and financial operations into a single
            unified platform. This integration ensures seamless data flow across
            all departments and reduces redundancy in daily operations.
          </p>

          <p className="text-[16px] leading-[1.8] text-gray-700 dark:text-gray-300">
            Built with modern web technologies, our system prioritizes user
            experience, security, and scalability. Whether you're an
            administrator managing institutional data, a faculty member tracking
            student progress, or a student accessing academic resources, our
            platform provides intuitive interfaces tailored to your specific
            needs.
          </p>

          <p className="text-[16px] leading-[1.8] text-gray-700 dark:text-gray-300">
            The system features role-based access control, ensuring that
            sensitive information is protected while allowing authorized users
            to access the tools and data they need. Real-time updates and
            notifications keep all stakeholders informed about important events,
            deadlines, and announcements.
          </p>

          <p className="text-[16px] leading-[1.8] text-gray-700 dark:text-gray-300">
            Our mission is to empower educational institutions with technology
            that enhances efficiency, improves communication, and supports
            better decision-making through comprehensive data analytics and
            reporting capabilities.
          </p>
        </div>

        <div className="flex justify-center">
          <Link to="/KnowMore">
            <button className="px-7 py-3 bg-black dark:bg-white text-white dark:text-black text-[15px] font-normal rounded-lg hover:bg-gray-900 dark:hover:bg-gray-200 transition-colors">
              Know More About Us
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
