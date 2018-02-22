var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var diSchema = new Schema({
    id:Number,
    data: String,
    date:Date,
    from:String,
    _project: {type: Schema.ObjectId, ref: 'Station' },
    _user:{ type: Schema.ObjectId, ref: 'User' },
    _admin:String,
    _usr:{ type: Schema.ObjectId, ref: 'Usr' },
    _dev:{ type: Schema.ObjectId, ref: 'Dev' },
    _risk:{ type: Schema.ObjectId, ref: 'Risk' },
    _do:{ type: Schema.ObjectId, ref: 'Do' }
});

module.exports = mongoose.model('Di',diSchema);
