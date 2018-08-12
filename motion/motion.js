const miio = require('./../common/devices.js');

module.exports = function(RED) {

    function miioMotion(config) {
        console.log('----> Init motion! ');
        
        RED.nodes.createNode(this, config);
        var _node = this;

        //var globalContext = this.context().global;

        // hook device events
        var deviceId = config.deviceId;
        if (deviceId) {

            miio.registerActionListener(deviceId, function(e) {
                // Check if current instance is still enabled, this avoid running old callback when the node is re-loaded
                if (_node._enabled && (e.key === 'motion')) {
    
                    var msg = {
                        payload: {
                            action: 'motion'
                        }
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

    RED.nodes.registerType("miio-motion", miioMotion, {
        settings: {
            miioMotionDevices: {
                value: miio.optionDevices,
                exportable: true
            }
        }
    });
}