//------------------------------------------------------
// Author: zlkca
// Date: Oct 8 2015
// License: MIT
//------------------------------------------------------

'use strict';


var nodemailer = require("../../node_modules/nodemailer");
var sgTransport = require('../../node_modules/nodemailer-sendgrid-transport');
var crypto = require("crypto");
var cfg = require('../config');
var TokenMgr = require('./token');
var tm = TokenMgr();
var DB = require('../db.js');
var Validator = require('./validator');
var v = Validator();
var NodeRSA = require('node-rsa');
var FS = require('fs');

module.exports = function(){
	
	var _db = DB();
	var buf = FS.readFileSync(cfg.privateKeyPath);
	var crypt = new NodeRSA(buf);
	crypt.setOptions({'encryptionScheme': 'pkcs1'});
	var Error = {
			NONE:0,
			ACCOUNT_NOT_EXIST:1,
			PASSWORD_MISMATCH:2,
			ACCOUNT_EMPTY:3,
			EMAIL_EMPTY:4,
			INVALID_EMAIL:5,
			EMAIL_EXISTS:6,
			USERNAME_EMPTY:7,
			PASSWORD_EMPTY:8,
			PASSWORD_TOO_SIMPLE:9,
			ENCRYPT_PASSWORD_EXCEPTION:10,
			UPDATE_USER_EXCEPTION:11
	};
	
	
	function sendResetPasswordMail(host, email, token, callback){
		var sg = cfg.sendgrid;
		
		var options = { auth: {
			api_user: sg.username,
			api_key: sg.password
		}};
		
		var transporter = nodemailer.createTransport( sgTransport(options));
		transporter.sendMail({
		    from: cfg.passResetEmail,
		    to: email,
		    subject: 'Your password was reset',
		    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
	          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
	          'http://' + host + '/api/resetPassword?token=' + token + '\n\n' +
	          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
	      }, function(err){
			  
			  if(err){
				return console.log(err);
			  }else{
				var doc = null;
				if(callback){
					callback(err, doc);
				}
			  }
	    });
	}
	
	
	function isEmail(s){
		return s.indexOf("@") != -1;
	}
	
	// validateLoginAccount
	// credential	[object] 	--- eg.{ account: my@angularZ.com, password:decrypted }
	// cb			[function] 	--- function(err, doc){}
	function validateLoginAccount(credential, cb){
		var errors = [];
		var account = isEmail(credential.account) ? {'email':credential.account } : {'username':credential.account};
		
		if(credential.account == ''){
			errors.push(Error.ACCOUNT_EMPTY);
			if(cb){
				cb(errors, null);
			}
		}else{
			_db.findOne('users', account, function(err, doc){
				if( doc == null){
					errors.push(Error.ACCOUNT_NOT_EXIST);
				}
				if(cb){
					cb(errors, doc); // doc --- user object with encrypted password
				}
			});
		}
	}
	
	// validateLoginPassword
	// credential	[object] 	--- eg.{ password:decrypted }
	// hashedPass	[string]	--- hashed password from database
	// cb			[function] 	--- function(errors){}
	function validateLoginPassword( credential, hashedPass, cb ){
		var errors = [];

		if( credential.password ){
			tm.checkHash(credential.password, hashedPass, function(err, bMatch){
				if(!bMatch){
					errors.push(Error.PASSWORD_MISMATCH);
				}
				if(cb){
					cb(errors);
				}
			});
		}else{
			if(cb){
				errors.push(Error.PASSWORD_EMPTY);
				cb(errors);
			}
		}
	}
	
	function isInvalidEmail(errors){
		return (errors.indexOf(Error.EMAIL_EMPTY)!==-1 || errors.indexOf(Error.INVALID_EMAIL)!==-1
				|| errors.indexOf(Error.EMAIL_EXISTS)!==-1);
	}
	
	function isInvalidUsername(errors){
		return errors.indexOf(Error.USERNAME_EMPTY)!=-1;
	}
	
	
	// validateSignup
	// user	[object] 	--- eg.{ email: my@angularZ.com, username:martin, password:decrypted }
	// cb	[function] 	--- function(err, doc){}
	function validateSignup(user, cb){
		var errors = [];
		
		if(user.username == ''){
			errors.push(Error.USERNAME_EMPTY);
		}
		
		if(user.password == ''){
			errors.push(Error.PASSWORD_EMPTY);
		}else{
			if(v.passwordTooSimple(user.password)){
				errors.push(Error.PASSWORD_TOO_SIMPLE);
			}
		}
	
		if(user.email == ''){
			errors.push(Error.EMAIL_EMPTY);
		}else{
			if(!v.isEmail(user.email)){
				errors.push(Error.INVALID_EMAIL);
			}
		}
		
		// Check email and user name duplication
		if(isInvalidEmail(errors) && isInvalidUsername(errors)){
			if(cb)
				cb(errors);
		}else{
			_db.findOne('users', {$or: [{username:user.username}, {email:user.email}]}, function(err, doc){
				if(doc != null){
					if(user.username != '' && user.username == doc.username){
						errors.push(Error.USERNAME_EXISTS);
					}
					
					if(!isInvalidEmail(errors) && (user.email == doc.email)){
						errors.push(Error.EMAIL_EXISTS);
					}	
				}
				
				if(cb)
					cb(errors);
			});
		}
	}
	 
	// saveUser --- Save user with hashed password
	// user		[object] 	--- eg.{ email: my@angularZ.com, username:martin, password:decrypted }
	// errors 	[array]		--- array of error id
	// rsp		[object] 	--- expressjs response object
	function saveUser(user, errors, rsp){
		if(errors && errors.length > 0){
			rsp.json({'errors': errors, token: ''});
		}else{
			tm.hash(user.password, function(err, hash){
				if(hash){
					user.password = hash;
					_db.save('users', user, function(err, doc){
						if(err){
							rsp.json({'errors': errors, 'token':''});
						}else{
							var info = {'id': doc._id,'username': user.username, 'email':user.email};
							tm.signToken(info, function(token){
								rsp.json({'errors':errors, 'token': token, 'decoded': info });
							});
						}
					});
				}else{
					errors.push(Error.ENCRYPT_PASSWORD_EXCEPTION);
					rsp.json({'errors': errors, 'token': ''});
				}
			});
		}
	}
	
	return {
		//-------------------------------------------------------------------------
		// Arguments:
		// req --- http request object
		// rsp --- http response object
		//-------------------------------------------------------------------------
		renewToken: function(req, rsp){
			tm.renewToken(req, rsp, function(account, token){
				return rsp.json({success:true, 'token': token});
			});
		},
		
		getAccount: function( req, rsp ){
			tm.renewToken(req, rsp, function(account, token){
				return rsp.json({success:true, id:account.id, username: account.username, email: account.email, 'token': token});
			});
		},
		
		signup: function(req, rsp){
			var user = req.body;
			var dt = new Date();
			user['created'] = dt.toISOString();
			user.password = crypt.decrypt(user.password,'utf8');
			
			if(user.hasOwnProperty('_id')){ // For update
				_db.findOne('users', {_id: user._id}, function(err, doc){
					if(doc != null){
						validateSignup(user, function(errors){
							saveUser(user, errors, rsp);
						});
					}else{
						rsp.json({'errors': [Error.UPDATE_USER_EXCEPTION], 'token':''});
					}
				});
			}else{
				validateSignup(user, function(errors){
					saveUser(user, errors, rsp);
				});
			}
		},
		
		login: function(req, rsp){
			var credential = {account: req.body.account, password: crypt.decrypt(req.body.password,'utf8')};
			
			validateLoginAccount(credential, function(accountErrors, doc){
				if(accountErrors && accountErrors.length > 0){
					return rsp.json({'errors':accountErrors, 'token':'', 'decoded':''});
				}else{
					validateLoginPassword(credential, doc.password, function(passwordErrors){
						var errors = accountErrors.concat(passwordErrors);
						if(errors && errors.length > 0){
							return rsp.json({'errors':errors, 'token': '', 'decoded':''});
						}else{
							var user = { id: doc._id, username: doc.username, email: doc.email };
							tm.signToken(user, function(token){
								return rsp.json({'errors': errors, 'token': token, 'decoded': user});
							});
						}
					});	
				}
			});
		},
		// { success: false, message: 'Failed to authenticate token.' }
		checkToken: function(req, rsp){
			tm.checkToken(req, rsp, function(d){
				return rsp.json({'success':true, 'message':'successful'});
			});
		},
		logout: function(req, res){
			if(req.session!=undefined){
				req.session['logged in'] = false;
			}
			res.json({success:true});
		},

		getSessionID : function(req, res){
			res.json(req.sessionID);
		},

		getSession : function(req, res){
			if(req.session==undefined){
				res.json({active:false});
			}else{
				res.json({active:req.session['logged in']});				
			}
		},
		
		//-------------------------------------------------------------------------
		// forgetPassword
		// Arguments:
		// 	host 	 --- server address, use req.head.host
		// 	username --- username for sign up
		// 	email 	 --- email address for sign up
		// callback  --- func(errors, Error, doc)
		//-------------------------------------------------------------------------
		forgetPassword: function(host, username, email, callback){
			crypto.randomBytes(20, function(err, buf) {
		          var token = buf.toString('hex');
		          
		          userModel.findOne({'username':username, 'email': email}, function(err, doc){
		        	  if(!doc){
		        		  if(callback){
		        			  //Logger.log('forget password, username and email does not match.');
		        			  callback('The email does not match', null);
		        		  }
		        	  }else{
				          userModel.updateOne({'email': email}, {'$set':{'token': token}}, function(error, item){
				        	  if(error){
				        		  if(callback){
				        			  callback(error, item);
				        		  }
				        	  }else{		        	  
				        		  sendResetPasswordMail(host, email, token, function(error, err){
					        		  if(callback){
					        			  callback(error, item);
					        		  }
						          }); 
				        	  }
				          });
		        	  }
		          });
		      });
		},
		
		//-------------------------------------------------------------------------
		// verifyToken
		// Arguments:
		// host --- server address, use req.head.host
		// callback --- func(errors, Error, doc)
		//-------------------------------------------------------------------------
		verifyToken: function(token, callback){
			userModel.findOne({'token': token}, callback);
			//User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {});
		},
		
		//-------------------------------------------------------------------------
		// resetPassword
		// Arguments:
		// token --- 
		// password ---
		// callback --- func(error, doc)
		//-------------------------------------------------------------------------
		resetPassword: function(token, password, callback){
			userModel.encryptPassword(password, function(err, hash){
				if(err){
					if(callback){
						callback(err);
					}
				}else{
					userModel.updateOne({'token': token}, {'$set':{'password': hash}}, callback);
				}
			});
		}
	}
}

