import React, { useState, useEffect } from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { Calendar, FileText, ArrowLeft } from "lucide-react";
import api from "../../api/axios.js";

/* ---------------- Format Timetable Function ---------------- */
const formatTimetable = (data) => {
  const days = Object.keys(data);

  const timeSlots = [
    { start: "09:00:00", end: "09:55:00" },
    { start: "10:00:00", end: "10:55:00" },
    { start: "11:00:00", end: "11:55:00" },
    { start: "12:00:00", end: "12:55:00" },
    { start: "13:00:00", end: "13:55:00" },
    { start: "14:00:00", end: "14:55:00" },
  ];

  return days.map((day) => ({
    day,
    slots: timeSlots.map((slot) => {
      const lecture = (data[day] || []).find(
        (lec) =>
          lec.start_time === slot.start && lec.end_time === slot.end
      );

      return {
        start: slot.start,
        end: slot.end,
        subject: lecture?.Subject?.subject_name || "",
        faculty: lecture?.Faculty?.name || lecture?.Class?.class_id || "",
      };
    }),
  }));
};

const ViewTimeTableStudent = () => {
  /* ---------------- this is the state part ---------------- */
  const [activeTab, setActiveTab] = useState("menu");
  const [lectureData, setLectureData] = useState([]);
  const token = localStorage.getItem("token");

  /* ---------------- Fetch timetable automatically ---------------- */
  useEffect(() => {
    if (activeTab !== "lecture") return;

    api
      .get("/api/timetables/my-timetable", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const formatted = formatTimetable(response.data);
        console.log(formatted)
        setLectureData(formatted);
      })
      .catch((error) => {
        console.error("Error fetching timetable:", error);
      });
  }, [activeTab]);

  /* ---------------- this is the handler for back button ---------------- */
  const handleReset = () => {
    setActiveTab("menu");
  };

  /* ---------------- main designing start from here ---------------- */

  return (
    <DashboardChildPageTemplate
      title="View Timetable"
      desc="Select timetable type to view schedule"
      width="max-w-6xl"
    >
      <div className="pb-20 space-y-6">

        {/* this is the main menu card */}
        {activeTab === "menu" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* this is the lecture card */}
            <div
              onClick={() => setActiveTab("lecture")}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer"
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="h-16 w-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Lecture Timetable
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    View your class schedule
                  </p>
                </div>
              </div>
            </div>

            {/* this is the exam card but it is just visual */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-60">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="h-16 w-16 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Exam Timetable
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Coming Soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* this is the lecture table part */}
        {activeTab === "lecture" && (
          <DashboardChildPageCard>

            {/* this is the header part of the lecture table */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={handleReset}
                className="p-2 -ml-2 rounded-full text-gray-600 dark:text-gray-400"
              >
                <ArrowLeft size={24} />
              </button>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Lecture Schedule
              </h3>
            </div>

            {/* the table coding start from here */}
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
                  <tr>
                    <th className="px-6 py-4 border-b dark:border-gray-700">
                      Day
                    </th>
                    {lectureData.length > 0 &&
                      lectureData[0].slots.map((slot, i) => (
                        <th
                          key={i}
                          className="px-6 py-4 border-b dark:border-gray-700 whitespace-nowrap"
                        >
                          {slot.start}
                        </th>
                      ))}
                  </tr>
                </thead>

                <tbody>
                  {lectureData.map((dayRow, i) => (
                    <tr
                      key={i}
                      className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white border-r dark:border-gray-700">
                        {dayRow.day}
                      </td>

                      {dayRow.slots.map((slot, j) => (
                        <td
                          key={j}
                          className="px-6 py-4 border-r dark:border-gray-700 min-w-[150px] text-gray-600 dark:text-gray-300"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {slot.subject}
                            </span>
                            {slot.faculty && (
                              <span className="text-xs opacity-70 mt-1">
                                {slot.faculty}
                              </span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </DashboardChildPageCard>
        )}
      </div>
    </DashboardChildPageTemplate>
  );
};

export default ViewTimeTableStudent;