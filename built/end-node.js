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
exports.EndNode = void 0;
const events_1 = require("events");
const lora_packet_1 = __importDefault(require("lora-packet"));
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
class EndNode extends events_1.EventEmitter {
    constructor(devAddr, nwkKey, appKey) {
        super();
        this.frameCnt = 0;
        this._simRunning = false;
        this._simTimer = null;
        this.devAddr = devAddr;
        this._nwkKey = nwkKey;
        this._appKey = appKey;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this._simTimer = setTimeout(() => { this._sendPacket(); }, getRandomArbitrary(0, 10000));
            this._simRunning = true;
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._simTimer) {
                clearTimeout(this._simTimer);
            }
            this._simRunning = false;
        });
    }
    _sendPacket() {
        this.emit('packet', this._generateLoRaPacket());
        if (this._simRunning) {
            this._simTimer = setTimeout(() => { this._sendPacket(); }, getRandomArbitrary(20000, 25000));
        }
    }
    _generateLoRaPacket() {
        var packet = lora_packet_1.default.fromFields({
            MType: "Unconfirmed Data Up",
            DevAddr: this.devAddr,
            FCtrl: {
                ADR: false,
                ACK: false,
                ADRACKReq: false,
                FPending: false,
            },
            FPort: 1,
            FCnt: this.frameCnt++,
            payload: "test"
        }, this._appKey, this._nwkKey);
        return packet;
    }
}
exports.EndNode = EndNode;
