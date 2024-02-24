'use strict';
const {SpotImage} = require('../models');
const {Op} = require('sequelize');

let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
   await SpotImage.bulkCreate([
    {
      spotId: 1,
      url: 'demo-image1',
      preview: true
    },
    {
      spotId: 2,
      url: 'demo-image2',
      preview: true
    },
    {
      spotId: 3,
      url: 'user1-image1',
      preview: true
    },
    {
      spotId: 4,
      url: 'user1-image2',
      preview: true
    },
    {
      spotId: 6,
      url: 'user2-image1',
      preview: true
    }
   ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages'
    return queryInterface.bulkDelete(options, {
      url: {
        [Op.in]: ['demo-image1','demo-image2', 'user1-image1', 'user1-image2', 'user2-image1']
      }
    }, {})
  }
};
