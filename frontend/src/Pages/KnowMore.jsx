import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeButton from "../ui/Buttons/ThemeButton";
import { useTheme } from "../context/ThemeContext";

function KnowMore() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black p-6 md:p-10 transition-colors duration-200 font-sans">
      <div className="max-w-7xl mx-auto mb-10 flex justify-between items-center">
        <Link to="/AboutUs">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-lg hover:bg-gray-50 dark:hover:bg-[#222] transition-all shadow-sm">
            <ArrowLeft
              className={`w-4 h-4 stroke-[2.5] ${
                theme === "light" ? "text-gray-700" : "text-gray-200"
              }`}
            />
            <span className="text-[15px] font-medium text-gray-700 dark:text-gray-200">
              Back
            </span>
          </button>
        </Link>

        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-full p-1 shadow-sm">
          <ThemeButton />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white text-center mb-4">
          Our Team
        </h1>

        <p className="text-[16px] leading-relaxed text-gray-600 dark:text-gray-400 text-center mb-12 max-w-3xl mx-auto">
          Meet the talented individuals who brought this College ERP System to
          life. Each team member contributed their unique skills and expertise
          to create a comprehensive solution.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Dhwanit */}
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Dhwanit Khatri
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Backend Developer
              </p>
            </div>

            <div className="h-px bg-gray-100 dark:bg-[#222] w-full mb-4"></div>

            <div className="mb-4">
              <h3 className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1.5">
                Contribution:
              </h3>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                This member focused entirely on backend development, building
                the core logic and server-side functionality of the ERP system.
                They ensured smooth data processing, API handling, and system
                performance. Their contribution formed the backbone of the
                project.
              </p>
            </div>

            <div className="h-px bg-gray-100 dark:bg-[#222] w-full mb-4"></div>

            <div>
              <h3 className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1.5">
                Expertise:
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                Node.js , MySQL , API Design
              </p>
            </div>
          </div>

          {/* Card 2: Aayush */}
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Aayush Bhavsar
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Frontend Developer & UI/UX Designer
              </p>
            </div>

            <div className="h-px bg-gray-100 dark:bg-[#222] w-full mb-4"></div>

            <div className="mb-4">
              <h3 className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1.5">
                Contribution:
              </h3>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                This member handled all major frontend development tasks,
                turning ideas into responsive screens and functional layouts.
                They also designed the overall UI, focusing on clarity,
                usability, and smooth user experience. Their work shaped how
                users interact with the ERP.
              </p>
            </div>

            <div className="h-px bg-gray-100 dark:bg-[#222] w-full mb-4"></div>

            <div>
              <h3 className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1.5">
                Expertise:
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                React, Tailwind CSS , Figma
              </p>
            </div>
          </div>

          {/* Card 3: Jiken */}
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Jiken Patel
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Database Designer & Backend Support
              </p>
            </div>

            <div className="h-px bg-gray-100 dark:bg-[#222] w-full mb-4"></div>

            <div className="mb-4">
              <h3 className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1.5">
                Contribution:
              </h3>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                This member mainly managed the database structure, queries, and
                data relationships essential for the ERP system. They also
                provided small backend support where needed. Their work ensured
                data accuracy, security, and proper integration with the
                backend.
              </p>
            </div>

            <div className="h-px bg-gray-100 dark:bg-[#222] w-full mb-4"></div>

            <div>
              <h3 className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1.5">
                Expertise:
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                Node.js , Express.js , MySQL
              </p>
            </div>
          </div>

          {/* Card 4: Yug */}
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Yug Panchal
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                UI Implementation & Frontend Development
              </p>
            </div>

            <div className="h-px bg-gray-100 dark:bg-[#222] w-full mb-4"></div>

            <div className="mb-4">
              <h3 className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1.5">
                Contribution:
              </h3>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                This member worked on implementing the designed UI into fully
                functional frontend components. They ensured the screens matched
                the design and delivered a clean, consistent interface. Their
                contribution helped finalize the visual and interactive elements
                of the project.
              </p>
            </div>

            <div className="h-px bg-gray-100 dark:bg-[#222] w-full mb-4"></div>

            <div>
              <h3 className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1.5">
                Expertise:
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                React js , Tailwind CSS
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KnowMore;
