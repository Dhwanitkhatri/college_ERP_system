'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('FeatureFlags', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      flag_name: { type: DataTypes.STRING, allowNull: false, unique: true },
      is_enabled: { type: DataTypes.BOOLEAN },
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
    await queryInterface.dropTable('FeatureFlags');
  }
};
