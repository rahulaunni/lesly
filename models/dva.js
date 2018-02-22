var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var dvaSchema = new Schema({
    id:Number,
    data: String,
    type:{type:String,default:'dva'},
    date:Date,
    _project: {type: Schema.ObjectId, ref: 'Station' },
    _user:{ type: Schema.ObjectId, ref: 'User' },
    _admin:String,
    _usr:{ type: Schema.ObjectId, ref: 'Usr' },
});

module.exports = mongoose.model('Dva',dvaSchema);
