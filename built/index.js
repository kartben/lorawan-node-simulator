"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const end_node_1 = require("./end-node");
const gateway_1 = require("./gateway");
const GATEWAY_START_EUID = parseInt(process.env.GATEWAY_START_EUID || '1');
const GATEWAY_END_EUID = parseInt(process.env.GATEWAY_END_EUID || '5');
const END_NODE_START_DEVADDR = parseInt(process.env.END_NODE_START_DEVADDR || '8000');
const END_NODE_END_DEVADDR = parseInt(process.env.END_NODE_END_DEVADDR || '8100');
const NETWORK_SERVER_URI = process.env.NETWORK_SERVER_URI || 'udp://ttnv3-stack-whmrzhtjgy2lm.eastus.cloudapp.azure.com:1700';
let gateways = [];
/**
 * Returns `n` elements randomly picked from `arr`
 * @param arr array to pick from
 * @param n number of elements to randomly pick from the array
 */
function getNRandomGateways(arr, n) {
    var result = new Array(n), len = arr.length, taken = new Array(len);
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
for (let i = GATEWAY_START_EUID; i <= GATEWAY_END_EUID; i++) {
    let gatewayEUID = Buffer.allocUnsafe(8);
    gatewayEUID.writeBigInt64BE(BigInt(i));
    let gateway = new gateway_1.Gateway(gatewayEUID, new URL(NETWORK_SERVER_URI));
    gateways.push(gateway);
}
// Initialize virtual nodes and start their simulation process
for (let i = END_NODE_START_DEVADDR; i <= END_NODE_END_DEVADDR; i++) {
    let b = Buffer.allocUnsafe(4);
    b.writeUInt32BE(i);
    let endNode = new end_node_1.EndNode(b, Buffer.from('4F58A13D1F44D307AFACD65A0A5DDF06', 'hex'), Buffer.from('4F58A13D1F44D307AFACD65A0A5DDF06', 'hex'));
    endNode.on('packet', (packet) => {
        // randomly pick a few gateways and have them send the uplink packet
        getNRandomGateways(gateways, 3).forEach((g) => g.enqueueUplink(packet));
    });
    endNode.start();
}
