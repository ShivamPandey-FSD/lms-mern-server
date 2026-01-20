const cron = require('node-cron');
const User = require('../models/user.model');

const removeUnverifiedAccounts = () => {
  // Runs every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    try {
      const tenDaysAgo = new Date(
        Date.now() - 10 * 24 * 60 * 60 * 1000
      );

      const result = await User.deleteMany({
        accountVerified: false,
        createdAt: { $lt: tenDaysAgo }
      });

      console.log(
        `Deleted ${result.deletedCount} unverified accounts`
      );
    } catch (error) {
      console.error('Cron job error:', error);
    }
  });
};

module.exports = removeUnverifiedAccounts;
