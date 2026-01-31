import React from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { Save } from "lucide-react";
const studentList = [
  { id: 1, rollNo: "001", name: "Aayush Bhavsar", status: "Present" },
  { id: 2, rollNo: "002", name: "Dhwanit Khatri", status: "Absent" },
  { id: 3, rollNo: "003", name: "Jiken Patel", status: "Present" },
  { id: 4, rollNo: "004", name: "Yug Panchal", status: "Absent" },
  { id: 5, rollNo: "005", name: "Riddhi Patel", status: "Absent" },
];
function TakeAttendanceFaculty() {
  return (
    <DashboardChildPageTemplate
      title="Take Attendance"
      desc="Mark student attendance for your class"
      width="max-w-7xl"
    >
      <div className="mainDiv pb-20 space-y-6">
        <div className="gridDiv grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardChildPageCard>
            <div className="classDiv flex flex-col h-full justify-center">
              <label className="custom-label mb-2">Select Class</label>
              <select className="custom-input bg-[var(--bg-primary)] theme-transition">
                <option>Choose class</option>
                <option>SY-BCA-A</option>
                <option>SY-BCA-B</option>
                <option>SY-BCA-C</option>
                <option>TY-BCA-A</option>
                <option>TY-BCA-B</option>
                <option>TY-BCA-C</option>
              </select>
            </div>
          </DashboardChildPageCard>
          <DashboardChildPageCard>
            <div className="dateDiv flex flex-col h-full justify-center">
              <label className="custom-label mb-2">Date</label>
              <div className="inputDiv relative">
                <input
                  type="date"
                  className="custom-input w-full bg-[var(--bg-primary)] theme-transition"
                />
              </div>
            </div>
          </DashboardChildPageCard>
          <DashboardChildPageCard>
            <div className="summaryDiv flex flex-col h-full justify-center">
              <span className="custom-label mb-2">Attendance Summary</span>
              <div className="statusDiv text-lg font-medium pt-1">
                <span className="text-green-600 dark:text-green-400">
                  Present: 2
                </span>
                <span className="mx-2 text-[var(--text-light)]">|</span>
                <span className="text-red-500 dark:text-red-400">
                  Absent: 3
                </span>
              </div>
            </div>
          </DashboardChildPageCard>
        </div>
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
                    key={item.id}
                    className="hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <td className="p-4 text-[var(--text-secondary)] text-sm">
                      {item.rollNo}
                    </td>
                    <td className="p-4 text-[var(--text-secondary)] text-sm">
                      {item.name}
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors w-24 text-center ${
                          item.status === "Present"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {item.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardChildPageCard>
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
            Save Attendance
          </button>
        </div>
      </div>
    </DashboardChildPageTemplate>
  );
}

export default TakeAttendanceFaculty;
