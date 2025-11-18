'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Timetables", {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            schedule_id: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            class_id: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: "Classes",
                    key: "class_id"
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
            day_of_week: {
                type: Sequelize.ENUM("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"),
                allowNull: false
            },
            start_time: {
                type: Sequelize.TIME,
                allowNull: false
            },
            end_time: {
                type: Sequelize.TIME,
                allowNull: false
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Timetables");
    }
};
