import React from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { useState, useEffect } from "react";
import { set, useForm } from "react-hook-form";
import { FileText } from "lucide-react";
import api from "../../api/axios.js";

const DatewiseReportAdmin = () => {
  const token = localStorage.getItem("token");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      class: "", //this means select class will have default value of empty placeholder
      subject: "",
      month: "",
      student: "",
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
  const [studentsByClassAndSubject, setStudentsByClassAndSubject] = useState(
    []
  );
  const [reportData, setReportData] = useState([]);

  //this api is called for to get classes for datewise report
  useEffect(() => {
    // Fetch classes for datewise report
    api
      .get("api/reports/student/classes-for-datewise-report", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setClasses(res.data.data))
      .catch((err) => console.error(err.response?.data || err.message));
  }, []);
  const selectedClass = watch("class"); //this will store the selected class of dropdown

  const [class_id, semester] = selectedClass
    ? selectedClass.split("|")
    : [null, null];

  // this api is called to get subjects and students based on class and semester
  useEffect(() => {
    if (!selectedClass) return;

    api
      .get("/api/reports/student/subjects-and-students-for-datewise-report", {
        headers: { Authorization: `Bearer ${token}` },
        params: { class_id, semester },
      })
      .then((res) => {
        setSubjectsByClass(res.data.subjects);
        setStudentsByClassAndSubject(res.data.students);
      })
      .catch((err) => console.error(err.response?.data || err.message));
  }, [selectedClass]);

  const selectedSubject = watch("subject"); // this will watch the dropdown's selected subject

  const selectedMonth = watch("month");

  const selectedStudent = watch("student");

  useEffect(() => {
    setValue("month", "");
    setValue("student", "");
  }, [selectedClass]);

  useEffect(() => {
    setValue("month", "");
    setValue("student", "");
  }, [selectedSubject]);

  useEffect(() => {
    setValue("student", "");
  }, [selectedMonth]);
  const [isReportGenerated, setIsReportGenerated] = useState(false);
  //onsubmit kaam kaaj
  const onSubmit = (data) => {
    console.log("Generating report with data:", data);

    const monthStr = data.month.toString().padStart(2, "0");

    api
      .get("/api/reports/student/date-wise-report", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          student_id: selectedStudent,
          class_id: class_id,
          subject_id: data.subject,
          month: monthStr,
        },
      })
      .then((res) => {
        console.log(res.data);
        setIsReportGenerated(true);
        setReportData(res.data);
      })
      .catch((err) => console.error(err.response?.data || err.message));
  };

  console.log("Report Data:", reportData);

  return (
    <DashboardChildPageTemplate
      title="Datewise Report"
      desc="Generate attendance and activity reports for a specific date range"
      width="max-w-6xl"
    >
      <div className="cardContainer grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="containerLeft lg:col-span-4">
          <form
            className="datewiseReportForm"
            onSubmit={handleSubmit(onSubmit)}
          >
            <DashboardChildPageCard>
              {/*Select Class Field ahiya chhe */}
              <div className="form-field selectClass">
                <label className="selectClassLabel custom-label">
                  Select Class
                </label>
                <select
                  className="custom-input"
                  defaultValue=""
                  {...register("class", {
                    required: "Please select an option",
                  })}
                >
                  <option value="" disabled>
                    Select a Class
                  </option>
                  {classes.map(
                    (
                      cls //<--- class mapping ahiya karvi
                    ) => (
                      <option
                        key={`${cls.id}|${cls.semester}`}
                        value={`${cls.id}|${cls.semester}`}
                      >
                        {cls.class_id} semester {cls.semester}
                      </option>
                    )
                  )}
                </select>
                {errors.class && (
                  <p className="custom-error">{errors.class.message}</p>
                )}
              </div>

              {/*Select subject field ahiya chhe*/}
              <div className="form-field selectSubject">
                <label className="custom-label selectSubjectLabel">
                  Select Subject
                </label>
                <select
                  className="custom-input"
                  defaultValue=""
                  disabled={!selectedClass}
                  {...register("subject", {
                    required: "Please Select an option",
                  })}
                >
                  <option value="" disabled>
                    Select a Subject
                  </option>
                  {subjectsByClass.map(
                    (
                      sub //<--- ahiya subject list map karvi
                    ) => (
                      <option key={sub.subject_id} value={sub.subject_id}>
                        {sub.subject_name}
                      </option>
                    )
                  )}
                </select>
                {errors.subject && (
                  <p className="custom-error">{errors.subject.message}</p>
                )}
              </div>

              {/* Select Month field ahiya chhe */}
              <div className="form-field selectMonth">
                <label className="custom-label selectMonthLabel">
                  Select Month
                </label>

                <select
                  className="custom-input"
                  defaultValue=""
                  disabled={!selectedSubject}
                  {...register("month", {
                    required: "Please Select an option",
                  })}
                >
                  <option value="" disabled>
                    Select a Month
                  </option>

                  {months.map((month) => (
                    <option key={month.number} value={month.number}>
                      {month.name}
                    </option>
                  ))}
                </select>

                {errors.month && (
                  <p className="custom-error">{errors.month.message}</p>
                )}
              </div>

              {/*select student field ahiya chhe*/}
              <div className="form-field selectStudent">
                <label className="custom-label selectStudentLabel">
                  Select Student
                </label>

                <select
                  className="custom-input"
                  defaultValue=""
                  disabled={
                    !selectedClass || !selectedSubject || !selectedMonth
                  }
                  {...register("student", {
                    required: "Please Select a student",
                  })}
                >
                  <option value="" disabled>
                    Select a Student
                  </option>

                  {studentsByClassAndSubject.map((student) => (
                    <option key={student.student_id} value={student.student_id}>
                      {student.name}
                    </option>
                  ))}
                </select>

                {errors.student && (
                  <p className="custom-error">{errors.student.message}</p>
                )}
              </div>

              {/*Generate Report Button */}
              <button
                type="submit"
                className="generateReportButton bg-[var(--Submit-Btn-General)] w-full p-2 rounded-md"
              >
                <div className="flex justify-center gap-2 overflow-hidden">
                  <div className="icon text-[var(--bg-primary)]">
                    <FileText />
                  </div>
                  <div className="textGenerateReport text-[var(--bg-primary)]">
                    Generate Report
                  </div>
                </div>
              </button>
            </DashboardChildPageCard>
          </form>
        </div>

        {/*report part here */}
        <div className="containerRight grid lg:col-span-8 gap-6">
          {!isReportGenerated ? (
            /*No Report Generated */
            <DashboardChildPageCard>
              <div className="flex flex-col items-center justify-center h-64 text-center gap-2">
                <FileText size={40} className="text-gray-400" />
                <p className="text-lg font-semibold">No Report Generated</p>
                <p className="text-sm text-gray-500">
                  Select all filters and click <b>"Generate Report"</b> to view
                  attendance data.
                </p>
              </div>
            </DashboardChildPageCard>
          ) : (
            <>
              {/* Report Summary */}
              <DashboardChildPageCard>
                <div className="details grid sm:grid-cols-1 lg:grid-cols-2">
                  <div className="studentName">name: </div>
                  <span>{reportData.data.student_info.name}</span>
                  <div className="studentClass">class: </div>
                  <span>{reportData.data.student_info.class_id}</span>
                  <div className="subjectName">subject: </div>
                  <span>{reportData.data.subject_info.subject_name}</span>
                  <div className="month">month: </div>
                  <span>{reportData.data.report_info.month}</span>
                </div>
                <div className="reportDetails">
                  <div className="totalLectures">total lectures:</div>
                  <span>
                    {reportData.data.attendance_summary.total_classes}
                  </span>

                  <div className="totalPresent">total present:</div>
                  <span>
                    {reportData.data.attendance_summary.total_present}
                  </span>
                  <div className="totalAbsent">total absent:</div>
                  {reportData.data.attendance_summary.total_absent}
                  <div className="attendance">attendance:</div>
                  <span>
                    {reportData.data.attendance_summary.attendance_percentage}
                  </span>
                </div>
              </DashboardChildPageCard>

              {/* Datewise Report Table */}
              <DashboardChildPageCard>
                <h3 className="">Datewise Attendance</h3>

                <table className="w-full border">
                  <thead className="">
                    <tr>
                      <th className="border p-2">Day/Date</th>
                      <th className="border p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData?.data?.detailed_records?.map(
                      (record, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2">
                            {record.date} ({record.day}) <br />
                            <span className="text-sm text-gray-500">
                              Lecture {record.lecture_no}
                            </span>
                          </td>

                          <td className="px-4 py-2 font-semibold">
                            {record.status}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </DashboardChildPageCard>
            </>
          )}
        </div>
      </div>
    </DashboardChildPageTemplate>
  );
};

export default DatewiseReportAdmin;
