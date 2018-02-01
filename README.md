Node-red node library for controlling Xiaomi devices. Obviously it uses popular [miIO device library](https://github.com/aholstenson/miio). 

#### Supported (was tested with) devices:
- Xiaomi Switch
- Xiaomi Cube
- Xiaomi Motion Detector
- Xiaomi Window/Door Sensor
- Xiaomi Temperature and Humidity Sensor
- Xiaomi Air Purifier
- Xiaomi Generic Device Listener (see documentation for details)
- Xiaomi Generic Device (see documentation for details)

#### Installation:
```bash
npm install node-red-contrib-xiaomi-miio
```

#### Usage:
This library uses standard way of detecting all available devices, this means that you have to configure [miIO device library](https://github.com/aholstenson/miio) if you want to see devices available through Xiaomi Gateway. By default this library will see only IP enabled devices from your local network. 

##### Nodes:

![Nodes](docs/Nodes.png?raw=true "Nodes")

See node Info tab for more details.

##### Cube Node:

![Cube Node](docs/cube.png?raw=true "Cube Node")

##### Air Purifier Node:

![Air Purifier Node](docs/air-purifier.png?raw=true "Air Purifier Node")

##### Temperature and Humidity Sensor Node:

![TH Node](docs/ht-sensor.png?raw=true "TH Node")

##### Window/Door Sensor Node:

![Magnet Node](docs/magnet.png?raw=true "Magnet Node")

##### Motion Sensor Node:

![Motion Node](docs/motion.png?raw=true "Motion Node")

##### Switch Node:

![Switch Node](docs/switch.png?raw=true "Switch Node")

##### Generic Properties Reader Node:

![Generic Node](docs/generic-device.png?raw=true "Generic Node")

##### Listener Node:

![Listener Node](docs/listener.png?raw=true "Listener Node")