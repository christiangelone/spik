let services = require("../api/services")

module.exports = function(app){
    new services.PushService().init(app)
}