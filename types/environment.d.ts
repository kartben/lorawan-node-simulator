declare namespace NodeJS {
  export interface ProcessEnv {
    NETWORK_SERVER_URI: string;

    NETWORK_SESSION_KEY: string;
    APPLICATION_SESSION_KEY: string;

    GATEWAY_START_EUI?: string;
    GATEWAY_END_EUI?: string;
    
    END_NODE_START_DEVADDR?: string;
    END_NODE_END_DEVADDR?: string;
    END_NODE_TX_PERIOD?: string;
  }
}
