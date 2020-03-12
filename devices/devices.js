const miio = require('./../common/devices.js');

module.exports = function(RED) {

    function miioGeneric(config) {
        console.log('----> Init Devices! ');
        
        RED.nodes.createNode(this, config);
        var _node = this;

        // hook device events
        _node.on('input',function(msg) {
            msg.payload = [];
            
            for (key in miio.devices) {
                var device = miio.devices[key];
                msg.payload.push({
                    id: device.id,
                    type: device.type,
                    miioModel: device.miioModel,
                    properties: device.properties
                });
            }

            _node.send(msg);
        });

        _node._enabled = true;
        
        _node.on('close',function() {
            _node._enabled = false;
        });
        
    }

    RED.nodes.registerType("miio-devices", miioGeneric, {
        settings: {
            miioDevicesList: {
                value: miio.optionDevices,
                exportable: true
            }
        }
    });
}