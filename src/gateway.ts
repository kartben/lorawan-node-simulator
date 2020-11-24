import { assert } from 'console';
import LoraPacket from 'lora-packet/out/lib/LoraPacket';
import PacketForwarder from 'packet-forwarder';

type GatewayEUID = Buffer

class Gateway {
    gatewayEUID: GatewayEUID
    networkServer: URL
    
    private _packetForwarder: PacketForwarder
    
    constructor(gatewayEUID: GatewayEUID, networkServer: URL) {
        this.gatewayEUID = gatewayEUID
        this.networkServer = networkServer
        
        this._packetForwarder = new PacketForwarder({ gateway: gatewayEUID.toString('hex'), target: 'ttnv3-stack-whmrzhtjgy2lm.eastus.cloudapp.azure.com', port: 1700 })
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
            console.log("Sending packet");
            await this._packetForwarder.sendUplink(message);
        }
    }
}

export { Gateway }