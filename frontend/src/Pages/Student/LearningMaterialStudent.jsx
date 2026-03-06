import React from "react";
import { useForm } from "react-hook-form";
import { FileText, Download } from "lucide-react";
import DashboardChildPageTemplate from "../../ui/Templates/DashboardChildPageTemplate";

export default function ViewLearningMaterial() {
  {
    /* this is the react hook form part */
  }
  const { register } = useForm({
    defaultValues: {
      subject: "All Subjects",
    },
  });

  // this is the dummy data for material list
  const materials = [
    {
      id: 1,
      title: "Data Structures - Unit 1 Notes",
      subjectBadge: "Data Structures",
      author: "Dr. Sarah Johnson",
      date: "15/1/2024",
      format: "PDF",
      size: "2.5 MB",
    },
    {
      id: 2,
      title: "Data Structures - Unit 2 Notes",
      subjectBadge: "Data Structures",
      author: "Dr. Sarah Johnson",
      date: "20/1/2024",
      format: "PDF",
      size: "3.1 MB",
    },
    {
      id: 3,
      title: "Data Structures - Practice Problems",
      subjectBadge: "Data Structures",
      author: "Dr. Sarah Johnson",
      date: "11/1/2024",
      format: "PDF",
      size: "1.8 MB",
    },
  ];
  {
    /* this is the part where the main design start  */
  }
  return (
    <DashboardChildPageTemplate
      title="Learning Material"
      desc="Access study materials, notes, and resources shared by faculty"
      width="max-w-6xl"
    >
      <div className="flex flex-col gap-6">
        <div className="w-full max-w-xs">
          <div className="form-field !my-0">
            {/* this is the subject part */}
            <label className="custom-label">
              Select Subject <span className="text-red-500">*</span>
            </label>
            <select
              className="custom-input bg-[var(--bg-primary)] theme-transition"
              {...register("subject")}
            >
              <option value="All Subjects">All Subjects</option>
              <option value="Data Structures">Data Structures</option>
              <option value="Database Management">Database Management</option>
              <option value="Operating Systems">Operating Systems</option>
            </select>
          </div>
        </div>

        {/* this is the material card list */}
        <div className="flex flex-col gap-4">
          {materials.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-5 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl hover:shadow-sm transition-shadow dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center dark:bg-blue-900/20">
                  <FileText className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                </div>
                {/* this is the material title part */}
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-[15px] font-medium text-gray-900 dark:text-gray-100">
                    {item.title}
                  </h4>

                  <div className="flex items-center flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                    {/* this is the subject part */}
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs font-medium">
                      {item.subjectBadge}
                    </span>

                    <span className="flex items-center gap-3">
                      <span>•</span>
                      <span>By {item.author}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>
                        {item.format} • {item.size}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              {/* this is the download button part */}
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:text-blue-400 dark:hover:bg-blue-900/20"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardChildPageTemplate>
  );
}
