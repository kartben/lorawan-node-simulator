import { assert } from 'console';
import LoraPacket from 'lora-packet/out/lib/LoraPacket';
import PacketForwarder from 'packet-forwarder';

type GatewayEUID = Buffer

class Gateway {
    gatewayEUID: GatewayEUID
    networkServer: URL
    
    private _packetForwarder: PacketForwarder
    
    constructor(gatewayEUID: GatewayEUID, networkServer: URL) {
        console.log(networkServer)
        this.gatewayEUID = gatewayEUID
        this.networkServer = networkServer
        
        this._packetForwarder = new PacketForwarder({ gateway: gatewayEUID.toString('hex'), target: this.networkServer.hostname, port: parseInt(this.networkServer.port) })
    }
    
    async enqueueUplink(packet: LoraPacket) {
        let phyPayload = packet.getPHYPayload()

        if(phyPayload) {
            let data = phyPayload.toString('base64')

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
            }
            console.log(`Gateway #${this.gatewayEUID.readBigUInt64BE()} is sending packet #${packet.getFCnt()} from device ${packet.DevAddr?.readInt32BE()}`);
            await this._packetForwarder.sendUplink(message);
        }
    }
}

export { Gateway }