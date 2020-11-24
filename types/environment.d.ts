declare global {
    namespace NodeJS {
      interface ProcessEnv {
        GATEWAY_START_EUID?: string;
        GATEWAY_END_EUID?: string;
        END_NODE_START_DEVADDR?: string;
        END_NODE_END_DEVADDR?: string;
        NETWORK_SERVER_URI?: string;
      }
    }
  }