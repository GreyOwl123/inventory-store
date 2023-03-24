const Solid = require("../models/solid");

// Display list of all Solids.
exports.solid_list = function (req, res, next) {
  Solid.find()
    .exec(function (err, list_solids) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("solid_list", { title: "Solid List", solid_list: list_solids });
    });
};


// Display detail page for a specific Solid.
exports.solid_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Author detail: ${req.params.id}`);
};

// Display Solid create form on GET.
exports.solid_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author create GET");
};

// Handle Solid create on POST.
exports.solid_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author create POST");
};

// Display Solid delete form on GET.
exports.solid_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author delete GET");
};

// Handle Solid delete on POST.
exports.solid_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author delete POST");
};

// Display Solid update form on GET.
exports.solid_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update GET");
};

// Handle Solid update on POST.
exports.solid_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update POST");
};
