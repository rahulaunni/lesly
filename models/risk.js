var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var riskSchema = new Schema({
    id:Number,
    system: String,
    data: String,
    cause: String,
    severity:Number,
    probability:Number,
    riskindex:String,
    riskcontrol:String,
    date:Date,
    type:{type:String,default:'risk'},
    _project: {type: Schema.ObjectId, ref: 'Station' },
    _user:{ type: Schema.ObjectId, ref: 'User' },
    _admin:String,
    _di:{ type: Schema.ObjectId, ref: 'Di' },
    _dva:{ type: Schema.ObjectId, ref: 'Dva' },
});

module.exports = mongoose.model('Risk',riskSchema);
