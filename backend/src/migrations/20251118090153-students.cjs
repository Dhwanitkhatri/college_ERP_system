'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("Students",{
       id:{
              primaryKey:true,
              autoIncrement:true,
              type:Sequelize.INTEGER
          },
          student_id:{
              type:Sequelize.STRING,
              unique:true,
              allowNull:false
          },
          user_id:{//this is foreign key from user table
              type:Sequelize.INTEGER,
              allowNull:true
          },
          course_id:{//this is foreign key from department table
              type:Sequelize.STRING,
              allowNull:false
          },
          class_id:{ //this is foreign key from class table
              type:Sequelize.STRING,
              allowNull:true
          },
          name:{
              type:Sequelize.STRING,
              allowNull:false
          },
          dob:{
              type:Sequelize.DATE,
              allowNull:false
          },
          gender:{
              type:Sequelize.ENUM("Male","Female","Other"),
              allowNull:false
          },
          email:{
              type:Sequelize.STRING,
              allowNull:false,
              validate:{isEmail:true}
          },
          admission_year:{
              type:Sequelize.INTEGER,
              allowNull:false,
              validate:{min:2000 , max:2040}
          },
          year_of_study: {
              type: Sequelize.ENUM("FY", "SY", "TY", "LY"),
              allowNull: false,
          }

    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("Students");
  }
};
