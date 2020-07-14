var express = require('express');
var User = require('../models').User;

var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  /*
   * 다음의 코드는 프로미스를 사용한 코드
   * 그 아래의 async/await를 사용한 코드와 동일한 기능을 제공한다.
  User.findAll()
    .then((users) => {
      res.render('sequelize', {users});
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
  */
  try{
    const users = await User.findAll();
    res.render('sequelize', {users});
  }
  catch(error){
    console.log(error);
    next(error);
  }
});

module.exports = router;
