import { Class , Course } from "../model/index.js";

export const  createClasses = async()=>{
    try{
        //to check course does exits or not
        const course_id = req.user;
        //fetch the course details 
        const cousrse = await Course.findOne({where:{course_id}});
        if(!cousrse){
            console.log("classes not found ");
            return;
        }
        const years = ["FY","SY","TY"];
        const sections =["A","B"];

        const courseShort =  course_id.replace(/\d/, "");// removes digits

        for(const year of years ){
            for(const section of sections){
                const Class_id =`CLS_${courseShort}_${year}_${section}`;

                //check if the class exists or not 
                const existingClass = await Class.findOne({
                    where:{class_id:Class_id , course_id},
                });
                if(!existingClass){
                    await Class.create({
                        class_id : Class_id,
                        course_id,
                        section
                    });
                    console.log("class created ");
                }
                else{
                    console.log("class already created");
                }
            }
        }
        console.log(`all classes are created for the ${courseShort}` );
    }
    catch(err){
        console.log("error ",err);
    }
}