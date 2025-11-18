'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("Feedbacks",{id: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        feedback_id: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        student_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        faculty_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        rating: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {min: 1,max: 5}
        },
        comments: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        date_submitted: {
            type: Sequelize.DATE,
            allowNull: false
        }});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("Feedbacks");
  }
};
