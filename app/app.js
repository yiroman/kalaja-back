var createError = require('http-errors'),
	express = require('express'),
	cors = require('cors'),
	helmet = require('helmet'),
	morgan = require('morgan'),
	winston = require('./config/winston'),
	session = require('express-session'),
	{redisClient} = require('./config/redis')

//MongoDB
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

//Cambio de formato de fecha de Morgan
morgan.token('date', function() {
	return new Date().toString().replace(" (Central Standard Time)", "");
});

const indexRouter = require('./routes/index')
const usuariosRouter = require('./routes/usuariosRouters')
const datosEstaticos = require('./routes/datosEstaticosRouters')
const rolesRouter = require('./routes/rolesRouters')
const dependenciasRouter = require('./routes/dependenciasRouters')
const pedidosRouter = require('./routes/pedidosRouters')
const productosRouter = require('./routes/productosRouters')

var app = express();
app.set('trust proxy', 1);
// Configuración de la sesión


// Conectar a Redis
redisClient.connect().catch(console.error);
const {RedisStore} = require("connect-redis")
let store_redis = new RedisStore({
    client: redisClient, 
    prefix: 'session-cookie:',
	ttl: 4 * (60 * 60000) // 4 horas en milisegundos

});
//Configuración de Cookie de session
const sess = {
	store: store_redis,
	name: 'session.kalaja',        // Nombre de la cookie
	secret: process.env.SECRET_COOKIE, // Debe ser una cadena segura y única
	resave: false,           // No guarda la sesión si no hay cambios
	saveUninitialized: false, // No guarda sesiones vacías
	cookie: {
		httpOnly: false,     // Solo accesible desde el servidorD
		maxAge: 4 * (60 * 60000) // 4 horas en milisegundos
	}
};
if(app.get('env') ==='dev'){
	sess.cookie.secure = false
	sess.cookie.sameSite = 'None'
}

const dominiosPermitidos = () => {
	if(app.get('env') === 'production'){
		console.log('app en produccion')
		return [
			'http://localhost:4200',
			'http://localhost:4201',
			'kalaja-front-git-main-yiromans-projects.vercel.app',
			'https://kalaja-front-git-main-yiromans-projects.vercel.app',
			'https://kalaja-front-4yqv.vercel.app',
		]
	}
	else {
		console.log('app en desarrollo')
		return [
			'http://localhost:4200',
			'https://kalaja-front-4yqv.vercel.app',
			'https://kalaja-front-git-main-yiromans-projects.vercel.app',
			'http://localhost:4201'
		]
	}
}
const dominios = dominiosPermitidos()

const corsOptions = (req, callback) => {
	const origin = req.header('Origin')
	if(dominios.includes(origin)){
		callback(null, {origin: true, credentials:true})
	}
	else{
		callback(null, { origin: false })
	}
}

if(app.get('env') === 'test' || app.get('env') === 'production'){
	app.set('trust proxy', 1) // trust first proxy
	sess.cookie.secure = true
	sess.cookie.sameSite = 'none'
}

app.use(session(sess));
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.disable('x-powered-by');
app.use(cors(corsOptions));


app.use(morgan('common', { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('uploads'));


app.use('/', indexRouter);

const prefixInterna = `/api/v1/`
const prefixExterna = `/api/v2/`;

app.use(`${prefixInterna}index`, indexRouter)
app.use(`${prefixInterna}usuarios`, usuariosRouter)
app.use(`${prefixInterna}datos_estaticos`, datosEstaticos)
app.use(`${prefixInterna}roles`, rolesRouter)
app.use(`${prefixInterna}dependencias`, dependenciasRouter)
app.use(`${prefixInterna}pedidos`, pedidosRouter)
app.use(`${prefixInterna}productos`, productosRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});


// error handler
app.use(function (err, req, res, _) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// add this line to include winston logging
	winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

	// render the error page
	res.status(err.status || 500);
	const json = {
		message: res.locals.message,
		error: res.locals.error,
		status: err.status
	};
	res.json(json);
});
module.exports = app;


