const express = require('express')
const  orderController = require('../Controller/orderController') 
const orderRouter = express.Router()
const ensurAuthentication = require("../middleware/ensurAuthentication");


orderRouter.post('/',ensurAuthentication,orderController.saveOrder)
orderRouter.get('/getOrder',ensurAuthentication,orderController.getOrder)

module.exports = orderRouter