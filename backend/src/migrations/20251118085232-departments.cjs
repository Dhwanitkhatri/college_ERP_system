'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("departments",{
       id:{
              type:Sequelize.INTEGER,
              primaryKey:true,
              autoIncrement:true
          },
          department_id:{
              type:Sequelize.STRING,
              allowNull:false,
              unique:true
          },
          department_name:{
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
    await queryInterface.dropTable("Departments");
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
