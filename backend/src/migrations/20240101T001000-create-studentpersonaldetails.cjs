'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('StudentPersonalDetails', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      studentPersonal_id: { type: DataTypes.STRING, allowNull: false, unique: true },
      student_id: { type: DataTypes.STRING, allowNull: false },
      parent_name: { type: DataTypes.STRING, allowNull: false },
      parent_contact: { type: DataTypes.STRING, allowNull: false },
      address: { type: DataTypes.TEXT, allowNull: false },
      emergency_contact: { type: DataTypes.STRING, allowNull: false },
      adharCard_number: { type: DataTypes.STRING, allowNull: false, unique: true },
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
    await queryInterface.dropTable('StudentPersonalDetails');
  }
};
