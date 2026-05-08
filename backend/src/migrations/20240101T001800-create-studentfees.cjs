'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('StudentFees', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      student_id: { type: DataTypes.STRING, allowNull: false },
      fee_structure_id: { type: DataTypes.INTEGER, allowNull: false },
      amount_due: { type: DataTypes.DECIMAL(10,2), allowNull: false },
      paid_amount: { type: DataTypes.DECIMAL(10,2) },
      status: { type: DataTypes.ENUM("pending","partial","paid"), defaultValue: 'pending' },
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
    await queryInterface.dropTable('StudentFees');
  }
};
