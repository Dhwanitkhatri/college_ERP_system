'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Subjects', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      subject_id: { type: DataTypes.STRING, allowNull: false ,unique:true },
      course_id: { type: DataTypes.STRING, allowNull: false },
      subject_name: { type: DataTypes.STRING, allowNull: false },
      credit: { type: DataTypes.INTEGER, allowNull: false },
      semester: { type: DataTypes.INTEGER },
      lecture_per_week: { type: DataTypes.INTEGER },
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
    await queryInterface.dropTable('Subjects');
  }
};
