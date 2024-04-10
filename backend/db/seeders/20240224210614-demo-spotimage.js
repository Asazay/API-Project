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
      url: 'https://asazaybucket.s3.us-east-2.amazonaws.com/house1.jpg',
      preview: true
    },
    {
      spotId: 2,
      url: 'https://asazaybucket.s3.us-east-2.amazonaws.com/house2.png',
      preview: true
    },
    {
      spotId: 3,
      url: 'https://asazaybucket.s3.us-east-2.amazonaws.com/house3.jpg',
      preview: true
    },
    {
      spotId: 4,
      url: 'https://asazaybucket.s3.us-east-2.amazonaws.com/house4.jpg',
      preview: true
    },
    {
      spotId: 5,
      url: 'https://asazaybucket.s3.us-east-2.amazonaws.com/house6.jpg',
      preview: true
    },
    {
      spotId: 6,
      url: 'https://asazaybucket.s3.us-east-2.amazonaws.com/house5.jpg',
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
