'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable("Timetables",{id:{
           primaryKey:true,
           autoIncrement:true,
           type:Sequelize.INTEGER
       },
       schedule_id:{
           type:Sequelize.STRING,
           allowNull:false,
           unique:true
       },
       class_id:{
           type:Sequelize.STRING,
           allowNull:false
       },
       subject_id:{
           type:Sequelize.STRING,
           allowNull:false
       },
       faculty_id:{
           type:Sequelize.STRING,
           allowNull:false
       },
       day_of_week:{
           type:Sequelize.ENUM("Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"),
           allowNull:false
       },
       start_time:{
           type:Sequelize.TIME,
           allowNull:false
       },
       end_time:{
           type:Sequelize.TIME,
           allowNull:false     
       }});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("Timetables");
  }
};
