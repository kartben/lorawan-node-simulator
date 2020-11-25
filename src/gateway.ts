import LoraPacket from 'lora-packet/out/lib/LoraPacket';
import PacketForwarder from 'packet-forwarder';
import random from 'random';

type GatewayEUI = Buffer

const EU_868_UPLINK_CHANNELS = [868.1, 868.3, 868.5]
const EU_868_DATARATES = ['SF12BW125', 'SF11BW125', 'SF10BW125', 'SF9BW125', 'SF811BW125', 'SF7BW125']

const EU_868_TTN_UPLINK_CHANNELS = EU_868_UPLINK_CHANNELS.concat([867.1, 867.3, 867.5, 867.7, 867.9])
const EU_868_TTN_DATARATES = EU_868_DATARATES

const ALLOWED_UPLINK_CHANNELS = EU_868_UPLINK_CHANNELS
const ALLOWED_DATARATES = EU_868_DATARATES

type RandomGenFunction = () => number;


class Gateway {
    gatewayEUI: GatewayEUI
    networkServer: URL

    private _packetForwarder: PacketForwarder

    private _rssiRandomGenerator: RandomGenFunction
    private _lsnrRandomGenerator: RandomGenFunction

    constructor(gatewayEUI: GatewayEUI, networkServer: URL) {
        this.gatewayEUI = gatewayEUI
        this.networkServer = networkServer

        let pareto = random.pareto(.25)
        this._rssiRandomGenerator = () => { return -30 - (1 / pareto() * 90) }
        this._lsnrRandomGenerator = random.normal(3, 10)

        this._packetForwarder = new PacketForwarder({ gateway: gatewayEUI.toString('hex'), target: this.networkServer.hostname, port: parseInt(this.networkServer.port) })
        //this._packetForwarder.on('message', (msg) => { console.log(msg.toString('hex'))} ) 
    }

    async enqueueUplink(packet: LoraPacket) {
        let phyPayload = packet.getPHYPayload()

        if (phyPayload) {
            let data = phyPayload.toString('base64')

            const message = {
                rxpk: [{
                    time: new Date().toISOString(),
                    tmms: null,
                    tmst: (new Date().getTime() / 1000 | 0),
                    freq: (packet.getMType() == "Join Request") ? 868.1 : ALLOWED_UPLINK_CHANNELS[Math.floor(Math.random() * ALLOWED_UPLINK_CHANNELS.length)], // pick a random channel
                    chan: 2,
                    rfch: 0,
                    stat: 0,
                    modu: 'LORA',
                    datr: ALLOWED_DATARATES[Math.floor(Math.random() * ALLOWED_DATARATES.length)], // pick a random datarate
                    codr: '4/5',
                    rssi: Math.round(this._rssiRandomGenerator()),
                    lsnr: Math.round(this._lsnrRandomGenerator() * 10) / 10. ,
                    size: data.length,
                    data: data
                }]
            }
            console.log(`Gateway #${this.gatewayEUI.toString('hex')} is sending packet #${packet.getFCnt()} from device ${packet.DevAddr?.toString('hex')}`);
            await this._packetForwarder.sendUplink(message);
        }
    }
}

export { Gateway }