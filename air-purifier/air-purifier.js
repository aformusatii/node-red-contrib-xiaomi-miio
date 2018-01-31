const miio = require('./../common/devices.js');

function isSet(value) {
    return typeof value !== 'undefined' && value != null;
}

module.exports = function(RED) {

    function miioAirPurifier(config) {
        console.log('----> Init Air Purifier! ');
        
        RED.nodes.createNode(this, config);
        var _node = this;

        //var globalContext = this.context().global;

        // hook device events
        var deviceId = config.deviceId;
        if (deviceId) {
            
            _node.on('input', function(msg) {
                if (!_node._enabled) {
                    return;
                }
                
                var payload = msg.payload;

                var device = miio.devices[deviceId];
                
                if (device) {
                    
                    if (isSet(payload.power)) {
                        device.setPower(payload.power);
                    }
                    
                    if (isSet(payload.favoriteLevel)) {
                        device.setFavoriteLevel(payload.favoriteLevel);
                    }
                    
                    if (isSet(payload.mode)) {
                        device.setMode(payload.mode);
                    }
                    
                    if (isSet(payload.led)) {
                        device.setLed(payload.led);
                    }
                    
                    if (isSet(payload.ledBrightness)) {
                        device.setLedBrightness(payload.ledBrightness);
                    }
                    
                    if (isSet(payload.buzzer)) {
                        device.setBuzzer(payload.buzzer);
                    }
                    
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

    RED.nodes.registerType("miio-air-purifier", miioAirPurifier, {
        settings: {
            miioAirPurifierDevices: {
                value: miio.optionDevices,
                exportable: true
            }
        }
    });
}