const express = require('express')
var cron = require('node-cron');
const bodyParser = require('body-parser')
const dotenv=require('dotenv')
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env'
dotenv.config({ path: envFile })
const db = require("./models")
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const expressSession = require("express-session")
const SequelizeStore = require("connect-session-sequelize")(expressSession.Store)
const sessionStore = new SequelizeStore({ db: db.sequelize })
sessionStore.sync()
const app = express()
const path=require("path")
const cronJobs=require("./cron")

app.use(expressSession({
  secret           : "keyboard cat",
  resave           : true,
  rolling          : true,
  saveUninitialized: false,
  store            : sessionStore,
  cookie           : {
    expires: 10 * 365 * 24 * 60 * 60 * 1000 // 10 years of inactivity
  }
}))

if(process.env.NODE_ENV==='local'){
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", true)
  res.header("Access-Control-Allow-Origin", req.headers.origin)
  res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE")
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept")
  /* istanbul ignore next */
  if (req.method === "OPTIONS") {
    res.sendStatus(200)
  } else {
    next()
  }
})
}


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0'
    }
  },
  apis: ['./controllers/*.js']
}
const optionsCSSSwagger = {
  customCss: '.swagger-ui .topbar { display: none }'
}

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const swaggerSpec = swaggerJsdoc(options)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, optionsCSSSwagger))

// checking the db connection and updating table structures 
db.sequelize.authenticate().then(async()=>{
  console.log('connected to db')
   await db.sequelize.sync()
}).catch((err)=>{
  console.log("ERROR: DB connection failed::",err)
})

const routes = require('./routes')
app.use("/api",routes)
app.use(express.static(path.join(__dirname,process.env.BUILD_PATH)));
app.get("*", (req, res) => {res.sendFile(path.join(__dirname,process.env.BUILD_PATH+"/index.html"))});

cron.schedule('0 */12 * * *', cronJobs.cleanup);

module.exports=app