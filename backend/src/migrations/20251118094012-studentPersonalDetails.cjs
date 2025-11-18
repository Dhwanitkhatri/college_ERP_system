'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("StudentPersonalDetails", {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            studentPersonal_id: {
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
            parent_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            parent_contact: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    is: /^(\+91)?\d{10}$/
                }
            },
            address: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            emergency_contact: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    is: /^(\+91)?\d{10}$/
                }
            },
            adharCard_number: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
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
        await queryInterface.dropTable("StudentPersonalDetails")
    }
};
