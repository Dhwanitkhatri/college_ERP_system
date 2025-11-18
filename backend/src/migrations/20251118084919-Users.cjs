'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("Users",{
      user_id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    username:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    role_id:{
        type:Sequelize.STRING,
        allowNull:false,
        
    },
    status:{
        type:Sequelize.ENUM('active' ,'inactive'),
        defaultValue:'active'
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

    await queryInterface.dropTable("Users");
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
