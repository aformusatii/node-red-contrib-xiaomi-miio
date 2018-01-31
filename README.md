Node-red node library for controlling Xiaomi devices. Obviously it uses popular [miIO device library](https://github.com/aholstenson/miio). 

There are already a couple of similar libraries... this one I have wrote for myself because it gives more flexibility and covers more devices like Air Purifier, Cube. The generic node can cover even more devices. 

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
This library uses standard way of detecting all available devices, this means that you have to configure [miIO device library](https://github.com/aholstenson/miio) if you want to see devices available through Xiaomi Gateway, there is some magic for obtaining security token. By default this library will see only IP enabled devices from your local network. 

##### Nodes:

![Nodes](docs/Nodes.png?raw=true "Nodes")

To understand how each node is working just drag them to the flow editor and then look at the Info tab.