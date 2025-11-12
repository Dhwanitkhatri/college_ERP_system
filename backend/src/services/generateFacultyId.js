import {  Faculty } from "../model/index.js";
import {Op} from 'sequelize';

export const generateFacultyId = async(course_id)=>{
    try{
         const courseShortName = course_id.replace(/\d/g, "");///to remove the digit from the courseid 

        const latestFaculty = await Faculty.findOne({
            where:{course_id},
            order:[["faculty_id" , "DESC"]]
        });
        //to find the latest faculty member 

        let nextNumber = 1;

        if(latestFaculty){
                const lastId = latestFaculty.faculty_id;
                const lastNumber = parseInt(lastId.slice(-3),10)
                nextNumber = lastNumber + 1;
        }
        const formatNumber = String(nextNumber).padStart(3,"0");
        const facultyId = `${courseShortName}FAC${formatNumber}`;

        return facultyId;
    }
    catch(error){
        console.log("error generating the faculty id ",error);
        throw error;
    }
}