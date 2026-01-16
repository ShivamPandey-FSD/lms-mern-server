const cron = require('node-cron');
const User = require('../models/user.model');

const removeUnverifiedAccounts = () => {
 cron.schedule("*/5 * * * *", async () => {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  await User.deleteMany({
   accountVerified: false,
   createdAt: { $lt: thirtyMinutesAgo }
  })
 })
}

module.exports = removeUnverifiedAccounts;
