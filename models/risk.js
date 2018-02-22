var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var riskSchema = new Schema({
    id:Number,
    data: String,
    date:Date,
    type:{type:String,default:'risk'},
    _project: {type: Schema.ObjectId, ref: 'Station' },
    _user:{ type: Schema.ObjectId, ref: 'User' },
    _admin:String,
    _di:{ type: Schema.ObjectId, ref: 'di' },
    _dva:{ type: Schema.ObjectId, ref: 'dva' },
});

module.exports = mongoose.model('Risk',riskSchema);
