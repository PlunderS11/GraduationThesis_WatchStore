const dotenv = require('dotenv');

dotenv.config();

const MONGO_URL = process.env.MONGODB_URL || '';
const PORT = process.env.PORT || 8080;

module.exports = { MONGO_URL, PORT };
