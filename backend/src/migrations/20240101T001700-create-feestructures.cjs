'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('FeeStructures', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      course_id: { type: DataTypes.STRING, allowNull: false },
      fee_type: { type: DataTypes.STRING, allowNull: false },
      amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
      academic_year: { type: DataTypes.STRING, allowNull: false },
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
    await queryInterface.dropTable('FeeStructures');
  }
};
