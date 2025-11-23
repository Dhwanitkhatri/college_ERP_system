import React from "react";
import { ArrowLeft, Moon } from "lucide-react";
import { Link } from "react-router-dom";

function KnowMore() {
  return (
    <div className="min-h-screen w-screen bg-white p-6 md:p-10">
      <div className="max-w-[1400px] mx-auto mb-8 flex justify-between items-center">
        <Link to="/AboutUs">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            <span className="text-[15px] font-normal text-gray-900">Back</span>
          </button>
        </Link>

        <button className="p-2.5 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
          <Moon className="w-5 h-5 text-gray-900" strokeWidth={2} />
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto px-4">
        <h1 className="text-[26px] md:text-[28px] font-normal text-gray-900 text-center mb-6">
          Our Team
        </h1>

        <p className="text-[16px] leading-[1.8] text-gray-700 text-center mb-10 max-w-[920px] mx-auto">
          Meet the talented individuals who brought this College ERP System to
          life. Each team member contributed their unique skills and expertise
          to create a comprehensive solution.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1300px] mx-auto">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-7">
            <h2 className="text-[18px] font-medium text-gray-900 mb-2">
              Dhwanit Khatri
            </h2>
            <p className="text-[15px] text-gray-600 mb-5">Backend Developer</p>

            <div className="mb-5">
              <h3 className="text-[15px] text-gray-600 mb-2">Contribution:</h3>
              <p className="text-[15px] leading-[1.7] text-gray-700">
                Led the project development, designed and implemented the
                database architecture, developed RESTful APIs, and ensured
                seamless integration between frontend and backend systems. Also
                managed project timelines and coordinated team activities.
              </p>
            </div>

            <div>
              <h3 className="text-[15px] text-gray-600 mb-2">Expertise:</h3>
              <p className="text-[15px] text-gray-700">
                Node.js, MongoDB, API Design
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-7">
            <h2 className="text-[18px] font-medium text-gray-900 mb-2">
              Aayush Bhavsar
            </h2>
            <p className="text-[15px] text-gray-600 mb-5">
              Frontend Developer & UI/UX Designer
            </p>

            <div className="mb-5">
              <h3 className="text-[15px] text-gray-600 mb-2">Contribution:</h3>
              <p className="text-[15px] leading-[1.7] text-gray-700">
                Designed the user interface and user experience for all system
                modules. Implemented responsive frontend components using React
                and Tailwind CSS. Created interactive dashboards and ensured
                cross-browser compatibility and accessibility standards.
              </p>
            </div>

            <div>
              <h3 className="text-[15px] text-gray-600 mb-2">Expertise:</h3>
              <p className="text-[15px] text-gray-700">
                React, Tailwind CSS, Figma
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-7">
            <h2 className="text-[18px] font-medium text-gray-900 mb-2">
              Jiken Patel
            </h2>
            <p className="text-[15px] text-gray-600 mb-5">Database Designer</p>

            <div className="mb-5">
              <h3 className="text-[15px] text-gray-600 mb-2">Contribution:</h3>
              <p className="text-[15px] leading-[1.7] text-gray-700">
                Developed key features including the student management module,
                attendance tracking system, and grade management interface.
                Implemented authentication and authorization systems. Conducted
                code reviews and maintained code quality standards.
              </p>
            </div>

            <div>
              <h3 className="text-[15px] text-gray-600 mb-2">Expertise:</h3>
              <p className="text-[15px] text-gray-700">
                React, Express.js, SQL
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-7">
            <h2 className="text-[18px] font-medium text-gray-900 mb-2">
              Yug Panchal
            </h2>
            <p className="text-[15px] text-gray-600 mb-5">Frontend Developer</p>

            <div className="mb-5">
              <h3 className="text-[15px] text-gray-600 mb-2">Contribution:</h3>
              <p className="text-[15px] leading-[1.7] text-gray-700">
                Created comprehensive test cases and performed extensive testing
                of all system modules. Identified and reported bugs, ensuring
                system reliability. Prepared technical documentation, user
                manuals, and conducted user training sessions.
              </p>
            </div>

            <div>
              <h3 className="text-[15px] text-gray-600 mb-2">Expertise:</h3>
              <p className="text-[15px] text-gray-700">React , Tailwind CSS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KnowMore;
