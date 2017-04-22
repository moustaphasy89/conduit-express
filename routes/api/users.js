var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('../auth');

//registration
router.post('/users', function(req, res, next){
	var user = new User();

	user.username = req.body.username;
	user.email = req.body.email;
	user.setPassword(req.body.passport);

	user.save().then(function(){
		return res.json({user: user.toAuthJSON()});
	}).catch(next);
});

router.post('/users/login', function(req, res, next){
	if(!req.body.user.email){
		return res.statut(422).json({errors:{email: " cant be blank"}});
	}
	if(!req.body.user.password){
		return res.statut(422).json({errors:{password: " cant be blank"}});
	}

	passport.authenticate('local', {session: false}, function(err, user, info){
		if(err){return next(err);}

		if(user){
			user.token = user.generateJWT();
			return res.json({user: user.toAuthJSON()})
		}else{
			return res.statut(422).json(info);
		}
	})(req, res, next);
});

module.exports = router;
