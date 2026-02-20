import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Save } from "lucide-react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import api from "../../api/axios.js";

const UpdateAttendanceFaculty = () => {
  const { register, watch } = useForm({
    defaultValues: {
      class_id: "",
      date: new Date().toISOString().split("T")[0],
      subject_id: "",
      lecture_no: "",
    },
  });

  const token = localStorage.getItem("token");

  const [studentList, setStudentList] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [lectureCount, setLectureCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const selectedClass = watch("class_id");
  const selectedDate = watch("date");
  const selectedSubject = watch("subject_id");
  const selectedLecture = watch("lecture_no");

  const lectureList = Array.from({ length: lectureCount }, (_, i) => i + 1);

  // ---------------- FETCH CLASSES ----------------
  useEffect(() => {
    api
      .get("/api/attendance/classes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setClassesList(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  // ---------------- FETCH SUBJECTS ----------------
  useEffect(() => {
    if (!selectedClass || !selectedDate) return;

    api
      .get(
        `/api/attendance/subjects/${selectedClass}/${selectedDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => setSubjectList(res.data.data))
      .catch((err) => console.error(err));
  }, [selectedClass, selectedDate]);

  // ---------------- FETCH LECTURES ----------------
  useEffect(() => {
    if (!selectedClass || !selectedSubject || !selectedDate) return;

    api
      .get(
        `/api/attendance/lectures/${selectedClass}/${selectedSubject}/${selectedDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => setLectureCount(res.data.count))
      .catch((err) => console.error(err));
  }, [selectedClass, selectedSubject, selectedDate]);

  // ---------------- FETCH ATTENDANCE ----------------
  useEffect(() => {
    if (!selectedClass || !selectedSubject || !selectedLecture || !selectedDate)
      return;

    api
      .get(
        `/api/attendance/dataforupdate/${selectedClass}/${selectedSubject}/${selectedLecture}/${selectedDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setStudentList(res.data);
      })
      .catch((err) => console.error(err));
  }, [selectedClass, selectedSubject, selectedLecture, selectedDate]);

  // ---------------- TOGGLE STATUS ----------------
  const toggleStatus = (student_id) => {
    setStudentList((prev) =>
      prev.map((student) =>
        student.student_id === student_id
          ? {
              ...student,
              status:
                student.status === "Present" ? "Absent" : "Present",
            }
          : student
      )
    );
  };

  // ---------------- UPDATE ATTENDANCE API ----------------
  const handleUpdateAttendance = async () => {
    if (!selectedClass || !selectedSubject || !selectedLecture || !selectedDate) {
      alert("Please select all filters before updating.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        class_id: selectedClass,
        subject_id: selectedSubject,
        lecture_no: selectedLecture,
        date: selectedDate,
        students: studentList.map((student) => ({
          student_id: student.student_id,
          status: student.status,
        })),
      };

      const res = await api.put(
        "/api/attendance/update",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(res.data.message || "Attendance updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update attendance.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SUMMARY ----------------
  const presentCount = studentList.filter(
    (s) => s.status === "Present"
  ).length;

  const absentCount = studentList.filter(
    (s) => s.status === "Absent"
  ).length;

  return (
    <DashboardChildPageTemplate
      title="Update Attendance"
      desc="Modify student attendance records"
      width="max-w-7xl"
    >
      <div className="space-y-6 pb-20">

        {/* FILTER SECTION (UNCHANGED) */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Class */}
          <DashboardChildPageCard>
            <label className="custom-label mb-2">Select Class</label>
            <select {...register("class_id")} className="custom-input">
              <option value="">Choose class</option>
              {classesList.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_id}
                </option>
              ))}
            </select>
          </DashboardChildPageCard>

          {/* Date */}
          <DashboardChildPageCard>
            <label className="custom-label mb-2">Date</label>
            <input type="date" {...register("date")} className="custom-input" />
          </DashboardChildPageCard>

          {/* Subject */}
          <DashboardChildPageCard>
            <label className="custom-label mb-2">Select Subject</label>
            <select {...register("subject_id")} className="custom-input">
              <option value="">Choose subject</option>
              {subjectList.map((sub) => (
                <option key={sub.subject_id} value={sub.subject_id}>
                  {sub.subject_name}
                </option>
              ))}
            </select>
          </DashboardChildPageCard>

          {/* Lecture */}
          <DashboardChildPageCard>
            <label className="custom-label mb-2">Select Lecture</label>
            <select {...register("lecture_no")} className="custom-input">
              <option value="">Choose lecture</option>
              {lectureList.map((lec) => (
                <option key={lec} value={lec}>
                  Lecture {lec}
                </option>
              ))}
            </select>
          </DashboardChildPageCard>

          {/* Summary */}
          <DashboardChildPageCard>
            <span className="custom-label mb-2">Attendance Summary</span>
            <div className="text-lg font-medium">
              <span className="text-green-600">
                Present: {presentCount}
              </span>
              <span className="mx-2">|</span>
              <span className="text-red-500">
                Absent: {absentCount}
              </span>
            </div>
          </DashboardChildPageCard>
        </div>

        {/* TABLE (UNCHANGED) */}

        <DashboardChildPageCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-sm font-semibold">Roll No</th>
                  <th className="p-4 text-sm font-semibold">Student Name</th>
                  <th className="p-4 text-sm font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {studentList.map((student) => (
                  <tr key={student.student_id}>
                    <td className="p-4 text-sm">{student.student_id}</td>
                    <td className="p-4 text-sm">{student.name}</td>
                    <td className="p-4">
                      <button
                        onClick={() =>
                          toggleStatus(student.student_id)
                        }
                        className={`px-4 py-1.5 rounded-md text-sm font-medium ${
                          student.status === "Present"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {student.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardChildPageCard>

        {/* UPDATE BUTTON */}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleUpdateAttendance}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:opacity-90 disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Updating..." : "Update Attendance"}
          </button>
        </div>

      </div>
    </DashboardChildPageTemplate>
  );
};

export default UpdateAttendanceFaculty;
