const Spice = require("../models/spice");

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
exports.spice_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Author detail: ${req.params.id}`);
};

// Display Spice create form on GET.
exports.spice_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author create GET");
};

// Handle Spice create on POST.
exports.spice_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author create POST");
};

// Display Spice delete form on GET.
exports.spice_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author delete GET");
};

// Handle Spice delete on POST.
exports.spice_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author delete POST");
};

// Display Spice update form on GET.
exports.spice_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update GET");
};

// Handle Spice update on POST.
exports.spice_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update POST");
};
