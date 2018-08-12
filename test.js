const miio = require('miio');
const util = require('util');

const devices = miio.devices({
    cacheTime: 300 // 5 minutes. Default is 1800 seconds (30 minutes)
});

devices.on('available', reg => {

    var  device = reg.device;

    //console.log('device type -> ' + device.type + ' device id ->' + device.id);
    //console.log('reg-> ' + util.inspect(reg, { showHidden: true, depth: 5 }) );
    //console.log('device-> ' + util.inspect(device, { showHidden: true, depth: 5 }) );
    // console.log(device.temperature());
    
    try{
        
        // console.log('device-> ' + util.inspect(device, { showHidden: true, depth: 5 }) );
        // console.log(device.metadata);
        
        // device.type = mapMiioModelToType(device.miioModel);
        
        // console.log(device.type);
        
        /* device.on('contact', data => console.log('Magnet 1:', data));
        device.on('state', data => console.log('Magnet 2:', data));
        
        device.on('stateChanged', data => console.log('Magnet 3:', data));
        device.on('action', data => console.log('Magnet 4:', data));
        
        device.on('event', data => console.log('Magnet 5:', data));
        device.on('open', data => console.log('Magnet 6:', data));
        device.on('close', data => console.log('Magnet 7:', data));
        
        device.contact().then(isOn => console.log('Outlet power:', isOn)); */
        
        if (device.miioModel.indexOf('magnet') !== -1) {
            device.on('stateChanged', data => console.log('Magnet 3:', data));
            
            device.contact().then(isOn => console.log('Device: ', reg.id, ' Contact:', isOn)).catch(console.err);
            console.log(device.properties);
            
            setTimeout(function(d) {
                d.contact().then(isOn => console.log('Device: ', reg.id, ' Contact:', isOn)).catch(console.err);
                console.log(d.properties);
            }, 10000, device);
            
        }
        
        /* if(device.matches('cap:temperature')) {
    	    device.temperature().then(temp => console.log('Temperature:', temp.celsius));
    	}
    	
    	if(device.matches('cap:relative-humidity')) {
    	    device.relativeHumidity().then(rh => console.log('Humidity:', rh));
    	} */
    	
    	//device.on('temperature', (property) => console.log('temperature', property) );
    	
    	// device.on('temperatureChanged', val => console.log('temperature->', val) );
    	
        //device.on('stateChanged', change =>
          //console.log(device.model, ' changed state:', change)
        //);
    	
    	//device.on('action', ({ action }, device) => console.log('Action', action, 'performed on', device) );
    	
    	//console.log(device.actions());
    	
    	// console.log(device.properties);
    	
    } catch (error) {
        console.error(error);
    }

});

devices.on('unavailable', device => {
    // Device is no longer available and is destroyed
});

/* const browser = miio.browse({
    cacheTime: 300 // 5 minutes. Default is 1800 seconds (30 minutes)
});

const devices = {};
browser.on('available', reg => {
    if (!reg.token) {
        console.log(reg.id, 'hides its token');
        return;
    }

    // Directly connect to the device anyways - so use miio.devices() if you just do this
    reg.connect()
        .then(device => {
            devices[reg.id] = device;

            console.log('device type -> ' + device.type + ' device id ->' + device.id);
        });
});

browser.on('unavailable', reg => {
    const device = devices[reg.id];
    if (!device) return;

    device.destroy();
    delete devices[reg.id];
}) */

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