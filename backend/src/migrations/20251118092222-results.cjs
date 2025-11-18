'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable("Results",{
       id: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        result_id: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        student_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        subject_id: {
            type: Sequelize.STRING,
            allowNull: false    
        },
        marks: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        max_marks: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        grade: {
            type: Sequelize.STRING,
            allowNull: false
        }
   })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("Results");
  }
};
