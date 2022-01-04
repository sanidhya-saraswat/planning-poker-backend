const Game = require('../models').Game
const Player = require('../models').Player
const {Sequelize}=require('../models')

module.exports.cleanup = async() => {
  console.log("running cleanup cron")
  try {
    let d = new Date()
    d.setHours(d.getHours() - 6);
    await Game.destroy({where:{ createdAt: { [Sequelize.Op.lt]: d } }})
    await Player.destroy({where:{ createdAt: { [Sequelize.Op.lt]: d } }})
  }
  catch (err) {
    console.log("CRON:ERROR:", err.message)
  }
}