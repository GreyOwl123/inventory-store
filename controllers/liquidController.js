const Liquid = require("../models/liquid");

// Display list of all Liquids.
exports.liquid_list = function (req, res, next) {
  Liquid.find()
    .exec(function (err, list_liquids) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("liquid_list", { title: "Liquid List", liquid_list: list_liquids });
    });
};


// Display detail page for a specific Liquid.
exports.liquid_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Author detail: ${req.params.id}`);
};

// Display Liquid create form on GET.
exports.liquid_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author create GET");
};

// Handle Liquid create on POST.
exports.liquid_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author create POST");
};

// Display Liquid delete form on GET.
exports.liquid_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author delete GET");
};

// Handle Liquid delete on POST.
exports.liquid_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author delete POST");
};

// Display Liquid update form on GET.
exports.liquid_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update GET");
};

// Handle Liquid update on POST.
exports.liquid_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update POST");
};
