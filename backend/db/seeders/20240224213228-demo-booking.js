'use strict';
const {Booking} = require('../models');

let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 4,
        startDate: "2024-02-25",
        endDate: '2024-02-28'
      },
      {
        spotId: 2,
        userId: 5,
        startDate: "2024-03-05",
        endDate: '2024-03-10'
      },
      {
        spotId: 6,
        userId: 6,
        startDate: "2024-02-24",
        endDate: '2024-02-29'
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    return queryInterface.bulkDelete(options, {
      spotId: {
        [Op.in]: [1, 2, 6]
      }
    }, {})
  }
};
