'use strict';
const {ReviewImage} = require('../models');

let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        url: 'demoSpot1Review1Image1',
        reviewId: 1
      },
      {
        url: 'demoSpot2Review1Image1',
        reviewId: 2
      },
      {
        url: 'User1Spot1Review1Image1',
        reviewId: 3
      },
      {
        url: 'User2Spot1Review1Image1',
        reviewId: 4
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkDelete(options, {
      url: {
        [Op.in]: [
          'demoSpot1Review1Image1',
          'demoSpot2Review1Image1',
          'User1Spot1Review1Image1',
          'User2Spot1Review1Image1'
        ]
      }
    }, {});
  }
};
