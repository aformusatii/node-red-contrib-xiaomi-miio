const miio = require('./../common/devices.js');

const PIN_ALL = 0;

var actions = {
    "alert": {
        index: 0
    },
    "rotate": {
        index: 1
    },
    "shake_air": {
        index: 2
    },
    "tap_twice": {
        index: 3
    },
    "flip90": {
        index: 4
    },
    "flip180": {
        index: 5
    },
    "free_fall": {
        index: 6
    },
    "move": {
        index: 7
    },
    size: 8
}

module.exports = function(RED) {

    function miioCube(config) {
        console.log('----> Init cube! ');
        
        RED.nodes.createNode(this, config);
        var _node = this;

        //var globalContext = this.context().global;

        // hook device events
        var deviceId = config.deviceId;
        if (deviceId) {

            miio.registerActionListener(deviceId, function(e) {

                console.log('Cube component event!');

                // Check if current instance is still enabled, this avoid running old callback when the node is re-loaded
                if (_node._enabled) {
                    // create multi output message
                    var out = new Array(actions.size);
    
                    var action = actions[e.id];
    
                    var msg = {
                        payload: {
                            action: e.id,
                            amount: e.amount
                        }
                    };
    
                    out[PIN_ALL] = msg;
    
                    if (action) {
                        out[action.index] = {
                            payload: (e.amount == null ? e.id : e.amount)
                        };
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

    RED.nodes.registerType("miio-cube", miioCube, {
        settings: {
            miioCubeDevices: {
                value: miio.optionDevices,
                exportable: true
            }
        }
    });
}