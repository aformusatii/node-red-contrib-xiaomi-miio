const miio = require('./../common/devices.js');

module.exports = function(RED) {

    function miioTokens(config) {
        console.log('----> Init Miio Tokens! ');
        
        RED.nodes.createNode(this, config);
        var _node = this;
        
        if (config.devices) {
            for (var key in config.devices) {
                if (config.devices.hasOwnProperty(key)) {

                    miio.registerDeviceManually({
                        address: key,
                        token: config.devices[key]
                    });
                }
            }
        }
    }

    RED.nodes.registerType("miio-tokens", miioTokens, {
        settings: {
            miioTokensDevices: {
                value: miio.optionDevices,
                exportable: true
            }
        }
    });
}