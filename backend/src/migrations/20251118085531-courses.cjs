'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable("Courses",{
     id:{
            primaryKey:true,
            type:Sequelize.INTEGER,
            autoIncrement:true
        },
        course_id:{
            unique:true,
            type:Sequelize.STRING,
            allowNull:false
        },
        department_id:{
            type:Sequelize.STRING,
            allowNull:false
        },
        course_name:{
            type:Sequelize.STRING,
            allowNull:false,
            unique:true
        },
        duration:{
            type:Sequelize.ENUM("2","3","4","5"),
            allowNull:false
        }
   })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("Courses")
  }
};
