import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DashboardChildPageTemplate from "../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../ui/Cards/DashboardChildPageCard";
import { Calendar, FileText, ArrowLeft, SofaIcon } from "lucide-react";
import api from "../api/axios.js";
import { useEffect } from "react";
const formatTimetable = (data) => {
  const days = Object.keys(data);
  const timeSlots = [
  { start: "09:00:00", end: "09:55:00" },
  { start: "10:00:00", end: "10:55:00" },
  { start: "11:00:00", end: "11:55:00" },
  { start: "12:00:00", end: "12:55:00" },
  { start: "13:00:00", end: "13:55:00" },
  { start: "14:00:00", end: "14:55:00" }
];


  return days.map(day => ({
    day,
    slots: timeSlots.map(slot => {
      const lecture = (data[day] || []).find(
        lec =>
          lec.start_time === slot.start &&
          lec.end_time === slot.end
      );

      return {
        start: slot.start,
        end: slot.end,
        subject: lecture?.Subject?.subject_name || "",
        faculty: lecture?.Faculty?.name || ""
      };
    })
  }));
};



export default function ViewTimetable() {
  {
    /* this is the state and form part of the code */
  }
  const [activeTab, setActiveTab] = useState("menu");
  const [classes , setClasses]=useState([]);
  const [lectureData  ,setLectureDate]=useState([]);
  const { register, watch, setValue } = useForm();
  const selectedClass = watch("selectedClass");
  const token = localStorage.getItem("token");
  useEffect(() => {
    api
      .get("api/timetables/current-year-classes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setClasses(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
      });
  }, []);
  useEffect(() => {
  if (!selectedClass) return;

  api
    .get(`api/timetables/class/${selectedClass}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response.data);
      const formatted = formatTimetable(response.data);
      setLectureDate(formatted);
      
      console.log(formatted);
    })
    .catch((error) => {
      console.error("Error fetching timetable:", error);
    });
}, [selectedClass]);

  
  {
    /* this is the handler for the reset button */
  }
  const handleReset = () => {
    setActiveTab("menu");
    setValue("selectedClass", "");
  };
  {
    /* main designing start from here */
  }

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
                    View regular class schedule
                  </p>
                </div>
              </div>
            </div>

            {/* this is the exam card but it is just visual  */}
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

        {/* this is the lecture table part  */}
        {activeTab === "lecture" && (
          <DashboardChildPageCard>
            {/* this is the header part of the lecture table*/}
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

            {/* this is the dropdown logic for the table*/}
            <div className="mb-6 max-w-xs">
              <label className="custom-label mb-2">Select Class</label>
              <select
                className="custom-input bg-[var(--bg-primary)]"
                {...register("selectedClass")}
              >
                <option value="">Choose a class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.class_id} semester {cls.semester}
                  </option>
                ))}
              </select>
            </div>

            {/* the table coding start from here */}
            {selectedClass && (
              <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
                    {/* below is the main logic of the table */}
                    <tr>
                      <th className="px-6 py-4 border-b dark:border-gray-700">
                        Day
                      </th>
                      {lectureData.length > 0 &&lectureData[0].slots.map((slot, i) => (
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
                            className={`px-6 py-4 border-r dark:border-gray-700 min-w-[150px] ${
                              slot.subject === "Lunch Break"
                                ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/10 font-medium text-center"
                                : "text-gray-600 dark:text-gray-300"
                            }`}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {slot.subject}
                              </span>
                              {slot.faculty !== "-" && (
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
            )}
          </DashboardChildPageCard>
        )}
      </div>
    </DashboardChildPageTemplate>
  );
}
