'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('SubjectComponents', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      subject_id: { type: DataTypes.STRING, allowNull: false },
      component_name: { type: DataTypes.STRING, allowNull: false },
      max_marks: { type: DataTypes.DECIMAL(5,2), allowNull: false },
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
    await queryInterface.dropTable('SubjectComponents');
  }
};
