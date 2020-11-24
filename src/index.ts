import { randomInt } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

import random from 'random';

import { EndNode } from './end-node';
import { EndNodeOtaa } from './end-node-otaa';
import { Gateway } from './gateway';

const GATEWAY_START_EUID = parseInt(process.env.GATEWAY_START_EUID || '1')
const GATEWAY_END_EUID = parseInt(process.env.GATEWAY_END_EUID || '5')
const END_NODE_START_DEVADDR = parseInt(process.env.END_NODE_START_DEVADDR || '1000')
const END_NODE_END_DEVADDR = parseInt(process.env.END_NODE_END_DEVADDR || '1500')
const NETWORK_SERVER_URI = process.env.NETWORK_SERVER_URI || 'udp://ttnv3-stack-whmrzhtjgy2lm.eastus.cloudapp.azure.com:1700'

/**
 * Returns `n` elements randomly picked from `arr`
 * @param arr array to pick from
 * @param n number of elements to randomly pick from the array
 */
function getNRandomGateways(arr: Array<Gateway>, n: number): Array<Gateway> {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

// Initialize virtual gateways
let gateways: Array<Gateway> = []
for(let i = GATEWAY_START_EUID ; i <= GATEWAY_END_EUID ; i++) {
    let gatewayEUID = Buffer.allocUnsafe(8)
    gatewayEUID.writeBigInt64BE(BigInt(i))

    let gateway = new Gateway(gatewayEUID, new URL(NETWORK_SERVER_URI))
    gateways.push(gateway)
}

// Initialize virtual nodes and start their simulation process
for (let i = END_NODE_START_DEVADDR; i <= END_NODE_END_DEVADDR; i++) {
    let b = Buffer.allocUnsafe(4)
    b.writeUInt32BE(i)

    let endNode = new EndNode(b, Buffer.from('4F58A13D1F44D307AFACD65A0A5DDF07', 'hex'), Buffer.from('4F58A13D1F44D307AFACD65A0A5DDF07', 'hex'))
    endNode.on('packet', (packet) => {
        // randomly pick a few gateways (between 1 and 3) and have them send the uplink packet
        getNRandomGateways(gateways, random.int(1,3)).forEach((g) => g.enqueueUplink(packet))
    })

    endNode.start()
}

// let otaaDevice = new EndNodeOtaa(Buffer.from('1234567895464564', 'hex'), Buffer.from('0000000000000000', 'hex'))
// console.log(otaaDevice.getJoinRequestPacket())
// gateways[0].enqueueUplink(otaaDevice.getJoinRequestPacket())