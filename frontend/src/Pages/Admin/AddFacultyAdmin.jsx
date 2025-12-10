import React from "react";
import { ChevronDown } from "lucide-react";
import AddButton from "../../ui/Buttons/AddButton";
import CancelButton from "../../ui/Buttons/CancelButton";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { get, useForm } from "react-hook-form";
import api from "../../api/axios.js";

const AddFacultyAdmin = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: {errors}
  } = useForm()

  async function onSubmit(data) {
    try {
      const token = localStorage.getItem("token");
       const res = await api.post("/api/faculties",{
      name: data.fullName,
      phone: data.phoneNo,
      email: data.email,
   }, {
        headers: {
          Authorization: `Bearer ${token}`,   
          "Content-Type": "application/json"
        }
      });
   if(res.status === 201){
    console.log(res.data);
    alert("Faculty Added Successfully");
   } else {
    console.log(res.data);
    alert("Error Adding Faculty");
   }
    } catch (error) {
      
    }
    
  }

  return (
    <DashboardChildPageTemplate title="Add New Faculty" desc="Enter faculty member details to add them to the system">
      <DashboardChildPageCard>
        <form action="" className="addFaculty" onSubmit={handleSubmit(onSubmit)}>
          <div className="fullNameDiv">
            <label className="fullNameLabel custom-label">Full Name</label>
            <input type="text" placeholder="Enter Full Name" className="fullNameInput custom-input" 
            {...register("fullName",
              {
                required:"Please Fill This Field",
                minLength:{value:3,message:"Minimum 3 Characters are Required"},
                maxLength:{value:50,message:"Maximum Character Limit is 50"},
                pattern:{value:/^[A-Za-z ]+$/,message:"Only Alphabets are Allowed"}
              }
            )}/>
          </div>
          {errors.fullName && <p>{errors.fullName.message}</p>}
          <div className="phoneNoDiv">
            <label className="phoneNoLabel custom-label">Phone</label>
            <input type="text" placeholder="Enter Phone Number" className="phoneNoInput custom-input" 
            {...register("phoneNo",
              {
                required:"Please Fill This Field",
                pattern:{value:/^[0-9]{10}$/,message:"Please Enter Valid Phone Number"}
              }
            )}/>
          </div>
          {errors.phoneNo && <p className="errorMsg">{errors.phoneNo.message}</p>}
          <div className="emailDiv">
            <label className="emailLabel custom-label">Email address</label>
            <input type="text" placeholder="Enter Email address" className="emailInput custom-input" 
            {...register("email",
              {
                required:"Please Fill This Field",
                pattern:{value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,message:"Enter a valid email address"}
              }
            )}/>
          </div>
          {errors.email && <p className="errorMsg">{errors.email.message}</p>}
      <AddButton />
      <CancelButton />
        </form>
      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
};

export default AddFacultyAdmin;
