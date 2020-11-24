"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gateway = void 0;
const packet_forwarder_1 = __importDefault(require("packet-forwarder"));
const random_1 = __importDefault(require("random"));
const EU_868_TTN_UPLINK_CHANNELS = [868.1, 868.3, 868.5, 867.1, 867.3, 867.5, 867.7, 867.9];
const EU_868_TTN_DATARATES = ['SF12BW125', 'SF11BW125', 'SF10BW125', 'SF9BW125', 'SF811BW125', 'SF7BW125'];
const ALLOWED_UPLINK_CHANNELS = EU_868_TTN_UPLINK_CHANNELS;
const ALLOWED_DATARATES = EU_868_TTN_DATARATES;
class Gateway {
    constructor(gatewayEUID, networkServer) {
        this.gatewayEUID = gatewayEUID;
        this.networkServer = networkServer;
        let pareto = random_1.default.pareto(.25);
        this._rssiRandomGenerator = () => { return -30 - (1 / pareto() * 90); };
        this._lsnrRandomGenerator = random_1.default.normal(3, 10);
        this._packetForwarder = new packet_forwarder_1.default({ gateway: gatewayEUID.toString('hex'), target: this.networkServer.hostname, port: parseInt(this.networkServer.port) });
        //this._packetForwarder.on('message', (msg) => { console.log(msg.toString('hex'))} ) 
    }
    enqueueUplink(packet) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let phyPayload = packet.getPHYPayload();
            if (phyPayload) {
                let data = phyPayload.toString('base64');
                const message = {
                    rxpk: [{
                            time: new Date().toISOString(),
                            tmms: null,
                            tmst: (new Date().getTime() / 1000 | 0),
                            freq: (packet.getMType() == "Join Request") ? 868.1 : ALLOWED_UPLINK_CHANNELS[Math.floor(Math.random() * ALLOWED_UPLINK_CHANNELS.length)],
                            chan: 2,
                            rfch: 0,
                            stat: 0,
                            modu: 'LORA',
                            datr: ALLOWED_DATARATES[Math.floor(Math.random() * ALLOWED_DATARATES.length)],
                            codr: '4/5',
                            rssi: Math.round(this._rssiRandomGenerator()),
                            lsnr: Math.round(this._lsnrRandomGenerator() * 10) / 10.,
                            size: data.length,
                            data: data
                        }]
                };
                console.log(`Gateway #${this.gatewayEUID.readBigUInt64BE()} is sending packet #${packet.getFCnt()} from device ${(_a = packet.DevAddr) === null || _a === void 0 ? void 0 : _a.readInt32BE()}`);
                yield this._packetForwarder.sendUplink(message);
            }
        });
    }
}
exports.Gateway = Gateway;
//# sourceMappingURL=gateway.js.map