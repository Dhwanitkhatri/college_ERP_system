import React from "react";
import { useForm } from "react-hook-form";
import { IndianRupee } from "lucide-react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import CancelButton from "../../ui/Buttons/CancelButton";
import api from "../../api/axios.js";
import { useState } from "react";

export default function CreateFeeStructureAdmin() {
  const [totalFee, setTotalFee] = useState(0);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const tutionFee= watch("tuitionFee") || 0;
  const examFee= watch("examFee") || 0;
  const libraryFee= watch("libraryFee") || 0;
  const labFee= watch("labFee") || 0;
  const miscFee= watch("miscFee") || 0;
  const totalFeeAmount = Number(tutionFee) + Number(examFee) + Number(libraryFee) + Number(labFee) + Number(miscFee);
  const onSubmit = (data) => {
    const token = localStorage.getItem("token");
    console.log("Form Submitted :", data);
    try {
      api.post("api/fee/fee-structure/create", {
        semester: data.semester,
        academic_year: data.academicYear,
        tuition_fee: data.tuitionFee,
        exam_fee: data.examFee,
        library_fee: data.libraryFee,
        lab_fee: data.labFee,
        misc_fee: data.miscFee,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Fee Structure Created:", response.data);
        alert("Fee Structure created successfully!");
      })
      .catch((error) => {
        console.error("Error creating fee structure:", error.response?.data || error.message);
        alert("Failed to create Fee Structure.");
      });
    } catch (error) {
      
    }
  };

  return (
    <DashboardChildPageTemplate
      title="Create Fee Structure"
      desc="Define fee structure for semester and academic year"
      width="max-w-7xl"
    >
      <div className="mainDiv pb-10">
        <DashboardChildPageCard>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="gridDiv grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="custom-label">
                  Semester <span className="text-red-500">*</span>
                </label>
                <select
                  className="custom-input theme-transition"
                  defaultValue=""
                  {...register("semester", {
                    required: "Semester is required",
                  })}
                >
                  <option value="" disabled>
                    Select semester
                  </option>
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
                  <p className="text-xs text-red-500 mt-1">
                    {errors.semester.message}
                  </p>
                )}
              </div>
              <div className="academicYearDiv">
                <label className="custom-label">
                  Academic Year <span className="text-red-500">*</span>
                </label>
                <select
                  className="custom-input theme-transition"
                  defaultValue=""
                  {...register("academicYear", {
                    required: "Academic Year is required",
                  })}
                >
                  <option value="" disabled>
                    Select academic year
                  </option>
                  <option value="2024-25">2024-25</option>
                  <option value="2025-26">2025-26</option>
                  <option value="2026-27">2026-27</option>
                </select>
                {errors.academicYear && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.academicYear.message}
                  </p>
                )}
              </div>
            </div>
            <div className="gridDiv grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="tutionFeeDiv">
                <label className="custom-label">
                  Tuition Fee (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter tuition fee"
                  className="custom-input theme-transition"
                  {...register("tuitionFee", {
                    required: "Tuition fee is required",
                    min: { value: 0, message: "Fee cannot be negative" },
                  })}
                />
                {errors.tuitionFee && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.tuitionFee.message}
                  </p>
                )}
              </div>
              <div className="examFeeDiv">
                <label className="custom-label">
                  Exam Fee (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter exam fee"
                  className="custom-input theme-transition"
                  {...register("examFee", {
                    required: "Exam fee is required",
                    min: { value: 0, message: "Fee cannot be negative" },
                  })}
                />
                {errors.examFee && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.examFee.message}
                  </p>
                )}
              </div>
            </div>
            <div className="gridDiv grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="libraryFeeDiv">
                <label className="custom-label">
                  Library Fee (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter library fee"
                  className="custom-input theme-transition"
                  {...register("libraryFee", {
                    required: "Library fee is required",
                    min: { value: 0, message: "Fee cannot be negative" },
                  })}
                />
                {errors.libraryFee && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.libraryFee.message}
                  </p>
                )}
              </div>
              <div className="labFeeDiv">
                <label className="custom-label">
                  Lab Fee (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter lab fee"
                  className="custom-input theme-transition"
                  {...register("labFee", {
                    required: "Lab fee is required",
                    min: { value: 0, message: "Fee cannot be negative" },
                  })}
                />
                {errors.labFee && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.labFee.message}
                  </p>
                )}
              </div>
            </div>
            <div className="gridDiv grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="miscFeeDiv">
                <label className="custom-label">
                  Miscellaneous Fee (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter miscellaneous fee"
                  className="custom-input theme-transition"
                  {...register("miscFee", {
                    required: "Miscellaneous fee is required",
                    min: { value: 0, message: "Fee cannot be negative" },
                  })}
                />
                {errors.miscFee && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.miscFee.message}
                  </p>
                )}
              </div>
            </div>
            <div className="totalFeeDiv p-4 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-between dark:bg-blue-900/20 dark:border-blue-800 theme-transition">
              <div className="iconDiv flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <IndianRupee size={20} />
                <span className="font-semibold text-lg">Total Fee Amount</span>
              </div>
              <span className="text-xl font-bold text-blue-700 dark:text-blue-300">
                {totalFeeAmount}
              </span>
            </div>
            <div className="buttonDiv form-actions">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-md font-medium flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap theme-transition"
                style={{
                  backgroundColor: "var(--btn-primary-bg)",
                  color: "var(--btn-primary-text)",
                }}
              >
                Create Fee Structure
              </button>
              <CancelButton />
            </div>
          </form>
        </DashboardChildPageCard>
      </div>
    </DashboardChildPageTemplate>
  );
}
