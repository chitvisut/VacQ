const express = require("express");
const {getHospitals, getHospital, createHospital, updateHospital, deleteHospital, getVacCenters} = require("../controllers/hospital.js");
const {protect, authorize} = require("../middleware/auth");
const appointmentRouter = require("./appointments")

/**
 * @swagger
 * components:
 *  schemas:
 *      Hospitals:
 *          type: object
 *          required:
 *              - name
 *              - address
 *          properties:
 *              id:
 *                  type: string
 *                  format: uuid
 *                  description: The auto-generated id of the hospital
 *                  example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *              name:
 *                  type: string
 *                  description: Hospital name
 *              address:
 *                  type: string
 *                  description: House No., Street, Road
 *              district:
 *                  type: string
 *                  description: District
 *              province:
 *                  type: string
 *                  description: province
 *              postalcode:
 *                  type: string
 *                  description: 5-digit postal code
 *              tel:
 *                  type: string
 *                  description: telephone number
 *              region:
 *                  type: string
 *                  description: region
 *          example:
 *              id: d290f1ee-6c54-4b01-90e6-d701748f0851
 *              name: Happy Hospital
 *              address: 121 ถ.สุขุมวิทย์
 *              district: บางนา
 *              province: กรุงเทพมหานคร
 *              postalcode: 10110
 *              tel: 02-2187000
 *              region: กรุงเทพมหานคร
 */

/**
 * @swagger
 * tags:
 *  name: Hospital
 *  description: The hospitals managing API
 */

/**
 * @swagger
 * /hospitals:
 *  get:
 *      summary: Return the list of all the hospitals
 *      tags: [Hospitals]
 *      responses:
 *          200:
 *              description: The list of the hospitals
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: "#/components/schemas/Hospitals"
 */

/**
 * @swagger
 * /hospitals/{id}:
 *  get:
 *      summary: Get the hospital by id
 *      tags: [Hospitals]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The hospital id
 *      responses:
 *          200:
 *              description: The hospital description by id
 *              contents:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Hospitals"
 *          400:
 *              description: The hospital was not found
 */

/**
 * @swagger
 * /hospitals:
 *  post:
 *      summary: Create a new hospital
 *      tags: [Hospitals]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Hospitals"
 *  responses:
 *      201:
 *          description: The hospital was successfully created
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Hospitals"
 *      500:
 *          description: Some server error
 */

/**
 * @swagger
 * /hospitals/{id}:
 *  put:
 *      summary: Update the hospital by the id
 *      tags: [Hospitals]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The hospital id
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Hospitals"
 *      responses:
 *          200:
 *              description: The hospital was updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Hospitals"
 *          404:
 *              description: The hospital was not found
 *          500:
 *              description: Some error happend
 */

/**
 * @swagger
 * /hospitals/{id}:
 *  delete:
 *      summary: Remove the hospital by id
 *      tags: [Hospitals]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: the hospital id
 *      responses:
 *          200:
 *              description: The hospital was delete    
 *          400:
 *              description: The hospital was not found
 */

const router = express.Router()

// router.get('/', (req,res) => {
//     res.status(200).json({success: true, msg: "Show all hospitals"});
// });

// router.get('/:id', (req,res) => {
//     res.status(200).json({success: true, msg: `Show hospital ${req.params.id}`});
// });

// router.post('/hospitals', (req,res) => {
//     res.status(200).json({success: true, msg: "Create new hospitals"});
// });

// router.put('/:id', (req,res) => {
//     res.status(200).json({success: true, msg: `Update hospital ${req.params.id}`});
// });

// router.delete('/:id', (req,res) => {
//     res.status(200).json({success: true, msg: `Delete hospital ${req.params.id}`});
// });

router.use("/:hospitalId/appointments", appointmentRouter)

router.route("/vacCenters").get(getVacCenters);
router.route("/").get(getHospitals).post(protect, authorize("admin"), createHospital);
router.route("/:id").get(getHospital).put(protect, authorize("admin"), updateHospital).delete(protect, authorize("admin"), deleteHospital)

module.exports = router; //export module for server.js to use 