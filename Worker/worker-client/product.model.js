//const mongoose =require('mongoose');
module.exports = function(mongoose) {
  const productSchema = new mongoose.Schema({
  name: {
    type: String
  },
  stock: {
    type: Number
  },
  price: {
    type: Number
  },
  id: {
    type: Number
  }
  });

   return mongoose.model('Products', productSchema,'mycollection');
}
