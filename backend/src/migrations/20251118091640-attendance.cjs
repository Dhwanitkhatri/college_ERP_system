'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable("Attendances",{
    id: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        attendance_id: {
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
        date: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM("Present", "Absent", "Late"),
            allowNull: false
        }

   });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("Attendances");
  }
};
