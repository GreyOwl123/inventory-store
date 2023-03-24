const express = require('express')
const router = express.Router()

// Require controller modules.
const fruit_controller = require('../controllers/fruitController')
const liquid_controller = require('../controllers/liquidController')
const solid_controller = require('../controllers/solidController')
const spice_controller = require('../controllers/spiceController')

/// FRUIT ROUTES ///

// GET catalog home page.
router.get('/', fruit_controller.index)

// GET request for creating a Fruit. NOTE This must come before routes that display Fruit (uses id).
router.get('/fruit/create', fruit_controller.fruit_create_get)

// POST request for creating Fruit.
router.post('/fruit/create', fruit_controller.fruit_create_post)

// GET request to delete Fruit.
router.get('/fruit/:id/delete', fruit_controller.fruit_delete_get)

// POST request to delete Fruit.
router.post('/fruit/:id/delete', fruit_controller.fruit_delete_post)

// GET request to update Fruit.
router.get('/fruit/:id/update', fruit_controller.fruit_update_get)

// POST request to update Fruit.
router.post('/fruit/:id/update', fruit_controller.fruit_update_post)

// GET request for one Fruit.
router.get('/fruit/:id', fruit_controller.fruit_detail)

// GET request for list of all Fruit items.
router.get('/fruits', fruit_controller.fruit_list)

/// Liquid ROUTES ///

// GET request for creating Liquid. NOTE This must come before route for id (i.e. display liquid).
router.get('/liquid/create', liquid_controller.liquid_create_get)

// POST request for creating Liquid.
router.post('/liquid/create', liquid_controller.liquid_create_post)

// GET request to delete Liquid.
router.get('/liquid/:id/delete', liquid_controller.liquid_delete_get)

// POST request to delete Liquid.
router.post('/liquid/:id/delete', liquid_controller.liquid_delete_post)

// GET request to update Liquid.
router.get('/liquid/:id/update', liquid_controller.liquid_update_get)

// POST request to update Liquid.
router.post('/liquid/:id/update', liquid_controller.liquid_update_post)

// GET request for one Liquid.
router.get('/liquid/:id', liquid_controller.liquid_detail)

// GET request for list of all Liquids.
router.get('/liquids', liquid_controller.liquid_list)

/// SOLID ROUTES ///

// GET request for creating a Solid. NOTE This must come before route that displays Solid (uses id).
router.get('/solid/create', solid_controller.solid_create_get)

// POST request for creating Solid.
router.post('/solid/create', solid_controller.solid_create_post)

// GET request to delete Solid.
router.get('/solid/:id/delete', solid_controller.solid_delete_get)

// POST request to delete Solid.
router.post('/solid/:id/delete', solid_controller.solid_delete_post)

// GET request to update Solid.
router.get('/solid/:id/update', solid_controller.solid_update_get)

// POST request to update Solid.
router.post('/solid/:id/update', solid_controller.solid_update_post)

// GET request for one Solid.
router.get('/solid/:id', solid_controller.solid_detail)

// GET request for list of all Solid.
router.get('/solids', solid_controller.solid_list)

/// Spice ROUTES ///

// GET request for creating a Spice . NOTE This must come before route that displays Spice (uses id).
router.get(
  '/spice/create', spice_controller.spice_create_get
)

// POST request for creating Spice.
router.post(
  '/spice/create', spice_controller.spice_create_post
)

// GET request to delete Spice.
router.get(
  '/spice/:id/delete', spice_controller.spice_delete_get
)

// POST request to delete Spice.
router.post(
  '/spice/:id/delete', spice_controller.spice_delete_post
)

// GET request to update Spice.
router.get(
  '/spice/:id/update', spice_controller.spice_update_get
)

// POST request to update Spice.
router.post(
  '/spice/:id/update', spice_controller.spice_update_post
)

// GET request for one Spice.
router.get('/spice/:id', spice_controller.spice_detail)

// GET request for list of all Spice.
router.get('/spices', spice_controller.spice_list)

module.exports = router
