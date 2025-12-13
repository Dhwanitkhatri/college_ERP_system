import { Student  } from "../model/index.js";
import { Op } from "sequelize";

export const generateEnrollmentId = async(course_id)=>{
    //fetch the course name 

  
    //to check the course exists or not 
    if(!course_id) throw new Error('course id not provide');

 const courseName = course_id.replace(/\d+/g, "");

    //get the current year
    const year = new Date().getFullYear().toString().slice(-2);
    const prefix = `${year}${courseName}`; // to find the total  student 
    
    const count = await Student.count({ // to find the total number of student with same year and course 
        where:{course_id},
        student_id:{[Op.startsWith]:prefix}
    });

    const srNo = String(count+1).padStart(3,"0") ; //to add at the end in the enrolment number 

    const enrolmentId = `${year}${courseName}${srNo}`; //enrolment id created 

    return enrolmentId;
     
}
