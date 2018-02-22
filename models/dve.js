var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var dveSchema = new Schema({
    id:Number,
    data: String,
    type:{type:String,default:'userneed'},
    date:Date,
    _project: {type: Schema.ObjectId, ref: 'Station' },
    _user:{ type: Schema.ObjectId, ref: 'User' },
    _admin:String,
    _di:{ type: Schema.ObjectId, ref: 'Di' },
});

module.exports = mongoose.model('Dve',dveSchema);
