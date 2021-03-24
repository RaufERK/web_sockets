const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { saltRounds } = process.env;
const { Users } = require('../db/mongo');

router
  .route('/')
  .get((req, res) => {
    res.render('signin');
  })
  .post(async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await Users.findOne({ username });
      if (user) {
        const passCheck = await bcrypt.compare(password, user.password);
        if (passCheck) {
          req.session.username = user.username;
        }
      }
    } catch (err) {
      console.log('===============');
      console.log(err);
    }
    res.redirect('/');
  });

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/user');
});

router
  .route('/signup')
  .get((req, res) => {
    res.render('signup', { msg: null });
  })
  .post(async (req, res) => {
    try {
      const { username, password, password2 } = req.body;

      if (password !== password2) {
        return res.render('signup', { msg: 'пароли не совпали :-(' });
      }

      if (!username || !password) {
        return res.render('signup', { msg: 'ну заполни форму ну   :-)' });
      }

      const hashPassWord = await bcrypt.hash(password, Number(saltRounds));
      const user = await Users.create({ username, password: hashPassWord });
      req.session.username = user.username;
    } catch (err) {
      console.log('ERROR )=========>>>>>>>');
      console.log(err);
      return res.render('signup', { msg: String(err) });
    }
    res.redirect('/');
  });

module.exports = router;
