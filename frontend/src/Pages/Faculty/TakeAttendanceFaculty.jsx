import React from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { Save } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../api/axios.js";
import { useForm } from "react-hook-form";

function TakeAttendanceFaculty() {
  const token = localStorage.getItem("token");

  // get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      class_id: "",
      date: today, // set current date as default
      subject_id: "",
      lecture_no: "",
    },
  });

  const [studentList, setStudentList] = useState([]);
  const selectedClass = watch("class_id");
  const selectedDate = watch("date");
  const [subjectList, setSubjectList] = useState([]);
  const selectedSubject = watch("subject_id");
  const [classesList, setClassesList] = useState([]);
  const [lectureCount, setLectureCount] = useState(0);

  const lectureList = Array.from({ length: lectureCount }, (_, i) => ({
    lecture_no: i + 1,
  }));

  // Fetch classes on component mount
  useEffect(() => {
    api
      .get("/api/attendance/classes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setClassesList(res.data.data);
        console.log("Fetched classes:", res.data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch students when class or date select changes
  useEffect(() => {
    if (!selectedClass || !selectedDate || !selectedSubject) return;

    api
      .get(`/api/attendance/students/${selectedClass}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const formatted = res.data.data.map((student) => ({
          student_id: student.student_id,
          name: student.name,
          status: "Absent",
        }));
        setStudentList(formatted);
        console.log("Fetched students:", formatted);
      })
      .catch((err) => console.error(err));
  }, [selectedClass, selectedDate, selectedSubject]);

  useEffect(() => {
    // Fetch subjects when class or faculty changes
    if (!selectedClass || !selectedDate) return;
    api
      .get(
        `/api/attendance/subjects/${selectedClass}/${selectedDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((response) => {
        setSubjectList(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });
  }, [selectedClass, selectedDate]);

  // get lectures when subject, class, faculty, date changes
  useEffect(() => {
    if (!selectedClass || !selectedDate || !selectedSubject) return;
    api
      .get(
        `/api/attendance/lectures/${selectedClass}/${selectedSubject}/${selectedDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((response) => {
        setLectureCount(response.data.count);
      })
      .catch((error) => {
        console.error("Error fetching lectures:", error);
      });
  }, [selectedClass, selectedDate, selectedSubject]);

  // Handler to toggle attendance status
  const toggleStatus = (student_id) => {
    setStudentList((prevList) =>
      prevList.map((student) =>
        student.student_id === student_id
          ? {
              ...student,
              status: student.status === "Present" ? "Absent" : "Present",
            }
          : student,
      ),
    );
  };

  // dynamic summary
  const presentCount = studentList.filter(
    (student) => student.status === "Present",
  ).length;
  const absentCount = studentList.length - presentCount;

  // Save attendance handler
  const onSubmit = (data) => {
    const attendanceData = {
      subject_id: data.subject_id,
      class_id: data.class_id,
      date: data.date,
      lecture_no: data.lecture_no,
      attendance: studentList,
    };

    api
      .post("/api/attendance/", attendanceData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Backend response:", response.data);
        if (response.status === 201) {
          alert("Attendance saved successfully!");
        }
        console.log("Attendance saved:", attendanceData);
      })
      .catch((error) => {
        console.error("Error saving attendance:", error);
        alert("Failed to save attendance.");
      });
  };

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
              <select
                {...register("class_id", { required: true })}
                className="custom-input bg-[var(--bg-primary)] theme-transition"
              >
                <option>Choose class</option>
                {classesList.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.class_id}
                  </option>
                ))}
              </select>
            </div>
          </DashboardChildPageCard>

          <DashboardChildPageCard>
            <div className="dateDiv flex flex-col h-full justify-center">
              <label className="custom-label mb-2">Date</label>
              <div className="inputDiv relative">
                <input
                  type="date"
                  {...register("date", { required: true })}
                  className="custom-input w-full bg-[var(--bg-primary)] theme-transition"
                />
              </div>
            </div>
          </DashboardChildPageCard>

          <DashboardChildPageCard>
            <div className="flex flex-col h-full justify-center">
              <label className="custom-label mb-2">Select Subject</label>
              <select
                {...register("subject_id", { required: true })}
                className="custom-input"
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

          <DashboardChildPageCard>
            <div className="flex flex-col h-full justify-center">
              <label className="custom-label mb-2">Select Lecture</label>
              <select
                {...register("lecture_no", { required: true })}
                className="custom-input"
              >
                <option value="">Choose lecture</option>
                {lectureList.map((lec) => (
                  <option key={lec.lecture_no} value={lec.lecture_no}>
                    Lecture {lec.lecture_no}
                  </option>
                ))}
              </select>
            </div>
          </DashboardChildPageCard>

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
                      <button
                        type="button"
                        onClick={() => toggleStatus(item.student_id)}
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
            onClick={handleSubmit(onSubmit)}
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
