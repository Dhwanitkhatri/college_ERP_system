'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("SessionPlannings",{
      id: {
              primaryKey: true,   
              autoIncrement: true,
              type: Sequelize.INTEGER
          },
          plan_id: {
              type: Sequelize.STRING,
              allowNull: false,
              unique: true
          },
          subject_id: {
              type: Sequelize.STRING,
              allowNull: false
          },
          faculty_id: {
              type: Sequelize.STRING,
              allowNull: false
          },
          week_number: {
              type: Sequelize.INTEGER,
              allowNull: false
          },
          topics: {
              type: Sequelize.TEXT,
              allowNull: false
          },
          status: {
              type: Sequelize.ENUM("Planned", "Completed", "Pending"),
              allowNull: false
          }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("SessionPlannings");
  }
};
