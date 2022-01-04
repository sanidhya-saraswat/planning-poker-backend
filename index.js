let app=require("./server")
const {handleSocketEvents}=require("./controllers/games")
// starting the server
const port = process.env.PORT || 8090
const httpServer = require("http").createServer(app)
const io = require('socket.io')(httpServer,{cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST","PATCH","PUT"]
  }});
handleSocketEvents(io)
httpServer.listen(port, () => {
  console.log('Server is listening to port:', port)
})

