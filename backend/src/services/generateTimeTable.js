import { Subject , Faculty , Class , sequelize } from "../model/index.js";
import { Op } from "sequelize";
const generateTimeTable = async(course_id , semester)=>{
    
    try {
        if(!course_id || !semester) throw new Error("parameter not provided"); //to check the parameter are provided or not

        if(semester == 'Even'){ // to identify of which semester's timetable have to create 
            const FySem = 2;
            const SySem = 4;
            const TySem = 6;
        }
        else{
            const FySem = 1;
            const SySem = 3;
            const TySem = 5;
        }

        //fetch the subject of each semester 
        const FySubjects = await Subject.findAll({
            where:{semester:{
                [Op.or]:[FySem , SySem , TySem]
            }},
            attributes:['subject_name' , 'lecture_per_week']
        })
        
    } catch (error) {
        
    }
}