import React from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FileText } from "lucide-react";

const DatewiseReportAdmin = () => {
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

  const months = [
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

  useEffect(() => {
    //call the class api here
  }, []);

  const [classes, setClasses] = useState([
    //store classes in this state
    "FYBCA-A", //atyar maate dummy classes mukya chhe
    "FYBCA-B",
    "SYBCA-A",
    "SYBCA-B",
    "TYBCA-A",
    "TYBCA-B",
  ]);
  const selectedClass = watch("class"); //this will store the selected class of dropdown

  useEffect(() => {
    if (selectedClass) {
      //call api based on selected class
      // future ma ahiya API call thase
      // fetch(`/api/subjects?class=${selectedClass}`)
      // .then(...)
    }
  }, [selectedClass]);

  const [subjectsByClass, setSubjectsByClass] = useState({
    //store subjects called by api here
    "FYBCA-A": ["Maths", "C", "DBMS"], //dummy subjects data
    "SYBCA-A": ["Java", "OS", "CN"],
  });
  const subjectsList = subjectsByClass[selectedClass] || [];
  const selectedSubject = watch("subject"); // this will watch the dropdown's selected subject

  const selectedMonth = watch("month");

  const [studentsByClassAndSubject, setStudentsByClassAndSubject] = useState({
    //dummy student data
    "FYBCA-A": {
      Maths: ["Aayush", "Rahul", "Karan"],
      C: ["Neel", "Parth"],
    },
    "SYBCA-A": {
      Java: ["Ravi", "Meet"],
      OS: ["Harsh"],
    },
  });
  const selectedStudent = watch("student");
  const studentsList =
    studentsByClassAndSubject[selectedClass]?.[selectedSubject] || [];
  useEffect(() => {
    setValue("subject", "");
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

  //onsubmit kaam kaaj
  const onSubmit = (data) => {
    alert("hmmmmm su bhai report jovi chhe");
    console.log("Form Submitted Data:", data);
    // future ma API call
    setIsReportGenerated(true);
  };

  const [isReportGenerated, setIsReportGenerated] = useState(false);
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
                      <option key={cls} value={cls}>
                        {cls}
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
                  {subjectsList.map(
                    (
                      sub //<--- ahiya subject list map karvi
                    ) => (
                      <option key={sub} value={sub}>
                        {sub}
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
                    <option key={month} value={month}>
                      {month}
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

                  {studentsList.map((student) => (
                    <option key={student} value={student}>
                      {student}
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
                  <div className="studentName">name: </div><span></span>
                  <div className="studentClass">class: </div><span></span>
                  <div className="subjectName">subject: </div><span></span>
                  <div className="month">month: </div><span></span>
                </div>
                <div className="reportDetails">
                  <div className="totalLectures">total lectures:</div><p></p>
                  <div className="totalPresent">total present:</div><p></p>
                  <div className="totalAbsent">total absent:</div><p></p>
                  <div className="attendance">attendance:</div><p></p>
                </div>
              </DashboardChildPageCard>

              {/* Datewise Report Table */}
              <DashboardChildPageCard>
                <h3 className="">
                  Datewise Attendance
                </h3>

                <table className="w-full border">
                  <thead className="">
                    <tr>
                      <th className="border p-2">Day/Date</th>
                      <th className="border p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                      {/*do the mapping here */}
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