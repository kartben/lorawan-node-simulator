import { EventEmitter } from "events"
import lora_packet from 'lora-packet'
import LoraPacket from "lora-packet/out/lib/LoraPacket"
import random from 'random';


type DevAddr = Buffer
type NwkKey = Buffer
type AppKey = Buffer

class EndNode extends EventEmitter {
    devAddr: DevAddr

    private _nwkKey: NwkKey
    private _appKey: AppKey
    private frameCnt: number = 44

    private _simRunning: Boolean = false
    private _simTimer: NodeJS.Timeout | null = null

    constructor(devAddr: DevAddr, nwkKey: NwkKey, appKey: AppKey) {
        super()
        this.devAddr = devAddr
        this._nwkKey = nwkKey
        this._appKey = appKey
    }

    async start() {
        this._simTimer = setTimeout(() => { this._sendPacket() }, random.int(5000));
        this._simRunning = true
    }

    async stop() {
        if (this._simTimer) {
            clearTimeout(this._simTimer)
        }
        this._simRunning = false
    }

    private _sendPacket() {
        this.emit('packet', this._generateLoRaPacket())
        if (this._simRunning) {
            this._simTimer = setTimeout(() => { this._sendPacket() }, random.int(10000, 20000)); // communicate every 10 to 20 seconds
        }
    }

    private _generateLoRaPacket(): LoraPacket {
        let packet = lora_packet.fromFields(
            {
                MType: "Confirmed Data Up", // (default)
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
            },
            this._appKey,
            this._nwkKey
        );
        return packet;
    }
}

export { EndNode };