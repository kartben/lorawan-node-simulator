"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndNodeOtaa = void 0;
const crypto_1 = require("crypto");
const lora_packet_1 = __importDefault(require("lora-packet"));
const end_node_1 = require("./end-node");
class EndNodeOtaa extends end_node_1.EndNode {
    constructor(devEUI, appEUI) {
        super(crypto_1.randomBytes(1), crypto_1.randomBytes(2), crypto_1.randomBytes(3));
        this._devEUI = devEUI;
        this._appEUI = appEUI;
    }
    getJoinRequestPacket() {
        let packet = lora_packet_1.default.fromFields({
            MType: 'Join Request',
            AppEUI: this._appEUI,
            DevEUI: this._devEUI,
            DevNonce: crypto_1.randomBytes(2)
        });
        return packet;
    }
}
exports.EndNodeOtaa = EndNodeOtaa;
//# sourceMappingURL=end-node-otaa.js.map