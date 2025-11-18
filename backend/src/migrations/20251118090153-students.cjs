'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Students", {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            student_id: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            user_id: {//this is foreign key from user table
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "Users",
                    key: "user_id"
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT"
            },
            department_id: {//this is foreign key from department table
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: "Departments",
                    key: "department_id"
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT"
            },
            course_id: {//this is foreign key from department table
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: "Courses",
                    key: "course_id"
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT"
            },
            class_id: { //this is foreign key from class table
                type: Sequelize.STRING,
                allowNull: true,
                references: {
                    model: "Classes",
                    key: "class_id"
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT"
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            dob: {
                type: Sequelize.DATE,
                allowNull: false
            },
            gender: {
                type: Sequelize.ENUM("Male", "Female", "Other"),
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: { isEmail: true }
            },
            admission_year: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: { min: 2000, max: 2040 }
            },
            year_of_study: {
                type: Sequelize.ENUM("FY", "SY", "TY", "LY"),
                allowNull: false,
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

        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Students");
    }
};
