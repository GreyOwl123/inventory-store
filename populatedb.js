#! /usr/bin/env node

console.log('This script populates some test items to your database. Specified database as argument - e. node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.ybaz7vs.mongodb.net/inventory_store?retryWrites=true&w=majority"');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const async = require('async')
const Fruit = require('./models/fruit')
const Liquid = require('./models/liquid')
const Solid = require('./models/solid')
const Spice = require('./models/spice')


const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const fruits = []
const liquids = []
const solids = []
const spices = []

function fruitCreate(name, description, price, number_in_stock, cb) {
    fruitdetail = {
      name: name,
      description: description,
      price: price,
      number_in_stock: number_in_stock,
    }

  const fruit = new Fruit(fruitdetail);

  fruit.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Fruit: ' + fruit);
    fruits.push(fruit)
    cb(null, fruit)
  }  );
}

function liquidCreate(name, description, price, number_in_stock, cb) {
   liquiddetail = {
    name: name,
    description: description,
    price: price,
    number_in_stock: number_in_stock,
   }

  const liquid = new Liquid(liquiddetail);

  liquid.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Liquid: ' + liquid);
    liquids.push(liquid)
    cb(null, liquid);
  }   );
}

function solidCreate(name, description, price, number_in_stock, cb) {
  soliddetail = {
    name: name,
    description: description,
    price: price,
    number_in_stock: number_in_stock,
  }

  const solid = new Solid(soliddetail);
  solid.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Solid: ' + solid);
    solids.push(solid)
    cb(null, solid)
  }  );
}


function spiceCreate(name, description, price, number_in_stock, cb) {
  spicedetail = {
    name: name,
    description: description,
    price: price,
    number_in_stock: number_in_stock,
  }

  const spice = new Spice(spicedetail);
  spice.save(function (err) {
    if (err) {
      console.log('Spice: ' + spice);
      cb(err, null)
      return
    }
    console.log('New Spice: ' + spice);
    spices.push(spice)
    cb(null, spice)
  }  );
}


function createFruits(cb) {
    async.parallel([
        function(callback) {
          fruitCreate('Apple', 'A dozen or 10kg only.', 1.00, '25', callback);
        },
        function(callback) {
          fruitCreate('Orange', 'A dozen or 10kg only.', 1.00, '25', callback);
        },
        function(callback) {
          fruitCreate('Mango', 'A dozen or 10kg only.', 1.00, '25', callback);
        },
        function(callback) {
          fruitCreate('Cherry', 'A dozen or 10kg only.', 1.00, '25', callback);
        },
        ],
        // optional callback
        cb);
}


function createLiquids(cb) {
    async.parallel([
        function(callback) {
          liquidCreate('Water', 'In bottles of 75cl, 150cl or 5 litres. Free as in Free Speech.', 0.00, 'Always available.', callback);
        },
        function(callback) {
          liquidCreate("Lemonade", 'Home-made from fresh lemon and sugar, consume after opening. Comes in 50cl and 100cl bottles.', 2.00/4.00, '50cl - 25. 100cl - 15.', callback);
        },
        function(callback) {
          liquidCreate("Dry gin", 'Distilled alcohol. Best served chilled.', 2.00, '25', callback);
        },
        function(callback) {
          liquidCreate('Fruit Chapman. Berry Blast', 'Home-made from wild berries. Available in a 100cl bottle.', 5.00, '30', callback)
        }
        ],
        // optional callback
        cb);
}


function createSolids(cb) {
    async.parallel([
        function(callback) {
          solidCreate('Eggs', 'Poultry eggs. Available in crates of 30 eggs.', 10.00, '50 crates', callback)
        },
        function(callback) {
          solidCreate('Rice', 'Parboiled rice. Avalable in bags of 5kg.', 15.00, '40 bags', callback)
        },
        function(callback) {
          solidCreate('Spaghetti', 'Made from Durum. Available in packs of 500gms.', 8.00, '50 packs', callback)
        },
        function(callback) {
          solidCreate('Yam', 'Big Tubers of Yam. A tuber typically weighs between 7-15kg.', 10.00, 'Always available.', callback)
        }
        ],
        // Optional callback
        cb);
}


function createSpices(cb) {
  async.parallel([
      function(callback) {
        spiceCreate('Curry and Thyme mixture', 'A blend of curry powder and thyme leaves. In sachets of 20 grams.', 2.00, '50 sachets', callback)
      },
      function(callback) {
        spiceCreate('Ginger.', 'Dry Ginger. In packs of 5.', 1, '100 packs', callback)
      },
      function(callback) {
        spiceCreate('Red Pepper', 'Grounded dry pepper. In sachets of 50 grams.', 1, '50 sachets', callback)
      },
      function(callback) {
        spiceCreate('Garlic', 'White cloves of dry garlic. In packs of 12 cloves.', 1, '20 packs', callback)
      }
  ],
  // Optional callback
     cb);
}

async.series([
    createFruits,
    createLiquids,
    createSolids,
    createSpices,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('All done');

    }
    // All done, disconnect from database
    mongoose.connection.close();
});




