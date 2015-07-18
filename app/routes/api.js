var config = require('../../config');
var User = require('../models/user');
var Story =require('../models/story');
var secretKey = config.secretKey;
var jsonwebtoken = require('jsonwebtoken');

function createToken(user){

	var token = jsonwebtoken.sign({
		 name:user.name,
		id:user._id,
		 username:user.username
	},secretKey,{
		expiresInMinutes:4
	});

	return token;
}
module.exports = function(app,express,io) {
	
	var api = express.Router();
	
	api.get('/all_stories', function(req, res){
        Story.find({}, function(err, stories){

            if(err){
                res.send(err);
                return;
            }

            res.json(stories);
        });
    });
 
	api.post('/signup',function(req,res){

		var user = new User({

			name:req.body.name,
			username:req.body.username,
			password:req.body.password
		});
	var token = createToken(user);
		user.save(function(err){

			if(err){

				res.send(err);
				return;
			}

			res.json({
				success:true,	
				message:"user created....",
				token:token
			});
		});
	});

	api.get('/users',function(req,res){

		User.find({},function(err,users){

			if(err){
				resp.send(err);
				return;
			}
			res.json(users);
		});
	});

	api.post('/login',function(req,res){

		User.findOne({

			username:req.body.username
		}).select('name username password').exec(function(err,user){

			if(err){
				throw err;
			}
			if(!user){

				res.send({message:"user not exist"});
			}else if(user){

				var validPassword = user.comparePassword(req.body.password);

				if(!validPassword){
					res.send({message :"Invalid password..."});
				}else{

					var token = createToken(user);
					res.json({
						success:true,
						message:"logged in",
						token :token
					});
				}
			}
		})
	});

	api.use(function(req,res,next){

		console.log('some one logged in app visited');

		var token = req.body.token || req.param('token') || req.headers['x-access-token'];

		if(token){

			jsonwebtoken.verify(token,secretKey,function(err,decoded){

				if(err){
					res.status(403).send({ success:false ,message:"Failed to authenticate user"});
				}else{

					req.decoded = decoded; 
					console.log("++++++++"+decoded);
					next();
				}

			});
		}else{
				res.status(403).send({ success:false ,message:"tOKEN NOT EXIST"});
		}
	});

	api.get('/qqwqww',function(req,res){

		res.json("hello");
	});

	api.route('/')

		.post(function(req,res){

			var story = new Story({

				creater :req.decoded.id,
				content:req.body.content
			});

			story.save(function(err,newStory){

				if(err){
					res.send(err);
					return;
				}
				io.emit('story',newStory);
				res.json({message:"story created"});
			});

		})
		.get(function(req,res){

			Story.find({creater:req.decoded.id},function(error,stories){
				if(error){
					res.send(error);
					return;
				}
				res.json(stories);

			})
		});

	api.get('/me',function(req,res){

		res.json(req.decoded);
	});
	return api;
}