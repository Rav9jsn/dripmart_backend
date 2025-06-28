const path = require('path');
const ensurAuthentication = require('../../middleware/ensurAuthentication')
const isAdmin = require('../../middleware/isAdmin')
const addProductRoute = require('express').Router()
const addProductController = require(path.join(__dirname,'../../Controller/adminCintroller/addProductController'))



addProductRoute.post('/',ensurAuthentication, isAdmin,addProductController.addProduct)