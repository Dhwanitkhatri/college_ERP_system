import React, { useEffect, useState } from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import api from "../../api/axios";

const ViewAttendanceReportStudent = () => {

  // ===============================
  // STATE MANAGEMENT
  // ===============================

  const [studentData, setStudentData] = useState(null);
  const [subjectWiseData, setSubjectWiseData] = useState([]);
  const [overallPercentage, setOverallPercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  // ===============================
  // FETCH ATTENDANCE DATA
  // ===============================

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(
        `/api/attendance/student`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const currentStudent = res.data.students;

      if (!currentStudent) {
        setLoading(false);
        return;
      }

      setStudentData(currentStudent);
      setSubjectWiseData(currentStudent.subject_wise);

      // ✅ Calculate overall percentage
      const percentage =
        currentStudent.total_classes > 0
          ? (
              (currentStudent.present /
                currentStudent.total_classes) *
              100
            ).toFixed(2)
          : 0;

      setOverallPercentage(percentage);
      setLoading(false);

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // ===============================
  // LOADING STATE
  // ===============================

  if (loading) {
    return (
      <DashboardChildPageTemplate
        title="View Attendance"
        desc="Track your attendance subject-wise"
      >
        <DashboardChildPageCard>
          <p style={{ color: "var(--text-secondary)" }}>
            Loading attendance...
          </p>
        </DashboardChildPageCard>
      </DashboardChildPageTemplate>
    );
  }

  return (
    <DashboardChildPageTemplate
      title="View Attendance"
      desc="Track your attendance subject-wise"
    >

      {/* ===============================
          OVERALL ATTENDANCE CARD
      =============================== */}
      <DashboardChildPageCard>

        <div
          className="p-6 rounded-xl"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-light)"
          }}
        >
          <h2
            className="text-xl font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Overall Attendance
          </h2>

          {studentData && (
            <p
              className="text-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              {overallPercentage}%{" "}
              <span style={{ color: "var(--text-muted)" }}>
                ({studentData.present}/{studentData.total_classes} classes)
              </span>
            </p>
          )}
        </div>

      </DashboardChildPageCard>

      {/* ===============================
          SUBJECT-WISE TABLE
      =============================== */}
      <DashboardChildPageCard className="mt-4">

        <div className="table-wrapper">
          <table className="min-w-full border-collapse">

            <thead className="sticky-header">
              <tr>
                <th className="table-row-style">Subject</th>
                <th className="table-row-style">Total Classes</th>
                <th className="table-row-style">Present</th>
                <th className="table-row-style">Absent</th>
                <th className="table-row-style">Percentage</th>
              </tr>
            </thead>

            <tbody>
              {subjectWiseData.length > 0 ? (
                subjectWiseData.map((subject, index) => {

                  const percentage =
                    subject.total_classes > 0
                      ? (
                          (subject.present /
                            subject.total_classes) *
                          100
                        ).toFixed(2)
                      : 0;

                  return (
                    <tr key={index} className="hover:bg-[var(--bg-hover)]">

                      <td className="table-row-style">
                        {subject.subject_name}
                      </td>

                      <td className="table-row-style">
                        {subject.total_classes}
                      </td>

                      <td className="table-row-style">
                        {subject.present}
                      </td>

                      <td className="table-row-style">
                        {subject.absent}
                      </td>

                      <td className="table-row-style">
                        {percentage}%
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="table-row-style text-center"
                  >
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </DashboardChildPageCard>

    </DashboardChildPageTemplate>
  );
};

export default ViewAttendanceReportStudent;
