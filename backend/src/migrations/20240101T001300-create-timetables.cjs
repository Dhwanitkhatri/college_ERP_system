'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Timetables', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      class_pk: { type: DataTypes.INTEGER },
      subject_id: { type: DataTypes.STRING },
      faculty_id: { type: DataTypes.STRING },
      day: { type: DataTypes.STRING, allowNull: false },
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
    await queryInterface.dropTable('Timetables');
  }
};
