import React, { useEffect, useState } from "react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import CancelButton from "../../ui/Buttons/CancelButton";
import SaveButton from "../../ui/Buttons/SaveButton";
import { IndianRupee } from "lucide-react";
// import api from "../../api/axios.js";

const ViewFeeStructureAdmin = () => {
  // ---------------- STATE ----------------
  const [semester, setSemester] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [feeData, setFeeData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---------------- DUMMY DATA ----------------
  const dummyData = {
    semester: "3",
    academic_year: "2025-26",
    tuition_fee: 25000,
    exam_fee: 3000,
    library_fee: 1500,
    lab_fee: 4000,
    misc_fee: 2000,
  };

  // ---------------- FETCH DATA ----------------
  const handleFetch = async () => {
    if (!semester || !academicYear) return;

    setLoading(true);

    // 🔹 DUMMY
    setTimeout(() => {
      setFeeData(dummyData);
      setLoading(false);
    }, 500);

    // 🔹 BACKEND (Future)
    /*
    try {
      const res = await api.get(
        `/api/fee/fee-structure?semester=${semester}&academic_year=${academicYear}`
      );
      setFeeData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    */
  };

  // ---------------- HANDLE INPUT CHANGE ----------------
  const handleChange = (field, value) => {
    setFeeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ---------------- SAVE CHANGES ----------------
  const handleSave = async () => {
    try {
      console.log("Updated Data:", feeData);

      // 🔹 BACKEND API
      /*
      await api.put(`/api/fee/fee-structure/update/${feeData.id}`, feeData);
      */

      alert("Fee Structure Updated Successfully");
      setEditMode(false);
    } catch (error) {
      console.error(error);
      alert("Update Failed");
    }
  };

  // ---------------- TOTAL CALC ----------------
  const total =
    Number(feeData?.tuition_fee || 0) +
    Number(feeData?.exam_fee || 0) +
    Number(feeData?.library_fee || 0) +
    Number(feeData?.lab_fee || 0) +
    Number(feeData?.misc_fee || 0);

  return (
    <DashboardChildPageTemplate
      title="View Fee Structure"
      desc="Select semester and academic year to view fee details"
    >
      {/* ---------------- FILTER SECTION ---------------- */}
      <DashboardChildPageCard>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Semester */}
          <div className="form-field">
            <label className="custom-label">Semester</label>
            <select
              className="custom-input"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="">Select</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          {/* Academic Year */}
          <div className="form-field">
            <label className="custom-label">Academic Year</label>
            <select
              className="custom-input"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
            >
              <option value="">Select</option>
              <option value="2024-25">2024-25</option>
              <option value="2025-26">2025-26</option>
              <option value="2026-27">2026-27</option>
            </select>
          </div>

          {/* Fetch Button */}
          <div className="form-field">
            {/* Invisible label to match height */}
            <label className="custom-label invisible">Action</label>

            <button
              onClick={handleFetch}
              className="w-full px-4 py-2.5 rounded-md text-sm font-medium theme-transition
    bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]
    hover:bg-[var(--btn-primary-hover)]"
            >
              View
            </button>
          </div>
        </div>
      </DashboardChildPageCard>

      {/* ---------------- DISPLAY SECTION ---------------- */}
      <DashboardChildPageCard className="mt-3">
        {loading && <p>Loading...</p>}

        {!feeData && !loading && (
          <p className="text-[var(--text-muted)]">
            Select semester and year to view fee structure
          </p>
        )}

        {feeData && !loading && (
          <>
            {/* Edit Button */}
            {!editMode && (
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 rounded-md text-sm font-medium theme-transition
  bg-[var(--btn-blue-bg)] text-[var(--btn-blue-text)]
  hover:bg-[var(--btn-blue-hover)]"
                >
                  Edit
                </button>
              </div>
            )}

            {/* FORM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Tuition Fee", key: "tuition_fee" },
                { label: "Exam Fee", key: "exam_fee" },
                { label: "Library Fee", key: "library_fee" },
                { label: "Lab Fee", key: "lab_fee" },
                { label: "Misc Fee", key: "misc_fee" },
              ].map((item) => (
                <div className="form-field" key={item.key}>
                  <label className="custom-label">{item.label}</label>
                  <input
                    type="number"
                    className="custom-input"
                    value={feeData[item.key]}
                    disabled={!editMode}
                    onChange={(e) => handleChange(item.key, e.target.value)}
                  />
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div
              className="mt-6 p-4 rounded-lg flex justify-between items-center theme-transition
  border border-[var(--border-light)]
  bg-[var(--bg-secondary)]"
            >
              <div className="flex items-center gap-2 text-[var(--text-primary)]">
                <IndianRupee className="text-[var(--icon-color)]" />
                <span className="font-semibold">Total</span>
              </div>

              <span className="font-bold text-lg text-[var(--text-primary)]">
                {total}
              </span>
            </div>

            {/* ACTION BUTTONS */}
            {editMode && (
              <div className="form-actions mt-4">
                <SaveButton onClick={handleSave} />
                <CancelButton onClick={() => setEditMode(false)} />
              </div>
            )}
          </>
        )}
      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
};

export default ViewFeeStructureAdmin;
