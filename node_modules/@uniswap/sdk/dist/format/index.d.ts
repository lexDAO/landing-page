import { BigNumberish, FormatSignificantOptions, FormatFixedOptions } from '../types';
export declare function formatSignificant(bigNumberish: BigNumberish, options?: FormatSignificantOptions): string;
export declare function formatFixed(bigNumberish: BigNumberish, options?: FormatFixedOptions): string;
export declare function formatSignificantDecimals(bigNumberish: BigNumberish, decimals: number, options?: FormatSignificantOptions): string;
export declare function formatFixedDecimals(bigNumberish: BigNumberish, decimals: number, options?: FormatFixedOptions): string;
