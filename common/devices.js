const miio = require('miio');
const util = require('util');

console.log('Miio path: ', require.resolve('miio'));

var allDevices = {
    instance: Math.random()
};

var optionDevices = [];

var propertyCallbacks = {};
var actionCallbacks = {};

var disableEventListener = true;

const devices = miio.devices({
	cacheTime: 1800 // 30 minutes
});

/* ======================================================================================================= */
devices.on('available', reg => {

	const device = reg.device;
	if(!device) {
		console.log(reg.id, 'could not be connected to');
		return;
	}
	
	console.log('Detected device with identifier ', reg.id, ' types ', device.metadata.types, ' model ', device.miioModel);
	console.log(device.properties)

	setupLegacySupport(reg.id, device);
	
	if (typeof allDevices[reg.id] === 'undefined') {
    	optionDevices.push({
    		id: reg.id,
    		model: device.miioModel,
    		type: device.type
    	});
    	
    	allDevices[reg.id] = device;
    	
        switch (device.type) {
            case 'gateway':
                handleGateway(reg.id, device);
                break;
    
            case 'air-purifier':
                handleAirPurifier(reg.id, device);
                break;
    
            case 'controller':
            	//console.log('sub-device!' + util.inspect(device, { showHidden: true, depth: 5 }) );
                handleController(reg.id, device);
                break;
    
            case 'magnet':
                handleMagnet(reg.id, device);
                break;
    
            case 'sensor':
                handleSensor(reg.id, device);
                break;
    
            case 'motion':
                handleMotion(reg.id, device);
                break;
    
            default:
                console.log('Skip device: ' + reg.id + ' type:' + device.type);
        }
	} else {
	    console.log('Device already initialized.');
	}

});

/* ======================================================================================================= */
devices.on('unavailable', device => {
    // Device is no longer available and is destroyed
    console.log('Device unavailable', device);
});

/* ======================================================================================================= */
var setupLegacySupport = function(id, device) {
    
	// Fix the issue with miio library
	if (device.miioModel.indexOf('magnet') !== -1) {
	    device.contact().then(contact => device.magnetContact = contact);
	    
        setTimeout(function() {
            disableEventListener = false;
            console.log('Enabled event listeners');
        }, 5000);
	}
    
    // backward compatibility stuff
	device.type = mapMiioModelToType(device.miioModel);
	device.model = device.miioModel;
	
	device.getAllProperties = function(resultCallback) {
        if (device.miioModel.indexOf('magnet') !== -1) {
            // Fix the issue with miio library: https://github.com/aholstenson/miio/issues/170
            device.contact().then( val => resultCallback({
                open: device.magnetContact === false,
                contact: device.magnetContact
            }) );
            
        } else {
            resultCallback(device.properties);
        }
	}

}

/* ======================================================================================================= */
var mapMiioModelToType = function(model) {
    
    if (model.indexOf('airpurifier') !== -1) {
        return 'air-purifier';
    } else if (model.indexOf('cube') !== -1) {
        return 'controller';
    } else if (model.indexOf('magnet') !== -1) {
        return 'magnet';
    } else if (model.indexOf('motion') !== -1) {
        return 'motion';
    } else if (model.indexOf('sensor_ht') !== -1) {
        return 'sensor';
    } else if (model.indexOf('switch') !== -1) {
        return 'controller';
    } else if (model.indexOf('gateway') !== -1) {
        return 'gateway';
    } else if (model.indexOf('repeater') !== -1) {
        return 'repeater';
    } else {
        console.warn('Unknown model ', model);
        return 'unknown';
    }

}

/* ======================================================================================================= */
function triggerCallback(id, deviceCallbacks, event, device) {
	// console.log('event', ' ', id, ' ', arg1, ' ', arg2, ' ', arg3);
	var callbacks = deviceCallbacks[id];
	
	if (callbacks) {
		for (var i = 0, len = callbacks.length; i < len; i++) {
			var callback = callbacks[i];
			if (typeof callback === "function") {
			    event = (typeof event === 'undefined') ? {} : event;
			    // event.device = device;
				callback(event);
			}
		}
	}

}

/* ======================================================================================================= */
function hookGenericStateAndAction(id, device) {
    
    device.on('stateChanged', e => {
        
        if (disableEventListener) {
            return;
        }
        
        var event = {
            deviceId: id,
            key: e.key,
            value: e.value,
            model: device.model
        };
        
    	// Fix the issue with miio library: https://github.com/aholstenson/miio/issues/170
    	if ( (device.miioModel.indexOf('magnet') !== -1) && (e.key == 'contact') ) {
    	    device.magnetContact = e.value;
    	}

        triggerCallback(id, propertyCallbacks, event, device);
    });

    device.on('action', e => {
        
        if (disableEventListener) {
            return;
        }
        
        var event = {
            deviceId: id,
            action: e.action,
            model: device.model,
            amount: e.data.amount
        };
        
		triggerCallback(id, actionCallbacks, event, device);
    });    
}

/* ======================================================================================================= */
function handleGateway(id, device) {

    // Handlers for Gateway events
    hookGenericStateAndAction(id, device);
}


/* ======================================================================================================= */
function handleController(id, device) {
    hookGenericStateAndAction(id, device);
}

/* ======================================================================================================= */
function handleMagnet(id, device) {
    hookGenericStateAndAction(id, device);
}

/* ======================================================================================================= */
function handleSensor(id, device) {
    hookGenericStateAndAction(id, device);
}

/* ======================================================================================================= */
function handleAirPurifier(id, device) {
    hookGenericStateAndAction(id, device);

}

/* ======================================================================================================= */
function handleMotion(id, device) {
    hookGenericStateAndAction(id, device);
}

/* ======================================================================================================= */
function addCallbacks(deviceId, deviceCallbacks, callback) {
	if (!deviceCallbacks[deviceId]) {
		deviceCallbacks[deviceId] = [];
	}

	deviceCallbacks[deviceId].push(callback);	
}

/* ======================================================================================================= */
module.exports = {
	devices: allDevices,
	optionDevices: optionDevices,
    registerPropertyListener: function(deviceId, callback) {
    	addCallbacks(deviceId, propertyCallbacks, callback);
    },
    registerActionListener: function(deviceId, callback) {
    	addCallbacks(deviceId, actionCallbacks, callback);
    }
}
