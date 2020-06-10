"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
function isChainId(chainIdOrProvider) {
    var chainId = chainIdOrProvider;
    return typeof chainId === 'number';
}
exports.isChainId = isChainId;
function isLowLevelProvider(chainIdOrProvider) {
    if (isChainId(chainIdOrProvider)) {
        return false;
    }
    else {
        var provider = chainIdOrProvider;
        return !ethers_1.ethers.providers.Provider.isProvider(provider);
    }
}
exports.isLowLevelProvider = isLowLevelProvider;
function areTokenReserves(reserves) {
    var tokenReserves = reserves;
    return (tokenReserves !== undefined && tokenReserves.ethReserve !== undefined && tokenReserves.tokenReserve !== undefined);
}
exports.areTokenReserves = areTokenReserves;
function areETHReserves(reserves) {
    var tokenReserves = reserves;
    return (tokenReserves !== undefined && tokenReserves.ethReserve === undefined && tokenReserves.tokenReserve === undefined);
}
exports.areETHReserves = areETHReserves;
function areTokenReservesNormalized(reserves) {
    var tokenReservesNormalized = reserves;
    return tokenReservesNormalized.ethReserve !== undefined && tokenReservesNormalized.tokenReserve !== undefined;
}
exports.areTokenReservesNormalized = areTokenReservesNormalized;
function isFormat(flexibleFormat) {
    var format = flexibleFormat;
    return typeof format !== 'boolean';
}
exports.isFormat = isFormat;
//# sourceMappingURL=types.js.map