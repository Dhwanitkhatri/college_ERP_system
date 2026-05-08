'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('LearningMaterials', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      subject_id: { type: DataTypes.STRING, allowNull: false },
      faculty_id: { type: DataTypes.STRING, allowNull: false },
      class_pk: { type: DataTypes.INTEGER },
      course_id: { type: DataTypes.STRING },
      title: { type: DataTypes.STRING, allowNull: false },
      content_url: { type: DataTypes.STRING },
      material_type: { type: DataTypes.STRING },
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
    await queryInterface.dropTable('LearningMaterials');
  }
};
