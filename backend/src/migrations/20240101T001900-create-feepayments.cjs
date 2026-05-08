'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('FeePayments', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      student_id: { type: DataTypes.STRING, allowNull: false },
      fee_structure_id: { type: DataTypes.INTEGER, allowNull: false },
      amount_paid: { type: DataTypes.DECIMAL(10,2), allowNull: false },
      payment_date: { type: DataTypes.DATE, allowNull: false },
      payment_method: { type: DataTypes.STRING },
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
    await queryInterface.dropTable('FeePayments');
  }
};
