'use strict';
const {Spot} = require('../../db/models');
const {Op} = require('sequelize');

let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "123 Demo User Way Apt 223",
        city: 'Grand Rapids',
        state: 'Michigan',
        country: "United States",
        lat: 38.7645358,
        lng: -125.4730327,
        name: 'The Partment - 223',
        description: 'One of many to choose from! Pick where you want to rent.',
        price: 89.95,
      },
      {
        ownerId: 2,
        address: "123 Demo User Way Apt 352",
        city: 'Grand Rapids',
        state: 'Michigan',
        country: "United States",
        lat: 38.7645358,
        lng: -125.4730327,
        name: 'The Partment - 352',
        description: 'One of many to choose from! Pick where you want to rent.',
        price: 95.95,
      },
      {
        ownerId: 1,
        address: "123 Baltimore Way",
        city: 'Baltimore',
        state: 'Maryland',
        country: "United States",
        lat: 40.7645358,
        lng: -128.4730327,
        name: 'The Haven',
        description: 'A great place to stay',
        price: 95.95,
      },
      {
        ownerId: 2,
        address: "5555 Random Way",
        city: 'Baltimore',
        state: 'Maryland',
        country: "United States",
        lat: 32.7645358,
        lng: -120.4730327,
        name: 'The Wave',
        description: 'A great place to stay',
        price: 89.95,
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkDelete(options, {
      address: {
        [Op.in]: ['123 Demo User Way Apt 223', '123 Demo User Way Apt 352', '123 Baltimore Way',
      '5555 Random Way',]
      }
    }, {});
  }
};
