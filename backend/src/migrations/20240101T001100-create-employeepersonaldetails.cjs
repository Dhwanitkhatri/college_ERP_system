'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('EmployeePersonalDetails', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      employeePersonal_id: { type: DataTypes.STRING, allowNull: false, unique: true },
      faculty_id: { type: DataTypes.STRING, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      dob: { type: DataTypes.DATE },
      gender: { type: DataTypes.STRING },
      aadhar_number: { type: DataTypes.STRING },
      pan_number: { type: DataTypes.STRING },
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
    await queryInterface.dropTable('EmployeePersonalDetails');
  }
};
