'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Results", {
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
        await queryInterface.dropTable("Results");
    }
};
