const cron = require('node-cron');
const Borrow = require('../models/borrow.model');
const User = require('../models/user.model');
const sendEmail = require('../utils/sendEmail');

const notifyUsers = () => {
 cron.schedule("*/30 * * * * *", async () => {
  try {
   const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
   const borrowers = await Borrow.find({
    dueDate: {
     $lt: oneDayAgo
    },
    returnDate: null,
    notified: false
   });

   for (const element of borrowers) {
    if (element.user && element.user.email) {
     const user = await User.findById(element.user.id);
     sendEmail({
      email: user.email,
      subject: "Reminder: Book Return Due Today",
      message: `Hello ${user.name},\n\nThis is a friendly reminder that the book you borrowed is due for return today. Please return the book to the library as soon as possible.\n\nThank you,\nBookshelf Team`
     })
     element.notified = true;
     await element.save();
    }
   }
  } catch (error) {
   console.error("Error occured while notifying users", error);
  }
 })
}

module.exports = notifyUsers;
