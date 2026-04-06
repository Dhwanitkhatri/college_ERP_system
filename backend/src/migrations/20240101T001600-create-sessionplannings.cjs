'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('SessionPlannings', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      academic_year: { type: DataTypes.STRING, allowNull: false },
      session_start_date: { type: DataTypes.DATE, allowNull: false },
      session_end_date: { type: DataTypes.DATE, allowNull: false },
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
    await queryInterface.dropTable('SessionPlannings');
  }
};
