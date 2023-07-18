const { connect, connection } = require('mongoose');

const connectionString = 
  process.env.MONGODB_URI || 'mongodb'