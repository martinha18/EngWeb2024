var express = require('express');
var router = express.Router();
var Compositor = require("../controllers/compositor")

/* GET home page. */
router.get('', function(req, res, next) {
  Compositor.list()
  .then(data => res.jsonp(data))
  .catch(erro => res.jsonp(erro))
});

router.get('/:id', function(req, res) {
  Compositor.findById(req.params.id)
  .then(data => res.jsonp(data))
  .catch(erro => res.jsonp(erro))
});

router.post('', function(req, res) {
  console.log(req.body)
  Compositor.insert(req.body)
  .then(data => res.status(201).jsonp(data))
  .catch(erro => res.status(523).jsonp(erro))
});

router.put('/:id', function(req, res) {
  console.log(req.body)
  Compositor.update(req.params.id, req.body)
  .then(data => res.status(201).jsonp(data))
  .catch(erro => res.status(524).jsonp(erro))
});

router.delete('/:id', function(req, res) {
  Compositor.delete(req.params.id)
  .then(data => res.status(201).jsonp(data))
  .catch(erro => res.status(524).jsonp(erro))
});

module.exports = router;
