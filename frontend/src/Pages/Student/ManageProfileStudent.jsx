import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { User, Edit2 } from "lucide-react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import api from "../../api/axios";
import CancelButton from "../../ui/Buttons/CancelButton";
import SaveButton from "../../ui/Buttons/SaveButton";

export default function ManageProfileStudent() {

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // edit mode
  const [isEditing, setIsEditing] = useState(false);

  // backend state
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/profile/adminInfo");

        const { profile, academic, personal } = res.data.data;

        setProfileData(res.data.data);

        reset({
          fullName: profile?.name || "",
          email: profile?.email || "",
          gender: profile?.gender || "",
          dob: profile?.dob || "",
          yearOfStudy: academic?.year_of_study || "",
          parentName: personal?.parent_name || "",
          parentContact: personal?.parent_contact || "",
          address: personal?.address || "",
          emergencyContact: personal?.emergency_contact || "",
          aadharCard: personal?.adharCard_number || "",
        });

      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);

  if (loading) {
    return (
      <DashboardChildPageTemplate title="Profile">
        <div className="p-10 text-center text-[var(--text-secondary)]">
          Loading profile...
        </div>
      </DashboardChildPageTemplate>
    );
  }

  // submit
  const onSubmit = async (data) => {
    try {
      const payload = {
        profile: {
          name: data.fullName,
          email: data.email,
          gender: data.gender,
          dob: data.dob,
        },
        academic: {
          year_of_study: data.yearOfStudy,
        },
        personal: {
          parent_name: data.parentName,
          parent_contact: data.parentContact,
          address: data.address,
          emergency_contact: data.emergencyContact,
          adharCard_number: data.aadharCard,
        },
      };

      await api.put("/api/profile/update-my-profile", payload);

      // refetch updated data
      const res = await api.get("/api/profile/adminInfo");
      setProfileData(res.data.data);

      setIsEditing(false);

    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <DashboardChildPageTemplate
      title="Manage Profile"
      desc="View and manage your profile"
      width="max-w-7xl"
    >
      <DashboardChildPageCard>

        {/* ===== Banner ===== */}
        <div className="-mt-8 -mx-8 mb-8 p-8 border-b border-[var(--border-light)] bg-[var(--bg-secondary)] theme-transition">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">

            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] flex items-center justify-center shadow-md">
                <User size={36} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] uppercase">
                  {profileData?.profile?.name}
                </h2>
                <p className="text-[var(--text-muted)] font-medium">
                  Student
                </p>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-5 py-2 rounded-md text-sm font-medium 
              bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] 
              hover:opacity-90 transition"
            >
              <Edit2 size={16} />
              Edit Profile
            </button>

          </div>
        </div>

        {/* ===== Form ===== */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">

          {/* ===== Basic Details ===== */}
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border-light)] pb-2 mb-6 uppercase">
              Basic Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              <InputField label="Full Name" register={register("fullName")} error={errors.fullName} disabled={!isEditing} />
              <InputField label="Email" register={register("email")} error={errors.email} disabled={!isEditing} />
              <InputField label="Gender" register={register("gender")} disabled={!isEditing} />
              <InputField label="Date of Birth" register={register("dob")} disabled={!isEditing} />

              <InputField
                label="Student ID"
                register={register("studentId")}
                defaultValue={profileData?.profile?.student_id}
                disabled
              />

              <InputField
                label="Course"
                register={register("course")}
                defaultValue={profileData?.academic?.course}
                disabled
              />

              <InputField
                label="Year of Study"
                register={register("yearOfStudy")}
                disabled={!isEditing}
              />

            </div>
          </div>

          {/* ===== Personal Details ===== */}
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border-light)] pb-2 mb-6 uppercase">
              Personal Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              <InputField label="Parent Name" register={register("parentName")} disabled={!isEditing} />
              <InputField label="Parent Contact" register={register("parentContact")} disabled={!isEditing} />
              <InputField label="Aadhar Card" register={register("aadharCard")} disabled={!isEditing} />
              <InputField label="Emergency Contact" register={register("emergencyContact")} disabled={!isEditing} />

            </div>
          </div>

          {/* ===== Address ===== */}
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border-light)] pb-2 mb-6 uppercase">
              Address
            </h3>

            <div className="form-field !my-0">
              <label className="custom-label">Address</label>
              <textarea
                {...register("address")}
                disabled={!isEditing}
                className={`custom-input resize-none h-24 theme-transition ${
                  !isEditing ? "opacity-60 cursor-not-allowed" : ""
                }`}
              />
            </div>
          </div>

          {/* ===== Buttons ===== */}
          <div className="form-actions">
            <CancelButton onClick={() => window.location.reload()} />
            <SaveButton type="submit" />
          </div>

        </form>

      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
}

/* ===== Reusable Input ===== */
function InputField({ label, register, defaultValue, disabled, error }) {
  return (
    <div className="form-field !my-0">
      <label className="custom-label">{label}</label>

      <input
        {...register}
        defaultValue={defaultValue || ""}
        disabled={disabled}
        placeholder={`Enter ${label.toLowerCase()}...`}
        className={`custom-input theme-transition ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        } ${error ? "border-red-500" : ""}`}
      />

      {error && <p className="custom-error">{error.message}</p>}
    </div>
  );
}
