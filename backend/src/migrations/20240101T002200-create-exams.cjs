'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Exams', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      exam_name: { type: DataTypes.STRING, allowNull: false },
      exam_date: { type: DataTypes.DATE, allowNull: false },
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
    await queryInterface.dropTable('Exams');
  }
};
