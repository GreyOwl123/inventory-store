const Spice = require("../models/spice");
const { body, validationResult } = require("express-validator");
const async = require("async");

// Display list of all Spices.
exports.spice_list = function (req, res, next) {
  Spice.find()
    .exec(function (err, list_spices) {
      if (err) {
        return next(err);
      }
      // Successful, so render
      res.render("spice_list", {
        title: "Spice List",
        spice_list: list_spices,
      });
    });
};


// Display detail page for a specific Spice.
exports.spice_detail = (req, res, next) => {
  async.parallel(
    {
      spice(callback) {
        Spice.findById(req.params.id).exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        // Error in API usage.
        return next(err);
      }
      if (results.spice == null) {
        // No results.
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("spice_detail", {
        title: "Item Detail",
        spice: results.spice
      });
    }
  );
};


// Display Spice create form on GET.
exports.spice_create_get = (req, res, next) => {
  res.render("spice_form", { title: "Create Item" });
};

// Handle Spice create on POST.
exports.spice_create_post = [
  // Validate and sanitize the name field.
  body("name", "Spice name required")
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

    // Create a spice object with escaped and trimmed data.
    const spice = new Spice({ 
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("spice_form", {
        title: "Create Spice",
        spice,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Spice with same name already exists.
      Spice.findOne({ name: req.body.name }).exec((err, found_spice) => {
        if (err) {
          return next(err);
        }

        if (found_spice) {
          // Spice exists, redirect to its detail page.
          res.redirect(found_spice.url);
        } else {
          spice.save((err) => {
            if (err) {
              return next(err);
            }
            // Sspice saved. Redirect to spice detail page.
            res.redirect(spice.url);
          });
        }
      });
    }
  },
];


// Display Spice delete form on GET.
exports.spice_delete_get = (req, res, next) => {
  async.parallel(
    {
      spice(callback) {
        Spice.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.spice == null) {
        // No results.
        res.redirect("/catalog/spices");
      }
      // Successful, so render.
      res.render("spice_delete", {
        title: "Delete Spice",
        spice: results.spice,
      });
    }
  );
};


// Handle Spice delete on POST.
exports.spice_delete_post = (req, res, next) => {
  async.parallel(
    {
      spice(callback) {
        Spice.findById(req.body.spiceid).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success
      if (results.spice.length > 0) {
        // Item exists. Render as the same way as in GET.
        res.render("spice_delete", {
          title: "Delete Spice",
          spice: results.spice,
        });
        return;
      }
      // Delete Item and redirect to item list.
      Spice.findByIdAndRemove(req.body.spiceid, (err) => {
        if (err) {
          return next(err);
        }
        // Success.
        res.redirect("/catalog/spices");
      });
    }
  );
};

// Display Spice update form on GET.
exports.spice_update_get = (req, res, next) => {
  async.parallel(
    {
      spice(callback) {
        Spice.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.spice == null) {
        // No results.
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      // Success.
      res.render("spice_form", {
        title: "Update Spice",
        spice: results.spice,
      });
    }
  );
};


// Handle Spice update on POST.
exports.spice_update_post = [

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
    const spice = new Spice({
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
          spice(callback) {
            Spice.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          res.render("spice_form", {
            title: "Update Spice",
            spice: results.spice,
            spice,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Update the record.
    Spice.findByIdAndUpdate(req.params.id, spice, {}, (err, thespice) => {
      if (err) {
        return next(err);
      }

      // Successful: redirect to spice detail page.
      res.redirect(thespice.url);
    });
  },
];

