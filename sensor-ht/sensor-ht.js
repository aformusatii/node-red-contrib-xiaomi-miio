const miio = require('./../common/devices.js');

module.exports = function(RED) {

    function miioSensorHT(config) {
        console.log('----> Init Sensor HT! ');
        
        RED.nodes.createNode(this, config);
        var _node = this;

        //var globalContext = this.context().global;

        // hook device events
        var deviceId = config.deviceId;
        if (deviceId) {
            
            _node.on('input',function() {
                var device = miio.devices[deviceId];
                
                if (device) {
                    
                    _node.send({
                        payload: device.properties
                    });
                    
                } else {
                    console.log('No such device with identifier ', deviceId);        
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

    RED.nodes.registerType("miio-sensor-ht", miioSensorHT, {
        settings: {
            miioSensorHtDevices: {
                value: miio.optionDevices,
                exportable: true
            }
        }
    });
}