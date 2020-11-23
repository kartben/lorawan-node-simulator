declare module 'packet-forwarder' {
    export default class PacketForwarder {
            /**
             *
             * @param {string} gatewayEui Gateway EUI used to deliver uplink message
             * @param {object} message Packet forwarder JSON uplink message
             * @param {string} target Network Server UDP address
             * @param {number} port Network Server UDP port
             * @param {number} clientUdpPort packet forwarder client UDP port
             */
            constructor(args: { gateway: string, target: string, port: number, clientUdpPort?: number});
            
            /**
             * Send UDP packet to Network Server
             *
             * @async
             * @function sendUdpPacket
             * @param {object} message Packet forwarder JSON uplink message
             */
            sendUplink(message: object): Promise<void>;
            close(): Promise<void>;
        }
        import dgram = require("dgram");
    
};
