'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('SubjectResults', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      student_id: { type: DataTypes.STRING, allowNull: false },
      exam_id: { type: DataTypes.INTEGER, allowNull: false },
      subject_id: { type: DataTypes.STRING, allowNull: false },
      total_marks: { type: DataTypes.DECIMAL(5,2), allowNull: false },
      grade: { type: DataTypes.STRING },
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
    await queryInterface.dropTable('SubjectResults');
  }
};
