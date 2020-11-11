const miio = require('miio');
const util = require('util');

console.log('Miio path: ', require.resolve('miio'));

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
	console.log(device.properties);
	console.log('Token', device.management.token);

});

/* ======================================================================================================= */
devices.on('unavailable', device => {
    // Device is no longer available and is destroyed
    console.log('Device unavailable', device);
});

setTimeout(function() {
	
	miio.device({
	    address: '192.168.100.15', 
	    token: '****'
	})
	.then(device => console.log('A->', device))
	.catch(err => console.log('Device not found ', err));
	
	var newDevices = miio.devices({cacheTime: 300});
	
	newDevices.on('available', reg => {
		console.log('B-> ', reg);
	});
	
}, 5000);