'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Attendances", {
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
                allowNull: false,
                references: {
                    model: "Students",
                    key: "student_id"
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT"
            },
            subject_id: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: "Subjects",
                    key: "subject_id"
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT"
            },
            date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM("Present", "Absent", "Late"),
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

        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Attendances");
    }
};
