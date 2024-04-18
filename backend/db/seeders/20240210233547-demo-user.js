'use strict';

const {User} = require('../models');
const bcrypt = require("bcryptjs");
const {Op} = require('sequelize');

let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
   await User.bulkCreate([
    {
      firstName: 'Demo',
      lastName: 'Lition',
      email: 'demo@user.io',
      username: 'Demo-lition',
      hashedPassword: bcrypt.hashSync('password')
    },
    {
      firstName: 'User1',
      lastName: 'One',
      email: 'user1@user.io',
      username: 'FakeUser1',
      hashedPassword: bcrypt.hashSync('password2')
    },
    {
      firstName: 'User2',
      lastName: 'Two',
      email: 'user2@user.io',
      username: 'FakeUser2',
      hashedPassword: bcrypt.hashSync('password3')
    },
    {
      firstName: 'User3',
      lastName: 'Three',
      email: 'user3@user.io',
      username: 'FakeUser3',
      hashedPassword: bcrypt.hashSync('password4')
    },
    {
      firstName: 'User4',
      lastName: 'Four',
      email: 'user4@user.io',
      username: 'FakeUser4',
      hashedPassword: bcrypt.hashSync('password5')
    },
    {
      firstName: 'Booker',
      lastName: 'Washington',
      email: 'booker1@booker.io',
      username: 'Booker1',
      hashedPassword: bcrypt.hashSync('booker1')
    },
    {
      firstName: 'Booker',
      lastName: 'Douglas',
      email: 'booker2@booker.io',
      username: 'Booker2',
      hashedPassword: bcrypt.hashSync('booker2')
    },
    {
      firstName: 'Booker',
      lastName: 'Reed',
      email: 'booker3@booker.io',
      username: 'Booker3',
      hashedPassword: bcrypt.hashSync('booker3')
    }
   ], {validate: true});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'Booker1', 'Booker2', 'Booker3'] }
    }, {});
  }
};
