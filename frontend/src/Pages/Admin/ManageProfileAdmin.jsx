import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Phone, Calendar, MapPin, Edit2 } from "lucide-react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import api from "../../api/axios";

export default function ManageProfile() {
  const { register } = useForm();

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
        <div className="p-10 text-center">Loading profile...</div>
      </DashboardChildPageTemplate>
    );
  }

  return (
    <DashboardChildPageTemplate
      title="Profile"
      desc="View and manage your profile information"
    >
      <DashboardChildPageCard>
        {/* Banner */}
        <div className="bannerDiv -mt-8 -mx-8 mb-8 bg-gradient-to-r from-blue-500 to-purple-600 p-8">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center text-blue-600">
              <User size={48} strokeWidth={0.5} />
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">
                {profile.name || "-"}
              </h2>
              <p className="text-blue-100 mt-1 text-lg">
                {formatRole()}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <div className="flex justify-end mb-6">
          <button className="flex items-center gap-2 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <Edit2 size={16} />
            Edit Profile
          </button>
        </div>

        {/* Form */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Name */}
          <InputField
            label="Full Name"
            icon={<User size={16} />}
            value={profile.name}
            register={register("fullName")}
          />

          {/* Email */}
          <InputField
            label="Email Address"
            icon={<Mail size={16} />}
            value={profile.email}
            register={register("email")}
          />

          {/* Phone */}
          <InputField
            label="Phone Number"
            icon={<Phone size={16} />}
            value={profile.contact_number}
            register={register("phoneNumber")}
          />

          {/* DOB */}
          <InputField
            label="Date of Birth"
            icon={<Calendar size={16} />}
            value={formatDate(profile.DOB)}
            register={register("dob")}
          />

          {/* Role ID */}
          <InputField
            label={`${formatRole()} ID`}
            value={profile.role_id}
            register={register("roleId")}
          />

          {/* Course */}
          <InputField
            label="Department / Course"
            value={profile.course_id}
            register={register("department")}
          />

          {/* Address */}
          <div className="md:col-span-2 space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <MapPin size={16} />
              Address
            </label>
            <textarea
              value={profile.address || "-"}
              {...register("address")}
              disabled
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none resize-none"
            />
          </div>
        </form>
      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
}

/* Reusable Input Component */
function InputField({ label, icon, value, register }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        {icon}
        {label}
      </label>
      <input
        type="text"
        value={value || "-"}
        {...register}
        disabled
        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none"
      />
    </div>
  );
}
