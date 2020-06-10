import BigNumber from 'bignumber.js';
export declare const ETH = "ETH";
export declare enum SUPPORTED_CHAIN_ID {
    Mainnet = 1,
    Ropsten = 3,
    Rinkeby = 4,
    Kovan = 42
}
export declare const FACTORY_ADDRESS: {
    [key: number]: string;
};
export declare const FACTORY_ABI: string;
export declare const EXCHANGE_ABI: string;
export declare enum TRADE_TYPE {
    ETH_TO_TOKEN = "ETH_TO_TOKEN",
    TOKEN_TO_ETH = "TOKEN_TO_ETH",
    TOKEN_TO_TOKEN = "TOKEN_TO_TOKEN"
}
export declare enum TRADE_EXACT {
    INPUT = "INPUT",
    OUTPUT = "OUTPUT"
}
export declare enum TRADE_METHODS {
    ethToTokenSwapInput = "ethToTokenSwapInput",
    ethToTokenTransferInput = "ethToTokenTransferInput",
    ethToTokenSwapOutput = "ethToTokenSwapOutput",
    ethToTokenTransferOutput = "ethToTokenTransferOutput",
    tokenToEthSwapInput = "tokenToEthSwapInput",
    tokenToEthTransferInput = "tokenToEthTransferInput",
    tokenToEthSwapOutput = "tokenToEthSwapOutput",
    tokenToEthTransferOutput = "tokenToEthTransferOutput",
    tokenToTokenSwapInput = "tokenToTokenSwapInput",
    tokenToTokenTransferInput = "tokenToTokenTransferInput",
    tokenToTokenSwapOutput = "tokenToTokenSwapOutput",
    tokenToTokenTransferOutput = "tokenToTokenTransferOutput"
}
export declare const TRADE_METHOD_IDS: {
    [key: string]: string;
};
export declare enum FIXED_UNDERFLOW_BEHAVIOR {
    ZERO = "ZERO",
    LESS_THAN = "LESS_THAN",
    ONE_DIGIT = "ONE_DIGIT"
}
export declare const _MAX_DECIMAL_PLACES = 18;
export declare const _ROUNDING_MODE: 4;
export declare const _0: BigNumber;
export declare const _1: BigNumber;
export declare const _10: BigNumber;
export declare const _997: BigNumber;
export declare const _1000: BigNumber;
export declare const _10000: BigNumber;
export declare const _MAX_UINT8 = 255;
export declare const _MAX_UINT256: BigNumber;
export declare const _CHAIN_ID_NAME: {
    [key: number]: string;
};
export declare const _ERC20_ABI: string;
