"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var constants_1 = require("../constants");
var _utils_1 = require("../_utils");
function removeUndefined(methodArguments) {
    return methodArguments.filter(function (a) { return a !== undefined; });
}
function calculateSlippage(value, maxSlippage) {
    var offset = value.multipliedBy(maxSlippage).dividedBy(constants_1._10000);
    var minimum = value.minus(offset).integerValue(bignumber_js_1.default.ROUND_FLOOR);
    var maximum = value.plus(offset).integerValue(bignumber_js_1.default.ROUND_CEIL);
    return {
        minimum: minimum.isLessThan(constants_1._0) ? constants_1._0 : minimum,
        maximum: maximum.isGreaterThan(constants_1._MAX_UINT256) ? constants_1._MAX_UINT256 : maximum
    };
}
function getReserves(trade) {
    switch (trade.tradeType) {
        case constants_1.TRADE_TYPE.ETH_TO_TOKEN: {
            return trade.marketDetailsPre.outputReserves;
        }
        case constants_1.TRADE_TYPE.TOKEN_TO_ETH: {
            return trade.marketDetailsPre.inputReserves;
        }
        case constants_1.TRADE_TYPE.TOKEN_TO_TOKEN: {
            return trade.marketDetailsPre.inputReserves;
        }
        default: {
            throw Error("tradeType " + trade.tradeType + " is invalid.");
        }
    }
}
function getMethodName(trade, transfer) {
    if (transfer === void 0) { transfer = false; }
    switch (trade.tradeType) {
        case constants_1.TRADE_TYPE.ETH_TO_TOKEN: {
            if (trade.tradeExact === constants_1.TRADE_EXACT.INPUT && !transfer) {
                return constants_1.TRADE_METHODS.ethToTokenSwapInput;
            }
            else if (trade.tradeExact === constants_1.TRADE_EXACT.INPUT && transfer) {
                return constants_1.TRADE_METHODS.ethToTokenTransferInput;
            }
            else if (trade.tradeExact === constants_1.TRADE_EXACT.OUTPUT && !transfer) {
                return constants_1.TRADE_METHODS.ethToTokenSwapOutput;
            }
            else {
                return constants_1.TRADE_METHODS.ethToTokenTransferOutput;
            }
        }
        case constants_1.TRADE_TYPE.TOKEN_TO_ETH: {
            if (trade.tradeExact === constants_1.TRADE_EXACT.INPUT && !transfer) {
                return constants_1.TRADE_METHODS.tokenToEthSwapInput;
            }
            else if (trade.tradeExact === constants_1.TRADE_EXACT.INPUT && transfer) {
                return constants_1.TRADE_METHODS.tokenToEthTransferInput;
            }
            else if (trade.tradeExact === constants_1.TRADE_EXACT.OUTPUT && !transfer) {
                return constants_1.TRADE_METHODS.tokenToEthSwapOutput;
            }
            else {
                return constants_1.TRADE_METHODS.tokenToEthTransferOutput;
            }
        }
        case constants_1.TRADE_TYPE.TOKEN_TO_TOKEN: {
            if (trade.tradeExact === constants_1.TRADE_EXACT.INPUT && !transfer) {
                return constants_1.TRADE_METHODS.tokenToTokenSwapInput;
            }
            else if (trade.tradeExact === constants_1.TRADE_EXACT.INPUT && transfer) {
                return constants_1.TRADE_METHODS.tokenToTokenTransferInput;
            }
            else if (trade.tradeExact === constants_1.TRADE_EXACT.OUTPUT && !transfer) {
                return constants_1.TRADE_METHODS.tokenToTokenSwapOutput;
            }
            else {
                return constants_1.TRADE_METHODS.tokenToTokenTransferOutput;
            }
        }
        default: {
            throw Error("tradeType " + trade.tradeType + " is invalid.");
        }
    }
}
function getValueAndMethodArguments(trade, methodName, maxSlippage, deadline, recipient) {
    switch (methodName) {
        case constants_1.TRADE_METHODS.ethToTokenSwapInput:
        case constants_1.TRADE_METHODS.ethToTokenTransferInput: {
            return {
                value: trade.inputAmount.amount,
                methodArguments: removeUndefined([
                    calculateSlippage(trade.outputAmount.amount, maxSlippage).minimum,
                    deadline,
                    recipient
                ])
            };
        }
        case constants_1.TRADE_METHODS.ethToTokenSwapOutput:
        case constants_1.TRADE_METHODS.ethToTokenTransferOutput: {
            return {
                value: calculateSlippage(trade.inputAmount.amount, maxSlippage).maximum,
                methodArguments: removeUndefined([trade.outputAmount.amount, deadline, recipient])
            };
        }
        case constants_1.TRADE_METHODS.tokenToEthSwapInput:
        case constants_1.TRADE_METHODS.tokenToEthTransferInput: {
            return {
                value: constants_1._0,
                methodArguments: removeUndefined([
                    trade.inputAmount.amount,
                    calculateSlippage(trade.outputAmount.amount, maxSlippage).minimum,
                    deadline,
                    recipient
                ])
            };
        }
        case constants_1.TRADE_METHODS.tokenToEthSwapOutput:
        case constants_1.TRADE_METHODS.tokenToEthTransferOutput: {
            return {
                value: constants_1._0,
                methodArguments: removeUndefined([
                    trade.outputAmount.amount,
                    calculateSlippage(trade.inputAmount.amount, maxSlippage).maximum,
                    deadline,
                    recipient
                ])
            };
        }
        case constants_1.TRADE_METHODS.tokenToTokenSwapInput:
        case constants_1.TRADE_METHODS.tokenToTokenTransferInput: {
            if (!trade.outputAmount.token.address) {
                throw Error('trade does not include output token address.');
            }
            return {
                value: constants_1._0,
                methodArguments: removeUndefined([
                    trade.inputAmount.amount,
                    calculateSlippage(trade.outputAmount.amount, maxSlippage).minimum,
                    constants_1._1,
                    deadline,
                    recipient,
                    trade.outputAmount.token.address
                ])
            };
        }
        case constants_1.TRADE_METHODS.tokenToTokenSwapOutput:
        case constants_1.TRADE_METHODS.tokenToTokenTransferOutput: {
            if (!trade.outputAmount.token.address) {
                throw Error('trade does not include output token address.');
            }
            return {
                value: constants_1._0,
                methodArguments: removeUndefined([
                    trade.outputAmount.amount,
                    calculateSlippage(trade.inputAmount.amount, maxSlippage).maximum,
                    constants_1._MAX_UINT256,
                    deadline,
                    recipient,
                    trade.outputAmount.token.address
                ])
            };
        }
        default: {
            throw Error("methodName " + methodName + " is invalid.");
        }
    }
}
function getExecutionDetails(trade, maxSlippage, deadline, recipient) {
    var reserves = getReserves(trade);
    if (!reserves.exchange || !reserves.exchange.address) {
        throw Error('trade does not include exchange address.');
    }
    var methodName = getMethodName(trade, !!recipient);
    var methodId = constants_1.TRADE_METHOD_IDS[methodName];
    var _a = getValueAndMethodArguments(trade, methodName, maxSlippage || 200, deadline || Math.round(Date.now() / 1000 + 60 * 10), recipient && _utils_1.normalizeAddress(recipient)), value = _a.value, methodArguments = _a.methodArguments;
    return {
        exchangeAddress: reserves.exchange.address,
        methodName: methodName,
        methodId: methodId,
        value: value,
        methodArguments: methodArguments
    };
}
exports.getExecutionDetails = getExecutionDetails;
//# sourceMappingURL=index.js.map