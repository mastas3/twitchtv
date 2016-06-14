var channelArray = [];
var promises=[];
var users = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp",
            "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas",
            "nintendo", "eleaguetv"];


for(var i = 0; i < users.length; i++){
  var request  = $.getJSON('https://api.twitch.tv/kraken/channels/'+users[i]+'?callback=?', function(data) {
  channelArray.push(data);
});
  promises.push(request);
}


$.when.apply(null, promises).done(function(){
  ko.applyBindings(new ViewModel());
})

var ViewModel = function(){
  var self = this;
  self.channelList = ko.observableArray([]);

  self.pages = ko.observableArray(['all', 'online', 'offline']);
  self.currentPage = ko.observable(self.pages()[0]);


  self.renderChannels = function(page){
    switch(page){
      case 'online':
          self.channelList.removeAll();
          channelArray.forEach(function(channelItem){
            var channel = new Channel(channelItem);
            if(channel.isLive()){
              self.channelList.push(channel);
            }
          })
        break;
      case 'offline':
      self.channelList.removeAll();
      channelArray.forEach(function(channelItem){
        var channel = new Channel(channelItem);
        if(!channel.isLive()){
          self.channelList.push(channel);
        }
      })
        break;
      default:
      channelArray.forEach(function(channelItem){
        self.channelList.push(new Channel(channelItem));
      })
    }
  }

  self.changeCurrentPage = function(data, event){
    var newPage = event.target.href.substring(event.target.href.indexOf('#')+2);
    if(self.currentPage() !== newPage){
      self.currentPage(newPage);
      self.renderChannels(newPage);
    }
  }

    channelArray.forEach(function(channelItem){
      self.channelList.push(new Channel(channelItem));
    })
}

// var Page = function(pageData){
//   switch(pageData.name){
//     case 'all':
//
//       break;
//     case 'online':
//
//       break;
//     case 'offline':
//
//       break;
//   }
// }

var Channel = function(data){
    this.name = data.display_name;
    this.logo = data.logo;
    this.status = data.status;
    this.url = data.url;
    this.isLive = function(){
       return data.partner;
    }
}
