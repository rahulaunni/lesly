var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var usrSchema = new Schema({
    id:Number,
    data: String,
    type:{type:String,default:'userneed'},
    date:Date,
    _project: {type: Schema.ObjectId, ref: 'Station' },
    _user:{ type: Schema.ObjectId, ref: 'User' },
    _admin:String,
    _di:[{ type: Schema.ObjectId, ref: 'Di' }],
    _dva:{ type: Schema.ObjectId, ref: 'Dva' }
});

module.exports = mongoose.model('Usr',usrSchema);
