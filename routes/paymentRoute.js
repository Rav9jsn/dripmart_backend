const express = require('express')
const  paymentController = require('../Controller/paymentController') 
const paymentRouter = express.Router()
const ensurAuthentication = require("../middleware/ensurAuthentication");


paymentRouter.post('/',ensurAuthentication,paymentController.checkout)
paymentRouter.get('/getKey',ensurAuthentication,paymentController.getKey)
paymentRouter.post('/paymentverification',paymentController.paymentverify)

module.exports = paymentRouter