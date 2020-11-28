#!/usr/bin/env node
import dotenv from 'dotenv';
import { exit } from 'process';
dotenv.config();

import random from 'random';

import { EndNode } from './end-node';
import { Gateway } from './gateway';

const NETWORK_SERVER_URI = process.env.NETWORK_SERVER_URI
const NETWORK_SESSION_KEY = process.env.NETWORK_SESSION_KEY
const APPLICATION_SESSION_KEY = process.env.APPLICATION_SESSION_KEY

if (NETWORK_SERVER_URI === undefined || NETWORK_SESSION_KEY === undefined || APPLICATION_SESSION_KEY === undefined) {
    console.log('ERROR: Make sure to set the NETWORK_SERVER_URI, NETWORK_SESSION_KEY, APPLICATION_SESSION_KEY prior to launching the simulation.')
    exit(1)
}

const GATEWAY_START_EUI = process.env.GATEWAY_START_EUI || '00000000000000000000000000000001'
const GATEWAY_END_EUI = process.env.GATEWAY_END_EUI || '00000000000000000000000000000005'

const END_NODE_START_DEVADDR = process.env.END_NODE_START_DEVADDR || '00000001'
const END_NODE_END_DEVADDR = process.env.END_NODE_END_DEVADDR || '000003e8'
const END_NODE_TX_PERIOD = parseInt(process.env.END_NODE_TX_PERIOD || '30000')

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
let gwStart = BigInt('0x' + GATEWAY_START_EUI)
let gwEnd = BigInt('0x' + GATEWAY_END_EUI)
for (let i = gwStart; i <= gwEnd; i++) {
    let gatewayEUI = Buffer.allocUnsafe(8)
    gatewayEUI.writeBigInt64BE(BigInt(i))

    let gateway = new Gateway(gatewayEUI, new URL(NETWORK_SERVER_URI))
    gateways.push(gateway)
}

// Initialize virtual nodes and start their simulation process
let devStart = parseInt(END_NODE_START_DEVADDR, 16)
let devEnd = parseInt(END_NODE_END_DEVADDR, 16)
for (let i = devStart; i <= devEnd; i++) {
    let b = Buffer.allocUnsafe(4)
    b.writeUInt32BE(i)

    let endNode = new EndNode(b, Buffer.from(NETWORK_SESSION_KEY, 'hex'), Buffer.from(APPLICATION_SESSION_KEY, 'hex'), { txPeriod: END_NODE_TX_PERIOD })
    endNode.on('packet', (packet) => {
        // randomly pick a few gateways (between 1 and 3) and have them send the uplink packet
        getNRandomGateways(gateways, random.int(1, 3)).forEach((g) => g.enqueueUplink(packet))
    })

    endNode.start()
}

// let otaaDevice = new EndNodeOtaa(Buffer.from('1234567895464564', 'hex'), Buffer.from('0000000000000000', 'hex'))
// console.log(otaaDevice.getJoinRequestPacket())
// gateways[0].enqueueUplink(otaaDevice.getJoinRequestPacket())