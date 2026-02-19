import React from "react";
import { useForm } from "react-hook-form";
import { Save } from "lucide-react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";

const UpdateAttendanceFaculty = () => {
  // this is the react hook form part
  const { register } = useForm({
    defaultValues: {
      class_id: "",
      date: new Date().toISOString().split("T")[0], // today's date
      subject_id: "",
      lecture_no: "",
    },
  });

  // this is the dummu data for the design
  const studentList = [
    { student_id: "2024001", name: "John Doe", status: "Present" },
    { student_id: "2024002", name: "Jane Smith", status: "Present" },
    { student_id: "2024003", name: "Mike Johnson", status: "Absent" },
    { student_id: "2024004", name: "Sarah Williams", status: "Present" },
    { student_id: "2024005", name: "David Brown", status: "Absent" },
  ];

  const classesList = [
    { id: 1, class_id: "CS-A" },
    { id: 2, class_id: "CS-B" },
    { id: 3, class_id: "IT-A" },
  ];

  const subjectList = [
    { subject_id: "101", subject_name: "Data Structures" },
    { subject_id: "102", subject_name: "Database Management" },
    { subject_id: "103", subject_name: "Operating Systems" },
  ];

  const lectureList = [1, 2, 3, 4, 5];

  // this is the Dummy summary counts
  const presentCount = 3;
  const absentCount = 2;

  return (
    // main desinging part start from here
    <DashboardChildPageTemplate
      title="Update Attendance"
      desc="Modify student attendance records"
      width="max-w-7xl"
    >
      <div className="mainDiv pb-20 space-y-6">
        <div className="gridDiv grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* this is the class select card */}
          <DashboardChildPageCard>
            <div className="classDiv flex flex-col h-full justify-center">
              <label className="custom-label mb-2">Select Class</label>
              <select
                {...register("class_id")}
                className="custom-input bg-[var(--bg-primary)] theme-transition"
              >
                <option value="">Choose class</option>
                {classesList.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.class_id}
                  </option>
                ))}
              </select>
            </div>
          </DashboardChildPageCard>

          {/* this is the Date Picker Card */}
          <DashboardChildPageCard>
            <div className="dateDiv flex flex-col h-full justify-center">
              <label className="custom-label mb-2">Date</label>
              <div className="inputDiv relative">
                <input
                  type="date"
                  {...register("date")}
                  className="custom-input w-full bg-[var(--bg-primary)] theme-transition"
                />
              </div>
            </div>
          </DashboardChildPageCard>

          {/*  this is the Subject selection Card */}
          <DashboardChildPageCard>
            <div className="flex flex-col h-full justify-center">
              <label className="custom-label mb-2">Select Subject</label>
              <select
                {...register("subject_id")}
                className="custom-input bg-[var(--bg-primary)] theme-transition"
              >
                <option value="">Choose subject</option>
                {subjectList.map((sub) => (
                  <option key={sub.subject_id} value={sub.subject_id}>
                    {sub.subject_name}
                  </option>
                ))}
              </select>
            </div>
          </DashboardChildPageCard>

          {/* this is the  lecture Selection Card */}
          <DashboardChildPageCard>
            <div className="flex flex-col h-full justify-center">
              <label className="custom-label mb-2">Select Lecture</label>
              <select
                {...register("lecture_no")}
                className="custom-input bg-[var(--bg-primary)] theme-transition"
              >
                <option value="">Choose lecture</option>
                {lectureList.map((lec) => (
                  <option key={lec} value={lec}>
                    Lecture {lec}
                  </option>
                ))}
              </select>
            </div>
          </DashboardChildPageCard>

          {/* this is the present and absent summary card */}
          <DashboardChildPageCard>
            <div className="summaryDiv flex flex-col h-full justify-center">
              <span className="custom-label mb-2">Attendance Summary</span>
              <div className="statusDiv text-lg font-medium pt-1">
                <span className="text-green-600 dark:text-green-400">
                  Present: {presentCount}
                </span>
                <span className="mx-2 text-[var(--text-light)]">|</span>
                <span className="text-red-500 dark:text-red-400">
                  Absent: {absentCount}
                </span>
              </div>
            </div>
          </DashboardChildPageCard>
        </div>

        {/* the mai table is start from here */}
        <DashboardChildPageCard className="overflow-hidden p-0">
          <div className="tableDiv overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-light)] bg-gray-50 dark:bg-gray-800/50">
                  <th className="p-4 font-semibold text-[var(--text-primary)] text-sm">
                    Roll No
                  </th>
                  <th className="p-4 font-semibold text-[var(--text-primary)] text-sm">
                    Student Name
                  </th>
                  <th className="p-4 font-semibold text-[var(--text-primary)] text-sm w-32">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                {studentList.map((item) => (
                  <tr
                    key={item.student_id}
                    className="hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <td className="p-4 text-[var(--text-secondary)] text-sm">
                      {item.student_id}
                    </td>
                    <td className="p-4 text-[var(--text-secondary)] text-sm">
                      {item.name}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-4 py-1.5 rounded-md text-sm font-medium w-24 text-center inline-block ${
                          item.status === "Present"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardChildPageCard>

        {/* this is the update button part */}
        <div className="buttonDiv flex justify-end pt-1">
          <button
            type="button"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--btn-primary-bg)",
              color: "var(--btn-primary-text)",
            }}
          >
            <Save size={18} />
            Update Attendance
          </button>
        </div>
      </div>
    </DashboardChildPageTemplate>
  );
};

export default UpdateAttendanceFaculty;
