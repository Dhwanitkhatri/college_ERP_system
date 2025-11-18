'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Subjects", {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            subject_id: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
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
            course_id: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: "Courses",
                    key: "course_id"
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT"
            },
            subject_name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: false
            },
            credit: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            semester: {
                type: Sequelize.INTEGER,
                allowNull: true,
                validate: {
                    min: 1, max: 6
                }
            },
            lecture_per_week: {
                type: Sequelize.INTEGER,
                allowNull: true,
                validate: {
                    min: 1, max: 6
                }
            }
        }
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Subjects");
    }
};
