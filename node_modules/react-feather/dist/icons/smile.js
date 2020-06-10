'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Smile = function Smile(props) {
  var color = props.color,
      size = props.size,
      otherProps = _objectWithoutProperties(props, ['color', 'size']);

  return _react2.default.createElement(
    'svg',
    _extends({
      viewBox: '0 0 24 24',
      width: size,
      height: size,
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      stroke: color,
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    }, otherProps),
    _react2.default.createElement('circle', { cx: '12', cy: '12', r: '10' }),
    _react2.default.createElement('path', { d: 'M8 14s1.5 2 4 2 4-2 4-2' }),
    _react2.default.createElement('line', { x1: '9', y1: '9', x2: '9.01', y2: '9' }),
    _react2.default.createElement('line', { x1: '15', y1: '9', x2: '15.01', y2: '9' })
  );
};

Smile.propTypes = {
  color: _propTypes2.default.string,
  size: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number])
};

Smile.defaultProps = {
  color: 'currentColor',
  size: '24'
};

exports.default = Smile;