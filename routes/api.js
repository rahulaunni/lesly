/*

 Version: 1.0.0 (dev)
  Author: rahuanni@evelabs.co
  company: evelabs.co
 Website: http://evelabs.co

 */

var express = require('express');
var User = require('../models/users');
var Station = require('../models/stations');
var Usr = require('../models/usr');
var Risk = require('../models/risk');
var Di = require('../models/di');
var Do = require('../models/do');
var Dva = require('../models/dva');
var Dve = require('../models/dve');
var jwt = require('jsonwebtoken');
var secret = 'lauraiswolverinesdaughter';
var nodemailer = require('nodemailer');
var ObjectId = require('mongodb').ObjectID;
var ip = require('ip');
var request = require('request');

module.exports = function(router) {

//route to resgister new user
router.post('/register', function(req,res){
	console.log(req.body);
	//creater user object by fetching values from req.body
	var user = new User();
	user.hospitalName = req.body.hospitalName;
	user.userName = req.body.email;
	user.password = req.body.password;
	//tempToken is used for verification purpose of email
	user.tempToken = jwt.sign({username:user.userName,hospitalname:user.hospitalName},secret,{expiresIn:'24h'});
	//saving user to database
	user.save(function(err){
		if (err) {
			//responding error back to frontend
			res.json({success:false,message:'User already exist'});
		}
		else{
			//nodemailer config
			var transporter = nodemailer.createTransport({
			  service: 'gmail',
			  auth: {
			    user: 'dripocare@gmail.com', 
			    pass: '3v3lab5.co'
			  }
			});
			//to get the host
			var host=req.get('host');
			//link for the mail for activation of account
			var link="http://"+req.get('host')+"/activate/"+user.tempToken; 
			var ipaddress = ip.address();
			var offlinelink = "http://"+ipaddress+":3000"+"/activate/"+user.tempToken; 
			//activation mail object
			var mailOptions = {
			  from: 'dripocare@gmail.com',
			  to: user.userName,
			  subject: 'Verification Link For Evelabs.care',
			html : "Hello "+user.userName+",<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a><br>Please Click on this link to verify your email if you are registered local server<br><a href="+offlinelink+">Click here to verify</a>" 

			};
			transporter.sendMail(mailOptions, function (err, info) {
			   if(err)
			     console.log(err)
			   else
			     console.log(info);
			});

			res.json({success:true,message:'A verification mail has been sent to your email'});
		}
	});	
});

//route to verify the user before sending verification link again
router.post('/resend',function (req,res) {
	User.findOne({userName:req.body.username}).select('userName password active').exec(function (err,user) {
		if(err) throw err;
		if(!user){
			res.json({success:false,message:"No user found"});
		}
		else if(user){
			var validPassword = user.comparePassword(req.body.password);
			if (!validPassword){
				res.json({success:false,message:"Wrong password"});
			}
			else if(user.active){
				res.json({success:false,message:"Account is already active"});
			}
			else{
				res.json({ success: true, user: user });

			}

		}
		
	});
});

// Route to send user a new activation link once credentials have been verified
router.put('/resend', function(req, res) {
	User.findOne({ userName: req.body.username }).select('userName hospitalName tempToken').exec(function(err, user) {
		if (err) throw err; // Throw error if cannot connect
		user.tempToken = jwt.sign({username:user.userName,hospitalname:user.hospitalName},secret,{expiresIn:'24h'});
		user.password = req.body.password;
		// Save user's new token to the database
		user.save(function(err) {
			if (err) {
				console.log(err);
				res.json({success:false,message:'Failed to send activation link, Try after sometime'})
			} else {
				// If user successfully saved to database, create e-mail object
				var transporter = nodemailer.createTransport({
				  service: 'gmail',
				  auth: {
				    user: 'dripocare@gmail.com', 
				    pass: '3v3lab5.co'
				  }
				});
				var host=req.get('host');
				var link="http://"+req.get('host')+"/activate/"+user.tempToken; 
				var ipaddress = ip.address();
				var offlinelink = "http://"+ipaddress+":3000"+"/activate/"+user.tempToken; 
				var mailOptions = {
				  from: 'dripocare@gmail.com',
				  to: user.userName,
				  subject: 'Verification Link For Evelabs.care',
				html : "Hello "+user.userName+",<br> Please Click on this link to verify your email if you are registered with evelabs.care.<br><a href="+link+">Click here to verify</a><br> Please Click on this link to verify your email if you are registered local server<br><a href="+offlinelink+">Click here to verify</a>" 
				};
				transporter.sendMail(mailOptions, function (err, info) {
				   if(err)
				     console.log(err)
				   else
				     console.log(info);
				});
				res.json({ success: true, message: 'Activation link has been sent to ' + user.userName + '!' }); // Return success message to controller
			}
		});
	});
});


// Route to send reset link to the user
router.put('/forgotpassword', function(req, res) {
	User.findOne({ userName: req.body.username }).select('userName active resetToken ').exec(function(err, user) {
		if (err) throw err; // Throw error if cannot connect
		if (!user) {
			res.json({ success: false, message: 'Username was not found' }); // Return error if username is not found in database
		} else if (!user.active) {
			res.json({ success: false, message: 'Account has not yet been activated' }); // Return error if account is not yet activated
		} else {
			user.resetToken = jwt.sign({username:user.userName,hospitalname:user.hospitalName},secret,{expiresIn:'24h'}); // Create a token for activating account through e-mail
			// Save token to user in database
			user.save(function(err) {
				if (err) {
					res.json({ success: false, message: err }); // Return error if cannot connect
				} else {
					var transporter = nodemailer.createTransport({
					  service: 'gmail',
					  auth: {
					    user: 'dripocare@gmail.com', 
					    pass: '3v3lab5.co'
					  }
					});
					var host=req.get('host');
					var link="http://"+req.get('host')+"/resetpassword/"+user.resetToken; 
					var ipaddress = ip.address();
					var offlinelink = "http://"+ipaddress+":3000"+"/resetpassword/"+user.resetToken; 
					var mailOptions = {
					  from: 'dripocare@gmail.com',
					  to: user.userName,
					  subject: 'Password reset link for Evelabs.care',
					html : "Hello "+user.userName+",<br> Please Click on the link to reset your Evelabs.care account password.<br><a href="+link+">Click here to verify</a><br> Please Click on this link to change local account password<br><a href="+offlinelink+">Click here to verify</a>" 
					};
					transporter.sendMail(mailOptions, function (err, info) {
					   if(err)
					     console.log(err)
					   else
					     console.log(info);
					});
					
					res.json({ success: true, message: 'Please check your e-mail for password reset link' }); // Return success message
				}
			});
		}
	});
});

//route to verify the password reset link
router.get('/resetpassword/:token', function(req, res) {
	User.findOne({ resetToken: req.params.token }, function(err, user) {
		if (err) throw err; // Throw error if cannot login
		var token = req.params.token; // Save the token from URL for verification 

		// Function to verify the user's token
		jwt.verify(token, secret, function(err, decoded) {
			if (err) {
				res.json({ success: false, message: 'Password reset link has expired' }); // Token is expired
			} else if (!user) {
				res.json({ success: false, message: 'Password reset link has expired' }); // Token may be valid but does not match any user in the database
			} else {
				res.json({ success: true, user:user}); // Return success message to controller
			}
		});
	});
	
});

router.put('/savepassword', function(req, res) {
	User.findOne({userName: req.body.username}).select('userName password resetToken').exec(function(err, user) {
		if (err) throw err; // Throw error if cannot connect
		user.password = req.body.password;
		user.resetToken = false;
		user.save(function(err) {
			if (err) {
				console.log(err);
				res.json({success:false,message:'Failed to connect to database'})
			} else {
				// If user successfully saved to database, create e-mail object
				var transporter = nodemailer.createTransport({
				  service: 'gmail',
				  auth: {
				    user: 'dripocare@gmail.com', 
				    pass: '3v3lab5.co'
				  }
				});
				var host=req.get('host');
				var link="http://"+req.get('host')+"/login"; 
				var mailOptions = {
				  from: 'dripocare@gmail.com',
				  to: user.userName,
				  subject: 'Password reset successfull',
				html : "Hello "+user.userName+",<br>You have successfully reset your password <br><a href="+link+">Click here to login</a>" 
				};
				transporter.sendMail(mailOptions, function (err, info) {
				   if(err)
				     console.log(err)
				   else
				     console.log(info);
				});
				res.json({ success: true, message: 'Your password changed successfully'}); 
			}
		});
	});
});

router.put('/activate/:token', function(req, res) {
	User.findOne({ tempToken: req.params.token }, function(err, user) {
		if (err) throw err; // Throw error if cannot login
		var token = req.params.token; // Save the token from URL for verification 

		// Function to verify the user's token
		jwt.verify(token, secret, function(err, decoded) {
			if (err) {
				res.json({ success: false, message: 'Activation link has expired.' }); // Token is expired
			} else if (!user) {
				res.json({ success: false, message: 'Activation link has expired.' }); // Token may be valid but does not match any user in the database
			} else {
				user.tempToken = false; // Remove temporary token
				user.active = true; // Change account status to Activated
				// Mongoose Method to save user into the database
				user.save(function(err) {
					if (err) {
						console.log(err); // If unable to save user, log error info to console/terminal
					} else {
						res.json({ success: true, message: 'Account activated!' }); // Return success message to controller
						var transporter = nodemailer.createTransport({
						  service: 'gmail',
						  auth: {
						    user: 'dripocare@gmail.com', 
						    pass: '3v3lab5.co'
						  }
						});
						// If save succeeds, create e-mail object
						var mailOptions = {
							from: 'dripocare@gmail.com',
							to: user.userName,
							subject: 'Evelabs.care Account Activated',
							text: 'Hello ' + user.userName + ', Your account has been successfully activated!',
							html: 'Hello<strong> ' + user.userName + '</strong>,<br><br>Your account has been successfully activated!'
						};

						// Send e-mail object to user
						transporter.sendMail(mailOptions, function (err, info) {
						   if(err)
						     console.log(err)
						   else
						     console.log(info);
						});
					}
				});
			}
		});
	});
	
});

//user login route
router.post('/login',function (req,res) {
	if(req.body.username && req.body.password){
		//finding user from database
		User.findOne({userName:req.body.username}).select('userName _id hospitalName password active').exec(function (err,user) {
			if(err) throw err;
			//if no user found resond with no user found error message
			if(!user){
				res.json({success:false,message:"No user found"});
			}
			//if user found checking for password match
			else if(user){
				var validPassword = user.comparePassword(req.body.password);
				if (!validPassword){
					res.json({success:false,message:"Wrong password"});
				}
				//if password matches check whether user has an active account
				else if(!user.active){
					res.json({success:false,message:"Account is not yet activated",expired:true});
				}
				else{
					//successful login and passing a token to the user for login
					var token = jwt.sign({username:user.userName,hospitalname:user.hospitalName,uid:user._id},secret);
					res.json({success:true,message:"Authentication success",token:token});

				}

			}
			
		});
	}
	else{
		res.json({success:false,message:"A required field is empty"});

	}
	
});






//middleware to get all the details decoded from the token
router.use(function (req,res,next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if(token){
		//verify token
		jwt.verify(token, secret, function(err, decoded) {
			if(err){
				res.json({success:false,message:"Invalid Token"});
			}
			else{
				req.decoded=decoded;
				User.find({userName:req.decoded.username}).exec(function (err,user) {
					req.decoded.admin = user[0]._admin;
					next();
				});
			}
		});
	}
	else{
		res.json({success:false,message:"No token provided"})
	}
});

router.get('/user',function (req,res) {
	if(!req.decoded){
		res.send("Unable to decode user, login again")
	}
	else{
		res.send(req.decoded);

	}
});
//Routes after authentication;

//routes for returning permission of user
router.get('/permission',function (req,res) {
	User.findOne({userName:req.decoded.username}).exec(function (err,user) {
		if(err) throw err;
		//if no user found resond with no user found error message
		if(user.length == 0){
			res.json({success:false,message:"No user found"});
		}
		else{
			res.json({success:true,permission:user.permission});
		}

		});
});

router.get('/admin/gethost', function(req, res) {
	var host = req.get('host');
	if(host == 'localhost:3000'){
		res.json({success:true,type:'local'})
	}
	else{
		res.json({success:true,type:'online'})

	}

});


//route to get ip adress to admin panel
router.get('/admin/getip', function(req, res) {
	var ipaddress= ip.address();
	if(!ipaddress){
		res.jason({success:false,message:"Can't retrieve ip address"})
	}
	else{
		res.json({success:true,ip:ipaddress})

	}

});


router.get('/admin/getstaticip', function(req, res) {
		res.json({success:true,ip:'3.127.153.164'});

});





router.get('/nurse/viewstation', function(req,res){
	Station.find({username: req.decoded.admin}).exec(function(err, station) {	
			if (err) throw err;
			if(!station.length){
				res.json({success:false,message:'No stations found, Contact admin'});
			}
			
			else{

				res.json({success:true,message:'Station found',stations:station});
			}
	});
});
//route to set new token including the user selected station
router.post('/nurse/setstation', function(req,res){
	if(req.body.stationname){
		Station.find({username: req.decoded.admin,stationname:req.body.stationname}).exec(function(err, station) {
			if(station.length == 0){
				res.json({success:false,message:"Selected Station not found"});
			}
			else{
				var token = jwt.sign({username:req.decoded.username,hospitalname:req.decoded.hospitalname,uid:req.decoded.uid,station:req.body.stationname,stationid:station[0]._id},secret);
				res.json({success:true,message:"token updated",token:token});

			}

		});	
	}
	else{
		res.json({success:false,message:"Required field is empty"});
	}
	
		
});


//*********code for design control
router.post('/userneed', function(req,res){

	Usr.find({_project:ObjectId(req.decoded.stationid)}).sort({id:-1}).exec(function(err,user) {
		if(err) throw err
		var usr = new Usr();
		if(user.length == 0){
			usr.id = 1;
		}
		else{
			usr.id = user[0].id +1;
		}
		usr.date = new Date();
		usr.data = req.body.userneed;
		usr._project = ObjectId(req.decoded.stationid);
		usr._user = ObjectId(req.decoded.uid);
		usr._admin = req.decoded.admin;
		usr.save(function (err) {
			if(err) throw err;
			else{
				res.json({success:true,message:'User need added'});
			}
		})
	});
	

});

router.get('/userneed', function(req,res){
	Usr.find({_project:ObjectId(req.decoded.stationid)}).sort({id:1}).exec(function(err,user) {
		if(err) throw err;
		if(user.length == 0){
			res.json({success:false,message:'User need not found'});
		}
		else{
			res.json({success:true,userneed:user});

		}
	});

});

router.put('/userneed', function(req,res){
	Usr.collection.update({_id:ObjectId(req.body.id)},{$set:{data:req.body.userneed}},{upsert:false});
	res.json({success:true,message:'User need added'});

});

router.delete('/userneed', function(req,res){
	Usr.find({_id:ObjectId(req.query.usrid),_project:ObjectId(req.decoded.stationid)}).sort({id:1}).exec(function(err,usrneed) {
		if(err) throw err;
		startid = usrneed[0].id +1;
		Usr.find({_project:ObjectId(req.decoded.stationid)}).sort({id:1}).exec(function(err,user) {
			if(err) throw err;
			finalIndex = user.length -1;
			finalid = user[finalIndex].id;
			idArray = [];
			for(var i=startid;i<=finalid;i++){
				idArray.push(i)
			}
			console.log(idArray);
			if(startid <= finalid){
				for(var key in idArray){
					console.log('inside loop');
					Usr.collection.update({id:idArray[key],_project:ObjectId(req.decoded.stationid)},{$set:{id:(idArray[key]-1)}},{upsert:false});

				}
			Usr.collection.remove({_id:ObjectId(req.query.usrid)});
			res.json({success:true,message:'User need deleted'});	

			}
			else{
				Usr.collection.remove({_id:ObjectId(req.query.usrid)});
				res.json({success:true,message:'User need deleted'});
			}
		
		});


	});

});


router.post('/risk', function(req,res){

	Risk.find({_project:ObjectId(req.decoded.stationid)}).sort({id:-1}).exec(function(err,risk) {
		if(err) throw err
		var rsk = new Risk();
		if(risk.length == 0){
			rsk.id = 1;
		}
		else{
			rsk.id = risk[0].id +1;
		}
		rsk.date = new Date();
		rsk.system = req.body.system;
		rsk.data = req.body.data;
		rsk.cause= req.body.cause;
		rsk.severity= req.body.severity;
		rsk.system=req.body.system;
		rsk.probability = req.body.probability;
		rsk.riskindex=req.body.riskindex;
		rsk.riskcontrol=req.body.riskcontrol;
		rsk._project = ObjectId(req.decoded.stationid);
		rsk._user = ObjectId(req.decoded.uid);
		rsk._admin = req.decoded.admin;
		rsk.save(function (err) {
			if(err) throw err;
			else{
				res.json({success:true,message:'Risk added'});
			}
		})
	});
	

});

router.get('/risk', function(req,res){
	Risk.find({_project:ObjectId(req.decoded.stationid)}).sort({id:1}).exec(function(err,risk) {
		if(err) throw err;
		if(risk.length == 0){
			res.json({success:false,message:'Risks not added'});
		}
		else{
			console.log(risk);
			res.json({success:true,risks:risk});

		}
	});
			

});

router.put('/risk', function(req,res){
	Risk.collection.update({_id:ObjectId(req.body.id)},{$set:{data:req.body.data,cause:req.body.cause,severity:req.body.severity,probability:req.body.probability,riskindex:req.body.riskindex,riskcontrol:req.body.riskcontrol}},{upsert:false});
	res.json({success:true,message:'Risk updated'});
});


router.delete('/risk', function(req,res){
	Risk.find({_id:ObjectId(req.query.id),_project:ObjectId(req.decoded.stationid)}).sort({id:1}).exec(function(err,usrneed) {
		if(err) throw err;
		startid = usrneed[0].id +1;
		Risk.find({_project:ObjectId(req.decoded.stationid)}).sort({id:1}).exec(function(err,user) {
			if(err) throw err;
			finalIndex = user.length -1;
			finalid = user[finalIndex].id;
			idArray = [];
			for(var i=startid;i<=finalid;i++){
				idArray.push(i)
			}
			console.log(idArray);
			if(startid <= finalid){
				for(var key in idArray){
					Risk.collection.update({id:idArray[key],_project:ObjectId(req.decoded.stationid)},{$set:{id:(idArray[key]-1)}},{upsert:false});

				}
			Risk.collection.remove({_id:ObjectId(req.query.id)});
			res.json({success:true,message:'Risk deleted'});	

			}
			else{
				Risk.collection.remove({_id:ObjectId(req.query.id)});
				res.json({success:true,message:'Risk deleted'});
			}
		
		});


	});

});


router.get('/loadusrandrisk', function(req,res){
	Usr.find({_project:ObjectId(req.decoded.stationid)}).exec(function(err,user) {
		if(err) throw err;
		else{
			Risk.find({_project:ObjectId(req.decoded.stationid)}).exec(function(err,risk) {
				if(err) throw err;
				if(risk.length == 0){
					res.json({success:true,need:user});

				}
				else{
					var needs = user.concat(risk)
					res.json({success:true,need:needs});

				}

			});

		}
	});


});


router.post('/designinput', function(req,res){

	Di.find({_project:ObjectId(req.decoded.stationid)}).sort({id:-1}).exec(function(err,designip) {
		if(err) throw err
		var di = new Di();
		if(designip.length == 0){
			di.id = 1;
		}
		else{
			di.id = designip[0].id +1;
		}
		Usr.find({_id:ObjectId(req.body.userneed)}).exec(function(err,user) {
			if(err) throw err;
			if(user.length == 0){

				di.date = new Date();
				di.data = req.body.di;
				di._project = ObjectId(req.decoded.stationid);
				di._user = ObjectId(req.decoded.uid);
				di._admin = req.decoded.admin;
				di.type=req.body.type;
				di._risk = ObjectId(req.body.userneed)
				di.save(function (err,dicb) {
					if(err) throw err;
					else{
						Risk.collection.update({_id:ObjectId(req.body.userneed)},{$push:{_di:dicb._id}},{upsert:false});
						res.json({success:true,message:'Design input added'});
					}
				})

			}
			else{
				di.date = new Date();
				di.data = req.body.di;
				di.type=req.body.type;
				di._project = ObjectId(req.decoded.stationid);
				di._user = ObjectId(req.decoded.uid);
				di._admin = req.decoded.admin;
				di._usr = ObjectId(req.body.userneed)
				di.save(function (err,dicb) {
					if(err) throw err;
					else{
						Usr.collection.update({_id:ObjectId(req.body.userneed)},{$push:{_di:dicb._id}},{upsert:false});
						res.json({success:true,message:'design input added'});
					}
				})

			}

		});


	});
	

});


router.get('/designinput', function(req,res){
	Di.find({_project:ObjectId(req.decoded.stationid)}).sort({id:1}).populate("_usr").populate("_risk").exec(function(err,di) {
		if(err) throw err;
		if(di.length == 0){
			res.json({success:false,message:'Design input not found'});
		}
		else{
			res.json({success:true,designinput:di});

		}
	});

});

router.get('/trace', function(req,res){
	Di.find({_project:ObjectId(req.decoded.stationid)}).sort({id:1}).populate("_usr").populate("_dva").populate("_risk").populate("_dve").populate("_do").exec(function(err,di) {
		if(err) throw err;
		if(di.length == 0){
			res.json({success:false,message:'User need not found'});
		}
		else{
			res.json({success:true,designinput:di});

		}
	});

});




router.put('/designinput', function(req,res){
	console.log(req.body);
	Usr.find({_id:ObjectId(req.body.idu)}).exec(function(err,user) {
	if(err) throw err;
	if(user.length == 0){
	Di.collection.update({_id:ObjectId(req.body.id)},{$set:{data:req.body.di,system:req.body.system,type:req.body.type,_risk:ObjectId(req.body.idu),_usr:null}},{upsert:false});
	}else{
	Di.collection.update({_id:ObjectId(req.body.id)},{$set:{data:req.body.di,system:req.body.system,type:req.body.type,_usr:ObjectId(req.body.idu),_risk:null}},{upsert:false});	
	}
});
	res.json({success:true,message:'User need updated'});

});

router.delete('/designinput', function(req,res){
	Di.find({_id:ObjectId(req.query.diid),_project:ObjectId(req.decoded.stationid)}).sort({id:1}).exec(function(err,usrneed) {
		if(err) throw err;
		startid = usrneed[0].id +1;
		Di.find({_project:ObjectId(req.decoded.stationid)}).sort({id:1}).exec(function(err,user) {
			if(err) throw err;
			finalIndex = user.length -1;
			finalid = user[finalIndex].id;
			idArray = [];
			for(var i=startid;i<=finalid;i++){
				idArray.push(i)
			}
			console.log(idArray);
			if(startid <= finalid){
				for(var key in idArray){
					Di.collection.update({id:idArray[key],_project:ObjectId(req.decoded.stationid)},{$set:{id:(idArray[key]-1)}},{upsert:false});

				}
			Di.collection.remove({_id:ObjectId(req.query.diid)});
			Usr.collection.update({_di:ObjectId(req.query.diid)},{$pull:{_di:ObjectId(req.query.diid)}},{upsert:false});
			res.json({success:true,message:'User need deleted'});	

			}
			else{
		Di.collection.remove({_id:ObjectId(req.query.diid)});
		Usr.collection.update({_di:ObjectId(req.query.diid)},{$pull:{_di:ObjectId(req.query.diid)}},{upsert:false});
		res.json({success:true,message:'User need deleted'});
			}
		
		});


	});

});



router.post('/designoutput', function(req,res){
	Do.find({_project:ObjectId(req.decoded.stationid)}).sort({id:-1}).exec(function(err,desop) {
		if(err) throw err
		var dop = new Do();
		if(desop.length == 0){
			dop.id = 1;
		}
		else{
			dop.id = desop[0].id +1;
		}
		dop.date = new Date();
		dop.data = req.body.do;
		dop.system = req.body.system;
		dop._project = ObjectId(req.decoded.stationid);
		dop._user = ObjectId(req.decoded.uid);
		dop._admin = req.decoded.admin;
		dop._di = ObjectId(req.body.di);
		dop.save(function (err,dopcb) {
			if(err) throw err;
			else{
				Di.collection.update({_id:ObjectId(req.body.di)},{$set:{_do:dopcb._id}},{upsert:false});
				res.json({success:true,message:'Risk added'});
			}
		})
	});

});

router.get('/designoutput', function(req,res){
	Do.find({_project:ObjectId(req.decoded.stationid)}).sort({id:1}).populate("_di").exec(function(err,dops) {
		if(err) throw err;
		if(dops.length == 0){
			res.json({success:false,message:'No design outputs'});
		}
		else{
			res.json({success:true,designoutput:dops});

		}
	});

});

router.put('/designoutput', function(req,res){
	Do.collection.update({_id:ObjectId(req.body.id)},{$set:{data:req.body.do,_di:ObjectId(req.body.di),system:req.body.system}},{upsert:false});
	res.json({success:true,message:'User need updated'});
});

router.delete('/designoutput', function(req,res){

	Do.find({_id:ObjectId(req.query.doid),_project:ObjectId(req.decoded.stationid)}).sort({id:1}).exec(function(err,usrneed) {
		if(err) throw err;
		startid = usrneed[0].id +1;
		Do.find({_project:ObjectId(req.decoded.stationid)}).sort({id:1}).exec(function(err,user) {
			if(err) throw err;
			finalIndex = user.length -1;
			finalid = user[finalIndex].id;
			idArray = [];
			for(var i=startid;i<=finalid;i++){
				idArray.push(i)
			}
			console.log(idArray);
			if(startid <= finalid){
				for(var key in idArray){
					Do.collection.update({id:idArray[key],_project:ObjectId(req.decoded.stationid)},{$set:{id:(idArray[key]-1)}},{upsert:false});

				}

				Do.collection.remove({_id:ObjectId(req.query.doid)});
				res.json({success:true,message:'DesignOutput deleted'});	

			}
			else{
			Do.collection.remove({_id:ObjectId(req.query.doid)});
			res.json({success:true,message:'DesignOutput deleted'});
			}
		
		});


	});




});






router.post('/designvalidation', function(req,res){
	Dva.find({_project:ObjectId(req.decoded.stationid)}).sort({id:-1}).exec(function(err,desval) {
		if(err) throw err
		var dav = new Dva();
		if(desval.length == 0){
			dav.id = 1;
		}
		else{
			dav.id = desval[0].id +1;
		}
		dav.date = new Date();
		dav.data = req.body.dva;
		dav._project = ObjectId(req.decoded.stationid);
		dav._user = ObjectId(req.decoded.uid);
		dav._admin = req.decoded.admin;
		dav._usr = ObjectId(req.body.userneed);
		usrid = ObjectId(req.body.userneed);
		dav.save(function (err,davcb) {
			if(err) throw err;
			else{
				console.log(davcb);
				console.log(usrid);
				Usr.collection.update({_id:usrid},{$set:{_dva:davcb._id}},{upsert:false});
				Di.collection.update({_usr:usrid},{$set:{_dva:davcb._id}},{upsert:false});
				res.json({success:true,message:'Design validation added'});
			}
		})
	});

});

router.get('/designvalidation', function(req,res){
	Dva.find({_project:ObjectId(req.decoded.stationid)}).populate("_usr").sort({id:1}).exec(function(err,dva) {
		if(err) throw err;
		if(dva.length == 0){
			res.json({success:false,message:'No design validations'});
		}
		else{
			res.json({success:true,dva:dva});

		}
	});

});


router.put('/designvalidation', function(req,res){
	Dva.collection.update({_id:ObjectId(req.body.id)},{$set:{data:req.body.dva,_usr:req.body.userneed}},{upsert:false});
	res.json({success:true,message:'User need updated'});
});

router.delete('/designvalidation', function(req,res){
	Dva.find({_id:ObjectId(req.query.dvaid),_project:ObjectId(req.decoded.stationid)}).sort({id:1}).exec(function(err,usrneed) {
		if(err) throw err;
		startid = usrneed[0].id +1;
		Dva.find({_project:ObjectId(req.decoded.stationid)}).sort({id:1}).exec(function(err,user) {
			if(err) throw err;
			finalIndex = user.length -1;
			finalid = user[finalIndex].id;
			idArray = [];
			for(var i=startid;i<=finalid;i++){
				idArray.push(i)
			}
			console.log(idArray);
			if(startid <= finalid){
				for(var key in idArray){
					Dva.collection.update({id:idArray[key],_project:ObjectId(req.decoded.stationid)},{$set:{id:(idArray[key]-1)}},{upsert:false});

				}

				Dva.collection.remove({_id:ObjectId(req.query.dvaid)});
				res.json({success:true,message:'DesignOutput deleted'});	

			}
			else{
			Dva.collection.remove({_id:ObjectId(req.query.dvaid)});
			res.json({success:true,message:'DesignOutput deleted'});
			}
		
		});


	});


});



router.post('/designverification', function(req,res){
	Dve.find({_project:ObjectId(req.decoded.stationid)}).sort({id:-1}).exec(function(err,desver) {
		if(err) throw err
		var dve = new Dve();
		if(desver.length == 0){
			dve.id = 1;
		}
		else{
			dve.id = desver[0].id +1;
		}
		dve.date = new Date();
		dve.data = req.body.dve;
		dve._project = ObjectId(req.decoded.stationid);
		dve._user = ObjectId(req.decoded.uid);
		dve._admin = req.decoded.admin;
		dve._di = ObjectId(req.body.designinput);
		dve.save(function (err,devcb) {
			if(err) throw err;
			else{
				Di.collection.update({_id:ObjectId(req.body.designinput)},{$set:{_dve:devcb._id}},{upsert:false});
				res.json({success:true,message:'Design validation added'});
			}
		})
	});

});

router.get('/designverification', function(req,res){
	Dve.find({_project:ObjectId(req.decoded.stationid)}).populate("_di").sort({id:1}).exec(function(err,dve) {
		if(err) throw err;
		if(dve.length == 0){
			res.json({success:false,message:'No design ver'});
		}
		else{
			res.json({success:true,dve:dve});

		}
	});

});

router.put('/designverification', function(req,res){
	Dve.collection.update({_id:ObjectId(req.body.id)},{$set:{data:req.body.dve,_di:req.body.designinput}},{upsert:false});
	res.json({success:true,message:'User need updated'});
});

router.delete('/designverification', function(req,res){
	Dve.find({_id:ObjectId(req.query.dveid),_project:ObjectId(req.decoded.stationid)}).sort({id:1}).exec(function(err,usrneed) {
		if(err) throw err;
		startid = usrneed[0].id +1;
		Dve.find({_project:ObjectId(req.decoded.stationid)}).sort({id:1}).exec(function(err,user) {
			if(err) throw err;
			finalIndex = user.length -1;
			finalid = user[finalIndex].id;
			idArray = [];
			for(var i=startid;i<=finalid;i++){
				idArray.push(i)
			}
			console.log(idArray);
			if(startid <= finalid){
				for(var key in idArray){
					Dve.collection.update({id:idArray[key],_project:ObjectId(req.decoded.stationid)},{$set:{id:(idArray[key]-1)}},{upsert:false});

				}

				Dve.collection.remove({_id:ObjectId(req.query.dveid)});
				res.json({success:true,message:'User need deleted'});

			}
			else{
				Dve.collection.remove({_id:ObjectId(req.query.dveid)});
				res.json({success:true,message:'User need deleted'});

			}
		
		});


	});





});


//********************************************************************************************************************
//***routes for local users management starts from here***
//route to add a new user by admin
router.post('/admin/user', function(req,res){
		var user = new User();
		if(req.body.username && req.body.password && req.body.permission){
				user.hospitalName = req.decoded.hospitalname;
				user.userName = req.body.username+'@'+req.decoded.hospitalname+'.co';
				user.password = req.body.password;
				user.permission = req.body.permission;
				user.active = true;
				user._admin = req.decoded.username;
				user.tempToken = false;
				// saving user to database
				user.save(function(err){
					if (err) {
						console.log(err);
						//responding error back to frontend
						res.json({success:false,message:'User already exist'});
					}
					else{

						res.json({success:true,message:'User added'});
					}
			});

		}
		else{
			res.json({success:false,message:'A required value is missing'});

		}
		
});
//route for fetching all the user details to the admin view
router.get('/admin/user', function(req,res){
	User.find({_admin: req.decoded.username}).select('userName  permission').exec(function(err, user) {	
			if (err) throw err;
			if(!user.length){
				res.json({success:false,message:'Add user and start Managing'});
			}
			else{

				res.json({success:true,message:'User found',users:user});
			}
	});
});

//route to delete an user from database
router.delete('/admin/user', function(req,res){
	if(req.query.userid){
		User.remove({_id:req.query.userid},function (err) {
			if(err){
				console.log(err);
				res.json({success:false,message:"No user found"});

			}
			else{
				res.json({success:true,message:"User removed successfully"});
			}
		});
	}
	else{
		res.json({success:false,message:"No userid in query"});

	}
	
});

//route to update/change password of nurse/doctor account
router.put('/admin/user', function(req, res) {
	if(req.body._id){
		User.findOne({_id:req.body._id}).select('userName password resetToken').exec(function(err, user) {
			if (err) throw err; // Throw error if cannot connect
			if(!user){
				res.json({success:false,message:'no user found'})
			}
			else{
				if(req.body.password){
					user.password = req.body.password;
					user.save(function(err) {
						if (err) {
							console.log(err);
							res.json({success:false,message:'Failed to connect to database'})
						} else {
							res.json({ success: true, message: 'Your password changed successfully'}); 
						}
					});

				}
				else{
					res.json({success:false,message:'Password field empty'})

				}
				

			}
			
		});

	}
	else{
		res.json({success:false,message:'_id field is empty'})

	}
	
});

//***routes for station management starts here***
router.post('/admin/station',function (req,res) {
	//to make sure unique station name for each admin
	if(req.body.stationname){
		Station.findOne({stationname: req.body.stationname,username:req.decoded.username}).exec(function(err,station) {
			if (err) throw err;
			if(!station){
					var station = new Station();
					station.stationname = req.body.stationname;
					station.username = req.decoded.username;
					station._user = ObjectId(req.decoded.uid);
					// saving user to database
					station.save(function(err){
						if (err) {
							console.log(err);
							//responding error back to frontend
							res.json({success:false,message:'Data Base error try after sometimes'});
						}
						else{

							res.json({success:true,message:'Station added'});
						}
				});
			}
			else{
				res.json({success:false,message:'You have already added this station name'})
			}

		});

	}
	else{
		res.json({success:false,message:'A required field is missing'});

	}
	

});

//route for fetching all the station details to the admin view
router.get('/admin/station', function(req,res){
	Station.find({username: req.decoded.username}).exec(function(err, station) {	
			if (err) throw err;
			if(!station.length){
				res.json({success:false,message:'Add Stations and Start Managing'});
			}
			
			else{

				res.json({success:true,message:'Station found',stations:station});
			}
	});
});

//route to delete a station from database
router.delete('/admin/station', function(req,res){
	if(req.query.stationid){
		Station.remove({_id:req.query.stationid},function (err) {
			if(err){
				console.log(err);
				res.json({success:false,message:"No station found"});
			}
			else{
				res.json({success:true,message:"Station removed successfully"});
			}
		});
	}
	else{
		res.json({success:false,message:"No stationid in query"});

	}
	
});

router.put('/admin/station',function (req,res) {
	if(req.body.stationname && req.body._id){
		Station.findOne({stationname: req.body.stationname,username:req.decoded.username}).exec(function(err,station) {
			if (err) throw err;
			if(!station){
				Station.findOne({_id:req.body._id}).select('stationname').exec(function(err,oldstation) {
				oldstation.stationname=req.body.stationname;
				oldstation.save(function (err) {
					if(err) throw err;
					else{
						res.json({success:true,message:'Station name updated',stations:station});
					}
				});
			});
			}
			else{
				res.json({success:false,message:'You have already added this station name'})
			}

		});
	}
	else{
		res.json({success:false,message:'A required field is missing'});
	}
	
});




return router;
}