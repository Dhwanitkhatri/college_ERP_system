'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("EmployeePersonalDetails", {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            employeePersonal_id: {
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
            address: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            qualification: {
                type: Sequelize.STRING,
                allowNull: false
            },
            experience: {
                type: Sequelize.STRING,
                allowNull: false
            },
            adherCard_number: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            emergency_contact: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    is: /^(\+91)?\d{10}$/
                }
            },
            alternate_email: {
                type: Sequelize.STRING,
                allowNull: true,
                validate: { isEmail: true }
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
        await queryInterface.dropTable("EmployeePersonalDetails")
    }
};
