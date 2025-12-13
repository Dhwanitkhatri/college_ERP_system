import React from "react";
import { useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import AddButton from "../../ui/Buttons/AddButton";
import CancelButton from "../../ui/Buttons/CancelButton";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import api from "../../api/axios.js";

const AddSubjectAdmin = () => {

    const {
        register,
        handleSubmit,
        watch,
        formState: {errors}
      } = useForm()
    

  const navigate = useNavigate();
  const [faculties, setFaculties] = useState([]);
  const token = localStorage.getItem("token");
  useEffect((async) => {
    api
      .get("/api/faculties/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setFaculties(response.data);
        console.log("Faculties data:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching faculties:", error);
      });
  }, []);
  async function onSubmit(data) {
    console.log("form data",data);
    const token = localStorage.getItem("token");
    try {
      const res = await api.post(
        "/api/subjects/",
        {
          subject_id: data.subjectId,
          subject_name: data.subjectName,
          faculty_id: data.facultyId,
          semester: data.semester,
          lecture_per_week: data.lecturePerWeek,
          credit: data.credit,
        
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Subject Added Successfully");   
    } catch (error) {
      console.log("Backend error:", error.response?.data);
  alert(error.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div className="mainDiv h-full bg-white dark:bg-gray-950 p-8 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="headerDiv max-w-3xl mx-auto mb-8 flex items-start gap-4">
        <button
          className="mt-1 -ml-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="titleDiv">
          <h1 className="text-xl font-bold dark:text-white">Add New Subject</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Enter Subject details to add it to the system.
          </p>
        </div>
      </div>
      <div className="formDiv max-w-3xl mx-auto border border-gray-200 dark:border-gray-800 rounded-xl p-8 bg-white dark:bg-gray-900 shadow-sm transition-colors duration-200">
        <form
          className="flex flex-col gap-6"
           onSubmit={handleSubmit(onSubmit)}
        >
          {/* this is for the subject id input field*/}
          <div className="CourseDiv">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Subject Id <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter subject ID (e.g., Mathematics , English)"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm
                        outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400
                        placeholder:text-gray-400 dark:placeholder-gray-500
                        dark:bg-gray-950 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-500 transition-colors"
                        {...register("subjectId",
                {
                  required:"Please Fill This Field",
                  minLength:{value:3,message:"Minimum 3 Characters are Required"},
                  maxLength:{value:12,message:"Maximum Character Limit is 10"},
                  pattern:{value:/^[A-Za-z0-9]+$/,message:"Only Alphabets and Numbers are Allowed"}
                }
              )}
            />
          </div>
          {errors.subjectId && <p>{errors.subjectId.message}</p>}


          {/* // this is for the subject Name input field*/}
          <div className="CourseDiv">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              enter subject name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter facultyId (e.g., Mathematics , English)"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm
                        outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400
                        placeholder:text-gray-400 dark:placeholder-gray-500
                        dark:bg-gray-950 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-500 transition-colors"
                        {...register("subjectName",
                {
                  required:"Please Fill This Field",
                  minLength:{value:3,message:"Minimum 3 Characters are Required"},
                  maxLength:{value:50,message:"Maximum Character Limit is 50"},
                  pattern:{value:/^[A-Za-z ]+$/,message:"Only Alphabets are Allowed"}
                }
              )}
            />
          </div>
          {errors.subjectName && <p>{errors.subjectName.message}</p>
          
          }
          {/* this is for the faculty Id input field*/}
          <div className="wrapperDiv3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Faculty <span className="text-red-500">*</span>
            </label>
            <div className="selectFacultyDiv relative">
              <select
                defaultValue=""
                className="w-full appearance-none border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-950 outline-none 
                    focus:border-gray-400 focus:ring-1 focus:ring-gray-400 
                    dark:focus:border-gray-500 dark:focus:ring-gray-500 transition-colors"
                  {...register("facultyId",
                {
                  required:"Please Fill This Field",
                }
              ) }
              >
                <option value="" disabled>
                  Select Faculty
                </option>
                {faculties.map((f) => (
                  <option key={f.faculty_id} value={f.faculty_id}>
                    {f.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-3 pointer-events-none text-gray-500 dark:text-gray-400"
              />
            </div>
          </div>
          {errors.facultyId && <p>{errors.facultyId.message}</p>
          
          }
          {/* this is for the semester input field*/}
          <div className="CourseDiv">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              semester <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter semester (e.g., Mathematics , English)"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm
                        outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400
                        placeholder:text-gray-400 dark:placeholder-gray-500
                        dark:bg-gray-950 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-500 transition-colors"
                        {...register("semester",
                {
                  required:"Please Fill This Field",
                  min:{value:1,message:"Minimum semester is 1"},
                  max:{value:8,message:"Maximum semester is 8"},
                }
              )}
            />
          </div>
          {errors.semester && <p>{errors.semester.message}</p>
          
          }
          {/* this is for the lecture per week input field*/}
          <div className="CourseDiv">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              lecture per week <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter lecture per week (e.g., Mathematics , English)"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm
                        outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400
                        placeholder:text-gray-400 dark:placeholder-gray-500
                        dark:bg-gray-950 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-500 transition-colors"
                        {...register("lecturePerWeek",
                {
                  required:"Please Fill This Field",
                  min:{value:1,message:"Minimum lecture per week is 1"},
                  max:{value:7,message:"Maximum lecture per week is 7"},
                }
              )}
            />
          </div>
          {errors.lecturePerWeek && <p>{errors.lecturePerWeek.message}</p>
          
          }


          {/* this is for the credit input field*/}
          <div className="CourseDiv">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              credit <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter credit (e.g., Mathematics , English)"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm
                        outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400
                        placeholder:text-gray-400 dark:placeholder-gray-500
                        dark:bg-gray-950 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-500 transition-colors"
                        {...register("credit",
                {
                  required:"Please Fill This Field",
                  min:{value:1,message:"Minimum credit is 1"},
                  max:{value:5,message:"Maximum credit is 5"},
                }
              )}
            />
          </div>
          {errors.credit && <p>{errors.credit.message}</p>}


          <div className="buttonDiv flex items-center gap-3 pt-4">
            <AddButton />
            <CancelButton />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubjectAdmin;
