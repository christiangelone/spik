'use strict'

const Service = require('trails/service')
const rooms = require('primus-rooms')
const emitter = require('primus-emitter')

/**
 * @module PushService
 * @description Service to push notifications
 */
module.exports = class PushService extends Service {

    _auth(req, authorized) {
        authorized()
    }
    
    init(app){
        //console.log("Initializing push notification...")
        app.sockets.use('rooms', rooms)
        app.sockets.use('emitter', emitter)
        //app.sockets.authorize(this._auth)

        app.sockets.on('connection', (spark) => {
            console.log("connected")
            spark.write(JSON.stringify({
                msg: "connected"
            }))
            
            spark.on('data', (data) => {
                console.log(data)
                if(data.action === 'subscribe'){
                    if(~spark.rooms().indexOf("company::" + data.company + "::" + data.group)){
                        spark.write(JSON.stringify({
                            msg: "Already subscribed"
                        }));
                    }else{
                        spark.join("company::" + data.company + "::" + data.group,() => {
                            spark.write(JSON.stringify({
                                msg: "You have subscribed to company" + data.company + "!"
                            }))
                        })
                    }
                }
                if(data.action === 'unsubscribe'){
                    if(~spark.rooms().indexOf("company::" + data.company + "::" + data.group)){
                        spark.leave("company::" + data.company + "::" + data.group)
                        spark.write(JSON.stringify({
                            msg: "You have unsubscribed to company" + data.company + "!"
                        }));
                    }else{
                        spark.write(JSON.stringify({
                            msg: "Already unsubscribed"
                        }));
                    }
                }
                if(data.action === 'publish' && data.msg != null){
                    spark.room("company::" + data.company + "::" + data.group).write(
                        JSON.stringify(data.msg)
                    )
                }
            })   
        })

        app.sockets.on('disconnection', spark => {
            console.log("disconnected")
            spark.write(JSON.stringify({
                msg: "disconnected"
            }))
        })
    }
}

