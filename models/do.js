var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var doSchema = new Schema({
    id:Number,
    data: String,
    date:Date,
    system:String,
    from:String,
    _project: {type: Schema.ObjectId, ref: 'Station' },
    _user:{ type: Schema.ObjectId, ref: 'User' },
    _admin:String,
    _di:{ type: Schema.ObjectId, ref: 'Di' },
});

module.exports = mongoose.model('Do',doSchema);
