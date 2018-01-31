const miio = require('miio');
// const util = require('util');

var allDevices = {
    instance: Math.random()
};

var optionDevices = [];

var propertyCallbacks = {};
var actionCallbacks = {};
var motionCallbacks = {};


const devices = miio.devices({
	cacheTime: 300 // 5 minutes. Default is 1800 seconds (30 minutes)
});

/* ======================================================================================================= */
devices.on('available', reg => {

	const device = reg.device;
	if(!device) {
		console.log(reg.id, 'could not be connected to');
		return;
	}
	
	console.log('Detected device with identifier ', reg.id, ' type ', device.type, ' model ', device.model);
	
	if (typeof allDevices[reg.id] === 'undefined') {
    	optionDevices.push({
    		id: reg.id,
    		type: device.type,
    		model: device.model
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
function triggerCallback(id, deviceCallbacks, event, device) {
	// console.log('event', ' ', id, ' ', arg1, ' ', arg2, ' ', arg3);
	var callbacks = deviceCallbacks[id];
	
	if (callbacks) {
		for (var i = 0, len = callbacks.length; i < len; i++) {
			var callback = callbacks[i];
			if (typeof callback === "function") {
			    event = (typeof event === 'undefined') ? {} : event;
			    event.device = device;
				callback(event);
			}
		}
	}

}

/* ======================================================================================================= */
function handleGateway(id, device) {

    // Handlers for Gateway events
    device.on('propertyChanged', e => {
        triggerCallback(id, propertyCallbacks, e, device);
    });

    device.on('action', e => {
		triggerCallback(id, actionCallbacks, e, device);
    });

}


/* ======================================================================================================= */
function handleController(id, device) {

    device.on('propertyChanged', e => {
        console.log('Controller ', 'propertyChanged', e);
        triggerCallback(id, propertyCallbacks, e, device);
    });

    device.on('action', e => {
        console.log('Controller ', 'action', e);
		triggerCallback(id, actionCallbacks, e, device);
    });

}

/* ======================================================================================================= */
function handleMagnet(id, device) {

    device.on('propertyChanged', e => {
		triggerCallback(id, propertyCallbacks, e, device);
    });

    device.on('action', e => {
		triggerCallback(id, actionCallbacks, e, device);
    });

}

/* ======================================================================================================= */
function handleSensor(id, device) {

    device.on('propertyChanged', e => {
		triggerCallback(id, propertyCallbacks, e, device);
    });

    device.on('action', e => {
		triggerCallback(id, actionCallbacks, e, device);
    });

}

/* ======================================================================================================= */
function handleAirPurifier(id, device) {

    device.on('propertyChanged', e => {
		triggerCallback(id, propertyCallbacks, e, device);
    });

    device.on('action', e => {
		triggerCallback(id, actionCallbacks, e, device);
    });

}

/* ======================================================================================================= */
function handleMotion(id, device) {

    device.on('propertyChanged', e => {
		triggerCallback(id, propertyCallbacks, e, device);
    });

    device.on('action', e => {
		triggerCallback(id, actionCallbacks, e, device);
    });

    device.on('motion', e => {
		triggerCallback(id, motionCallbacks, e, device);
    });

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
    },
    registerMotionListener: function(deviceId, callback) {
    	addCallbacks(deviceId, motionCallbacks, callback);
    }
}


