'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Notifications', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },

      title: { type: Sequelize.STRING, allowNull: false },

      message: { type: Sequelize.TEXT, allowNull: false },

      type: { type: Sequelize.STRING },

      created_at: {
        type: Sequelize.DATE,
defaultValue: Sequelize.NOW      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Notifications');
  }
};
