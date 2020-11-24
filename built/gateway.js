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
class Gateway {
    constructor(gatewayEUID, networkServer) {
        console.log(networkServer);
        this.gatewayEUID = gatewayEUID;
        this.networkServer = networkServer;
        this._packetForwarder = new packet_forwarder_1.default({ gateway: gatewayEUID.toString('hex'), target: this.networkServer.hostname, port: parseInt(this.networkServer.port) });
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
                            freq: 868.3,
                            chan: null,
                            rfch: 0,
                            stat: 0,
                            modu: 'LORA',
                            datr: 'SF11BW125',
                            codr: '4/5',
                            rssi: -102,
                            lsnr: 7.8,
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
