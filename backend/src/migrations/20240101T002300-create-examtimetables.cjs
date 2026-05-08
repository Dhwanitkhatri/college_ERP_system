'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('ExamTimetables', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      exam_id: { type: DataTypes.INTEGER, allowNull: false },
      subject_id: { type: DataTypes.STRING, allowNull: false },
      exam_date: { type: DataTypes.DATE, allowNull: false },
      start_time: { type: DataTypes.TIME, allowNull: false },
      end_time: { type: DataTypes.TIME, allowNull: false },
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
    await queryInterface.dropTable('ExamTimetables');
  }
};
