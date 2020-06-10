"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var types_1 = require("../types");
var constants_1 = require("../constants");
var _utils_1 = require("../_utils");
function _format(bigNumber, decimalPlaces, roundingMode, format) {
    if (roundingMode === void 0) { roundingMode = constants_1._ROUNDING_MODE; }
    return types_1.isFormat(format) || format
        ? bigNumber.toFormat(decimalPlaces, roundingMode, types_1.isFormat(format) ? format : undefined)
        : bigNumber.toFixed(decimalPlaces, roundingMode);
}
function formatSignificant(bigNumberish, options) {
    var _a = options || {}, _b = _a.significantDigits, significantDigits = _b === void 0 ? 6 : _b, _c = _a.roundingMode, roundingMode = _c === void 0 ? constants_1._ROUNDING_MODE : _c, _d = _a.forceIntegerSignificance, forceIntegerSignificance = _d === void 0 ? true : _d, _e = _a.format, format = _e === void 0 ? false : _e;
    var bigNumber = _utils_1.normalizeBigNumberish(bigNumberish);
    _utils_1.ensureBoundedInteger(significantDigits, [1, constants_1._MAX_DECIMAL_PLACES]);
    var minimumSignificantDigits = forceIntegerSignificance ? bigNumber.integerValue().toFixed().length : 0;
    var preciseBigNumber = new bignumber_js_1.default(bigNumber.toPrecision(Math.max(minimumSignificantDigits, significantDigits)));
    return _format(preciseBigNumber, preciseBigNumber.decimalPlaces(), roundingMode, format);
}
exports.formatSignificant = formatSignificant;
function formatFixed(bigNumberish, options) {
    var _a = options || {}, _b = _a.decimalPlaces, decimalPlaces = _b === void 0 ? 4 : _b, _c = _a.roundingMode, roundingMode = _c === void 0 ? constants_1._ROUNDING_MODE : _c, _d = _a.dropTrailingZeros, dropTrailingZeros = _d === void 0 ? true : _d, _e = _a.underflowBehavior, underflowBehavior = _e === void 0 ? constants_1.FIXED_UNDERFLOW_BEHAVIOR.ONE_DIGIT : _e, _f = _a.format, format = _f === void 0 ? false : _f;
    var bigNumber = _utils_1.normalizeBigNumberish(bigNumberish);
    _utils_1.ensureBoundedInteger(decimalPlaces, constants_1._MAX_DECIMAL_PLACES);
    var minimumNonZeroValue = new bignumber_js_1.default(decimalPlaces === 0 ? '0.5' : "0." + '0'.repeat(decimalPlaces) + "5");
    if (bigNumber.isLessThan(minimumNonZeroValue)) {
        switch (underflowBehavior) {
            case constants_1.FIXED_UNDERFLOW_BEHAVIOR.ZERO: {
                return _format(constants_1._0, dropTrailingZeros ? 0 : decimalPlaces, undefined, format);
            }
            case constants_1.FIXED_UNDERFLOW_BEHAVIOR.LESS_THAN: {
                return "<" + _format(minimumNonZeroValue, minimumNonZeroValue.decimalPlaces(), undefined, format);
            }
            case constants_1.FIXED_UNDERFLOW_BEHAVIOR.ONE_DIGIT: {
                var newBigNumber = new bignumber_js_1.default(bigNumber.toPrecision(1));
                return _format(newBigNumber, newBigNumber.decimalPlaces(), undefined, format);
            }
            default: {
                throw Error("Passed FIXED_UNDERFLOW_BEHAVIOR " + underflowBehavior + " is not valid.");
            }
        }
    }
    else {
        var newDecimalPlaces = dropTrailingZeros
            ? new bignumber_js_1.default(bigNumber.toFixed(decimalPlaces, roundingMode)).decimalPlaces()
            : decimalPlaces;
        return _format(bigNumber, newDecimalPlaces, roundingMode, format);
    }
}
exports.formatFixed = formatFixed;
function decimalize(bigNumberish, decimals) {
    var bigNumber = _utils_1.normalizeBigNumberish(bigNumberish);
    _utils_1.ensureAllUInt256([bigNumber]);
    _utils_1.ensureAllUInt8([decimals]);
    if (decimals > constants_1._MAX_DECIMAL_PLACES) {
        throw Error("This function does not support decimals greater than " + constants_1._MAX_DECIMAL_PLACES + ".");
    }
    return bigNumber.dividedBy(constants_1._10.exponentiatedBy(decimals));
}
function formatSignificantDecimals(bigNumberish, decimals, options) {
    return formatSignificant(decimalize(bigNumberish, decimals), options);
}
exports.formatSignificantDecimals = formatSignificantDecimals;
function formatFixedDecimals(bigNumberish, decimals, options) {
    return formatFixed(decimalize(bigNumberish, decimals), options);
}
exports.formatFixedDecimals = formatFixedDecimals;
//# sourceMappingURL=index.js.map