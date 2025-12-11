import React from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Phone, Calendar, MapPin, Edit2 } from "lucide-react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";

export default function ManageProfileAdmin() {
  const { register } = useForm();

  return (
    <DashboardChildPageTemplate
      title="Profile"
      desc="View and manage your profile information"
    >
      <DashboardChildPageCard>
        <div className="bannerDiv -mt-8 -mx-8 mb-8 bg-gradient-to-r from-blue-500 to-purple-600 p-8">
          <div className="bannerContentDiv flex items-center gap-6">
            <div className="userDiv h-24 w-24 rounded-full bg-[#FFFFFF] dark:bg-[#111827] flex items-center justify-center text-blue-600">
              <User size={48} strokeWidth={0.5} />
            </div>
            <div className="titleTextDiv text-white">
              <h2 className="text-2xl font-bold">Dr. Sarah Johnson</h2>
              <p className="text-blue-100 mt-1 text-lg">Administrator</p>
            </div>
          </div>
        </div>
        <div className="editButtonDiv flex justify-end mb-6">
          <button className="flex items-center gap-2 bg-[#000000] hover:bg-[#1F2937] dark:bg-[#FFFFFF] dark:hover:bg-[#E5E7EB] text-[#FFFFFF] dark:text-[#000000] px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <Edit2 size={16} />
            Edit Profile
          </button>
        </div>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="formDiv space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[#374151] dark:text-[#D1D5DB]">
              <User size={16} className="text-[#6B7280] dark:text-[#6B7280]" />
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              {...register("fullName")}
              className="w-full px-4 py-3 bg-[#F9FAFB] dark:bg-[#030712] border border-[#D1D5DB] dark:border-[#374151] rounded-lg text-[#111827] dark:text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-[#6B7280] dark:placeholder-[#6B7280]"
            />
          </div>
          <div className="emailDiv space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[#374151] dark:text-[#D1D5DB]">
              <Mail size={16} className="text-[#6B7280] dark:text-[#6B7280]" />
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter email address"
              {...register("email")}
              className="w-full px-4 py-3 bg-[#F9FAFB] dark:bg-[#030712] border border-[#D1D5DB] dark:border-[#374151] rounded-lg text-[#111827] dark:text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-[#6B7280] dark:placeholder-[#6B7280]"
            />
          </div>
          <div className="phoneDiv space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[#374151] dark:text-[#D1D5DB]">
              <Phone size={16} className="text-[#6B7280] dark:text-[#6B7280]" />
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Enter phone number"
              {...register("phoneNumber")}
              className="w-full px-4 py-3 bg-[#F9FAFB] dark:bg-[#030712] border border-[#D1D5DB] dark:border-[#374151] rounded-lg text-[#111827] dark:text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-[#6B7280] dark:placeholder-[#6B7280]"
            />
          </div>
          <div className="d.o.bDiv space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[#374151] dark:text-[#D1D5DB]">
              <Calendar
                size={16}
                className="text-[#6B7280] dark:text-[#6B7280]"
              />
              Date of Birth
            </label>
            <input
              type="text"
              placeholder="Enter date of birth"
              {...register("dob")}
              className="w-full px-4 py-3 bg-[#F9FAFB] dark:bg-[#030712] border border-[#D1D5DB] dark:border-[#374151] rounded-lg text-[#111827] dark:text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-[#6B7280] dark:placeholder-[#6B7280]"
            />
          </div>
          <div className="adminIdDivspace-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[#374151] dark:text-[#D1D5DB]">
              Admin ID
            </label>
            <input
              type="text"
              placeholder="Enter admin ID"
              {...register("adminId")}
              className="w-full px-4 py-3 bg-[#F9FAFB] dark:bg-[#030712] border border-[#D1D5DB] dark:border-[#374151] rounded-lg text-[#111827] dark:text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-[#6B7280] dark:placeholder-[#6B7280]"
            />
          </div>
          <div className="departmentDiv space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[#374151] dark:text-[#D1D5DB]">
              Department
            </label>
            <input
              type="text"
              placeholder="Enter department"
              {...register("department")}
              className="w-full px-4 py-3 bg-[#F9FAFB] dark:bg-[#030712] border border-[#D1D5DB] dark:border-[#374151] rounded-lg text-[#111827] dark:text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-[#6B7280] dark:placeholder-[#6B7280]"
            />
          </div>
          <div className="addressDiv md:col-span-2 space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[#374151] dark:text-[#D1D5DB]">
              <MapPin
                size={16}
                className="text-[#6B7280] dark:text-[#6B7280]"
              />
              Address
            </label>
            <textarea
              placeholder="Enter address"
              {...register("address")}
              className="w-full px-4 py-3 bg-[#F9FAFB] dark:bg-[#030712] border border-[#D1D5DB] dark:border-[#374151] rounded-lg text-[#111827] dark:text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-[#6B7280] dark:placeholder-[#6B7280] min-h-[100px] resize-none"
            />
          </div>
        </form>
      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
}
