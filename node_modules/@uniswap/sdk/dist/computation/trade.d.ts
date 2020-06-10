import { BigNumberish, MarketDetails, TradeDetails } from '../types';
import { TRADE_EXACT } from '../constants';
export declare function getTradeDetails(tradeExact: TRADE_EXACT, _tradeAmount: BigNumberish, marketDetails: MarketDetails): TradeDetails;
