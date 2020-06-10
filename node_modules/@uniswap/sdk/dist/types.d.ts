import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { SUPPORTED_CHAIN_ID, TRADE_TYPE, TRADE_EXACT, FIXED_UNDERFLOW_BEHAVIOR } from './constants';
export declare type BigNumberish = BigNumber | ethers.utils.BigNumber | string | number;
export declare type ChainIdOrProvider = SUPPORTED_CHAIN_ID | ethers.providers.AsyncSendable | ethers.providers.Provider;
export declare function isChainId(chainIdOrProvider: ChainIdOrProvider): chainIdOrProvider is SUPPORTED_CHAIN_ID;
export declare function isLowLevelProvider(chainIdOrProvider: ChainIdOrProvider): chainIdOrProvider is ethers.providers.AsyncSendable;
export interface Token {
    chainId?: SUPPORTED_CHAIN_ID;
    address?: string;
    decimals: number;
}
export interface TokenAmount {
    token: Token;
    amount: BigNumberish;
}
export interface TokenAmountNormalized {
    token: Token;
    amount: BigNumber;
}
export interface TokenReserves {
    token: Token;
    exchange?: Token;
    ethReserve: TokenAmount;
    tokenReserve: TokenAmount;
}
export interface TokenReservesNormalized {
    token: Token;
    exchange?: Token;
    ethReserve: TokenAmountNormalized;
    tokenReserve: TokenAmountNormalized;
}
export interface EthReserves {
    token: Token;
}
export declare type OptionalReserves = TokenReserves | EthReserves | undefined;
export declare function areTokenReserves(reserves: OptionalReserves): reserves is TokenReserves;
export declare function areETHReserves(reserves: OptionalReserves): reserves is EthReserves;
export declare type NormalizedReserves = TokenReservesNormalized | EthReserves;
export declare function areTokenReservesNormalized(reserves: NormalizedReserves): reserves is TokenReservesNormalized;
export interface Rate {
    rate: BigNumber;
    rateInverted: BigNumber;
}
export interface MarketDetails {
    tradeType: TRADE_TYPE;
    inputReserves: NormalizedReserves;
    outputReserves: NormalizedReserves;
    marketRate: Rate;
}
export interface TradeDetails {
    marketDetailsPre: MarketDetails;
    marketDetailsPost: MarketDetails;
    tradeType: TRADE_TYPE;
    tradeExact: TRADE_EXACT;
    inputAmount: TokenAmountNormalized;
    outputAmount: TokenAmountNormalized;
    executionRate: Rate;
    marketRateSlippage: BigNumber;
    executionRateSlippage: BigNumber;
}
export declare type MethodArgument = BigNumber | number | string;
export interface ExecutionDetails {
    exchangeAddress: string;
    methodName: string;
    methodId: string;
    value: BigNumber;
    methodArguments: MethodArgument[];
}
export declare type FlexibleFormat = BigNumber.Format | boolean;
export declare function isFormat(flexibleFormat: FlexibleFormat): flexibleFormat is BigNumber.Format;
export interface FormatSignificantOptions {
    significantDigits: number;
    roundingMode: BigNumber.RoundingMode;
    forceIntegerSignificance: boolean;
    format: FlexibleFormat;
}
export interface FormatFixedOptions {
    decimalPlaces: number;
    roundingMode: BigNumber.RoundingMode;
    dropTrailingZeros: boolean;
    underflowBehavior: FIXED_UNDERFLOW_BEHAVIOR;
    format: FlexibleFormat;
}
export interface _ChainIdAndProvider {
    chainId: number;
    provider: ethers.providers.Provider;
}
export interface _ParsedOptionalReserves {
    tradeType: TRADE_TYPE;
    inputReserves: NormalizedReserves;
    outputReserves: NormalizedReserves;
}
export interface _DecimalRate {
    numerator: BigNumber;
    denominator: BigNumber;
    decimalScalar: BigNumber;
    decimalScalarInverted: BigNumber;
}
export declare type _AnyRate = _DecimalRate | Rate;
export interface _PartialTradeDetails {
    transput: BigNumber;
    inputReservesPost: NormalizedReserves;
    outputReservesPost: NormalizedReserves;
}
export interface _SlippageBounds {
    minimum: BigNumber;
    maximum: BigNumber;
}
export interface _PartialExecutionDetails {
    value: BigNumber;
    methodArguments: MethodArgument[];
}
