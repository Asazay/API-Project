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
      spotId: 1,
      url: 'https://media.architecturaldigest.com/photos/573b8e1b92bce8d4717e8a14/master/pass/designer-living-rooms-001.jpg',
      preview: true
    },
    {
      spotId: 1,
      url: 'https://hips.hearstapps.com/hmg-prod/images/confined-conversation-set-veranda-small-living-room-ideas-1658776800.jpeg',
      preview: true
    },
    {
      spotId: 1,
      url: 'https://dlifeinteriors.com/wp-content/uploads/2020/05/Living-room-design-3bhk-flat-kochi.jpg',
      preview: true
    },
    {
      spotId: 1,
      url: 'https://media.designcafe.com/wp-content/uploads/2020/03/21012613/luxury-living-room-designs.jpg',
      preview: true
    },
    {
      spotId: 2,
      url: 'https://asazaybucket.s3.us-east-2.amazonaws.com/house2.png',
      preview: true
    },
    {
      spotId: 2,
      url: 'https://media.architecturaldigest.com/photos/573b8e1b92bce8d4717e8a14/master/pass/designer-living-rooms-001.jpg',
      preview: true
    },
    {
      spotId: 2,
      url: 'https://hips.hearstapps.com/hmg-prod/images/confined-conversation-set-veranda-small-living-room-ideas-1658776800.jpeg',
      preview: true
    },
    {
      spotId: 2,
      url: 'https://dlifeinteriors.com/wp-content/uploads/2020/05/Living-room-design-3bhk-flat-kochi.jpg',
      preview: true
    },
    {
      spotId: 2,
      url: 'https://media.designcafe.com/wp-content/uploads/2020/03/21012613/luxury-living-room-designs.jpg',
      preview: true
    },
    {
      spotId: 3,
      url: 'https://asazaybucket.s3.us-east-2.amazonaws.com/house3.jpg',
      preview: true
    },
    {
      spotId: 3,
      url: 'https://media.architecturaldigest.com/photos/573b8e1b92bce8d4717e8a14/master/pass/designer-living-rooms-001.jpg',
      preview: true
    },
    {
      spotId: 3,
      url: 'https://hips.hearstapps.com/hmg-prod/images/confined-conversation-set-veranda-small-living-room-ideas-1658776800.jpeg',
      preview: true
    },
    {
      spotId: 3,
      url: 'https://dlifeinteriors.com/wp-content/uploads/2020/05/Living-room-design-3bhk-flat-kochi.jpg',
      preview: true
    },
    {
      spotId: 3,
      url: 'https://media.designcafe.com/wp-content/uploads/2020/03/21012613/luxury-living-room-designs.jpg',
      preview: true
    },
    {
      spotId: 4,
      url: 'https://asazaybucket.s3.us-east-2.amazonaws.com/house4.jpg',
      preview: true
    },
    {
      spotId: 4,
      url: 'https://media.architecturaldigest.com/photos/573b8e1b92bce8d4717e8a14/master/pass/designer-living-rooms-001.jpg',
      preview: true
    },
    {
      spotId: 4,
      url: 'https://hips.hearstapps.com/hmg-prod/images/confined-conversation-set-veranda-small-living-room-ideas-1658776800.jpeg',
      preview: true
    },
    {
      spotId: 4,
      url: 'https://dlifeinteriors.com/wp-content/uploads/2020/05/Living-room-design-3bhk-flat-kochi.jpg',
      preview: true
    },
    {
      spotId: 4,
      url: 'https://media.designcafe.com/wp-content/uploads/2020/03/21012613/luxury-living-room-designs.jpg',
      preview: true
    },
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
