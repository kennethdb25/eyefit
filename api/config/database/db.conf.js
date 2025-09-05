const mongoose = require('mongoose');
const { mongoURI } = require('../keys');

mongoose
  .connect(mongoURI)
  .then(() => console.log('Database Connected'))
  .catch((error) => {
    console.log(error);
  });
