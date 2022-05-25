var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cartRouter = require('./routes/cart');
var releasesRouter = require('./routes/releases');
var downloadRouter = require('./routes/download');
var ordersRouter = require('./routes/orders');
var addressRouter = require('./routes/address')

var app = express();

// swagger imports
const yaml = require('js-yaml');
const swaggerUI = require('swagger-ui-express');
const fs = require('fs');
const { ppid } = require('process');
const swaggerDoc = yaml.load(fs.readFileSync(path.resolve(__dirname, './swagger.yml'), 'utf8'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/cart', cartRouter);
app.use('/releases', releasesRouter);
app.use('/download', downloadRouter);
app.use('/orders', ordersRouter)
app.use('/address', addressRouter);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
