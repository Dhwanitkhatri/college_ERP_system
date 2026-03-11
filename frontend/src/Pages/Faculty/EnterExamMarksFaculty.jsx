import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import AddButton from "../../ui/Buttons/AddButton";
import CancelButton from "../../ui/Buttons/CancelButton";
import api from "../../api/axios";

const EnterExamMarksFaculty = () => {
  // =============================
  // STATE
  // =============================

  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [components, setComponents] = useState([]);
  const [exams, setExams] = useState([]);
  const [marks, setMarks] = useState({});
  const [result, setResult] = useState(null);

  // =============================
  // REACT HOOK FORM
  // =============================

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const selectedSubject = watch("subject_id");

  // =============================
  // FETCH INITIAL DATA
  // =============================

  useEffect(() => {
    fetchStudents();
    fetchSubjects();
    fetchComponents();
    fetchExams();
  }, []);

  // =============================
  // FETCH STUDENTS
  // =============================

  async function fetchStudents() {
    try {
      const res = await api.get("/api/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students");
    }
  }

  // =============================
  // FETCH SUBJECTS
  // =============================

  async function fetchSubjects() {
    try {
      const res = await api.get("/api/subjects");
      setSubjects(res.data.data || res.data);
    } catch (err) {
      console.error("Error fetching subjects");
    }
  }

  // =============================
  // FETCH COMPONENTS
  // =============================

  async function fetchComponents() {
    try {
      const res = await api.get("/api/components");
      setComponents(res.data.data || res.data);
    } catch (err) {
      console.error("Error fetching components");
    }
  }

  // =============================
  // FETCH EXAMS
  // =============================

  async function fetchExams() {
    try {
      const res = await api.get("/api/exams");
      setExams(res.data.data || []);
    } catch (err) {
      console.error("Error fetching exams");
    }
  }

  // =============================
  // HANDLE MARKS CHANGE
  // =============================

  const handleMarksChange = (student_id, value) => {
    setMarks((prev) => ({
      ...prev,
      [student_id]: value,
    }));
  };

  // =============================
  // CANCEL HANDLER
  // =============================

  const handleCancel = () => {
    reset();
    setMarks({});
    setResult(null);
  };

  // =============================
  // SUBMIT HANDLER
  // =============================

  async function onSubmit(data) {
    try {
      const payload = students.map((student) => ({
        student_id: student.student_id,
        marks_obtained: Number(marks[student.student_id] || 0),
      }));

      const res = await api.post("/api/bulk-enter-marks", {
        subject_id: Number(data.subject_id),
        component_id: Number(data.component_id),
        exam_id: data.exam_id ? Number(data.exam_id) : null,
        marks: payload,
      });

      alert(res.data.message);
      setResult(res.data.data);

      setMarks({});
    } catch (error) {
      alert(error?.response?.data?.message || "Error entering marks");
    }
  }

  return (
    <DashboardChildPageTemplate
      title="Enter Exam Marks"
      desc="Admin can enter marks for multiple students"
    >
      {/* =============================
          FORM CARD
      ============================= */}

      <DashboardChildPageCard>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/*Semester*/}
          <div className="form-field">
            <label className="custom-label">
              Semester <span className="text-red-500">*</span>
            </label>
            <select
              className="custom-input"
              {...register("semester", { required: "Semester is required" })}
            >
              <option value="">Select Semester</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
            </select>
            {errors.semester && (
              <p className="custom-error">{errors.semester.message}</p>
            )}
          </div>

          {/* ACADEMIC YEAR (Newly added between Semester and Subject) */}
          <div className="form-field">
            <label className="custom-label">
              Academic Year <span className="text-red-500">*</span>
            </label>
            <select
              className="custom-input"
              {...register("academic_year", {
                required: "Academic Year is required",
              })}
            >
              <option value="">Select Academic Year</option>
              <option value="2023-24">2023-24</option>
              <option value="2024-25">2024-25</option>
              <option value="2025-26">2025-26</option>
            </select>
            {errors.academic_year && (
              <p className="custom-error">{errors.academic_year.message}</p>
            )}
          </div>

          {/* SUBJECT */}
          <div className="form-field">
            <label className="custom-label">
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              className="custom-input"
              {...register("subject_id", { required: "Subject is required" })}
            >
              <option value="">Select Subject</option>
              {Array.isArray(subjects) &&
                subjects.map((sub) => (
                  <option key={sub.subject_id} value={sub.subject_id}>
                    {sub.subject_name}
                  </option>
                ))}
            </select>
            {errors.subject_id && (
              <p className="custom-error">{errors.subject_id.message}</p>
            )}
          </div>

          {/* COMPONENT */}
          <div className="form-field">
            <label className="custom-label">
              Component <span className="text-red-500">*</span>
            </label>
            <select
              className="custom-input"
              {...register("component_id", { required: "Component required" })}
            >
              <option value="">Select Component</option>
              {components.map((c) => (
                <option key={c.component_id} value={c.component_id}>
                  {c.type} ({c.max_marks})
                </option>
              ))}
            </select>
            {errors.component_id && (
              <p className="custom-error">{errors.component_id.message}</p>
            )}
          </div>

          {/* EXAM (Updated to be required) */}
          <div className="form-field">
            <label className="custom-label">
              Exam <span className="text-red-500">*</span>
            </label>
            <select
              className="custom-input"
              {...register("exam_id", { required: "Exam is required" })}
            >
              <option value="">Select Exam</option>
              {Array.isArray(exams) &&
                exams.map((e) => (
                  <option key={e.exam_id} value={e.exam_id}>
                    {e.name}
                  </option>
                ))}
            </select>
            {errors.exam_id && (
              <p className="custom-error">{errors.exam_id.message}</p>
            )}
          </div>

          {/* =============================
              STUDENT TABLE
          ============================= */}

          <div className="table-wrapper mt-6">
            <table className="min-w-full text-sm">
              <thead className="sticky-header">
                <tr>
                  <th className="table-row-style sticky-col">Student ID</th>
                  <th className="table-row-style">Student Name</th>
                  <th className="table-row-style">Marks</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.student_id}>
                    <td className="table-row-style sticky-col">
                      {student.student_id}
                    </td>
                    <td className="table-row-style">{student.name}</td>
                    <td className="table-row-style">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="custom-input"
                        placeholder="0"
                        value={marks[student.student_id] || ""}
                        onChange={(e) =>
                          handleMarksChange(student.student_id, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ACTION BUTTONS */}
          <div className="form-actions mt-6">
            <AddButton />
            <CancelButton onClick={handleCancel} />
          </div>
        </form>
      </DashboardChildPageCard>

      {/* =============================
          SUCCESS CARD
      ============================= */}

      {result && (
        <DashboardChildPageCard className="mt-3">
          <h3 className="text-lg font-semibold mb-3 text-[var(--text-primary)]">
            Marks Saved Successfully
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {result.length} records inserted successfully
          </p>
        </DashboardChildPageCard>
      )}
    </DashboardChildPageTemplate>
  );
};

export default EnterExamMarksFaculty;
