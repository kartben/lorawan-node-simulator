# Welcome to lorawan-node-simulator 👋

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](/LICENSE)
[![Twitter: kartben](https://img.shields.io/twitter/follow/kartben.svg?style=social)](https://twitter.com/kartben)
[![Build](https://github.com/kartben/lorawan-node-simulator/workflows/Node.js%20CI/badge.svg)](https://github.com/kartben/lorawan-node-simulator/actions?query=workflow%3ANode.js+CI)

This repository contains a simulation infrastructure for LoRaWAN.

 It simulates LoRaWAN gateways, and endpoints regularly emitting LoRaWAN radio packets ("Unconfirmed Data Uplink" by default). These packets get picked up by a few (i.e. 1 to 3) gateways that forward them to a network server.

As the initial purpose of this solution was to stress test a LoRaWAN network server, and not necessarily implement a full-blown simulator, only uplink traffic is generated at this point, and devices are expected to be provisioned via ABP.

## Install

```bash
npm install lorawan-node-simulator -g
```

## Usage

The simulator needs to be configured using the following environment variables (the ones in **bold** are mandatory):

- **`NETWORK_SERVER_URI`**: (ex: udp://ttnv3-myinstance.eastus.cloudapp.azure.com:1700) ;
- **`NETWORK_SESSION_KEY`**:  The network session key (NwkSKey) used by the simulated devices (ex: A54FA689EED2DCE45A4CE5CD947EFCB7) ;
- **`APP_SESSION_KEY`**:  The application session key (AppSKey) used by the simulated devices (ex: D8B3FEE5D99EFCFE924678DD664E160C) ;
- `GATEWAY_START_EUI`: EUI of the first gateway to simulate, in decimal format (default: 1, i.e. 0x0000000000000000);
- `GATEWAY_END_EUI`: EUI of the last (inclusive) gateway to simulate, in decimal format (default: 5, i.e. 0x0000000000000005);
- `END_NODE_START_DEVADDR`: DevAddr of the first end node to simulate, in decimal format (default: 1, i.e. 0x00000000);
- `END_NODE_END_DEVADDR`: DevAddr of the last (inclusive) end node to simulate , in decimal format (default: 1000, i.e. 0x000003e8).
- `END_NODE_TX_PERIOD`: how often the end nodes transmit, in milliseconds (default: 30000, i.e. 30s) ;

Once all the required environment variables have been set (defined globally in your environment, or in a .env file in the folder from where you'll run the command), simply launch the simulation:

```bash
lorawan-node-simulator
```

### Docker container

The simulator is also available as a Docker container.

```bash
docker run kartben/lorawan-node-simulator
```

## Pre-requisites / Limitations

- The simulator does *not* provision the simulated gateways, end devices and applications in your network server so you must take care of doing so prior to launching a simulation ;

- The application payload is hard-coded and the same for all devices (4 bytes: ['t', 'e', 's', 't']) ;

- Gateways need to be provisioned with an "EU 863-870" frequency plan. Note that adding support for additional frequency plans in the simulator is reasonably straigthforward ;

- Devices need to be provisioned in your network server using the ABP method, and need to be in a "vanilla" state (i.e. frame counter = 0) ;

- Devices only emit unconfirmed uplink at the moment ;

- All simulated devices need to have the same NwkSKey and AppSKey (which may not be a recommened practice in a real-world environment!) ;

- No downlink support (the packet forwarder that the simulated gateways implement only supports "PUSH_DATA" command from the Semtech packet forwarder specification at the moment, so downlink can't be available) ;

## Author

👤 **Benjamin Cabé**

* Website: https://blog.benjamin-cabe.com
* Twitter: [@kartben](https://twitter.com/kartben)
* Github: [@kartben](https://github.com/kartben)
* LinkedIn: [@benjamincabe](https://linkedin.com/in/benjamincabe)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/kartben/lorawan-node-simulator/issues).

## Show your support

Give a ⭐️ if this project helped you!


## 📝 License

Copyright &copy; 2020 [Benjamin Cabé](https://github.com/kartben).

This project is [MIT](/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
