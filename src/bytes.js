// # bytes #
// A simple and fast library to convert human readable sizes into their byte or bit count and vice-versa.  
// Copyright 2013 Clay Walker
;(function() {

  // We can shave a few cycles off conversions by creating a lookup table of units prefixes for both "standard" (base 1000) and "metric" (base 1024).
  var prefixes = {
    "K":  1000,
    "M":  1000000,
    "G":  1000000000,
    "T":  1000000000000,
    "P":  1000000000000000,
    "E":  1000000000000000000,
    "Z":  1000000000000000000000,
    "Y":  1000000000000000000000000,
    "Ki": 1024,
    "Mi": 1048576,
    "Gi": 1073741824,
    "Ti": 1099511627776,
    "Pi": 1125899906842624,
    "Ei": 1152921504606846976,
    "Zi": 1180591620717411303424,
    "Yi": 1208925819614629174706176
  };

  // ## Bytes Object
  // The Bytes object represents a value.
  var Bytes = (function () {
    // ### Bytes() - Constructor
    // Optionally accepts the same arguments as `parse()` (see below).
    function Bytes () {
      // Internally, values are stored as `_bits`. To access the number of bits, please use the getter function `bits()`.
      this._bits = undefined;

      // If arguments are passed to the constructor, assume it is a value to be parsed.
      if (arguments.length !== 0) {
        Bytes.prototype.parse.apply(this, arguments);
      }
    }

    // ### parse()
    // Converts a bit or byte, string or numerical input into a number of bits and stores it internally.  
    // Accepts a `size` that is either a string or number of bytes.
    Bytes.prototype.parse = function (size) {
      if (typeof size === 'string') {
        var re = /([0-9]+\.?[0-9]?) ?([KMGTPEZY]?i?)([Bb])/;

        if (!re.test(size)) {
          console.error('bytes.js: Unable to parse size string.', size);
          return;
        }

        var matches = re.exec(size);

        var value = matches[1] * (prefixes[matches[2]] || 1);

        // Determine whether bits or bytes were provided.
        if (matches[3] === 'b') {
          this._bits = value;
        } else {
          this._bits = value * 8;
        }
      } else if (typeof size === 'number') {
        this._bits = size * 8;
      } else {
        console.error('bytes.js: Provided size is neither a string or a number.', JSON.stringify(size));
        return;
      }
    };

    // ### bytes()
    // ### toJSON()
    // Returns the number of bytes.  
    // The JSON serialization of a `Bytes` object is the number of bytes as an integer.
    Bytes.prototype.bytes = Bytes.prototype.toJSON = function() {
      return Math.ceil(this._bits / 8);
    };

    // ### bits()
    // Returns the number of bits.
    Bytes.prototype.bits = function() {
      return this._bits;
    };

    // ### humanize()
    // Convert the internal number of bits into a human-friendly format.  
    // Accepts an `options` hash with the following options (Option - Type - Default):  
    // * metric - boolean - false
    // * nospace - boolean - false
    // * precise - boolean - false
    // * unit - string - 'B'
    // Returns a human-friendly string.
    Bytes.prototype.humanize = function (options) {
      if (!options) {
        var options = {};
      }
      // If `metric` is specified, the output format will be in terms of metric bits or bytes ("GiB" for example).
      // By default standard units are assumed, the output format will be in terms of standard bits or bytes ("GB" for example).
      if (options.metric) {
        var base = 1024;
      } else {
        var base = 1000;
      }

      // If `unit` is specified as bits, the output will be in terms of bits.
      // By default bytes are assumed.
      if (options.unit === 'b') {
        var value = this._bits;
      } else {
        options.unit = 'B';
        var value = Math.ceil(this._bits / 8);
      }

      // Determine a reasonable prefix to use.
      if (value < base) {
        var prefix = '';
      } else if (value >= base * base * base * base * base * base * base * base) {
        value /= base * base * base * base * base * base * base * base;
        var prefix = 'Y';
      } else if (value >= base * base * base * base * base * base * base) {
        value /= base * base * base * base * base * base * base;
        var prefix = 'Z';
      } else if (value >= base * base * base * base * base * base) {
        value /= base * base * base * base * base * base;
        var prefix = 'E';
      } else if (value >= base * base * base * base * base) {
        value /= base * base * base * base * base;
        var prefix = 'P';
      } else if (value >= base * base * base * base) {
        value /= base * base * base * base;
        var prefix = 'T';
      } else if (value >= base * base * base) {
        value /= base * base * base;
        var prefix = 'G';
      } else if (value >= base * base) {
        value /= base * base;
        var prefix = 'M';
      } else if (value >= base) {
        value /= base;
        var prefix = 'K';
      }

      if (options.metric && prefix !== '') {
        prefix += 'i';
      }

      // If `precise` is true, the full precision is preserved.
      // By default, the returned value is rounded to two decimal places.
      if (!options.precise && prefix !== '') {
        value = value.toFixed(2)
      }

      // If `nospace` is true, a space will not be inserted between the value and the prefix in the output string.
      if (options.nospace) {
        var space = "";
      } else {
        var space = " ";
      }

      return value + space + prefix + options.unit;
    };

    return Bytes;
  })();

  // ## Node.js and AMD compatibility
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Bytes;
  } else {
    if (typeof define === 'function' && define.amd) {
      define([], function() { return Bytes; });
    } else {
      window.Bytes = Bytes;
    }
  }

})();
