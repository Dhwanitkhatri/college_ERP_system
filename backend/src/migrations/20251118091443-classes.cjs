'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("Classes",{
       id:{
              primaryKey:true,
              autoIncrement:true,
              type:Sequelize.INTEGER
          },
          class_id:{
              type:Sequelize.STRING,
              allowNull:false,
              unique:true
          },
          course_id:{
              type:Sequelize.STRING,
              allowNull:false
          },
          section:{
              type:Sequelize.STRING,
              allowNull:false
          }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("Classes");
  }
};
