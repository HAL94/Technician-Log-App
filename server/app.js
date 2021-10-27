const path = require('path');
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

const checkAuth = require('./api/middleware/check-auth');

const devicesRoutes = require('./api/routes/devices');
const customersRoutes = require('./api/routes/customers');
const usersRoutes = require('./api/routes/users');
const techentryRoutes = require('./api/routes/tech-entries');
const dashboardRoutes = require('./api/routes/dashboard/dashboard');

mongoose.connect(process.env.DB_HOST,
 {useNewUrlParser: true}).then(
     () => {console.log('connected to mongodb atlas');},
     (error) => {console.log('connection to db failed', error)}
 );

mongoose.set('useCreateIndex', true);

app.use(express.urlencoded({extended: false}));
app.use(express.json());


// app.use(morgan('dev'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
  'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods',
    'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({ });
  }

  next();
})

app.use('/images', express.static(path.join(__dirname, "images")));
app.use('/', express.static(path.join(__dirname, "angular")));

app.use('/devices', checkAuth, devicesRoutes);
app.use('/customers', checkAuth, customersRoutes);
app.use('/user', usersRoutes);
app.use('/techentry', checkAuth, techentryRoutes);
app.use('/dashboard', checkAuth, dashboardRoutes)


app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
})


module.exports = app;
