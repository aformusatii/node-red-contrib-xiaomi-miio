const miio = require('./../common/devices.js');

const PIN_ALL        = 0;
const PIN_CLICK      = 1;
const PIN_DB_CLICK   = 2;
const PIN_LONG_CLICK = 3;

module.exports = function(RED) {

    function miioSwitch(config) {
        console.log('----> Init switch! ');
        
        RED.nodes.createNode(this, config);
        var _node = this;

        // hook device events
        var deviceId = config.deviceId;
        if (deviceId) {

            miio.registerActionListener(deviceId, function(e) {

                // Check if current instance is still enabled, this avoid running old callback when the node is re-loaded
                if (_node._enabled) {
                    // create multi output message
                    var out = [null, null, null, null];
                    
                    var msg = {payload: e};
                    out[PIN_ALL] = msg;
                    
                    switch (e.action) {
                        case 'click':
                            out[PIN_CLICK] = msg;
                            break;
                            
                        case 'double_click':
                            out[PIN_DB_CLICK] = msg;
                            break;
                            
                        case 'long_click_press':
                        case 'long_click_release':
                            out[PIN_LONG_CLICK] = msg;
                            break;
            
                        default:
                            console.log('Unrecognized event ', e.action);
                    }
                    
                    _node.send(out);
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

    RED.nodes.registerType("miio-switch", miioSwitch, {
        settings: {
            miioSwitchDevices: {
                value: miio.optionDevices,
                exportable: true
            }
        }
    });
    
    /* RED.httpNode.get('/xiaomi-miio', function (req, res, next) {
        console.log('handlers');
        res.send('Test 002');
    }); */
}