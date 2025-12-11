import React from "react";
import AddButton from "../../ui/Buttons/AddButton";
import CancelButton from "../../ui/Buttons/CancelButton";
import { useForm } from "react-hook-form";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";

const AddStudentAdmin = () => {
  const {
      register,
      handleSubmit,
      watch,
      formState: {errors}
    } = useForm()
  
    async function onSubmit(data) {
      alert("done");
      try {
        const token = localStorage.getItem("token");
        const res = await api.post(
          "/api/faculties",
          {
            name: data.fullName,
            phone: data.phoneNo,
            email: data.email,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        console.log(res.data);
        alert("Faculty Added Successfully");
      } catch (error) {
        console.log(res.data);
        alert("Error Adding Faculty");
      }
    }
  
    return (
      <DashboardChildPageTemplate title="Add New Student" desc="Enter student details to add them to the system">
        <DashboardChildPageCard>
          <form className="addStudent" onSubmit={handleSubmit(onSubmit)}>
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
            <div className="genderDiv">
              <label className="genderLabel custom-label">Gender</label>
              <select className="genderInput custom-input" 
              {...register("gender",
                {
                  required:"Please Fill This Field",
                }
              )}>
                <option value="" hidden>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>
            {errors.gender && <p className="errorMsg">{errors.gender.message}</p>}
            <div className="phoneNoDiv">
              <label className="phoneNoLabel custom-label">Phone</label>
              <input type="text" placeholder="Enter Phone Number" className="phoneNoInput custom-input" 
              {...register("phoneNo",
                {
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
            <div className="dobDiv">
              <label className="dobLabel custom-label">Date of Birth</label>
              <input type="date" placeholder="Enter Date of Birth" className="dobInput custom-input" 
              {...register("dob",
                {
                  required:"Please Fill This Field",
                }
              )}/>
            </div>
            {errors.dob && <p className="errorMsg">{errors.dob.message}</p>}
            <div className="admissionYearDiv">
              <label className="admissionYearLabel custom-label">Year of Admission</label>
              <input
                type="number"
                className="admissionYearInput custom-input"
                defaultValue={new Date().getFullYear()}
                readOnly     // prevents editing
                {...register("admissionYear", {
                  required: "Please Fill This Field",
                })}
              />
            </div>
            {errors.admissionYear && <p className="errorMsg">{errors.admissionYear.message}</p>}
            <div className="yearOfStudyingDiv">
              <label className="yearOfStudyingLabel custom-label">Year of Studying</label>
              <select className="yearOfStudyingInput custom-input" 
              {...register("yearOfStudying",
                {
                  required:"Please Fill This Field",
                }
              )}>
                <option value="" hidden>Select Year of Studying</option>
                <option value="First Year">First Year</option>
                <option value="Second Year">Second Year</option>
                <option value="Third Year">Third Year</option>
              </select>
            </div>
            {errors.gender && <p className="errorMsg">{errors.gender.message}</p>}
        <AddButton />
        <CancelButton />
          </form>
        </DashboardChildPageCard>
      </DashboardChildPageTemplate>
  );
};

export default AddStudentAdmin;
