'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Students', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      student_id: { type: DataTypes.STRING, allowNull: false, unique: true },
      user_id: { type: DataTypes.INTEGER },
      department_id: { type: DataTypes.STRING },
      course_id: { type: DataTypes.STRING, allowNull: false },
      class_pk: { type: DataTypes.INTEGER },
      name: { type: DataTypes.STRING, allowNull: false },
      dob: { type: DataTypes.DATE, allowNull: false },
      gender: { type: DataTypes.ENUM("Male","Female","Other"), allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      admission_year: { type: DataTypes.INTEGER, allowNull: false },
      year_of_study: { type: DataTypes.ENUM("FY","SY","TY","LY"), allowNull: false },
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
    await queryInterface.dropTable('Students');
  }
};
