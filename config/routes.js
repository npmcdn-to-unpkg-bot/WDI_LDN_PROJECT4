var router = require('express').Router();
var jwt = require('jsonwebtoken');
var secret = require('../config/tokens').secret;
var usersController = require('../controllers/users');
var chaptersController = require('../controllers/chapters');
var authController = require('../controllers/authentications');

function secureRoute(req, res, next) {
  if(!req.headers.authorization) return res.status(401).json({ message: "Unauthorized" });

  var token = req.headers.authorization.replace('Bearer ', '');

  jwt.verify(token, secret, function(err, payload) {
    if(err || !payload) return res.status(401).json({ message: "Unauthorized" });

    req.user = payload;
    next();
  });
}

router.route('/users')
  .all(secureRoute)
  .get(usersController.index)
  .post(usersController.create);

router.route('/users/:id')
  .all(secureRoute)
  .get(usersController.show)
  .put(usersController.update)
  .patch(usersController.update)
  .delete(usersController.delete);

router.route('/chapters')
  .all(secureRoute)
  .get(chaptersController.index)
  .post(chaptersController.create);

router.route('/chapters/:id')
  .all(secureRoute)
  .get(chaptersController.show)
  .put(chaptersController.update)
  .patch(chaptersController.update)
  .delete(chaptersController.delete);

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;