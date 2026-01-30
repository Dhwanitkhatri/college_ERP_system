import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import AddButton from "../../ui/Buttons/AddButton";
import CancelButton from "../../ui/Buttons/CancelButton";
import { set, useForm } from "react-hook-form";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import api from "../../api/axios.js";

const AddClassAdmin = () => {
  const [addedClass, setAddedClass] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      year: "",
      semester: "",
      section: "",
      academicYear: "",
      classMentor: "",
    },
  });

  const handleCancel = () => {
    reset({
      year: "",
      semester: "",
      section: "",
      academicYear: "",
      classMentor: "",
    });
  };

  const token = localStorage.getItem("token"); // Get token from localStorage
  const selectedYear = watch("year");

  const semesterMap = {
    //dummy data
    FY: ["1", "2"],
    SY: ["3", "4"],
    TY: ["5", "6"],
    LY: ["7", "8"],
  };

  const currentSemesters = semesterMap[selectedYear] || [];
  const [faculties, setFaculties] = useState([]);
  useEffect(() => {
    api
      .get("api/faculties/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setFaculties(res.data); // backend sends array
        console.log("Fetched faculties:", res.data);
      })
      .catch((err) => {
        console.error(
          "Error fetching faculties:",
          err.response?.data || err.message,
        );
      });
  }, []);

  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");
    console.log(data);
    try {
      await api.post(
        "api/classes",
        {
          year: data.year,
          semester: data.semester,
          sections: data.section,
          academic_year: data.academicYear,
          mentor_id: data.classMentor,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setAddedClass({
        year: data.year,
        semester: data.semester,
        section: data.section,
        academic_year: data.academicYear,
        mentor_id: data.classMentor,
      });
      alert("Class created successfully");
    } catch (error) {
      console.error("Error creating class:", error);

      alert(
        error.response?.data?.message ||
          "Failed to create class. Please try again.",
      );
    }
  };

  return (
    <DashboardChildPageTemplate
      title="Add New Class"
      desc="Enter class details to add it to the system"
    >
      <DashboardChildPageCard>
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          {/* Year ni field ahiya chhe */}
          <div className="form-field">
            <label className="custom-label">Select Year</label>
            <select
              className="custom-input"
              {...register("year", { required: "Year is required" })}
            >
              <option value="" disabled>
                Select year
              </option>
              <option value="FY">First Year</option>
              <option value="SY">Second Year</option>
              <option value="TY">Third Year</option>
              <option value="LY">Fourth Year</option>
            </select>
            {errors.year && (
              <p className="custom-error">{errors.year.message}</p>
            )}
          </div>

          {/* Semester ni field ahiya chhe*/}
          <div className="form-field">
            <label className="custom-label">Select Semester</label>
            <select
              className="custom-input"
              disabled={!selectedYear}
              {...register("semester", {
                required: "Semester is required",
              })}
            >
              <option value="" selected disabled>
                {selectedYear ? "Select semester" : "Select year first"}
              </option>
              {currentSemesters.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
            {errors.semester && (
              <p className="custom-error">{errors.semester.message}</p>
            )}
          </div>

          {/* Section ni field ahiya chhe */}
          <div className="form-field">
            <label className="custom-label">Section</label>
            <select
              className="custom-input"
              {...register("section", {
                required: "Section is required",
              })}
            >
              <option value="" selected disabled>
                Select section
              </option>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
            {errors.section && (
              <p className="custom-error">{errors.section.message}</p>
            )}
          </div>

          {/* Academic Year ni field ahia chhe */}
          <div className="form-field">
            <label className="custom-label">Academic Year</label>
            <select
              className="custom-input"
              {...register("academicYear", {
                required: "Academic year is required",
              })}
            >
              <option value="" selected disabled>
                Select academic year
              </option>
              <option value="2025-26">2025-26</option>
              <option value="2026-27">2026-27</option>
              <option value="2027-28">2027-28</option>
              <option value="2028-29">2028-29</option>
              <option value="2029-30">2029-30</option>
              <option value="2030-31">2030-31</option>
              <option value="2031-32">2031-32</option>
              <option value="2032-33">2032-33</option>
              <option value="2033-34">2033-34</option>
              <option value="2034-35">2034-35</option>
              <option value="2035-36">2035-36</option>
            </select>
            {errors.academicYear && (
              <p className="custom-error">{errors.academicYear.message}</p>
            )}
          </div>

          {/*Sleect class mentor */}
          <div className="selectClassMentor form-field">
            <label className="custom-label">Class Mentor</label>
            <select
              className="custom-input"
              {...register("classMentor", {
                required: "Class Mentor is Required",
              })}
            >
              <option value="" selected disabled>
                Select Class Mentor
              </option>
              {faculties.map((faculty) => (
                <option key={faculty.faculty_id} value={faculty.faculty_id}>
                  {faculty.name}
                </option>
              ))}
            </select>
          </div>
          {/* button */}
          <div className="form-actions">
            <AddButton type="submit" />
            <CancelButton type="button" onClick={handleCancel} />
          </div>
        </form>
      </DashboardChildPageCard>
      {addedClass && (
        <DashboardChildPageCard className="mt-3">
          <h2 className="text-lg font-semibold mb-3 text-[var(--text-primary)]">Class Added Successfully!</h2>
          <div className="space-y-1 text-sm text-[var(--text-secondary)]">
            <p>
              <span className="font-medium">Year:</span> {addedClass.year}
            </p>
            <p>
              <span className="font-medium">Semester:</span> {addedClass.semester}
            </p>
            <p>
              <span className="font-medium">Section:</span> {addedClass.section}
            </p>
            <p>
              <span className="font-medium">Academic Year:</span> {addedClass.academic_year}
            </p>
            <p>
              <span className="font-medium">Class Mentor ID:</span> {addedClass.mentor_id}
            </p>
          </div>
        </DashboardChildPageCard>)}
    </DashboardChildPageTemplate>
  );
};

export default AddClassAdmin;
