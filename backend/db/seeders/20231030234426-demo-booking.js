'use strict';

const {Booking} = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await Booking.bulkCreate([
    {
      spotId:1,
      userId:1,
      startDate: 11/11/2023,
     endDate: 11/12/2023
    },
    {
      spotId:2,
      userId:2,
      startDate:12/12/2023,
      endDate:12/13/2023
    },
    {
      spotId:3,
      userId:3,
      startDate:1/1/2024,
    endDate:1/2/2024
     },
     {
      spotId:4,
      userId:4,
      startDate:2/2/2024,
      endDate:2/3/2024
     },
     {
      spotId:5,
      userId:5,
      startDate:3/3/2024,
      endDate:3/4/2024
     }
   ],{ validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options);
  }
};
