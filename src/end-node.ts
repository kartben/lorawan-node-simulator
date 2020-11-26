import { EventEmitter } from "events"
import lora_packet from 'lora-packet'
import LoraPacket from "lora-packet/out/lib/LoraPacket"
import random from 'random';

type DevAddr = Buffer
type NwkKey = Buffer
type AppKey = Buffer

interface EndNodeOptions {
    txPeriod: number;
}

class EndNode extends EventEmitter {
    devAddr: DevAddr

    private _nwkKey: NwkKey
    private _appKey: AppKey
    private _options: EndNodeOptions
    private _frameCnt: number = 0

    private _simRunning: Boolean = false
    private _simTimer: NodeJS.Timeout | null = null
    private _randomTransmitPeriodGenerator: () => number;

    constructor(devAddr: DevAddr, nwkKey: NwkKey, appKey: AppKey, options: EndNodeOptions = {
        txPeriod: 10000
    }) {
        super()
        this.devAddr = devAddr
        this._nwkKey = nwkKey
        this._appKey = appKey
        this._options = options

        this._randomTransmitPeriodGenerator = random.normal(this._options.txPeriod, this._options.txPeriod * .2);
    }

    async start() {
        this._simTimer = setTimeout(() => { this._sendPacket() }, random.int(this._options.txPeriod)); // emit first packet after at a random time between now and now+transmitPeriod ms
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
            let transmitDelay = Math.min(Math.max(0, this._randomTransmitPeriodGenerator()), this._options.txPeriod * 2)
            this._simTimer = setTimeout(() => { this._sendPacket() }, transmitDelay);
        }
    }

    private _generateLoRaPacket(): LoraPacket {
        let packet = lora_packet.fromFields(
            {
                MType: "Unconfirmed Data Up", // (default)
                DevAddr: this.devAddr,
                FCtrl: {
                    ADR: false,
                    ACK: false,
                    ADRACKReq: false,
                    FPending: false,
                },
                FPort: 1,
                FCnt: this._frameCnt++,
                payload: "test"
            },
            this._appKey,
            this._nwkKey
        );
        return packet;
    }
}

export { EndNode };