//------------------------------------------------------
// Author: zlkca
// Date: Oct 8 2015
// License: MIT
//------------------------------------------------------

'use strict'

module.exports = {
	port:5003,
	dbHost: 'localhost',
	dbName: 'nthomeservice',
	dbPort: '27017',
	apiUrl: '/api',
	sessionPrefix: 'nthomeservice',
	sendgrid:{
		username:'myusername',
		password:'mypassword'
	},
	passResetEmail: 'MyPasswordService@MyDomain.com',
	jwt:{
		secret: 'myusername_hmacsha256',
		algorithm: 'HS256',
		expiresInSeconds: 1800
	},
	privateKeyPath: './rsa_1024_priv.pem'
}
