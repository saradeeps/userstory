var mongoose = require('mongoose');
var bcyrpt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var UserSchema = new Schema({

	name:String,
	username:{type:String,required:true,index:{unique:true}},
	password:{type:String,required:true,select:false}
});

UserSchema.pre('save',function(next){
	var user =this;
	if(!user.isModified('password')) return next();

	bcyrpt.hash(user.password,null,null,function(err,hash){

		if(err)return next(err);
		user.password = hash;
		next();
	});

});

UserSchema.methods.comparePassword = function(password){

	var user=  this;
	return bcyrpt.compareSync(password,user.password);
};

module.exports = mongoose.model('User',UserSchema);