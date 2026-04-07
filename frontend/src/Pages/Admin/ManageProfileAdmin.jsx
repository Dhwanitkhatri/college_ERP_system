import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { User, Edit2 } from "lucide-react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import api from "../../api/axios";
import CancelButton from "../../ui/Buttons/CancelButton";
import SaveButton from "../../ui/Buttons/SaveButton";

export default function ManageProfileAdmin() {

  /* =========================
     React Hook Form Setup
  ========================== */
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  /* =========================
     State Management
  ========================== */
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  /* =========================
     Fetch Profile Data
  ========================== */
  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/profile/adminInfo");
      console.log(res);
      const { role, data } = res.data;
      const { profile, work, personal } = data;

      setProfileData(data);
      setRole(role);

      reset({
        name: profile?.name || "",
        email: profile?.email || "",
        contact: profile?.contact_number || profile?.phone || "",
        course: work?.course || "",
        address: personal?.address || "",
        qualification: personal?.qualification || "",
        experience: personal?.experience || "",
        aadhar: personal?.adherCard_number || "",
        emergency: personal?.emergency_contact || "",
        alternateEmail: personal?.alternate_email || "",
        dob: personal?.dob || "",
      });

    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* =========================
     Loading UI
  ========================== */
  if (loading) {
    return (
      <DashboardChildPageTemplate title="Profile">
        <div className="p-10 text-center text-[var(--text-secondary)]">
          Loading profile...
        </div>
      </DashboardChildPageTemplate>
    );
  }

  /* =========================
     Submit Handler
  ========================== */
  const onSubmit = async (data) => {
    try {
      const payload = {
        profile: {
          name: data.name,
          email: data.email,
          contact_number: data.contact,
        },
        work: {
          course: data.course,
        },
        personal: {
          address: data.address,
          qualification: data.qualification,
          experience: data.experience,
          adherCard_number: data.aadhar,
          emergency_contact: data.emergency,
          alternate_email: data.alternateEmail,
          dob: data.dob,
        },
      };

      await api.put("/api/profile/update-my-profile", payload);

      // ✅ Refetch updated data
      await fetchProfile();

      setIsEditing(false);

    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  /* =========================
     Role Formatter
  ========================== */
  const formatRole = () => {
    if (role === "Admin") return "Administrator";
    if (role === "Faculty") return "Faculty Member";
    return role;
  };

  /* =========================
     UI START
  ========================== */
  return (
    <DashboardChildPageTemplate
      title="Manage Profile"
      desc="View and manage your profile"
      width="max-w-7xl"
    >
      <DashboardChildPageCard>

        {/* =========================
           Banner Section
        ========================== */}
        <div className="-mt-8 -mx-8 mb-8 p-8 border-b border-[var(--border-light)] bg-[var(--bg-secondary)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Profile Info */}
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-full flex items-center justify-center shadow-md bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]">
                <User size={40} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] uppercase">
                  {profileData?.profile?.name}
                </h2>
                <p className="text-[var(--text-muted)] mt-1">
                  {formatRole()}
                </p>
              </div>
            </div>

            {/* Edit Button */}
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-medium 
              bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:opacity-90"
            >
              <Edit2 size={16} />
              Edit Profile
            </button>

          </div>
        </div>

        {/* =========================
           Form Section
        ========================== */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">

          {/* -------- Basic Details -------- */}
          <Section title="Basic Details">
            <Grid>

              <InputField label="Full Name" register={register("name")} disabled={!isEditing} />
              <InputField label="Email" register={register("email")} disabled={!isEditing} />

              <InputField
                label="Contact Number"
                register={register("contact")}
                disabled={!isEditing}
              />

              {/* Read Only */}
              <InputField
                label={`${formatRole()} ID`}
                defaultValue={
                  profileData?.profile?.admin_id ||
                  profileData?.profile?.faculty_id
                }
                disabled
              />

              <InputField
                label="Course"
                register={register("course")}
                disabled={true}
              />

            </Grid>
          </Section>

          {/* -------- Personal Details -------- */}
          <Section title="Personal Details">
            <Grid>

              <InputField label="Date of Birth" register={register("dob")} disabled={!isEditing} />
              <InputField label="Qualification" register={register("qualification")} disabled={!isEditing} />
              <InputField label="Experience" register={register("experience")} disabled={!isEditing} />
              <InputField label="Aadhar Card" register={register("aadhar")} disabled={!isEditing} />
              <InputField label="Emergency Contact" register={register("emergency")} disabled={!isEditing} />
              <InputField label="Alternate Email" register={register("alternateEmail")} disabled={!isEditing} />
              <InputField label="Date of Birth" register={register("dob")} disabled={!isEditing} />

            </Grid>
          </Section>

          {/* -------- Address -------- */}
          <Section title="Address">
            <div className="form-field !my-0">
              <label className="custom-label">Address</label>
              <textarea
                {...register("address")}
                disabled={!isEditing}
                className={`custom-input theme-transition h-24 resize-none ${
                  !isEditing ? "opacity-60 cursor-not-allowed" : ""
                }`}
              />
            </div>
          </Section>

          {/* -------- Buttons -------- */}
          <div className="form-actions">
            <CancelButton onClick={() => window.location.reload()} />
            <SaveButton type="submit" />
          </div>

        </form>

      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
}

/* =========================
   Reusable Components
========================= */

// Section Wrapper
function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border-light)] pb-2 mb-6 uppercase tracking-wide">
        {title}
      </h3>
      {children}
    </div>
  );
}

// Grid Layout
function Grid({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  );
}

// Input Field
function InputField({ label, register, defaultValue, disabled }) {
  return (
    <div className="form-field !my-0">
      <label className="custom-label">{label}</label>
      <input
        {...(register || {})}
        defaultValue={defaultValue || ""}
        disabled={disabled}
        placeholder={`Enter ${label.toLowerCase()}...`}
        className={`custom-input theme-transition ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
      />
    </div>
  );
}
