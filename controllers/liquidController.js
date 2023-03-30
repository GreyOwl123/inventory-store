const { body, validationResult } = require("express-validator");

const Liquid = require("../models/liquid");
const async = require("async");


// Display list of all Liquids.
exports.liquid_list = function (req, res, next) {
  Liquid.find()
    .exec(function (err, list_liquids) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("liquid_list", {
        title: "Liquid List",
        liquid_list: list_liquids
       });
    });
};

// Display detail page for a specific Liquid.
exports.liquid_detail = (req, res, next) => {
  async.parallel(
    {
      liquid(callback) {
        Liquid.findById(req.params.id).exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        // Error in API usage.
        return next(err);
      }
      if (results.liquid == null) {
        // No results.
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("liquid_detail", {
        title: "Item Detail",
        liquid: results.liquid
      });
    }
  );
};


// Display Liquid create form on GET.
exports.liquid_create_get = (req, res) => {
  res.render("liquid_form", { title: "Create Item" });
};

// Handle Liquid create on POST.
exports.liquid_create_post = [
  // Validate and sanitize the name field.
  body("name", "Liquid name required")
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

    // Create a liquid object with escaped and trimmed data.
    const liquid = new Liquid({ 
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("liquid_form", {
        title: "Create Liquid",
        liquid,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Liquid with same name already exists.
      Liquid.findOne({ name: req.body.name }).exec((err, found_liquid) => {
        if (err) {
          return next(err);
        }

        if (found_liquid) {
          // Liquid exists, redirect to its detail page.
          res.redirect(found_liquid.url);
        } else {
          liquid.save((err) => {
            if (err) {
              return next(err);
            }
            // Liquid saved. Redirect to liquid detail page.
            res.redirect(liquid.url);
          });
        }
      });
    }
  },
];


// Display Liquid delete form on GET.
exports.liquid_delete_get = (req, res, next) => {
  async.parallel(
    {
      liquid(callback) {
        Liquid.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.liquid == null) {
        // No results.
        res.redirect("/catalog/liquids");
      }
      // Successful, so render.
      res.render("liquid_delete", {
        title: "Delete Liquid",
        liquid: results.liquid,
      });
    }
  );
};


// Handle Liquid delete on POST.
exports.liquid_delete_post = (req, res, next) => {
  async.parallel(
    {
      liquid(callback) {
        Liquid.findById(req.body.liquidid).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success
      if (results.liquid.length > 0) {
        // Item exists. Render as the same way as in GET.
        res.render("liquid_delete", {
          title: "Delete Liquid",
          liquid: results.liquid,
        });
        return;
      }
      // Delete Item and redirect to item list.
      Liquid.findByIdAndRemove(req.body.liquidid, (err) => {
        if (err) {
          return next(err);
        }
        // Success.
        res.redirect("/catalog/liquids");
      });
    }
  );
};


// Display Liquid update form on GET.
exports.liquid_update_get = (req, res, next) => {
  async.parallel(
    {
      liquid(callback) {
        Liquid.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.liquid == null) {
        // No results.
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      // Success.
      res.render("liquid_form", {
        title: "Update Liquid",
        liquid: results.liquid,
      });
    }
  );
};

// Handle Liquid update on POST.
exports.liquid_update_post = [

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

    // Create a Liquid object with escaped/trimmed data and old id.
    const liquid = new Liquid({
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
          liquid(callback) {
            Liquid.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          res.render("liquid_form", {
            title: "Update Liquid",
            liquid: results.liquid,
            liquid,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Update the record.
    Liquid.findByIdAndUpdate(req.params.id, liquid, {}, (err, theliquid) => {
      if (err) {
        return next(err);
      }

      // Successful: redirect to liquid detail page.
      res.redirect(theliquid.url);
    });
  },
];
