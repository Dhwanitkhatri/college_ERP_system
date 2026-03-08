import React from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { useForm } from "react-hook-form";
import CancelButton from "../../ui/Buttons/CancelButton";
import SaveButton from "../../ui/Buttons/SaveButton";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

const ManageClassroomAdmin = () => {
  const [classroom, setClassroom] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [mentorChanged, setMentorChanged] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  useEffect(() => {
    const fetchData = async () => {
      const classRes = await api.get(`/api/classes/${id}`);

      const facultyRes = await api.get("/api/faculties", {
      });

     

      setClassroom(classRes.data);
      setFaculties(facultyRes.data);

      reset({
        mentor_id: classRes.data.mentor_id,
      });
    };

    fetchData();
  }, [id]);

  const onSubmit = async (data) => {
    alert("Mentor Updated");

    await api.put(
      `/api/classes/${id}`,
      { mentor_id: data.mentor_id },
    );
    navigate("/admin/Dashboard/Classroom");
  };

  return (
    <DashboardChildPageTemplate
      title="Edit Classroom"
      desc="Add, edit, or remove classrooms and assign mentors to classes"
      width="max-w-4xl"
    >
      <DashboardChildPageCard>
        {/* form wrapper */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Classroom Info (Read-only) */}
          {classroom && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-field">
                <label className="custom-label">Class ID</label>
                <input
                  className="custom-input cursor-not-allowed"
                  disabled
                  value={classroom.class_id}
                />
              </div>

              <div className="form-field">
                <label className="custom-label">Course ID</label>
                <input
                  className="custom-input cursor-not-allowed"
                  disabled
                  value={classroom.course_id}
                />
              </div>

              <div className="form-field">
                <label className="custom-label">Year</label>
                <input
                  className="custom-input cursor-not-allowed"
                  disabled
                  value={classroom.year}
                />
              </div>

              <div className="form-field">
                <label className="custom-label">Semester</label>
                <input
                  className="custom-input cursor-not-allowed"
                  disabled
                  value={classroom.semester}
                />
              </div>

              <div className="form-field md:col-span-2">
                <label className="custom-label">Section</label>
                <input
                  className="custom-input cursor-not-allowed"
                  disabled
                  value={classroom.section}
                />
              </div>

              <div className="form-field md:col-span-2">
                <label className="custom-label">Current Mentor</label>
                <input
                  className="custom-input cursor-not-allowed"
                  disabled
                  value={
                    faculties.find((f) => f.faculty_id === classroom.mentor_id)
                      ?.name || "Not Assigned"
                  }
                />
              </div>
            </div>
          )}

          {/* Mentor Change Section */}
          <div className="form-field">
            <label className="custom-label">Change Class Mentor</label>
            <select
              className="custom-input"
              {...register("mentor_id", { required: "Mentor is required" })}
              onChange={() => setMentorChanged(true)}
            >
              <option value="">Select Mentor</option>
              {faculties.map((f) => (
                <option key={f.id} value={f.faculty_id}>
                  {f.name} - {f.faculty_id}
                </option>
              ))}
            </select>
            {errors.mentor_id && (
              <p className="custom-error">{errors.mentor_id.message}</p>
            )}
          </div>

          {/* Alert when mentor changes */}
          {mentorChanged && (
            <div className="p-3 rounded-md bg-yellow-50 border border-yellow-300 text-yellow-700 text-sm">
              Mentor has been changed. Click <b>Save</b> to apply changes.
            </div>
          )}

          {/* Action buttons */}
          <div className="form-actions flex justify-end gap-3">
            <CancelButton />
            <SaveButton />
          </div>
        </form>
      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
};

export default ManageClassroomAdmin;
