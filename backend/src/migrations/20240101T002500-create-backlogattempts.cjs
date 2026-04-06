'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('BacklogAttempts', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      backlog_id: { type: DataTypes.INTEGER, allowNull: false },
      exam_id: { type: DataTypes.INTEGER, allowNull: false },
      marks_obtained: { type: DataTypes.DECIMAL(5,2) },
      attempt_number: { type: DataTypes.INTEGER, allowNull: false },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('BacklogAttempts');
  }
};
