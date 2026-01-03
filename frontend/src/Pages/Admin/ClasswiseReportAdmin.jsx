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
    // Fetch classes for datewise report
    api
      .get("api/reports/student/classes-for-datewise-report", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setClasses(res.data.data))
      .catch((err) => console.error(err.response?.data || err.message));
  }, []);
 
  const selectedClass = watch("class");
  const selectedSubject = watch("subject");
  const selectedMonth = watch("month");

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
console.log("Subjects by class:", subjectsByClass);
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
    api.get("api/reports/student/class-wise-report", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        class_id,
        semester,
        subject_id: data.subject,
        month: data.month,
      },
    })
    .then((res) => {
      setReportData(res.data.report);
      setIsReportGenerated(true);
      console.log("Report data:", res.data.report);
    })
    .catch((err) => {
      console.error("Error generating report:", err.response?.data || err.message);
    });
  };

  return (
    <DashboardChildPageTemplate
      title="Classwise Report"
      desc="Generate monthly attendance report for an entire class"
      width="max-w-6xl"
    >
      <div className="cardContainer grid grid-cols-1 lg:grid-cols-12 gap-6">
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

        {/* Report Section */}
        <div className="containerRight lg:col-span-8">
          {!isReportGenerated ? (
            <DashboardChildPageCard>
              <div className="flex flex-col items-center justify-center h-64 text-center gap-2">
                <FileText size={40} className="text-gray-400" />
                <p className="font-semibold">No Report Generated</p>
              </div>
            </DashboardChildPageCard>
          ) : (
            <DashboardChildPageCard>
              {/* Classwise Attendance Table */}
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-[var(--bg-secondary)]">
                    <tr>
                      <th>Sr. No</th>
                      <th>Enrollment</th>
                      <th>Student Name</th>
                      <th>Total Present</th>
                      <th>Total Absent</th>
                      <th>Total Lectures</th>
                      <th>Attendance %</th>
                    </tr>
                  </thead>

                  <tbody>{/* ahiya data batavo maaping karine */}</tbody>
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
