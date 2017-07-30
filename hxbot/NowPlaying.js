var env = require('../config.json'),
     LastfmAPI = require('lastfmapi'),
     JsonDB = require('node-json-db');

var db = new JsonDB("lastfm_users", true, false);

var NowPlayingModule = function () {
     
    this.lfm = new LastfmAPI({
        'api_key' : env.lastfm.apikey,
        'secret' : env.lastfm.apisecret
    });
};
    
NowPlayingModule.prototype.Message = function(message)
{
    db.reload();
    try {
        var nick = db.getData("/lastfm_users/"+message.author.id);
    } catch(error) {
        message.reply("you have not set your last.fm account yet.\nUse `"+env.commandPrefix+"set_lastfm nick` to set it.");
    };
    if(nick)
    {
        this.lfm.user.getRecentTracks({user:nick}, function(err, recentTracks){
            if(err)
            {
                message.reply("last.fm error: "+err.message);
            }
            if(recentTracks)
            {
                var track = recentTracks.track[0];
                if(track['@attr'])
                {
                    console.log(message.author);
                    message.channel.send(message.author.username+" is currently listening to ♫ "+track.artist["#text"]+" - "+track.name+" ♫");
                }else{
                    message.channel.send(message.author.username+" last listened to ♫ "+track.artist["#text"]+" - "+track.name+" ♫");
                }
            }
        });
    }
}

module.exports = NowPlayingModule;