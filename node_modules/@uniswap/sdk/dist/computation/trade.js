"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var lodash_clonedeepwith_1 = __importDefault(require("lodash.clonedeepwith"));
var types_1 = require("../types");
var constants_1 = require("../constants");
var _utils_1 = require("../_utils");
var _utils_2 = require("./_utils");
var market_1 = require("./market");
function getInputPrice(inputAmount, inputReserve, outputReserve) {
    _utils_1.ensureAllUInt256([inputAmount, inputReserve, outputReserve]);
    if (inputReserve.isLessThanOrEqualTo(constants_1._0) || outputReserve.isLessThanOrEqualTo(constants_1._0)) {
        throw Error("Both inputReserve '" + inputReserve + "' and outputReserve '" + outputReserve + "' must be non-zero.");
    }
    var inputAmountWithFee = inputAmount.multipliedBy(constants_1._997);
    var numerator = inputAmountWithFee.multipliedBy(outputReserve);
    var denominator = inputReserve.multipliedBy(constants_1._1000).plus(inputAmountWithFee);
    var outputAmount = numerator.dividedToIntegerBy(denominator);
    _utils_1.ensureAllUInt256([inputAmountWithFee, numerator, denominator, outputAmount]);
    return outputAmount;
}
function getOutputPrice(outputAmount, inputReserve, outputReserve) {
    _utils_1.ensureAllUInt256([outputAmount, inputReserve, outputReserve]);
    if (inputReserve.isLessThanOrEqualTo(constants_1._0) || outputReserve.isLessThanOrEqualTo(constants_1._0)) {
        throw Error("Both inputReserve '" + inputReserve + "' and outputReserve '" + outputReserve + "' must be non-zero.");
    }
    var numerator = inputReserve.multipliedBy(outputAmount).multipliedBy(constants_1._1000);
    var denominator = outputReserve.minus(outputAmount).multipliedBy(constants_1._997);
    var inputAmount = numerator.dividedToIntegerBy(denominator).plus(constants_1._1);
    _utils_1.ensureAllUInt256([numerator, denominator, inputAmount]);
    return inputAmount;
}
function getSingleTradeTransput(tradeType, tradeExact, tradeAmount, reserves) {
    if (!types_1.areTokenReservesNormalized(reserves)) {
        throw Error;
    }
    var inputReserve = tradeType === constants_1.TRADE_TYPE.ETH_TO_TOKEN ? reserves.ethReserve.amount : reserves.tokenReserve.amount;
    var outputReserve = tradeType === constants_1.TRADE_TYPE.ETH_TO_TOKEN ? reserves.tokenReserve.amount : reserves.ethReserve.amount;
    var calculatedAmount = tradeExact === constants_1.TRADE_EXACT.INPUT
        ? getInputPrice(tradeAmount, inputReserve, outputReserve)
        : getOutputPrice(tradeAmount, inputReserve, outputReserve);
    return calculatedAmount;
}
function customizer(value) {
    if (bignumber_js_1.default.isBigNumber(value)) {
        return new bignumber_js_1.default(value);
    }
}
function getTradeTransput(tradeType, tradeExact, tradeAmount, inputReserves, outputReserves) {
    var inputReservesPost = lodash_clonedeepwith_1.default(inputReserves, customizer);
    var outputReservesPost = lodash_clonedeepwith_1.default(outputReserves, customizer);
    if (tradeType === constants_1.TRADE_TYPE.TOKEN_TO_TOKEN) {
        if (!types_1.areTokenReservesNormalized(inputReservesPost) || !types_1.areTokenReservesNormalized(outputReservesPost)) {
            throw Error;
        }
        if (tradeExact === constants_1.TRADE_EXACT.INPUT) {
            var intermediateTransput = getSingleTradeTransput(constants_1.TRADE_TYPE.TOKEN_TO_ETH, constants_1.TRADE_EXACT.INPUT, tradeAmount, inputReserves);
            var finalTransput = getSingleTradeTransput(constants_1.TRADE_TYPE.ETH_TO_TOKEN, constants_1.TRADE_EXACT.INPUT, intermediateTransput, outputReserves);
            inputReservesPost.ethReserve.amount = inputReservesPost.ethReserve.amount.minus(intermediateTransput);
            inputReservesPost.tokenReserve.amount = inputReservesPost.tokenReserve.amount.plus(tradeAmount);
            outputReservesPost.ethReserve.amount = outputReservesPost.ethReserve.amount.plus(intermediateTransput);
            outputReservesPost.tokenReserve.amount = outputReservesPost.tokenReserve.amount.minus(finalTransput);
            return {
                transput: finalTransput,
                inputReservesPost: inputReservesPost,
                outputReservesPost: outputReservesPost
            };
        }
        else {
            var intermediateTransput = getSingleTradeTransput(constants_1.TRADE_TYPE.ETH_TO_TOKEN, constants_1.TRADE_EXACT.OUTPUT, tradeAmount, outputReserves);
            var finalTransput = getSingleTradeTransput(constants_1.TRADE_TYPE.TOKEN_TO_ETH, constants_1.TRADE_EXACT.OUTPUT, intermediateTransput, inputReserves);
            inputReservesPost.ethReserve.amount = inputReservesPost.ethReserve.amount.minus(intermediateTransput);
            inputReservesPost.tokenReserve.amount = inputReservesPost.tokenReserve.amount.plus(finalTransput);
            outputReservesPost.ethReserve.amount = outputReservesPost.ethReserve.amount.plus(intermediateTransput);
            outputReservesPost.tokenReserve.amount = outputReservesPost.tokenReserve.amount.minus(tradeAmount);
            return {
                transput: finalTransput,
                inputReservesPost: inputReservesPost,
                outputReservesPost: outputReservesPost
            };
        }
    }
    else {
        var reserves = tradeType === constants_1.TRADE_TYPE.ETH_TO_TOKEN ? outputReserves : inputReserves;
        var finalTransput = getSingleTradeTransput(tradeType, tradeExact, tradeAmount, reserves);
        if (tradeType === constants_1.TRADE_TYPE.ETH_TO_TOKEN) {
            if (!types_1.areTokenReservesNormalized(outputReservesPost)) {
                throw Error;
            }
            outputReservesPost.ethReserve.amount = outputReservesPost.ethReserve.amount.plus(tradeExact === constants_1.TRADE_EXACT.INPUT ? tradeAmount : finalTransput);
            outputReservesPost.tokenReserve.amount = outputReservesPost.tokenReserve.amount.minus(tradeExact === constants_1.TRADE_EXACT.INPUT ? finalTransput : tradeAmount);
        }
        else {
            if (!types_1.areTokenReservesNormalized(inputReservesPost)) {
                throw Error;
            }
            inputReservesPost.ethReserve.amount = inputReservesPost.ethReserve.amount.minus(tradeExact === constants_1.TRADE_EXACT.INPUT ? finalTransput : tradeAmount);
            inputReservesPost.tokenReserve.amount = inputReservesPost.tokenReserve.amount.plus(tradeExact === constants_1.TRADE_EXACT.INPUT ? tradeAmount : finalTransput);
        }
        return {
            transput: finalTransput,
            inputReservesPost: inputReservesPost,
            outputReservesPost: outputReservesPost
        };
    }
}
function calculateSlippage(baseRate, newRate) {
    var difference = baseRate.minus(newRate).absoluteValue();
    return difference.multipliedBy(constants_1._10000).dividedBy(baseRate);
}
function getTradeDetails(tradeExact, _tradeAmount, marketDetails) {
    var tradeAmount = _utils_1.normalizeBigNumberish(_tradeAmount);
    var _a = getTradeTransput(marketDetails.tradeType, tradeExact, tradeAmount, marketDetails.inputReserves, marketDetails.outputReserves), transput = _a.transput, inputReservesPost = _a.inputReservesPost, outputReservesPost = _a.outputReservesPost;
    var inputAmount = {
        token: marketDetails.inputReserves.token,
        amount: tradeExact === constants_1.TRADE_EXACT.INPUT ? tradeAmount : transput
    };
    var outputAmount = {
        token: marketDetails.outputReserves.token,
        amount: tradeExact === constants_1.TRADE_EXACT.INPUT ? transput : tradeAmount
    };
    var marketDetailsPost = market_1.getMarketDetails(inputReservesPost, outputReservesPost);
    var executionRate = _utils_2.calculateDecimalRate(outputAmount, inputAmount);
    var marketRateSlippage = calculateSlippage(marketDetails.marketRate.rate, marketDetailsPost.marketRate.rate);
    var executionRateSlippage = calculateSlippage(marketDetails.marketRate.rate, executionRate.rate);
    return {
        marketDetailsPre: marketDetails,
        marketDetailsPost: marketDetailsPost,
        tradeType: marketDetails.tradeType,
        tradeExact: tradeExact,
        inputAmount: inputAmount,
        outputAmount: outputAmount,
        executionRate: executionRate,
        marketRateSlippage: marketRateSlippage,
        executionRateSlippage: executionRateSlippage
    };
}
exports.getTradeDetails = getTradeDetails;
//# sourceMappingURL=trade.js.map