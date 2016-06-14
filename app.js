var channelArray = [],
    promises=[],
    users = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp",
            "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas",
            "nintendo", "eleaguetv"];

//--------------
//get JSON data
//--------------
for(var i = 0; i < users.length; i++){
  var request  = $.getJSON('https://api.twitch.tv/kraken/channels/'+users[i]+'?callback=?', function(data) {
  channelArray.push(data);
});
  promises.push(request);
}


//-----------
// ViewModel
//-----------
var ViewModel = function(){
  var self = this,
      searchString = '',
      startedRenderingChannel = false;

  self.channelList = ko.observableArray([]);
  self.pages = ko.observableArray(['all', 'online', 'offline']);
  self.currentPage = ko.observable(self.pages()[0]);

  self.renderChannel = function(string){
    startedRenderingChannel = true;
    self.channelList.removeAll();

    channelArray.forEach(function(channelItem){
      var channel = new Channel(channelItem);
      var channelName = channel.name.toLowerCase();
      if(channelName.search(string)>-1){
          self.channelList.push(channel);
      }
    })
  }

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
      self.channelList.removeAll();
      channelArray.forEach(function(channelItem){
        self.channelList.push(new Channel(channelItem));
      })
    }
  }

  self.changeCurrentPage = function(data, event){
    var newPage = event.target.href.substring(event.target.href.indexOf('#')+2);
    if(self.currentPage() !== newPage || (self.currentPage() === newPage && startedRenderingChannel)){
      $('.active').removeClass('active');
      $(event.target.parentNode).addClass('active');
      self.currentPage(newPage);
      self.renderChannels(newPage);
    }
  }



  self.searchFunc = function(data, event){
    var charCode = event.which;
    if(charCode === 8 && searchString.length>0){
      if($('#search').val()==''){
        searchString = '';
      }
      searchString = searchString.substring(0,searchString.length-1);
    }else{
      searchString += String.fromCharCode(charCode).toLowerCase();
    }
      self.renderChannel(searchString);
  }

  channelArray.forEach(function(channelItem){
    self.channelList.push(new Channel(channelItem));
  })

}

//----------------
// Channel Model
//----------------
var Channel = function(data){
    this.name = data.display_name;
    this.logo = data.logo;
    this.status = data.status;
    this.url = data.url;
    this.isLive = function(){
       return data.partner;
    }
}

//-------------------------------------------------------
// When data is ready - apply data bindings with knockout
//-------------------------------------------------------
$.when.apply(null, promises).done(function(){
  ko.applyBindings(new ViewModel());
})
