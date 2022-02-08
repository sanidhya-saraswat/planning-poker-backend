const Game = require('../models').Game
const Player = require('../models').Player
const events = require("events")
const eventEmitter = new events.EventEmitter()
let io

module.exports.handleSocketEvents = async (socketIO) => {
  io = socketIO
  io.on('connection', (socket) => {
    socket.on('join_room', async ({ link, name }) => {
      try{
      console.log(`${name}(${socket.id}) joined ${link}`)
      socket.join(link);
      await Player.update({ socket_id: socket.id, active: true }, { where: { link, name } })
      eventEmitter.emit('game_update_event', link)
      }
      catch(err){
        console.log("SOCKET:join_room:ERROR:",err.message)
      }
    });

    socket.on('disconnect', async () => {
      try{
      console.log(`${socket.id} got disconnected`)
      let player = await Player.findOne({ where: { socket_id: socket.id } })
      if (player) {
        player.active = false;
        await player.save()
        eventEmitter.emit('game_update_event', player.link)
      }
    }catch(err){
      console.log("SOCKET:disconnect:ERROR:",err.message)
    }
    });
  })
}

eventEmitter.on("game_update_event", async (link) => {
  try{
  let game = await Game.findOne({ where: { link }, attributes: ['show'], order: [[Player, 'name', 'ASC']], include: [{ model: Player, where: { active: true }, attributes: ['name', 'admin','score']}] })
  io.to(link).emit('game_update', game);
  }
  catch(err){
    console.log("EVENT:game_update_event:ERROR:",err.message)
  }
})

/**
 * @swagger
 * /api/games:
 *  post:
 *    summary: Generate a new game
 *    tags:
 *      - Games
 *    responses:
 *      '200':
 *        description: Successful response
 */
module.exports.create = async (req, res) => {
  try {
    let link = generateLink(5)
    await Game.create({ link })
    // await Player.create({ name: req.body.name, link, admin: true })
    // req.session['name'] = req.body.name
    return res.send({ success: true, data: { link } })
  } catch (err) {
    console.log(err)
    return res.send({ success: false, errorCode: 500, error: err.message })
  }

  function generateLink(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }
}

/**
 * @swagger
 * /api/games:
 *  patch:
 *    summary: Update a game
 *    tags:
 *      - Games
 *    responses:
 *      '200':
 *        description: Successful response
 */
 module.exports.update = async (req, res) => {
  try {
    const game = await Game.findOne({ where: { link: req.params.link }})
    if (!game) return res.send({ success: false, error: 'Game not found' })
    if(req.body.show){
      game.show=req.body.show
    }
    await game.save()
    eventEmitter.emit("game_update_event", req.params.link)
    return res.send({ success: true})
  } catch (err) {
    console.log(err)
    return res.send({ success: false, errorCode: 500, error: err.message })
  }
}

/**
 * @swagger
 * /api/games:
 *  patch:
 *    summary: Update a game
 *    tags:
 *      - Games
 *    responses:
 *      '200':
 *        description: Successful response
 */
 module.exports.reset = async (req, res) => {
  try {
    const game = await Game.findOne({ where: { link: req.params.link }})
    if (!game) return res.send({ success: false, error: 'Game not found' })
    game.show=false
    await game.save()
    await Player.update({score:-1},{where:{link:req.params.link}})
    eventEmitter.emit("game_update_event", req.params.link)
    return res.send({ success: true})
  } catch (err) {
    console.log(err)
    return res.send({ success: false, errorCode: 500, error: err.message })
  }
}

/**
 * @swagger
 * /api/games/{link}:
 *  get:
 *    summary: Get a game by link
 *    tags:
 *      - Games
 *    parameters:
 *      - in: path
 *        name: link
 *        schema:
 *        description: unique link of the game
 *    responses:
 *      '200':
 *        description: Successful response
 */
module.exports.getByLink = async (req, res) => {
  try {
    const game = await Game.findOne({ where: { link: req.params.link }, include: [{ model: Player }] })
    if (!game) return res.send({ success: false, error: 'Game not found' })
    return res.send({ success: true, data: game })
  } catch (err) {
    return res.send({ success: false, error: err.message })
  }
}

/**
 * @swagger
 * /api/games/{link}/users:
 *  post:
 *    summary: Create a new user for a game
 *    tags:
 *      - Games
 *    parameters:
 *      - in: path
 *        name: link
 *        schema:
 *        description: unique link of the game
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            example:
 *              {name: sam}
 *    responses:
 *      '200':
 *        description: Successful response
 */
module.exports.createUser = async (req, res) => {
  try {
    let admin=false
    let game = await Game.findOne({ where: { link: req.params.link }, include: [{ model: Player }] })
    if (!game) return res.send({ success: false, error: "Game not found" })
    if (game.Players.find(player => player.name === req.body.name)) return res.send({ success: false, error: "Name already exists" })
    if(game.Players.length===0) admin=true
    await Player.create({ name: req.body.name, link: game.link,admin })
    req.session['name'] = req.body.name
    return res.send({ success: true })
  } catch (err) {
    return res.send({ success: false, error: err.message })
  }
}

/**
 * @swagger
 * /api/games/{link}/users/logged-in:
 *  patch:
 *    summary: Update logged in user of a game
 *    tags:
 *      - Games
 *    parameters:
 *      - in: path
 *        name: link
 *        schema:
 *        description: unique link of the game
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            example:
 *              {name: tom}
 *    responses:
 *      '200':
 *        description: Successful response
 */
module.exports.updateLoggedInUser = async (req, res) => {
  try {
    let oldName = req.session['name']
    if (!oldName) return res.send({ success: false, error: "Not logged in" })
    let game = await Game.findOne({ where: { link: req.params.link }, include: [{ model: Player }] })
    if (!game) return res.send({ success: false, error: "Game not found" })
    let player = game.Players.find(player => player.name === oldName)
    if (!player) return res.send({ success: false, error: "Player not found" })
    if(req.body.name){
      if (game.Players.find(player => player.name === req.body.name)) return res.send({ success: false, error: "This username is used by another person" })
      await Player.update({ name: req.body.name }, { where: { name: oldName, link: req.params.link } })
      req.session['name'] = req.body.name
    }
    if(req.body.score){
      await Player.update({ score: req.body.score }, { where: { name: oldName, link: req.params.link } })
    }
    eventEmitter.emit("game_update_event", req.params.link)
    return res.send({ success: true })
  } catch (err) {
    console.log(err)
    return res.send({ success: false, error: err.message })
  }
}

/**
 * @swagger
 * /api/games/{link}/users:
 *  patch:
 *    summary: Bulk update users of a game
 *    tags:
 *      - Games
 *    parameters:
 *      - in: path
 *        name: link
 *        schema:
 *        description: unique link of the game
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            example:
 *              [{name: tom, admin: true}]
 *    responses:
 *      '200':
 *        description: Successful response
 */
module.exports.bulkUpdateUsers = async (req, res) => {
  try {
    let game = await Game.findOne({ where: { link: req.params.link }, include: [{ model: Player }] })
    if (!game) return res.send({ success: false, error: "Game not found" })
    await Promise.all(req.body.users.map(async (user) => {
      await Player.update(user, { where: { name: user.name, link: req.params.link } })
    }));
    eventEmitter.emit("game_update_event", req.params.link)
    return res.send({ success: true})
  }
  catch (err) {
    console.log(err)
    return res.send({ success: false, error: err.message })
  }
}

/**
 * @swagger
 * /api/games/{link}/users/logged-in:
 *  get:
 *    summary: Get logged in user of a game
 *    tags:
 *      - Games
 *    parameters:
 *      - in: path
 *        name: link
 *        schema:
 *        description: unique link of the game
 *    responses:
 *      '200':
 *        description: Successful response
 */
module.exports.getLoggedInUser = async (req, res) => {
  try {
    let name = req.session['name']
    if (!name) return res.send({ success: false, errorCode: 401, error: 'Not logged in' })
    return res.send({ success: true, data: { name } })
  } catch (err) {
    return res.send({ success: false, error: err.message })
  }
}
