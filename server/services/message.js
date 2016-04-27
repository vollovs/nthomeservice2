//----------------------------------------------------
// Author:	Martin.Zhang
// Date:  	August 13 2015
// All right reserved.
//----------------------------------------------------

'use strict';

var DB = require('../db.js');
var TokenMgr = require('./token');

module.exports = function(){
	
	var _db = DB();
	var _tm = TokenMgr();
	
	return {
		
		//--------------------------------------------------------------------------------------
		//	save() http post handler
		// 	If ip exist, increase count; if not exist, give position and count, then save
		//--------------------------------------------------------------------------------------
		save: function(req, rsp){
			var body = req.body;
			 _db.save('messages', body, function(err, doc){
				 return rsp.json({ success: true, message: doc});
			 });
		},
		
		//--------------------------------------------------------------------------------------
		// get
		// Arguments:
		// 		query --- query object, eg
		// 		callback --- function(err, docs)
		//--------------------------------------------------------------------------------------
		get: function(req, rsp){
			_tm.checkToken(req, rsp, function(d){
				if(d.username){
					if(req.body.query){
						_db.find('messages', req.body.query, function(err, docs){
							return rsp.json({ success: true, messages: docs});
						});
					}else{
						return rsp.json({success:false, messages:[]});
					}
				}else{
					return rsp.json({success:false, messages:[]});
				}
			})
		}
	}
}
