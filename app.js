var channelArray = [];
var promises=[];
var users = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp",
            "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];


for(var i = 0; i < users.length; i++){
  var request  = $.getJSON('https://api.twitch.tv/kraken/channels/'+users[i]+'?callback=?', function(data) {
  channelArray.push(data);
});
  promises.push(request);
}


$.when.apply(null, promises).done(function(){
  console.log(channelArray[4]);
  ko.applyBindings(new ViewModel());
})

var ViewModel = function(){
  var self = this;
  self.channelList = ko.observableArray([]);
  self.menu = ko.observableArray([]);


  channelArray.forEach(function(channelItem){
    self.channelList.push(new Channel(channelItem))
  })
}

var Channel = function(data){
    this.name = data.display_name;
    this.logo = data.logo;
    this.status = data.status;
    this.url = data.url;
    this.isLive = function(){
       return data.video_banner===null
    }
}
