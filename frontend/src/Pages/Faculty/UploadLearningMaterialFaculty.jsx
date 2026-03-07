import React from "react";
import { useForm } from "react-hook-form";
import { Upload, FileText, Trash2 } from "lucide-react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";
import DashboardChildPageCard from "../../ui/Cards/DashboardChildPageCard";
import CancelButton from "../../ui/Buttons/CancelButton";

export default function UploadLearningMaterialFaculty() {

  {/* this is the react hook form part */}
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      subject: "",
      class: "",
      description: "",
      files: null,
    },
  });

  const files = watch("files");

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("subject", data.subject);
    formData.append("class", data.class);
    formData.append("description", data.description);

    if (data.files) {
      for (let file of data.files) {
        formData.append("files", file);
      }
    }

    console.log("Form Data:", data);
    console.log("FormData Object:", formData);
  };

  // this is the dummy data for this page
  const subjectList = [
    "Data Structures",
    "Database Management",
    "Operating Systems",
    "Web Development",
  ];

  const classList = ["FYBCA-A", "FYBCA-B", "SYBCA-A", "SYBCA-B", "TYBCA-A"];

  return (
    // this is the part where the main desing start 
    <DashboardChildPageTemplate
      title="Upload Learning Material"
      desc="Share study materials, notes, and resources with students"
      width="max-w-7xl"
    >
      <DashboardChildPageCard>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="form-field !my-0">
              {/* this is the material title part */}
              <label className="custom-label">
                Material Title
              </label>

              <input
                type="text"
                className={`custom-input bg-[var(--bg-primary)] theme-transition ${
                  errors.title ? "border-red-500" : ""
                }`}
                placeholder="Enter material title"
                {...register("title", {
                  required: "Material title is required",
                })}
              />

              {errors.title && (
                <p className="custom-error">{errors.title.message}</p>
              )}
            </div>


            <div className="form-field !my-0">
              {/* this is the subject selection part */}
              <label className="custom-label">
                Subject 
              </label>

              <select
                className={`custom-input bg-[var(--bg-primary)] theme-transition ${
                  errors.subject ? "border-red-500" : ""
                }`}
                {...register("subject", { required: "Subject is required" })}
              >

                <option value="">Select subject</option>

                {subjectList.map((sub, idx) => (
                  <option key={idx} value={sub}>
                    {sub}
                  </option>
                ))}

              </select>

              {errors.subject && (
                <p className="custom-error">{errors.subject.message}</p>
              )}
            </div>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

            <div className="form-field !my-0">
              {/* this is the class selection part */}
              <label className="custom-label">
                Class
              </label>

              <select
                className={`custom-input bg-[var(--bg-primary)] theme-transition ${
                  errors.class ? "border-red-500" : ""
                }`}
                {...register("class", { required: "Class is required" })}
              >

                <option value="">Select class</option>

                {classList.map((cls, idx) => (
                  <option key={idx} value={cls}>
                    {cls}
                  </option>
                ))}

              </select>

              {errors.class && (
                <p className="custom-error">{errors.class.message}</p>
              )}

            </div>

          </div>


          <div className="form-field mt-6">
            {/* this is the description part */}
            <label className="custom-label">Description</label>

            <textarea
              className="custom-input bg-[var(--bg-primary)] theme-transition min-h-[120px] resize-y"
              placeholder="Enter description about the material"
              {...register("description")}
            />

          </div>


          <div className="form-field mt-6">
            {/* this is the file upload part */}
            <label className="custom-label">
              Upload Files
            </label>

            {/* hidden file input */}
            <input
              type="file"
              multiple
              id="fileUpload"
              className="hidden"
              {...register("files")}
            />

            <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-10 mt-1 text-center bg-[var(--bg-primary)] hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">

              <div className="flex flex-col items-center justify-center gap-3">

                {/* this is the drag and drop part */}
                <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />

                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Drag and drop files here or click to browse
                </p>

                <button
                  type="button"
                  onClick={() => document.getElementById("fileUpload").click()}
                  className="mt-3 px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Browse Files
                </button>

              </div>

            </div>


            {/* this is the uploaded file display part */}
            {files && files.length > 0 && (
              <div className="mt-4">

                {Array.from(files).map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-lg"
                  >

                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-500" />

                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {file.name}
                      </span>

                    </div>

                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                  </div>
                ))}

              </div>
            )}

          </div>


          {/* this is the action buttons part */}
          <div className="flex items-center gap-4 mt-8">

            <button
              type="submit"
              className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md font-medium hover:opacity-90 transition-opacity"
            >
              Upload Material
            </button>

            <CancelButton onClick={() => reset()} />

          </div>

        </form>

      </DashboardChildPageCard>
    </DashboardChildPageTemplate>
  );
}
