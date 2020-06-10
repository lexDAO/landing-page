import { TradeDetails, ExecutionDetails } from '../types';
export declare function getExecutionDetails(trade: TradeDetails, maxSlippage?: number, deadline?: number, recipient?: string): ExecutionDetails;
