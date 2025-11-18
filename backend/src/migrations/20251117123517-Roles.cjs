'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Roles',{
      id:{
              type:Sequelize.INTEGER,
              primaryKey:true
          },
          role_id:{
              type:Sequelize.STRING,
              unique:true,
              allowNull:false
          },
          role_name:{
              type:Sequelize.STRING,
              allowNull:false
          }
    })
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('Roles');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
