'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('SemesterResults', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      student_id: { type: DataTypes.STRING, allowNull: false },
      exam_id: { type: DataTypes.INTEGER, allowNull: false },
      gpa: { type: DataTypes.DECIMAL(3,2), allowNull: false },
      semester: { type: DataTypes.INTEGER, allowNull: false },
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
    await queryInterface.dropTable('SemesterResults');
  }
};
