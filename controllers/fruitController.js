// Display Home Page.
const Fruit = require("../models/fruit");
const Liquid = require("../models/liquid");
const Solid = require("../models/solid");
const Spice = require("../models/spice");

const async = require("async");

exports.index = (req, res) => {
  async.parallel(
    {
      fruit_count(callback) {
        Fruit.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      spice_count(callback) {
        Spice.countDocuments({}, callback);
      },
      liquid_count(callback) {
        Liquid.countDocuments({}, callback);
      },
      solid_count(callback) {
        Solid.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render("index", {
        title: "Store Inventory Home",
        error: err,
        data: results,
      });
    }
  );
};


// Display list of all Fruits.
exports.fruit_list = function (req, res, next) {
  Fruit.find()
    .exec(function (err, list_fruits) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("fruit_list", { title: "Fruit List", fruit_list: list_fruits });
    });
};

// Display detail page for a specific Fruit.
exports.fruit_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Author detail: ${req.params.id}`);
};

// Display Fruit create form on GET.
exports.fruit_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author create GET");
};

// Handle Fruit create on POST.
exports.fruit_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author create POST");
};

// Display Fruit delete form on GET.
exports.fruit_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author delete GET");
};

// Handle Fruit delete on POST.
exports.fruit_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author delete POST");
};

// Display Fruit update form on GET.
exports.fruit_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update GET");
};

// Handle Fruit update on POST.
exports.fruit_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update POST");
};
