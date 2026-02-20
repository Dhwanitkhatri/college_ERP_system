import React, { useState, useEffect } from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { useForm } from "react-hook-form";
import { FileText } from "lucide-react";
import api from "../../api/axios.js";

const ClasswiseReportAdmin = () => {
  const token = localStorage.getItem("token");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      class: "",
      subject: "",
      month: "",
    },
  });

  const monthsArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const months = monthsArray.map((name, index) => ({
    name,
    number: index + 1,
  }));

  const [classes, setClasses] = useState([]);
  const [subjectsByClass, setSubjectsByClass] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [isReportGenerated, setIsReportGenerated] = useState(false);

  // this api is called for to get classes for classwise report
  useEffect(() => {
    api
      .get("api/reports/student/classes-for-datewise-report", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setClasses(res.data.data))
      .catch((err) => console.error(err.response?.data || err.message));
  }, []);

  const selectedClass = watch("class");
  const selectedSubject = watch("subject");

  const [class_id, semester] = selectedClass
    ? selectedClass.split("|")
    : [null, null];

  // this api is called to get subjects based on class & semester
  useEffect(() => {
    if (!selectedClass) return;

    api
      .get("/api/reports/student/subjects-and-students-for-datewise-report", {
        headers: { Authorization: `Bearer ${token}` },
        params: { class_id, semester },
      })
      .then((res) => {
        setSubjectsByClass(res.data.subjects);
      })
      .catch((err) => console.error(err.response?.data || err.message));
  }, [selectedClass]);

  useEffect(() => {
    setValue("subject", "");
    setValue("month", "");
  }, [selectedClass]);

  useEffect(() => {
    setValue("month", "");
  }, [selectedSubject]);

  // onsubmit kaam kaaj
  const onSubmit = (data) => {
    console.log("Generating classwise report with data:", data);

    api
      .get("api/reports/student/class-wise-report", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          class_id,
          subject_id: data.subject,
          month: data.month,
        },
      })
      .then((res) => {
        setReportData(res.data.student_reports);
        setIsReportGenerated(true);
      })
      .catch((err) => {
        console.error(
          "Error generating report:",
          err.response?.data || err.message,
        );
      });
  };

  return (
    <DashboardChildPageTemplate
      title="Classwise Report"
      desc="Generate monthly attendance report for an entire class"
      width="max-w-6xl"
    >
      <div className="cardContainer grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT SIDE FORM */}
        <div className="containerLeft lg:col-span-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DashboardChildPageCard>
              {/* Select Class */}
              <div className="form-field selectClass">
                <label className="custom-label">Select Class</label>
                <select
                  className="custom-input"
                  defaultValue=""
                  {...register("class", { required: "Please select a class" })}
                >
                  <option value="" disabled>
                    Select a Class
                  </option>
                  {classes.map((cls) => (
                    <option
                      key={`${cls.id}|${cls.semester}`}
                      value={`${cls.id}|${cls.semester}`}
                    >
                      {cls.class_id} semester {cls.semester}
                    </option>
                  ))}
                </select>
                {errors.class && (
                  <p className="custom-error">{errors.class.message}</p>
                )}
              </div>

              {/* Select Subject */}
              <div className="form-field selectSubject">
                <label className="custom-label">Select Subject</label>
                <select
                  className="custom-input"
                  defaultValue=""
                  disabled={!selectedClass}
                  {...register("subject", {
                    required: "Please select subject",
                  })}
                >
                  <option value="" disabled>
                    Select a Subject
                  </option>
                  {subjectsByClass.map((sub) => (
                    <option key={sub.subject_id} value={sub.subject_id}>
                      {sub.subject_name}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="custom-error">{errors.subject.message}</p>
                )}
              </div>

              {/* Select Month */}
              <div className="form-field selectMonth">
                <label className="custom-label">Select Month</label>
                <select
                  className="custom-input"
                  defaultValue=""
                  disabled={!selectedSubject}
                  {...register("month", {
                    required: "Please select month",
                  })}
                >
                  <option value="" disabled>
                    Select Month
                  </option>
                  {months.map((m) => (
                    <option key={m.number} value={m.number}>
                      {m.name}
                    </option>
                  ))}
                </select>
                {errors.month && (
                  <p className="custom-error">{errors.month.message}</p>
                )}
              </div>

              {/* Generate Report Button */}
              <button
                type="submit"
                className="generateReportButton bg-[var(--Submit-Btn-General)] w-full p-2 rounded-md"
              >
                <div className="flex justify-center gap-2 text-[var(--bg-primary)]">
                  <FileText />
                  Generate Report
                </div>
              </button>
            </DashboardChildPageCard>
          </form>
        </div>

        {/* RIGHT SIDE REPORT */}
        <div className="containerRight lg:col-span-8">
          {!isReportGenerated ? (
            <DashboardChildPageCard>
              <div className="flex flex-col items-center justify-center h-64 text-center gap-2">
                {/* Dynamic Icon Color */}
                <FileText size={40} className="text-[var(--text-muted)]" />

                {/* Dynamic Text Color */}
                <p className="font-semibold text-[var(--text-secondary)]">
                  No Report Generated
                </p>
              </div>
            </DashboardChildPageCard>
          ) : (
            <DashboardChildPageCard>
              {/* Classwise Attendance Table */}
              <div className="table-wrapper max-h-[600px] overflow-y-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="table-row-style sticky-header">Sr. No</th>

                      {/* ✅ Sticky Enrollment Column */}
                      <th className="table-row-style sticky-header sticky-col">
                        Enrollment
                      </th>

                      <th className="table-row-style sticky-header">
                        Student Name
                      </th>
                      <th className="table-row-style sticky-header">
                        Total Present
                      </th>
                      <th className="table-row-style sticky-header">
                        Total Absent
                      </th>
                      <th className="table-row-style sticky-header">
                        Total Lectures
                      </th>
                      <th className="table-row-style sticky-header">
                        Attendance %
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {reportData.map((student, index) => (
                      <tr
                        key={student.student_id}
                        className="hover:bg-[var(--bg-hover)] transition"
                      >
                        <td className="text-center table-row-style">
                          {index + 1}
                        </td>

                        {/* Sticky Enrollment Cell */}
                        <td className="text-center table-row-style sticky-col">
                          {student.student_id}
                        </td>

                        <td className="text-center table-row-style">
                          {student.name}
                        </td>

                        <td className="text-center table-row-style">
                          {student.total_attendance.total_present}
                        </td>

                        <td className="text-center table-row-style">
                          {student.total_attendance.total_absent}
                        </td>

                        <td className="text-center table-row-style">
                          {student.total_attendance.classes_conducted}
                        </td>

                        <td className="text-center table-row-style">
                          {student.total_attendance.attendance_percentage}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DashboardChildPageCard>
          )}
        </div>
      </div>
    </DashboardChildPageTemplate>
  );
};

export default ClasswiseReportAdmin;
