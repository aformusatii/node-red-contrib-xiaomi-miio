const miio = require('./../common/devices.js');

module.exports = function(RED) {

    function miioAirPurifier(config) {
        console.log('----> Init Air Purifier! ');
        
        RED.nodes.createNode(this, config);
        var _node = this;

        //var globalContext = this.context().global;
        _node.on('input', function(msg) {
            if (!_node._enabled) {
                return;
            }
            
            var deviceId = config.deviceId;
            if (deviceId) {
                var payload = msg.payload;
                var device = miio.devices[deviceId];
                
                if (device) {

                    Object.keys(payload).forEach(function(key) {
                        var setterMethodName = 'set' + key.charAt(0).toUpperCase() + key.slice(1);
                        
                        if (typeof device[setterMethodName] === 'function') {
                            device[setterMethodName](payload[key]);    
                        } else {
                            _node.warn('No setter method on device for property ' + key); 
                        }
                    });
                    
                } else {
                    _node.error('No such device with identifier ' + deviceId);        
                }
                    
            } else {
                _node.error('Device identifier not specified.');
            }
        });

        _node._enabled = true;
        
        _node.on('close',function() {
            _node._enabled = false;
        });
        
    }

    RED.nodes.registerType("miio-air-purifier", miioAirPurifier, {
        settings: {
            miioAirPurifierDevices: {
                value: miio.optionDevices,
                exportable: true
            }
        }
    });
}