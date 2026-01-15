const mongoose = require('mongoose');

const connectDb = async () => {
 try {
  await mongoose.connect(process.env.DB_URL, {
   dbName: 'library_management',
  });

  console.log('Database Connected Successfully');
 } catch (error) {
  console.error('Database connection failed:', error.message);
  process.exit(1);
 }
};

module.exports = connectDb;
