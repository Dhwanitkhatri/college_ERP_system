import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { User, Edit2 } from "lucide-react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import api from "../../api/axios";

export default function ManageProfile() {
  {
    /* this is the react hook form part with validation errors */
  }
  const {
    register,
    formState: { errors },
  } = useForm();

  const [profile, setProfile] = useState({});
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("api/profile/admininfo");
        setProfile(res.data.profile);
        setRole(res.data.role);
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";
    return date.split("T")[0];
  };

  const formatRole = () => {
    if (!role) return "";
    if (role === "admin") return "Administrator";
    if (role === "faculty") return "Faculty Member";
    if (role === "student") return "Student";
    return role;
  };

  if (loading) {
    return (
      <DashboardChildPageTemplate title="Profile">
        <div className="p-10 text-center text-gray-600 dark:text-gray-300 font-medium">
          Loading profile...
        </div>
      </DashboardChildPageTemplate>
    );
  }
  {
    /* ========================================================= */
  }

  {
    /* the main designing part start from here */
  }
  return (
    <DashboardChildPageTemplate
      title="Manage Profile"
      desc="View and manage your comprehensive profile information"
      width="max-w-7xl"
    >
      <DashboardChildPageCard>
        {/* this is the banner part */}
        <div className="bannerDiv -mt-8 -mx-8 mb-8 bg-gray-100 dark:bg-gray-800/50 p-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shadow-md">
                <User size={44} strokeWidth={1.5} />
              </div>
              <div className="text-black dark:text-white">
                <h2 className="text-2xl font-bold uppercase tracking-wide">
                  {profile.name || "-"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1 text-lg font-medium">
                  {formatRole()}
                </p>
              </div>
            </div>

            {/* this is the edit button part */}
            <button className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black hover:opacity-90 px-6 py-2.5 rounded-md text-sm font-medium transition-opacity">
              <Edit2 size={16} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* this is the form part */}
        <form className="flex flex-col gap-10">
          {/* this is the basic and personal details part */}
          <div>
            <h3 className="text-lg font-bold text-black dark:text-white border-b border-gray-300 dark:border-gray-700 pb-2 mb-6 uppercase tracking-wide">
              Basic & Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputField
                label="Full Name"
                register={register("fullName", {
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only alphabets and spaces allowed",
                  },
                })}
                error={errors.fullName}
                defaultValue={profile.name}
              />
              <InputField
                label="Email Address"
                register={register("email", {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                error={errors.email}
                defaultValue={profile.email}
              />
              <InputField
                label="Phone Number"
                register={register("phoneNumber", {
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Must be exactly 10 digits",
                  },
                })}
                error={errors.phoneNumber}
                defaultValue={profile.contact_number}
              />
              <InputField
                label="Date of Birth"
                register={register("dob")}
                defaultValue={formatDate(profile.DOB)}
              />
              <InputField
                label={`${formatRole()} ID`}
                register={register("roleId")}
                defaultValue={profile.role_id}
                disabled
              />
              <InputField
                label="Department / Course"
                register={register("department")}
                defaultValue={profile.course_id}
                disabled
              />
              <InputField label="Gender" register={register("gender")} />
              <InputField
                label="Blood Group"
                register={register("bloodGroup")}
              />
              <InputField
                label="Birth Place"
                register={register("birthPlace")}
              />
              <InputField label="Caste" register={register("caste")} />
              <InputField label="Category" register={register("category")} />
              <InputField
                label="Aadhar Card"
                register={register("aadharCard", {
                  pattern: {
                    value: /^[0-9]{12}$/,
                    message: "Aadhar must be exactly 12 digits",
                  },
                })}
                error={errors.aadharCard}
              />
            </div>
          </div>

          {/* this is the contact and address part */}
          <div>
            <h3 className="text-lg font-bold text-black dark:text-white border-b border-gray-300 dark:border-gray-700 pb-2 mb-6 uppercase tracking-wide">
              Contact & Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-field !my-0">
                <label className="custom-label">Current Address</label>
                <textarea
                  {...register("currentAddress")}
                  defaultValue={profile.address || ""}
                  className="custom-input bg-[var(--bg-primary)] theme-transition resize-none h-24"
                  placeholder="Enter current address..."
                />
              </div>
              <div className="form-field !my-0">
                <label className="custom-label">Permanent Address</label>
                <textarea
                  {...register("permanentAddress")}
                  className="custom-input bg-[var(--bg-primary)] theme-transition resize-none h-24"
                  placeholder="Enter permanent address..."
                />
              </div>
            </div>
          </div>

          {/* this is the family details part */}
          <div>
            <h3 className="text-lg font-bold text-black dark:text-white border-b border-gray-300 dark:border-gray-700 pb-2 mb-6 uppercase tracking-wide">
              Family Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <InputField
                label="Mother Name"
                register={register("motherName", {
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only alphabets and spaces allowed",
                  },
                })}
                error={errors.motherName}
              />
              <InputField
                label="Mother Contact No."
                register={register("motherContact", {
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Must be exactly 10 digits",
                  },
                })}
                error={errors.motherContact}
              />
              <InputField
                label="Father Name"
                register={register("fatherName", {
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only alphabets and spaces allowed",
                  },
                })}
                error={errors.fatherName}
              />
              <InputField
                label="Father Contact No."
                register={register("fatherContact", {
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Must be exactly 10 digits",
                  },
                })}
                error={errors.fatherContact}
              />
            </div>
          </div>

          {/* this is the parent or guardian details part */}
          <div>
            <h3 className="text-lg font-bold text-black dark:text-white border-b border-gray-300 dark:border-gray-700 pb-2 mb-6 uppercase tracking-wide">
              Parent / Guardian Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputField
                label="Parent Name"
                register={register("parentName", {
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only alphabets and spaces allowed",
                  },
                })}
                error={errors.parentName}
              />
              <InputField
                label="Parent Email"
                register={register("parentEmail", {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                error={errors.parentEmail}
              />
              <InputField
                label="Parent Contact"
                register={register("parentContact", {
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Must be exactly 10 digits",
                  },
                })}
                error={errors.parentContact}
              />
              <InputField
                label="Occupation"
                register={register("occupation")}
              />
              <InputField
                label="Annual Income"
                register={register("annualIncome", {
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Must contain only numbers",
                  },
                })}
                error={errors.annualIncome}
              />
              <InputField
                label="Designation"
                register={register("designation")}
              />
              <InputField
                label="Organization"
                register={register("organization")}
              />
              <div className="md:col-span-2">
                <InputField
                  label="Parent Address"
                  register={register("parentAddress")}
                />
              </div>
              <div className="md:col-span-3">
                <div className="form-field !my-0">
                  <label className="custom-label">Guardian Details</label>
                  <textarea
                    {...register("guardianDetails")}
                    className="custom-input bg-[var(--bg-primary)] theme-transition resize-none h-20"
                    placeholder="Enter guardian details if applicable..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* this is the academic and other details part */}
          <div>
            <h3 className="text-lg font-bold text-black dark:text-white border-b border-gray-300 dark:border-gray-700 pb-2 mb-6 uppercase tracking-wide">
              Academic & Other Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputField
                label="School Details (SSC)"
                register={register("schoolSSC")}
              />
              <InputField
                label="School Details (HSC)"
                register={register("schoolHSC")}
              />
              <InputField
                label="School Details (Other)"
                register={register("schoolOther")}
              />
              <InputField
                label="Hostel Details (If Any)"
                register={register("hostelDetails")}
              />
              <InputField
                label="Bank Details (Optional)"
                register={register("bankDetails")}
              />
            </div>
          </div>
        </form>
      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
}

{
  /* this is the reusable input component part */
}
function InputField({ label, register, defaultValue, disabled, error }) {
  return (
    <div className="form-field !my-0">
      <label className="custom-label">{label}</label>
      <input
        type="text"
        {...register}
        defaultValue={defaultValue || ""}
        disabled={disabled}
        placeholder={`Enter ${label.toLowerCase()}...`}
        className={`custom-input bg-[var(--bg-primary)] theme-transition ${
          disabled
            ? "opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
            : ""
        } ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1.5 font-medium">
          {error.message}
        </p>
      )}
    </div>
  );
}
