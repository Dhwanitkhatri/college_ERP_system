'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Courses", {
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      course_id: {
        unique: true,
        type: Sequelize.STRING,
        allowNull: false
      },
      department_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Departments",
          key: "department_id"
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      course_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      duration: {
        type: Sequelize.ENUM("2", "3", "4", "5"),
        allowNull: false
      },
      createdAt: {
              allowNull: false,
              type: Sequelize.DATE,
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') // Optional but helpful
      },
      updatedAt: {
              allowNull: false,
              type: Sequelize.DATE,
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Courses")
  }
};
