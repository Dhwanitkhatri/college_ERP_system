'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Admins", {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            admin_id: {
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
            full_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                validate: { isEmail: true }
            },
            contact_number: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    is: /^(\+91)?\d{10}$/
                }
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
        await queryInterface.dropTable("Admins");
    }
};
