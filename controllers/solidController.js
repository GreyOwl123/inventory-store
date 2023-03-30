const Solid = require("../models/solid");
const async = require("async");
const { body, validationResult } = require("express-validator");

// Display list of all Solids.
exports.solid_list = function (req, res, next) {
  Solid.find()
    .exec(function (err, list_solids) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("solid_list", {
         title: "Solid List",
         solid_list: list_solids });
    });
};

// Display detail page for a specific Solid.
exports.solid_detail = (req, res, next) => {
  async.parallel(
    {
      solid(callback) {
        Solid.findById(req.params.id).exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        // Error in API usage.
        return next(err);
      }
      if (results.solid == null) {
        // No results.
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("solid_detail", {
        title: "Item Detail",
        solid: results.solid
      });
    }
  );
};

// Display Solid create form on GET.
exports.solid_create_get = (req, res, next) => {
  res.render("solid_form", { title: "Create Item" });
};

// Handle Solid create on POST.
exports.solid_create_post = [
  // Validate and sanitize the name field.
  body("name", "Solid name required")
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

    // Create a solid object with escaped and trimmed data.
    const solid = new Solid({ 
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("solid_form", {
        title: "Create Solid",
        solid,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Solid with same name already exists.
      Solid.findOne({ name: req.body.name }).exec((err, found_solid) => {
        if (err) {
          return next(err);
        }

        if (found_solid) {
          // Solid exists, redirect to its detail page.
          res.redirect(found_solid.url);
        } else {
          solid.save((err) => {
            if (err) {
              return next(err);
            }
            // Solid saved. Redirect to solid detail page.
            res.redirect(solid.url);
          });
        }
      });
    }
  },
];


// Display Solid delete form on GET.
exports.solid_delete_get = (req, res, next) => {
  async.parallel(
    {
      solid(callback) {
        Solid.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.solid == null) {
        // No results.
        res.redirect("/catalog/solids");
      }
      // Successful, so render.
      res.render("solid_delete", {
        title: "Delete Solid",
        solid: results.solid,
      });
    }
  );
};


// Handle Solid delete on POST.
exports.solid_delete_post = (req, res, next) => {
  async.parallel(
    {
      solid(callback) {
        Solid.findById(req.body.solidid).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success
      if (results.solid.length > 0) {
        // Item exists. Render as the same way as in GET.
        res.render("solid_delete", {
          title: "Delete Solid",
          solid: results.solid,
        });
        return;
      }
      // Delete Item and redirect to item list.
      Solid.findByIdAndRemove(req.body.solidid, (err) => {
        if (err) {
          return next(err);
        }
        // Success.
        res.redirect("/catalog/solids");
      });
    }
  );
};

// Display Solid update form on GET.
exports.solid_update_get = (req, res, next) => {
  async.parallel(
    {
      solid(callback) {
        Solid.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.solid == null) {
        // No results.
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      // Success.
      res.render("solid_form", {
        title: "Update Solid",
        solid: results.solid,
      });
    }
  );
};

// Handle Solid update on POST.
exports.solid_update_post = [

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

    // Create a Solid object with escaped/trimmed data and old id.
    const solid = new Solid({
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
          solid(callback) {
            Solid.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          res.render("solid_form", {
            title: "Update Solid",
            solid: results.solid,
            solid,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Update the record.
    Solid.findByIdAndUpdate(req.params.id, solid, {}, (err, thesolid) => {
      if (err) {
        return next(err);
      }

      // Successful: redirect to solid detail page.
      res.redirect(thesolid.url);
    });
  },
];

