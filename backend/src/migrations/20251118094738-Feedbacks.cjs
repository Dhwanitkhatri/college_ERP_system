'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Feedbacks", {
            id: {
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
                allowNull: false,
                references: {
                    model: "Students",
                    key: "student_id"
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT"
            },
            faculty_id: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: "Faculties",
                    key: "faculty_id"
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT"
            },
            rating: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: { min: 1, max: 5 }
            },
            comments: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            date_submitted: {
                type: Sequelize.DATE,
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
        await queryInterface.dropTable("Feedbacks");
    }
};
