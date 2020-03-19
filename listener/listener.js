const miio = require('./../common/devices.js');

module.exports = function(RED) {

    function miioListener(config) {
        console.log('----> Init Listener! ');
        
        RED.nodes.createNode(this, config);
        var _node = this;

        //var globalContext = this.context().global;

        // hook device events
        var deviceId = config.deviceId;
        if (deviceId) {

            miio.registerPropertyListener(deviceId, function(e) {
                // Check if current instance is still enabled, this avoid running old callback when the node is re-loaded
                if (_node._enabled) {
    
                    var msg = {
                        payload: e
                    };
    
                    _node.send(msg);
                }
            });
            
            miio.registerActionListener(deviceId, function(e) {
                // Check if current instance is still enabled, this avoid running old callback when the node is re-loaded
                if (_node._enabled) {

                    var msg = {
                        payload: e
                    };
    
                    _node.send(msg);
                }
            });  
            
        } else {
            console.log('Device identifier not specified.');
        }
        
        _node._enabled = true;
        
        _node.on('close',function() {
            _node._enabled = false;
        });
        
    }

    RED.nodes.registerType("miio-listener", miioListener, {
        settings: {
            miioListenerDevices: {
                value: miio.optionDevices,
                exportable: true
            }
        }
    });
}