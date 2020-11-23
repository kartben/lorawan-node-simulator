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
const packet_forwarder_1 = __importDefault(require("packet-forwarder"));
const lora_packet_1 = __importDefault(require("lora-packet"));
/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
var fCnt = {};
var generatePacket = (devAddr) => {
    fCnt[devAddr] = fCnt[devAddr] || 0;
    var devAddrBuffer = Buffer.allocUnsafe(4);
    devAddrBuffer.writeUInt32BE(devAddr);
    var packet = lora_packet_1.default.fromFields({
        MType: "Confirmed Data Up",
        DevAddr: devAddrBuffer,
        FCtrl: {
            ADR: false,
            ACK: false,
            ADRACKReq: false,
            FPending: false,
        },
        FPort: 1,
        FCnt: fCnt[devAddr]++,
        payload: "test",
    }, Buffer.from("4F58A13D1F44D307AFACD65A0A5DDF06", "hex"), // AppSKey
    Buffer.from("4F58A13D1F44D307AFACD65A0A5DDF06", "hex") // NwkSKey
    );
    return packet;
};
function sendFakeUplink(devAddr) {
    return __awaiter(this, void 0, void 0, function* () {
        let phyPayload = generatePacket(devAddr).getPHYPayload();
        if (phyPayload) {
            let data = phyPayload.toString('base64');
            const gateway = '4546456456456456';
            const target = 'ttnv3-stack-whmrzhtjgy2lm.eastus.cloudapp.azure.com';
            const port = 1700;
            const packetForwarder = new packet_forwarder_1.default({ gateway, target, port });
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
                        size: 16,
                        data: data
                    }]
            };
            console.log("Sending packet #%d for Device #%d", fCnt[devAddr], devAddr);
            yield packetForwarder.sendUplink(message);
            yield packetForwarder.close();
            setTimeout(() => { sendFakeUplink(devAddr); }, getRandomArbitrary(8000, 14000));
        }
    });
}
for (let i = 1225; i < 5000; i++) {
    setTimeout(() => { sendFakeUplink(i); }, getRandomArbitrary(0, 30000));
}
