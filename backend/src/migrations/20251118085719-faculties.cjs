'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Faculties", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            faculty_id: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Users",
                    key: "user_id"
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
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    is: /^(\+91)?\d{10}$/
                }
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Faculties")
    }
};
