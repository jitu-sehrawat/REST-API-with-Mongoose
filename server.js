const express = require('express') 
const morgan = require('morgan')
const bodyParser = require('body-parser')
const errorhandler = require('errorhandler')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/edx-course-db')
  
let app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())

const Account = mongoose.model('Account', {
  name: String,
  balance: Number
})

app.get('/accounts', (req, res, next) => {
  Account.find({}, (error, accounts) => {
    if (error) return next(error)
    res.send(accounts)
  })
})
/*
app.param('id', (req, res, next) => { // OPTIONALLY: you can use middleware to fetch account object
  Account.findById(req.params.id, (error, account) => {
    req.account = account
    next()
  })
})
*/
app.get('/accounts/:id', (req, res, next) => {
  Account.findById(req.params.id, (error, account) => {
    if (error) return next(error)
    res.send(account.toJSON())
  })
})

app.post('/accounts', (req, res, next) => {
  let newAccount = new Account({
    name: req.body.name,
    balance: req.body.balance
  })
  newAccount.save((error, results) => {
    if (error) return next(error)
    res.send(results)
  })
})

app.put('/accounts/:id', (req, res, next) => {
  console.log(req.params.id)
  Account.findById(req.params.id, (error, account) => {
    if (error) return next(error)
    else {
    console.log(account)
      if(req.body.name) account.name = req.body.name;
      if(req.body.balance) account.balance = req.body.balance;
      account.save((error, results) => {
        res.send(results)
      }) 
    }    
  })
})

app.delete('/accounts/:id', (req, res, next) => {
  Account.findById(req.params.id, (error, account) => {
    if (error) return next(error)
    account.remove((error, results) => {
      if (error) return next(error)
      res.send(results)
    })
  })
})

app.use(errorhandler())

app.listen(3000, () => {
  console.log('server listening at 127.0.0.1:3000')
})
