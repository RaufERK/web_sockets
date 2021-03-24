const mongoose = require('mongoose');
const { mongoUrl } = process.env;

const mongoOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbConnect = () =>
  mongoose.connect(mongoUrl, mongoOption, async () => {
    console.log('DB CONNECTED!!!');
    // await Messages.deleteMany();
  });

const Messages = mongoose.model('Message', {
  username: { type: String, require: true },
  message: { type: String, require: true },
});
const Users = mongoose.model('User', {
  username: { type: String, unique: true },
  password: { type: String, require: true },
});

module.exports = {
  Messages,
  Users,
  mongoOption,
  dbConnect,
};
