'use strict';
const {Review} = require('../models');
const {Op} = require('sequelize');

let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        userId: 3,
        spotId: 1,
        review: 'Very nice and clean!',
        stars: 4,
      },
      {
        userId: 4,
        spotId: 2,
        review: 'I had a blast with my friends, the place smelled amazing.',
        stars: 5,
      },
      {
        userId: 5,
        spotId: 2,
        review: 'It was smaller than appeared, but still nice.',
        stars: 3,
      },
      {
        userId: 5,
        spotId: 3,
        review: 'It was very nice, thank you!',
        stars: 4,
      },
      {
        userId: 4,
        spotId: 3,
        review: 'The neighbors were quite rude and loud.',
        stars: 3,
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    return queryInterface.bulkDelete(options, {
      review: {
        [Op.in]: [
          'Very nice and clean!',
          'I had a blast with my friends, the place smelled amazing.',
          'It was smaller than appeared, but still nice.',
          'It was very nice, thank you!',
          'The neighbors were quite rude and loud.'
        ]
      }
    }, {});
  }
};
