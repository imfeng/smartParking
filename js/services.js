angular.module('starter.services', [])
.filter('latLng',function(){
  return function(latLng){
    function roundTo(val, digits) {
      return Math.round(Math.round(val * Math.pow(10,(digits || 0) + 1)) / 10) / Math.pow(10, (digits || 0));
    }

    
    return roundTo(latLng.lat,4) + "," + roundTo(latLng.lng,4);
  }
})
.factory('parkingHistory',function(){
  var list = [
      {
        'hid' : 1,
        'name' : '中正大學管院停車場',
        'billing' : '$10/hr',
        'start' : '2017/05/17  07:21',
        'leave' : '2017/05/17  11:24',
        'alongTime' : '4hr',
        'status' : '已繳費',
        'price' : '$40',
        'paymentType' : '悠遊卡',
        'latLng':{lat:23.560093,lng:120.474851}
      },
      {
        'hid' : 2,
        'name' : '大吃停車場',
        'billing' : '$20/hr',
        'start' : '2017/05/16  11:21',
        'leave' : '2017/05/16  15:20',
        'alongTime' : '4hr',
        'status' : '已繳費',
        'price' : '$80',
        'paymentType' : '悠遊卡',
        'latLng':{lat:23.560095,lng:120.474851}
      }
  ];
  /*{
      latLng:{},
      parkingStart:'',
      parkingEnd:''
    }
  */
  var current = {
      latLng:{},
      parkingStart:'',
      parkingEnd:''
  }
  var getParkingHistories = function(hid){
      var rn = false;
      angular.forEach(list, function(value, key) {
        if(value.hid == hid){
          rn = value;
        }else if(key == list.length){
        
        }else{
      
        }
        return 'gg';
      });
      return rn;
    }
  return {
    list:list,
    current:current,
    getParkingHistories:getParkingHistories
  }
})
.factory('geo',function($cordovaGeolocation,$timeout,$q){
  var coords = {
    lat: null,
    lng: null
  };
  return{
    getPosition:function(){
      return coords;
    },
    refresh:function(){
      var deferred = $q.defer();
      $cordovaGeolocation.getCurrentPosition({
          timeout: 1000,
          enableHighAccuracy: true
        }).then(function(value){
          //console.log('===refresh===');
          //console.log(value);
          coords.lat = value.coords.latitude;
          coords.lng = value.coords.longitude;
          //console.log(value);
          deferred.resolve(coords);
        },function(err){
          console.warn('$cordovaGeolocation getCurrentPosition ERROR');
          deferred.reject(err);
        });
      return deferred.promise;
    },
    centerMap:function(map){

    }
  }
})
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('bl',function($ionicPlatform,$cordovaBluetoothSerial,debugMocks){

  var status = {
    enableBl: false,
    connectedDeviceName: '',
    isConnecetedDevice: true
  };
  var api = {};
  $ionicPlatform.ready(function() {
    api = {
      status:status,
      connect:function(address){
        console.log('conntect('+ address +')');
        $cordovaBluetoothSerial.connect(address)
          .then(function(data){
              status.isConnecetedDevice = true;
              status.connectedDeviceName = data;
          },function(err){
            status.isConnecetedDevice = false;
            alert(err);
          });
      },
      disconnect:function(){
        console.log('disconnect()');
        $cordovaBluetoothSerial.disconnect()
          .then(function(){
              status.isConnecetedDevice = false;
              status.connectedDeviceName = '';
          },function(err){
            
          });
      },
      isConnected:function(){
        console.log('isConnected()');

      },
      lists:function(){
        console.log('list()');
        $cordovaBluetoothSerial.list()
          .then(function(data){
              alert( debugMocks.dump(data) );
          },function(err){
              alert( 'err' );
          });

      },
      isEnabled:function(){
        console.log('isEnabled()');

      },
      enable:function(){
        console.log('enable()');

      },
      read:function(){
        console.log('read()');

      },
      write:function(){
        console.log('write()');

      }
    }
  });
  return api;


})



.factory('debugMocks', function(){
  return {
    dump:   function(object) {
      return serialize(object);

      function serialize(object) {
        var out;

        if (angular.isElement(object)) {
          object = angular.element(object);
          out = angular.element('<div></div>');
          angular.forEach(object, function(element) {
            out.append(angular.element(element).clone());
          });
          out = out.html();
        } else if (angular.isArray(object)) {
          out = [];
          angular.forEach(object, function(o) {
            out.push(serialize(o));
          });
          out = '[ ' + out.join(', ') + ' ]';
        } else if (angular.isObject(object)) {
          if (angular.isFunction(object.$eval) && angular.isFunction(object.$apply)) {
            out = serializeScope(object);
          } else if (object instanceof Error) {
            out = object.stack || ('' + object.name + ': ' + object.message);
          } else {
            // TODO(i): this prevents methods being logged,
            // we should have a better way to serialize objects
            out = angular.toJson(object, true);
          }
        } else {
          out = String(object);
        }

        return out;
      }

      function serializeScope(scope, offset) {
        offset = offset ||  '  ';
        var log = [offset + 'Scope(' + scope.$id + '): {'];
        for (var key in scope) {
          if (Object.prototype.hasOwnProperty.call(scope, key) && !key.match(/^(\$|this)/)) {
            log.push('  ' + key + ': ' + angular.toJson(scope[key]));
          }
        }
        var child = scope.$$childHead;
        while (child) {
          log.push(serializeScope(child, offset + '  '));
          child = child.$$nextSibling;
        }
        log.push('}');
        return log.join('\n' + offset);
      }
    }
  };

})



;
