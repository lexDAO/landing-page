"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var constants_1 = require("../constants");
function calculateDecimalRate(numerator, denominator, keepAsDecimal) {
    if (keepAsDecimal === void 0) { keepAsDecimal = false; }
    var largerScalar = constants_1._10.exponentiatedBy(new bignumber_js_1.default(Math.abs(numerator.token.decimals - denominator.token.decimals)));
    var smallerScalar = largerScalar.isEqualTo(constants_1._1)
        ? constants_1._1
        : new bignumber_js_1.default("0." + '0'.repeat(largerScalar.toFixed().length - 2) + "1");
    var invertedIsLarger = numerator.token.decimals - denominator.token.decimals > 0;
    var decimalRate = {
        numerator: numerator.amount,
        denominator: denominator.amount,
        decimalScalar: invertedIsLarger ? smallerScalar : largerScalar,
        decimalScalarInverted: invertedIsLarger ? largerScalar : smallerScalar
    };
    return keepAsDecimal
        ? decimalRate
        : {
            rate: decimalRate.numerator.multipliedBy(decimalRate.decimalScalar).dividedBy(decimalRate.denominator),
            rateInverted: decimalRate.denominator
                .multipliedBy(decimalRate.decimalScalarInverted)
                .dividedBy(decimalRate.numerator)
        };
}
exports.calculateDecimalRate = calculateDecimalRate;
//# sourceMappingURL=_utils.js.map