import { randomInt, randomBytes } from "crypto"
import lora_packet from 'lora-packet'
import LoraPacket from "lora-packet/out/lib/LoraPacket"
import { EndNode } from './end-node'

type AppEUI = Buffer
type DevEUI = Buffer

class EndNodeOtaa extends EndNode {
    private _devEUI: DevEUI
    private _appEUI: AppEUI

    constructor(devEUI: DevEUI, appEUI: AppEUI) {
        super(randomBytes(1), randomBytes(2), randomBytes(3))
        this._devEUI = devEUI
        this._appEUI = appEUI
    }

    public getJoinRequestPacket(): LoraPacket {
        let packet = lora_packet.fromFields({
            MType: 'Join Request',
            AppEUI: this._appEUI,
            DevEUI: this._devEUI,
            DevNonce: randomBytes(2)
        })

        return packet;
    }
}

export { EndNodeOtaa };