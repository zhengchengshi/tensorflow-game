var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// 路由引入
var indexRouter = require('./routes/index');
const rankingsRouter = require('./routes/rankings')
const loginRouter = require('./routes/login')
const registerRouter = require('./routes/register')
// 数据库入口
const database = require('./model/core')
// 导入 cors 中间件
const cors = require('cors')
const expressJWT = require('express-jwt');
const secretOrPrivateKey = "Billy12138"  //加密token 校验token时要使用

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 将 cors 注册为全局中间件
// app.use(cors())
app.use(express.urlencoded({ extended: false }))

// 使用token保护接口
app.use(expressJWT({
  secret: secretOrPrivateKey,
  algorithms:['HS256']
}).unless({
  path: ['/register','/login']  //地址放行
}));

// 跨域处理
app.all("*", function (req, res, next) {
  //设置允许跨域的域名，*代表允许人员域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", '*');
  //允许的header类型
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");

  res.header("Access-Control-Allow-Methods", "*");
  if (req.method.toLowerCase() == 'options')
    res.send(200);  //让options尝试请求快速结束
  else
    next();
})


app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {   
      //  这个需要根据自己的业务逻辑来处理（ 具体的err值 请看下面）
    res.status(401).send('invalid token');
  }
});

// 路由中间件
app.use('/', indexRouter);
app.use('/rankings', rankingsRouter);
app.use('/login',loginRouter)
app.use('/register',registerRouter)
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
