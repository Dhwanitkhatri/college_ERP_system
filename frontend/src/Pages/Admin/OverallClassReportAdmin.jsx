import React, { useState, useEffect } from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { useForm } from "react-hook-form";
import { FileText } from "lucide-react";
import api from "../../api/axios.js";

const OverallClassReportAdmin = () => {
 

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      class: "",
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
  const [subjects, setSubjects] = useState([]); // dynamic subjects
  const [students, setStudents] = useState([]); // report data
  const [isReportGenerated, setIsReportGenerated] = useState(false);

  // fetch classes
  useEffect(() => {
    api
      .get("api/reports/student/classes-for-datewise-report")
      .then((res) => setClasses(res.data.data))
      .catch((err) => console.error(err.response?.data || err.message));
  }, []);

  const selectedClass = watch("class");
  const selectedMonth = watch("month");

  const [class_id, semester] = selectedClass
    ? selectedClass.split("|")
    : [null, null];

  useEffect(() => {
    setValue("month", "");
  }, [selectedClass]);

  // submit handler
  const onSubmit = (data) => {
    console.log("Generating overall class report:", data);

    api
      .get("api/reports/student/overall-class-wise", {
      
        params: {
          class_id,
          semester,
          month: data.month,
        },
      })
      .then((res) => {
        setSubjects(res.data.subjects); // array
        setStudents(res.data.students); // array
        setIsReportGenerated(true);
      })
      .catch((err) =>
        console.error(
          "Error generating report:",
          err.response?.data || err.message,
        ),
      );
  };

  return (
    <DashboardChildPageTemplate
      title="Overall Class Report"
      desc="Generate combined attendance report of all subjects for a class"
      width="max-w-7xl"
    >
      <div className="cardContainer grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* form ahiya chhe*/}
        <div className="containerLeft lg:col-span-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DashboardChildPageCard>
              {/* Select Class field */}
              <div className="form-field selectClass">
                <label className="custom-label">Select Class</label>
                <select
                  className="custom-input"
                  defaultValue=""
                  {...register("class", { required: "Please select a class" })}
                >
                  <option value="" disabled>
                    Select Class
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

              {/* Select month field */}
              <div className="form-field selectMonth">
                <label className="custom-label">Select Month</label>
                <select
                  className="custom-input"
                  defaultValue=""
                  disabled={!selectedClass}
                  {...register("month", { required: "Please select month" })}
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

        {/* report table part */}
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
              <div className="table-wrapper max-h-[600px] overflow-y-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="table-row-style sticky-header">Sr. No</th>

                      {/* Sticky Enrollment Column */}
                      <th className="table-row-style sticky-header sticky-col">
                        Enrollment
                      </th>

                      <th className="table-row-style sticky-header">Name</th>

                      {/* subject column ni mapping */}
                      {subjects.map((sub) => (
                        <th
                          key={sub.subject_id}
                          className="table-row-style sticky-header"
                        >
                          {sub.subject_name}
                        </th>
                      ))}

                      <th className="table-row-style sticky-header">
                        Total Absent
                      </th>
                      <th className="table-row-style sticky-header">
                        Total Present
                      </th>
                      <th className="table-row-style sticky-header">
                        Total lectures
                      </th>
                      <th className="table-row-style sticky-header">
                        Attendance %
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((stu, index) => (
                      <tr
                        key={stu.student_id}
                        className="hover:bg-[var(--bg-hover)] transition"
                      >
                        <td className="table-row-style">{index + 1}</td>

                        <td className="table-row-style sticky-col">
                          {stu.student_id}
                        </td>

                        <td className="table-row-style">{stu.name}</td>

                        {/* subject data mapping */}
                        {stu.subject_wise.map((sub) => {
                          return (
                            <td
                              key={sub.subject_id}
                              className="table-row-style"
                            >
                              {sub.present}/{sub.total_classes}
                            </td>
                          );
                        })}

                        <td className="table-row-style">{stu.absent}</td>
                        <td className="table-row-style">{stu.present}</td>
                        <td className="table-row-style">{stu.total_classes}</td>
                        <td className="table-row-style">
                          {((stu.present / stu.total_classes) * 100).toFixed(2)}
                          %
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

export default OverallClassReportAdmin;
