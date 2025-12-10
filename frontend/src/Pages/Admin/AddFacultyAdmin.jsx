import React from "react";
import { ChevronDown } from "lucide-react";
import AddButton from "../../ui/Buttons/AddButton";
import CancelButton from "../../ui/Buttons/CancelButton";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import { useForm } from "react-hook-form";

const AddFacultyAdmin = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: {errors}
  } = useForm()

  // async function handleClick(e) {
  //   //Ahiya Api call karvi
  // //   try {
  // //     const res = await api.post("api/faculties/",{name , phone , email})
  // //   } catch (error) {
  // //     const statusCode = err.response?.status;
  // //     console.log(err);
  // //   }
  // // }
  return (
    <DashboardChildPageTemplate title="Add New Faculty" desc="Enter faculty member details to add them to the system">
      <DashboardChildPageCard>
        <form action="" className="addFaculty">
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
        </form>
      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
};

export default AddFacultyAdmin;
