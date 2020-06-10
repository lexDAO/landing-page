import BigNumber from 'bignumber.js';
import { BigNumberish, Token } from '../types';
export declare function ensureAllUInt8(numbers: number[]): void;
export declare function ensureAllUInt256(bigNumbers: BigNumber[]): void;
export declare function ensureBoundedInteger(number: number, bounds: number | number[]): void;
export declare function normalizeBigNumberish(bigNumberish: BigNumberish): BigNumber;
export declare function normalizeAddress(address: string): string;
export declare function getEthToken(chainId?: number): Token;
