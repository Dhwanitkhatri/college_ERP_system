'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable("Notifications",{
     id: {
            primaryKey: true,
            autoIncrement: true,    
            type: Sequelize.INTEGER
        },
        notification_id: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        message: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        read_status: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
   });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("Notifications")
  }
};
