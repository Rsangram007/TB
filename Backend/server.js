require('dotenv').config()
const express=require('express')
const cors=require('cors')
const { checkSchema }=require('express-validator')
const configureDB=require('./config/db')
const path = require('path');

configureDB()
const app=express()
const port =5050 
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const adminRegisterValidationSchema = require('./app/validations/admin-register-validations')
const adminCltr=require('./app/controllers/admin-cltr')
const adminLoginValidationSchema = require('./app/validations/admin-login-validation')
const authenticateUser=require('./app/middlewares/authenticateUser')
const authorizeUser=require('./app/middlewares/authorizeUser')
const categoryCltr = require('./app/controllers/category-cltr')
const categoryCreateValidation = require('./app/validations/category-create-validations')
const upload=require('./app/middlewares/multerConfig')
const categoryUpdateValidation = require('./app/validations/category-update-validations')
const subCategoryCreateValidation = require('./app/validations/subcategory-create-validations')
const subcategoryCltr = require('./app/controllers/subcategory-cltr')
const subCategoryUpdateValidation = require('./app/validations/subcategory-update-validations')
const productCreateValidation = require('./app/validations/product-create-validations')
const productCltr = require('./app/controllers/product-cltr')
const productUpdateValidation = require('./app/validations/product-update-validations')
const {forgotEmailValidationSchema,otpValidationSchema}=require('./app/validations/forgot-reset-validations')

app.post('/register',checkSchema(adminRegisterValidationSchema),adminCltr.register)
app.post('/login',checkSchema(adminLoginValidationSchema),adminCltr.login)
app.get('/account',authenticateUser,authorizeUser(['admin']),adminCltr.account)
app.get('/checkemail',adminCltr.checkEmail)
//category
app.get('/category',authenticateUser,authorizeUser(['admin']),categoryCltr.allCategories)
app.get('/category/:id',authenticateUser,authorizeUser(['admin']),categoryCltr.singleCategory)
app.post('/category',authenticateUser,authorizeUser(['admin']),upload.single('image'),checkSchema(categoryCreateValidation),categoryCltr.create)
app.put('/category/:id',authenticateUser,authorizeUser(['admin']),upload.single('image'),checkSchema(categoryUpdateValidation),categoryCltr.update)
app.delete('/category/:id',authenticateUser,authorizeUser(['admin']),categoryCltr.delete)

//subcategory
app.get('/sub-category',authenticateUser,authorizeUser(['admin']),subcategoryCltr.allSubCategories)
app.get('/sub-category/:id',authenticateUser,authorizeUser(['admin']),subcategoryCltr.singlesubCategory)
app.post('/sub-category',authenticateUser,authorizeUser(['admin']),upload.single('image'),checkSchema(subCategoryCreateValidation),subcategoryCltr.create)
app.put('/sub-category/:id',authenticateUser,authorizeUser(['admin']),upload.single('image'),checkSchema(subCategoryUpdateValidation),subcategoryCltr.update)
app.delete('/sub-category/:id',authenticateUser,authorizeUser(['admin']),subcategoryCltr.delete)



//product 
app.get('/product/:id',authenticateUser,authorizeUser(['admin']),productCltr.singleProduct)
app.post('/product',authenticateUser,authorizeUser(['admin']),upload.single('image'),checkSchema(productCreateValidation),productCltr.create)
app.put('/product/:id',authenticateUser,authorizeUser(['admin']),upload.single('image'),checkSchema(productUpdateValidation),productCltr.update)
app.delete('/product/:id',authenticateUser,authorizeUser(['admin']),productCltr.delete)
app.get('/product',authenticateUser,authorizeUser(['admin']),productCltr.allProducts)

//forgot and reset
app.post('/forgot-password',checkSchema(forgotEmailValidationSchema),adminCltr.forgotPassword)
app.post('/reset-password',checkSchema(otpValidationSchema),adminCltr.resetPassword)

app.listen(port,()=>{
    console.log(`server connected to ${port}`)
})