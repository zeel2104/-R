var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var productSchema = new Schema({
  name: { type: String, Required:  'Product name cannot be left blank.' },
  description: { type: String },
  quantity:    { type: String },
  price:    { type: String,     Required:  'Product price cannot be left blank.'},
  createdBY: { type: String }
});
module.exports = mongoose.model('Products', productSchema);