// Display Home Page.
const Fruit = require("../models/fruit");
const Liquid = require("../models/liquid");
const Solid = require("../models/solid");
const Spice = require("../models/spice");

const { body, validationResult } = require("express-validator");
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
      res.render("fruit_list", {
         title: "Fruit List",
         fruit_list: list_fruits
       });
    });
};

// Display detail page for a specific Fruit.
exports.fruit_detail = (req, res, next) => {
  async.parallel(
    {
      fruit(callback) {
        Fruit.findById(req.params.id).exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        // Error in API usage.
        return next(err);
      }
      if (results.fruit == null) {
        // No results.
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("fruit_detail", {
        title: "Item Detail",
        fruit: results.fruit
      });
    }
  );
};



// Display Fruit create form on GET.
exports.fruit_create_get = (req, res) => {
  res.render("fruit_form", { title: "Create Item" });
};

// Handle Fruit create on POST.
exports.fruit_create_post = [
  // Validate and sanitize the name field.
  body("name", "Fruit name required")
      .trim()
      .isLength({ min: 1 })
      .escape(),
  body("description", "Description must not be empty")
      .trim()
      .isLength({ min: 1 })
      .escape(),
  body("price", "Price must not be empty")
      .trim()
      .isLength({ min: 1 })
      .escape(),
  body("number_in_stock", "Number_In_Stock must not be empty")
      .trim()
      .isLength({ min: 1 })
      .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a fruit object with escaped and trimmed data.
    const fruit = new Fruit({ 
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("fruit_form", {
        title: "Create Fruit",
        fruit,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Fruit with same name already exists.
      Fruit.findOne({ name: req.body.name }).exec((err, found_fruit) => {
        if (err) {
          return next(err);
        }

        if (found_fruit) {
          // Fruit exists, redirect to its detail page.
          res.redirect(found_fruit.url);
        } else {
          fruit.save((err) => {
            if (err) {
              return next(err);
            }
            // Fruit saved. Redirect to liquid detail page.
            res.redirect(fruit.url);
          });
        }
      });
    }
  },
];


// Display Fruit delete form on GET.
exports.fruit_delete_get = (req, res, next) => {
  async.parallel(
    {
      fruit(callback) {
        Fruit.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.fruit == null) {
        // No results.
        res.redirect("/catalog/fruits");
      }
      // Successful, so render.
      res.render("fruit_delete", {
        title: "Delete Fruit",
        fruit: results.fruit,
      });
    }
  );
};


// Handle Fruit delete on POST.
exports.fruit_delete_post = (req, res, next) => {
  async.parallel(
    {
      fruit(callback) {
        Fruit.find(req.body.fruit).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success
      if (results.fruit.length > 0) {
        // Item exists. Render the same way as in GET.
        res.render("fruit_delete", {
          title: "Delete Item",
          fruit: results.fruit,
        });
        return;
      }
      // Delete Item and redirect to item list.
      Fruit.findByIdAndRemove(req.body.fruitid, (err) => {
        if (err) {
          return next(err);
        }
        // Success.
        res.redirect("/catalog/fruits");
      });
    }
  );
};

// Display Fruit update form on GET.
exports.fruit_update_get = (req, res, next) => {
  async.parallel(
    {
      fruit(callback) {
        Fruit.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.fruit == null) {
        // No results.
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      // Success.
      res.render("fruit_form", {
        title: "Update Fruit",
        fruit: results.fruit,
      });
    }
  );
};

// Handle Fruit update on POST.
exports.fruit_update_post = [

  // Validate and sanitize fields.
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("number_in_stock", "Number_In_Stock must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Fruit object with escaped/trimmed data and old id.
    const fruit = new Fruit({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      _id: req.params.id, //This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get item for form.
      async.parallel(
        {
          fruit(callback) {
            Fruit.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          res.render("fruit_form", {
            title: "Update Fruit",
            fruit: results.fruit,
            fruit,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Update the record.
    Fruit.findByIdAndUpdate(req.params.id, fruit, {}, (err, thefruit) => {
      if (err) {
        return next(err);
      }

      // Successful: redirect to fruit detail page.
      res.redirect(thefruit.url);
    });
  },
];
