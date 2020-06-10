import { ChainIdOrProvider, TokenReservesNormalized } from '../types';
export declare function getTokenReserves(tokenAddress: string, chainIdOrProvider?: ChainIdOrProvider): Promise<TokenReservesNormalized>;
