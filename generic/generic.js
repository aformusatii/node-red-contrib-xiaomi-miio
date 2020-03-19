const miio = require('./../common/devices.js');

module.exports = function(RED) {

    function miioGeneric(config) {
        console.log('----> Init Generic Device! ');
        
        RED.nodes.createNode(this, config);
        var _node = this;
        _node._enabled = true;
        
        // hook device events
        _node.on('input', function(msg) {
            if (!_node._enabled) {
                return;
            }
            
            var originalPayload = msg.payload;
            msg.payload = {};

            var deviceId = config.deviceId;
            if (deviceId) {
                var device = originalPayload.deviceId ? miio.devices[originalPayload.deviceId] : miio.devices[deviceId];
                
                if (device) {
                    device.getAllProperties(val => {
                        msg.payload = val;
                        _node.send(msg);
                    });

                } else {
                    _node.error('No such device with identifier ' + deviceId);
                    _node.send(msg);
                }
                
            } else {
                _node.error('Device identifier not specified.');
                _node.send(msg);
            }
            
        });
        
        _node.on('close',function() {
            _node._enabled = false;
        });
    }

    RED.nodes.registerType("miio-generic", miioGeneric, {
        settings: {
            miioGenericDevices: {
                value: miio.optionDevices,
                exportable: true
            }
        }
    });
}