var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
function lastOfArray$1(ar) {
  return ar[ar.length - 1];
}
function toArray(input) {
  return Array.isArray(input) ? input.slice(0) : [input];
}
function batchArray(array, batchSize) {
  array = array.slice(0);
  var ret = [];
  while (array.length) {
    var batch = array.splice(0, batchSize);
    ret.push(batch);
  }
  return ret;
}
function isMaybeReadonlyArray(x) {
  return Array.isArray(x);
}
function arrayFilterNotEmpty(value) {
  if (value === null || value === void 0) {
    return false;
  }
  return true;
}
function countUntilNotMatching(ar, matchingFn) {
  var count = 0;
  var idx = -1;
  for (var item of ar) {
    idx = idx + 1;
    var matching = matchingFn(item, idx);
    if (matching) {
      count = count + 1;
    } else {
      break;
    }
  }
  return count;
}
function sumNumberArray(array) {
  var count = 0;
  for (var i = array.length; i--; ) {
    count += array[i];
  }
  return count;
}
function maxOfNumbers(arr) {
  return Math.max(...arr);
}
function appendToArray(ar, add2) {
  var addSize = add2.length;
  if (addSize === 0) {
    return;
  }
  var baseSize = ar.length;
  ar.length = baseSize + add2.length;
  for (var i = 0; i < addSize; ++i) {
    ar[baseSize + i] = add2[i];
  }
}
function getHeightOfRevision(revision) {
  var useChars = "";
  for (var index = 0; index < revision.length; index++) {
    var char = revision[index];
    if (char === "-") {
      return parseInt(useChars, 10);
    }
    useChars += char;
  }
  throw new Error("malformatted revision: " + revision);
}
function createRevision(databaseInstanceToken, previousDocData) {
  var newRevisionHeight = !previousDocData ? 1 : getHeightOfRevision(previousDocData._rev) + 1;
  return newRevisionHeight + "-" + databaseInstanceToken;
}
function objectPathMonad(objectPath) {
  var split = objectPath.split(".");
  var splitLength = split.length;
  if (splitLength === 1) {
    return (obj) => obj[objectPath];
  }
  return (obj) => {
    var currentVal = obj;
    for (var i = 0; i < splitLength; ++i) {
      var subPath = split[i];
      currentVal = currentVal[subPath];
      if (typeof currentVal === "undefined") {
        return currentVal;
      }
    }
    return currentVal;
  };
}
function flatClone(obj) {
  return Object.assign({}, obj);
}
function firstPropertyNameOfObject(obj) {
  return Object.keys(obj)[0];
}
function sortObject(obj, noArraySort = false) {
  if (!obj) return obj;
  if (!noArraySort && Array.isArray(obj)) {
    return obj.sort((a, b2) => {
      if (typeof a === "string" && typeof b2 === "string") return a.localeCompare(b2);
      if (typeof a === "object") return 1;
      else return -1;
    }).map((i) => sortObject(i, noArraySort));
  }
  if (typeof obj === "object" && !Array.isArray(obj)) {
    var out = {};
    Object.keys(obj).sort((a, b2) => a.localeCompare(b2)).forEach((key) => {
      out[key] = sortObject(obj[key], noArraySort);
    });
    return out;
  }
  return obj;
}
function deepClone(src) {
  if (!src) {
    return src;
  }
  if (src === null || typeof src !== "object") {
    return src;
  }
  if (Array.isArray(src)) {
    var ret = new Array(src.length);
    var i = ret.length;
    while (i--) {
      ret[i] = deepClone(src[i]);
    }
    return ret;
  }
  var dest = {};
  for (var key in src) {
    dest[key] = deepClone(src[key]);
  }
  return dest;
}
var clone$1 = deepClone;
function overwriteGetterForCaching(obj, getterName, value) {
  Object.defineProperty(obj, getterName, {
    get: function() {
      return value;
    }
  });
  return value;
}
var RX_META_LWT_MINIMUM = 1;
function getDefaultRxDocumentMeta() {
  return {
    /**
     * Set this to 1 to not waste performance
     * while calling new Date()..
     * The storage wrappers will anyway update
     * the lastWrite time while calling transformDocumentDataFromRxDBToRxStorage()
     */
    lwt: RX_META_LWT_MINIMUM
  };
}
function getDefaultRevision() {
  return "";
}
function stripMetaDataFromDocument(docData) {
  return Object.assign({}, docData, {
    _meta: void 0,
    _deleted: void 0,
    _rev: void 0
  });
}
function areRxDocumentArraysEqual(primaryPath, ar1, ar2) {
  if (ar1.length !== ar2.length) {
    return false;
  }
  var i = 0;
  var len = ar1.length;
  while (i < len) {
    var row1 = ar1[i];
    var row2 = ar2[i];
    i++;
    if (row1._rev !== row2._rev || row1[primaryPath] !== row2[primaryPath]) {
      return false;
    }
  }
  return true;
}
var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => {
  __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class WordArray {
  constructor(words, sigBytes) {
    __publicField$1(this, "words");
    __publicField$1(this, "sigBytes");
    words = this.words = words || [];
    this.sigBytes = sigBytes === void 0 ? words.length * 4 : sigBytes;
  }
  toString(encoder) {
    return (encoder || Hex).stringify(this);
  }
  concat(wordArray) {
    this.clamp();
    if (this.sigBytes % 4) {
      for (let i = 0; i < wordArray.sigBytes; i++) {
        const thatByte = wordArray.words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
        this.words[this.sigBytes + i >>> 2] |= thatByte << 24 - (this.sigBytes + i) % 4 * 8;
      }
    } else {
      for (let j = 0; j < wordArray.sigBytes; j += 4) {
        this.words[this.sigBytes + j >>> 2] = wordArray.words[j >>> 2];
      }
    }
    this.sigBytes += wordArray.sigBytes;
    return this;
  }
  clamp() {
    this.words[this.sigBytes >>> 2] &= 4294967295 << 32 - this.sigBytes % 4 * 8;
    this.words.length = Math.ceil(this.sigBytes / 4);
  }
  clone() {
    return new WordArray([...this.words]);
  }
}
const Hex = {
  stringify(wordArray) {
    const hexChars = [];
    for (let i = 0; i < wordArray.sigBytes; i++) {
      const bite = wordArray.words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
      hexChars.push((bite >>> 4).toString(16), (bite & 15).toString(16));
    }
    return hexChars.join("");
  }
};
const Latin1 = {
  parse(latin1Str) {
    const latin1StrLength = latin1Str.length;
    const words = [];
    for (let i = 0; i < latin1StrLength; i++) {
      words[i >>> 2] |= (latin1Str.charCodeAt(i) & 255) << 24 - i % 4 * 8;
    }
    return new WordArray(words, latin1StrLength);
  }
};
const Utf8 = {
  parse(utf8Str) {
    return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
  }
};
class BufferedBlockAlgorithm {
  constructor() {
    __publicField$1(this, "_data", new WordArray());
    __publicField$1(this, "_nDataBytes", 0);
    __publicField$1(this, "_minBufferSize", 0);
    __publicField$1(this, "blockSize", 512 / 32);
  }
  reset() {
    this._data = new WordArray();
    this._nDataBytes = 0;
  }
  _append(data) {
    if (typeof data === "string") {
      data = Utf8.parse(data);
    }
    this._data.concat(data);
    this._nDataBytes += data.sigBytes;
  }
  _doProcessBlock(_dataWords, _offset) {
  }
  _process(doFlush) {
    let processedWords;
    let nBlocksReady = this._data.sigBytes / (this.blockSize * 4);
    if (doFlush) {
      nBlocksReady = Math.ceil(nBlocksReady);
    } else {
      nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
    }
    const nWordsReady = nBlocksReady * this.blockSize;
    const nBytesReady = Math.min(nWordsReady * 4, this._data.sigBytes);
    if (nWordsReady) {
      for (let offset = 0; offset < nWordsReady; offset += this.blockSize) {
        this._doProcessBlock(this._data.words, offset);
      }
      processedWords = this._data.words.splice(0, nWordsReady);
      this._data.sigBytes -= nBytesReady;
    }
    return new WordArray(processedWords, nBytesReady);
  }
}
class Hasher extends BufferedBlockAlgorithm {
  update(messageUpdate) {
    this._append(messageUpdate);
    this._process();
    return this;
  }
  finalize(messageUpdate) {
    if (messageUpdate) {
      this._append(messageUpdate);
    }
  }
}
var __defProp2 = Object.defineProperty;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField2 = (obj, key, value) => {
  __defNormalProp2(obj, key + "", value);
  return value;
};
const H = [
  1779033703,
  -1150833019,
  1013904242,
  -1521486534,
  1359893119,
  -1694144372,
  528734635,
  1541459225
];
const K = [
  1116352408,
  1899447441,
  -1245643825,
  -373957723,
  961987163,
  1508970993,
  -1841331548,
  -1424204075,
  -670586216,
  310598401,
  607225278,
  1426881987,
  1925078388,
  -2132889090,
  -1680079193,
  -1046744716,
  -459576895,
  -272742522,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  -1740746414,
  -1473132947,
  -1341970488,
  -1084653625,
  -958395405,
  -710438585,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  -2117940946,
  -1838011259,
  -1564481375,
  -1474664885,
  -1035236496,
  -949202525,
  -778901479,
  -694614492,
  -200395387,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  -2067236844,
  -1933114872,
  -1866530822,
  -1538233109,
  -1090935817,
  -965641998
];
const W = [];
class SHA256 extends Hasher {
  constructor() {
    super(...arguments);
    __publicField2(this, "_hash", new WordArray([...H]));
  }
  /**
   * Resets the internal state of the hash object to initial values.
   */
  reset() {
    super.reset();
    this._hash = new WordArray([...H]);
  }
  _doProcessBlock(M, offset) {
    const H2 = this._hash.words;
    let a = H2[0];
    let b2 = H2[1];
    let c2 = H2[2];
    let d = H2[3];
    let e = H2[4];
    let f2 = H2[5];
    let g = H2[6];
    let h = H2[7];
    for (let i = 0; i < 64; i++) {
      if (i < 16) {
        W[i] = M[offset + i] | 0;
      } else {
        const gamma0x = W[i - 15];
        const gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3;
        const gamma1x = W[i - 2];
        const gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;
        W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
      }
      const ch = e & f2 ^ ~e & g;
      const maj = a & b2 ^ a & c2 ^ b2 & c2;
      const sigma0 = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22);
      const sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);
      const t1 = h + sigma1 + ch + K[i] + W[i];
      const t2 = sigma0 + maj;
      h = g;
      g = f2;
      f2 = e;
      e = d + t1 | 0;
      d = c2;
      c2 = b2;
      b2 = a;
      a = t1 + t2 | 0;
    }
    H2[0] = H2[0] + a | 0;
    H2[1] = H2[1] + b2 | 0;
    H2[2] = H2[2] + c2 | 0;
    H2[3] = H2[3] + d | 0;
    H2[4] = H2[4] + e | 0;
    H2[5] = H2[5] + f2 | 0;
    H2[6] = H2[6] + g | 0;
    H2[7] = H2[7] + h | 0;
  }
  /**
   * Finishes the hash calculation and returns the hash as a WordArray.
   *
   * @param {string} messageUpdate - Additional message content to include in the hash.
   * @returns {WordArray} The finalised hash as a WordArray.
   */
  finalize(messageUpdate) {
    super.finalize(messageUpdate);
    const nBitsTotal = this._nDataBytes * 8;
    const nBitsLeft = this._data.sigBytes * 8;
    this._data.words[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
    this._data.words[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(
      nBitsTotal / 4294967296
    );
    this._data.words[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
    this._data.sigBytes = this._data.words.length * 4;
    this._process();
    return this._hash;
  }
}
function sha256(message) {
  return new SHA256().finalize(message).toString();
}
function jsSha256(input) {
  return Promise.resolve(sha256(input));
}
async function nativeSha256(input) {
  var data = new TextEncoder().encode(input);
  var hashBuffer = await crypto.subtle.digest("SHA-256", data);
  var hash = Array.prototype.map.call(new Uint8Array(hashBuffer), (x) => ("00" + x.toString(16)).slice(-2)).join("");
  return hash;
}
var canUseCryptoSubtle = typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined" && typeof crypto.subtle.digest === "function";
var defaultHashSha256 = canUseCryptoSubtle ? nativeSha256 : jsSha256;
function nextTick() {
  return new Promise((res) => setTimeout(res, 0));
}
function promiseWait(ms = 0) {
  return new Promise((res) => setTimeout(res, ms));
}
function toPromise(maybePromise) {
  if (maybePromise && typeof maybePromise.then === "function") {
    return maybePromise;
  } else {
    return Promise.resolve(maybePromise);
  }
}
var PROMISE_RESOLVE_TRUE = Promise.resolve(true);
var PROMISE_RESOLVE_FALSE = Promise.resolve(false);
var PROMISE_RESOLVE_NULL = Promise.resolve(null);
var PROMISE_RESOLVE_VOID = Promise.resolve();
function requestIdlePromiseNoQueue(timeout = 1e4) {
  if (typeof requestIdleCallback === "function") {
    return new Promise((res) => {
      requestIdleCallback(() => res(), {
        timeout
      });
    });
  } else {
    return promiseWait(0);
  }
}
var idlePromiseQueue = PROMISE_RESOLVE_VOID;
function requestIdlePromise(timeout = void 0) {
  idlePromiseQueue = idlePromiseQueue.then(() => {
    return requestIdlePromiseNoQueue(timeout);
  });
  return idlePromiseQueue;
}
function promiseSeries(tasks, initial) {
  return tasks.reduce((current, next) => current.then(next), Promise.resolve(initial));
}
var REGEX_ALL_DOTS = /\./g;
var COUCH_NAME_CHARS = "abcdefghijklmnopqrstuvwxyz";
function randomCouchString(length = 10) {
  var text = "";
  for (var i = 0; i < length; i++) {
    text += COUCH_NAME_CHARS.charAt(Math.floor(Math.random() * COUCH_NAME_CHARS.length));
  }
  return text;
}
function ucfirst(str) {
  str += "";
  var f2 = str.charAt(0).toUpperCase();
  return f2 + str.substr(1);
}
function trimDots(str) {
  while (str.charAt(0) === ".") {
    str = str.substr(1);
  }
  while (str.slice(-1) === ".") {
    str = str.slice(0, -1);
  }
  return str;
}
function deepEqual(a, b2) {
  if (a === b2) return true;
  if (a && b2 && typeof a == "object" && typeof b2 == "object") {
    if (a.constructor !== b2.constructor) return false;
    var length;
    var i;
    if (Array.isArray(a)) {
      length = a.length;
      if (length !== b2.length) return false;
      for (i = length; i-- !== 0; ) if (!deepEqual(a[i], b2[i])) return false;
      return true;
    }
    if (a.constructor === RegExp) return a.source === b2.source && a.flags === b2.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b2.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b2.toString();
    var keys3 = Object.keys(a);
    length = keys3.length;
    if (length !== Object.keys(b2).length) return false;
    for (i = length; i-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(b2, keys3[i])) return false;
    for (i = length; i-- !== 0; ) {
      var key = keys3[i];
      if (!deepEqual(a[key], b2[key])) return false;
    }
    return true;
  }
  return a !== a && b2 !== b2;
}
var isObject$2 = (value) => {
  var type2 = typeof value;
  return value !== null && (type2 === "object" || type2 === "function");
};
var disallowedKeys = /* @__PURE__ */ new Set(["__proto__", "prototype", "constructor"]);
var digits = new Set("0123456789");
function getPathSegments(path) {
  var parts = [];
  var currentSegment = "";
  var currentPart = "start";
  var isIgnoring = false;
  for (var character of path) {
    switch (character) {
      case "\\": {
        if (currentPart === "index") {
          throw new Error("Invalid character in an index");
        }
        if (currentPart === "indexEnd") {
          throw new Error("Invalid character after an index");
        }
        if (isIgnoring) {
          currentSegment += character;
        }
        currentPart = "property";
        isIgnoring = !isIgnoring;
        break;
      }
      case ".": {
        if (currentPart === "index") {
          throw new Error("Invalid character in an index");
        }
        if (currentPart === "indexEnd") {
          currentPart = "property";
          break;
        }
        if (isIgnoring) {
          isIgnoring = false;
          currentSegment += character;
          break;
        }
        if (disallowedKeys.has(currentSegment)) {
          return [];
        }
        parts.push(currentSegment);
        currentSegment = "";
        currentPart = "property";
        break;
      }
      case "[": {
        if (currentPart === "index") {
          throw new Error("Invalid character in an index");
        }
        if (currentPart === "indexEnd") {
          currentPart = "index";
          break;
        }
        if (isIgnoring) {
          isIgnoring = false;
          currentSegment += character;
          break;
        }
        if (currentPart === "property") {
          if (disallowedKeys.has(currentSegment)) {
            return [];
          }
          parts.push(currentSegment);
          currentSegment = "";
        }
        currentPart = "index";
        break;
      }
      case "]": {
        if (currentPart === "index") {
          parts.push(Number.parseInt(currentSegment, 10));
          currentSegment = "";
          currentPart = "indexEnd";
          break;
        }
        if (currentPart === "indexEnd") {
          throw new Error("Invalid character after an index");
        }
      }
      default: {
        if (currentPart === "index" && !digits.has(character)) {
          throw new Error("Invalid character in an index");
        }
        if (currentPart === "indexEnd") {
          throw new Error("Invalid character after an index");
        }
        if (currentPart === "start") {
          currentPart = "property";
        }
        if (isIgnoring) {
          isIgnoring = false;
          currentSegment += "\\";
        }
        currentSegment += character;
      }
    }
  }
  if (isIgnoring) {
    currentSegment += "\\";
  }
  switch (currentPart) {
    case "property": {
      if (disallowedKeys.has(currentSegment)) {
        return [];
      }
      parts.push(currentSegment);
      break;
    }
    case "index": {
      throw new Error("Index was not closed");
    }
    case "start": {
      parts.push("");
      break;
    }
  }
  return parts;
}
function isStringIndex$1(object, key) {
  if (typeof key !== "number" && Array.isArray(object)) {
    var index = Number.parseInt(key, 10);
    return Number.isInteger(index) && object[index] === object[key];
  }
  return false;
}
function getProperty$1(object, path, value) {
  if (Array.isArray(path)) {
    path = path.join(".");
  }
  if (!path.includes(".") && !path.includes("[")) {
    return object[path];
  }
  if (!isObject$2(object) || typeof path !== "string") {
    return value === void 0 ? object : value;
  }
  var pathArray = getPathSegments(path);
  if (pathArray.length === 0) {
    return value;
  }
  for (var index = 0; index < pathArray.length; index++) {
    var key = pathArray[index];
    if (isStringIndex$1(object, key)) {
      object = index === pathArray.length - 1 ? void 0 : null;
    } else {
      object = object[key];
    }
    if (object === void 0 || object === null) {
      if (index !== pathArray.length - 1) {
        return value;
      }
      break;
    }
  }
  return object === void 0 ? value : object;
}
function getFromMapOrThrow(map2, key) {
  var val = map2.get(key);
  if (typeof val === "undefined") {
    throw new Error("missing value from map " + key);
  }
  return val;
}
function getFromMapOrCreate(map2, index, creator, ifWasThere) {
  var value = map2.get(index);
  if (typeof value === "undefined") {
    value = creator();
    map2.set(index, value);
  }
  return value;
}
function pluginMissing(pluginKey) {
  var keyParts = pluginKey.split("-");
  var pluginName = "RxDB";
  keyParts.forEach((part) => {
    pluginName += ucfirst(part);
  });
  pluginName += "Plugin";
  return new Error("You are using a function which must be overwritten by a plugin.\n        You should either prevent the usage of this function or add the plugin via:\n            import { " + pluginName + " } from 'rxdb/plugins/" + pluginKey + "';\n            addRxPlugin(" + pluginName + ");\n        ");
}
function errorToPlainJson(err) {
  var ret = {
    name: err.name,
    message: err.message,
    rxdb: err.rxdb,
    parameters: err.parameters,
    extensions: err.extensions,
    code: err.code,
    url: err.url,
    /**
     * stack must be last to make it easier to read the json in a console.
     * Also we ensure that each linebreak is spaced so that the chrome devtools
     * shows urls to the source code that can be clicked to inspect
     * the correct place in the code.
     */
    stack: !err.stack ? void 0 : err.stack.replace(/\n/g, " \n ")
  };
  return ret;
}
var _lastNow = 0;
function now$1() {
  var ret = Date.now();
  ret = ret + 0.01;
  if (ret <= _lastNow) {
    ret = _lastNow + 0.01;
  }
  var twoDecimals = parseFloat(ret.toFixed(2));
  _lastNow = twoDecimals;
  return twoDecimals;
}
function ensureNotFalsy(obj, message) {
  if (!obj) {
    if (!message) {
      message = "";
    }
    throw new Error("ensureNotFalsy() is falsy: " + message);
  }
  return obj;
}
var RXJS_SHARE_REPLAY_DEFAULTS = {
  bufferSize: 1,
  refCount: true
};
var RXDB_VERSION = "15.36.0";
var extendStatics = function(d, b2) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b22) {
    d2.__proto__ = b22;
  } || function(d2, b22) {
    for (var p2 in b22) if (Object.prototype.hasOwnProperty.call(b22, p2)) d2[p2] = b22[p2];
  };
  return extendStatics(d, b2);
};
function __extends(d, b2) {
  if (typeof b2 !== "function" && b2 !== null)
    throw new TypeError("Class extends value " + String(b2) + " is not a constructor or null");
  extendStatics(d, b2);
  function __() {
    this.constructor = d;
  }
  d.prototype = b2 === null ? Object.create(b2) : (__.prototype = b2.prototype, new __());
}
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve2) {
      resolve2(value);
    });
  }
  return new (P || (P = Promise))(function(resolve2, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1) throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f2, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n2) {
    return function(v) {
      return step([n2, v]);
    };
  }
  function step(op) {
    if (f2) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f2 = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return { value: op[1], done: false };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f2 = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __values(o) {
  var s2 = typeof Symbol === "function" && Symbol.iterator, m2 = s2 && o[s2], i = 0;
  if (m2) return m2.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s2 ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n2) {
  var m2 = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m2) return o;
  var i = m2.call(o), r2, ar = [], e;
  try {
    while ((n2 === void 0 || n2-- > 0) && !(r2 = i.next()).done) ar.push(r2.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r2 && !r2.done && (m2 = i["return"])) m2.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
}
function __spreadArray(to, from2, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from2.length, ar; i < l; i++) {
    if (ar || !(i in from2)) {
      if (!ar) ar = Array.prototype.slice.call(from2, 0, i);
      ar[i] = from2[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from2));
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function awaitReturn(f2) {
    return function(v) {
      return Promise.resolve(v).then(f2, reject);
    };
  }
  function verb(n2, f2) {
    if (g[n2]) {
      i[n2] = function(v) {
        return new Promise(function(a, b2) {
          q.push([n2, v, a, b2]) > 1 || resume(n2, v);
        });
      };
      if (f2) i[n2] = f2(i[n2]);
    }
  }
  function resume(n2, v) {
    try {
      step(g[n2](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r2) {
    r2.value instanceof __await ? Promise.resolve(r2.value.v).then(fulfill, reject) : settle(q[0][2], r2);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f2, v) {
    if (f2(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}
function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m2 = o[Symbol.asyncIterator], i;
  return m2 ? m2.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n2) {
    i[n2] = o[n2] && function(v) {
      return new Promise(function(resolve2, reject) {
        v = o[n2](v), settle(resolve2, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve2, reject, d, v) {
    Promise.resolve(v).then(function(v2) {
      resolve2({ value: v2, done: d });
    }, reject);
  }
}
typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
function isFunction$2(value) {
  return typeof value === "function";
}
function createErrorClass(createImpl) {
  var _super = function(instance) {
    Error.call(instance);
    instance.stack = new Error().stack;
  };
  var ctorFunc = createImpl(_super);
  ctorFunc.prototype = Object.create(Error.prototype);
  ctorFunc.prototype.constructor = ctorFunc;
  return ctorFunc;
}
var UnsubscriptionError = createErrorClass(function(_super) {
  return function UnsubscriptionErrorImpl(errors) {
    _super(this);
    this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function(err, i) {
      return i + 1 + ") " + err.toString();
    }).join("\n  ") : "";
    this.name = "UnsubscriptionError";
    this.errors = errors;
  };
});
function arrRemove(arr, item) {
  if (arr) {
    var index = arr.indexOf(item);
    0 <= index && arr.splice(index, 1);
  }
}
var Subscription = function() {
  function Subscription2(initialTeardown) {
    this.initialTeardown = initialTeardown;
    this.closed = false;
    this._parentage = null;
    this._finalizers = null;
  }
  Subscription2.prototype.unsubscribe = function() {
    var e_1, _a, e_2, _b;
    var errors;
    if (!this.closed) {
      this.closed = true;
      var _parentage = this._parentage;
      if (_parentage) {
        this._parentage = null;
        if (Array.isArray(_parentage)) {
          try {
            for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
              var parent_1 = _parentage_1_1.value;
              parent_1.remove(this);
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return)) _a.call(_parentage_1);
            } finally {
              if (e_1) throw e_1.error;
            }
          }
        } else {
          _parentage.remove(this);
        }
      }
      var initialFinalizer = this.initialTeardown;
      if (isFunction$2(initialFinalizer)) {
        try {
          initialFinalizer();
        } catch (e) {
          errors = e instanceof UnsubscriptionError ? e.errors : [e];
        }
      }
      var _finalizers = this._finalizers;
      if (_finalizers) {
        this._finalizers = null;
        try {
          for (var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
            var finalizer = _finalizers_1_1.value;
            try {
              execFinalizer(finalizer);
            } catch (err) {
              errors = errors !== null && errors !== void 0 ? errors : [];
              if (err instanceof UnsubscriptionError) {
                errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
              } else {
                errors.push(err);
              }
            }
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return)) _b.call(_finalizers_1);
          } finally {
            if (e_2) throw e_2.error;
          }
        }
      }
      if (errors) {
        throw new UnsubscriptionError(errors);
      }
    }
  };
  Subscription2.prototype.add = function(teardown) {
    var _a;
    if (teardown && teardown !== this) {
      if (this.closed) {
        execFinalizer(teardown);
      } else {
        if (teardown instanceof Subscription2) {
          if (teardown.closed || teardown._hasParent(this)) {
            return;
          }
          teardown._addParent(this);
        }
        (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
      }
    }
  };
  Subscription2.prototype._hasParent = function(parent) {
    var _parentage = this._parentage;
    return _parentage === parent || Array.isArray(_parentage) && _parentage.includes(parent);
  };
  Subscription2.prototype._addParent = function(parent) {
    var _parentage = this._parentage;
    this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
  };
  Subscription2.prototype._removeParent = function(parent) {
    var _parentage = this._parentage;
    if (_parentage === parent) {
      this._parentage = null;
    } else if (Array.isArray(_parentage)) {
      arrRemove(_parentage, parent);
    }
  };
  Subscription2.prototype.remove = function(teardown) {
    var _finalizers = this._finalizers;
    _finalizers && arrRemove(_finalizers, teardown);
    if (teardown instanceof Subscription2) {
      teardown._removeParent(this);
    }
  };
  Subscription2.EMPTY = function() {
    var empty = new Subscription2();
    empty.closed = true;
    return empty;
  }();
  return Subscription2;
}();
var EMPTY_SUBSCRIPTION = Subscription.EMPTY;
function isSubscription(value) {
  return value instanceof Subscription || value && "closed" in value && isFunction$2(value.remove) && isFunction$2(value.add) && isFunction$2(value.unsubscribe);
}
function execFinalizer(finalizer) {
  if (isFunction$2(finalizer)) {
    finalizer();
  } else {
    finalizer.unsubscribe();
  }
}
var config = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: false,
  useDeprecatedNextContext: false
};
var timeoutProvider = {
  setTimeout: function(handler, timeout) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
      args[_i - 2] = arguments[_i];
    }
    return setTimeout.apply(void 0, __spreadArray([handler, timeout], __read(args)));
  },
  clearTimeout: function(handle) {
    var delegate = timeoutProvider.delegate;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
  },
  delegate: void 0
};
function reportUnhandledError(err) {
  timeoutProvider.setTimeout(function() {
    {
      throw err;
    }
  });
}
function noop() {
}
function errorContext(cb) {
  {
    cb();
  }
}
var Subscriber = function(_super) {
  __extends(Subscriber2, _super);
  function Subscriber2(destination) {
    var _this = _super.call(this) || this;
    _this.isStopped = false;
    if (destination) {
      _this.destination = destination;
      if (isSubscription(destination)) {
        destination.add(_this);
      }
    } else {
      _this.destination = EMPTY_OBSERVER;
    }
    return _this;
  }
  Subscriber2.create = function(next, error, complete) {
    return new SafeSubscriber(next, error, complete);
  };
  Subscriber2.prototype.next = function(value) {
    if (this.isStopped) ;
    else {
      this._next(value);
    }
  };
  Subscriber2.prototype.error = function(err) {
    if (this.isStopped) ;
    else {
      this.isStopped = true;
      this._error(err);
    }
  };
  Subscriber2.prototype.complete = function() {
    if (this.isStopped) ;
    else {
      this.isStopped = true;
      this._complete();
    }
  };
  Subscriber2.prototype.unsubscribe = function() {
    if (!this.closed) {
      this.isStopped = true;
      _super.prototype.unsubscribe.call(this);
      this.destination = null;
    }
  };
  Subscriber2.prototype._next = function(value) {
    this.destination.next(value);
  };
  Subscriber2.prototype._error = function(err) {
    try {
      this.destination.error(err);
    } finally {
      this.unsubscribe();
    }
  };
  Subscriber2.prototype._complete = function() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  };
  return Subscriber2;
}(Subscription);
var _bind = Function.prototype.bind;
function bind$2(fn, thisArg) {
  return _bind.call(fn, thisArg);
}
var ConsumerObserver = function() {
  function ConsumerObserver2(partialObserver) {
    this.partialObserver = partialObserver;
  }
  ConsumerObserver2.prototype.next = function(value) {
    var partialObserver = this.partialObserver;
    if (partialObserver.next) {
      try {
        partialObserver.next(value);
      } catch (error) {
        handleUnhandledError(error);
      }
    }
  };
  ConsumerObserver2.prototype.error = function(err) {
    var partialObserver = this.partialObserver;
    if (partialObserver.error) {
      try {
        partialObserver.error(err);
      } catch (error) {
        handleUnhandledError(error);
      }
    } else {
      handleUnhandledError(err);
    }
  };
  ConsumerObserver2.prototype.complete = function() {
    var partialObserver = this.partialObserver;
    if (partialObserver.complete) {
      try {
        partialObserver.complete();
      } catch (error) {
        handleUnhandledError(error);
      }
    }
  };
  return ConsumerObserver2;
}();
var SafeSubscriber = function(_super) {
  __extends(SafeSubscriber2, _super);
  function SafeSubscriber2(observerOrNext, error, complete) {
    var _this = _super.call(this) || this;
    var partialObserver;
    if (isFunction$2(observerOrNext) || !observerOrNext) {
      partialObserver = {
        next: observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : void 0,
        error: error !== null && error !== void 0 ? error : void 0,
        complete: complete !== null && complete !== void 0 ? complete : void 0
      };
    } else {
      var context_1;
      if (_this && config.useDeprecatedNextContext) {
        context_1 = Object.create(observerOrNext);
        context_1.unsubscribe = function() {
          return _this.unsubscribe();
        };
        partialObserver = {
          next: observerOrNext.next && bind$2(observerOrNext.next, context_1),
          error: observerOrNext.error && bind$2(observerOrNext.error, context_1),
          complete: observerOrNext.complete && bind$2(observerOrNext.complete, context_1)
        };
      } else {
        partialObserver = observerOrNext;
      }
    }
    _this.destination = new ConsumerObserver(partialObserver);
    return _this;
  }
  return SafeSubscriber2;
}(Subscriber);
function handleUnhandledError(error) {
  {
    reportUnhandledError(error);
  }
}
function defaultErrorHandler(err) {
  throw err;
}
var EMPTY_OBSERVER = {
  closed: true,
  next: noop,
  error: defaultErrorHandler,
  complete: noop
};
var observable = function() {
  return typeof Symbol === "function" && Symbol.observable || "@@observable";
}();
function identity(x) {
  return x;
}
function pipeFromArray(fns) {
  if (fns.length === 0) {
    return identity;
  }
  if (fns.length === 1) {
    return fns[0];
  }
  return function piped(input) {
    return fns.reduce(function(prev, fn) {
      return fn(prev);
    }, input);
  };
}
var Observable = function() {
  function Observable2(subscribe) {
    if (subscribe) {
      this._subscribe = subscribe;
    }
  }
  Observable2.prototype.lift = function(operator) {
    var observable2 = new Observable2();
    observable2.source = this;
    observable2.operator = operator;
    return observable2;
  };
  Observable2.prototype.subscribe = function(observerOrNext, error, complete) {
    var _this = this;
    var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
    errorContext(function() {
      var _a = _this, operator = _a.operator, source = _a.source;
      subscriber.add(operator ? operator.call(subscriber, source) : source ? _this._subscribe(subscriber) : _this._trySubscribe(subscriber));
    });
    return subscriber;
  };
  Observable2.prototype._trySubscribe = function(sink) {
    try {
      return this._subscribe(sink);
    } catch (err) {
      sink.error(err);
    }
  };
  Observable2.prototype.forEach = function(next, promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function(resolve2, reject) {
      var subscriber = new SafeSubscriber({
        next: function(value) {
          try {
            next(value);
          } catch (err) {
            reject(err);
            subscriber.unsubscribe();
          }
        },
        error: reject,
        complete: resolve2
      });
      _this.subscribe(subscriber);
    });
  };
  Observable2.prototype._subscribe = function(subscriber) {
    var _a;
    return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
  };
  Observable2.prototype[observable] = function() {
    return this;
  };
  Observable2.prototype.pipe = function() {
    var operations = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      operations[_i] = arguments[_i];
    }
    return pipeFromArray(operations)(this);
  };
  Observable2.prototype.toPromise = function(promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function(resolve2, reject) {
      var value;
      _this.subscribe(function(x) {
        return value = x;
      }, function(err) {
        return reject(err);
      }, function() {
        return resolve2(value);
      });
    });
  };
  Observable2.create = function(subscribe) {
    return new Observable2(subscribe);
  };
  return Observable2;
}();
function getPromiseCtor(promiseCtor) {
  var _a;
  return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a !== void 0 ? _a : Promise;
}
function isObserver(value) {
  return value && isFunction$2(value.next) && isFunction$2(value.error) && isFunction$2(value.complete);
}
function isSubscriber(value) {
  return value && value instanceof Subscriber || isObserver(value) && isSubscription(value);
}
function hasLift(source) {
  return isFunction$2(source === null || source === void 0 ? void 0 : source.lift);
}
function operate(init) {
  return function(source) {
    if (hasLift(source)) {
      return source.lift(function(liftedSource) {
        try {
          return init(liftedSource, this);
        } catch (err) {
          this.error(err);
        }
      });
    }
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
  return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
}
var OperatorSubscriber = function(_super) {
  __extends(OperatorSubscriber2, _super);
  function OperatorSubscriber2(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
    var _this = _super.call(this, destination) || this;
    _this.onFinalize = onFinalize;
    _this.shouldUnsubscribe = shouldUnsubscribe;
    _this._next = onNext ? function(value) {
      try {
        onNext(value);
      } catch (err) {
        destination.error(err);
      }
    } : _super.prototype._next;
    _this._error = onError ? function(err) {
      try {
        onError(err);
      } catch (err2) {
        destination.error(err2);
      } finally {
        this.unsubscribe();
      }
    } : _super.prototype._error;
    _this._complete = onComplete ? function() {
      try {
        onComplete();
      } catch (err) {
        destination.error(err);
      } finally {
        this.unsubscribe();
      }
    } : _super.prototype._complete;
    return _this;
  }
  OperatorSubscriber2.prototype.unsubscribe = function() {
    var _a;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var closed_1 = this.closed;
      _super.prototype.unsubscribe.call(this);
      !closed_1 && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
    }
  };
  return OperatorSubscriber2;
}(Subscriber);
var ObjectUnsubscribedError = createErrorClass(function(_super) {
  return function ObjectUnsubscribedErrorImpl() {
    _super(this);
    this.name = "ObjectUnsubscribedError";
    this.message = "object unsubscribed";
  };
});
var Subject = function(_super) {
  __extends(Subject2, _super);
  function Subject2() {
    var _this = _super.call(this) || this;
    _this.closed = false;
    _this.currentObservers = null;
    _this.observers = [];
    _this.isStopped = false;
    _this.hasError = false;
    _this.thrownError = null;
    return _this;
  }
  Subject2.prototype.lift = function(operator) {
    var subject = new AnonymousSubject(this, this);
    subject.operator = operator;
    return subject;
  };
  Subject2.prototype._throwIfClosed = function() {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }
  };
  Subject2.prototype.next = function(value) {
    var _this = this;
    errorContext(function() {
      var e_1, _a;
      _this._throwIfClosed();
      if (!_this.isStopped) {
        if (!_this.currentObservers) {
          _this.currentObservers = Array.from(_this.observers);
        }
        try {
          for (var _b = __values(_this.currentObservers), _c = _b.next(); !_c.done; _c = _b.next()) {
            var observer = _c.value;
            observer.next(value);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      }
    });
  };
  Subject2.prototype.error = function(err) {
    var _this = this;
    errorContext(function() {
      _this._throwIfClosed();
      if (!_this.isStopped) {
        _this.hasError = _this.isStopped = true;
        _this.thrownError = err;
        var observers = _this.observers;
        while (observers.length) {
          observers.shift().error(err);
        }
      }
    });
  };
  Subject2.prototype.complete = function() {
    var _this = this;
    errorContext(function() {
      _this._throwIfClosed();
      if (!_this.isStopped) {
        _this.isStopped = true;
        var observers = _this.observers;
        while (observers.length) {
          observers.shift().complete();
        }
      }
    });
  };
  Subject2.prototype.unsubscribe = function() {
    this.isStopped = this.closed = true;
    this.observers = this.currentObservers = null;
  };
  Object.defineProperty(Subject2.prototype, "observed", {
    get: function() {
      var _a;
      return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
    },
    enumerable: false,
    configurable: true
  });
  Subject2.prototype._trySubscribe = function(subscriber) {
    this._throwIfClosed();
    return _super.prototype._trySubscribe.call(this, subscriber);
  };
  Subject2.prototype._subscribe = function(subscriber) {
    this._throwIfClosed();
    this._checkFinalizedStatuses(subscriber);
    return this._innerSubscribe(subscriber);
  };
  Subject2.prototype._innerSubscribe = function(subscriber) {
    var _this = this;
    var _a = this, hasError = _a.hasError, isStopped = _a.isStopped, observers = _a.observers;
    if (hasError || isStopped) {
      return EMPTY_SUBSCRIPTION;
    }
    this.currentObservers = null;
    observers.push(subscriber);
    return new Subscription(function() {
      _this.currentObservers = null;
      arrRemove(observers, subscriber);
    });
  };
  Subject2.prototype._checkFinalizedStatuses = function(subscriber) {
    var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, isStopped = _a.isStopped;
    if (hasError) {
      subscriber.error(thrownError);
    } else if (isStopped) {
      subscriber.complete();
    }
  };
  Subject2.prototype.asObservable = function() {
    var observable2 = new Observable();
    observable2.source = this;
    return observable2;
  };
  Subject2.create = function(destination, source) {
    return new AnonymousSubject(destination, source);
  };
  return Subject2;
}(Observable);
var AnonymousSubject = function(_super) {
  __extends(AnonymousSubject2, _super);
  function AnonymousSubject2(destination, source) {
    var _this = _super.call(this) || this;
    _this.destination = destination;
    _this.source = source;
    return _this;
  }
  AnonymousSubject2.prototype.next = function(value) {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
  };
  AnonymousSubject2.prototype.error = function(err) {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
  };
  AnonymousSubject2.prototype.complete = function() {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
  };
  AnonymousSubject2.prototype._subscribe = function(subscriber) {
    var _a, _b;
    return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : EMPTY_SUBSCRIPTION;
  };
  return AnonymousSubject2;
}(Subject);
var BehaviorSubject = function(_super) {
  __extends(BehaviorSubject2, _super);
  function BehaviorSubject2(_value) {
    var _this = _super.call(this) || this;
    _this._value = _value;
    return _this;
  }
  Object.defineProperty(BehaviorSubject2.prototype, "value", {
    get: function() {
      return this.getValue();
    },
    enumerable: false,
    configurable: true
  });
  BehaviorSubject2.prototype._subscribe = function(subscriber) {
    var subscription = _super.prototype._subscribe.call(this, subscriber);
    !subscription.closed && subscriber.next(this._value);
    return subscription;
  };
  BehaviorSubject2.prototype.getValue = function() {
    var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, _value = _a._value;
    if (hasError) {
      throw thrownError;
    }
    this._throwIfClosed();
    return _value;
  };
  BehaviorSubject2.prototype.next = function(value) {
    _super.prototype.next.call(this, this._value = value);
  };
  return BehaviorSubject2;
}(Subject);
var dateTimestampProvider = {
  now: function() {
    return (dateTimestampProvider.delegate || Date).now();
  },
  delegate: void 0
};
var ReplaySubject = function(_super) {
  __extends(ReplaySubject2, _super);
  function ReplaySubject2(_bufferSize, _windowTime, _timestampProvider) {
    if (_bufferSize === void 0) {
      _bufferSize = Infinity;
    }
    if (_windowTime === void 0) {
      _windowTime = Infinity;
    }
    if (_timestampProvider === void 0) {
      _timestampProvider = dateTimestampProvider;
    }
    var _this = _super.call(this) || this;
    _this._bufferSize = _bufferSize;
    _this._windowTime = _windowTime;
    _this._timestampProvider = _timestampProvider;
    _this._buffer = [];
    _this._infiniteTimeWindow = true;
    _this._infiniteTimeWindow = _windowTime === Infinity;
    _this._bufferSize = Math.max(1, _bufferSize);
    _this._windowTime = Math.max(1, _windowTime);
    return _this;
  }
  ReplaySubject2.prototype.next = function(value) {
    var _a = this, isStopped = _a.isStopped, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow, _timestampProvider = _a._timestampProvider, _windowTime = _a._windowTime;
    if (!isStopped) {
      _buffer.push(value);
      !_infiniteTimeWindow && _buffer.push(_timestampProvider.now() + _windowTime);
    }
    this._trimBuffer();
    _super.prototype.next.call(this, value);
  };
  ReplaySubject2.prototype._subscribe = function(subscriber) {
    this._throwIfClosed();
    this._trimBuffer();
    var subscription = this._innerSubscribe(subscriber);
    var _a = this, _infiniteTimeWindow = _a._infiniteTimeWindow, _buffer = _a._buffer;
    var copy = _buffer.slice();
    for (var i = 0; i < copy.length && !subscriber.closed; i += _infiniteTimeWindow ? 1 : 2) {
      subscriber.next(copy[i]);
    }
    this._checkFinalizedStatuses(subscriber);
    return subscription;
  };
  ReplaySubject2.prototype._trimBuffer = function() {
    var _a = this, _bufferSize = _a._bufferSize, _timestampProvider = _a._timestampProvider, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow;
    var adjustedBufferSize = (_infiniteTimeWindow ? 1 : 2) * _bufferSize;
    _bufferSize < Infinity && adjustedBufferSize < _buffer.length && _buffer.splice(0, _buffer.length - adjustedBufferSize);
    if (!_infiniteTimeWindow) {
      var now2 = _timestampProvider.now();
      var last2 = 0;
      for (var i = 1; i < _buffer.length && _buffer[i] <= now2; i += 2) {
        last2 = i;
      }
      last2 && _buffer.splice(0, last2 + 1);
    }
  };
  return ReplaySubject2;
}(Subject);
var EMPTY = new Observable(function(subscriber) {
  return subscriber.complete();
});
function isScheduler(value) {
  return value && isFunction$2(value.schedule);
}
function last(arr) {
  return arr[arr.length - 1];
}
function popResultSelector(args) {
  return isFunction$2(last(args)) ? args.pop() : void 0;
}
function popScheduler(args) {
  return isScheduler(last(args)) ? args.pop() : void 0;
}
function popNumber(args, defaultValue) {
  return typeof last(args) === "number" ? args.pop() : defaultValue;
}
var isArrayLike = function(x) {
  return x && typeof x.length === "number" && typeof x !== "function";
};
function isPromise$1(value) {
  return isFunction$2(value === null || value === void 0 ? void 0 : value.then);
}
function isInteropObservable(input) {
  return isFunction$2(input[observable]);
}
function isAsyncIterable(obj) {
  return Symbol.asyncIterator && isFunction$2(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
}
function createInvalidObservableTypeError(input) {
  return new TypeError("You provided " + (input !== null && typeof input === "object" ? "an invalid object" : "'" + input + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}
function getSymbolIterator() {
  if (typeof Symbol !== "function" || !Symbol.iterator) {
    return "@@iterator";
  }
  return Symbol.iterator;
}
var iterator = getSymbolIterator();
function isIterable(input) {
  return isFunction$2(input === null || input === void 0 ? void 0 : input[iterator]);
}
function readableStreamLikeToAsyncGenerator(readableStream) {
  return __asyncGenerator(this, arguments, function readableStreamLikeToAsyncGenerator_1() {
    var reader, _a, value, done;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          reader = readableStream.getReader();
          _b.label = 1;
        case 1:
          _b.trys.push([1, , 9, 10]);
          _b.label = 2;
        case 2:
          return [4, __await(reader.read())];
        case 3:
          _a = _b.sent(), value = _a.value, done = _a.done;
          if (!done) return [3, 5];
          return [4, __await(void 0)];
        case 4:
          return [2, _b.sent()];
        case 5:
          return [4, __await(value)];
        case 6:
          return [4, _b.sent()];
        case 7:
          _b.sent();
          return [3, 2];
        case 8:
          return [3, 10];
        case 9:
          reader.releaseLock();
          return [7];
        case 10:
          return [2];
      }
    });
  });
}
function isReadableStreamLike(obj) {
  return isFunction$2(obj === null || obj === void 0 ? void 0 : obj.getReader);
}
function innerFrom(input) {
  if (input instanceof Observable) {
    return input;
  }
  if (input != null) {
    if (isInteropObservable(input)) {
      return fromInteropObservable(input);
    }
    if (isArrayLike(input)) {
      return fromArrayLike(input);
    }
    if (isPromise$1(input)) {
      return fromPromise(input);
    }
    if (isAsyncIterable(input)) {
      return fromAsyncIterable(input);
    }
    if (isIterable(input)) {
      return fromIterable(input);
    }
    if (isReadableStreamLike(input)) {
      return fromReadableStreamLike(input);
    }
  }
  throw createInvalidObservableTypeError(input);
}
function fromInteropObservable(obj) {
  return new Observable(function(subscriber) {
    var obs = obj[observable]();
    if (isFunction$2(obs.subscribe)) {
      return obs.subscribe(subscriber);
    }
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
function fromArrayLike(array) {
  return new Observable(function(subscriber) {
    for (var i = 0; i < array.length && !subscriber.closed; i++) {
      subscriber.next(array[i]);
    }
    subscriber.complete();
  });
}
function fromPromise(promise) {
  return new Observable(function(subscriber) {
    promise.then(function(value) {
      if (!subscriber.closed) {
        subscriber.next(value);
        subscriber.complete();
      }
    }, function(err) {
      return subscriber.error(err);
    }).then(null, reportUnhandledError);
  });
}
function fromIterable(iterable) {
  return new Observable(function(subscriber) {
    var e_1, _a;
    try {
      for (var iterable_1 = __values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
        var value = iterable_1_1.value;
        subscriber.next(value);
        if (subscriber.closed) {
          return;
        }
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    subscriber.complete();
  });
}
function fromAsyncIterable(asyncIterable) {
  return new Observable(function(subscriber) {
    process$1(asyncIterable, subscriber).catch(function(err) {
      return subscriber.error(err);
    });
  });
}
function fromReadableStreamLike(readableStream) {
  return fromAsyncIterable(readableStreamLikeToAsyncGenerator(readableStream));
}
function process$1(asyncIterable, subscriber) {
  var asyncIterable_1, asyncIterable_1_1;
  var e_2, _a;
  return __awaiter(this, void 0, void 0, function() {
    var value, e_2_1;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 5, 6, 11]);
          asyncIterable_1 = __asyncValues(asyncIterable);
          _b.label = 1;
        case 1:
          return [4, asyncIterable_1.next()];
        case 2:
          if (!(asyncIterable_1_1 = _b.sent(), !asyncIterable_1_1.done)) return [3, 4];
          value = asyncIterable_1_1.value;
          subscriber.next(value);
          if (subscriber.closed) {
            return [2];
          }
          _b.label = 3;
        case 3:
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          e_2_1 = _b.sent();
          e_2 = { error: e_2_1 };
          return [3, 11];
        case 6:
          _b.trys.push([6, , 9, 10]);
          if (!(asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return))) return [3, 8];
          return [4, _a.call(asyncIterable_1)];
        case 7:
          _b.sent();
          _b.label = 8;
        case 8:
          return [3, 10];
        case 9:
          if (e_2) throw e_2.error;
          return [7];
        case 10:
          return [7];
        case 11:
          subscriber.complete();
          return [2];
      }
    });
  });
}
function executeSchedule(parentSubscription, scheduler, work, delay, repeat) {
  if (delay === void 0) {
    delay = 0;
  }
  if (repeat === void 0) {
    repeat = false;
  }
  var scheduleSubscription = scheduler.schedule(function() {
    work();
    if (repeat) {
      parentSubscription.add(this.schedule(null, delay));
    } else {
      this.unsubscribe();
    }
  }, delay);
  parentSubscription.add(scheduleSubscription);
  if (!repeat) {
    return scheduleSubscription;
  }
}
function observeOn(scheduler, delay) {
  if (delay === void 0) {
    delay = 0;
  }
  return operate(function(source, subscriber) {
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      return executeSchedule(subscriber, scheduler, function() {
        return subscriber.next(value);
      }, delay);
    }, function() {
      return executeSchedule(subscriber, scheduler, function() {
        return subscriber.complete();
      }, delay);
    }, function(err) {
      return executeSchedule(subscriber, scheduler, function() {
        return subscriber.error(err);
      }, delay);
    }));
  });
}
function subscribeOn(scheduler, delay) {
  if (delay === void 0) {
    delay = 0;
  }
  return operate(function(source, subscriber) {
    subscriber.add(scheduler.schedule(function() {
      return source.subscribe(subscriber);
    }, delay));
  });
}
function scheduleObservable(input, scheduler) {
  return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}
function schedulePromise(input, scheduler) {
  return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}
function scheduleArray(input, scheduler) {
  return new Observable(function(subscriber) {
    var i = 0;
    return scheduler.schedule(function() {
      if (i === input.length) {
        subscriber.complete();
      } else {
        subscriber.next(input[i++]);
        if (!subscriber.closed) {
          this.schedule();
        }
      }
    });
  });
}
function scheduleIterable(input, scheduler) {
  return new Observable(function(subscriber) {
    var iterator$1;
    executeSchedule(subscriber, scheduler, function() {
      iterator$1 = input[iterator]();
      executeSchedule(subscriber, scheduler, function() {
        var _a;
        var value;
        var done;
        try {
          _a = iterator$1.next(), value = _a.value, done = _a.done;
        } catch (err) {
          subscriber.error(err);
          return;
        }
        if (done) {
          subscriber.complete();
        } else {
          subscriber.next(value);
        }
      }, 0, true);
    });
    return function() {
      return isFunction$2(iterator$1 === null || iterator$1 === void 0 ? void 0 : iterator$1.return) && iterator$1.return();
    };
  });
}
function scheduleAsyncIterable(input, scheduler) {
  if (!input) {
    throw new Error("Iterable cannot be null");
  }
  return new Observable(function(subscriber) {
    executeSchedule(subscriber, scheduler, function() {
      var iterator2 = input[Symbol.asyncIterator]();
      executeSchedule(subscriber, scheduler, function() {
        iterator2.next().then(function(result) {
          if (result.done) {
            subscriber.complete();
          } else {
            subscriber.next(result.value);
          }
        });
      }, 0, true);
    });
  });
}
function scheduleReadableStreamLike(input, scheduler) {
  return scheduleAsyncIterable(readableStreamLikeToAsyncGenerator(input), scheduler);
}
function scheduled(input, scheduler) {
  if (input != null) {
    if (isInteropObservable(input)) {
      return scheduleObservable(input, scheduler);
    }
    if (isArrayLike(input)) {
      return scheduleArray(input, scheduler);
    }
    if (isPromise$1(input)) {
      return schedulePromise(input, scheduler);
    }
    if (isAsyncIterable(input)) {
      return scheduleAsyncIterable(input, scheduler);
    }
    if (isIterable(input)) {
      return scheduleIterable(input, scheduler);
    }
    if (isReadableStreamLike(input)) {
      return scheduleReadableStreamLike(input, scheduler);
    }
  }
  throw createInvalidObservableTypeError(input);
}
function from(input, scheduler) {
  return scheduler ? scheduled(input, scheduler) : innerFrom(input);
}
var EmptyError = createErrorClass(function(_super) {
  return function EmptyErrorImpl() {
    _super(this);
    this.name = "EmptyError";
    this.message = "no elements in sequence";
  };
});
function firstValueFrom(source, config2) {
  return new Promise(function(resolve2, reject) {
    var subscriber = new SafeSubscriber({
      next: function(value) {
        resolve2(value);
        subscriber.unsubscribe();
      },
      error: reject,
      complete: function() {
        {
          reject(new EmptyError());
        }
      }
    });
    source.subscribe(subscriber);
  });
}
function map(project, thisArg) {
  return operate(function(source, subscriber) {
    var index = 0;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      subscriber.next(project.call(thisArg, value, index++));
    }));
  });
}
var isArray$2 = Array.isArray;
function callOrApply(fn, args) {
  return isArray$2(args) ? fn.apply(void 0, __spreadArray([], __read(args))) : fn(args);
}
function mapOneOrManyArgs(fn) {
  return map(function(args) {
    return callOrApply(fn, args);
  });
}
var isArray$1 = Array.isArray;
var getPrototypeOf = Object.getPrototypeOf, objectProto = Object.prototype, getKeys = Object.keys;
function argsArgArrayOrObject(args) {
  if (args.length === 1) {
    var first_1 = args[0];
    if (isArray$1(first_1)) {
      return { args: first_1, keys: null };
    }
    if (isPOJO(first_1)) {
      var keys3 = getKeys(first_1);
      return {
        args: keys3.map(function(key) {
          return first_1[key];
        }),
        keys: keys3
      };
    }
  }
  return { args, keys: null };
}
function isPOJO(obj) {
  return obj && typeof obj === "object" && getPrototypeOf(obj) === objectProto;
}
function createObject(keys3, values) {
  return keys3.reduce(function(result, key, i) {
    return result[key] = values[i], result;
  }, {});
}
function combineLatest() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var scheduler = popScheduler(args);
  var resultSelector = popResultSelector(args);
  var _a = argsArgArrayOrObject(args), observables = _a.args, keys3 = _a.keys;
  if (observables.length === 0) {
    return from([], scheduler);
  }
  var result = new Observable(combineLatestInit(observables, scheduler, keys3 ? function(values) {
    return createObject(keys3, values);
  } : identity));
  return resultSelector ? result.pipe(mapOneOrManyArgs(resultSelector)) : result;
}
function combineLatestInit(observables, scheduler, valueTransform) {
  if (valueTransform === void 0) {
    valueTransform = identity;
  }
  return function(subscriber) {
    maybeSchedule(scheduler, function() {
      var length = observables.length;
      var values = new Array(length);
      var active = length;
      var remainingFirstValues = length;
      var _loop_1 = function(i2) {
        maybeSchedule(scheduler, function() {
          var source = from(observables[i2], scheduler);
          var hasFirstValue = false;
          source.subscribe(createOperatorSubscriber(subscriber, function(value) {
            values[i2] = value;
            if (!hasFirstValue) {
              hasFirstValue = true;
              remainingFirstValues--;
            }
            if (!remainingFirstValues) {
              subscriber.next(valueTransform(values.slice()));
            }
          }, function() {
            if (!--active) {
              subscriber.complete();
            }
          }));
        }, subscriber);
      };
      for (var i = 0; i < length; i++) {
        _loop_1(i);
      }
    }, subscriber);
  };
}
function maybeSchedule(scheduler, execute, subscription) {
  if (scheduler) {
    executeSchedule(subscription, scheduler, execute);
  } else {
    execute();
  }
}
function mergeInternals(source, subscriber, project, concurrent, onBeforeNext, expand, innerSubScheduler, additionalFinalizer) {
  var buffer = [];
  var active = 0;
  var index = 0;
  var isComplete = false;
  var checkComplete = function() {
    if (isComplete && !buffer.length && !active) {
      subscriber.complete();
    }
  };
  var outerNext = function(value) {
    return active < concurrent ? doInnerSub(value) : buffer.push(value);
  };
  var doInnerSub = function(value) {
    active++;
    var innerComplete = false;
    innerFrom(project(value, index++)).subscribe(createOperatorSubscriber(subscriber, function(innerValue) {
      {
        subscriber.next(innerValue);
      }
    }, function() {
      innerComplete = true;
    }, void 0, function() {
      if (innerComplete) {
        try {
          active--;
          var _loop_1 = function() {
            var bufferedValue = buffer.shift();
            if (innerSubScheduler) ;
            else {
              doInnerSub(bufferedValue);
            }
          };
          while (buffer.length && active < concurrent) {
            _loop_1();
          }
          checkComplete();
        } catch (err) {
          subscriber.error(err);
        }
      }
    }));
  };
  source.subscribe(createOperatorSubscriber(subscriber, outerNext, function() {
    isComplete = true;
    checkComplete();
  }));
  return function() {
  };
}
function mergeMap(project, resultSelector, concurrent) {
  if (concurrent === void 0) {
    concurrent = Infinity;
  }
  if (isFunction$2(resultSelector)) {
    return mergeMap(function(a, i) {
      return map(function(b2, ii) {
        return resultSelector(a, b2, i, ii);
      })(innerFrom(project(a, i)));
    }, concurrent);
  } else if (typeof resultSelector === "number") {
    concurrent = resultSelector;
  }
  return operate(function(source, subscriber) {
    return mergeInternals(source, subscriber, project, concurrent);
  });
}
function mergeAll(concurrent) {
  if (concurrent === void 0) {
    concurrent = Infinity;
  }
  return mergeMap(identity, concurrent);
}
function concatAll() {
  return mergeAll(1);
}
function concat$1() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  return concatAll()(from(args, popScheduler(args)));
}
function merge$1() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var scheduler = popScheduler(args);
  var concurrent = popNumber(args, Infinity);
  var sources = args;
  return !sources.length ? EMPTY : sources.length === 1 ? innerFrom(sources[0]) : mergeAll(concurrent)(from(sources, scheduler));
}
function filter(predicate, thisArg) {
  return operate(function(source, subscriber) {
    var index = 0;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      return predicate.call(thisArg, value, index++) && subscriber.next(value);
    }));
  });
}
function distinctUntilChanged(comparator, keySelector) {
  if (keySelector === void 0) {
    keySelector = identity;
  }
  comparator = comparator !== null && comparator !== void 0 ? comparator : defaultCompare;
  return operate(function(source, subscriber) {
    var previousKey;
    var first = true;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      var currentKey = keySelector(value);
      if (first || !comparator(previousKey, currentKey)) {
        first = false;
        previousKey = currentKey;
        subscriber.next(value);
      }
    }));
  });
}
function defaultCompare(a, b2) {
  return a === b2;
}
function share(options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.connector, connector = _a === void 0 ? function() {
    return new Subject();
  } : _a, _b = options.resetOnError, resetOnError = _b === void 0 ? true : _b, _c = options.resetOnComplete, resetOnComplete = _c === void 0 ? true : _c, _d = options.resetOnRefCountZero, resetOnRefCountZero = _d === void 0 ? true : _d;
  return function(wrapperSource) {
    var connection;
    var resetConnection;
    var subject;
    var refCount = 0;
    var hasCompleted = false;
    var hasErrored = false;
    var cancelReset = function() {
      resetConnection === null || resetConnection === void 0 ? void 0 : resetConnection.unsubscribe();
      resetConnection = void 0;
    };
    var reset = function() {
      cancelReset();
      connection = subject = void 0;
      hasCompleted = hasErrored = false;
    };
    var resetAndUnsubscribe = function() {
      var conn = connection;
      reset();
      conn === null || conn === void 0 ? void 0 : conn.unsubscribe();
    };
    return operate(function(source, subscriber) {
      refCount++;
      if (!hasErrored && !hasCompleted) {
        cancelReset();
      }
      var dest = subject = subject !== null && subject !== void 0 ? subject : connector();
      subscriber.add(function() {
        refCount--;
        if (refCount === 0 && !hasErrored && !hasCompleted) {
          resetConnection = handleReset(resetAndUnsubscribe, resetOnRefCountZero);
        }
      });
      dest.subscribe(subscriber);
      if (!connection && refCount > 0) {
        connection = new SafeSubscriber({
          next: function(value) {
            return dest.next(value);
          },
          error: function(err) {
            hasErrored = true;
            cancelReset();
            resetConnection = handleReset(reset, resetOnError, err);
            dest.error(err);
          },
          complete: function() {
            hasCompleted = true;
            cancelReset();
            resetConnection = handleReset(reset, resetOnComplete);
            dest.complete();
          }
        });
        innerFrom(source).subscribe(connection);
      }
    })(wrapperSource);
  };
}
function handleReset(reset, on) {
  var args = [];
  for (var _i = 2; _i < arguments.length; _i++) {
    args[_i - 2] = arguments[_i];
  }
  if (on === true) {
    reset();
    return;
  }
  if (on === false) {
    return;
  }
  var onSubscriber = new SafeSubscriber({
    next: function() {
      onSubscriber.unsubscribe();
      reset();
    }
  });
  return innerFrom(on.apply(void 0, __spreadArray([], __read(args)))).subscribe(onSubscriber);
}
function shareReplay(configOrBufferSize, windowTime, scheduler) {
  var _a, _b, _c;
  var bufferSize;
  var refCount = false;
  if (configOrBufferSize && typeof configOrBufferSize === "object") {
    _a = configOrBufferSize.bufferSize, bufferSize = _a === void 0 ? Infinity : _a, _b = configOrBufferSize.windowTime, windowTime = _b === void 0 ? Infinity : _b, _c = configOrBufferSize.refCount, refCount = _c === void 0 ? false : _c, scheduler = configOrBufferSize.scheduler;
  } else {
    bufferSize = configOrBufferSize !== null && configOrBufferSize !== void 0 ? configOrBufferSize : Infinity;
  }
  return share({
    connector: function() {
      return new ReplaySubject(bufferSize, windowTime, scheduler);
    },
    resetOnError: true,
    resetOnComplete: false,
    resetOnRefCountZero: refCount
  });
}
function startWith() {
  var values = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    values[_i] = arguments[_i];
  }
  var scheduler = popScheduler(values);
  return operate(function(source, subscriber) {
    (scheduler ? concat$1(values, source, scheduler) : concat$1(values, source)).subscribe(subscriber);
  });
}
function switchMap(project, resultSelector) {
  return operate(function(source, subscriber) {
    var innerSubscriber = null;
    var index = 0;
    var isComplete = false;
    var checkComplete = function() {
      return isComplete && !innerSubscriber && subscriber.complete();
    };
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      innerSubscriber === null || innerSubscriber === void 0 ? void 0 : innerSubscriber.unsubscribe();
      var innerIndex = 0;
      var outerIndex = index++;
      innerFrom(project(value, outerIndex)).subscribe(innerSubscriber = createOperatorSubscriber(subscriber, function(innerValue) {
        return subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue);
      }, function() {
        innerSubscriber = null;
        checkComplete();
      }));
    }, function() {
      isComplete = true;
      checkComplete();
    }));
  });
}
function createErrorAnswer(msg, error) {
  return {
    connectionId: msg.connectionId,
    answerTo: msg.requestId,
    method: msg.method,
    error: errorToPlainJson(error)
  };
}
function createAnswer(msg, ret) {
  return {
    connectionId: msg.connectionId,
    answerTo: msg.requestId,
    method: msg.method,
    return: ret
  };
}
var overwritable = {
  /**
   * if this method is overwritten with one
   * that returns true, we do additional checks
   * which help the developer but have bad performance
   */
  isDevMode() {
    return false;
  },
  /**
   * Deep freezes and object when in dev-mode.
   * Deep-Freezing has the same performance as deep-cloning, so we only do that in dev-mode.
   * Also, we can ensure the readonly state via typescript
   * @link https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
   */
  deepFreezeWhenDevMode(obj) {
    return obj;
  },
  /**
   * overwritten to map error-codes to text-messages
   */
  tunnelErrorMessage(message) {
    return "RxDB Error-Code " + message + ".\n        Error messages are not included in RxDB core to reduce build size.\n        ";
  }
};
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
function toPrimitive(t, r2) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r2);
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(t);
}
function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _defineProperties(e, r2) {
  for (var t = 0; t < r2.length; t++) {
    var o = r2[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, toPropertyKey(o.key), o);
  }
}
function _createClass(e, r2, t) {
  return r2 && _defineProperties(e.prototype, r2), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t2, e2) {
    return t2.__proto__ = e2, t2;
  }, _setPrototypeOf(t, e);
}
function _inheritsLoose(t, o) {
  t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o);
}
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t2) {
    return t2.__proto__ || Object.getPrototypeOf(t2);
  }, _getPrototypeOf(t);
}
function _isNativeFunction(t) {
  try {
    return -1 !== Function.toString.call(t).indexOf("[native code]");
  } catch (n2) {
    return "function" == typeof t;
  }
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch (t2) {
  }
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct2() {
    return !!t;
  })();
}
function _construct(t, e, r2) {
  if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
  var o = [null];
  o.push.apply(o, e);
  var p2 = new (t.bind.apply(t, o))();
  return r2 && _setPrototypeOf(p2, r2.prototype), p2;
}
function _wrapNativeSuper(t) {
  var r2 = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
  return _wrapNativeSuper = function _wrapNativeSuper2(t2) {
    if (null === t2 || !_isNativeFunction(t2)) return t2;
    if ("function" != typeof t2) throw new TypeError("Super expression must either be null or a function");
    if (void 0 !== r2) {
      if (r2.has(t2)) return r2.get(t2);
      r2.set(t2, Wrapper);
    }
    function Wrapper() {
      return _construct(t2, arguments, _getPrototypeOf(this).constructor);
    }
    return Wrapper.prototype = Object.create(t2.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    }), _setPrototypeOf(Wrapper, t2);
  }, _wrapNativeSuper(t);
}
function parametersToString(parameters) {
  var ret = "";
  if (Object.keys(parameters).length === 0) return ret;
  ret += "Given parameters: {\n";
  ret += Object.keys(parameters).map((k2) => {
    var paramStr = "[object Object]";
    try {
      if (k2 === "errors") {
        paramStr = parameters[k2].map((err) => JSON.stringify(err, Object.getOwnPropertyNames(err)));
      } else {
        paramStr = JSON.stringify(parameters[k2], function(_k, v) {
          return v === void 0 ? null : v;
        }, 2);
      }
    } catch (e) {
    }
    return k2 + ":" + paramStr;
  }).join("\n");
  ret += "}";
  return ret;
}
function messageForError(message, code, parameters) {
  return "RxError (" + code + "):\n" + message + "\n" + parametersToString(parameters);
}
var RxError = /* @__PURE__ */ function(_Error) {
  function RxError2(code, message, parameters = {}) {
    var _this;
    var mes = messageForError(message, code, parameters);
    _this = _Error.call(this, mes) || this;
    _this.code = code;
    _this.message = mes;
    _this.url = getErrorUrl(code);
    _this.parameters = parameters;
    _this.rxdb = true;
    return _this;
  }
  _inheritsLoose(RxError2, _Error);
  var _proto = RxError2.prototype;
  _proto.toString = function toString2() {
    return this.message;
  };
  return _createClass(RxError2, [{
    key: "name",
    get: function() {
      return "RxError (" + this.code + ")";
    }
  }, {
    key: "typeError",
    get: function() {
      return false;
    }
  }]);
}(/* @__PURE__ */ _wrapNativeSuper(Error));
var RxTypeError = /* @__PURE__ */ function(_TypeError) {
  function RxTypeError2(code, message, parameters = {}) {
    var _this2;
    var mes = messageForError(message, code, parameters);
    _this2 = _TypeError.call(this, mes) || this;
    _this2.code = code;
    _this2.message = mes;
    _this2.url = getErrorUrl(code);
    _this2.parameters = parameters;
    _this2.rxdb = true;
    return _this2;
  }
  _inheritsLoose(RxTypeError2, _TypeError);
  var _proto2 = RxTypeError2.prototype;
  _proto2.toString = function toString2() {
    return this.message;
  };
  return _createClass(RxTypeError2, [{
    key: "name",
    get: function() {
      return "RxTypeError (" + this.code + ")";
    }
  }, {
    key: "typeError",
    get: function() {
      return true;
    }
  }]);
}(/* @__PURE__ */ _wrapNativeSuper(TypeError));
function getErrorUrl(code) {
  return "https://rxdb.info/errors.html?console=errors#" + code;
}
function errorUrlHint(code) {
  return "\n You can find out more about this error here: " + getErrorUrl(code) + " ";
}
function newRxError(code, parameters) {
  return new RxError(code, overwritable.tunnelErrorMessage(code) + errorUrlHint(code), parameters);
}
function newRxTypeError(code, parameters) {
  return new RxTypeError(code, overwritable.tunnelErrorMessage(code) + errorUrlHint(code), parameters);
}
function isBulkWriteConflictError(err) {
  if (err && err.status === 409) {
    return err;
  } else {
    return false;
  }
}
var STORAGE_WRITE_ERROR_CODE_TO_MESSAGE = {
  409: "document write conflict",
  422: "schema validation error",
  510: "attachment data missing"
};
function rxStorageWriteErrorToRxError(err) {
  return newRxError("COL20", {
    name: STORAGE_WRITE_ERROR_CODE_TO_MESSAGE[err.status],
    document: err.documentId,
    writeError: err
  });
}
function getSchemaByObjectPath(rxJsonSchema, path) {
  var usePath = path;
  usePath = usePath.replace(REGEX_ALL_DOTS, ".properties.");
  usePath = "properties." + usePath;
  usePath = trimDots(usePath);
  var ret = getProperty$1(rxJsonSchema, usePath);
  return ret;
}
function fillPrimaryKey(primaryPath, jsonSchema, documentData) {
  if (typeof jsonSchema.primaryKey === "string") {
    return documentData;
  }
  var newPrimary = getComposedPrimaryKeyOfDocumentData(jsonSchema, documentData);
  var existingPrimary = documentData[primaryPath];
  if (existingPrimary && existingPrimary !== newPrimary) {
    throw newRxError("DOC19", {
      args: {
        documentData,
        existingPrimary,
        newPrimary
      },
      schema: jsonSchema
    });
  }
  documentData[primaryPath] = newPrimary;
  return documentData;
}
function getPrimaryFieldOfPrimaryKey(primaryKey) {
  if (typeof primaryKey === "string") {
    return primaryKey;
  } else {
    return primaryKey.key;
  }
}
function getLengthOfPrimaryKey(schema) {
  var primaryPath = getPrimaryFieldOfPrimaryKey(schema.primaryKey);
  var schemaPart = getSchemaByObjectPath(schema, primaryPath);
  return ensureNotFalsy(schemaPart.maxLength);
}
function getComposedPrimaryKeyOfDocumentData(jsonSchema, documentData) {
  if (typeof jsonSchema.primaryKey === "string") {
    return documentData[jsonSchema.primaryKey];
  }
  var compositePrimary = jsonSchema.primaryKey;
  return compositePrimary.fields.map((field) => {
    var value = getProperty$1(documentData, field);
    if (typeof value === "undefined") {
      throw newRxError("DOC18", {
        args: {
          field,
          documentData
        }
      });
    }
    return value;
  }).join(compositePrimary.separator);
}
function normalizeRxJsonSchema(jsonSchema) {
  var normalizedSchema = sortObject(jsonSchema, true);
  return normalizedSchema;
}
function getDefaultIndex(primaryPath) {
  return ["_deleted", primaryPath];
}
function fillWithDefaultSettings(schemaObj) {
  schemaObj = flatClone(schemaObj);
  var primaryPath = getPrimaryFieldOfPrimaryKey(schemaObj.primaryKey);
  schemaObj.properties = flatClone(schemaObj.properties);
  schemaObj.additionalProperties = false;
  if (!Object.prototype.hasOwnProperty.call(schemaObj, "keyCompression")) {
    schemaObj.keyCompression = false;
  }
  schemaObj.indexes = schemaObj.indexes ? schemaObj.indexes.slice(0) : [];
  schemaObj.required = schemaObj.required ? schemaObj.required.slice(0) : [];
  schemaObj.encrypted = schemaObj.encrypted ? schemaObj.encrypted.slice(0) : [];
  schemaObj.properties._rev = {
    type: "string",
    minLength: 1
  };
  schemaObj.properties._attachments = {
    type: "object"
  };
  schemaObj.properties._deleted = {
    type: "boolean"
  };
  schemaObj.properties._meta = RX_META_SCHEMA;
  schemaObj.required = schemaObj.required ? schemaObj.required.slice(0) : [];
  schemaObj.required.push("_deleted");
  schemaObj.required.push("_rev");
  schemaObj.required.push("_meta");
  schemaObj.required.push("_attachments");
  var finalFields = getFinalFields(schemaObj);
  appendToArray(schemaObj.required, finalFields);
  schemaObj.required = schemaObj.required.filter((field) => !field.includes(".")).filter((elem, pos, arr) => arr.indexOf(elem) === pos);
  schemaObj.version = schemaObj.version || 0;
  var useIndexes = schemaObj.indexes.map((index) => {
    var arIndex = isMaybeReadonlyArray(index) ? index.slice(0) : [index];
    if (!arIndex.includes(primaryPath)) {
      arIndex.push(primaryPath);
    }
    if (arIndex[0] !== "_deleted") {
      arIndex.unshift("_deleted");
    }
    return arIndex;
  });
  if (useIndexes.length === 0) {
    useIndexes.push(getDefaultIndex(primaryPath));
  }
  useIndexes.push(["_meta.lwt", primaryPath]);
  if (schemaObj.internalIndexes) {
    schemaObj.internalIndexes.map((idx) => {
      useIndexes.push(idx);
    });
  }
  var hasIndex = /* @__PURE__ */ new Set();
  useIndexes.filter((index) => {
    var indexStr = index.join(",");
    if (hasIndex.has(indexStr)) {
      return false;
    } else {
      hasIndex.add(indexStr);
      return true;
    }
  });
  schemaObj.indexes = useIndexes;
  return schemaObj;
}
var RX_META_SCHEMA = {
  type: "object",
  properties: {
    /**
     * The last-write time.
     * Unix time in milliseconds.
     */
    lwt: {
      type: "number",
      /**
       * We use 1 as minimum so that the value is never falsy.
       */
      minimum: RX_META_LWT_MINIMUM,
      maximum: 1e15,
      multipleOf: 0.01
    }
  },
  /**
   * Additional properties are allowed
   * and can be used by plugins to set various flags.
   */
  additionalProperties: true,
  required: ["lwt"]
};
function getFinalFields(jsonSchema) {
  var ret = Object.keys(jsonSchema.properties).filter((key) => jsonSchema.properties[key].final);
  var primaryPath = getPrimaryFieldOfPrimaryKey(jsonSchema.primaryKey);
  ret.push(primaryPath);
  if (typeof jsonSchema.primaryKey !== "string") {
    jsonSchema.primaryKey.fields.forEach((field) => ret.push(field));
  }
  return ret;
}
function fillObjectWithDefaults(rxSchema, obj) {
  var defaultKeys = Object.keys(rxSchema.defaultValues);
  for (var i = 0; i < defaultKeys.length; ++i) {
    var key = defaultKeys[i];
    if (!Object.prototype.hasOwnProperty.call(obj, key) || typeof obj[key] === "undefined") {
      obj[key] = rxSchema.defaultValues[key];
    }
  }
  return obj;
}
var HOOKS = {
  /**
   * Runs before a plugin is added.
   * Use this to block the usage of non-compatible plugins.
   */
  preAddRxPlugin: [],
  /**
   * functions that run before the database is created
   */
  preCreateRxDatabase: [],
  /**
   * runs after the database is created and prepared
   * but before the instance is returned to the user
   * @async
   */
  createRxDatabase: [],
  preCreateRxCollection: [],
  createRxCollection: [],
  createRxState: [],
  /**
  * runs at the end of the destroy-process of a collection
  * @async
  */
  postDestroyRxCollection: [],
  /**
   * Runs after a collection is removed.
   * @async
   */
  postRemoveRxCollection: [],
  /**
    * functions that get the json-schema as input
    * to do additionally checks/manipulation
    */
  preCreateRxSchema: [],
  /**
   * functions that run after the RxSchema is created
   * gets RxSchema as attribute
   */
  createRxSchema: [],
  preCreateRxQuery: [],
  /**
   * Runs before a query is send to the
   * prepareQuery function of the storage engine.
   */
  prePrepareQuery: [],
  createRxDocument: [],
  /**
   * runs after a RxDocument is created,
   * cannot be async
   */
  postCreateRxDocument: [],
  /**
   * Runs before a RxStorageInstance is created
   * gets the params of createStorageInstance()
   * as attribute so you can manipulate them.
   * Notice that you have to clone stuff before mutating the inputs.
   */
  preCreateRxStorageInstance: [],
  preStorageWrite: [],
  /**
   * runs on the document-data before the document is migrated
   * {
   *   doc: Object, // original doc-data
   *   migrated: // migrated doc-data after run through migration-strategies
   * }
   */
  preMigrateDocument: [],
  /**
   * runs after the migration of a document has been done
   */
  postMigrateDocument: [],
  /**
   * runs at the beginning of the destroy-process of a database
   */
  preDestroyRxDatabase: [],
  /**
   * runs after a database has been removed
   * @async
   */
  postRemoveRxDatabase: [],
  postCleanup: [],
  /**
   * runs before the replication writes the rows to master
   * but before the rows have been modified
   * @async
   */
  preReplicationMasterWrite: [],
  /**
   * runs after the replication has been sent to the server
   * but before the new documents have been handled
   * @async
   */
  preReplicationMasterWriteDocumentsHandle: []
};
function runPluginHooks(hookKey, obj) {
  if (HOOKS[hookKey].length > 0) {
    HOOKS[hookKey].forEach((fun) => fun(obj));
  }
}
function runAsyncPluginHooks(hookKey, obj) {
  return Promise.all(HOOKS[hookKey].map((fun) => fun(obj)));
}
function lastOfArray(ar) {
  return ar[ar.length - 1];
}
function isObject$1(value) {
  const type2 = typeof value;
  return value !== null && (type2 === "object" || type2 === "function");
}
function getProperty(object, path, value) {
  if (Array.isArray(path)) {
    path = path.join(".");
  }
  if (!isObject$1(object) || typeof path !== "string") {
    return object;
  }
  const pathArray = path.split(".");
  if (pathArray.length === 0) {
    return value;
  }
  for (let index = 0; index < pathArray.length; index++) {
    const key = pathArray[index];
    if (isStringIndex(object, key)) {
      object = index === pathArray.length - 1 ? void 0 : null;
    } else {
      object = object[key];
    }
    if (object === void 0 || object === null) {
      if (index !== pathArray.length - 1) {
        return value;
      }
      break;
    }
  }
  return object === void 0 ? value : object;
}
function isStringIndex(object, key) {
  if (typeof key !== "number" && Array.isArray(object)) {
    const index = Number.parseInt(key, 10);
    return Number.isInteger(index) && object[index] === object[key];
  }
  return false;
}
const hasLimit = (input) => {
  return !!input.queryParams.limit;
};
const isFindOne = (input) => {
  return input.queryParams.limit === 1;
};
const hasSkip = (input) => {
  if (input.queryParams.skip && input.queryParams.skip > 0) {
    return true;
  } else {
    return false;
  }
};
const isDelete = (input) => {
  return input.changeEvent.operation === "DELETE";
};
const isInsert = (input) => {
  return input.changeEvent.operation === "INSERT";
};
const isUpdate = (input) => {
  return input.changeEvent.operation === "UPDATE";
};
const wasLimitReached = (input) => {
  return hasLimit(input) && input.previousResults.length >= input.queryParams.limit;
};
const sortParamsChanged = (input) => {
  const sortFields = input.queryParams.sortFields;
  const prev = input.changeEvent.previous;
  const doc = input.changeEvent.doc;
  if (!doc) {
    return false;
  }
  if (!prev) {
    return true;
  }
  for (let i = 0; i < sortFields.length; i++) {
    const field = sortFields[i];
    const beforeData = getProperty(prev, field);
    const afterData = getProperty(doc, field);
    if (beforeData !== afterData) {
      return true;
    }
  }
  return false;
};
const wasInResult = (input) => {
  const id = input.changeEvent.id;
  if (input.keyDocumentMap) {
    const has2 = input.keyDocumentMap.has(id);
    return has2;
  } else {
    const primary = input.queryParams.primaryKey;
    const results = input.previousResults;
    for (let i = 0; i < results.length; i++) {
      const item = results[i];
      if (item[primary] === id) {
        return true;
      }
    }
    return false;
  }
};
const wasFirst = (input) => {
  const first = input.previousResults[0];
  if (first && first[input.queryParams.primaryKey] === input.changeEvent.id) {
    return true;
  } else {
    return false;
  }
};
const wasLast = (input) => {
  const last2 = lastOfArray(input.previousResults);
  if (last2 && last2[input.queryParams.primaryKey] === input.changeEvent.id) {
    return true;
  } else {
    return false;
  }
};
const wasSortedBeforeFirst = (input) => {
  const prev = input.changeEvent.previous;
  if (!prev) {
    return false;
  }
  const first = input.previousResults[0];
  if (!first) {
    return false;
  }
  if (first[input.queryParams.primaryKey] === input.changeEvent.id) {
    return true;
  }
  const comp = input.queryParams.sortComparator(prev, first);
  return comp < 0;
};
const wasSortedAfterLast = (input) => {
  const prev = input.changeEvent.previous;
  if (!prev) {
    return false;
  }
  const last2 = lastOfArray(input.previousResults);
  if (!last2) {
    return false;
  }
  if (last2[input.queryParams.primaryKey] === input.changeEvent.id) {
    return true;
  }
  const comp = input.queryParams.sortComparator(prev, last2);
  return comp > 0;
};
const isSortedBeforeFirst = (input) => {
  const doc = input.changeEvent.doc;
  if (!doc) {
    return false;
  }
  const first = input.previousResults[0];
  if (!first) {
    return false;
  }
  if (first[input.queryParams.primaryKey] === input.changeEvent.id) {
    return true;
  }
  const comp = input.queryParams.sortComparator(doc, first);
  return comp < 0;
};
const isSortedAfterLast = (input) => {
  const doc = input.changeEvent.doc;
  if (!doc) {
    return false;
  }
  const last2 = lastOfArray(input.previousResults);
  if (!last2) {
    return false;
  }
  if (last2[input.queryParams.primaryKey] === input.changeEvent.id) {
    return true;
  }
  const comp = input.queryParams.sortComparator(doc, last2);
  return comp > 0;
};
const wasMatching = (input) => {
  const prev = input.changeEvent.previous;
  if (!prev) {
    return false;
  }
  return input.queryParams.queryMatcher(prev);
};
const doesMatchNow = (input) => {
  const doc = input.changeEvent.doc;
  if (!doc) {
    return false;
  }
  const ret = input.queryParams.queryMatcher(doc);
  return ret;
};
const wasResultsEmpty = (input) => {
  return input.previousResults.length === 0;
};
const stateResolveFunctionByIndex = {
  0: isInsert,
  1: isUpdate,
  2: isDelete,
  3: hasLimit,
  4: isFindOne,
  5: hasSkip,
  6: wasResultsEmpty,
  7: wasLimitReached,
  8: wasFirst,
  9: wasLast,
  10: sortParamsChanged,
  11: wasInResult,
  12: wasSortedBeforeFirst,
  13: wasSortedAfterLast,
  14: isSortedBeforeFirst,
  15: isSortedAfterLast,
  16: wasMatching,
  17: doesMatchNow
};
function pushAtSortPosition(array, item, compareFunction, low) {
  var length = array.length;
  var high = length - 1;
  var mid = 0;
  if (length === 0) {
    array.push(item);
    return 0;
  }
  var lastMidDoc;
  while (low <= high) {
    mid = low + (high - low >> 1);
    lastMidDoc = array[mid];
    if (compareFunction(lastMidDoc, item) <= 0) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  if (compareFunction(lastMidDoc, item) <= 0) {
    mid++;
  }
  array.splice(mid, 0, item);
  return mid;
}
const doNothing = (_input) => {
};
const insertFirst = (input) => {
  input.previousResults.unshift(input.changeEvent.doc);
  if (input.keyDocumentMap) {
    input.keyDocumentMap.set(input.changeEvent.id, input.changeEvent.doc);
  }
};
const insertLast = (input) => {
  input.previousResults.push(input.changeEvent.doc);
  if (input.keyDocumentMap) {
    input.keyDocumentMap.set(input.changeEvent.id, input.changeEvent.doc);
  }
};
const removeFirstItem = (input) => {
  const first = input.previousResults.shift();
  if (input.keyDocumentMap && first) {
    input.keyDocumentMap.delete(first[input.queryParams.primaryKey]);
  }
};
const removeLastItem = (input) => {
  const last2 = input.previousResults.pop();
  if (input.keyDocumentMap && last2) {
    input.keyDocumentMap.delete(last2[input.queryParams.primaryKey]);
  }
};
const removeFirstInsertLast = (input) => {
  removeFirstItem(input);
  insertLast(input);
};
const removeLastInsertFirst = (input) => {
  removeLastItem(input);
  insertFirst(input);
};
const removeFirstInsertFirst = (input) => {
  removeFirstItem(input);
  insertFirst(input);
};
const removeLastInsertLast = (input) => {
  removeLastItem(input);
  insertLast(input);
};
const removeExisting = (input) => {
  if (input.keyDocumentMap) {
    input.keyDocumentMap.delete(input.changeEvent.id);
  }
  const primary = input.queryParams.primaryKey;
  const results = input.previousResults;
  for (let i = 0; i < results.length; i++) {
    const item = results[i];
    if (item[primary] === input.changeEvent.id) {
      results.splice(i, 1);
      break;
    }
  }
};
const replaceExisting = (input) => {
  const doc = input.changeEvent.doc;
  const primary = input.queryParams.primaryKey;
  const results = input.previousResults;
  for (let i = 0; i < results.length; i++) {
    const item = results[i];
    if (item[primary] === input.changeEvent.id) {
      results[i] = doc;
      if (input.keyDocumentMap) {
        input.keyDocumentMap.set(input.changeEvent.id, doc);
      }
      break;
    }
  }
};
const alwaysWrong = (input) => {
  const wrongHuman = {
    _id: "wrongHuman" + (/* @__PURE__ */ new Date()).getTime()
  };
  input.previousResults.length = 0;
  input.previousResults.push(wrongHuman);
  if (input.keyDocumentMap) {
    input.keyDocumentMap.clear();
    input.keyDocumentMap.set(wrongHuman._id, wrongHuman);
  }
};
const insertAtSortPosition = (input) => {
  const docId = input.changeEvent.id;
  const doc = input.changeEvent.doc;
  if (input.keyDocumentMap) {
    if (input.keyDocumentMap.has(docId)) {
      return;
    }
    input.keyDocumentMap.set(docId, doc);
  } else {
    const isDocInResults = input.previousResults.find((d) => d[input.queryParams.primaryKey] === docId);
    if (isDocInResults) {
      return;
    }
  }
  pushAtSortPosition(input.previousResults, doc, input.queryParams.sortComparator, 0);
};
const removeExistingAndInsertAtSortPosition = (input) => {
  removeExisting(input);
  insertAtSortPosition(input);
};
const runFullQueryAgain = (_input) => {
  throw new Error("Action runFullQueryAgain must be implemented by yourself");
};
const unknownAction = (_input) => {
  throw new Error("Action unknownAction should never be called");
};
const orderedActionList = [
  "doNothing",
  "insertFirst",
  "insertLast",
  "removeFirstItem",
  "removeLastItem",
  "removeFirstInsertLast",
  "removeLastInsertFirst",
  "removeFirstInsertFirst",
  "removeLastInsertLast",
  "removeExisting",
  "replaceExisting",
  "alwaysWrong",
  "insertAtSortPosition",
  "removeExistingAndInsertAtSortPosition",
  "runFullQueryAgain",
  "unknownAction"
];
const actionFunctions = {
  doNothing,
  insertFirst,
  insertLast,
  removeFirstItem,
  removeLastItem,
  removeFirstInsertLast,
  removeLastInsertFirst,
  removeFirstInsertFirst,
  removeLastInsertLast,
  removeExisting,
  replaceExisting,
  alwaysWrong,
  insertAtSortPosition,
  removeExistingAndInsertAtSortPosition,
  runFullQueryAgain,
  unknownAction
};
const CHAR_CODE_OFFSET = 40;
function getNumberOfChar(char) {
  const charCode = char.charCodeAt(0);
  return charCode - CHAR_CODE_OFFSET;
}
function booleanToBooleanString(b2) {
  if (b2) {
    return "1";
  } else {
    return "0";
  }
}
function splitStringToChunks(str, chunkSize) {
  const chunks = [];
  for (let i = 0, charsLength = str.length; i < charsLength; i += chunkSize) {
    chunks.push(str.substring(i, i + chunkSize));
  }
  return chunks;
}
function minimalStringToSimpleBdd(str) {
  const nodesById = /* @__PURE__ */ new Map();
  const leafNodeAmount = parseInt(str.charAt(0) + str.charAt(1), 10);
  const lastLeafNodeChar = 2 + leafNodeAmount * 2;
  const leafNodeChars = str.substring(2, lastLeafNodeChar);
  const leafNodeChunks = splitStringToChunks(leafNodeChars, 2);
  for (let i = 0; i < leafNodeChunks.length; i++) {
    const chunk = leafNodeChunks[i];
    const id = chunk.charAt(0);
    const value = getNumberOfChar(chunk.charAt(1));
    nodesById.set(id, value);
  }
  const internalNodeChars = str.substring(lastLeafNodeChar, str.length - 3);
  const internalNodeChunks = splitStringToChunks(internalNodeChars, 4);
  for (let i = 0; i < internalNodeChunks.length; i++) {
    const chunk = internalNodeChunks[i];
    const id = chunk.charAt(0);
    const idOf0Branch = chunk.charAt(1);
    const idOf1Branch = chunk.charAt(2);
    const level = getNumberOfChar(chunk.charAt(3));
    if (!nodesById.has(idOf0Branch)) {
      throw new Error("missing node with id " + idOf0Branch);
    }
    if (!nodesById.has(idOf1Branch)) {
      throw new Error("missing node with id " + idOf1Branch);
    }
    const node0 = nodesById.get(idOf0Branch);
    const node1 = nodesById.get(idOf1Branch);
    const node = {
      l: level,
      // level is first for prettier json output
      0: node0,
      1: node1
    };
    nodesById.set(id, node);
  }
  const last3 = str.slice(-3);
  const idOf0 = last3.charAt(0);
  const idOf1 = last3.charAt(1);
  const levelOfRoot = getNumberOfChar(last3.charAt(2));
  const nodeOf0 = nodesById.get(idOf0);
  const nodeOf1 = nodesById.get(idOf1);
  const rootNode = {
    l: levelOfRoot,
    0: nodeOf0,
    1: nodeOf1
  };
  return rootNode;
}
function resolveWithSimpleBdd(simpleBdd2, fns, input) {
  let currentNode = simpleBdd2;
  let currentLevel = simpleBdd2.l;
  while (true) {
    const booleanResult = fns[currentLevel](input);
    const branchKey = booleanToBooleanString(booleanResult);
    currentNode = currentNode[branchKey];
    if (typeof currentNode === "number" || typeof currentNode === "string") {
      return currentNode;
    } else {
      currentLevel = currentNode.l;
    }
  }
}
const minimalBddString = "14a1b,c+d2e5f0g/h.i4j*k-l)m(n6oeh6pnm6qen6ril6snh6tin6ubo9vce9wmh9xns9yne9zmi9{cm9|ad9}cp9~aq9ae9¡bf9¢bq9£cg9¤ck9¥cn9¦nd9§np9¨nq9©nf9ªng9«nm9¬nk9­mr9®ms9¯mt9°mj9±mk9²ml9³mn9´mc8µ³{8¶¯}8·°¤8¸³§8¹mn8º³«8»³m8¼m´4½z²4¾³w4¿zµ4À¯¶4Á°·4Â³º4Ã³¸4Äm¹4Åv¤7Æyn7ÇÀÁ7È~7É¥¤7ÊÃÄ7Ë¨n7Ìº¹7Í­°7Î®m7Ï¯°7Ð±m7Ñ³m7Ò¼m5ÓÄm5Ô¹m5Õ½°5Ö¾m5×¿°5ØÇÏ5ÙÂm5ÚÊÑ5Û±m5Üºm5ÝÌÑ5ÞÕÍ2ß|2à¡u2á£Å2âÖÎ2ã¦Æ2ä©x2åªÆ2æ×Ø2ç|È2è¡¢2é£É2ê¤¥2ëÙÚ2ì¦Ë2í©n2îªn2ïÛÐ2ðÜÝ2ñ¬n2òÒÓ/óan/ôbn/õcn/öÞâ/÷ßã/øàä/ùáå/úæë/ûçì/üèí/ýéî/þÍÎ/ÿÏÑ/ĀòÔ,ācn,Ăöï,ă¤ñ,Ąúð,ąêñ,ĆþÐ,ćÿÑ,Ĉac0ĉbc0Ċóõ0ċôā0Čßá0čà¤0Ďçé0ďèê0Đ÷ù0đøă0Ēûý0ēüą0ĔmÒ-ĕmĀ-ĖÞæ-ėČĎ-Ęčď-ęĂĄ-ĚĐĒ-ěđē-Ĝ²»-ĝÍÏ-ĞĆć-ğ²³-ĠĔĈ3ġĕĊ3ĢĖė3ģęĚ3ĤĢĝ(ĥĜğ(ĦģĞ(ħĠġ+Ĩĉċ+ĩĤĦ+ĪĘě+īħĨ1ĬĩĪ1ĭĬī*Įĥm*ĭĮ.";
let simpleBdd;
function getSimpleBdd() {
  if (!simpleBdd) {
    simpleBdd = minimalStringToSimpleBdd(minimalBddString);
  }
  return simpleBdd;
}
const resolveInput = (input) => {
  return resolveWithSimpleBdd(getSimpleBdd(), stateResolveFunctionByIndex, input);
};
function calculateActionName(input) {
  const resolvedActionId = resolveInput(input);
  return orderedActionList[resolvedActionId];
}
function runAction(action, queryParams, changeEvent, previousResults, keyDocumentMap) {
  const fn = actionFunctions[action];
  fn({
    queryParams,
    changeEvent,
    previousResults,
    keyDocumentMap
  });
  return previousResults;
}
function getDocumentDataOfRxChangeEvent(rxChangeEvent) {
  if (rxChangeEvent.documentData) {
    return rxChangeEvent.documentData;
  } else {
    return rxChangeEvent.previousDocumentData;
  }
}
function rxChangeEventToEventReduceChangeEvent(rxChangeEvent) {
  switch (rxChangeEvent.operation) {
    case "INSERT":
      return {
        operation: rxChangeEvent.operation,
        id: rxChangeEvent.documentId,
        doc: rxChangeEvent.documentData,
        previous: null
      };
    case "UPDATE":
      return {
        operation: rxChangeEvent.operation,
        id: rxChangeEvent.documentId,
        doc: overwritable.deepFreezeWhenDevMode(rxChangeEvent.documentData),
        previous: rxChangeEvent.previousDocumentData ? rxChangeEvent.previousDocumentData : "UNKNOWN"
      };
    case "DELETE":
      return {
        operation: rxChangeEvent.operation,
        id: rxChangeEvent.documentId,
        doc: null,
        previous: rxChangeEvent.previousDocumentData
      };
  }
}
var INDEX_MAX = String.fromCharCode(65535);
var INDEX_MIN = Number.MIN_SAFE_INTEGER;
function getQueryPlan(schema, query) {
  var selector = query.selector;
  var indexes = schema.indexes ? schema.indexes.slice(0) : [];
  if (query.index) {
    indexes = [query.index];
  }
  var hasDescSorting = !!query.sort.find((sortField) => Object.values(sortField)[0] === "desc");
  var sortIrrelevevantFields = /* @__PURE__ */ new Set();
  Object.keys(selector).forEach((fieldName) => {
    var schemaPart = getSchemaByObjectPath(schema, fieldName);
    if (schemaPart && schemaPart.type === "boolean" && Object.prototype.hasOwnProperty.call(selector[fieldName], "$eq")) {
      sortIrrelevevantFields.add(fieldName);
    }
  });
  var optimalSortIndex = query.sort.map((sortField) => Object.keys(sortField)[0]);
  var optimalSortIndexCompareString = optimalSortIndex.filter((f2) => !sortIrrelevevantFields.has(f2)).join(",");
  var currentBestQuality = -1;
  var currentBestQueryPlan;
  indexes.forEach((index) => {
    var inclusiveEnd = true;
    var inclusiveStart = true;
    var opts = index.map((indexField) => {
      var matcher = selector[indexField];
      var operators = matcher ? Object.keys(matcher) : [];
      var matcherOpts = {};
      if (!matcher || !operators.length) {
        var startKey = inclusiveStart ? INDEX_MIN : INDEX_MAX;
        matcherOpts = {
          startKey,
          endKey: inclusiveEnd ? INDEX_MAX : INDEX_MIN,
          inclusiveStart: true,
          inclusiveEnd: true
        };
      } else {
        operators.forEach((operator) => {
          if (LOGICAL_OPERATORS.has(operator)) {
            var operatorValue = matcher[operator];
            var partialOpts = getMatcherQueryOpts(operator, operatorValue);
            matcherOpts = Object.assign(matcherOpts, partialOpts);
          }
        });
      }
      if (typeof matcherOpts.startKey === "undefined") {
        matcherOpts.startKey = INDEX_MIN;
      }
      if (typeof matcherOpts.endKey === "undefined") {
        matcherOpts.endKey = INDEX_MAX;
      }
      if (typeof matcherOpts.inclusiveStart === "undefined") {
        matcherOpts.inclusiveStart = true;
      }
      if (typeof matcherOpts.inclusiveEnd === "undefined") {
        matcherOpts.inclusiveEnd = true;
      }
      if (inclusiveStart && !matcherOpts.inclusiveStart) {
        inclusiveStart = false;
      }
      if (inclusiveEnd && !matcherOpts.inclusiveEnd) {
        inclusiveEnd = false;
      }
      return matcherOpts;
    });
    var startKeys = opts.map((opt) => opt.startKey);
    var endKeys = opts.map((opt) => opt.endKey);
    var queryPlan = {
      index,
      startKeys,
      endKeys,
      inclusiveEnd,
      inclusiveStart,
      sortSatisfiedByIndex: !hasDescSorting && optimalSortIndexCompareString === index.filter((f2) => !sortIrrelevevantFields.has(f2)).join(","),
      selectorSatisfiedByIndex: isSelectorSatisfiedByIndex(index, query.selector, startKeys, endKeys)
    };
    var quality = rateQueryPlan(schema, query, queryPlan);
    if (quality >= currentBestQuality || query.index) {
      currentBestQuality = quality;
      currentBestQueryPlan = queryPlan;
    }
  });
  if (!currentBestQueryPlan) {
    throw newRxError("SNH", {
      query
    });
  }
  return currentBestQueryPlan;
}
var LOGICAL_OPERATORS = /* @__PURE__ */ new Set(["$eq", "$gt", "$gte", "$lt", "$lte"]);
var LOWER_BOUND_LOGICAL_OPERATORS = /* @__PURE__ */ new Set(["$eq", "$gt", "$gte"]);
var UPPER_BOUND_LOGICAL_OPERATORS = /* @__PURE__ */ new Set(["$eq", "$lt", "$lte"]);
function isSelectorSatisfiedByIndex(index, selector, startKeys, endKeys) {
  var selectorEntries = Object.entries(selector);
  var hasNonMatchingOperator = selectorEntries.find(([fieldName2, operation2]) => {
    if (!index.includes(fieldName2)) {
      return true;
    }
    var hasNonLogicOperator = Object.entries(operation2).find(([op, _value]) => !LOGICAL_OPERATORS.has(op));
    return hasNonLogicOperator;
  });
  if (hasNonMatchingOperator) {
    return false;
  }
  if (selector.$and || selector.$or) {
    return false;
  }
  var satisfieldLowerBound = [];
  var lowerOperatorFieldNames = /* @__PURE__ */ new Set();
  for (var [fieldName, operation] of Object.entries(selector)) {
    if (!index.includes(fieldName)) {
      return false;
    }
    var lowerLogicOps = Object.keys(operation).filter((key) => LOWER_BOUND_LOGICAL_OPERATORS.has(key));
    if (lowerLogicOps.length > 1) {
      return false;
    }
    var hasLowerLogicOp = lowerLogicOps[0];
    if (hasLowerLogicOp) {
      lowerOperatorFieldNames.add(fieldName);
    }
    if (hasLowerLogicOp !== "$eq") {
      if (satisfieldLowerBound.length > 0) {
        return false;
      } else {
        satisfieldLowerBound.push(hasLowerLogicOp);
      }
    }
  }
  var satisfieldUpperBound = [];
  var upperOperatorFieldNames = /* @__PURE__ */ new Set();
  for (var [_fieldName, _operation] of Object.entries(selector)) {
    if (!index.includes(_fieldName)) {
      return false;
    }
    var upperLogicOps = Object.keys(_operation).filter((key) => UPPER_BOUND_LOGICAL_OPERATORS.has(key));
    if (upperLogicOps.length > 1) {
      return false;
    }
    var hasUperLogicOp = upperLogicOps[0];
    if (hasUperLogicOp) {
      upperOperatorFieldNames.add(_fieldName);
    }
    if (hasUperLogicOp !== "$eq") {
      if (satisfieldUpperBound.length > 0) {
        return false;
      } else {
        satisfieldUpperBound.push(hasUperLogicOp);
      }
    }
  }
  var i = 0;
  for (var _fieldName2 of index) {
    for (var set of [lowerOperatorFieldNames, upperOperatorFieldNames]) {
      if (!set.has(_fieldName2) && set.size > 0) {
        return false;
      }
      set.delete(_fieldName2);
    }
    var startKey = startKeys[i];
    var endKey = endKeys[i];
    if (startKey !== endKey && lowerOperatorFieldNames.size > 0 && upperOperatorFieldNames.size > 0) {
      return false;
    }
    i++;
  }
  return true;
}
function getMatcherQueryOpts(operator, operatorValue) {
  switch (operator) {
    case "$eq":
      return {
        startKey: operatorValue,
        endKey: operatorValue,
        inclusiveEnd: true,
        inclusiveStart: true
      };
    case "$lte":
      return {
        endKey: operatorValue,
        inclusiveEnd: true
      };
    case "$gte":
      return {
        startKey: operatorValue,
        inclusiveStart: true
      };
    case "$lt":
      return {
        endKey: operatorValue,
        inclusiveEnd: false
      };
    case "$gt":
      return {
        startKey: operatorValue,
        inclusiveStart: false
      };
    default:
      throw new Error("SNH");
  }
}
function rateQueryPlan(schema, query, queryPlan) {
  var quality = 0;
  var addQuality = (value) => {
    if (value > 0) {
      quality = quality + value;
    }
  };
  var pointsPerMatchingKey = 10;
  var nonMinKeyCount = countUntilNotMatching(queryPlan.startKeys, (keyValue) => keyValue !== INDEX_MIN && keyValue !== INDEX_MAX);
  addQuality(nonMinKeyCount * pointsPerMatchingKey);
  var nonMaxKeyCount = countUntilNotMatching(queryPlan.startKeys, (keyValue) => keyValue !== INDEX_MAX && keyValue !== INDEX_MIN);
  addQuality(nonMaxKeyCount * pointsPerMatchingKey);
  var equalKeyCount = countUntilNotMatching(queryPlan.startKeys, (keyValue, idx) => {
    if (keyValue === queryPlan.endKeys[idx]) {
      return true;
    } else {
      return false;
    }
  });
  addQuality(equalKeyCount * pointsPerMatchingKey * 1.5);
  var pointsIfNoReSortMustBeDone = queryPlan.sortSatisfiedByIndex ? 5 : 0;
  addQuality(pointsIfNoReSortMustBeDone);
  return quality;
}
class MingoError extends Error {
}
const MAX_INT = 2147483647;
const MIN_INT = -2147483648;
const MAX_LONG = Number.MAX_SAFE_INTEGER;
const MIN_LONG = Number.MIN_SAFE_INTEGER;
const MISSING = Symbol("missing");
const CYCLE_FOUND_ERROR = Object.freeze(
  new Error("mingo: cycle detected while processing object/array")
);
const OBJECT_TAG = "[object Object]";
const OBJECT_TYPE_RE = /^\[object ([a-zA-Z0-9]+)\]$/;
const DEFAULT_HASH_FUNCTION = (value) => {
  const s2 = stringify(value);
  let hash = 0;
  let i = s2.length;
  while (i)
    hash = (hash << 5) - hash ^ s2.charCodeAt(--i);
  return hash >>> 0;
};
const JS_SIMPLE_TYPES = /* @__PURE__ */ new Set([
  "null",
  "undefined",
  "boolean",
  "number",
  "string",
  "date",
  "regexp"
]);
const SORT_ORDER_BY_TYPE = {
  null: 0,
  undefined: 0,
  number: 1,
  string: 2,
  object: 3,
  array: 4,
  boolean: 5,
  date: 6,
  regexp: 7,
  function: 8
};
const compare$1 = (a, b2) => {
  if (a === MISSING)
    a = void 0;
  if (b2 === MISSING)
    b2 = void 0;
  const [u2, v] = [a, b2].map(
    (n2) => SORT_ORDER_BY_TYPE[getType(n2).toLowerCase()]
  );
  if (u2 !== v)
    return u2 - v;
  if (u2 === 1 || u2 === 2 || u2 === 6) {
    if (a < b2)
      return -1;
    if (a > b2)
      return 1;
    return 0;
  }
  if (isEqual(a, b2))
    return 0;
  if (a < b2)
    return -1;
  if (a > b2)
    return 1;
  return 0;
};
function assert(condition, message) {
  if (!condition)
    throw new MingoError(message);
}
const getType = (v) => OBJECT_TYPE_RE.exec(Object.prototype.toString.call(v))[1];
const isBoolean = (v) => typeof v === "boolean";
const isString = (v) => typeof v === "string";
const isNumber = (v) => !isNaN(v) && typeof v === "number";
const isArray = Array.isArray;
const isObject = (v) => {
  if (!v)
    return false;
  const proto = Object.getPrototypeOf(v);
  return (proto === Object.prototype || proto === null) && OBJECT_TAG === Object.prototype.toString.call(v);
};
const isObjectLike = (v) => v === Object(v);
const isDate = (v) => v instanceof Date;
const isRegExp = (v) => v instanceof RegExp;
const isFunction$1 = (v) => typeof v === "function";
const isNil = (v) => v === null || v === void 0;
const inArray = (arr, item) => arr.includes(item);
const notInArray = (arr, item) => !inArray(arr, item);
const truthy = (arg, strict = true) => !!arg || strict && arg === "";
const isEmpty = (x) => isNil(x) || isString(x) && !x || x instanceof Array && x.length === 0 || isObject(x) && Object.keys(x).length === 0;
const isMissing = (v) => v === MISSING;
const ensureArray = (x) => x instanceof Array ? x : [x];
const has = (obj, prop) => !!obj && Object.prototype.hasOwnProperty.call(obj, prop);
const isTypedArray = (v) => typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView(v);
const INSTANCE_CLONE = [isDate, isRegExp, isTypedArray];
const cloneInternal = (val, refs) => {
  if (isNil(val))
    return val;
  if (refs.has(val))
    throw CYCLE_FOUND_ERROR;
  const ctor = val.constructor;
  if (INSTANCE_CLONE.some((f2) => f2(val)))
    return new ctor(val);
  try {
    refs.add(val);
    if (isArray(val))
      return val.map((v) => cloneInternal(v, refs));
    if (isObject(val)) {
      const res = {};
      for (const k2 in val)
        res[k2] = cloneInternal(val[k2], refs);
      return res;
    }
  } finally {
    refs.delete(val);
  }
  return val;
};
const cloneDeep = (obj) => cloneInternal(obj, /* @__PURE__ */ new Set());
const mergeable = (left, right) => isObject(left) && isObject(right) || isArray(left) && isArray(right);
function merge(target, obj, options) {
  options = options || { flatten: false };
  if (isMissing(target) || isNil(target))
    return obj;
  if (isMissing(obj) || isNil(obj))
    return target;
  if (!mergeable(target, obj)) {
    if (options.skipValidation)
      return obj || target;
    throw Error("mismatched types. must both be array or object");
  }
  options.skipValidation = true;
  if (isArray(target)) {
    const result = target;
    const input = obj;
    if (options.flatten) {
      let i = 0;
      let j = 0;
      while (i < result.length && j < input.length) {
        result[i] = merge(result[i++], input[j++], options);
      }
      while (j < input.length) {
        result.push(obj[j++]);
      }
    } else {
      into(result, input);
    }
  } else {
    for (const k2 in obj) {
      target[k2] = merge(
        target[k2],
        obj[k2],
        options
      );
    }
  }
  return target;
}
function buildHashIndex(arr, hashFunction = DEFAULT_HASH_FUNCTION) {
  const map2 = /* @__PURE__ */ new Map();
  arr.forEach((o, i) => {
    const h = hashCode(o, hashFunction);
    if (map2.has(h)) {
      if (!map2.get(h).some((j) => isEqual(arr[j], o))) {
        map2.get(h).push(i);
      }
    } else {
      map2.set(h, [i]);
    }
  });
  return map2;
}
function intersection(input, hashFunction = DEFAULT_HASH_FUNCTION) {
  if (input.some((arr) => arr.length == 0))
    return [];
  if (input.length === 1)
    return Array.from(input);
  const sortedIndex = sortBy(
    input.map((a, i) => [i, a.length]),
    (a) => a[1]
  );
  const smallest = input[sortedIndex[0][0]];
  const map2 = buildHashIndex(smallest, hashFunction);
  const rmap = /* @__PURE__ */ new Map();
  const results = new Array();
  map2.forEach((v, k2) => {
    const lhs = v.map((j) => smallest[j]);
    const res = lhs.map((_) => 0);
    const stable = lhs.map((_) => [sortedIndex[0][0], 0]);
    let found = false;
    for (let i = 1; i < input.length; i++) {
      const [currIndex, _] = sortedIndex[i];
      const arr = input[currIndex];
      if (!rmap.has(i))
        rmap.set(i, buildHashIndex(arr));
      if (rmap.get(i).has(k2)) {
        const rhs = rmap.get(i).get(k2).map((j) => arr[j]);
        found = lhs.map(
          (s2, n2) => rhs.some((t, m2) => {
            const p2 = res[n2];
            if (isEqual(s2, t)) {
              res[n2]++;
              if (currIndex < stable[n2][0]) {
                stable[n2] = [currIndex, rmap.get(i).get(k2)[m2]];
              }
            }
            return p2 < res[n2];
          })
        ).some(Boolean);
      }
      if (!found)
        return;
    }
    if (found) {
      into(
        results,
        res.map((n2, i) => {
          return n2 === input.length - 1 ? [lhs[i], stable[i]] : MISSING;
        }).filter((n2) => n2 !== MISSING)
      );
    }
  });
  return results.sort((a, b2) => {
    const [_i, [u2, m2]] = a;
    const [_j, [v, n2]] = b2;
    const r2 = compare$1(u2, v);
    if (r2 !== 0)
      return r2;
    return compare$1(m2, n2);
  }).map((v) => v[0]);
}
function flatten(xs, depth = 0) {
  const arr = new Array();
  function flatten2(ys, n2) {
    for (let i = 0, len = ys.length; i < len; i++) {
      if (isArray(ys[i]) && (n2 > 0 || n2 < 0)) {
        flatten2(ys[i], Math.max(-1, n2 - 1));
      } else {
        arr.push(ys[i]);
      }
    }
  }
  flatten2(xs, depth);
  return arr;
}
const getMembersOf = (value) => {
  let [proto, names] = [
    Object.getPrototypeOf(value),
    Object.getOwnPropertyNames(value)
  ];
  let activeProto = proto;
  while (!names.length && proto !== Object.prototype && proto !== Array.prototype) {
    activeProto = proto;
    names = Object.getOwnPropertyNames(proto);
    proto = Object.getPrototypeOf(proto);
  }
  const o = {};
  names.forEach((k2) => o[k2] = value[k2]);
  return [o, activeProto];
};
function isEqual(a, b2) {
  if (a === b2 || Object.is(a, b2))
    return true;
  const ctor = !!a && a.constructor || a;
  if (a === null || b2 === null || a === void 0 || b2 === void 0 || ctor !== b2.constructor || ctor === Function) {
    return false;
  }
  if (ctor === Array || ctor === Object) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b2);
    if (aKeys.length !== bKeys.length)
      return false;
    if ((/* @__PURE__ */ new Set([...aKeys, ...bKeys])).size != aKeys.length)
      return false;
    for (const k2 of aKeys)
      if (!isEqual(a[k2], b2[k2]))
        return false;
    return true;
  }
  const proto = Object.getPrototypeOf(a);
  const cmp = isTypedArray(a) || proto !== Object.prototype && proto !== Array.prototype && Object.prototype.hasOwnProperty.call(proto, "toString");
  return cmp && a.toString() === b2.toString();
}
const toString = (v, cycle) => {
  if (v === null)
    return "null";
  if (v === void 0)
    return "undefined";
  const ctor = v.constructor;
  switch (ctor) {
    case RegExp:
    case Number:
    case Boolean:
    case Function:
    case Symbol:
      return v.toString();
    case String:
      return JSON.stringify(v);
    case Date:
      return v.toISOString();
  }
  if (isTypedArray(v))
    return ctor.name + "[" + v.toString() + "]";
  if (cycle.has(v))
    throw CYCLE_FOUND_ERROR;
  try {
    cycle.add(v);
    if (isArray(v)) {
      return "[" + v.map((s2) => toString(s2, cycle)).join(",") + "]";
    }
    if (ctor === Object) {
      return "{" + Object.keys(v).sort().map((k2) => k2 + ":" + toString(v[k2], cycle)).join(",") + "}";
    }
    const proto = Object.getPrototypeOf(v);
    if (proto !== Object.prototype && proto !== Array.prototype && Object.prototype.hasOwnProperty.call(proto, "toString")) {
      return ctor.name + "(" + JSON.stringify(v.toString()) + ")";
    }
    const [members, _] = getMembersOf(v);
    return ctor.name + toString(members, cycle);
  } finally {
    cycle.delete(v);
  }
};
const stringify = (value) => toString(value, /* @__PURE__ */ new Set());
function hashCode(value, hashFunction) {
  hashFunction = hashFunction || DEFAULT_HASH_FUNCTION;
  if (isNil(value))
    return null;
  return hashFunction(value).toString();
}
function sortBy(collection, keyFn, comparator = compare$1) {
  if (isEmpty(collection))
    return collection;
  const sorted = new Array();
  const result = new Array();
  for (let i = 0; i < collection.length; i++) {
    const obj = collection[i];
    const key = keyFn(obj, i);
    if (isNil(key)) {
      result.push(obj);
    } else {
      sorted.push([key, obj]);
    }
  }
  sorted.sort((a, b2) => comparator(a[0], b2[0]));
  return into(
    result,
    sorted.map((o) => o[1])
  );
}
function groupBy(collection, keyFn, hashFunction = DEFAULT_HASH_FUNCTION) {
  if (collection.length < 1)
    return /* @__PURE__ */ new Map();
  const lookup = /* @__PURE__ */ new Map();
  const result = /* @__PURE__ */ new Map();
  for (let i = 0; i < collection.length; i++) {
    const obj = collection[i];
    const key = keyFn(obj, i);
    const hash = hashCode(key, hashFunction);
    if (hash === null) {
      if (result.has(null)) {
        result.get(null).push(obj);
      } else {
        result.set(null, [obj]);
      }
    } else {
      const existingKey = lookup.has(hash) ? lookup.get(hash).find((k2) => isEqual(k2, key)) : null;
      if (isNil(existingKey)) {
        result.set(key, [obj]);
        if (lookup.has(hash)) {
          lookup.get(hash).push(key);
        } else {
          lookup.set(hash, [key]);
        }
      } else {
        result.get(existingKey).push(obj);
      }
    }
  }
  return result;
}
const MAX_ARRAY_PUSH = 5e4;
function into(target, ...rest) {
  if (target instanceof Array) {
    return rest.reduce(
      (acc, arr) => {
        let i = Math.ceil(arr.length / MAX_ARRAY_PUSH);
        let begin = 0;
        while (i-- > 0) {
          Array.prototype.push.apply(
            acc,
            arr.slice(begin, begin + MAX_ARRAY_PUSH)
          );
          begin += MAX_ARRAY_PUSH;
        }
        return acc;
      },
      target
    );
  } else {
    return rest.filter(isObjectLike).reduce((acc, item) => {
      Object.assign(acc, item);
      return acc;
    }, target);
  }
}
function getValue(obj, key) {
  return isObjectLike(obj) ? obj[key] : void 0;
}
function unwrap(arr, depth) {
  if (depth < 1)
    return arr;
  while (depth-- && arr.length === 1)
    arr = arr[0];
  return arr;
}
function resolve(obj, selector, options) {
  let depth = 0;
  function resolve2(o, path) {
    let value = o;
    for (let i = 0; i < path.length; i++) {
      const field = path[i];
      const isText = /^\d+$/.exec(field) === null;
      if (isText && value instanceof Array) {
        if (i === 0 && depth > 0)
          break;
        depth += 1;
        const subpath = path.slice(i);
        value = value.reduce((acc, item) => {
          const v = resolve2(item, subpath);
          if (v !== void 0)
            acc.push(v);
          return acc;
        }, []);
        break;
      } else {
        value = getValue(value, field);
      }
      if (value === void 0)
        break;
    }
    return value;
  }
  const result = JS_SIMPLE_TYPES.has(getType(obj).toLowerCase()) ? obj : resolve2(obj, selector.split("."));
  return result instanceof Array && (options == null ? void 0 : options.unwrapArray) ? unwrap(result, depth) : result;
}
function resolveGraph(obj, selector, options) {
  const names = selector.split(".");
  const key = names[0];
  const next = names.slice(1).join(".");
  const isIndex = /^\d+$/.exec(key) !== null;
  const hasNext = names.length > 1;
  let result;
  let value;
  if (obj instanceof Array) {
    if (isIndex) {
      result = getValue(obj, Number(key));
      if (hasNext) {
        result = resolveGraph(result, next, options);
      }
      result = [result];
    } else {
      result = [];
      for (const item of obj) {
        value = resolveGraph(item, selector, options);
        if (options == null ? void 0 : options.preserveMissing) {
          if (value === void 0) {
            value = MISSING;
          }
          result.push(value);
        } else if (value !== void 0) {
          result.push(value);
        }
      }
    }
  } else {
    value = getValue(obj, key);
    if (hasNext) {
      value = resolveGraph(value, next, options);
    }
    if (value === void 0)
      return void 0;
    result = (options == null ? void 0 : options.preserveKeys) ? { ...obj } : {};
    result[key] = value;
  }
  return result;
}
function filterMissing(obj) {
  if (obj instanceof Array) {
    for (let i = obj.length - 1; i >= 0; i--) {
      if (obj[i] === MISSING) {
        obj.splice(i, 1);
      } else {
        filterMissing(obj[i]);
      }
    }
  } else if (isObject(obj)) {
    for (const k2 in obj) {
      if (has(obj, k2)) {
        filterMissing(obj[k2]);
      }
    }
  }
}
const NUMBER_RE = /^\d+$/;
function walk(obj, selector, fn, options) {
  const names = selector.split(".");
  const key = names[0];
  const next = names.slice(1).join(".");
  if (names.length === 1) {
    if (isObject(obj) || isArray(obj) && NUMBER_RE.test(key)) {
      fn(obj, key);
    }
  } else {
    if ((options == null ? void 0 : options.buildGraph) && isNil(obj[key])) {
      obj[key] = {};
    }
    const item = obj[key];
    if (!item)
      return;
    const isNextArrayIndex = !!(names.length > 1 && NUMBER_RE.test(names[1]));
    if (item instanceof Array && (options == null ? void 0 : options.descendArray) && !isNextArrayIndex) {
      item.forEach((e) => walk(e, next, fn, options));
    } else {
      walk(item, next, fn, options);
    }
  }
}
function setValue(obj, selector, value) {
  walk(
    obj,
    selector,
    (item, key) => {
      item[key] = isFunction$1(value) ? value(item[key]) : value;
    },
    { buildGraph: true }
  );
}
function removeValue(obj, selector, options) {
  walk(
    obj,
    selector,
    (item, key) => {
      if (item instanceof Array) {
        if (/^\d+$/.test(key)) {
          item.splice(parseInt(key), 1);
        } else if (options && options.descendArray) {
          for (const elem of item) {
            if (isObject(elem)) {
              delete elem[key];
            }
          }
        }
      } else if (isObject(item)) {
        delete item[key];
      }
    },
    options
  );
}
const OPERATOR_NAME_PATTERN = /^\$[a-zA-Z0-9_]+$/;
function isOperator(name) {
  return OPERATOR_NAME_PATTERN.test(name);
}
function normalize(expr) {
  if (JS_SIMPLE_TYPES.has(getType(expr).toLowerCase())) {
    return isRegExp(expr) ? { $regex: expr } : { $eq: expr };
  }
  if (isObjectLike(expr)) {
    const exprObj = expr;
    if (!Object.keys(exprObj).some(isOperator)) {
      return { $eq: expr };
    }
    if (has(expr, "$regex")) {
      const newExpr = { ...expr };
      newExpr["$regex"] = new RegExp(
        expr["$regex"],
        expr["$options"]
      );
      delete newExpr["$options"];
      return newExpr;
    }
  }
  return expr;
}
var ProcessingMode = /* @__PURE__ */ ((ProcessingMode2) => {
  ProcessingMode2["CLONE_ALL"] = "CLONE_ALL";
  ProcessingMode2["CLONE_INPUT"] = "CLONE_INPUT";
  ProcessingMode2["CLONE_OUTPUT"] = "CLONE_OUTPUT";
  ProcessingMode2["CLONE_OFF"] = "CLONE_OFF";
  return ProcessingMode2;
})(ProcessingMode || {});
class ComputeOptions {
  constructor(_opts, _root, _local, timestamp = Date.now()) {
    this._opts = _opts;
    this._root = _root;
    this._local = _local;
    this.timestamp = timestamp;
    this.update(_root, _local);
  }
  /**
   * Initialize new ComputeOptions.
   *
   * @param options
   * @param root
   * @param local
   * @returns {ComputeOptions}
   */
  static init(options, root, local) {
    return options instanceof ComputeOptions ? new ComputeOptions(
      options._opts,
      isNil(options.root) ? root : options.root,
      Object.assign({}, options.local, local)
    ) : new ComputeOptions(options, root, local);
  }
  /** Updates the internal mutable state. */
  update(root, local) {
    var _a;
    this._root = root;
    this._local = local ? Object.assign({}, local, {
      variables: Object.assign({}, (_a = this._local) == null ? void 0 : _a.variables, local == null ? void 0 : local.variables)
    }) : local;
    return this;
  }
  getOptions() {
    return Object.freeze({
      ...this._opts,
      context: Context.from(this._opts.context)
    });
  }
  get root() {
    return this._root;
  }
  get local() {
    return this._local;
  }
  get idKey() {
    return this._opts.idKey;
  }
  get collation() {
    var _a;
    return (_a = this._opts) == null ? void 0 : _a.collation;
  }
  get processingMode() {
    var _a;
    return ((_a = this._opts) == null ? void 0 : _a.processingMode) || "CLONE_OFF";
  }
  get useStrictMode() {
    var _a;
    return (_a = this._opts) == null ? void 0 : _a.useStrictMode;
  }
  get scriptEnabled() {
    var _a;
    return (_a = this._opts) == null ? void 0 : _a.scriptEnabled;
  }
  get useGlobalContext() {
    var _a;
    return (_a = this._opts) == null ? void 0 : _a.useGlobalContext;
  }
  get hashFunction() {
    var _a;
    return (_a = this._opts) == null ? void 0 : _a.hashFunction;
  }
  get collectionResolver() {
    var _a;
    return (_a = this._opts) == null ? void 0 : _a.collectionResolver;
  }
  get jsonSchemaValidator() {
    var _a;
    return (_a = this._opts) == null ? void 0 : _a.jsonSchemaValidator;
  }
  get variables() {
    var _a;
    return (_a = this._opts) == null ? void 0 : _a.variables;
  }
  get context() {
    var _a;
    return (_a = this._opts) == null ? void 0 : _a.context;
  }
}
function initOptions(options) {
  return options instanceof ComputeOptions ? options.getOptions() : Object.freeze({
    idKey: "_id",
    scriptEnabled: true,
    useStrictMode: true,
    useGlobalContext: true,
    processingMode: "CLONE_OFF",
    ...options,
    context: (options == null ? void 0 : options.context) ? Context.from(options == null ? void 0 : options.context) : Context.init({})
  });
}
var OperatorType = /* @__PURE__ */ ((OperatorType2) => {
  OperatorType2["ACCUMULATOR"] = "accumulator";
  OperatorType2["EXPRESSION"] = "expression";
  OperatorType2["PIPELINE"] = "pipeline";
  OperatorType2["PROJECTION"] = "projection";
  OperatorType2["QUERY"] = "query";
  OperatorType2["WINDOW"] = "window";
  return OperatorType2;
})(OperatorType || {});
class Context {
  constructor(ops) {
    this.operators = {
      [
        "accumulator"
        /* ACCUMULATOR */
      ]: {},
      [
        "expression"
        /* EXPRESSION */
      ]: {},
      [
        "pipeline"
        /* PIPELINE */
      ]: {},
      [
        "projection"
        /* PROJECTION */
      ]: {},
      [
        "query"
        /* QUERY */
      ]: {},
      [
        "window"
        /* WINDOW */
      ]: {}
    };
    for (const [type2, operators] of Object.entries(ops)) {
      this.addOperators(type2, operators);
    }
  }
  static init(ops = {}) {
    return new Context(ops);
  }
  static from(ctx) {
    return new Context(ctx.operators);
  }
  addOperators(type2, ops) {
    for (const [name, fn] of Object.entries(ops)) {
      if (!this.getOperator(type2, name)) {
        this.operators[type2][name] = fn;
      }
    }
    return this;
  }
  // register
  addAccumulatorOps(ops) {
    return this.addOperators("accumulator", ops);
  }
  addExpressionOps(ops) {
    return this.addOperators("expression", ops);
  }
  addQueryOps(ops) {
    return this.addOperators("query", ops);
  }
  addPipelineOps(ops) {
    return this.addOperators("pipeline", ops);
  }
  addProjectionOps(ops) {
    return this.addOperators("projection", ops);
  }
  addWindowOps(ops) {
    return this.addOperators("window", ops);
  }
  // getters
  getOperator(type2, name) {
    return type2 in this.operators ? this.operators[type2][name] || null : null;
  }
}
const GLOBAL_CONTEXT = Context.init();
function useOperators(type2, operators) {
  for (const [name, fn] of Object.entries(operators)) {
    assert(
      isFunction$1(fn) && isOperator(name),
      `'${name}' is not a valid operator`
    );
    const currentFn = getOperator(type2, name, null);
    assert(
      !currentFn || fn === currentFn,
      `${name} already exists for '${type2}' operators. Cannot change operator function once registered.`
    );
  }
  switch (type2) {
    case "accumulator":
      GLOBAL_CONTEXT.addAccumulatorOps(operators);
      break;
    case "expression":
      GLOBAL_CONTEXT.addExpressionOps(operators);
      break;
    case "pipeline":
      GLOBAL_CONTEXT.addPipelineOps(operators);
      break;
    case "projection":
      GLOBAL_CONTEXT.addProjectionOps(operators);
      break;
    case "query":
      GLOBAL_CONTEXT.addQueryOps(operators);
      break;
    case "window":
      GLOBAL_CONTEXT.addWindowOps(operators);
      break;
  }
}
function getOperator(type2, operator, options) {
  const { context: ctx, useGlobalContext: fallback } = options || {};
  const fn = ctx ? ctx.getOperator(type2, operator) : null;
  return !fn && fallback ? GLOBAL_CONTEXT.getOperator(type2, operator) : fn;
}
const systemVariables = {
  $$ROOT(_obj, _expr, options) {
    return options.root;
  },
  $$CURRENT(obj, _expr, _options) {
    return obj;
  },
  $$REMOVE(_obj, _expr, _options) {
    return void 0;
  },
  $$NOW(_obj, _expr, options) {
    return new Date(options.timestamp);
  }
};
const redactVariables = {
  $$KEEP(obj, _expr, _options) {
    return obj;
  },
  $$PRUNE(_obj, _expr, _options) {
    return void 0;
  },
  $$DESCEND(obj, expr, options) {
    if (!has(expr, "$cond"))
      return obj;
    let result;
    for (const [key, current] of Object.entries(obj)) {
      if (isObjectLike(current)) {
        if (current instanceof Array) {
          const array = [];
          for (let elem of current) {
            if (isObject(elem)) {
              elem = redact(elem, expr, options.update(elem));
            }
            if (!isNil(elem)) {
              array.push(elem);
            }
          }
          result = array;
        } else {
          result = redact(
            current,
            expr,
            options.update(current)
          );
        }
        if (isNil(result)) {
          delete obj[key];
        } else {
          obj[key] = result;
        }
      }
    }
    return obj;
  }
};
function computeValue(obj, expr, operator, options) {
  var _a;
  const copts = ComputeOptions.init(options, obj);
  operator = operator || "";
  if (isOperator(operator)) {
    const callExpression = getOperator(
      "expression",
      operator,
      options
    );
    if (callExpression)
      return callExpression(obj, expr, copts);
    const callAccumulator = getOperator(
      "accumulator",
      operator,
      options
    );
    if (callAccumulator) {
      if (!(obj instanceof Array)) {
        obj = computeValue(obj, expr, null, copts);
        expr = null;
      }
      assert(obj instanceof Array, `'${operator}' target must be an array.`);
      return callAccumulator(
        obj,
        expr,
        // reset the root object for accumulators.
        copts.update(null, copts.local)
      );
    }
    throw new MingoError(`operator '${operator}' is not registered`);
  }
  if (isString(expr) && expr.length > 0 && expr[0] === "$") {
    if (has(redactVariables, expr)) {
      return expr;
    }
    let context = copts.root;
    const arr = expr.split(".");
    if (has(systemVariables, arr[0])) {
      context = systemVariables[arr[0]](
        obj,
        null,
        copts
      );
      expr = expr.slice(arr[0].length + 1);
    } else if (arr[0].slice(0, 2) === "$$") {
      context = Object.assign(
        {},
        copts.variables,
        // global vars
        // current item is added before local variables because the binding may be changed.
        { this: obj },
        (_a = copts.local) == null ? void 0 : _a.variables
        // local vars
      );
      const prefix = arr[0].slice(2);
      assert(
        has(context, prefix),
        `Use of undefined variable: ${prefix}`
      );
      expr = expr.slice(2);
    } else {
      expr = expr.slice(1);
    }
    if (expr === "")
      return context;
    return resolve(context, expr);
  }
  if (isArray(expr)) {
    return expr.map((item) => computeValue(obj, item, null, copts));
  } else if (isObject(expr)) {
    const result = {};
    for (const [key, val] of Object.entries(expr)) {
      result[key] = computeValue(obj, val, key, copts);
      if ([
        "expression",
        "accumulator"
        /* ACCUMULATOR */
      ].some(
        (t) => !!getOperator(t, key, options)
      )) {
        assert(
          Object.keys(expr).length === 1,
          "Invalid aggregation expression '" + JSON.stringify(expr) + "'"
        );
        return result[key];
      }
    }
    return result;
  }
  return expr;
}
function redact(obj, expr, options) {
  const result = computeValue(obj, expr, null, options);
  return has(redactVariables, result) ? redactVariables[result](obj, expr, options) : result;
}
function Lazy(source) {
  return source instanceof Iterator$1 ? source : new Iterator$1(source);
}
function compose(...iterators) {
  let index = 0;
  return Lazy(() => {
    while (index < iterators.length) {
      const o = iterators[index].next();
      if (!o.done)
        return o;
      index++;
    }
    return { done: true };
  });
}
function isGenerator(o) {
  return !!o && typeof o === "object" && (o == null ? void 0 : o.next) instanceof Function;
}
function dropItem(array, i) {
  const rest = array.slice(i + 1);
  array.splice(i);
  Array.prototype.push.apply(array, rest);
}
const DONE = new Error();
function createCallback(nextFn, iteratees, buffer) {
  let done = false;
  let index = -1;
  let bufferIndex = 0;
  return function(storeResult) {
    try {
      outer:
        while (!done) {
          let o = nextFn();
          index++;
          let i = -1;
          const size = iteratees.length;
          let innerDone = false;
          while (++i < size) {
            const r2 = iteratees[i];
            switch (r2.action) {
              case 0:
                o = r2.func(o, index);
                break;
              case 1:
                if (!r2.func(o, index))
                  continue outer;
                break;
              case 2:
                --r2.count;
                if (!r2.count)
                  innerDone = true;
                break;
              case 3:
                --r2.count;
                if (!r2.count)
                  dropItem(iteratees, i);
                continue outer;
              default:
                break outer;
            }
          }
          done = innerDone;
          if (storeResult) {
            buffer[bufferIndex++] = o;
          } else {
            return { value: o, done: false };
          }
        }
    } catch (e) {
      if (e !== DONE)
        throw e;
    }
    done = true;
    return { done };
  };
}
let Iterator$1 = class Iterator2 {
  /**
   * @param {*} source An iterable object or function.
   *    Array - return one element per cycle
   *    Object{next:Function} - call next() for the next value (this also handles generator functions)
   *    Function - call to return the next value
   * @param {Function} fn An optional transformation function
   */
  constructor(source) {
    this.iteratees = [];
    this.yieldedValues = [];
    this.isDone = false;
    let nextVal;
    if (source instanceof Function) {
      source = { next: source };
    }
    if (isGenerator(source)) {
      const src = source;
      nextVal = () => {
        const o = src.next();
        if (o.done)
          throw DONE;
        return o.value;
      };
    } else if (source instanceof Array) {
      const data = source;
      const size = data.length;
      let index = 0;
      nextVal = () => {
        if (index < size)
          return data[index++];
        throw DONE;
      };
    } else if (!(source instanceof Function)) {
      throw new MingoError(
        `Lazy must be initialized with an array, generator, or function.`
      );
    }
    this.getNext = createCallback(nextVal, this.iteratees, this.yieldedValues);
  }
  /**
   * Add an iteratee to this lazy sequence
   */
  push(action, value) {
    if (typeof value === "function") {
      this.iteratees.push({ action, func: value });
    } else if (typeof value === "number") {
      this.iteratees.push({ action, count: value });
    }
    return this;
  }
  next() {
    return this.getNext();
  }
  // Iteratees methods
  /**
   * Transform each item in the sequence to a new value
   * @param {Function} f
   */
  map(f2) {
    return this.push(0, f2);
  }
  /**
   * Select only items matching the given predicate
   * @param {Function} pred
   */
  filter(predicate) {
    return this.push(1, predicate);
  }
  /**
   * Take given numbe for values from sequence
   * @param {Number} n A number greater than 0
   */
  take(n2) {
    return n2 > 0 ? this.push(2, n2) : this;
  }
  /**
   * Drop a number of values from the sequence
   * @param {Number} n Number of items to drop greater than 0
   */
  drop(n2) {
    return n2 > 0 ? this.push(3, n2) : this;
  }
  // Transformations
  /**
   * Returns a new lazy object with results of the transformation
   * The entire sequence is realized.
   *
   * @param {Callback<Source, RawArray>} fn Tranform function of type (Array) => (Any)
   */
  transform(fn) {
    const self2 = this;
    let iter;
    return Lazy(() => {
      if (!iter) {
        iter = Lazy(fn(self2.value()));
      }
      return iter.next();
    });
  }
  // Terminal methods
  /**
   * Returns the fully realized values of the iterators.
   * The return value will be an array unless `lazy.first()` was used.
   * The realized values are cached for subsequent calls.
   */
  value() {
    if (!this.isDone) {
      this.isDone = this.getNext(true).done;
    }
    return this.yieldedValues;
  }
  /**
   * Execute the funcion for each value. Will stop when an execution returns false.
   * @param {Function} f
   * @returns {Boolean} false iff `f` return false for AnyVal execution, otherwise true
   */
  each(f2) {
    for (; ; ) {
      const o = this.next();
      if (o.done)
        break;
      if (f2(o.value) === false)
        return false;
    }
    return true;
  }
  /**
   * Returns the reduction of sequence according the reducing function
   *
   * @param {*} f a reducing function
   * @param {*} initialValue
   */
  reduce(f2, initialValue) {
    let o = this.next();
    if (initialValue === void 0 && !o.done) {
      initialValue = o.value;
      o = this.next();
    }
    while (!o.done) {
      initialValue = f2(initialValue, o.value);
      o = this.next();
    }
    return initialValue;
  }
  /**
   * Returns the number of matched items in the sequence
   */
  size() {
    return this.reduce(
      (acc, _) => ++acc,
      0
    );
  }
  [Symbol.iterator]() {
    return this;
  }
};
class Aggregator {
  constructor(pipeline, options) {
    this.pipeline = pipeline;
    this.options = initOptions(options);
  }
  /**
   * Returns an `Lazy` iterator for processing results of pipeline
   *
   * @param {*} collection An array or iterator object
   * @returns {Iterator} an iterator object
   */
  stream(collection) {
    let iterator2 = Lazy(collection);
    const mode = this.options.processingMode;
    if (mode == ProcessingMode.CLONE_ALL || mode == ProcessingMode.CLONE_INPUT) {
      iterator2.map(cloneDeep);
    }
    const pipelineOperators = new Array();
    if (!isEmpty(this.pipeline)) {
      for (const operator of this.pipeline) {
        const operatorKeys = Object.keys(operator);
        const opName = operatorKeys[0];
        const call2 = getOperator(
          OperatorType.PIPELINE,
          opName,
          this.options
        );
        assert(
          operatorKeys.length === 1 && !!call2,
          `invalid pipeline operator ${opName}`
        );
        pipelineOperators.push(opName);
        iterator2 = call2(iterator2, operator[opName], this.options);
      }
    }
    if (mode == ProcessingMode.CLONE_OUTPUT || mode == ProcessingMode.CLONE_ALL && !!intersection([["$group", "$unwind"], pipelineOperators]).length) {
      iterator2.map(cloneDeep);
    }
    return iterator2;
  }
  /**
   * Return the results of the aggregation as an array.
   *
   * @param {*} collection
   * @param {*} query
   */
  run(collection) {
    return this.stream(collection).value();
  }
}
class Cursor {
  constructor(source, predicate, projection, options) {
    this.source = source;
    this.predicate = predicate;
    this.projection = projection;
    this.options = options;
    this.operators = [];
    this.result = null;
    this.buffer = [];
  }
  /** Returns the iterator from running the query */
  fetch() {
    if (this.result)
      return this.result;
    if (isObject(this.projection)) {
      this.operators.push({ $project: this.projection });
    }
    this.result = Lazy(this.source).filter(this.predicate);
    if (this.operators.length > 0) {
      this.result = new Aggregator(this.operators, this.options).stream(
        this.result
      );
    }
    return this.result;
  }
  /** Returns an iterator with the buffered data included */
  fetchAll() {
    const buffered = Lazy([...this.buffer]);
    this.buffer = [];
    return compose(buffered, this.fetch());
  }
  /**
   * Return remaining objects in the cursor as an array. This method exhausts the cursor
   * @returns {Array}
   */
  all() {
    return this.fetchAll().value();
  }
  /**
   * Returns the number of objects return in the cursor. This method exhausts the cursor
   * @returns {Number}
   */
  count() {
    return this.all().length;
  }
  /**
   * Returns a cursor that begins returning results only after passing or skipping a number of documents.
   * @param {Number} n the number of results to skip.
   * @return {Cursor} Returns the cursor, so you can chain this call.
   */
  skip(n2) {
    this.operators.push({ $skip: n2 });
    return this;
  }
  /**
   * Constrains the size of a cursor's result set.
   * @param {Number} n the number of results to limit to.
   * @return {Cursor} Returns the cursor, so you can chain this call.
   */
  limit(n2) {
    this.operators.push({ $limit: n2 });
    return this;
  }
  /**
   * Returns results ordered according to a sort specification.
   * @param {Object} modifier an object of key and values specifying the sort order. 1 for ascending and -1 for descending
   * @return {Cursor} Returns the cursor, so you can chain this call.
   */
  sort(modifier) {
    this.operators.push({ $sort: modifier });
    return this;
  }
  /**
   * Specifies the collation for the cursor returned by the `mingo.Query.find`
   * @param {*} spec
   */
  collation(spec) {
    this.options = { ...this.options, collation: spec };
    return this;
  }
  /**
   * Returns the next document in a cursor.
   * @returns {Object | Boolean}
   */
  next() {
    if (this.buffer.length > 0) {
      return this.buffer.pop();
    }
    const o = this.fetch().next();
    if (o.done)
      return;
    return o.value;
  }
  /**
   * Returns true if the cursor has documents and can be iterated.
   * @returns {boolean}
   */
  hasNext() {
    if (this.buffer.length > 0)
      return true;
    const o = this.fetch().next();
    if (o.done)
      return false;
    this.buffer.push(o.value);
    return true;
  }
  /**
   * Applies a function to each document in a cursor and collects the return values in an array.
   * @param fn
   * @returns {Array}
   */
  map(fn) {
    return this.all().map(fn);
  }
  /**
   * Applies a JavaScript function for every document in a cursor.
   * @param fn
   */
  forEach(fn) {
    this.all().forEach(fn);
  }
  [Symbol.iterator]() {
    return this.fetchAll();
  }
}
class Query {
  constructor(condition, options) {
    this.condition = condition;
    this.options = initOptions(options);
    this.compiled = [];
    this.compile();
  }
  compile() {
    assert(
      isObject(this.condition),
      `query criteria must be an object: ${JSON.stringify(this.condition)}`
    );
    const whereOperator = {};
    for (const [field, expr] of Object.entries(this.condition)) {
      if ("$where" === field) {
        Object.assign(whereOperator, { field, expr });
      } else if (inArray(["$and", "$or", "$nor", "$expr", "$jsonSchema"], field)) {
        this.processOperator(field, field, expr);
      } else {
        assert(!isOperator(field), `unknown top level operator: ${field}`);
        for (const [operator, val] of Object.entries(
          normalize(expr)
        )) {
          this.processOperator(field, operator, val);
        }
      }
      if (whereOperator.field) {
        this.processOperator(
          whereOperator.field,
          whereOperator.field,
          whereOperator.expr
        );
      }
    }
  }
  processOperator(field, operator, value) {
    const call2 = getOperator(
      OperatorType.QUERY,
      operator,
      this.options
    );
    if (!call2) {
      throw new MingoError(`unknown query operator ${operator}`);
    }
    const fn = call2(field, value, this.options);
    this.compiled.push(fn);
  }
  /**
   * Checks if the object passes the query criteria. Returns true if so, false otherwise.
   *
   * @param obj The object to test
   * @returns {boolean} True or false
   */
  test(obj) {
    for (let i = 0, len = this.compiled.length; i < len; i++) {
      if (!this.compiled[i](obj)) {
        return false;
      }
    }
    return true;
  }
  /**
   * Returns a cursor to select matching documents from the input source.
   *
   * @param source A source providing a sequence of documents
   * @param projection An optional projection criteria
   * @returns {Cursor} A Cursor for iterating over the results
   */
  find(collection, projection) {
    return new Cursor(
      collection,
      (x) => this.test(x),
      projection || {},
      this.options
    );
  }
  /**
   * Remove matched documents from the collection returning the remainder
   *
   * @param collection An array of documents
   * @returns {Array} A new array with matching elements removed
   */
  remove(collection) {
    return collection.reduce((acc, obj) => {
      if (!this.test(obj))
        acc.push(obj);
      return acc;
    }, []);
  }
}
const $sort = (collection, sortKeys, options) => {
  if (isEmpty(sortKeys) || !isObject(sortKeys))
    return collection;
  let cmp = compare$1;
  const collationSpec = options.collation;
  if (isObject(collationSpec) && isString(collationSpec.locale)) {
    cmp = collationComparator(collationSpec);
  }
  return collection.transform((coll) => {
    const modifiers = Object.keys(sortKeys);
    for (const key of modifiers.reverse()) {
      const groups = groupBy(
        coll,
        (obj) => resolve(obj, key),
        options.hashFunction
      );
      const sortedKeys = Array.from(groups.keys()).sort(cmp);
      if (sortKeys[key] === -1)
        sortedKeys.reverse();
      coll = [];
      sortedKeys.reduce(
        (acc, key2) => into(acc, groups.get(key2)),
        coll
      );
    }
    return coll;
  });
};
const COLLATION_STRENGTH = {
  // Only strings that differ in base letters compare as unequal. Examples: a ≠ b, a = á, a = A.
  1: "base",
  //  Only strings that differ in base letters or accents and other diacritic marks compare as unequal.
  // Examples: a ≠ b, a ≠ á, a = A.
  2: "accent",
  // Strings that differ in base letters, accents and other diacritic marks, or case compare as unequal.
  // Other differences may also be taken into consideration. Examples: a ≠ b, a ≠ á, a ≠ A
  3: "variant"
  // case - Only strings that differ in base letters or case compare as unequal. Examples: a ≠ b, a = á, a ≠ A.
};
function collationComparator(spec) {
  const localeOpt = {
    sensitivity: COLLATION_STRENGTH[spec.strength || 3],
    caseFirst: spec.caseFirst === "off" ? "false" : spec.caseFirst || "false",
    numeric: spec.numericOrdering || false,
    ignorePunctuation: spec.alternate === "shifted"
  };
  if ((spec.caseLevel || false) === true) {
    if (localeOpt.sensitivity === "base")
      localeOpt.sensitivity = "case";
    if (localeOpt.sensitivity === "accent")
      localeOpt.sensitivity = "variant";
  }
  const collator = new Intl.Collator(spec.locale, localeOpt);
  return (a, b2) => {
    if (!isString(a) || !isString(b2))
      return compare$1(a, b2);
    const i = collator.compare(a, b2);
    if (i < 0)
      return -1;
    if (i > 0)
      return 1;
    return 0;
  };
}
function createQueryOperator(predicate) {
  const f2 = (selector, value, options) => {
    const opts = { unwrapArray: true };
    const depth = Math.max(1, selector.split(".").length - 1);
    return (obj) => {
      const lhs = resolve(obj, selector, opts);
      return predicate(lhs, value, { ...options, depth });
    };
  };
  f2.op = "query";
  return f2;
}
function $eq$1(a, b2, options) {
  if (isEqual(a, b2))
    return true;
  if (isNil(a) && isNil(b2))
    return true;
  if (a instanceof Array) {
    const eq2 = isEqual.bind(null, b2);
    return a.some(eq2) || flatten(a, options == null ? void 0 : options.depth).some(eq2);
  }
  return false;
}
function $ne$1(a, b2, options) {
  return !$eq$1(a, b2, options);
}
function $in$1(a, b2, options) {
  if (isNil(a))
    return b2.some((v) => v === null);
  return intersection([ensureArray(a), b2], options == null ? void 0 : options.hashFunction).length > 0;
}
function $nin$1(a, b2, options) {
  return !$in$1(a, b2, options);
}
function $lt$1(a, b2, _options) {
  return compare(a, b2, (x, y) => compare$1(x, y) < 0);
}
function $lte$1(a, b2, _options) {
  return compare(a, b2, (x, y) => compare$1(x, y) <= 0);
}
function $gt$1(a, b2, _options) {
  return compare(a, b2, (x, y) => compare$1(x, y) > 0);
}
function $gte$1(a, b2, _options) {
  return compare(a, b2, (x, y) => compare$1(x, y) >= 0);
}
function $mod$1(a, b2, _options) {
  return ensureArray(a).some(
    (x) => b2.length === 2 && x % b2[0] === b2[1]
  );
}
function $regex$1(a, b2, options) {
  const lhs = ensureArray(a);
  const match = (x) => isString(x) && truthy(b2.exec(x), options == null ? void 0 : options.useStrictMode);
  return lhs.some(match) || flatten(lhs, 1).some(match);
}
function $exists$1(a, b2, _options) {
  return (b2 === false || b2 === 0) && a === void 0 || (b2 === true || b2 === 1) && a !== void 0;
}
function $all(values, queries, options) {
  if (!isArray(values) || !isArray(queries) || !values.length || !queries.length) {
    return false;
  }
  let matched = true;
  for (const query of queries) {
    if (!matched)
      break;
    if (isObject(query) && inArray(Object.keys(query), "$elemMatch")) {
      matched = $elemMatch$1(values, query["$elemMatch"], options);
    } else if (query instanceof RegExp) {
      matched = values.some((s2) => typeof s2 === "string" && query.test(s2));
    } else {
      matched = values.some((v) => isEqual(query, v));
    }
  }
  return matched;
}
function $size$1(a, b2, _options) {
  return Array.isArray(a) && a.length === b2;
}
function isNonBooleanOperator(name) {
  return isOperator(name) && ["$and", "$or", "$nor"].indexOf(name) === -1;
}
function $elemMatch$1(a, b2, options) {
  if (isArray(a) && !isEmpty(a)) {
    let format = (x) => x;
    let criteria = b2;
    if (Object.keys(b2).every(isNonBooleanOperator)) {
      criteria = { temp: b2 };
      format = (x) => ({ temp: x });
    }
    const query = new Query(criteria, options);
    for (let i = 0, len = a.length; i < len; i++) {
      if (query.test(format(a[i]))) {
        return true;
      }
    }
  }
  return false;
}
const isNull = (a) => a === null;
const isInt = (a) => isNumber(a) && a >= MIN_INT && a <= MAX_INT && a.toString().indexOf(".") === -1;
const isLong = (a) => isNumber(a) && a >= MIN_LONG && a <= MAX_LONG && a.toString().indexOf(".") === -1;
const compareFuncs = {
  array: isArray,
  bool: isBoolean,
  boolean: isBoolean,
  date: isDate,
  decimal: isNumber,
  double: isNumber,
  int: isInt,
  long: isLong,
  number: isNumber,
  null: isNull,
  object: isObject,
  regex: isRegExp,
  regexp: isRegExp,
  string: isString,
  // added for completeness
  undefined: isNil,
  // deprecated
  function: (_) => {
    throw new MingoError("unsupported type key `function`.");
  },
  // Mongo identifiers
  1: isNumber,
  //double
  2: isString,
  3: isObject,
  4: isArray,
  6: isNil,
  // deprecated
  8: isBoolean,
  9: isDate,
  10: isNull,
  11: isRegExp,
  16: isInt,
  18: isLong,
  19: isNumber
  //decimal
};
function compareType(a, b2, _) {
  const f2 = compareFuncs[b2];
  return f2 ? f2(a) : false;
}
function $type$1(a, b2, options) {
  return Array.isArray(b2) ? b2.findIndex((t) => compareType(a, t)) >= 0 : compareType(a, b2);
}
function compare(a, b2, f2) {
  return ensureArray(a).some((x) => getType(x) === getType(b2) && f2(x, b2));
}
const buildMap = (letters, sign) => {
  const h = {};
  letters.split("").forEach((v, i) => h[v] = sign * (i + 1));
  return h;
};
({
  ...buildMap("ABCDEFGHIKLM", 1),
  ...buildMap("NOPQRSTUVWXY", -1),
  Z: 0
});
const FIXED_POINTS = {
  undefined: null,
  null: null,
  NaN: NaN,
  Infinity: new Error(),
  "-Infinity": new Error()
};
function createTrignometryOperator(f2, fixedPoints = FIXED_POINTS) {
  const fp = Object.assign({}, FIXED_POINTS, fixedPoints);
  const keySet = new Set(Object.keys(fp));
  return (obj, expr, options) => {
    const n2 = computeValue(obj, expr, null, options);
    if (keySet.has(`${n2}`)) {
      const res = fp[`${n2}`];
      if (res instanceof Error) {
        throw new MingoError(
          `cannot apply $${f2.name} to -inf, value must in (-inf,inf)`
        );
      }
      return res;
    }
    return f2(n2);
  };
}
createTrignometryOperator(Math.acos, {
  Infinity: Infinity,
  0: new Error()
});
createTrignometryOperator(Math.acosh, {
  Infinity: Infinity,
  0: new Error()
});
createTrignometryOperator(Math.asin);
createTrignometryOperator(Math.asinh, {
  Infinity: Infinity,
  "-Infinity": -Infinity
});
createTrignometryOperator(Math.atan);
createTrignometryOperator(Math.atanh, {
  1: Infinity,
  "-1": -Infinity
});
createTrignometryOperator(Math.cos);
createTrignometryOperator(Math.cosh, {
  "-Infinity": Infinity,
  Infinity: Infinity
  // [Math.PI]: -1,
});
const RADIANS_FACTOR = Math.PI / 180;
createTrignometryOperator(
  (n2) => n2 * RADIANS_FACTOR,
  {
    Infinity: Infinity,
    "-Infinity": Infinity
  }
);
const DEGREES_FACTOR = 180 / Math.PI;
createTrignometryOperator(
  (n2) => n2 * DEGREES_FACTOR,
  {
    Infinity: Infinity,
    "-Infinity": -Infinity
  }
);
createTrignometryOperator(Math.sin);
createTrignometryOperator(Math.sinh, {
  "-Infinity": -Infinity,
  Infinity: Infinity
});
createTrignometryOperator(Math.tan);
const $project = (collection, expr, options) => {
  if (isEmpty(expr))
    return collection;
  let expressionKeys = Object.keys(expr);
  let idOnlyExcluded = false;
  validateExpression(expr, options);
  const ID_KEY = options.idKey;
  if (inArray(expressionKeys, ID_KEY)) {
    const id = expr[ID_KEY];
    if (id === 0 || id === false) {
      expressionKeys = expressionKeys.filter(
        notInArray.bind(null, [ID_KEY])
      );
      idOnlyExcluded = expressionKeys.length == 0;
    }
  } else {
    expressionKeys.push(ID_KEY);
  }
  const copts = ComputeOptions.init(options);
  return collection.map((obj) => processObject(
    obj,
    expr,
    copts.update(obj),
    expressionKeys,
    idOnlyExcluded
  ));
};
function processObject(obj, expr, options, expressionKeys, idOnlyExcluded) {
  let newObj = {};
  let foundSlice = false;
  let foundExclusion = false;
  const dropKeys = [];
  if (idOnlyExcluded) {
    dropKeys.push(options.idKey);
  }
  for (const key of expressionKeys) {
    let value = void 0;
    const subExpr = expr[key];
    if (key !== options.idKey && inArray([0, false], subExpr)) {
      foundExclusion = true;
    }
    if (key === options.idKey && isEmpty(subExpr)) {
      value = obj[key];
    } else if (isString(subExpr)) {
      value = computeValue(obj, subExpr, key, options);
    } else if (inArray([1, true], subExpr)) ;
    else if (subExpr instanceof Array) {
      value = subExpr.map((v) => {
        const r2 = computeValue(obj, v, null, options);
        if (isNil(r2))
          return null;
        return r2;
      });
    } else if (isObject(subExpr)) {
      const subExprObj = subExpr;
      const subExprKeys = Object.keys(subExpr);
      const operator = subExprKeys.length == 1 ? subExprKeys[0] : "";
      const call2 = getOperator(
        OperatorType.PROJECTION,
        operator,
        options
      );
      if (call2) {
        if (operator === "$slice") {
          if (ensureArray(subExprObj[operator]).every(isNumber)) {
            value = call2(obj, subExprObj[operator], key, options);
            foundSlice = true;
          } else {
            value = computeValue(obj, subExprObj, key, options);
          }
        } else {
          value = call2(obj, subExprObj[operator], key, options);
        }
      } else if (isOperator(operator)) {
        value = computeValue(obj, subExprObj[operator], operator, options);
      } else if (has(obj, key)) {
        validateExpression(subExprObj, options);
        let target = obj[key];
        if (target instanceof Array) {
          value = target.map(
            (o) => processObject(o, subExprObj, options, subExprKeys, false)
          );
        } else {
          target = isObject(target) ? target : obj;
          value = processObject(
            target,
            subExprObj,
            options,
            subExprKeys,
            false
          );
        }
      } else {
        value = computeValue(obj, subExpr, null, options);
      }
    } else {
      dropKeys.push(key);
      continue;
    }
    const objPathGraph = resolveGraph(obj, key, {
      preserveMissing: true
    });
    if (objPathGraph !== void 0) {
      merge(newObj, objPathGraph, {
        flatten: true
      });
    }
    if (notInArray([0, 1, false, true], subExpr)) {
      if (value === void 0) {
        removeValue(newObj, key, { descendArray: true });
      } else {
        setValue(newObj, key, value);
      }
    }
  }
  filterMissing(newObj);
  if (foundSlice || foundExclusion || idOnlyExcluded) {
    newObj = into({}, obj, newObj);
    if (dropKeys.length > 0) {
      for (const k2 of dropKeys) {
        removeValue(newObj, k2, { descendArray: true });
      }
    }
  }
  return newObj;
}
function validateExpression(expr, options) {
  const check = [false, false];
  for (const [k2, v] of Object.entries(expr)) {
    if (k2 === (options == null ? void 0 : options.idKey))
      return;
    if (v === 0 || v === false) {
      check[0] = true;
    } else if (v === 1 || v === true) {
      check[1] = true;
    }
    assert(
      !(check[0] && check[1]),
      "Projection cannot have a mix of inclusion and exclusion."
    );
  }
}
const $and = (_, rhs, options) => {
  assert(
    isArray(rhs),
    "Invalid expression: $and expects value to be an Array."
  );
  const queries = rhs.map((expr) => new Query(expr, options));
  return (obj) => queries.every((q) => q.test(obj));
};
const $or = (_, rhs, options) => {
  assert(isArray(rhs), "Invalid expression. $or expects value to be an Array");
  const queries = rhs.map((expr) => new Query(expr, options));
  return (obj) => queries.some((q) => q.test(obj));
};
const $nor = (_, rhs, options) => {
  assert(
    isArray(rhs),
    "Invalid expression. $nor expects value to be an array."
  );
  const f2 = $or("$or", rhs, options);
  return (obj) => !f2(obj);
};
const $not = (selector, rhs, options) => {
  const criteria = {};
  criteria[selector] = normalize(rhs);
  const query = new Query(criteria, options);
  return (obj) => !query.test(obj);
};
const $eq = createQueryOperator($eq$1);
const $gt = createQueryOperator($gt$1);
const $gte = createQueryOperator($gte$1);
const $in = createQueryOperator($in$1);
const $lt = createQueryOperator($lt$1);
const $lte = createQueryOperator($lte$1);
const $ne = createQueryOperator($ne$1);
const $nin = createQueryOperator($nin$1);
const $mod = createQueryOperator($mod$1);
const $regex = createQueryOperator($regex$1);
createQueryOperator($all);
const $elemMatch = createQueryOperator($elemMatch$1);
const $size = createQueryOperator($size$1);
const $exists = createQueryOperator($exists$1);
const $type = createQueryOperator($type$1);
var mingoInitDone = false;
function getMingoQuery(selector) {
  if (!mingoInitDone) {
    useOperators(OperatorType.PIPELINE, {
      $sort,
      $project
    });
    useOperators(OperatorType.QUERY, {
      $and,
      $eq,
      $elemMatch,
      $exists,
      $gt,
      $gte,
      $in,
      $lt,
      $lte,
      $ne,
      $nin,
      $mod,
      $nor,
      $not,
      $or,
      $regex,
      $size,
      $type
    });
    mingoInitDone = true;
  }
  return new Query(selector);
}
function normalizeMangoQuery(schema, mangoQuery) {
  var primaryKey = getPrimaryFieldOfPrimaryKey(schema.primaryKey);
  mangoQuery = flatClone(mangoQuery);
  var normalizedMangoQuery = clone$1(mangoQuery);
  if (typeof normalizedMangoQuery.skip !== "number") {
    normalizedMangoQuery.skip = 0;
  }
  if (!normalizedMangoQuery.selector) {
    normalizedMangoQuery.selector = {};
  } else {
    normalizedMangoQuery.selector = normalizedMangoQuery.selector;
    Object.entries(normalizedMangoQuery.selector).forEach(([field, matcher]) => {
      if (typeof matcher !== "object" || matcher === null) {
        normalizedMangoQuery.selector[field] = {
          $eq: matcher
        };
      }
    });
  }
  if (normalizedMangoQuery.index) {
    var indexAr = toArray(normalizedMangoQuery.index);
    if (!indexAr.includes(primaryKey)) {
      indexAr.push(primaryKey);
    }
    normalizedMangoQuery.index = indexAr;
  }
  if (!normalizedMangoQuery.sort) {
    if (normalizedMangoQuery.index) {
      normalizedMangoQuery.sort = normalizedMangoQuery.index.map((field) => {
        return {
          [field]: "asc"
        };
      });
    } else {
      if (schema.indexes) {
        var fieldsWithLogicalOperator = /* @__PURE__ */ new Set();
        Object.entries(normalizedMangoQuery.selector).forEach(([field, matcher]) => {
          var hasLogical = false;
          if (typeof matcher === "object" && matcher !== null) {
            hasLogical = !!Object.keys(matcher).find((operator) => LOGICAL_OPERATORS.has(operator));
          } else {
            hasLogical = true;
          }
          if (hasLogical) {
            fieldsWithLogicalOperator.add(field);
          }
        });
        var currentFieldsAmount = -1;
        var currentBestIndexForSort;
        schema.indexes.forEach((index) => {
          var useIndex = isMaybeReadonlyArray(index) ? index : [index];
          var firstWrongIndex = useIndex.findIndex((indexField) => !fieldsWithLogicalOperator.has(indexField));
          if (firstWrongIndex > 0 && firstWrongIndex > currentFieldsAmount) {
            currentFieldsAmount = firstWrongIndex;
            currentBestIndexForSort = useIndex;
          }
        });
        if (currentBestIndexForSort) {
          normalizedMangoQuery.sort = currentBestIndexForSort.map((field) => {
            return {
              [field]: "asc"
            };
          });
        }
      }
      if (!normalizedMangoQuery.sort) {
        normalizedMangoQuery.sort = [{
          [primaryKey]: "asc"
        }];
      }
    }
  } else {
    var isPrimaryInSort = normalizedMangoQuery.sort.find((p2) => firstPropertyNameOfObject(p2) === primaryKey);
    if (!isPrimaryInSort) {
      normalizedMangoQuery.sort = normalizedMangoQuery.sort.slice(0);
      normalizedMangoQuery.sort.push({
        [primaryKey]: "asc"
      });
    }
  }
  return normalizedMangoQuery;
}
function getSortComparator(schema, query) {
  if (!query.sort) {
    throw newRxError("SNH", {
      query
    });
  }
  var sortParts = [];
  query.sort.forEach((sortBlock) => {
    var key = Object.keys(sortBlock)[0];
    var direction = Object.values(sortBlock)[0];
    sortParts.push({
      key,
      direction,
      getValueFn: objectPathMonad(key)
    });
  });
  var fun = (a, b2) => {
    for (var i = 0; i < sortParts.length; ++i) {
      var sortPart = sortParts[i];
      var valueA = sortPart.getValueFn(a);
      var valueB = sortPart.getValueFn(b2);
      if (valueA !== valueB) {
        var ret = sortPart.direction === "asc" ? compare$1(valueA, valueB) : compare$1(valueB, valueA);
        return ret;
      }
    }
  };
  return fun;
}
function getQueryMatcher(_schema, query) {
  if (!query.sort) {
    throw newRxError("SNH", {
      query
    });
  }
  var mingoQuery = getMingoQuery(query.selector);
  var fun = (doc) => {
    return mingoQuery.test(doc);
  };
  return fun;
}
async function runQueryUpdateFunction(rxQuery, fn) {
  var docs = await rxQuery.exec();
  if (!docs) {
    return null;
  }
  if (Array.isArray(docs)) {
    return Promise.all(docs.map((doc) => fn(doc)));
  } else {
    var result = await fn(docs);
    return result;
  }
}
function getSortFieldsOfQuery(primaryKey, query) {
  if (!query.sort || query.sort.length === 0) {
    return [primaryKey];
  } else {
    return query.sort.map((part) => Object.keys(part)[0]);
  }
}
var RXQUERY_QUERY_PARAMS_CACHE = /* @__PURE__ */ new WeakMap();
function getQueryParams(rxQuery) {
  return getFromMapOrCreate(RXQUERY_QUERY_PARAMS_CACHE, rxQuery, () => {
    var collection = rxQuery.collection;
    var normalizedMangoQuery = normalizeMangoQuery(collection.storageInstance.schema, clone$1(rxQuery.mangoQuery));
    var primaryKey = collection.schema.primaryPath;
    var sortComparator = getSortComparator(collection.schema.jsonSchema, normalizedMangoQuery);
    var useSortComparator = (docA, docB) => {
      var sortComparatorData = {
        docA,
        docB,
        rxQuery
      };
      return sortComparator(sortComparatorData.docA, sortComparatorData.docB);
    };
    var queryMatcher = getQueryMatcher(collection.schema.jsonSchema, normalizedMangoQuery);
    var useQueryMatcher = (doc) => {
      var queryMatcherData = {
        doc,
        rxQuery
      };
      return queryMatcher(queryMatcherData.doc);
    };
    var ret = {
      primaryKey: rxQuery.collection.schema.primaryPath,
      skip: normalizedMangoQuery.skip,
      limit: normalizedMangoQuery.limit,
      sortFields: getSortFieldsOfQuery(primaryKey, normalizedMangoQuery),
      sortComparator: useSortComparator,
      queryMatcher: useQueryMatcher
    };
    return ret;
  });
}
function calculateNewResults(rxQuery, rxChangeEvents) {
  if (!rxQuery.collection.database.eventReduce) {
    return {
      runFullQueryAgain: true
    };
  }
  var queryParams = getQueryParams(rxQuery);
  var previousResults = ensureNotFalsy(rxQuery._result).docsData.slice(0);
  var previousResultsMap = ensureNotFalsy(rxQuery._result).docsDataMap;
  var changed = false;
  var eventReduceEvents = rxChangeEvents.map((cE) => rxChangeEventToEventReduceChangeEvent(cE)).filter(arrayFilterNotEmpty);
  var foundNonOptimizeable = eventReduceEvents.find((eventReduceEvent) => {
    var stateResolveFunctionInput = {
      queryParams,
      changeEvent: eventReduceEvent,
      previousResults,
      keyDocumentMap: previousResultsMap
    };
    var actionName = calculateActionName(stateResolveFunctionInput);
    if (actionName === "runFullQueryAgain") {
      return true;
    } else if (actionName !== "doNothing") {
      changed = true;
      runAction(actionName, queryParams, eventReduceEvent, previousResults, previousResultsMap);
      return false;
    }
  });
  if (foundNonOptimizeable) {
    return {
      runFullQueryAgain: true
    };
  } else {
    return {
      runFullQueryAgain: false,
      changed,
      newResults: previousResults
    };
  }
}
var QueryCache = /* @__PURE__ */ function() {
  function QueryCache2() {
    this._map = /* @__PURE__ */ new Map();
  }
  var _proto = QueryCache2.prototype;
  _proto.getByQuery = function getByQuery(rxQuery) {
    var stringRep = rxQuery.toString();
    return getFromMapOrCreate(this._map, stringRep, () => rxQuery);
  };
  return QueryCache2;
}();
function createQueryCache() {
  return new QueryCache();
}
function uncacheRxQuery(queryCache, rxQuery) {
  rxQuery.uncached = true;
  var stringRep = rxQuery.toString();
  queryCache._map.delete(stringRep);
}
function countRxQuerySubscribers(rxQuery) {
  return rxQuery.refCount$.observers.length;
}
var DEFAULT_TRY_TO_KEEP_MAX = 100;
var DEFAULT_UNEXECUTED_LIFETIME = 30 * 1e3;
var defaultCacheReplacementPolicyMonad = (tryToKeepMax, unExecutedLifetime) => (_collection, queryCache) => {
  if (queryCache._map.size < tryToKeepMax) {
    return;
  }
  var minUnExecutedLifetime = now$1() - unExecutedLifetime;
  var maybeUncache = [];
  var queriesInCache = Array.from(queryCache._map.values());
  for (var rxQuery of queriesInCache) {
    if (countRxQuerySubscribers(rxQuery) > 0) {
      continue;
    }
    if (rxQuery._lastEnsureEqual === 0 && rxQuery._creationTime < minUnExecutedLifetime) {
      uncacheRxQuery(queryCache, rxQuery);
      continue;
    }
    maybeUncache.push(rxQuery);
  }
  var mustUncache = maybeUncache.length - tryToKeepMax;
  if (mustUncache <= 0) {
    return;
  }
  var sortedByLastUsage = maybeUncache.sort((a, b2) => a._lastEnsureEqual - b2._lastEnsureEqual);
  var toRemove = sortedByLastUsage.slice(0, mustUncache);
  toRemove.forEach((rxQuery2) => uncacheRxQuery(queryCache, rxQuery2));
};
var defaultCacheReplacementPolicy = defaultCacheReplacementPolicyMonad(DEFAULT_TRY_TO_KEEP_MAX, DEFAULT_UNEXECUTED_LIFETIME);
var COLLECTIONS_WITH_RUNNING_CLEANUP = /* @__PURE__ */ new WeakSet();
function triggerCacheReplacement(rxCollection) {
  if (COLLECTIONS_WITH_RUNNING_CLEANUP.has(rxCollection)) {
    return;
  }
  COLLECTIONS_WITH_RUNNING_CLEANUP.add(rxCollection);
  nextTick().then(() => requestIdlePromise(200)).then(() => {
    if (!rxCollection.destroyed) {
      rxCollection.cacheReplacementPolicy(rxCollection, rxCollection._queryCache);
    }
    COLLECTIONS_WITH_RUNNING_CLEANUP.delete(rxCollection);
  });
}
var DocumentCache = /* @__PURE__ */ function() {
  function DocumentCache2(primaryPath, changes$, documentCreator) {
    this.cacheItemByDocId = /* @__PURE__ */ new Map();
    this.tasks = /* @__PURE__ */ new Set();
    this.registry = typeof FinalizationRegistry === "function" ? new FinalizationRegistry((docMeta) => {
      var docId = docMeta.docId;
      var cacheItem = this.cacheItemByDocId.get(docId);
      if (cacheItem) {
        cacheItem[0].delete(docMeta.revisionHeight);
        if (cacheItem[0].size === 0) {
          this.cacheItemByDocId.delete(docId);
        }
      }
    }) : void 0;
    this.primaryPath = primaryPath;
    this.changes$ = changes$;
    this.documentCreator = documentCreator;
    changes$.subscribe((events) => {
      this.tasks.add(() => {
        var cacheItemByDocId = this.cacheItemByDocId;
        for (var index = 0; index < events.length; index++) {
          var event = events[index];
          var cacheItem = cacheItemByDocId.get(event.documentId);
          if (cacheItem) {
            var documentData = event.documentData;
            if (!documentData) {
              documentData = event.previousDocumentData;
            }
            cacheItem[1] = documentData;
          }
        }
      });
      if (this.tasks.size <= 1) {
        requestIdlePromiseNoQueue().then(() => {
          this.processTasks();
        });
      }
    });
  }
  var _proto = DocumentCache2.prototype;
  _proto.processTasks = function processTasks() {
    if (this.tasks.size === 0) {
      return;
    }
    var tasks = Array.from(this.tasks);
    tasks.forEach((task) => task());
    this.tasks.clear();
  };
  _proto.getLatestDocumentData = function getLatestDocumentData(docId) {
    this.processTasks();
    var cacheItem = getFromMapOrThrow(this.cacheItemByDocId, docId);
    return cacheItem[1];
  };
  _proto.getLatestDocumentDataIfExists = function getLatestDocumentDataIfExists(docId) {
    this.processTasks();
    var cacheItem = this.cacheItemByDocId.get(docId);
    if (cacheItem) {
      return cacheItem[1];
    }
  };
  return _createClass(DocumentCache2, [{
    key: "getCachedRxDocuments",
    get: function() {
      var fn = getCachedRxDocumentMonad(this);
      return overwriteGetterForCaching(this, "getCachedRxDocuments", fn);
    }
  }, {
    key: "getCachedRxDocument",
    get: function() {
      var fn = getCachedRxDocumentMonad(this);
      return overwriteGetterForCaching(this, "getCachedRxDocument", (doc) => fn([doc])[0]);
    }
  }]);
}();
function getCachedRxDocumentMonad(docCache) {
  var primaryPath = docCache.primaryPath;
  var cacheItemByDocId = docCache.cacheItemByDocId;
  var registry = docCache.registry;
  var deepFreezeWhenDevMode = overwritable.deepFreezeWhenDevMode;
  var documentCreator = docCache.documentCreator;
  var fn = (docsData) => {
    var ret = new Array(docsData.length);
    var registryTasks = [];
    for (var index = 0; index < docsData.length; index++) {
      var docData = docsData[index];
      var docId = docData[primaryPath];
      var revisionHeight = getHeightOfRevision(docData._rev);
      var byRev = void 0;
      var cachedRxDocumentWeakRef = void 0;
      var cacheItem = cacheItemByDocId.get(docId);
      if (!cacheItem) {
        byRev = /* @__PURE__ */ new Map();
        cacheItem = [byRev, docData];
        cacheItemByDocId.set(docId, cacheItem);
      } else {
        byRev = cacheItem[0];
        cachedRxDocumentWeakRef = byRev.get(revisionHeight);
      }
      var cachedRxDocument = cachedRxDocumentWeakRef ? cachedRxDocumentWeakRef.deref() : void 0;
      if (!cachedRxDocument) {
        docData = deepFreezeWhenDevMode(docData);
        cachedRxDocument = documentCreator(docData);
        byRev.set(revisionHeight, createWeakRefWithFallback(cachedRxDocument));
        if (registry) {
          registryTasks.push(cachedRxDocument);
        }
      }
      ret[index] = cachedRxDocument;
    }
    if (registryTasks.length > 0 && registry) {
      docCache.tasks.add(() => {
        for (var _index = 0; _index < registryTasks.length; _index++) {
          var doc = registryTasks[_index];
          registry.register(doc, {
            docId: doc.primary,
            revisionHeight: getHeightOfRevision(doc.revision)
          });
        }
      });
      if (docCache.tasks.size <= 1) {
        requestIdlePromiseNoQueue().then(() => {
          docCache.processTasks();
        });
      }
    }
    return ret;
  };
  return fn;
}
function mapDocumentsDataToCacheDocs(docCache, docsData) {
  var getCachedRxDocuments = docCache.getCachedRxDocuments;
  return getCachedRxDocuments(docsData);
}
var HAS_WEAK_REF = typeof WeakRef === "function";
var createWeakRefWithFallback = HAS_WEAK_REF ? createWeakRef : createWeakRefFallback;
function createWeakRef(obj) {
  return new WeakRef(obj);
}
function createWeakRefFallback(obj) {
  return {
    deref() {
      return obj;
    }
  };
}
var RxQuerySingleResult = /* @__PURE__ */ function() {
  function RxQuerySingleResult2(query, docsDataFromStorageInstance, count) {
    this.time = now$1();
    this.query = query;
    this.count = count;
    this.documents = mapDocumentsDataToCacheDocs(this.query.collection._docCache, docsDataFromStorageInstance);
  }
  var _proto = RxQuerySingleResult2.prototype;
  _proto.getValue = function getValue2(throwIfMissing) {
    var op = this.query.op;
    if (op === "count") {
      return this.count;
    } else if (op === "findOne") {
      var doc = this.documents.length === 0 ? null : this.documents[0];
      if (!doc && throwIfMissing) {
        throw newRxError("QU10", {
          collection: this.query.collection.name,
          query: this.query.mangoQuery,
          op
        });
      } else {
        return doc;
      }
    } else if (op === "findByIds") {
      return this.docsMap;
    } else {
      return this.documents.slice(0);
    }
  };
  return _createClass(RxQuerySingleResult2, [{
    key: "docsData",
    get: function() {
      return overwriteGetterForCaching(this, "docsData", this.documents.map((d) => d._data));
    }
    // A key->document map, used in the event reduce optimization.
  }, {
    key: "docsDataMap",
    get: function() {
      var map2 = /* @__PURE__ */ new Map();
      this.documents.forEach((d) => {
        map2.set(d.primary, d._data);
      });
      return overwriteGetterForCaching(this, "docsDataMap", map2);
    }
  }, {
    key: "docsMap",
    get: function() {
      var map2 = /* @__PURE__ */ new Map();
      var documents = this.documents;
      for (var i = 0; i < documents.length; i++) {
        var doc = documents[i];
        map2.set(doc.primary, doc);
      }
      return overwriteGetterForCaching(this, "docsMap", map2);
    }
  }]);
}();
var _queryCount = 0;
var newQueryID = function() {
  return ++_queryCount;
};
var RxQueryBase = /* @__PURE__ */ function() {
  function RxQueryBase2(op, mangoQuery, collection, other = {}) {
    this.id = newQueryID();
    this._execOverDatabaseCount = 0;
    this._creationTime = now$1();
    this._lastEnsureEqual = 0;
    this.uncached = false;
    this.refCount$ = new BehaviorSubject(null);
    this._result = null;
    this._latestChangeEvent = -1;
    this._lastExecStart = 0;
    this._lastExecEnd = 0;
    this._ensureEqualQueue = PROMISE_RESOLVE_FALSE;
    this.op = op;
    this.mangoQuery = mangoQuery;
    this.collection = collection;
    this.other = other;
    if (!mangoQuery) {
      this.mangoQuery = _getDefaultQuery();
    }
    this.isFindOneByIdQuery = isFindOneByIdQuery(this.collection.schema.primaryPath, mangoQuery);
  }
  var _proto = RxQueryBase2.prototype;
  _proto._setResultData = function _setResultData(newResultData) {
    if (typeof newResultData === "undefined") {
      throw newRxError("QU18", {
        database: this.collection.database.name,
        collection: this.collection.name
      });
    }
    if (typeof newResultData === "number") {
      this._result = new RxQuerySingleResult(this, [], newResultData);
      return;
    } else if (newResultData instanceof Map) {
      newResultData = Array.from(newResultData.values());
    }
    var newQueryResult = new RxQuerySingleResult(this, newResultData, newResultData.length);
    this._result = newQueryResult;
  };
  _proto._execOverDatabase = async function _execOverDatabase() {
    this._execOverDatabaseCount = this._execOverDatabaseCount + 1;
    this._lastExecStart = now$1();
    if (this.op === "count") {
      var preparedQuery = this.getPreparedQuery();
      var result = await this.collection.storageInstance.count(preparedQuery);
      if (result.mode === "slow" && !this.collection.database.allowSlowCount) {
        throw newRxError("QU14", {
          collection: this.collection,
          queryObj: this.mangoQuery
        });
      } else {
        return result.count;
      }
    }
    if (this.op === "findByIds") {
      var ids = ensureNotFalsy(this.mangoQuery.selector)[this.collection.schema.primaryPath].$in;
      var ret = /* @__PURE__ */ new Map();
      var mustBeQueried = [];
      ids.forEach((id) => {
        var docData = this.collection._docCache.getLatestDocumentDataIfExists(id);
        if (docData) {
          if (!docData._deleted) {
            var doc = this.collection._docCache.getCachedRxDocument(docData);
            ret.set(id, doc);
          }
        } else {
          mustBeQueried.push(id);
        }
      });
      if (mustBeQueried.length > 0) {
        var docs = await this.collection.storageInstance.findDocumentsById(mustBeQueried, false);
        docs.forEach((docData) => {
          var doc = this.collection._docCache.getCachedRxDocument(docData);
          ret.set(doc.primary, doc);
        });
      }
      return ret;
    }
    var docsPromise = queryCollection(this);
    return docsPromise.then((docs2) => {
      this._lastExecEnd = now$1();
      return docs2;
    });
  };
  _proto.exec = async function exec(throwIfMissing) {
    if (throwIfMissing && this.op !== "findOne") {
      throw newRxError("QU9", {
        collection: this.collection.name,
        query: this.mangoQuery,
        op: this.op
      });
    }
    await _ensureEqual(this);
    var useResult = ensureNotFalsy(this._result);
    return useResult.getValue(throwIfMissing);
  };
  _proto.toString = function toString2() {
    var stringObj = sortObject({
      op: this.op,
      query: this.mangoQuery,
      other: this.other
    }, true);
    var value = JSON.stringify(stringObj);
    this.toString = () => value;
    return value;
  };
  _proto.getPreparedQuery = function getPreparedQuery() {
    var hookInput = {
      rxQuery: this,
      // can be mutated by the hooks so we have to deep clone first.
      mangoQuery: normalizeMangoQuery(this.collection.schema.jsonSchema, this.mangoQuery)
    };
    hookInput.mangoQuery.selector._deleted = {
      $eq: false
    };
    if (hookInput.mangoQuery.index) {
      hookInput.mangoQuery.index.unshift("_deleted");
    }
    runPluginHooks("prePrepareQuery", hookInput);
    var value = prepareQuery(this.collection.schema.jsonSchema, hookInput.mangoQuery);
    this.getPreparedQuery = () => value;
    return value;
  };
  _proto.doesDocumentDataMatch = function doesDocumentDataMatch(docData) {
    if (docData._deleted) {
      return false;
    }
    return this.queryMatcher(docData);
  };
  _proto.remove = function remove() {
    return this.exec().then((docs) => {
      if (Array.isArray(docs)) {
        return Promise.all(docs.map((doc) => doc.remove()));
      } else {
        return docs.remove();
      }
    });
  };
  _proto.incrementalRemove = function incrementalRemove() {
    return runQueryUpdateFunction(this.asRxQuery, (doc) => doc.incrementalRemove());
  };
  _proto.update = function update(_updateObj) {
    throw pluginMissing("update");
  };
  _proto.patch = function patch(_patch) {
    return runQueryUpdateFunction(this.asRxQuery, (doc) => doc.patch(_patch));
  };
  _proto.incrementalPatch = function incrementalPatch(patch) {
    return runQueryUpdateFunction(this.asRxQuery, (doc) => doc.incrementalPatch(patch));
  };
  _proto.modify = function modify(mutationFunction) {
    return runQueryUpdateFunction(this.asRxQuery, (doc) => doc.modify(mutationFunction));
  };
  _proto.incrementalModify = function incrementalModify(mutationFunction) {
    return runQueryUpdateFunction(this.asRxQuery, (doc) => doc.incrementalModify(mutationFunction));
  };
  _proto.where = function where(_queryObj) {
    throw pluginMissing("query-builder");
  };
  _proto.sort = function sort(_params) {
    throw pluginMissing("query-builder");
  };
  _proto.skip = function skip(_amount) {
    throw pluginMissing("query-builder");
  };
  _proto.limit = function limit(_amount) {
    throw pluginMissing("query-builder");
  };
  return _createClass(RxQueryBase2, [{
    key: "$",
    get: function() {
      if (!this._$) {
        var results$ = this.collection.$.pipe(
          /**
           * Performance shortcut.
           * Changes to local documents are not relevant for the query.
           */
          filter((changeEvent) => !changeEvent.isLocal),
          /**
           * Start once to ensure the querying also starts
           * when there where no changes.
           */
          startWith(null),
          // ensure query results are up to date.
          mergeMap(() => _ensureEqual(this)),
          // use the current result set, written by _ensureEqual().
          map(() => this._result),
          // do not run stuff above for each new subscriber, only once.
          shareReplay(RXJS_SHARE_REPLAY_DEFAULTS),
          // do not proceed if result set has not changed.
          distinctUntilChanged((prev, curr) => {
            if (prev && prev.time === ensureNotFalsy(curr).time) {
              return true;
            } else {
              return false;
            }
          }),
          filter((result) => !!result),
          /**
           * Map the result set to a single RxDocument or an array,
           * depending on query type
           */
          map((result) => {
            return ensureNotFalsy(result).getValue();
          })
        );
        this._$ = merge$1(
          results$,
          /**
           * Also add the refCount$ to the query observable
           * to allow us to count the amount of subscribers.
           */
          this.refCount$.pipe(filter(() => false))
        );
      }
      return this._$;
    }
  }, {
    key: "$$",
    get: function() {
      var reactivity = this.collection.database.getReactivityFactory();
      return reactivity.fromObservable(this.$, void 0, this.collection.database);
    }
    // stores the changeEvent-number of the last handled change-event
    // time stamps on when the last full exec over the database has run
    // used to properly handle events that happen while the find-query is running
    // TODO do we still need these properties?
    /**
     * ensures that the exec-runs
     * are not run in parallel
     */
  }, {
    key: "queryMatcher",
    get: function() {
      var schema = this.collection.schema.jsonSchema;
      var normalizedQuery = normalizeMangoQuery(this.collection.schema.jsonSchema, this.mangoQuery);
      return overwriteGetterForCaching(this, "queryMatcher", getQueryMatcher(schema, normalizedQuery));
    }
  }, {
    key: "asRxQuery",
    get: function() {
      return this;
    }
  }]);
}();
function _getDefaultQuery() {
  return {
    selector: {}
  };
}
function tunnelQueryCache(rxQuery) {
  return rxQuery.collection._queryCache.getByQuery(rxQuery);
}
function createRxQuery(op, queryObj, collection, other) {
  runPluginHooks("preCreateRxQuery", {
    op,
    queryObj,
    collection,
    other
  });
  var ret = new RxQueryBase(op, queryObj, collection, other);
  ret = tunnelQueryCache(ret);
  triggerCacheReplacement(collection);
  return ret;
}
function _isResultsInSync(rxQuery) {
  var currentLatestEventNumber = rxQuery.asRxQuery.collection._changeEventBuffer.getCounter();
  if (rxQuery._latestChangeEvent >= currentLatestEventNumber) {
    return true;
  } else {
    return false;
  }
}
async function _ensureEqual(rxQuery) {
  if (rxQuery.collection.awaitBeforeReads.size > 0) {
    await Promise.all(Array.from(rxQuery.collection.awaitBeforeReads).map((fn) => fn()));
  }
  if (rxQuery.collection.database.destroyed || _isResultsInSync(rxQuery)) {
    return false;
  }
  rxQuery._ensureEqualQueue = rxQuery._ensureEqualQueue.then(() => __ensureEqual(rxQuery));
  return rxQuery._ensureEqualQueue;
}
function __ensureEqual(rxQuery) {
  rxQuery._lastEnsureEqual = now$1();
  if (
    // db is closed
    rxQuery.collection.database.destroyed || // nothing happened since last run
    _isResultsInSync(rxQuery)
  ) {
    return PROMISE_RESOLVE_FALSE;
  }
  var ret = false;
  var mustReExec = false;
  if (rxQuery._latestChangeEvent === -1) {
    mustReExec = true;
  }
  if (!mustReExec) {
    var missedChangeEvents = rxQuery.asRxQuery.collection._changeEventBuffer.getFrom(rxQuery._latestChangeEvent + 1);
    if (missedChangeEvents === null) {
      mustReExec = true;
    } else {
      rxQuery._latestChangeEvent = rxQuery.asRxQuery.collection._changeEventBuffer.getCounter();
      var runChangeEvents = rxQuery.asRxQuery.collection._changeEventBuffer.reduceByLastOfDoc(missedChangeEvents);
      if (rxQuery.op === "count") {
        var previousCount = ensureNotFalsy(rxQuery._result).count;
        var newCount = previousCount;
        runChangeEvents.forEach((cE) => {
          var didMatchBefore = cE.previousDocumentData && rxQuery.doesDocumentDataMatch(cE.previousDocumentData);
          var doesMatchNow2 = rxQuery.doesDocumentDataMatch(cE.documentData);
          if (!didMatchBefore && doesMatchNow2) {
            newCount++;
          }
          if (didMatchBefore && !doesMatchNow2) {
            newCount--;
          }
        });
        if (newCount !== previousCount) {
          ret = true;
          rxQuery._setResultData(newCount);
        }
      } else {
        var eventReduceResult = calculateNewResults(rxQuery, runChangeEvents);
        if (eventReduceResult.runFullQueryAgain) {
          mustReExec = true;
        } else if (eventReduceResult.changed) {
          ret = true;
          rxQuery._setResultData(eventReduceResult.newResults);
        }
      }
    }
  }
  if (mustReExec) {
    return rxQuery._execOverDatabase().then((newResultData) => {
      rxQuery._latestChangeEvent = rxQuery.collection._changeEventBuffer.getCounter();
      if (typeof newResultData === "number") {
        if (!rxQuery._result || newResultData !== rxQuery._result.count) {
          ret = true;
          rxQuery._setResultData(newResultData);
        }
        return ret;
      }
      if (!rxQuery._result || !areRxDocumentArraysEqual(rxQuery.collection.schema.primaryPath, newResultData, rxQuery._result.docsData)) {
        ret = true;
        rxQuery._setResultData(newResultData);
      }
      return ret;
    });
  }
  return Promise.resolve(ret);
}
function prepareQuery(schema, mutateableQuery) {
  if (!mutateableQuery.sort) {
    throw newRxError("SNH", {
      query: mutateableQuery
    });
  }
  var queryPlan = getQueryPlan(schema, mutateableQuery);
  return {
    query: mutateableQuery,
    queryPlan
  };
}
async function queryCollection(rxQuery) {
  var docs = [];
  var collection = rxQuery.collection;
  if (rxQuery.isFindOneByIdQuery) {
    if (Array.isArray(rxQuery.isFindOneByIdQuery)) {
      var docIds = rxQuery.isFindOneByIdQuery;
      docIds = docIds.filter((docId2) => {
        var docData2 = rxQuery.collection._docCache.getLatestDocumentDataIfExists(docId2);
        if (docData2) {
          if (!docData2._deleted) {
            docs.push(docData2);
          }
          return false;
        } else {
          return true;
        }
      });
      if (docIds.length > 0) {
        var docsFromStorage = await collection.storageInstance.findDocumentsById(docIds, false);
        appendToArray(docs, docsFromStorage);
      }
    } else {
      var docId = rxQuery.isFindOneByIdQuery;
      var docData = rxQuery.collection._docCache.getLatestDocumentDataIfExists(docId);
      if (!docData) {
        var fromStorageList = await collection.storageInstance.findDocumentsById([docId], false);
        if (fromStorageList[0]) {
          docData = fromStorageList[0];
        }
      }
      if (docData && !docData._deleted) {
        docs.push(docData);
      }
    }
  } else {
    var preparedQuery = rxQuery.getPreparedQuery();
    var queryResult = await collection.storageInstance.query(preparedQuery);
    docs = queryResult.documents;
  }
  return docs;
}
function isFindOneByIdQuery(primaryPath, query) {
  if (!query.skip && query.selector && Object.keys(query.selector).length === 1 && query.selector[primaryPath]) {
    var value = query.selector[primaryPath];
    if (typeof value === "string") {
      return value;
    } else if (Object.keys(value).length === 1 && typeof value.$eq === "string") {
      return value.$eq;
    }
    if (Object.keys(value).length === 1 && Array.isArray(value.$eq) && // must only contain strings
    !value.$eq.find((r2) => typeof r2 !== "string")) {
      return value.$eq;
    }
  }
  return false;
}
var INTERNAL_STORAGE_NAME = "_rxdb_internal";
async function getSingleDocument(storageInstance, documentId) {
  var results = await storageInstance.findDocumentsById([documentId], false);
  var doc = results[0];
  if (doc) {
    return doc;
  } else {
    return void 0;
  }
}
async function writeSingle(instance, writeRow, context) {
  var writeResult = await instance.bulkWrite([writeRow], context);
  if (writeResult.error.length > 0) {
    var error = writeResult.error[0];
    throw error;
  } else {
    var primaryPath = getPrimaryFieldOfPrimaryKey(instance.schema.primaryKey);
    var success = getWrittenDocumentsFromBulkWriteResponse(primaryPath, [writeRow], writeResult);
    var ret = success[0];
    return ret;
  }
}
function observeSingle(storageInstance, documentId) {
  var firstFindPromise = getSingleDocument(storageInstance, documentId);
  var ret = storageInstance.changeStream().pipe(map((evBulk) => evBulk.events.find((ev) => ev.documentId === documentId)), filter((ev) => !!ev), map((ev) => Promise.resolve(ensureNotFalsy(ev).documentData)), startWith(firstFindPromise), switchMap((v) => v), filter((v) => !!v));
  return ret;
}
function stackCheckpoints(checkpoints) {
  return Object.assign({}, ...checkpoints);
}
function throwIfIsStorageWriteError(collection, documentId, writeData, error) {
  if (error) {
    if (error.status === 409) {
      throw newRxError("CONFLICT", {
        collection: collection.name,
        id: documentId,
        writeError: error,
        data: writeData
      });
    } else if (error.status === 422) {
      throw newRxError("VD2", {
        collection: collection.name,
        id: documentId,
        writeError: error,
        data: writeData
      });
    } else {
      throw error;
    }
  }
}
function categorizeBulkWriteRows(storageInstance, primaryPath, docsInDb, bulkWriteRows, context, onInsert, onUpdate) {
  var hasAttachments = !!storageInstance.schema.attachments;
  var bulkInsertDocs = [];
  var bulkUpdateDocs = [];
  var errors = [];
  var eventBulkId = randomCouchString(10);
  var eventBulk = {
    id: eventBulkId,
    events: [],
    checkpoint: null,
    context,
    startTime: now$1(),
    endTime: 0
  };
  var eventBulkEvents = eventBulk.events;
  var attachmentsAdd = [];
  var attachmentsRemove = [];
  var attachmentsUpdate = [];
  var hasDocsInDb = docsInDb.size > 0;
  var newestRow;
  var rowAmount = bulkWriteRows.length;
  var _loop = function() {
    var writeRow = bulkWriteRows[rowId];
    var document2 = writeRow.document;
    var previous = writeRow.previous;
    var docId = document2[primaryPath];
    var documentDeleted = document2._deleted;
    var previousDeleted = previous && previous._deleted;
    var documentInDb = void 0;
    if (hasDocsInDb) {
      documentInDb = docsInDb.get(docId);
    }
    var attachmentError;
    if (!documentInDb) {
      var insertedIsDeleted = documentDeleted ? true : false;
      if (hasAttachments) {
        Object.entries(document2._attachments).forEach(([attachmentId, attachmentData]) => {
          if (!attachmentData.data) {
            attachmentError = {
              documentId: docId,
              isError: true,
              status: 510,
              writeRow,
              attachmentId
            };
            errors.push(attachmentError);
          } else {
            attachmentsAdd.push({
              documentId: docId,
              attachmentId,
              attachmentData,
              digest: attachmentData.digest
            });
          }
        });
      }
      if (!attachmentError) {
        if (hasAttachments) {
          bulkInsertDocs.push(stripAttachmentsDataFromRow(writeRow));
        } else {
          bulkInsertDocs.push(writeRow);
        }
        newestRow = writeRow;
      }
      if (!insertedIsDeleted) {
        var event = {
          documentId: docId,
          operation: "INSERT",
          documentData: hasAttachments ? stripAttachmentsDataFromDocument(document2) : document2,
          previousDocumentData: hasAttachments && previous ? stripAttachmentsDataFromDocument(previous) : previous
        };
        eventBulkEvents.push(event);
      }
    } else {
      var revInDb = documentInDb._rev;
      if (!previous || !!previous && revInDb !== previous._rev) {
        var err = {
          isError: true,
          status: 409,
          documentId: docId,
          writeRow,
          documentInDb
        };
        errors.push(err);
        return 1;
      }
      var updatedRow = hasAttachments ? stripAttachmentsDataFromRow(writeRow) : writeRow;
      if (hasAttachments) {
        if (documentDeleted) {
          if (previous) {
            Object.keys(previous._attachments).forEach((attachmentId) => {
              attachmentsRemove.push({
                documentId: docId,
                attachmentId,
                digest: ensureNotFalsy(previous)._attachments[attachmentId].digest
              });
            });
          }
        } else {
          Object.entries(document2._attachments).find(([attachmentId, attachmentData]) => {
            var previousAttachmentData = previous ? previous._attachments[attachmentId] : void 0;
            if (!previousAttachmentData && !attachmentData.data) {
              attachmentError = {
                documentId: docId,
                documentInDb,
                isError: true,
                status: 510,
                writeRow,
                attachmentId
              };
            }
            return true;
          });
          if (!attachmentError) {
            Object.entries(document2._attachments).forEach(([attachmentId, attachmentData]) => {
              var previousAttachmentData = previous ? previous._attachments[attachmentId] : void 0;
              if (!previousAttachmentData) {
                attachmentsAdd.push({
                  documentId: docId,
                  attachmentId,
                  attachmentData,
                  digest: attachmentData.digest
                });
              } else {
                var newDigest = updatedRow.document._attachments[attachmentId].digest;
                if (attachmentData.data && /**
                 * Performance shortcut,
                 * do not update the attachment data if it did not change.
                 */
                previousAttachmentData.digest !== newDigest) {
                  attachmentsUpdate.push({
                    documentId: docId,
                    attachmentId,
                    attachmentData,
                    digest: attachmentData.digest
                  });
                }
              }
            });
          }
        }
      }
      if (attachmentError) {
        errors.push(attachmentError);
      } else {
        if (hasAttachments) {
          bulkUpdateDocs.push(stripAttachmentsDataFromRow(updatedRow));
        } else {
          bulkUpdateDocs.push(updatedRow);
        }
        newestRow = updatedRow;
      }
      var eventDocumentData = null;
      var previousEventDocumentData = null;
      var operation = null;
      if (previousDeleted && !documentDeleted) {
        operation = "INSERT";
        eventDocumentData = hasAttachments ? stripAttachmentsDataFromDocument(document2) : document2;
      } else if (previous && !previousDeleted && !documentDeleted) {
        operation = "UPDATE";
        eventDocumentData = hasAttachments ? stripAttachmentsDataFromDocument(document2) : document2;
        previousEventDocumentData = previous;
      } else if (documentDeleted) {
        operation = "DELETE";
        eventDocumentData = ensureNotFalsy(document2);
        previousEventDocumentData = previous;
      } else {
        throw newRxError("SNH", {
          args: {
            writeRow
          }
        });
      }
      var _event = {
        documentId: docId,
        documentData: eventDocumentData,
        previousDocumentData: previousEventDocumentData,
        operation
      };
      eventBulkEvents.push(_event);
    }
  };
  for (var rowId = 0; rowId < rowAmount; rowId++) {
    if (_loop()) continue;
  }
  return {
    bulkInsertDocs,
    bulkUpdateDocs,
    newestRow,
    errors,
    eventBulk,
    attachmentsAdd,
    attachmentsRemove,
    attachmentsUpdate
  };
}
function stripAttachmentsDataFromRow(writeRow) {
  return {
    previous: writeRow.previous,
    document: stripAttachmentsDataFromDocument(writeRow.document)
  };
}
function getAttachmentSize(attachmentBase64String) {
  return atob(attachmentBase64String).length;
}
function attachmentWriteDataToNormalData(writeData) {
  var data = writeData.data;
  if (!data) {
    return writeData;
  }
  var ret = {
    length: getAttachmentSize(data),
    digest: writeData.digest,
    type: writeData.type
  };
  return ret;
}
function stripAttachmentsDataFromDocument(doc) {
  if (!doc._attachments || Object.keys(doc._attachments).length === 0) {
    return doc;
  }
  var useDoc = flatClone(doc);
  useDoc._attachments = {};
  Object.entries(doc._attachments).forEach(([attachmentId, attachmentData]) => {
    useDoc._attachments[attachmentId] = attachmentWriteDataToNormalData(attachmentData);
  });
  return useDoc;
}
function flatCloneDocWithMeta(doc) {
  return Object.assign({}, doc, {
    _meta: flatClone(doc._meta)
  });
}
var BULK_WRITE_SUCCESS_MAP = /* @__PURE__ */ new WeakMap();
function getWrappedStorageInstance(database, storageInstance, rxJsonSchema) {
  overwritable.deepFreezeWhenDevMode(rxJsonSchema);
  var primaryPath = getPrimaryFieldOfPrimaryKey(storageInstance.schema.primaryKey);
  var ret = {
    originalStorageInstance: storageInstance,
    schema: storageInstance.schema,
    internals: storageInstance.internals,
    collectionName: storageInstance.collectionName,
    databaseName: storageInstance.databaseName,
    options: storageInstance.options,
    bulkWrite(rows, context) {
      var databaseToken = database.token;
      var toStorageWriteRows = new Array(rows.length);
      var time = now$1();
      for (var index = 0; index < rows.length; index++) {
        var writeRow = rows[index];
        var document2 = flatCloneDocWithMeta(writeRow.document);
        document2._meta.lwt = time;
        var previous = writeRow.previous;
        document2._rev = createRevision(databaseToken, previous);
        toStorageWriteRows[index] = {
          document: document2,
          previous
        };
      }
      runPluginHooks("preStorageWrite", {
        storageInstance: this.originalStorageInstance,
        rows: toStorageWriteRows
      });
      return database.lockedRun(() => storageInstance.bulkWrite(toStorageWriteRows, context)).then((writeResult) => {
        var useWriteResult = {
          error: []
        };
        var successArray = getWrittenDocumentsFromBulkWriteResponse(primaryPath, toStorageWriteRows, writeResult);
        BULK_WRITE_SUCCESS_MAP.set(useWriteResult, successArray);
        var reInsertErrors = writeResult.error.length === 0 ? [] : writeResult.error.filter((error) => {
          if (error.status === 409 && !error.writeRow.previous && !error.writeRow.document._deleted && ensureNotFalsy(error.documentInDb)._deleted) {
            return true;
          }
          useWriteResult.error.push(error);
          return false;
        });
        if (reInsertErrors.length > 0) {
          var reInserts = reInsertErrors.map((error) => {
            return {
              previous: error.documentInDb,
              document: Object.assign({}, error.writeRow.document, {
                _rev: createRevision(database.token, error.documentInDb)
              })
            };
          });
          return database.lockedRun(() => storageInstance.bulkWrite(reInserts, context)).then((subResult) => {
            appendToArray(useWriteResult.error, subResult.error);
            var subSuccess = getWrittenDocumentsFromBulkWriteResponse(primaryPath, reInserts, subResult);
            appendToArray(successArray, subSuccess);
            return useWriteResult;
          });
        }
        return useWriteResult;
      });
    },
    query(preparedQuery) {
      return database.lockedRun(() => storageInstance.query(preparedQuery));
    },
    count(preparedQuery) {
      return database.lockedRun(() => storageInstance.count(preparedQuery));
    },
    findDocumentsById(ids, deleted) {
      return database.lockedRun(() => storageInstance.findDocumentsById(ids, deleted));
    },
    getAttachmentData(documentId, attachmentId, digest) {
      return database.lockedRun(() => storageInstance.getAttachmentData(documentId, attachmentId, digest));
    },
    getChangedDocumentsSince: !storageInstance.getChangedDocumentsSince ? void 0 : (limit, checkpoint) => {
      return database.lockedRun(() => storageInstance.getChangedDocumentsSince(ensureNotFalsy(limit), checkpoint));
    },
    cleanup(minDeletedTime) {
      return database.lockedRun(() => storageInstance.cleanup(minDeletedTime));
    },
    remove() {
      database.storageInstances.delete(ret);
      return database.lockedRun(() => storageInstance.remove());
    },
    close() {
      database.storageInstances.delete(ret);
      return database.lockedRun(() => storageInstance.close());
    },
    changeStream() {
      return storageInstance.changeStream();
    },
    conflictResultionTasks() {
      return storageInstance.conflictResultionTasks();
    },
    resolveConflictResultionTask(taskSolution) {
      if (taskSolution.output.isEqual) {
        return storageInstance.resolveConflictResultionTask(taskSolution);
      }
      var doc = Object.assign({}, taskSolution.output.documentData, {
        _meta: getDefaultRxDocumentMeta(),
        _rev: getDefaultRevision(),
        _attachments: {}
      });
      var documentData = flatClone(doc);
      delete documentData._meta;
      delete documentData._rev;
      delete documentData._attachments;
      return storageInstance.resolveConflictResultionTask({
        id: taskSolution.id,
        output: {
          isEqual: false,
          documentData
        }
      });
    }
  };
  database.storageInstances.add(ret);
  return ret;
}
function ensureRxStorageInstanceParamsAreCorrect(params) {
  if (params.schema.keyCompression) {
    throw newRxError("UT5", {
      args: {
        params
      }
    });
  }
  if (hasEncryption(params.schema)) {
    throw newRxError("UT6", {
      args: {
        params
      }
    });
  }
  if (params.schema.attachments && params.schema.attachments.compression) {
    throw newRxError("UT7", {
      args: {
        params
      }
    });
  }
}
function hasEncryption(jsonSchema) {
  if (!!jsonSchema.encrypted && jsonSchema.encrypted.length > 0 || jsonSchema.attachments && jsonSchema.attachments.encrypted) {
    return true;
  } else {
    return false;
  }
}
function getChangedDocumentsSinceQuery(storageInstance, limit, checkpoint) {
  var primaryPath = getPrimaryFieldOfPrimaryKey(storageInstance.schema.primaryKey);
  var sinceLwt = checkpoint ? checkpoint.lwt : RX_META_LWT_MINIMUM;
  var sinceId = checkpoint ? checkpoint.id : "";
  return normalizeMangoQuery(storageInstance.schema, {
    selector: {
      $or: [{
        "_meta.lwt": {
          $gt: sinceLwt
        }
      }, {
        "_meta.lwt": {
          $eq: sinceLwt
        },
        [primaryPath]: {
          $gt: checkpoint ? sinceId : ""
        }
      }],
      // add this hint for better index usage
      "_meta.lwt": {
        $gte: sinceLwt
      }
    },
    sort: [{
      "_meta.lwt": "asc"
    }, {
      [primaryPath]: "asc"
    }],
    skip: 0,
    limit
    /**
     * DO NOT SET A SPECIFIC INDEX HERE!
     * The query might be modified by some plugin
     * before sending it to the storage.
     * We can be sure that in the end the query planner
     * will find the best index.
     */
    // index: ['_meta.lwt', primaryPath]
  });
}
async function getChangedDocumentsSince$1(storageInstance, limit, checkpoint) {
  if (storageInstance.getChangedDocumentsSince) {
    return storageInstance.getChangedDocumentsSince(limit, checkpoint);
  }
  var primaryPath = getPrimaryFieldOfPrimaryKey(storageInstance.schema.primaryKey);
  var query = prepareQuery(storageInstance.schema, getChangedDocumentsSinceQuery(storageInstance, limit, checkpoint));
  var result = await storageInstance.query(query);
  var documents = result.documents;
  var lastDoc = lastOfArray$1(documents);
  return {
    documents,
    checkpoint: lastDoc ? {
      id: lastDoc[primaryPath],
      lwt: lastDoc._meta.lwt
    } : checkpoint ? checkpoint : {
      id: "",
      lwt: 0
    }
  };
}
function getWrittenDocumentsFromBulkWriteResponse(primaryPath, writeRows, response) {
  var fromMap = BULK_WRITE_SUCCESS_MAP.get(response);
  if (fromMap) {
    return fromMap;
  }
  var ret = [];
  if (response.error.length > 0) {
    var errorIds = /* @__PURE__ */ new Set();
    for (var index = 0; index < response.error.length; index++) {
      var error = response.error[index];
      errorIds.add(error.documentId);
    }
    for (var _index = 0; _index < writeRows.length; _index++) {
      var doc = writeRows[_index].document;
      if (!errorIds.has(doc[primaryPath])) {
        ret.push(stripAttachmentsDataFromDocument(doc));
      }
    }
  } else {
    ret.length = writeRows.length - response.error.length;
    for (var _index2 = 0; _index2 < writeRows.length; _index2++) {
      var _doc = writeRows[_index2].document;
      ret[_index2] = stripAttachmentsDataFromDocument(_doc);
    }
  }
  return ret;
}
function exposeRxStorageRemote(settings) {
  var instanceByFullName = /* @__PURE__ */ new Map();
  settings.messages$.pipe(filter((msg) => msg.method === "custom")).subscribe(async (msg) => {
    if (!settings.customRequestHandler) {
      settings.send(createErrorAnswer(msg, new Error("Remote storage: cannot resolve custom request because settings.customRequestHandler is not set")));
    } else {
      try {
        var result = await settings.customRequestHandler(msg.params);
        settings.send(createAnswer(msg, result));
      } catch (err) {
        settings.send(createErrorAnswer(msg, err));
      }
    }
  });
  function getRxStorageInstance(params) {
    if (settings.storage) {
      return settings.storage.createStorageInstance(params);
    } else if (settings.database) {
      var storageInstances = Array.from(settings.database.storageInstances);
      var collectionName = params.collectionName;
      var storageInstance = storageInstances.find((instance) => instance.collectionName === collectionName);
      if (!storageInstance) {
        console.dir(storageInstances);
        throw new Error("storageInstance does not exist " + JSON.stringify({
          collectionName
        }));
      }
      var schema = params.schema;
      if (!deepEqual(schema, storageInstance.schema)) {
        throw new Error("Wrong schema " + JSON.stringify({
          schema,
          existingSchema: storageInstance.schema
        }));
      }
      return Promise.resolve(storageInstance);
    } else {
      throw new Error("no base given");
    }
  }
  settings.messages$.pipe(filter((msg) => msg.method === "create")).subscribe(async (msg) => {
    var connectionId = msg.connectionId;
    if (Array.isArray(msg.params)) {
      return;
    }
    var params = msg.params;
    var collectionName = params.collectionName;
    var fullName = [params.databaseName, params.collectionName, params.schema.version].join("|");
    var state = instanceByFullName.get(fullName);
    if (!state) {
      try {
        state = {
          /**
           * We work with a promise here to ensure
           * that parallel create-calls will still end up
           * with exactly one instance and not more.
           */
          storageInstancePromise: getRxStorageInstance(params),
          connectionIds: /* @__PURE__ */ new Set(),
          params
        };
        instanceByFullName.set(fullName, state);
        await state.storageInstancePromise;
      } catch (err) {
        settings.send(createErrorAnswer(msg, err));
        return;
      }
    } else {
      if (!deepEqual(params.schema, state.params.schema)) {
        settings.send(createErrorAnswer(msg, new Error("Remote storage: schema not equal to existing storage")));
        return;
      }
    }
    state.connectionIds.add(msg.connectionId);
    var subs = [];
    var storageInstance = await state.storageInstancePromise;
    subs.push(storageInstance.changeStream().subscribe((changes) => {
      var message = {
        connectionId,
        answerTo: "changestream",
        method: "changeStream",
        return: changes
      };
      settings.send(message);
    }));
    subs.push(storageInstance.conflictResultionTasks().subscribe((conflicts) => {
      var message = {
        connectionId,
        answerTo: "conflictResultionTasks",
        method: "conflictResultionTasks",
        return: conflicts
      };
      settings.send(message);
    }));
    var connectionClosed = false;
    function closeThisConnection() {
      if (connectionClosed) {
        return;
      }
      connectionClosed = true;
      subs.forEach((sub) => sub.unsubscribe());
      ensureNotFalsy(state).connectionIds.delete(connectionId);
      instanceByFullName.delete(fullName);
    }
    if (settings.database) {
      var database = settings.database;
      var collection = database.collections[collectionName];
      if (collection) {
        collection.onDestroy.push(() => closeThisConnection());
      } else {
        database.onDestroy.push(() => closeThisConnection());
      }
    }
    subs.push(settings.messages$.pipe(filter((subMsg) => subMsg.connectionId === connectionId)).subscribe(async (plainMessage) => {
      var message = plainMessage;
      if (message.method === "create" || message.method === "custom") {
        return;
      }
      if (!Array.isArray(message.params)) {
        return;
      }
      var result;
      try {
        if (message.method === "close" && settings.database) {
          settings.send(createAnswer(message, null));
          return;
        }
        if (message.method === "close" && ensureNotFalsy(state).connectionIds.size > 1) {
          settings.send(createAnswer(message, null));
          ensureNotFalsy(state).connectionIds.delete(connectionId);
          subs.forEach((sub) => sub.unsubscribe());
          return;
        }
        if (message.method === "getChangedDocumentsSince" && !storageInstance.getChangedDocumentsSince) {
          result = await getChangedDocumentsSince$1(storageInstance, message.params[0], message.params[1]);
        } else {
          result = await storageInstance[message.method](message.params[0], message.params[1], message.params[2], message.params[3]);
        }
        if (message.method === "close" || message.method === "remove") {
          closeThisConnection();
        }
        settings.send(createAnswer(message, result));
      } catch (err) {
        settings.send(createErrorAnswer(message, err));
      }
    }));
    settings.send(createAnswer(msg, "ok"));
  });
  return {
    instanceByFullName
  };
}
function exposeWorkerRxStorage(t) {
  var r2;
  console.log("exposeWorkerRxStorage()");
  var n2 = new Subject();
  if ("undefined" != typeof self && "object" == typeof self.onconnect) {
    var a = /* @__PURE__ */ new Map();
    self.onconnect = (e) => {
      var o = e.ports[0];
      o.onmessage = (e2) => {
        var s2 = e2.data;
        a.set(s2.connectionId, o), n2.next(s2);
      };
    }, r2 = { storage: t.storage, messages$: n2, send(o) {
      getFromMapOrThrow(a, o.connectionId).postMessage(o);
    } };
  } else addEventListener("message", (e) => {
    var o = e.data;
    n2.next(o);
  }), r2 = { storage: t.storage, messages$: n2, send(e) {
    self.postMessage(e);
  } };
  exposeRxStorageRemote(r2);
}
var RxSchema = /* @__PURE__ */ function() {
  function RxSchema2(jsonSchema, hashFunction) {
    this.jsonSchema = jsonSchema;
    this.hashFunction = hashFunction;
    this.indexes = getIndexes(this.jsonSchema);
    this.primaryPath = getPrimaryFieldOfPrimaryKey(this.jsonSchema.primaryKey);
    this.finalFields = getFinalFields(this.jsonSchema);
  }
  var _proto = RxSchema2.prototype;
  _proto.validateChange = function validateChange(dataBefore, dataAfter) {
    this.finalFields.forEach((fieldName) => {
      if (!deepEqual(dataBefore[fieldName], dataAfter[fieldName])) {
        throw newRxError("DOC9", {
          dataBefore,
          dataAfter,
          fieldName,
          schema: this.jsonSchema
        });
      }
    });
  };
  _proto.getDocumentPrototype = function getDocumentPrototype2() {
    var proto = {};
    var pathProperties = getSchemaByObjectPath(this.jsonSchema, "");
    Object.keys(pathProperties).forEach((key) => {
      var fullPath = key;
      proto.__defineGetter__(key, function() {
        if (!this.get || typeof this.get !== "function") {
          return void 0;
        }
        var ret = this.get(fullPath);
        return ret;
      });
      Object.defineProperty(proto, key + "$", {
        get: function() {
          return this.get$(fullPath);
        },
        enumerable: false,
        configurable: false
      });
      Object.defineProperty(proto, key + "$$", {
        get: function() {
          return this.get$$(fullPath);
        },
        enumerable: false,
        configurable: false
      });
      Object.defineProperty(proto, key + "_", {
        get: function() {
          return this.populate(fullPath);
        },
        enumerable: false,
        configurable: false
      });
    });
    overwriteGetterForCaching(this, "getDocumentPrototype", () => proto);
    return proto;
  };
  _proto.getPrimaryOfDocumentData = function getPrimaryOfDocumentData(documentData) {
    return getComposedPrimaryKeyOfDocumentData(this.jsonSchema, documentData);
  };
  return _createClass(RxSchema2, [{
    key: "version",
    get: function() {
      return this.jsonSchema.version;
    }
  }, {
    key: "defaultValues",
    get: function() {
      var values = {};
      Object.entries(this.jsonSchema.properties).filter(([, v]) => Object.prototype.hasOwnProperty.call(v, "default")).forEach(([k2, v]) => values[k2] = v.default);
      return overwriteGetterForCaching(this, "defaultValues", values);
    }
    /**
     * @overrides itself on the first call
     *
     * TODO this should be a pure function that
     * caches the hash in a WeakMap.
     */
  }, {
    key: "hash",
    get: function() {
      return overwriteGetterForCaching(this, "hash", this.hashFunction(JSON.stringify(this.jsonSchema)));
    }
  }]);
}();
function getIndexes(jsonSchema) {
  return (jsonSchema.indexes || []).map((index) => isMaybeReadonlyArray(index) ? index : [index]);
}
function getPreviousVersions(schema) {
  var version = schema.version ? schema.version : 0;
  var c2 = 0;
  return new Array(version).fill(0).map(() => c2++);
}
function createRxSchema(jsonSchema, hashFunction, runPreCreateHooks = true) {
  if (runPreCreateHooks) {
    runPluginHooks("preCreateRxSchema", jsonSchema);
  }
  var useJsonSchema = fillWithDefaultSettings(jsonSchema);
  useJsonSchema = normalizeRxJsonSchema(useJsonSchema);
  overwritable.deepFreezeWhenDevMode(useJsonSchema);
  var schema = new RxSchema(useJsonSchema, hashFunction);
  runPluginHooks("createRxSchema", schema);
  return schema;
}
var IncrementalWriteQueue = /* @__PURE__ */ function() {
  function IncrementalWriteQueue2(storageInstance, primaryPath, preWrite, postWrite) {
    this.queueByDocId = /* @__PURE__ */ new Map();
    this.isRunning = false;
    this.storageInstance = storageInstance;
    this.primaryPath = primaryPath;
    this.preWrite = preWrite;
    this.postWrite = postWrite;
  }
  var _proto = IncrementalWriteQueue2.prototype;
  _proto.addWrite = function addWrite(lastKnownDocumentState, modifier) {
    var docId = lastKnownDocumentState[this.primaryPath];
    var ar = getFromMapOrCreate(this.queueByDocId, docId, () => []);
    var ret = new Promise((resolve2, reject) => {
      var item = {
        lastKnownDocumentState,
        modifier,
        resolve: resolve2,
        reject
      };
      ensureNotFalsy(ar).push(item);
      this.triggerRun();
    });
    return ret;
  };
  _proto.triggerRun = async function triggerRun() {
    if (this.isRunning === true || this.queueByDocId.size === 0) {
      return;
    }
    this.isRunning = true;
    var writeRows = [];
    var itemsById = this.queueByDocId;
    this.queueByDocId = /* @__PURE__ */ new Map();
    await Promise.all(Array.from(itemsById.entries()).map(async ([_docId, items]) => {
      var oldData = findNewestOfDocumentStates(items.map((i) => i.lastKnownDocumentState));
      var newData = oldData;
      for (var item of items) {
        try {
          newData = await item.modifier(
            /**
             * We have to clone() each time because the modifier
             * might throw while it already changed some properties
             * of the document.
             */
            clone$1(newData)
          );
        } catch (err) {
          item.reject(err);
          item.reject = () => {
          };
          item.resolve = () => {
          };
        }
      }
      try {
        await this.preWrite(newData, oldData);
      } catch (err) {
        items.forEach((item2) => item2.reject(err));
        return;
      }
      writeRows.push({
        previous: oldData,
        document: newData
      });
    }));
    var writeResult = writeRows.length > 0 ? await this.storageInstance.bulkWrite(writeRows, "incremental-write") : {
      error: []
    };
    await Promise.all(getWrittenDocumentsFromBulkWriteResponse(this.primaryPath, writeRows, writeResult).map((result) => {
      var docId = result[this.primaryPath];
      this.postWrite(result);
      var items = getFromMapOrThrow(itemsById, docId);
      items.forEach((item) => item.resolve(result));
    }));
    writeResult.error.forEach((error) => {
      var docId = error.documentId;
      var items = getFromMapOrThrow(itemsById, docId);
      var isConflict = isBulkWriteConflictError(error);
      if (isConflict) {
        var ar = getFromMapOrCreate(this.queueByDocId, docId, () => []);
        items.reverse().forEach((item) => {
          item.lastKnownDocumentState = ensureNotFalsy(isConflict.documentInDb);
          ensureNotFalsy(ar).unshift(item);
        });
      } else {
        var rxError = rxStorageWriteErrorToRxError(error);
        items.forEach((item) => item.reject(rxError));
      }
    });
    this.isRunning = false;
    return this.triggerRun();
  };
  return IncrementalWriteQueue2;
}();
function modifierFromPublicToInternal(publicModifier) {
  var ret = async (docData) => {
    var withoutMeta = stripMetaDataFromDocument(docData);
    withoutMeta._deleted = docData._deleted;
    var modified = await publicModifier(withoutMeta);
    var reattachedMeta = Object.assign({}, modified, {
      _meta: docData._meta,
      _attachments: docData._attachments,
      _rev: docData._rev,
      _deleted: typeof modified._deleted !== "undefined" ? modified._deleted : docData._deleted
    });
    if (typeof reattachedMeta._deleted === "undefined") {
      reattachedMeta._deleted = false;
    }
    return reattachedMeta;
  };
  return ret;
}
function findNewestOfDocumentStates(docs) {
  var newest = docs[0];
  var newestRevisionHeight = getHeightOfRevision(newest._rev);
  docs.forEach((doc) => {
    var height = getHeightOfRevision(doc._rev);
    if (height > newestRevisionHeight) {
      newest = doc;
      newestRevisionHeight = height;
    }
  });
  return newest;
}
var basePrototype = {
  get primaryPath() {
    var _this = this;
    if (!_this.isInstanceOfRxDocument) {
      return void 0;
    }
    return _this.collection.schema.primaryPath;
  },
  get primary() {
    var _this = this;
    if (!_this.isInstanceOfRxDocument) {
      return void 0;
    }
    return _this._data[_this.primaryPath];
  },
  get revision() {
    var _this = this;
    if (!_this.isInstanceOfRxDocument) {
      return void 0;
    }
    return _this._data._rev;
  },
  get deleted$() {
    var _this = this;
    if (!_this.isInstanceOfRxDocument) {
      return void 0;
    }
    return _this.$.pipe(map((d) => d._data._deleted));
  },
  get deleted$$() {
    var _this = this;
    var reactivity = _this.collection.database.getReactivityFactory();
    return reactivity.fromObservable(_this.deleted$, _this.getLatest().deleted, _this.collection.database);
  },
  get deleted() {
    var _this = this;
    if (!_this.isInstanceOfRxDocument) {
      return void 0;
    }
    return _this._data._deleted;
  },
  getLatest() {
    var latestDocData = this.collection._docCache.getLatestDocumentData(this.primary);
    return this.collection._docCache.getCachedRxDocument(latestDocData);
  },
  /**
   * returns the observable which emits the plain-data of this document
   */
  get $() {
    var _this = this;
    return _this.collection.$.pipe(filter((changeEvent) => !changeEvent.isLocal), filter((changeEvent) => changeEvent.documentId === this.primary), map((changeEvent) => getDocumentDataOfRxChangeEvent(changeEvent)), startWith(_this.collection._docCache.getLatestDocumentData(this.primary)), distinctUntilChanged((prev, curr) => prev._rev === curr._rev), map((docData) => this.collection._docCache.getCachedRxDocument(docData)), shareReplay(RXJS_SHARE_REPLAY_DEFAULTS));
  },
  get $$() {
    var _this = this;
    var reactivity = _this.collection.database.getReactivityFactory();
    return reactivity.fromObservable(_this.$, _this.getLatest()._data, _this.collection.database);
  },
  /**
   * returns observable of the value of the given path
   */
  get$(path) {
    if (overwritable.isDevMode()) {
      if (path.includes(".item.")) {
        throw newRxError("DOC1", {
          path
        });
      }
      if (path === this.primaryPath) {
        throw newRxError("DOC2");
      }
      if (this.collection.schema.finalFields.includes(path)) {
        throw newRxError("DOC3", {
          path
        });
      }
      var schemaObj = getSchemaByObjectPath(this.collection.schema.jsonSchema, path);
      if (!schemaObj) {
        throw newRxError("DOC4", {
          path
        });
      }
    }
    return this.$.pipe(map((data) => getProperty$1(data, path)), distinctUntilChanged());
  },
  get$$(path) {
    var obs = this.get$(path);
    var reactivity = this.collection.database.getReactivityFactory();
    return reactivity.fromObservable(obs, this.getLatest().get(path), this.collection.database);
  },
  /**
   * populate the given path
   */
  populate(path) {
    var schemaObj = getSchemaByObjectPath(this.collection.schema.jsonSchema, path);
    var value = this.get(path);
    if (!value) {
      return PROMISE_RESOLVE_NULL;
    }
    if (!schemaObj) {
      throw newRxError("DOC5", {
        path
      });
    }
    if (!schemaObj.ref) {
      throw newRxError("DOC6", {
        path,
        schemaObj
      });
    }
    var refCollection = this.collection.database.collections[schemaObj.ref];
    if (!refCollection) {
      throw newRxError("DOC7", {
        ref: schemaObj.ref,
        path,
        schemaObj
      });
    }
    if (schemaObj.type === "array") {
      return refCollection.findByIds(value).exec().then((res) => {
        var valuesIterator = res.values();
        return Array.from(valuesIterator);
      });
    } else {
      return refCollection.findOne(value).exec();
    }
  },
  /**
   * get data by objectPath
   * @hotPath Performance here is really important,
   * run some tests before changing anything.
   */
  get(objPath) {
    return getDocumentProperty(this, objPath);
  },
  toJSON(withMetaFields = false) {
    if (!withMetaFields) {
      var data = flatClone(this._data);
      delete data._rev;
      delete data._attachments;
      delete data._deleted;
      delete data._meta;
      return overwritable.deepFreezeWhenDevMode(data);
    } else {
      return overwritable.deepFreezeWhenDevMode(this._data);
    }
  },
  toMutableJSON(withMetaFields = false) {
    return clone$1(this.toJSON(withMetaFields));
  },
  /**
   * updates document
   * @overwritten by plugin (optional)
   * @param updateObj mongodb-like syntax
   */
  update(_updateObj) {
    throw pluginMissing("update");
  },
  incrementalUpdate(_updateObj) {
    throw pluginMissing("update");
  },
  updateCRDT(_updateObj) {
    throw pluginMissing("crdt");
  },
  putAttachment() {
    throw pluginMissing("attachments");
  },
  getAttachment() {
    throw pluginMissing("attachments");
  },
  allAttachments() {
    throw pluginMissing("attachments");
  },
  get allAttachments$() {
    throw pluginMissing("attachments");
  },
  async modify(mutationFunction, _context) {
    var oldData = this._data;
    var newData = await modifierFromPublicToInternal(mutationFunction)(oldData);
    return this._saveData(newData, oldData);
  },
  /**
   * runs an incremental update over the document
   * @param function that takes the document-data and returns a new data-object
   */
  incrementalModify(mutationFunction, _context) {
    return this.collection.incrementalWriteQueue.addWrite(this._data, modifierFromPublicToInternal(mutationFunction)).then((result) => this.collection._docCache.getCachedRxDocument(result));
  },
  patch(patch) {
    var oldData = this._data;
    var newData = clone$1(oldData);
    Object.entries(patch).forEach(([k2, v]) => {
      newData[k2] = v;
    });
    return this._saveData(newData, oldData);
  },
  /**
   * patches the given properties
   */
  incrementalPatch(patch) {
    return this.incrementalModify((docData) => {
      Object.entries(patch).forEach(([k2, v]) => {
        docData[k2] = v;
      });
      return docData;
    });
  },
  /**
   * saves the new document-data
   * and handles the events
   */
  async _saveData(newData, oldData) {
    newData = flatClone(newData);
    if (this._data._deleted) {
      throw newRxError("DOC11", {
        id: this.primary,
        document: this
      });
    }
    await beforeDocumentUpdateWrite(this.collection, newData, oldData);
    var writeRows = [{
      previous: oldData,
      document: newData
    }];
    var writeResult = await this.collection.storageInstance.bulkWrite(writeRows, "rx-document-save-data");
    var isError = writeResult.error[0];
    throwIfIsStorageWriteError(this.collection, this.primary, newData, isError);
    await this.collection._runHooks("post", "save", newData, this);
    return this.collection._docCache.getCachedRxDocument(getWrittenDocumentsFromBulkWriteResponse(this.collection.schema.primaryPath, writeRows, writeResult)[0]);
  },
  /**
   * Remove the document.
   * Notice that there is no hard delete,
   * instead deleted documents get flagged with _deleted=true.
   */
  remove() {
    var collection = this.collection;
    if (this.deleted) {
      return Promise.reject(newRxError("DOC13", {
        document: this,
        id: this.primary
      }));
    }
    var deletedData = flatClone(this._data);
    var removedDocData;
    return collection._runHooks("pre", "remove", deletedData, this).then(async () => {
      deletedData._deleted = true;
      var writeRows = [{
        previous: this._data,
        document: deletedData
      }];
      var writeResult = await collection.storageInstance.bulkWrite(writeRows, "rx-document-remove");
      var isError = writeResult.error[0];
      throwIfIsStorageWriteError(collection, this.primary, deletedData, isError);
      return getWrittenDocumentsFromBulkWriteResponse(this.collection.schema.primaryPath, writeRows, writeResult)[0];
    }).then((removed) => {
      removedDocData = removed;
      return this.collection._runHooks("post", "remove", deletedData, this);
    }).then(() => {
      return this.collection._docCache.getCachedRxDocument(removedDocData);
    });
  },
  incrementalRemove() {
    return this.incrementalModify(async (docData) => {
      await this.collection._runHooks("pre", "remove", docData, this);
      docData._deleted = true;
      return docData;
    }).then(async (newDoc) => {
      await this.collection._runHooks("post", "remove", newDoc._data, newDoc);
      return newDoc;
    });
  },
  destroy() {
    throw newRxError("DOC14");
  }
};
function createRxDocumentConstructor(proto = basePrototype) {
  var constructor = function RxDocumentConstructor(collection, docData) {
    this.collection = collection;
    this._data = docData;
    this._propertyCache = /* @__PURE__ */ new Map();
    this.isInstanceOfRxDocument = true;
  };
  constructor.prototype = proto;
  return constructor;
}
function createWithConstructor(constructor, collection, jsonData) {
  var doc = new constructor(collection, jsonData);
  runPluginHooks("createRxDocument", doc);
  return doc;
}
function beforeDocumentUpdateWrite(collection, newData, oldData) {
  newData._meta = Object.assign({}, oldData._meta, newData._meta);
  if (overwritable.isDevMode()) {
    collection.schema.validateChange(oldData, newData);
  }
  return collection._runHooks("pre", "save", newData, oldData);
}
function getDocumentProperty(doc, objPath) {
  return getFromMapOrCreate(doc._propertyCache, objPath, () => {
    var valueObj = getProperty$1(doc._data, objPath);
    if (typeof valueObj !== "object" || valueObj === null || Array.isArray(valueObj)) {
      return overwritable.deepFreezeWhenDevMode(valueObj);
    }
    var proxy = new Proxy(
      /**
       * In dev-mode, the _data is deep-frozen
       * so we have to flat clone here so that
       * the proxy can work.
       */
      flatClone(valueObj),
      {
        /**
         * @performance is really important here
         * because people access nested properties very often
         * and might not be aware that this is internally using a Proxy
         */
        get(target, property) {
          if (typeof property !== "string") {
            return target[property];
          }
          var lastChar = property.charAt(property.length - 1);
          if (lastChar === "$") {
            if (property.endsWith("$$")) {
              var key = property.slice(0, -2);
              return doc.get$$(trimDots(objPath + "." + key));
            } else {
              var _key = property.slice(0, -1);
              return doc.get$(trimDots(objPath + "." + _key));
            }
          } else if (lastChar === "_") {
            var _key2 = property.slice(0, -1);
            return doc.populate(trimDots(objPath + "." + _key2));
          } else {
            var plainValue = target[property];
            if (typeof plainValue === "number" || typeof plainValue === "string" || typeof plainValue === "boolean") {
              return plainValue;
            }
            return getDocumentProperty(doc, trimDots(objPath + "." + property));
          }
        }
      }
    );
    return proxy;
  });
}
var INTERNAL_CONTEXT_COLLECTION = "collection";
var INTERNAL_CONTEXT_STORAGE_TOKEN = "storage-token";
var INTERNAL_CONTEXT_MIGRATION_STATUS = "rx-migration-status";
var INTERNAL_STORE_SCHEMA_TITLE = "RxInternalDocument";
var INTERNAL_STORE_SCHEMA = fillWithDefaultSettings({
  version: 0,
  title: INTERNAL_STORE_SCHEMA_TITLE,
  primaryKey: {
    key: "id",
    fields: ["context", "key"],
    separator: "|"
  },
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 200
    },
    key: {
      type: "string"
    },
    context: {
      type: "string",
      enum: [INTERNAL_CONTEXT_COLLECTION, INTERNAL_CONTEXT_STORAGE_TOKEN, INTERNAL_CONTEXT_MIGRATION_STATUS, "OTHER"]
    },
    data: {
      type: "object",
      additionalProperties: true
    }
  },
  indexes: [],
  required: ["key", "context", "data"],
  additionalProperties: false,
  /**
   * If the sharding plugin is used,
   * it must not shard on the internal RxStorageInstance
   * because that one anyway has only a small amount of documents
   * and also its creation is in the hot path of the initial page load,
   * so we should spend less time creating multiple RxStorageInstances.
   */
  sharding: {
    shards: 1,
    mode: "collection"
  }
});
function getPrimaryKeyOfInternalDocument(key, context) {
  return getComposedPrimaryKeyOfDocumentData(INTERNAL_STORE_SCHEMA, {
    key,
    context
  });
}
async function getAllCollectionDocuments(storageInstance) {
  var getAllQueryPrepared = prepareQuery(storageInstance.schema, {
    selector: {
      context: INTERNAL_CONTEXT_COLLECTION,
      _deleted: {
        $eq: false
      }
    },
    sort: [{
      id: "asc"
    }],
    skip: 0
  });
  var queryResult = await storageInstance.query(getAllQueryPrepared);
  var allDocs = queryResult.documents;
  return allDocs;
}
var STORAGE_TOKEN_DOCUMENT_KEY = "storageToken";
var STORAGE_TOKEN_DOCUMENT_ID = getPrimaryKeyOfInternalDocument(STORAGE_TOKEN_DOCUMENT_KEY, INTERNAL_CONTEXT_STORAGE_TOKEN);
async function ensureStorageTokenDocumentExists(rxDatabase) {
  var storageToken = randomCouchString(10);
  var passwordHash = rxDatabase.password ? await rxDatabase.hashFunction(JSON.stringify(rxDatabase.password)) : void 0;
  var docData = {
    id: STORAGE_TOKEN_DOCUMENT_ID,
    context: INTERNAL_CONTEXT_STORAGE_TOKEN,
    key: STORAGE_TOKEN_DOCUMENT_KEY,
    data: {
      rxdbVersion: rxDatabase.rxdbVersion,
      token: storageToken,
      /**
       * We add the instance token here
       * to be able to detect if a given RxDatabase instance
       * is the first instance that was ever created
       * or if databases have existed earlier on that storage
       * with the same database name.
       */
      instanceToken: rxDatabase.token,
      passwordHash
    },
    _deleted: false,
    _meta: getDefaultRxDocumentMeta(),
    _rev: getDefaultRevision(),
    _attachments: {}
  };
  var writeRows = [{
    document: docData
  }];
  var writeResult = await rxDatabase.internalStore.bulkWrite(writeRows, "internal-add-storage-token");
  if (!writeResult.error[0]) {
    return getWrittenDocumentsFromBulkWriteResponse("id", writeRows, writeResult)[0];
  }
  var error = ensureNotFalsy(writeResult.error[0]);
  if (error.isError && isBulkWriteConflictError(error)) {
    var conflictError = error;
    if (!isDatabaseStateVersionCompatibleWithDatabaseCode(conflictError.documentInDb.data.rxdbVersion, rxDatabase.rxdbVersion)) {
      throw newRxError("DM5", {
        args: {
          database: rxDatabase.name,
          databaseStateVersion: conflictError.documentInDb.data.rxdbVersion,
          codeVersion: rxDatabase.rxdbVersion
        }
      });
    }
    if (passwordHash && passwordHash !== conflictError.documentInDb.data.passwordHash) {
      throw newRxError("DB1", {
        passwordHash,
        existingPasswordHash: conflictError.documentInDb.data.passwordHash
      });
    }
    var storageTokenDocInDb = conflictError.documentInDb;
    return ensureNotFalsy(storageTokenDocInDb);
  }
  throw error;
}
function isDatabaseStateVersionCompatibleWithDatabaseCode(databaseStateVersion, codeVersion) {
  if (!databaseStateVersion) {
    return false;
  }
  if (codeVersion.includes("beta") && codeVersion !== databaseStateVersion) {
    return false;
  }
  var stateMajor = databaseStateVersion.split(".")[0];
  var codeMajor = codeVersion.split(".")[0];
  if (stateMajor !== codeMajor) {
    return false;
  }
  return true;
}
async function addConnectedStorageToCollection(collection, storageCollectionName, schema) {
  if (collection.schema.version !== schema.version) {
    throw newRxError("SNH", {
      schema,
      version: collection.schema.version,
      name: collection.name,
      collection,
      args: {
        storageCollectionName
      }
    });
  }
  var collectionNameWithVersion = _collectionNamePrimary(collection.name, collection.schema.jsonSchema);
  var collectionDocId = getPrimaryKeyOfInternalDocument(collectionNameWithVersion, INTERNAL_CONTEXT_COLLECTION);
  while (true) {
    var collectionDoc = await getSingleDocument(collection.database.internalStore, collectionDocId);
    var saveData = clone$1(ensureNotFalsy(collectionDoc));
    var alreadyThere = saveData.data.connectedStorages.find((row) => row.collectionName === storageCollectionName && row.schema.version === schema.version);
    if (alreadyThere) {
      return;
    }
    saveData.data.connectedStorages.push({
      collectionName: storageCollectionName,
      schema
    });
    try {
      await writeSingle(collection.database.internalStore, {
        previous: ensureNotFalsy(collectionDoc),
        document: saveData
      }, "add-connected-storage-to-collection");
    } catch (err) {
      if (!isBulkWriteConflictError(err)) {
        throw err;
      }
    }
  }
}
function _collectionNamePrimary(name, schema) {
  return name + "-" + schema.version;
}
function fillObjectDataBeforeInsert(schema, data) {
  data = flatClone(data);
  data = fillObjectWithDefaults(schema, data);
  if (typeof schema.jsonSchema.primaryKey !== "string") {
    data = fillPrimaryKey(schema.primaryPath, schema.jsonSchema, data);
  }
  data._meta = getDefaultRxDocumentMeta();
  if (!Object.prototype.hasOwnProperty.call(data, "_deleted")) {
    data._deleted = false;
  }
  if (!Object.prototype.hasOwnProperty.call(data, "_attachments")) {
    data._attachments = {};
  }
  if (!Object.prototype.hasOwnProperty.call(data, "_rev")) {
    data._rev = getDefaultRevision();
  }
  return data;
}
async function createRxCollectionStorageInstance(rxDatabase, storageInstanceCreationParams) {
  storageInstanceCreationParams.multiInstance = rxDatabase.multiInstance;
  var storageInstance = await rxDatabase.storage.createStorageInstance(storageInstanceCreationParams);
  return storageInstance;
}
async function removeCollectionStorages(storage2, databaseInternalStorage, databaseInstanceToken, databaseName, collectionName, password, hashFunction) {
  var allCollectionMetaDocs = await getAllCollectionDocuments(databaseInternalStorage);
  var relevantCollectionMetaDocs = allCollectionMetaDocs.filter((metaDoc) => metaDoc.data.name === collectionName);
  var removeStorages = [];
  relevantCollectionMetaDocs.forEach((metaDoc) => {
    removeStorages.push({
      collectionName: metaDoc.data.name,
      schema: metaDoc.data.schema,
      isCollection: true
    });
    metaDoc.data.connectedStorages.forEach((row) => removeStorages.push({
      collectionName: row.collectionName,
      isCollection: false,
      schema: row.schema
    }));
  });
  var alreadyAdded = /* @__PURE__ */ new Set();
  removeStorages = removeStorages.filter((row) => {
    var key = row.collectionName + "||" + row.schema.version;
    if (alreadyAdded.has(key)) {
      return false;
    } else {
      alreadyAdded.add(key);
      return true;
    }
  });
  await Promise.all(removeStorages.map(async (row) => {
    var storageInstance = await storage2.createStorageInstance({
      collectionName: row.collectionName,
      databaseInstanceToken,
      databaseName,
      multiInstance: false,
      options: {},
      schema: row.schema,
      password,
      devMode: overwritable.isDevMode()
    });
    await storageInstance.remove();
    if (row.isCollection) {
      await runAsyncPluginHooks("postRemoveRxCollection", {
        storage: storage2,
        databaseName,
        collectionName
      });
    }
  }));
  if (hashFunction) {
    var writeRows = relevantCollectionMetaDocs.map((doc) => {
      var writeDoc = flatCloneDocWithMeta(doc);
      writeDoc._deleted = true;
      writeDoc._meta.lwt = now$1();
      writeDoc._rev = createRevision(databaseInstanceToken, doc);
      return {
        previous: doc,
        document: writeDoc
      };
    });
    await databaseInternalStorage.bulkWrite(writeRows, "rx-database-remove-collection-all");
  }
}
function ensureRxCollectionIsNotDestroyed(collection) {
  if (collection.destroyed) {
    throw newRxError("COL21", {
      collection: collection.name,
      version: collection.schema.version
    });
  }
}
var ChangeEventBuffer = /* @__PURE__ */ function() {
  function ChangeEventBuffer2(collection) {
    this.subs = [];
    this.counter = 0;
    this.eventCounterMap = /* @__PURE__ */ new WeakMap();
    this.buffer = [];
    this.limit = 100;
    this.tasks = /* @__PURE__ */ new Set();
    this.collection = collection;
    this.subs.push(this.collection.database.eventBulks$.pipe(filter((changeEventBulk) => changeEventBulk.collectionName === this.collection.name), filter((bulk) => {
      var first = bulk.events[0];
      return !first.isLocal;
    })).subscribe((eventBulk) => {
      this.tasks.add(() => this._handleChangeEvents(eventBulk.events));
      if (this.tasks.size <= 1) {
        requestIdlePromiseNoQueue().then(() => {
          this.processTasks();
        });
      }
    }));
  }
  var _proto = ChangeEventBuffer2.prototype;
  _proto.processTasks = function processTasks() {
    if (this.tasks.size === 0) {
      return;
    }
    var tasks = Array.from(this.tasks);
    tasks.forEach((task) => task());
    this.tasks.clear();
  };
  _proto._handleChangeEvents = function _handleChangeEvents(events) {
    var counterBefore = this.counter;
    this.counter = this.counter + events.length;
    if (events.length > this.limit) {
      this.buffer = events.slice(events.length * -1);
    } else {
      appendToArray(this.buffer, events);
      this.buffer = this.buffer.slice(this.limit * -1);
    }
    var counterBase = counterBefore + 1;
    var eventCounterMap = this.eventCounterMap;
    for (var index = 0; index < events.length; index++) {
      var event = events[index];
      eventCounterMap.set(event, counterBase + index);
    }
  };
  _proto.getCounter = function getCounter() {
    this.processTasks();
    return this.counter;
  };
  _proto.getBuffer = function getBuffer() {
    this.processTasks();
    return this.buffer;
  };
  _proto.getArrayIndexByPointer = function getArrayIndexByPointer(pointer) {
    this.processTasks();
    var oldestEvent = this.buffer[0];
    var oldestCounter = this.eventCounterMap.get(oldestEvent);
    if (pointer < oldestCounter) return null;
    var rest = pointer - oldestCounter;
    return rest;
  };
  _proto.getFrom = function getFrom(pointer) {
    this.processTasks();
    var ret = [];
    var currentIndex = this.getArrayIndexByPointer(pointer);
    if (currentIndex === null)
      return null;
    while (true) {
      var nextEvent = this.buffer[currentIndex];
      currentIndex++;
      if (!nextEvent) {
        return ret;
      } else {
        ret.push(nextEvent);
      }
    }
  };
  _proto.runFrom = function runFrom(pointer, fn) {
    this.processTasks();
    var ret = this.getFrom(pointer);
    if (ret === null) {
      throw new Error("out of bounds");
    } else {
      ret.forEach((cE) => fn(cE));
    }
  };
  _proto.reduceByLastOfDoc = function reduceByLastOfDoc(changeEvents) {
    this.processTasks();
    return changeEvents.slice(0);
  };
  _proto.destroy = function destroy() {
    this.tasks.clear();
    this.subs.forEach((sub) => sub.unsubscribe());
  };
  return ChangeEventBuffer2;
}();
function createChangeEventBuffer(collection) {
  return new ChangeEventBuffer(collection);
}
var constructorForCollection = /* @__PURE__ */ new WeakMap();
function getDocumentPrototype(rxCollection) {
  var schemaProto = rxCollection.schema.getDocumentPrototype();
  var ormProto = getDocumentOrmPrototype(rxCollection);
  var baseProto = basePrototype;
  var proto = {};
  [schemaProto, ormProto, baseProto].forEach((obj) => {
    var props = Object.getOwnPropertyNames(obj);
    props.forEach((key) => {
      var desc = Object.getOwnPropertyDescriptor(obj, key);
      var enumerable = true;
      if (key.startsWith("_") || key.endsWith("_") || key.startsWith("$") || key.endsWith("$")) enumerable = false;
      if (typeof desc.value === "function") {
        Object.defineProperty(proto, key, {
          get() {
            return desc.value.bind(this);
          },
          enumerable,
          configurable: false
        });
      } else {
        desc.enumerable = enumerable;
        desc.configurable = false;
        if (desc.writable) desc.writable = false;
        Object.defineProperty(proto, key, desc);
      }
    });
  });
  return proto;
}
function getRxDocumentConstructor(rxCollection) {
  return getFromMapOrCreate(constructorForCollection, rxCollection, () => createRxDocumentConstructor(getDocumentPrototype(rxCollection)));
}
function createNewRxDocument(rxCollection, documentConstructor, docData) {
  var doc = createWithConstructor(documentConstructor, rxCollection, overwritable.deepFreezeWhenDevMode(docData));
  rxCollection._runHooksSync("post", "create", docData, doc);
  runPluginHooks("postCreateRxDocument", doc);
  return doc;
}
function getDocumentOrmPrototype(rxCollection) {
  var proto = {};
  Object.entries(rxCollection.methods).forEach(([k2, v]) => {
    proto[k2] = v;
  });
  return proto;
}
async function getLastCheckpointDoc(state, direction) {
  var checkpointDocId = getComposedPrimaryKeyOfDocumentData(state.input.metaInstance.schema, {
    isCheckpoint: "1",
    itemId: direction
  });
  var checkpointResult = await state.input.metaInstance.findDocumentsById([checkpointDocId], false);
  var checkpointDoc = checkpointResult[0];
  state.lastCheckpointDoc[direction] = checkpointDoc;
  if (checkpointDoc) {
    return checkpointDoc.checkpointData;
  } else {
    return void 0;
  }
}
async function setCheckpoint(state, direction, checkpoint) {
  state.checkpointQueue = state.checkpointQueue.then(async () => {
    var previousCheckpointDoc = state.lastCheckpointDoc[direction];
    if (checkpoint && /**
     * If the replication is already canceled,
     * we do not write a checkpoint
     * because that could mean we write a checkpoint
     * for data that has been fetched from the master
     * but not been written to the child.
     */
    !state.events.canceled.getValue() && /**
     * Only write checkpoint if it is different from before
     * to have less writes to the storage.
     */
    (!previousCheckpointDoc || JSON.stringify(previousCheckpointDoc.checkpointData) !== JSON.stringify(checkpoint))) {
      var newDoc = {
        id: "",
        isCheckpoint: "1",
        itemId: direction,
        _deleted: false,
        _attachments: {},
        checkpointData: checkpoint,
        _meta: getDefaultRxDocumentMeta(),
        _rev: getDefaultRevision()
      };
      newDoc.id = getComposedPrimaryKeyOfDocumentData(state.input.metaInstance.schema, newDoc);
      while (!state.events.canceled.getValue()) {
        if (previousCheckpointDoc) {
          newDoc.checkpointData = stackCheckpoints([previousCheckpointDoc.checkpointData, newDoc.checkpointData]);
        }
        newDoc._meta.lwt = now$1();
        newDoc._rev = createRevision(await state.checkpointKey, previousCheckpointDoc);
        if (state.events.canceled.getValue()) {
          return;
        }
        var writeRows = [{
          previous: previousCheckpointDoc,
          document: newDoc
        }];
        var result = await state.input.metaInstance.bulkWrite(writeRows, "replication-set-checkpoint");
        var successDoc = getWrittenDocumentsFromBulkWriteResponse(state.primaryPath, writeRows, result)[0];
        if (successDoc) {
          state.lastCheckpointDoc[direction] = successDoc;
          return;
        } else {
          var error = result.error[0];
          if (error.status !== 409) {
            throw error;
          } else {
            previousCheckpointDoc = ensureNotFalsy(error.documentInDb);
            newDoc._rev = createRevision(await state.checkpointKey, previousCheckpointDoc);
          }
        }
      }
    }
  });
  await state.checkpointQueue;
}
async function getCheckpointKey(input) {
  var hash = await input.hashFunction([input.identifier, input.forkInstance.databaseName, input.forkInstance.collectionName].join("||"));
  return "rx_storage_replication_" + hash;
}
function docStateToWriteDoc(databaseInstanceToken, hasAttachments, keepMeta, docState, previous) {
  var docData = Object.assign({}, docState, {
    _attachments: hasAttachments && docState._attachments ? docState._attachments : {},
    _meta: keepMeta ? docState._meta : Object.assign({}, previous ? previous._meta : {}, {
      lwt: now$1()
    }),
    _rev: keepMeta ? docState._rev : getDefaultRevision()
  });
  if (!docData._rev) {
    docData._rev = createRevision(databaseInstanceToken, previous);
  }
  return docData;
}
function writeDocToDocState(writeDoc, keepAttachments, keepMeta) {
  var ret = flatClone(writeDoc);
  if (!keepAttachments) {
    delete ret._attachments;
  }
  if (!keepMeta) {
    delete ret._meta;
    delete ret._rev;
  }
  return ret;
}
function stripAttachmentsDataFromMetaWriteRows(state, rows) {
  if (!state.hasAttachments) {
    return rows;
  }
  return rows.map((row) => {
    var document2 = clone$1(row.document);
    document2.docData = stripAttachmentsDataFromDocument(document2.docData);
    return {
      document: document2,
      previous: row.previous
    };
  });
}
function getUnderlyingPersistentStorage(instance) {
  while (true) {
    if (instance.underlyingPersistentStorage) {
      instance = instance.underlyingPersistentStorage;
    } else {
      return instance;
    }
  }
}
var META_INSTANCE_SCHEMA_TITLE = "RxReplicationProtocolMetaData";
function getRxReplicationMetaInstanceSchema(replicatedDocumentsSchema, encrypted) {
  var parentPrimaryKeyLength = getLengthOfPrimaryKey(replicatedDocumentsSchema);
  var baseSchema = {
    title: META_INSTANCE_SCHEMA_TITLE,
    primaryKey: {
      key: "id",
      fields: ["itemId", "isCheckpoint"],
      separator: "|"
    },
    type: "object",
    version: replicatedDocumentsSchema.version,
    additionalProperties: false,
    properties: {
      id: {
        type: "string",
        minLength: 1,
        // add +1 for the '|' and +1 for the 'isCheckpoint' flag
        maxLength: parentPrimaryKeyLength + 2
      },
      isCheckpoint: {
        type: "string",
        enum: ["0", "1"],
        minLength: 1,
        maxLength: 1
      },
      itemId: {
        type: "string",
        /**
         * ensure that all values of RxStorageReplicationDirection ('DOWN' has 4 chars) fit into it
         * because checkpoints use the itemId field for that.
         */
        maxLength: parentPrimaryKeyLength > 4 ? parentPrimaryKeyLength : 4
      },
      checkpointData: {
        type: "object",
        additionalProperties: true
      },
      docData: {
        type: "object",
        properties: replicatedDocumentsSchema.properties
      },
      isResolvedConflict: {
        type: "string"
      }
    },
    keyCompression: replicatedDocumentsSchema.keyCompression,
    required: ["id", "isCheckpoint", "itemId"]
  };
  if (encrypted) {
    baseSchema.encrypted = ["docData"];
  }
  var metaInstanceSchema = fillWithDefaultSettings(baseSchema);
  return metaInstanceSchema;
}
function getAssumedMasterState(state, docIds) {
  return state.input.metaInstance.findDocumentsById(docIds.map((docId) => {
    var useId = getComposedPrimaryKeyOfDocumentData(state.input.metaInstance.schema, {
      itemId: docId,
      isCheckpoint: "0"
    });
    return useId;
  }), true).then((metaDocs) => {
    var ret = {};
    Object.values(metaDocs).forEach((metaDoc) => {
      ret[metaDoc.itemId] = {
        docData: metaDoc.docData,
        metaDocument: metaDoc
      };
    });
    return ret;
  });
}
async function getMetaWriteRow(state, newMasterDocState, previous, isResolvedConflict) {
  var docId = newMasterDocState[state.primaryPath];
  var newMeta = previous ? flatCloneDocWithMeta(previous) : {
    id: "",
    isCheckpoint: "0",
    itemId: docId,
    docData: newMasterDocState,
    _attachments: {},
    _deleted: false,
    _rev: getDefaultRevision(),
    _meta: {
      lwt: 0
    }
  };
  newMeta.docData = newMasterDocState;
  if (isResolvedConflict) {
    newMeta.isResolvedConflict = isResolvedConflict;
  }
  newMeta._meta.lwt = now$1();
  newMeta.id = getComposedPrimaryKeyOfDocumentData(state.input.metaInstance.schema, newMeta);
  newMeta._rev = createRevision(await state.checkpointKey, previous);
  var ret = {
    previous,
    document: newMeta
  };
  return ret;
}
async function startReplicationDownstream(state) {
  if (state.input.initialCheckpoint && state.input.initialCheckpoint.downstream) {
    var checkpointDoc = await getLastCheckpointDoc(state, "down");
    if (!checkpointDoc) {
      await setCheckpoint(state, "down", state.input.initialCheckpoint.downstream);
    }
  }
  var identifierHash = await state.input.hashFunction(state.input.identifier);
  var replicationHandler = state.input.replicationHandler;
  var timer = 0;
  var openTasks = [];
  function addNewTask(task) {
    state.stats.down.addNewTask = state.stats.down.addNewTask + 1;
    var taskWithTime = {
      time: timer++,
      task
    };
    openTasks.push(taskWithTime);
    state.streamQueue.down = state.streamQueue.down.then(() => {
      var useTasks = [];
      while (openTasks.length > 0) {
        state.events.active.down.next(true);
        var innerTaskWithTime = ensureNotFalsy(openTasks.shift());
        if (innerTaskWithTime.time < lastTimeMasterChangesRequested) {
          continue;
        }
        if (innerTaskWithTime.task === "RESYNC") {
          if (useTasks.length === 0) {
            useTasks.push(innerTaskWithTime.task);
            break;
          } else {
            break;
          }
        }
        useTasks.push(innerTaskWithTime.task);
      }
      if (useTasks.length === 0) {
        return;
      }
      if (useTasks[0] === "RESYNC") {
        return downstreamResyncOnce();
      } else {
        return downstreamProcessChanges(useTasks);
      }
    }).then(() => {
      state.events.active.down.next(false);
      if (!state.firstSyncDone.down.getValue() && !state.events.canceled.getValue()) {
        state.firstSyncDone.down.next(true);
      }
    });
  }
  addNewTask("RESYNC");
  if (!state.events.canceled.getValue()) {
    var sub = replicationHandler.masterChangeStream$.pipe(mergeMap(async (ev) => {
      await firstValueFrom(state.events.active.up.pipe(filter((s2) => !s2)));
      return ev;
    })).subscribe((task) => {
      state.stats.down.masterChangeStreamEmit = state.stats.down.masterChangeStreamEmit + 1;
      addNewTask(task);
    });
    firstValueFrom(state.events.canceled.pipe(filter((canceled) => !!canceled))).then(() => sub.unsubscribe());
  }
  var lastTimeMasterChangesRequested = -1;
  async function downstreamResyncOnce() {
    state.stats.down.downstreamResyncOnce = state.stats.down.downstreamResyncOnce + 1;
    if (state.events.canceled.getValue()) {
      return;
    }
    state.checkpointQueue = state.checkpointQueue.then(() => getLastCheckpointDoc(state, "down"));
    var lastCheckpoint = await state.checkpointQueue;
    var promises = [];
    while (!state.events.canceled.getValue()) {
      lastTimeMasterChangesRequested = timer++;
      var downResult = await replicationHandler.masterChangesSince(lastCheckpoint, state.input.pullBatchSize);
      if (downResult.documents.length === 0) {
        break;
      }
      lastCheckpoint = stackCheckpoints([lastCheckpoint, downResult.checkpoint]);
      promises.push(persistFromMaster(downResult.documents, lastCheckpoint));
      if (downResult.documents.length < state.input.pullBatchSize) {
        break;
      }
    }
    await Promise.all(promises);
  }
  function downstreamProcessChanges(tasks) {
    state.stats.down.downstreamProcessChanges = state.stats.down.downstreamProcessChanges + 1;
    var docsOfAllTasks = [];
    var lastCheckpoint = null;
    tasks.forEach((task) => {
      if (task === "RESYNC") {
        throw new Error("SNH");
      }
      appendToArray(docsOfAllTasks, task.documents);
      lastCheckpoint = stackCheckpoints([lastCheckpoint, task.checkpoint]);
    });
    return persistFromMaster(docsOfAllTasks, ensureNotFalsy(lastCheckpoint));
  }
  var persistenceQueue = PROMISE_RESOLVE_VOID;
  var nonPersistedFromMaster = {
    docs: {}
  };
  function persistFromMaster(docs, checkpoint) {
    var primaryPath = state.primaryPath;
    state.stats.down.persistFromMaster = state.stats.down.persistFromMaster + 1;
    docs.forEach((docData) => {
      var docId = docData[primaryPath];
      nonPersistedFromMaster.docs[docId] = docData;
    });
    nonPersistedFromMaster.checkpoint = checkpoint;
    persistenceQueue = persistenceQueue.then(() => {
      var downDocsById = nonPersistedFromMaster.docs;
      nonPersistedFromMaster.docs = {};
      var useCheckpoint = nonPersistedFromMaster.checkpoint;
      var docIds = Object.keys(downDocsById);
      if (state.events.canceled.getValue() || docIds.length === 0) {
        return PROMISE_RESOLVE_VOID;
      }
      var writeRowsToFork = [];
      var writeRowsToForkById = {};
      var writeRowsToMeta = {};
      var useMetaWriteRows = [];
      return Promise.all([state.input.forkInstance.findDocumentsById(docIds, true), getAssumedMasterState(state, docIds)]).then(([currentForkStateList, assumedMasterState]) => {
        var currentForkState = /* @__PURE__ */ new Map();
        currentForkStateList.forEach((doc) => currentForkState.set(doc[primaryPath], doc));
        return Promise.all(docIds.map(async (docId) => {
          var forkStateFullDoc = currentForkState.get(docId);
          var forkStateDocData = forkStateFullDoc ? writeDocToDocState(forkStateFullDoc, state.hasAttachments, false) : void 0;
          var masterState = downDocsById[docId];
          var assumedMaster = assumedMasterState[docId];
          if (assumedMaster && forkStateFullDoc && assumedMaster.metaDocument.isResolvedConflict === forkStateFullDoc._rev) {
            await state.streamQueue.up;
          }
          var isAssumedMasterEqualToForkState = !assumedMaster || !forkStateDocData ? false : await state.input.conflictHandler({
            realMasterState: assumedMaster.docData,
            newDocumentState: forkStateDocData
          }, "downstream-check-if-equal-0").then((r2) => r2.isEqual);
          if (!isAssumedMasterEqualToForkState && assumedMaster && assumedMaster.docData._rev && forkStateFullDoc && forkStateFullDoc._meta[state.input.identifier] && getHeightOfRevision(forkStateFullDoc._rev) === forkStateFullDoc._meta[state.input.identifier]) {
            isAssumedMasterEqualToForkState = true;
          }
          if (forkStateFullDoc && assumedMaster && isAssumedMasterEqualToForkState === false || forkStateFullDoc && !assumedMaster) {
            return PROMISE_RESOLVE_VOID;
          }
          var areStatesExactlyEqual = !forkStateDocData ? false : await state.input.conflictHandler({
            realMasterState: masterState,
            newDocumentState: forkStateDocData
          }, "downstream-check-if-equal-1").then((r2) => r2.isEqual);
          if (forkStateDocData && areStatesExactlyEqual) {
            if (!assumedMaster || isAssumedMasterEqualToForkState === false) {
              useMetaWriteRows.push(await getMetaWriteRow(state, forkStateDocData, assumedMaster ? assumedMaster.metaDocument : void 0));
            }
            return PROMISE_RESOLVE_VOID;
          }
          var newForkState = Object.assign({}, masterState, forkStateFullDoc ? {
            _meta: flatClone(forkStateFullDoc._meta),
            _attachments: state.hasAttachments && masterState._attachments ? masterState._attachments : {},
            _rev: getDefaultRevision()
          } : {
            _meta: {
              lwt: now$1()
            },
            _rev: getDefaultRevision(),
            _attachments: state.hasAttachments && masterState._attachments ? masterState._attachments : {}
          });
          if (masterState._rev) {
            var nextRevisionHeight = !forkStateFullDoc ? 1 : getHeightOfRevision(forkStateFullDoc._rev) + 1;
            newForkState._meta[state.input.identifier] = nextRevisionHeight;
            if (state.input.keepMeta) {
              newForkState._rev = masterState._rev;
            }
          }
          if (state.input.keepMeta && masterState._meta) {
            newForkState._meta = masterState._meta;
          }
          var forkWriteRow = {
            previous: forkStateFullDoc,
            document: newForkState
          };
          forkWriteRow.document._rev = forkWriteRow.document._rev ? forkWriteRow.document._rev : createRevision(identifierHash, forkWriteRow.previous);
          writeRowsToFork.push(forkWriteRow);
          writeRowsToForkById[docId] = forkWriteRow;
          writeRowsToMeta[docId] = await getMetaWriteRow(state, masterState, assumedMaster ? assumedMaster.metaDocument : void 0);
        }));
      }).then(async () => {
        if (writeRowsToFork.length > 0) {
          return state.input.forkInstance.bulkWrite(writeRowsToFork, await state.downstreamBulkWriteFlag).then((forkWriteResult) => {
            var success = getWrittenDocumentsFromBulkWriteResponse(state.primaryPath, writeRowsToFork, forkWriteResult);
            success.forEach((doc) => {
              var docId = doc[primaryPath];
              state.events.processed.down.next(writeRowsToForkById[docId]);
              useMetaWriteRows.push(writeRowsToMeta[docId]);
            });
            forkWriteResult.error.forEach((error) => {
              if (error.status === 409) {
                return;
              }
              state.events.error.next(newRxError("RC_PULL", {
                writeError: error
              }));
            });
          });
        }
      }).then(() => {
        if (useMetaWriteRows.length > 0) {
          return state.input.metaInstance.bulkWrite(stripAttachmentsDataFromMetaWriteRows(state, useMetaWriteRows), "replication-down-write-meta").then((metaWriteResult) => {
            metaWriteResult.error.forEach((writeError) => {
              state.events.error.next(newRxError("RC_PULL", {
                id: writeError.documentId,
                writeError
              }));
            });
          });
        }
      }).then(() => {
        setCheckpoint(state, "down", useCheckpoint);
      });
    }).catch((unhandledError) => state.events.error.next(unhandledError));
    return persistenceQueue;
  }
}
var defaultConflictHandler = function(i, _context) {
  var newDocumentState = stripAttachmentsDataFromDocument(i.newDocumentState);
  var realMasterState = stripAttachmentsDataFromDocument(i.realMasterState);
  if (deepEqual(newDocumentState, realMasterState)) {
    return Promise.resolve({
      isEqual: true
    });
  }
  return Promise.resolve({
    isEqual: false,
    documentData: i.realMasterState
  });
};
async function resolveConflictError(state, input, forkState) {
  var conflictHandler = state.input.conflictHandler;
  var conflictHandlerOutput = await conflictHandler(input, "replication-resolve-conflict");
  if (conflictHandlerOutput.isEqual) {
    return void 0;
  } else {
    var resolvedDoc = Object.assign({}, conflictHandlerOutput.documentData, {
      /**
       * Because the resolved conflict is written to the fork,
       * we have to keep/update the forks _meta data, not the masters.
       */
      _meta: flatClone(forkState._meta),
      _rev: getDefaultRevision(),
      _attachments: flatClone(forkState._attachments)
    });
    resolvedDoc._meta.lwt = now$1();
    resolvedDoc._rev = createRevision(await state.checkpointKey, forkState);
    return {
      resolvedDoc,
      output: conflictHandlerOutput
    };
  }
}
async function fillWriteDataForAttachmentsChange(primaryPath, storageInstance, newDocument, originalDocument) {
  if (!newDocument._attachments || originalDocument && !originalDocument._attachments) {
    throw new Error("_attachments missing");
  }
  var docId = newDocument[primaryPath];
  var originalAttachmentsIds = new Set(originalDocument && originalDocument._attachments ? Object.keys(originalDocument._attachments) : []);
  await Promise.all(Object.entries(newDocument._attachments).map(async ([key, value]) => {
    if ((!originalAttachmentsIds.has(key) || originalDocument && ensureNotFalsy(originalDocument._attachments)[key].digest !== value.digest) && !value.data) {
      var attachmentDataString = await storageInstance.getAttachmentData(docId, key, value.digest);
      value.data = attachmentDataString;
    }
  }));
  return newDocument;
}
async function startReplicationUpstream(state) {
  if (state.input.initialCheckpoint && state.input.initialCheckpoint.upstream) {
    var checkpointDoc = await getLastCheckpointDoc(state, "up");
    if (!checkpointDoc) {
      await setCheckpoint(state, "up", state.input.initialCheckpoint.upstream);
    }
  }
  var replicationHandler = state.input.replicationHandler;
  state.streamQueue.up = state.streamQueue.up.then(() => {
    return upstreamInitialSync().then(() => {
      processTasks();
    });
  });
  var timer = 0;
  var initialSyncStartTime = -1;
  var openTasks = [];
  var persistenceQueue = PROMISE_RESOLVE_FALSE;
  var nonPersistedFromMaster = {
    docs: {}
  };
  var sub = state.input.forkInstance.changeStream().subscribe(async (eventBulk) => {
    if (eventBulk.context === await state.downstreamBulkWriteFlag) {
      return;
    }
    state.stats.up.forkChangeStreamEmit = state.stats.up.forkChangeStreamEmit + 1;
    openTasks.push({
      task: eventBulk,
      time: timer++
    });
    if (!state.events.active.up.getValue()) {
      state.events.active.up.next(true);
    }
    if (state.input.waitBeforePersist) {
      return state.input.waitBeforePersist().then(() => processTasks());
    } else {
      return processTasks();
    }
  });
  firstValueFrom(state.events.canceled.pipe(filter((canceled) => !!canceled))).then(() => sub.unsubscribe());
  async function upstreamInitialSync() {
    state.stats.up.upstreamInitialSync = state.stats.up.upstreamInitialSync + 1;
    if (state.events.canceled.getValue()) {
      return;
    }
    state.checkpointQueue = state.checkpointQueue.then(() => getLastCheckpointDoc(state, "up"));
    var lastCheckpoint = await state.checkpointQueue;
    var promises = /* @__PURE__ */ new Set();
    var _loop = async function() {
      initialSyncStartTime = timer++;
      if (promises.size > 3) {
        await Promise.race(Array.from(promises));
      }
      var upResult = await getChangedDocumentsSince$1(state.input.forkInstance, state.input.pushBatchSize, lastCheckpoint);
      if (upResult.documents.length === 0) {
        return 1;
      }
      lastCheckpoint = stackCheckpoints([lastCheckpoint, upResult.checkpoint]);
      var promise = persistToMaster(upResult.documents, ensureNotFalsy(lastCheckpoint));
      promises.add(promise);
      promise.catch().then(() => promises.delete(promise));
    };
    while (!state.events.canceled.getValue()) {
      if (await _loop()) break;
    }
    var resolvedPromises = await Promise.all(promises);
    var hadConflicts = resolvedPromises.find((r2) => !!r2);
    if (hadConflicts) {
      await upstreamInitialSync();
    } else if (!state.firstSyncDone.up.getValue() && !state.events.canceled.getValue()) {
      state.firstSyncDone.up.next(true);
    }
  }
  function processTasks() {
    if (state.events.canceled.getValue() || openTasks.length === 0) {
      state.events.active.up.next(false);
      return;
    }
    state.stats.up.processTasks = state.stats.up.processTasks + 1;
    state.events.active.up.next(true);
    state.streamQueue.up = state.streamQueue.up.then(() => {
      var docs = [];
      var checkpoint = {};
      while (openTasks.length > 0) {
        var taskWithTime = ensureNotFalsy(openTasks.shift());
        if (taskWithTime.time < initialSyncStartTime) {
          continue;
        }
        appendToArray(docs, taskWithTime.task.events.map((r2) => {
          return r2.documentData;
        }));
        checkpoint = stackCheckpoints([checkpoint, taskWithTime.task.checkpoint]);
      }
      var promise = docs.length === 0 ? PROMISE_RESOLVE_FALSE : persistToMaster(docs, checkpoint);
      return promise.then(() => {
        if (openTasks.length === 0) {
          state.events.active.up.next(false);
        } else {
          processTasks();
        }
      });
    });
  }
  function persistToMaster(docs, checkpoint) {
    state.stats.up.persistToMaster = state.stats.up.persistToMaster + 1;
    docs.forEach((docData) => {
      var docId = docData[state.primaryPath];
      nonPersistedFromMaster.docs[docId] = docData;
    });
    nonPersistedFromMaster.checkpoint = checkpoint;
    persistenceQueue = persistenceQueue.then(async () => {
      if (state.events.canceled.getValue()) {
        return false;
      }
      var upDocsById = nonPersistedFromMaster.docs;
      nonPersistedFromMaster.docs = {};
      var useCheckpoint = nonPersistedFromMaster.checkpoint;
      var docIds = Object.keys(upDocsById);
      if (docIds.length === 0) {
        return false;
      }
      var assumedMasterState = await getAssumedMasterState(state, docIds);
      var writeRowsToMaster = {};
      var writeRowsToMasterIds = [];
      var writeRowsToMeta = {};
      var forkStateById = {};
      await Promise.all(docIds.map(async (docId) => {
        var fullDocData = upDocsById[docId];
        forkStateById[docId] = fullDocData;
        var docData = writeDocToDocState(fullDocData, state.hasAttachments, !!state.input.keepMeta);
        var assumedMasterDoc = assumedMasterState[docId];
        if (assumedMasterDoc && // if the isResolvedConflict is correct, we do not have to compare the documents.
        assumedMasterDoc.metaDocument.isResolvedConflict !== fullDocData._rev && (await state.input.conflictHandler({
          realMasterState: assumedMasterDoc.docData,
          newDocumentState: docData
        }, "upstream-check-if-equal")).isEqual || /**
         * If the master works with _rev fields,
         * we use that to check if our current doc state
         * is different from the assumedMasterDoc.
         */
        assumedMasterDoc && assumedMasterDoc.docData._rev && getHeightOfRevision(fullDocData._rev) === fullDocData._meta[state.input.identifier]) {
          return;
        }
        writeRowsToMasterIds.push(docId);
        writeRowsToMaster[docId] = {
          assumedMasterState: assumedMasterDoc ? assumedMasterDoc.docData : void 0,
          newDocumentState: docData
        };
        writeRowsToMeta[docId] = await getMetaWriteRow(state, docData, assumedMasterDoc ? assumedMasterDoc.metaDocument : void 0);
      }));
      if (writeRowsToMasterIds.length === 0) {
        return false;
      }
      var writeRowsArray = Object.values(writeRowsToMaster);
      var conflictIds = /* @__PURE__ */ new Set();
      var conflictsById = {};
      var writeBatches = batchArray(writeRowsArray, state.input.pushBatchSize);
      await Promise.all(writeBatches.map(async (writeBatch) => {
        if (state.hasAttachments) {
          await Promise.all(writeBatch.map(async (row) => {
            row.newDocumentState = await fillWriteDataForAttachmentsChange(state.primaryPath, state.input.forkInstance, clone$1(row.newDocumentState), row.assumedMasterState);
          }));
        }
        var masterWriteResult = await replicationHandler.masterWrite(writeBatch);
        masterWriteResult.forEach((conflictDoc) => {
          var id = conflictDoc[state.primaryPath];
          conflictIds.add(id);
          conflictsById[id] = conflictDoc;
        });
      }));
      var useWriteRowsToMeta = [];
      writeRowsToMasterIds.forEach((docId) => {
        if (!conflictIds.has(docId)) {
          state.events.processed.up.next(writeRowsToMaster[docId]);
          useWriteRowsToMeta.push(writeRowsToMeta[docId]);
        }
      });
      if (state.events.canceled.getValue()) {
        return false;
      }
      if (useWriteRowsToMeta.length > 0) {
        await state.input.metaInstance.bulkWrite(stripAttachmentsDataFromMetaWriteRows(state, useWriteRowsToMeta), "replication-up-write-meta");
      }
      var hadConflictWrites = false;
      if (conflictIds.size > 0) {
        state.stats.up.persistToMasterHadConflicts = state.stats.up.persistToMasterHadConflicts + 1;
        var conflictWriteFork = [];
        var conflictWriteMeta = {};
        await Promise.all(Object.entries(conflictsById).map(([docId, realMasterState]) => {
          var writeToMasterRow = writeRowsToMaster[docId];
          var input = {
            newDocumentState: writeToMasterRow.newDocumentState,
            assumedMasterState: writeToMasterRow.assumedMasterState,
            realMasterState
          };
          return resolveConflictError(state, input, forkStateById[docId]).then(async (resolved) => {
            if (resolved) {
              state.events.resolvedConflicts.next({
                input,
                output: resolved.output
              });
              conflictWriteFork.push({
                previous: forkStateById[docId],
                document: resolved.resolvedDoc
              });
              var assumedMasterDoc = assumedMasterState[docId];
              conflictWriteMeta[docId] = await getMetaWriteRow(state, ensureNotFalsy(realMasterState), assumedMasterDoc ? assumedMasterDoc.metaDocument : void 0, resolved.resolvedDoc._rev);
            }
          });
        }));
        if (conflictWriteFork.length > 0) {
          hadConflictWrites = true;
          state.stats.up.persistToMasterConflictWrites = state.stats.up.persistToMasterConflictWrites + 1;
          var forkWriteResult = await state.input.forkInstance.bulkWrite(conflictWriteFork, "replication-up-write-conflict");
          var useMetaWrites = [];
          var success = getWrittenDocumentsFromBulkWriteResponse(state.primaryPath, conflictWriteFork, forkWriteResult);
          success.forEach((docData) => {
            var docId = docData[state.primaryPath];
            useMetaWrites.push(conflictWriteMeta[docId]);
          });
          if (useMetaWrites.length > 0) {
            await state.input.metaInstance.bulkWrite(stripAttachmentsDataFromMetaWriteRows(state, useMetaWrites), "replication-up-write-conflict-meta");
          }
        }
      }
      setCheckpoint(state, "up", useCheckpoint);
      return hadConflictWrites;
    }).catch((unhandledError) => {
      state.events.error.next(unhandledError);
      return false;
    });
    return persistenceQueue;
  }
}
function replicateRxStorageInstance(input) {
  input = flatClone(input);
  input.forkInstance = getUnderlyingPersistentStorage(input.forkInstance);
  input.metaInstance = getUnderlyingPersistentStorage(input.metaInstance);
  var checkpointKeyPromise = getCheckpointKey(input);
  var state = {
    primaryPath: getPrimaryFieldOfPrimaryKey(input.forkInstance.schema.primaryKey),
    hasAttachments: !!input.forkInstance.schema.attachments,
    input,
    checkpointKey: checkpointKeyPromise,
    downstreamBulkWriteFlag: checkpointKeyPromise.then((checkpointKey) => "replication-downstream-" + checkpointKey),
    events: {
      canceled: new BehaviorSubject(false),
      active: {
        down: new BehaviorSubject(true),
        up: new BehaviorSubject(true)
      },
      processed: {
        down: new Subject(),
        up: new Subject()
      },
      resolvedConflicts: new Subject(),
      error: new Subject()
    },
    stats: {
      down: {
        addNewTask: 0,
        downstreamProcessChanges: 0,
        downstreamResyncOnce: 0,
        masterChangeStreamEmit: 0,
        persistFromMaster: 0
      },
      up: {
        forkChangeStreamEmit: 0,
        persistToMaster: 0,
        persistToMasterConflictWrites: 0,
        persistToMasterHadConflicts: 0,
        processTasks: 0,
        upstreamInitialSync: 0
      }
    },
    firstSyncDone: {
      down: new BehaviorSubject(false),
      up: new BehaviorSubject(false)
    },
    streamQueue: {
      down: PROMISE_RESOLVE_VOID,
      up: PROMISE_RESOLVE_VOID
    },
    checkpointQueue: PROMISE_RESOLVE_VOID,
    lastCheckpointDoc: {}
  };
  startReplicationDownstream(state);
  startReplicationUpstream(state);
  return state;
}
function awaitRxStorageReplicationFirstInSync(state) {
  return firstValueFrom(combineLatest([state.firstSyncDone.down.pipe(filter((v) => !!v)), state.firstSyncDone.up.pipe(filter((v) => !!v))])).then(() => {
  });
}
function rxStorageInstanceToReplicationHandler(instance, conflictHandler, databaseInstanceToken, keepMeta = false) {
  instance = getUnderlyingPersistentStorage(instance);
  var hasAttachments = !!instance.schema.attachments;
  var primaryPath = getPrimaryFieldOfPrimaryKey(instance.schema.primaryKey);
  var replicationHandler = {
    masterChangeStream$: instance.changeStream().pipe(mergeMap(async (eventBulk) => {
      var ret = {
        checkpoint: eventBulk.checkpoint,
        documents: await Promise.all(eventBulk.events.map(async (event) => {
          var docData = writeDocToDocState(event.documentData, hasAttachments, keepMeta);
          if (hasAttachments) {
            docData = await fillWriteDataForAttachmentsChange(
              primaryPath,
              instance,
              clone$1(docData),
              /**
               * Notice that the master never knows
               * the client state of the document.
               * Therefore we always send all attachments data.
               */
              void 0
            );
          }
          return docData;
        }))
      };
      return ret;
    })),
    masterChangesSince(checkpoint, batchSize) {
      return getChangedDocumentsSince$1(instance, batchSize, checkpoint).then(async (result) => {
        return {
          checkpoint: result.documents.length > 0 ? result.checkpoint : checkpoint,
          documents: await Promise.all(result.documents.map(async (plainDocumentData) => {
            var docData = writeDocToDocState(plainDocumentData, hasAttachments, keepMeta);
            if (hasAttachments) {
              docData = await fillWriteDataForAttachmentsChange(
                primaryPath,
                instance,
                clone$1(docData),
                /**
                 * Notice the the master never knows
                 * the client state of the document.
                 * Therefore we always send all attachments data.
                 */
                void 0
              );
            }
            return docData;
          }))
        };
      });
    },
    async masterWrite(rows) {
      var rowById = {};
      rows.forEach((row) => {
        var docId = row.newDocumentState[primaryPath];
        rowById[docId] = row;
      });
      var ids = Object.keys(rowById);
      var masterDocsStateList = await instance.findDocumentsById(ids, true);
      var masterDocsState = /* @__PURE__ */ new Map();
      masterDocsStateList.forEach((doc) => masterDocsState.set(doc[primaryPath], doc));
      var conflicts = [];
      var writeRows = [];
      await Promise.all(Object.entries(rowById).map(async ([id, row]) => {
        var masterState = masterDocsState.get(id);
        if (!masterState) {
          writeRows.push({
            document: docStateToWriteDoc(databaseInstanceToken, hasAttachments, keepMeta, row.newDocumentState)
          });
        } else if (masterState && !row.assumedMasterState) {
          conflicts.push(writeDocToDocState(masterState, hasAttachments, keepMeta));
        } else if ((await conflictHandler({
          realMasterState: writeDocToDocState(masterState, hasAttachments, keepMeta),
          newDocumentState: ensureNotFalsy(row.assumedMasterState)
        }, "rxStorageInstanceToReplicationHandler-masterWrite")).isEqual === true) {
          writeRows.push({
            previous: masterState,
            document: docStateToWriteDoc(databaseInstanceToken, hasAttachments, keepMeta, row.newDocumentState, masterState)
          });
        } else {
          conflicts.push(writeDocToDocState(masterState, hasAttachments, keepMeta));
        }
      }));
      if (writeRows.length > 0) {
        var result = await instance.bulkWrite(writeRows, "replication-master-write");
        result.error.forEach((err) => {
          if (err.status !== 409) {
            throw new Error("non conflict error");
          } else {
            conflicts.push(writeDocToDocState(ensureNotFalsy(err.documentInDb), hasAttachments, keepMeta));
          }
        });
      }
      return conflicts;
    }
  };
  return replicationHandler;
}
async function cancelRxStorageReplication(replicationState) {
  replicationState.events.canceled.next(true);
  replicationState.events.active.up.complete();
  replicationState.events.active.down.complete();
  replicationState.events.processed.up.complete();
  replicationState.events.processed.down.complete();
  replicationState.events.resolvedConflicts.complete();
  replicationState.events.canceled.complete();
  await replicationState.checkpointQueue;
}
var HOOKS_WHEN = ["pre", "post"];
var HOOKS_KEYS = ["insert", "save", "remove", "create"];
var hooksApplied = false;
var RxCollectionBase = /* @__PURE__ */ function() {
  function RxCollectionBase2(database, name, schema, internalStorageInstance, instanceCreationOptions = {}, migrationStrategies = {}, methods = {}, attachments = {}, options = {}, cacheReplacementPolicy = defaultCacheReplacementPolicy, statics = {}, conflictHandler = defaultConflictHandler) {
    this.storageInstance = {};
    this.timeouts = /* @__PURE__ */ new Set();
    this.incrementalWriteQueue = {};
    this.awaitBeforeReads = /* @__PURE__ */ new Set();
    this._incrementalUpsertQueues = /* @__PURE__ */ new Map();
    this.synced = false;
    this.hooks = {};
    this._subs = [];
    this._docCache = {};
    this._queryCache = createQueryCache();
    this.$ = {};
    this.checkpoint$ = {};
    this._changeEventBuffer = {};
    this.onDestroy = [];
    this.destroyed = false;
    this.onRemove = [];
    this.database = database;
    this.name = name;
    this.schema = schema;
    this.internalStorageInstance = internalStorageInstance;
    this.instanceCreationOptions = instanceCreationOptions;
    this.migrationStrategies = migrationStrategies;
    this.methods = methods;
    this.attachments = attachments;
    this.options = options;
    this.cacheReplacementPolicy = cacheReplacementPolicy;
    this.statics = statics;
    this.conflictHandler = conflictHandler;
    _applyHookFunctions(this.asRxCollection);
  }
  var _proto = RxCollectionBase2.prototype;
  _proto.prepare = async function prepare() {
    this.storageInstance = getWrappedStorageInstance(this.database, this.internalStorageInstance, this.schema.jsonSchema);
    this.incrementalWriteQueue = new IncrementalWriteQueue(this.storageInstance, this.schema.primaryPath, (newData, oldData) => beforeDocumentUpdateWrite(this, newData, oldData), (result) => this._runHooks("post", "save", result));
    var collectionEventBulks$ = this.database.eventBulks$.pipe(filter((changeEventBulk) => changeEventBulk.collectionName === this.name));
    this.$ = collectionEventBulks$.pipe(mergeMap((changeEventBulk) => changeEventBulk.events));
    this.checkpoint$ = collectionEventBulks$.pipe(map((changeEventBulk) => changeEventBulk.checkpoint));
    this._changeEventBuffer = createChangeEventBuffer(this.asRxCollection);
    var documentConstructor;
    this._docCache = new DocumentCache(this.schema.primaryPath, this.database.eventBulks$.pipe(filter((changeEventBulk) => changeEventBulk.collectionName === this.name && !changeEventBulk.events[0].isLocal), map((b2) => b2.events)), (docData) => {
      if (!documentConstructor) {
        documentConstructor = getRxDocumentConstructor(this.asRxCollection);
      }
      return createNewRxDocument(this.asRxCollection, documentConstructor, docData);
    });
    var listenToRemoveSub = this.database.internalStore.changeStream().pipe(filter((bulk) => {
      var key = this.name + "-" + this.schema.version;
      var found = bulk.events.find((event) => {
        return event.documentData.context === "collection" && event.documentData.key === key && event.operation === "DELETE";
      });
      return !!found;
    })).subscribe(async () => {
      await this.destroy();
      await Promise.all(this.onRemove.map((fn) => fn()));
    });
    this._subs.push(listenToRemoveSub);
    var databaseStorageToken = await this.database.storageToken;
    var subDocs = this.storageInstance.changeStream().subscribe((eventBulk) => {
      var events = new Array(eventBulk.events.length);
      var rawEvents = eventBulk.events;
      var collectionName = this.name;
      var deepFreezeWhenDevMode = overwritable.deepFreezeWhenDevMode;
      for (var index = 0; index < rawEvents.length; index++) {
        var event = rawEvents[index];
        events[index] = {
          documentId: event.documentId,
          collectionName,
          isLocal: false,
          operation: event.operation,
          documentData: deepFreezeWhenDevMode(event.documentData),
          previousDocumentData: deepFreezeWhenDevMode(event.previousDocumentData)
        };
      }
      var changeEventBulk = {
        id: eventBulk.id,
        internal: false,
        collectionName: this.name,
        storageToken: databaseStorageToken,
        events,
        databaseToken: this.database.token,
        checkpoint: eventBulk.checkpoint,
        context: eventBulk.context,
        endTime: eventBulk.endTime,
        startTime: eventBulk.startTime
      };
      this.database.$emit(changeEventBulk);
    });
    this._subs.push(subDocs);
    this._subs.push(this.storageInstance.conflictResultionTasks().subscribe((task) => {
      this.conflictHandler(task.input, task.context).then((output) => {
        this.storageInstance.resolveConflictResultionTask({
          id: task.id,
          output
        });
      });
    }));
    return PROMISE_RESOLVE_VOID;
  };
  _proto.cleanup = function cleanup2(_minimumDeletedTime) {
    ensureRxCollectionIsNotDestroyed(this);
    throw pluginMissing("cleanup");
  };
  _proto.migrationNeeded = function migrationNeeded() {
    throw pluginMissing("migration-schema");
  };
  _proto.getMigrationState = function getMigrationState() {
    throw pluginMissing("migration-schema");
  };
  _proto.startMigration = function startMigration(batchSize = 10) {
    ensureRxCollectionIsNotDestroyed(this);
    return this.getMigrationState().startMigration(batchSize);
  };
  _proto.migratePromise = function migratePromise(batchSize = 10) {
    return this.getMigrationState().migratePromise(batchSize);
  };
  _proto.insert = async function insert(json) {
    ensureRxCollectionIsNotDestroyed(this);
    var writeResult = await this.bulkInsert([json]);
    var isError = writeResult.error[0];
    throwIfIsStorageWriteError(this, json[this.schema.primaryPath], json, isError);
    var insertResult = ensureNotFalsy(writeResult.success[0]);
    return insertResult;
  };
  _proto.bulkInsert = async function bulkInsert(docsData) {
    ensureRxCollectionIsNotDestroyed(this);
    if (docsData.length === 0) {
      return {
        success: [],
        error: []
      };
    }
    var primaryPath = this.schema.primaryPath;
    var insertRows;
    if (this.hasHooks("pre", "insert")) {
      insertRows = await Promise.all(docsData.map((docData2) => {
        var useDocData2 = fillObjectDataBeforeInsert(this.schema, docData2);
        return this._runHooks("pre", "insert", useDocData2).then(() => {
          return {
            document: useDocData2
          };
        });
      }));
    } else {
      insertRows = new Array(docsData.length);
      var _schema = this.schema;
      for (var index = 0; index < docsData.length; index++) {
        var docData = docsData[index];
        var useDocData = fillObjectDataBeforeInsert(_schema, docData);
        insertRows[index] = {
          document: useDocData
        };
      }
    }
    var results = await this.storageInstance.bulkWrite(insertRows, "rx-collection-bulk-insert");
    var rxDocuments;
    var collection = this;
    var ret = {
      get success() {
        if (!rxDocuments) {
          var success = getWrittenDocumentsFromBulkWriteResponse(collection.schema.primaryPath, insertRows, results);
          rxDocuments = mapDocumentsDataToCacheDocs(collection._docCache, success);
        }
        return rxDocuments;
      },
      error: results.error
    };
    if (this.hasHooks("post", "insert")) {
      var docsMap = /* @__PURE__ */ new Map();
      insertRows.forEach((row) => {
        var doc = row.document;
        docsMap.set(doc[primaryPath], doc);
      });
      await Promise.all(ret.success.map((doc) => {
        return this._runHooks("post", "insert", docsMap.get(doc.primary), doc);
      }));
    }
    return ret;
  };
  _proto.bulkRemove = async function bulkRemove(ids) {
    ensureRxCollectionIsNotDestroyed(this);
    var primaryPath = this.schema.primaryPath;
    if (ids.length === 0) {
      return {
        success: [],
        error: []
      };
    }
    var rxDocumentMap = await this.findByIds(ids).exec();
    var docsData = [];
    var docsMap = /* @__PURE__ */ new Map();
    Array.from(rxDocumentMap.values()).forEach((rxDocument) => {
      var data = rxDocument.toMutableJSON(true);
      docsData.push(data);
      docsMap.set(rxDocument.primary, data);
    });
    await Promise.all(docsData.map((doc) => {
      var primary = doc[this.schema.primaryPath];
      return this._runHooks("pre", "remove", doc, rxDocumentMap.get(primary));
    }));
    var removeDocs = docsData.map((doc) => {
      var writeDoc = flatClone(doc);
      writeDoc._deleted = true;
      return {
        previous: doc,
        document: writeDoc
      };
    });
    var results = await this.storageInstance.bulkWrite(removeDocs, "rx-collection-bulk-remove");
    var success = getWrittenDocumentsFromBulkWriteResponse(this.schema.primaryPath, removeDocs, results);
    var successIds = success.map((d) => d[primaryPath]);
    await Promise.all(successIds.map((id) => {
      return this._runHooks("post", "remove", docsMap.get(id), rxDocumentMap.get(id));
    }));
    var rxDocuments = successIds.map((id) => getFromMapOrThrow(rxDocumentMap, id));
    return {
      success: rxDocuments,
      error: results.error
    };
  };
  _proto.bulkUpsert = async function bulkUpsert(docsData) {
    ensureRxCollectionIsNotDestroyed(this);
    var insertData = [];
    var useJsonByDocId = /* @__PURE__ */ new Map();
    docsData.forEach((docData) => {
      var useJson = fillObjectDataBeforeInsert(this.schema, docData);
      var primary = useJson[this.schema.primaryPath];
      if (!primary) {
        throw newRxError("COL3", {
          primaryPath: this.schema.primaryPath,
          data: useJson,
          schema: this.schema.jsonSchema
        });
      }
      useJsonByDocId.set(primary, useJson);
      insertData.push(useJson);
    });
    var insertResult = await this.bulkInsert(insertData);
    var success = insertResult.success.slice(0);
    var error = [];
    await Promise.all(insertResult.error.map(async (err) => {
      if (err.status !== 409) {
        error.push(err);
      } else {
        var id = err.documentId;
        var writeData = getFromMapOrThrow(useJsonByDocId, id);
        var docDataInDb = ensureNotFalsy(err.documentInDb);
        var doc = this._docCache.getCachedRxDocuments([docDataInDb])[0];
        var newDoc = await doc.incrementalModify(() => writeData);
        success.push(newDoc);
      }
    }));
    return {
      error,
      success
    };
  };
  _proto.upsert = async function upsert(json) {
    ensureRxCollectionIsNotDestroyed(this);
    var bulkResult = await this.bulkUpsert([json]);
    throwIfIsStorageWriteError(this.asRxCollection, json[this.schema.primaryPath], json, bulkResult.error[0]);
    return bulkResult.success[0];
  };
  _proto.incrementalUpsert = function incrementalUpsert(json) {
    ensureRxCollectionIsNotDestroyed(this);
    var useJson = fillObjectDataBeforeInsert(this.schema, json);
    var primary = useJson[this.schema.primaryPath];
    if (!primary) {
      throw newRxError("COL4", {
        data: json
      });
    }
    var queue = this._incrementalUpsertQueues.get(primary);
    if (!queue) {
      queue = PROMISE_RESOLVE_VOID;
    }
    queue = queue.then(() => _incrementalUpsertEnsureRxDocumentExists(this, primary, useJson)).then((wasInserted) => {
      if (!wasInserted.inserted) {
        return _incrementalUpsertUpdate(wasInserted.doc, useJson);
      } else {
        return wasInserted.doc;
      }
    });
    this._incrementalUpsertQueues.set(primary, queue);
    return queue;
  };
  _proto.find = function find(queryObj) {
    ensureRxCollectionIsNotDestroyed(this);
    if (typeof queryObj === "string") {
      throw newRxError("COL5", {
        queryObj
      });
    }
    if (!queryObj) {
      queryObj = _getDefaultQuery();
    }
    var query = createRxQuery("find", queryObj, this);
    return query;
  };
  _proto.findOne = function findOne(queryObj) {
    ensureRxCollectionIsNotDestroyed(this);
    if (typeof queryObj === "number" || Array.isArray(queryObj)) {
      throw newRxTypeError("COL6", {
        queryObj
      });
    }
    var query;
    if (typeof queryObj === "string") {
      query = createRxQuery("findOne", {
        selector: {
          [this.schema.primaryPath]: queryObj
        },
        limit: 1
      }, this);
    } else {
      if (!queryObj) {
        queryObj = _getDefaultQuery();
      }
      if (queryObj.limit) {
        throw newRxError("QU6");
      }
      queryObj = flatClone(queryObj);
      queryObj.limit = 1;
      query = createRxQuery("findOne", queryObj, this);
    }
    return query;
  };
  _proto.count = function count(queryObj) {
    ensureRxCollectionIsNotDestroyed(this);
    if (!queryObj) {
      queryObj = _getDefaultQuery();
    }
    var query = createRxQuery("count", queryObj, this);
    return query;
  };
  _proto.findByIds = function findByIds(ids) {
    ensureRxCollectionIsNotDestroyed(this);
    var mangoQuery = {
      selector: {
        [this.schema.primaryPath]: {
          $in: ids.slice(0)
        }
      }
    };
    var query = createRxQuery("findByIds", mangoQuery, this);
    return query;
  };
  _proto.exportJSON = function exportJSON() {
    throw pluginMissing("json-dump");
  };
  _proto.importJSON = function importJSON(_exportedJSON) {
    throw pluginMissing("json-dump");
  };
  _proto.insertCRDT = function insertCRDT(_updateObj) {
    throw pluginMissing("crdt");
  };
  _proto.addPipeline = function addPipeline(_options) {
    throw pluginMissing("pipeline");
  };
  _proto.addHook = function addHook(when, key, fun, parallel = false) {
    if (typeof fun !== "function") {
      throw newRxTypeError("COL7", {
        key,
        when
      });
    }
    if (!HOOKS_WHEN.includes(when)) {
      throw newRxTypeError("COL8", {
        key,
        when
      });
    }
    if (!HOOKS_KEYS.includes(key)) {
      throw newRxError("COL9", {
        key
      });
    }
    if (when === "post" && key === "create" && parallel === true) {
      throw newRxError("COL10", {
        when,
        key,
        parallel
      });
    }
    var boundFun = fun.bind(this);
    var runName = parallel ? "parallel" : "series";
    this.hooks[key] = this.hooks[key] || {};
    this.hooks[key][when] = this.hooks[key][when] || {
      series: [],
      parallel: []
    };
    this.hooks[key][when][runName].push(boundFun);
  };
  _proto.getHooks = function getHooks(when, key) {
    if (!this.hooks[key] || !this.hooks[key][when]) {
      return {
        series: [],
        parallel: []
      };
    }
    return this.hooks[key][when];
  };
  _proto.hasHooks = function hasHooks(when, key) {
    if (!this.hooks[key] || !this.hooks[key][when]) {
      return false;
    }
    var hooks = this.getHooks(when, key);
    if (!hooks) {
      return false;
    }
    return hooks.series.length > 0 || hooks.parallel.length > 0;
  };
  _proto._runHooks = function _runHooks(when, key, data, instance) {
    var hooks = this.getHooks(when, key);
    if (!hooks) {
      return PROMISE_RESOLVE_VOID;
    }
    var tasks = hooks.series.map((hook) => () => hook(data, instance));
    return promiseSeries(tasks).then(() => Promise.all(hooks.parallel.map((hook) => hook(data, instance))));
  };
  _proto._runHooksSync = function _runHooksSync(when, key, data, instance) {
    if (!this.hasHooks(when, key)) {
      return;
    }
    var hooks = this.getHooks(when, key);
    if (!hooks) return;
    hooks.series.forEach((hook) => hook(data, instance));
  };
  _proto.promiseWait = function promiseWait2(time) {
    var ret = new Promise((res) => {
      var timeout = setTimeout(() => {
        this.timeouts.delete(timeout);
        res();
      }, time);
      this.timeouts.add(timeout);
    });
    return ret;
  };
  _proto.destroy = async function destroy() {
    if (this.destroyed) {
      return PROMISE_RESOLVE_FALSE;
    }
    await Promise.all(this.onDestroy.map((fn) => fn()));
    this.destroyed = true;
    Array.from(this.timeouts).forEach((timeout) => clearTimeout(timeout));
    if (this._changeEventBuffer) {
      this._changeEventBuffer.destroy();
    }
    return this.database.requestIdlePromise().then(() => this.storageInstance.close()).then(() => {
      this._subs.forEach((sub) => sub.unsubscribe());
      delete this.database.collections[this.name];
      return runAsyncPluginHooks("postDestroyRxCollection", this).then(() => true);
    });
  };
  _proto.remove = async function remove() {
    await this.destroy();
    await Promise.all(this.onRemove.map((fn) => fn()));
    await removeCollectionStorages(this.database.storage, this.database.internalStore, this.database.token, this.database.name, this.name, this.database.password, this.database.hashFunction);
  };
  return _createClass(RxCollectionBase2, [{
    key: "insert$",
    get: function() {
      return this.$.pipe(filter((cE) => cE.operation === "INSERT"));
    }
  }, {
    key: "update$",
    get: function() {
      return this.$.pipe(filter((cE) => cE.operation === "UPDATE"));
    }
  }, {
    key: "remove$",
    get: function() {
      return this.$.pipe(filter((cE) => cE.operation === "DELETE"));
    }
    // defaults
    /**
     * When the collection is destroyed,
     * these functions will be called an awaited.
     * Used to automatically clean up stuff that
     * belongs to this collection.
    */
  }, {
    key: "asRxCollection",
    get: function() {
      return this;
    }
  }]);
}();
function _applyHookFunctions(collection) {
  if (hooksApplied) return;
  hooksApplied = true;
  var colProto = Object.getPrototypeOf(collection);
  HOOKS_KEYS.forEach((key) => {
    HOOKS_WHEN.map((when) => {
      var fnName = when + ucfirst(key);
      colProto[fnName] = function(fun, parallel) {
        return this.addHook(when, key, fun, parallel);
      };
    });
  });
}
function _incrementalUpsertUpdate(doc, json) {
  return doc.incrementalModify((_innerDoc) => {
    return json;
  });
}
function _incrementalUpsertEnsureRxDocumentExists(rxCollection, primary, json) {
  var docDataFromCache = rxCollection._docCache.getLatestDocumentDataIfExists(primary);
  if (docDataFromCache) {
    return Promise.resolve({
      doc: rxCollection._docCache.getCachedRxDocuments([docDataFromCache])[0],
      inserted: false
    });
  }
  return rxCollection.findOne(primary).exec().then((doc) => {
    if (!doc) {
      return rxCollection.insert(json).then((newDoc) => ({
        doc: newDoc,
        inserted: true
      }));
    } else {
      return {
        doc,
        inserted: false
      };
    }
  });
}
function createRxCollection({
  database,
  name,
  schema,
  instanceCreationOptions = {},
  migrationStrategies = {},
  autoMigrate = true,
  statics = {},
  methods = {},
  attachments = {},
  options = {},
  localDocuments = false,
  cacheReplacementPolicy = defaultCacheReplacementPolicy,
  conflictHandler = defaultConflictHandler
}) {
  var storageInstanceCreationParams = {
    databaseInstanceToken: database.token,
    databaseName: database.name,
    collectionName: name,
    schema: schema.jsonSchema,
    options: instanceCreationOptions,
    multiInstance: database.multiInstance,
    password: database.password,
    devMode: overwritable.isDevMode()
  };
  runPluginHooks("preCreateRxStorageInstance", storageInstanceCreationParams);
  return createRxCollectionStorageInstance(database, storageInstanceCreationParams).then((storageInstance) => {
    var collection = new RxCollectionBase(database, name, schema, storageInstance, instanceCreationOptions, migrationStrategies, methods, attachments, options, cacheReplacementPolicy, statics, conflictHandler);
    return collection.prepare().then(() => {
      Object.entries(statics).forEach(([funName, fun]) => {
        Object.defineProperty(collection, funName, {
          get: () => fun.bind(collection)
        });
      });
      var ret = PROMISE_RESOLVE_VOID;
      if (autoMigrate && collection.schema.version !== 0) {
        ret = collection.migratePromise();
      }
      return ret;
    }).then(() => {
      runPluginHooks("createRxCollection", {
        collection,
        creator: {
          name,
          schema,
          storageInstance,
          instanceCreationOptions,
          migrationStrategies,
          methods,
          attachments,
          options,
          cacheReplacementPolicy,
          localDocuments,
          statics
        }
      });
      return collection;
    }).catch((err) => {
      return storageInstance.close().then(() => Promise.reject(err));
    });
  });
}
var IdleQueue = function IdleQueue2() {
  var parallels = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1;
  this._parallels = parallels || 1;
  this._qC = 0;
  this._iC = /* @__PURE__ */ new Set();
  this._lHN = 0;
  this._hPM = /* @__PURE__ */ new Map();
  this._pHM = /* @__PURE__ */ new Map();
};
IdleQueue.prototype = {
  isIdle: function isIdle() {
    return this._qC < this._parallels;
  },
  /**
   * creates a lock in the queue
   * and returns an unlock-function to remove the lock from the queue
   * @return {function} unlock function than must be called afterwards
   */
  lock: function lock() {
    this._qC++;
  },
  unlock: function unlock() {
    this._qC--;
    _tryIdleCall(this);
  },
  /**
   * wraps a function with lock/unlock and runs it
   * @param  {function}  fun
   * @return {Promise<any>}
   */
  wrapCall: function wrapCall(fun) {
    var _this = this;
    this.lock();
    var maybePromise;
    try {
      maybePromise = fun();
    } catch (err) {
      this.unlock();
      throw err;
    }
    if (!maybePromise.then || typeof maybePromise.then !== "function") {
      this.unlock();
      return maybePromise;
    } else {
      return maybePromise.then(function(ret) {
        _this.unlock();
        return ret;
      })["catch"](function(err) {
        _this.unlock();
        throw err;
      });
    }
  },
  /**
   * does the same as requestIdleCallback() but uses promises instead of the callback
   * @param {{timeout?: number}} options like timeout
   * @return {Promise<void>} promise that resolves when the database is in idle-mode
   */
  requestIdlePromise: function requestIdlePromise2(options) {
    var _this2 = this;
    options = options || {};
    var resolve2;
    var prom = new Promise(function(res) {
      return resolve2 = res;
    });
    var resolveFromOutside = function resolveFromOutside2() {
      _removeIdlePromise(_this2, prom);
      resolve2();
    };
    prom._manRes = resolveFromOutside;
    if (options.timeout) {
      var timeoutObj = setTimeout(function() {
        prom._manRes();
      }, options.timeout);
      prom._timeoutObj = timeoutObj;
    }
    this._iC.add(prom);
    _tryIdleCall(this);
    return prom;
  },
  /**
   * remove the promise so it will never be resolved
   * @param  {Promise} promise from requestIdlePromise()
   * @return {void}
   */
  cancelIdlePromise: function cancelIdlePromise(promise) {
    _removeIdlePromise(this, promise);
  },
  /**
   * api equal to
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
   * @param  {Function} callback
   * @param  {options}   options  [description]
   * @return {number} handle which can be used with cancelIdleCallback()
   */
  requestIdleCallback: function requestIdleCallback2(callback, options) {
    var handle = this._lHN++;
    var promise = this.requestIdlePromise(options);
    this._hPM.set(handle, promise);
    this._pHM.set(promise, handle);
    promise.then(function() {
      return callback();
    });
    return handle;
  },
  /**
   * API equal to
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelIdleCallback
   * @param  {number} handle returned from requestIdleCallback()
   * @return {void}
   */
  cancelIdleCallback: function cancelIdleCallback(handle) {
    var promise = this._hPM.get(handle);
    this.cancelIdlePromise(promise);
  },
  /**
   * clears and resets everything
   * @return {void}
   */
  clear: function clear() {
    var _this3 = this;
    this._iC.forEach(function(promise) {
      return _removeIdlePromise(_this3, promise);
    });
    this._qC = 0;
    this._iC.clear();
    this._hPM = /* @__PURE__ */ new Map();
    this._pHM = /* @__PURE__ */ new Map();
  }
};
function _resolveOneIdleCall(idleQueue) {
  if (idleQueue._iC.size === 0) return;
  var iterator2 = idleQueue._iC.values();
  var oldestPromise = iterator2.next().value;
  oldestPromise._manRes();
  setTimeout(function() {
    return _tryIdleCall(idleQueue);
  }, 0);
}
function _removeIdlePromise(idleQueue, promise) {
  if (!promise) return;
  if (promise._timeoutObj) clearTimeout(promise._timeoutObj);
  if (idleQueue._pHM.has(promise)) {
    var handle = idleQueue._pHM.get(promise);
    idleQueue._hPM["delete"](handle);
    idleQueue._pHM["delete"](promise);
  }
  idleQueue._iC["delete"](promise);
}
function _tryIdleCall(idleQueue) {
  if (idleQueue._tryIR || idleQueue._iC.size === 0) return;
  idleQueue._tryIR = true;
  setTimeout(function() {
    if (!idleQueue.isIdle()) {
      idleQueue._tryIR = false;
      return;
    }
    setTimeout(function() {
      if (!idleQueue.isIdle()) {
        idleQueue._tryIR = false;
        return;
      }
      _resolveOneIdleCall(idleQueue);
      idleQueue._tryIR = false;
    }, 0);
  }, 0);
}
class ObliviousSet {
  constructor(ttl) {
    __publicField(this, "ttl");
    __publicField(this, "map", /* @__PURE__ */ new Map());
    /**
     * Creating calls to setTimeout() is expensive,
     * so we only do that if there is not timeout already open.
     */
    __publicField(this, "_to", false);
    this.ttl = ttl;
  }
  has(value) {
    return this.map.has(value);
  }
  add(value) {
    this.map.set(value, now());
    if (!this._to) {
      this._to = true;
      setTimeout(() => {
        this._to = false;
        removeTooOldValues(this);
      }, 0);
    }
  }
  clear() {
    this.map.clear();
  }
}
function removeTooOldValues(obliviousSet) {
  const olderThen = now() - obliviousSet.ttl;
  const iterator2 = obliviousSet.map[Symbol.iterator]();
  while (true) {
    const next = iterator2.next().value;
    if (!next) {
      return;
    }
    const value = next[0];
    const time = next[1];
    if (time < olderThen) {
      obliviousSet.map.delete(value);
    } else {
      return;
    }
  }
}
function now() {
  return Date.now();
}
var USED_DATABASE_NAMES = /* @__PURE__ */ new Set();
var RxDatabaseBase = /* @__PURE__ */ function() {
  function RxDatabaseBase2(name, token, storage2, instanceCreationOptions, password, multiInstance, eventReduce = false, options = {}, internalStore, hashFunction, cleanupPolicy, allowSlowCount, reactivity) {
    this.idleQueue = new IdleQueue();
    this.rxdbVersion = RXDB_VERSION;
    this.storageInstances = /* @__PURE__ */ new Set();
    this._subs = [];
    this.startupErrors = [];
    this.onDestroy = [];
    this.destroyed = false;
    this.collections = {};
    this.states = {};
    this.eventBulks$ = new Subject();
    this.observable$ = this.eventBulks$.pipe(mergeMap((changeEventBulk) => changeEventBulk.events));
    this.storageToken = PROMISE_RESOLVE_FALSE;
    this.storageTokenDocument = PROMISE_RESOLVE_FALSE;
    this.emittedEventBulkIds = new ObliviousSet(60 * 1e3);
    this.name = name;
    this.token = token;
    this.storage = storage2;
    this.instanceCreationOptions = instanceCreationOptions;
    this.password = password;
    this.multiInstance = multiInstance;
    this.eventReduce = eventReduce;
    this.options = options;
    this.internalStore = internalStore;
    this.hashFunction = hashFunction;
    this.cleanupPolicy = cleanupPolicy;
    this.allowSlowCount = allowSlowCount;
    this.reactivity = reactivity;
    if (this.name !== "pseudoInstance") {
      this.internalStore = getWrappedStorageInstance(this.asRxDatabase, internalStore, INTERNAL_STORE_SCHEMA);
      this.storageTokenDocument = ensureStorageTokenDocumentExists(this.asRxDatabase).catch((err) => this.startupErrors.push(err));
      this.storageToken = this.storageTokenDocument.then((doc) => doc.data.token).catch((err) => this.startupErrors.push(err));
    }
  }
  var _proto = RxDatabaseBase2.prototype;
  _proto.getReactivityFactory = function getReactivityFactory() {
    if (!this.reactivity) {
      throw newRxError("DB14", {
        database: this.name
      });
    }
    return this.reactivity;
  };
  _proto.$emit = function $emit(changeEventBulk) {
    if (this.emittedEventBulkIds.has(changeEventBulk.id)) {
      return;
    }
    this.emittedEventBulkIds.add(changeEventBulk.id);
    this.eventBulks$.next(changeEventBulk);
  };
  _proto.removeCollectionDoc = async function removeCollectionDoc(name, schema) {
    var doc = await getSingleDocument(this.internalStore, getPrimaryKeyOfInternalDocument(_collectionNamePrimary(name, schema), INTERNAL_CONTEXT_COLLECTION));
    if (!doc) {
      throw newRxError("SNH", {
        name,
        schema
      });
    }
    var writeDoc = flatCloneDocWithMeta(doc);
    writeDoc._deleted = true;
    await this.internalStore.bulkWrite([{
      document: writeDoc,
      previous: doc
    }], "rx-database-remove-collection");
  };
  _proto.addCollections = async function addCollections(collectionCreators) {
    var jsonSchemas = {};
    var schemas = {};
    var bulkPutDocs = [];
    var useArgsByCollectionName = {};
    await Promise.all(Object.entries(collectionCreators).map(async ([name, args]) => {
      var collectionName = name;
      var rxJsonSchema = args.schema;
      jsonSchemas[collectionName] = rxJsonSchema;
      var schema = createRxSchema(rxJsonSchema, this.hashFunction);
      schemas[collectionName] = schema;
      if (this.collections[name]) {
        throw newRxError("DB3", {
          name
        });
      }
      var collectionNameWithVersion = _collectionNamePrimary(name, rxJsonSchema);
      var collectionDocData = {
        id: getPrimaryKeyOfInternalDocument(collectionNameWithVersion, INTERNAL_CONTEXT_COLLECTION),
        key: collectionNameWithVersion,
        context: INTERNAL_CONTEXT_COLLECTION,
        data: {
          name: collectionName,
          schemaHash: await schema.hash,
          schema: schema.jsonSchema,
          version: schema.version,
          connectedStorages: []
        },
        _deleted: false,
        _meta: getDefaultRxDocumentMeta(),
        _rev: getDefaultRevision(),
        _attachments: {}
      };
      bulkPutDocs.push({
        document: collectionDocData
      });
      var useArgs = Object.assign({}, args, {
        name: collectionName,
        schema,
        database: this
      });
      var hookData = flatClone(args);
      hookData.database = this;
      hookData.name = name;
      runPluginHooks("preCreateRxCollection", hookData);
      useArgs.conflictHandler = hookData.conflictHandler;
      useArgsByCollectionName[collectionName] = useArgs;
    }));
    var putDocsResult = await this.internalStore.bulkWrite(bulkPutDocs, "rx-database-add-collection");
    await ensureNoStartupErrors(this);
    await Promise.all(putDocsResult.error.map(async (error) => {
      if (error.status !== 409) {
        throw newRxError("DB12", {
          database: this.name,
          writeError: error
        });
      }
      var docInDb = ensureNotFalsy(error.documentInDb);
      var collectionName = docInDb.data.name;
      var schema = schemas[collectionName];
      if (docInDb.data.schemaHash !== await schema.hash) {
        throw newRxError("DB6", {
          database: this.name,
          collection: collectionName,
          previousSchemaHash: docInDb.data.schemaHash,
          schemaHash: await schema.hash,
          previousSchema: docInDb.data.schema,
          schema: ensureNotFalsy(jsonSchemas[collectionName])
        });
      }
    }));
    var ret = {};
    await Promise.all(Object.keys(collectionCreators).map(async (collectionName) => {
      var useArgs = useArgsByCollectionName[collectionName];
      var collection = await createRxCollection(useArgs);
      ret[collectionName] = collection;
      this.collections[collectionName] = collection;
      if (!this[collectionName]) {
        Object.defineProperty(this, collectionName, {
          get: () => this.collections[collectionName]
        });
      }
    }));
    return ret;
  };
  _proto.lockedRun = function lockedRun(fn) {
    return this.idleQueue.wrapCall(fn);
  };
  _proto.requestIdlePromise = function requestIdlePromise3() {
    return this.idleQueue.requestIdlePromise();
  };
  _proto.exportJSON = function exportJSON(_collections) {
    throw pluginMissing("json-dump");
  };
  _proto.addState = function addState(_name) {
    throw pluginMissing("state");
  };
  _proto.importJSON = function importJSON(_exportedJSON) {
    throw pluginMissing("json-dump");
  };
  _proto.backup = function backup(_options) {
    throw pluginMissing("backup");
  };
  _proto.leaderElector = function leaderElector() {
    throw pluginMissing("leader-election");
  };
  _proto.isLeader = function isLeader() {
    throw pluginMissing("leader-election");
  };
  _proto.waitForLeadership = function waitForLeadership() {
    throw pluginMissing("leader-election");
  };
  _proto.migrationStates = function migrationStates() {
    throw pluginMissing("migration-schema");
  };
  _proto.destroy = async function destroy() {
    if (this.destroyed) {
      return PROMISE_RESOLVE_FALSE;
    }
    this.destroyed = true;
    await runAsyncPluginHooks("preDestroyRxDatabase", this);
    this.eventBulks$.complete();
    this._subs.map((sub) => sub.unsubscribe());
    if (this.name === "pseudoInstance") {
      return PROMISE_RESOLVE_FALSE;
    }
    return this.requestIdlePromise().then(() => Promise.all(this.onDestroy.map((fn) => fn()))).then(() => Promise.all(Object.keys(this.collections).map((key) => this.collections[key]).map((col) => col.destroy()))).then(() => this.internalStore.close()).then(() => USED_DATABASE_NAMES.delete(this.storage.name + "|" + this.name)).then(() => true);
  };
  _proto.remove = function remove() {
    return this.destroy().then(() => removeRxDatabase(this.name, this.storage, this.password));
  };
  return _createClass(RxDatabaseBase2, [{
    key: "$",
    get: function() {
      return this.observable$;
    }
  }, {
    key: "asRxDatabase",
    get: function() {
      return this;
    }
  }]);
}();
function throwIfDatabaseNameUsed(name, storage2) {
  var key = storage2.name + "|" + name;
  if (!USED_DATABASE_NAMES.has(key)) {
    return;
  } else {
    throw newRxError("DB8", {
      name,
      storage: storage2.name,
      link: "https://rxdb.info/rx-database.html#ignoreduplicate"
    });
  }
}
async function createRxDatabaseStorageInstance(databaseInstanceToken, storage2, databaseName, options, multiInstance, password) {
  var internalStore = await storage2.createStorageInstance({
    databaseInstanceToken,
    databaseName,
    collectionName: INTERNAL_STORAGE_NAME,
    schema: INTERNAL_STORE_SCHEMA,
    options,
    multiInstance,
    password,
    devMode: overwritable.isDevMode()
  });
  return internalStore;
}
function createRxDatabase({
  storage: storage2,
  instanceCreationOptions,
  name,
  password,
  multiInstance = true,
  eventReduce = true,
  ignoreDuplicate = false,
  options = {},
  cleanupPolicy,
  allowSlowCount = false,
  localDocuments = false,
  hashFunction = defaultHashSha256,
  reactivity
}) {
  runPluginHooks("preCreateRxDatabase", {
    storage: storage2,
    instanceCreationOptions,
    name,
    password,
    multiInstance,
    eventReduce,
    ignoreDuplicate,
    options,
    localDocuments
  });
  if (!ignoreDuplicate) {
    throwIfDatabaseNameUsed(name, storage2);
  }
  USED_DATABASE_NAMES.add(storage2.name + "|" + name);
  var databaseInstanceToken = randomCouchString(10);
  return createRxDatabaseStorageInstance(databaseInstanceToken, storage2, name, instanceCreationOptions, multiInstance, password).catch((err) => {
    USED_DATABASE_NAMES.delete(storage2.name + "|" + name);
    throw err;
  }).then((storageInstance) => {
    var rxDatabase = new RxDatabaseBase(name, databaseInstanceToken, storage2, instanceCreationOptions, password, multiInstance, eventReduce, options, storageInstance, hashFunction, cleanupPolicy, allowSlowCount, reactivity);
    return runAsyncPluginHooks("createRxDatabase", {
      database: rxDatabase,
      creator: {
        storage: storage2,
        instanceCreationOptions,
        name,
        password,
        multiInstance,
        eventReduce,
        ignoreDuplicate,
        options,
        localDocuments
      }
    }).then(() => rxDatabase);
  });
}
async function removeRxDatabase(databaseName, storage2, password) {
  var databaseInstanceToken = randomCouchString(10);
  var dbInternalsStorageInstance = await createRxDatabaseStorageInstance(databaseInstanceToken, storage2, databaseName, {}, false, password);
  var collectionDocs = await getAllCollectionDocuments(dbInternalsStorageInstance);
  var collectionNames = /* @__PURE__ */ new Set();
  collectionDocs.forEach((doc) => collectionNames.add(doc.data.name));
  var removedCollectionNames = Array.from(collectionNames);
  await Promise.all(removedCollectionNames.map((collectionName) => removeCollectionStorages(storage2, dbInternalsStorageInstance, databaseInstanceToken, databaseName, collectionName, password)));
  await runAsyncPluginHooks("postRemoveRxDatabase", {
    databaseName,
    storage: storage2
  });
  await dbInternalsStorageInstance.remove();
  return removedCollectionNames;
}
function isRxDatabase(obj) {
  return obj instanceof RxDatabaseBase;
}
async function ensureNoStartupErrors(rxDatabase) {
  await rxDatabase.storageToken;
  if (rxDatabase.startupErrors[0]) {
    throw rxDatabase.startupErrors[0];
  }
}
var PROTOTYPES = {
  RxSchema: RxSchema.prototype,
  RxDocument: basePrototype,
  RxQuery: RxQueryBase.prototype,
  RxCollection: RxCollectionBase.prototype,
  RxDatabase: RxDatabaseBase.prototype
};
var ADDED_PLUGINS = /* @__PURE__ */ new Set();
var ADDED_PLUGIN_NAMES = /* @__PURE__ */ new Set();
function addRxPlugin(plugin) {
  runPluginHooks("preAddRxPlugin", {
    plugin,
    plugins: ADDED_PLUGINS
  });
  if (ADDED_PLUGINS.has(plugin)) {
    return;
  } else {
    if (ADDED_PLUGIN_NAMES.has(plugin.name)) {
      throw newRxError("PL3", {
        name: plugin.name,
        plugin
      });
    }
    ADDED_PLUGINS.add(plugin);
    ADDED_PLUGIN_NAMES.add(plugin.name);
  }
  if (!plugin.rxdb) {
    throw newRxTypeError("PL1", {
      plugin
    });
  }
  if (plugin.init) {
    plugin.init();
  }
  if (plugin.prototypes) {
    Object.entries(plugin.prototypes).forEach(([name, fun]) => {
      return fun(PROTOTYPES[name]);
    });
  }
  if (plugin.overwritable) {
    Object.assign(overwritable, plugin.overwritable);
  }
  if (plugin.hooks) {
    Object.entries(plugin.hooks).forEach(([name, hooksObj]) => {
      if (hooksObj.after) {
        HOOKS[name].push(hooksObj.after);
      }
      if (hooksObj.before) {
        HOOKS[name].unshift(hooksObj.before);
      }
    });
  }
}
function isPromise(obj) {
  return obj && typeof obj.then === "function";
}
Promise.resolve(false);
var PROMISE_RESOLVED_TRUE = Promise.resolve(true);
var PROMISE_RESOLVED_VOID = Promise.resolve();
function sleep(time, resolveWith) {
  if (!time) time = 0;
  return new Promise(function(res) {
    return setTimeout(function() {
      return res(resolveWith);
    }, time);
  });
}
function randomInt(min, max2) {
  return Math.floor(Math.random() * (max2 - min + 1) + min);
}
function randomToken() {
  return Math.random().toString(36).substring(2);
}
var lastMs = 0;
function microSeconds$4() {
  var ret = Date.now() * 1e3;
  if (ret <= lastMs) {
    ret = lastMs + 1;
  }
  lastMs = ret;
  return ret;
}
function supportsWebLockAPI() {
  if (typeof navigator !== "undefined" && typeof navigator.locks !== "undefined" && typeof navigator.locks.request === "function") {
    return true;
  } else {
    return false;
  }
}
var microSeconds$3 = microSeconds$4;
var type$4 = "native";
function create$3(channelName) {
  var state = {
    time: microSeconds$4(),
    messagesCallback: null,
    bc: new BroadcastChannel(channelName),
    subFns: []
    // subscriberFunctions
  };
  state.bc.onmessage = function(msgEvent) {
    if (state.messagesCallback) {
      state.messagesCallback(msgEvent.data);
    }
  };
  return state;
}
function close$3(channelState) {
  channelState.bc.close();
  channelState.subFns = [];
}
function postMessage$3(channelState, messageJson) {
  try {
    channelState.bc.postMessage(messageJson, false);
    return PROMISE_RESOLVED_VOID;
  } catch (err) {
    return Promise.reject(err);
  }
}
function onMessage$3(channelState, fn) {
  channelState.messagesCallback = fn;
}
function canBeUsed$3() {
  if (typeof globalThis !== "undefined" && globalThis.Deno && globalThis.Deno.args) {
    return true;
  }
  if ((typeof window !== "undefined" || typeof self !== "undefined") && typeof BroadcastChannel === "function") {
    if (BroadcastChannel._pubkey) {
      throw new Error("BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill");
    }
    return true;
  } else {
    return false;
  }
}
function averageResponseTime$3() {
  return 150;
}
var NativeMethod = {
  create: create$3,
  close: close$3,
  onMessage: onMessage$3,
  postMessage: postMessage$3,
  canBeUsed: canBeUsed$3,
  type: type$4,
  averageResponseTime: averageResponseTime$3,
  microSeconds: microSeconds$3
};
function fillOptionsWithDefaults$1() {
  var originalOptions = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  var options = JSON.parse(JSON.stringify(originalOptions));
  if (typeof options.webWorkerSupport === "undefined") options.webWorkerSupport = true;
  if (!options.idb) options.idb = {};
  if (!options.idb.ttl) options.idb.ttl = 1e3 * 45;
  if (!options.idb.fallbackInterval) options.idb.fallbackInterval = 150;
  if (originalOptions.idb && typeof originalOptions.idb.onclose === "function") options.idb.onclose = originalOptions.idb.onclose;
  if (!options.localstorage) options.localstorage = {};
  if (!options.localstorage.removeTimeout) options.localstorage.removeTimeout = 1e3 * 60;
  if (originalOptions.methods) options.methods = originalOptions.methods;
  if (!options.node) options.node = {};
  if (!options.node.ttl) options.node.ttl = 1e3 * 60 * 2;
  if (!options.node.maxParallelWrites) options.node.maxParallelWrites = 2048;
  if (typeof options.node.useFastPath === "undefined") options.node.useFastPath = true;
  return options;
}
var microSeconds$2 = microSeconds$4;
var DB_PREFIX = "pubkey.broadcast-channel-0-";
var OBJECT_STORE_ID = "messages";
var TRANSACTION_SETTINGS = {
  durability: "relaxed"
};
var type$3 = "idb";
function getIdb() {
  if (typeof indexedDB !== "undefined") return indexedDB;
  if (typeof window !== "undefined") {
    if (typeof window.mozIndexedDB !== "undefined") return window.mozIndexedDB;
    if (typeof window.webkitIndexedDB !== "undefined") return window.webkitIndexedDB;
    if (typeof window.msIndexedDB !== "undefined") return window.msIndexedDB;
  }
  return false;
}
function commitIndexedDBTransaction(tx) {
  if (tx.commit) {
    tx.commit();
  }
}
function createDatabase(channelName) {
  var IndexedDB = getIdb();
  var dbName = DB_PREFIX + channelName;
  var openRequest = IndexedDB.open(dbName);
  openRequest.onupgradeneeded = function(ev) {
    var db = ev.target.result;
    db.createObjectStore(OBJECT_STORE_ID, {
      keyPath: "id",
      autoIncrement: true
    });
  };
  return new Promise(function(res, rej) {
    openRequest.onerror = function(ev) {
      return rej(ev);
    };
    openRequest.onsuccess = function() {
      res(openRequest.result);
    };
  });
}
function writeMessage(db, readerUuid, messageJson) {
  var time = Date.now();
  var writeObject = {
    uuid: readerUuid,
    time,
    data: messageJson
  };
  var tx = db.transaction([OBJECT_STORE_ID], "readwrite", TRANSACTION_SETTINGS);
  return new Promise(function(res, rej) {
    tx.oncomplete = function() {
      return res();
    };
    tx.onerror = function(ev) {
      return rej(ev);
    };
    var objectStore = tx.objectStore(OBJECT_STORE_ID);
    objectStore.add(writeObject);
    commitIndexedDBTransaction(tx);
  });
}
function getMessagesHigherThan(db, lastCursorId) {
  var tx = db.transaction(OBJECT_STORE_ID, "readonly", TRANSACTION_SETTINGS);
  var objectStore = tx.objectStore(OBJECT_STORE_ID);
  var ret = [];
  var keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);
  if (objectStore.getAll) {
    var getAllRequest = objectStore.getAll(keyRangeValue);
    return new Promise(function(res, rej) {
      getAllRequest.onerror = function(err) {
        return rej(err);
      };
      getAllRequest.onsuccess = function(e) {
        res(e.target.result);
      };
    });
  }
  function openCursor() {
    try {
      keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);
      return objectStore.openCursor(keyRangeValue);
    } catch (e) {
      return objectStore.openCursor();
    }
  }
  return new Promise(function(res, rej) {
    var openCursorRequest = openCursor();
    openCursorRequest.onerror = function(err) {
      return rej(err);
    };
    openCursorRequest.onsuccess = function(ev) {
      var cursor = ev.target.result;
      if (cursor) {
        if (cursor.value.id < lastCursorId + 1) {
          cursor["continue"](lastCursorId + 1);
        } else {
          ret.push(cursor.value);
          cursor["continue"]();
        }
      } else {
        commitIndexedDBTransaction(tx);
        res(ret);
      }
    };
  });
}
function removeMessagesById(channelState, ids) {
  if (channelState.closed) {
    return Promise.resolve([]);
  }
  var tx = channelState.db.transaction(OBJECT_STORE_ID, "readwrite", TRANSACTION_SETTINGS);
  var objectStore = tx.objectStore(OBJECT_STORE_ID);
  return Promise.all(ids.map(function(id) {
    var deleteRequest = objectStore["delete"](id);
    return new Promise(function(res) {
      deleteRequest.onsuccess = function() {
        return res();
      };
    });
  }));
}
function getOldMessages(db, ttl) {
  var olderThen = Date.now() - ttl;
  var tx = db.transaction(OBJECT_STORE_ID, "readonly", TRANSACTION_SETTINGS);
  var objectStore = tx.objectStore(OBJECT_STORE_ID);
  var ret = [];
  return new Promise(function(res) {
    objectStore.openCursor().onsuccess = function(ev) {
      var cursor = ev.target.result;
      if (cursor) {
        var msgObk = cursor.value;
        if (msgObk.time < olderThen) {
          ret.push(msgObk);
          cursor["continue"]();
        } else {
          commitIndexedDBTransaction(tx);
          res(ret);
        }
      } else {
        res(ret);
      }
    };
  });
}
function cleanOldMessages(channelState) {
  return getOldMessages(channelState.db, channelState.options.idb.ttl).then(function(tooOld) {
    return removeMessagesById(channelState, tooOld.map(function(msg) {
      return msg.id;
    }));
  });
}
function create$2(channelName, options) {
  options = fillOptionsWithDefaults$1(options);
  return createDatabase(channelName).then(function(db) {
    var state = {
      closed: false,
      lastCursorId: 0,
      channelName,
      options,
      uuid: randomToken(),
      /**
       * emittedMessagesIds
       * contains all messages that have been emitted before
       * @type {ObliviousSet}
       */
      eMIs: new ObliviousSet(options.idb.ttl * 2),
      // ensures we do not read messages in parallel
      writeBlockPromise: PROMISE_RESOLVED_VOID,
      messagesCallback: null,
      readQueuePromises: [],
      db
    };
    db.onclose = function() {
      state.closed = true;
      if (options.idb.onclose) options.idb.onclose();
    };
    _readLoop(state);
    return state;
  });
}
function _readLoop(state) {
  if (state.closed) return;
  readNewMessages(state).then(function() {
    return sleep(state.options.idb.fallbackInterval);
  }).then(function() {
    return _readLoop(state);
  });
}
function _filterMessage(msgObj, state) {
  if (msgObj.uuid === state.uuid) return false;
  if (state.eMIs.has(msgObj.id)) return false;
  if (msgObj.data.time < state.messagesCallbackTime) return false;
  return true;
}
function readNewMessages(state) {
  if (state.closed) return PROMISE_RESOLVED_VOID;
  if (!state.messagesCallback) return PROMISE_RESOLVED_VOID;
  return getMessagesHigherThan(state.db, state.lastCursorId).then(function(newerMessages) {
    var useMessages = newerMessages.filter(function(msgObj) {
      return !!msgObj;
    }).map(function(msgObj) {
      if (msgObj.id > state.lastCursorId) {
        state.lastCursorId = msgObj.id;
      }
      return msgObj;
    }).filter(function(msgObj) {
      return _filterMessage(msgObj, state);
    }).sort(function(msgObjA, msgObjB) {
      return msgObjA.time - msgObjB.time;
    });
    useMessages.forEach(function(msgObj) {
      if (state.messagesCallback) {
        state.eMIs.add(msgObj.id);
        state.messagesCallback(msgObj.data);
      }
    });
    return PROMISE_RESOLVED_VOID;
  });
}
function close$2(channelState) {
  channelState.closed = true;
  channelState.db.close();
}
function postMessage$2(channelState, messageJson) {
  channelState.writeBlockPromise = channelState.writeBlockPromise.then(function() {
    return writeMessage(channelState.db, channelState.uuid, messageJson);
  }).then(function() {
    if (randomInt(0, 10) === 0) {
      cleanOldMessages(channelState);
    }
  });
  return channelState.writeBlockPromise;
}
function onMessage$2(channelState, fn, time) {
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
  readNewMessages(channelState);
}
function canBeUsed$2() {
  return !!getIdb();
}
function averageResponseTime$2(options) {
  return options.idb.fallbackInterval * 2;
}
var IndexedDBMethod = {
  create: create$2,
  close: close$2,
  onMessage: onMessage$2,
  postMessage: postMessage$2,
  canBeUsed: canBeUsed$2,
  type: type$3,
  averageResponseTime: averageResponseTime$2,
  microSeconds: microSeconds$2
};
var microSeconds$1 = microSeconds$4;
var KEY_PREFIX = "pubkey.broadcastChannel-";
var type$2 = "localstorage";
function getLocalStorage() {
  var localStorage;
  if (typeof window === "undefined") return null;
  try {
    localStorage = window.localStorage;
    localStorage = window["ie8-eventlistener/storage"] || window.localStorage;
  } catch (e) {
  }
  return localStorage;
}
function storageKey(channelName) {
  return KEY_PREFIX + channelName;
}
function postMessage$1(channelState, messageJson) {
  return new Promise(function(res) {
    sleep().then(function() {
      var key = storageKey(channelState.channelName);
      var writeObj = {
        token: randomToken(),
        time: Date.now(),
        data: messageJson,
        uuid: channelState.uuid
      };
      var value = JSON.stringify(writeObj);
      getLocalStorage().setItem(key, value);
      var ev = document.createEvent("Event");
      ev.initEvent("storage", true, true);
      ev.key = key;
      ev.newValue = value;
      window.dispatchEvent(ev);
      res();
    });
  });
}
function addStorageEventListener(channelName, fn) {
  var key = storageKey(channelName);
  var listener = function listener2(ev) {
    if (ev.key === key) {
      fn(JSON.parse(ev.newValue));
    }
  };
  window.addEventListener("storage", listener);
  return listener;
}
function removeStorageEventListener(listener) {
  window.removeEventListener("storage", listener);
}
function create$1(channelName, options) {
  options = fillOptionsWithDefaults$1(options);
  if (!canBeUsed$1()) {
    throw new Error("BroadcastChannel: localstorage cannot be used");
  }
  var uuid = randomToken();
  var eMIs = new ObliviousSet(options.localstorage.removeTimeout);
  var state = {
    channelName,
    uuid,
    eMIs
    // emittedMessagesIds
  };
  state.listener = addStorageEventListener(channelName, function(msgObj) {
    if (!state.messagesCallback) return;
    if (msgObj.uuid === uuid) return;
    if (!msgObj.token || eMIs.has(msgObj.token)) return;
    if (msgObj.data.time && msgObj.data.time < state.messagesCallbackTime) return;
    eMIs.add(msgObj.token);
    state.messagesCallback(msgObj.data);
  });
  return state;
}
function close$1(channelState) {
  removeStorageEventListener(channelState.listener);
}
function onMessage$1(channelState, fn, time) {
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
}
function canBeUsed$1() {
  var ls = getLocalStorage();
  if (!ls) return false;
  try {
    var key = "__broadcastchannel_check";
    ls.setItem(key, "works");
    ls.removeItem(key);
  } catch (e) {
    return false;
  }
  return true;
}
function averageResponseTime$1() {
  var defaultTime = 120;
  var userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
    return defaultTime * 2;
  }
  return defaultTime;
}
var LocalstorageMethod = {
  create: create$1,
  close: close$1,
  onMessage: onMessage$1,
  postMessage: postMessage$1,
  canBeUsed: canBeUsed$1,
  type: type$2,
  averageResponseTime: averageResponseTime$1,
  microSeconds: microSeconds$1
};
var microSeconds = microSeconds$4;
var type$1 = "simulate";
var SIMULATE_CHANNELS = /* @__PURE__ */ new Set();
function create(channelName) {
  var state = {
    time: microSeconds(),
    name: channelName,
    messagesCallback: null
  };
  SIMULATE_CHANNELS.add(state);
  return state;
}
function close(channelState) {
  SIMULATE_CHANNELS["delete"](channelState);
}
var SIMULATE_DELAY_TIME = 5;
function postMessage(channelState, messageJson) {
  return new Promise(function(res) {
    return setTimeout(function() {
      var channelArray = Array.from(SIMULATE_CHANNELS);
      channelArray.forEach(function(channel) {
        if (channel.name === channelState.name && // has same name
        channel !== channelState && // not own channel
        !!channel.messagesCallback && // has subscribers
        channel.time < messageJson.time) {
          channel.messagesCallback(messageJson);
        }
      });
      res();
    }, SIMULATE_DELAY_TIME);
  });
}
function onMessage(channelState, fn) {
  channelState.messagesCallback = fn;
}
function canBeUsed() {
  return true;
}
function averageResponseTime() {
  return SIMULATE_DELAY_TIME;
}
var SimulateMethod = {
  create,
  close,
  onMessage,
  postMessage,
  canBeUsed,
  type: type$1,
  averageResponseTime,
  microSeconds
};
var METHODS = [
  NativeMethod,
  // fastest
  IndexedDBMethod,
  LocalstorageMethod
];
function chooseMethod(options) {
  var chooseMethods = [].concat(options.methods, METHODS).filter(Boolean);
  if (options.type) {
    if (options.type === "simulate") {
      return SimulateMethod;
    }
    var ret = chooseMethods.find(function(m2) {
      return m2.type === options.type;
    });
    if (!ret) throw new Error("method-type " + options.type + " not found");
    else return ret;
  }
  if (!options.webWorkerSupport) {
    chooseMethods = chooseMethods.filter(function(m2) {
      return m2.type !== "idb";
    });
  }
  var useMethod = chooseMethods.find(function(method) {
    return method.canBeUsed();
  });
  if (!useMethod) {
    throw new Error("No usable method found in " + JSON.stringify(METHODS.map(function(m2) {
      return m2.type;
    })));
  } else {
    return useMethod;
  }
}
var OPEN_BROADCAST_CHANNELS = /* @__PURE__ */ new Set();
var lastId = 0;
var BroadcastChannel$1 = function BroadcastChannel2(name, options) {
  this.id = lastId++;
  OPEN_BROADCAST_CHANNELS.add(this);
  this.name = name;
  if (ENFORCED_OPTIONS) {
    options = ENFORCED_OPTIONS;
  }
  this.options = fillOptionsWithDefaults$1(options);
  this.method = chooseMethod(this.options);
  this._iL = false;
  this._onML = null;
  this._addEL = {
    message: [],
    internal: []
  };
  this._uMP = /* @__PURE__ */ new Set();
  this._befC = [];
  this._prepP = null;
  _prepareChannel(this);
};
BroadcastChannel$1._pubkey = true;
var ENFORCED_OPTIONS;
BroadcastChannel$1.prototype = {
  postMessage: function postMessage2(msg) {
    if (this.closed) {
      throw new Error("BroadcastChannel.postMessage(): Cannot post message after channel has closed " + /**
       * In the past when this error appeared, it was really hard to debug.
       * So now we log the msg together with the error so it at least
       * gives some clue about where in your application this happens.
       */
      JSON.stringify(msg));
    }
    return _post(this, "message", msg);
  },
  postInternal: function postInternal(msg) {
    return _post(this, "internal", msg);
  },
  set onmessage(fn) {
    var time = this.method.microSeconds();
    var listenObj = {
      time,
      fn
    };
    _removeListenerObject(this, "message", this._onML);
    if (fn && typeof fn === "function") {
      this._onML = listenObj;
      _addListenerObject(this, "message", listenObj);
    } else {
      this._onML = null;
    }
  },
  addEventListener: function addEventListener2(type2, fn) {
    var time = this.method.microSeconds();
    var listenObj = {
      time,
      fn
    };
    _addListenerObject(this, type2, listenObj);
  },
  removeEventListener: function removeEventListener(type2, fn) {
    var obj = this._addEL[type2].find(function(obj2) {
      return obj2.fn === fn;
    });
    _removeListenerObject(this, type2, obj);
  },
  close: function close2() {
    var _this = this;
    if (this.closed) {
      return;
    }
    OPEN_BROADCAST_CHANNELS["delete"](this);
    this.closed = true;
    var awaitPrepare = this._prepP ? this._prepP : PROMISE_RESOLVED_VOID;
    this._onML = null;
    this._addEL.message = [];
    return awaitPrepare.then(function() {
      return Promise.all(Array.from(_this._uMP));
    }).then(function() {
      return Promise.all(_this._befC.map(function(fn) {
        return fn();
      }));
    }).then(function() {
      return _this.method.close(_this._state);
    });
  },
  get type() {
    return this.method.type;
  },
  get isClosed() {
    return this.closed;
  }
};
function _post(broadcastChannel, type2, msg) {
  var time = broadcastChannel.method.microSeconds();
  var msgObj = {
    time,
    type: type2,
    data: msg
  };
  var awaitPrepare = broadcastChannel._prepP ? broadcastChannel._prepP : PROMISE_RESOLVED_VOID;
  return awaitPrepare.then(function() {
    var sendPromise = broadcastChannel.method.postMessage(broadcastChannel._state, msgObj);
    broadcastChannel._uMP.add(sendPromise);
    sendPromise["catch"]().then(function() {
      return broadcastChannel._uMP["delete"](sendPromise);
    });
    return sendPromise;
  });
}
function _prepareChannel(channel) {
  var maybePromise = channel.method.create(channel.name, channel.options);
  if (isPromise(maybePromise)) {
    channel._prepP = maybePromise;
    maybePromise.then(function(s2) {
      channel._state = s2;
    });
  } else {
    channel._state = maybePromise;
  }
}
function _hasMessageListeners(channel) {
  if (channel._addEL.message.length > 0) return true;
  if (channel._addEL.internal.length > 0) return true;
  return false;
}
function _addListenerObject(channel, type2, obj) {
  channel._addEL[type2].push(obj);
  _startListening(channel);
}
function _removeListenerObject(channel, type2, obj) {
  channel._addEL[type2] = channel._addEL[type2].filter(function(o) {
    return o !== obj;
  });
  _stopListening(channel);
}
function _startListening(channel) {
  if (!channel._iL && _hasMessageListeners(channel)) {
    var listenerFn = function listenerFn2(msgObj) {
      channel._addEL[msgObj.type].forEach(function(listenerObject) {
        if (msgObj.time >= listenerObject.time) {
          listenerObject.fn(msgObj.data);
        }
      });
    };
    var time = channel.method.microSeconds();
    if (channel._prepP) {
      channel._prepP.then(function() {
        channel._iL = true;
        channel.method.onMessage(channel._state, listenerFn, time);
      });
    } else {
      channel._iL = true;
      channel.method.onMessage(channel._state, listenerFn, time);
    }
  }
}
function _stopListening(channel) {
  if (channel._iL && !_hasMessageListeners(channel)) {
    channel._iL = false;
    var time = channel.method.microSeconds();
    channel.method.onMessage(channel._state, null, time);
  }
}
function addBrowser(fn) {
  if (typeof WorkerGlobalScope === "function" && self instanceof WorkerGlobalScope) {
    var oldClose = self.close.bind(self);
    self.close = function() {
      fn();
      return oldClose();
    };
  } else {
    if (typeof window.addEventListener !== "function") {
      return;
    }
    window.addEventListener("beforeunload", function() {
      fn();
    }, true);
    window.addEventListener("unload", function() {
      fn();
    }, true);
  }
}
function addNode(fn) {
  process.on("exit", function() {
    return fn();
  });
  process.on("beforeExit", function() {
    return fn().then(function() {
      return process.exit();
    });
  });
  process.on("SIGINT", function() {
    return fn().then(function() {
      return process.exit();
    });
  });
  process.on("uncaughtException", function(err) {
    return fn().then(function() {
      console.trace(err);
      process.exit(101);
    });
  });
}
var isNode$1 = Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
var USE_METHOD = isNode$1 ? addNode : addBrowser;
var LISTENERS = /* @__PURE__ */ new Set();
var startedListening = false;
function startListening() {
  if (startedListening) {
    return;
  }
  startedListening = true;
  USE_METHOD(runAll);
}
function add(fn) {
  startListening();
  if (typeof fn !== "function") {
    throw new Error("Listener is no function");
  }
  LISTENERS.add(fn);
  var addReturn = {
    remove: function remove() {
      return LISTENERS["delete"](fn);
    },
    run: function run() {
      LISTENERS["delete"](fn);
      return fn();
    }
  };
  return addReturn;
}
function runAll() {
  var promises = [];
  LISTENERS.forEach(function(fn) {
    promises.push(fn());
    LISTENERS["delete"](fn);
  });
  return Promise.all(promises);
}
function sendLeaderMessage(leaderElector, action) {
  var msgJson = {
    context: "leader",
    action,
    token: leaderElector.token
  };
  return leaderElector.broadcastChannel.postInternal(msgJson);
}
function beLeader(leaderElector) {
  leaderElector.isLeader = true;
  leaderElector._hasLeader = true;
  var unloadFn = add(function() {
    return leaderElector.die();
  });
  leaderElector._unl.push(unloadFn);
  var isLeaderListener = function isLeaderListener2(msg) {
    if (msg.context === "leader" && msg.action === "apply") {
      sendLeaderMessage(leaderElector, "tell");
    }
    if (msg.context === "leader" && msg.action === "tell" && !leaderElector._dpLC) {
      leaderElector._dpLC = true;
      leaderElector._dpL();
      sendLeaderMessage(leaderElector, "tell");
    }
  };
  leaderElector.broadcastChannel.addEventListener("internal", isLeaderListener);
  leaderElector._lstns.push(isLeaderListener);
  return sendLeaderMessage(leaderElector, "tell");
}
var LeaderElectionWebLock = function LeaderElectionWebLock2(broadcastChannel, options) {
  var _this = this;
  this.broadcastChannel = broadcastChannel;
  broadcastChannel._befC.push(function() {
    return _this.die();
  });
  this._options = options;
  this.isLeader = false;
  this.isDead = false;
  this.token = randomToken();
  this._lstns = [];
  this._unl = [];
  this._dpL = function() {
  };
  this._dpLC = false;
  this._wKMC = {};
  this.lN = "pubkey-bc||" + broadcastChannel.method.type + "||" + broadcastChannel.name;
};
LeaderElectionWebLock.prototype = {
  hasLeader: function hasLeader() {
    var _this2 = this;
    return navigator.locks.query().then(function(locks) {
      var relevantLocks = locks.held ? locks.held.filter(function(lock2) {
        return lock2.name === _this2.lN;
      }) : [];
      if (relevantLocks && relevantLocks.length > 0) {
        return true;
      } else {
        return false;
      }
    });
  },
  awaitLeadership: function awaitLeadership() {
    var _this3 = this;
    if (!this._wLMP) {
      this._wKMC.c = new AbortController();
      var returnPromise = new Promise(function(res, rej) {
        _this3._wKMC.res = res;
        _this3._wKMC.rej = rej;
      });
      this._wLMP = new Promise(function(res) {
        navigator.locks.request(_this3.lN, {
          signal: _this3._wKMC.c.signal
        }, function() {
          _this3._wKMC.c = void 0;
          beLeader(_this3);
          res();
          return returnPromise;
        })["catch"](function() {
        });
      });
    }
    return this._wLMP;
  },
  set onduplicate(_fn) {
  },
  die: function die() {
    var _this4 = this;
    this._lstns.forEach(function(listener) {
      return _this4.broadcastChannel.removeEventListener("internal", listener);
    });
    this._lstns = [];
    this._unl.forEach(function(uFn) {
      return uFn.remove();
    });
    this._unl = [];
    if (this.isLeader) {
      this.isLeader = false;
    }
    this.isDead = true;
    if (this._wKMC.res) {
      this._wKMC.res();
    }
    if (this._wKMC.c) {
      this._wKMC.c.abort("LeaderElectionWebLock.die() called");
    }
    return sendLeaderMessage(this, "death");
  }
};
var LeaderElection = function LeaderElection2(broadcastChannel, options) {
  var _this = this;
  this.broadcastChannel = broadcastChannel;
  this._options = options;
  this.isLeader = false;
  this._hasLeader = false;
  this.isDead = false;
  this.token = randomToken();
  this._aplQ = PROMISE_RESOLVED_VOID;
  this._aplQC = 0;
  this._unl = [];
  this._lstns = [];
  this._dpL = function() {
  };
  this._dpLC = false;
  var hasLeaderListener = function hasLeaderListener2(msg) {
    if (msg.context === "leader") {
      if (msg.action === "death") {
        _this._hasLeader = false;
      }
      if (msg.action === "tell") {
        _this._hasLeader = true;
      }
    }
  };
  this.broadcastChannel.addEventListener("internal", hasLeaderListener);
  this._lstns.push(hasLeaderListener);
};
LeaderElection.prototype = {
  hasLeader: function hasLeader2() {
    return Promise.resolve(this._hasLeader);
  },
  /**
   * Returns true if the instance is leader,
   * false if not.
   * @async
   */
  applyOnce: function applyOnce(isFromFallbackInterval) {
    var _this2 = this;
    if (this.isLeader) {
      return sleep(0, true);
    }
    if (this.isDead) {
      return sleep(0, false);
    }
    if (this._aplQC > 1) {
      return this._aplQ;
    }
    var applyRun = function applyRun2() {
      if (_this2.isLeader) {
        return PROMISE_RESOLVED_TRUE;
      }
      var stopCriteria = false;
      var stopCriteriaPromiseResolve;
      var stopCriteriaPromise = new Promise(function(res) {
        stopCriteriaPromiseResolve = function stopCriteriaPromiseResolve2() {
          stopCriteria = true;
          res();
        };
      });
      var handleMessage = function handleMessage2(msg) {
        if (msg.context === "leader" && msg.token != _this2.token) {
          if (msg.action === "apply") {
            if (msg.token > _this2.token) {
              stopCriteriaPromiseResolve();
            }
          }
          if (msg.action === "tell") {
            stopCriteriaPromiseResolve();
            _this2._hasLeader = true;
          }
        }
      };
      _this2.broadcastChannel.addEventListener("internal", handleMessage);
      var waitForAnswerTime = isFromFallbackInterval ? _this2._options.responseTime * 4 : _this2._options.responseTime;
      return sendLeaderMessage(_this2, "apply").then(function() {
        return Promise.race([sleep(waitForAnswerTime), stopCriteriaPromise.then(function() {
          return Promise.reject(new Error());
        })]);
      }).then(function() {
        return sendLeaderMessage(_this2, "apply");
      }).then(function() {
        return Promise.race([sleep(waitForAnswerTime), stopCriteriaPromise.then(function() {
          return Promise.reject(new Error());
        })]);
      })["catch"](function() {
      }).then(function() {
        _this2.broadcastChannel.removeEventListener("internal", handleMessage);
        if (!stopCriteria) {
          return beLeader(_this2).then(function() {
            return true;
          });
        } else {
          return false;
        }
      });
    };
    this._aplQC = this._aplQC + 1;
    this._aplQ = this._aplQ.then(function() {
      return applyRun();
    }).then(function() {
      _this2._aplQC = _this2._aplQC - 1;
    });
    return this._aplQ.then(function() {
      return _this2.isLeader;
    });
  },
  awaitLeadership: function awaitLeadership2() {
    if (
      /* _awaitLeadershipPromise */
      !this._aLP
    ) {
      this._aLP = _awaitLeadershipOnce(this);
    }
    return this._aLP;
  },
  set onduplicate(fn) {
    this._dpL = fn;
  },
  die: function die2() {
    var _this3 = this;
    this._lstns.forEach(function(listener) {
      return _this3.broadcastChannel.removeEventListener("internal", listener);
    });
    this._lstns = [];
    this._unl.forEach(function(uFn) {
      return uFn.remove();
    });
    this._unl = [];
    if (this.isLeader) {
      this._hasLeader = false;
      this.isLeader = false;
    }
    this.isDead = true;
    return sendLeaderMessage(this, "death");
  }
};
function _awaitLeadershipOnce(leaderElector) {
  if (leaderElector.isLeader) {
    return PROMISE_RESOLVED_VOID;
  }
  return new Promise(function(res) {
    var resolved = false;
    function finish() {
      if (resolved) {
        return;
      }
      resolved = true;
      leaderElector.broadcastChannel.removeEventListener("internal", whenDeathListener);
      res(true);
    }
    leaderElector.applyOnce().then(function() {
      if (leaderElector.isLeader) {
        finish();
      }
    });
    var tryOnFallBack = function tryOnFallBack2() {
      return sleep(leaderElector._options.fallbackInterval).then(function() {
        if (leaderElector.isDead || resolved) {
          return;
        }
        if (leaderElector.isLeader) {
          finish();
        } else {
          return leaderElector.applyOnce(true).then(function() {
            if (leaderElector.isLeader) {
              finish();
            } else {
              tryOnFallBack2();
            }
          });
        }
      });
    };
    tryOnFallBack();
    var whenDeathListener = function whenDeathListener2(msg) {
      if (msg.context === "leader" && msg.action === "death") {
        leaderElector._hasLeader = false;
        leaderElector.applyOnce().then(function() {
          if (leaderElector.isLeader) {
            finish();
          }
        });
      }
    };
    leaderElector.broadcastChannel.addEventListener("internal", whenDeathListener);
    leaderElector._lstns.push(whenDeathListener);
  });
}
function fillOptionsWithDefaults(options, channel) {
  if (!options) options = {};
  options = JSON.parse(JSON.stringify(options));
  if (!options.fallbackInterval) {
    options.fallbackInterval = 3e3;
  }
  if (!options.responseTime) {
    options.responseTime = channel.method.averageResponseTime(channel.options);
  }
  return options;
}
function createLeaderElection(channel, options) {
  if (channel._leaderElector) {
    throw new Error("BroadcastChannel already has a leader-elector");
  }
  options = fillOptionsWithDefaults(options, channel);
  var elector = supportsWebLockAPI() ? new LeaderElectionWebLock(channel, options) : new LeaderElection(channel, options);
  channel._befC.push(function() {
    return elector.die();
  });
  channel._leaderElector = elector;
  return elector;
}
function getIndexMeta(schema, index) {
  var fieldNameProperties = index.map((fieldName) => {
    var schemaPart = getSchemaByObjectPath(schema, fieldName);
    if (!schemaPart) {
      throw new Error("not in schema: " + fieldName);
    }
    var type2 = schemaPart.type;
    var parsedLengths;
    if (type2 === "number" || type2 === "integer") {
      parsedLengths = getStringLengthOfIndexNumber(schemaPart);
    }
    var getValue2 = objectPathMonad(fieldName);
    var maxLength = schemaPart.maxLength ? schemaPart.maxLength : 0;
    var getIndexStringPart;
    if (type2 === "string") {
      getIndexStringPart = (docData) => {
        var fieldValue = getValue2(docData);
        if (!fieldValue) {
          fieldValue = "";
        }
        return fieldValue.padEnd(maxLength, " ");
      };
    } else if (type2 === "boolean") {
      getIndexStringPart = (docData) => {
        var fieldValue = getValue2(docData);
        return fieldValue ? "1" : "0";
      };
    } else {
      getIndexStringPart = (docData) => {
        var fieldValue = getValue2(docData);
        return getNumberIndexString(parsedLengths, fieldValue);
      };
    }
    var ret = {
      fieldName,
      schemaPart,
      parsedLengths,
      getValue: getValue2,
      getIndexStringPart
    };
    return ret;
  });
  return fieldNameProperties;
}
function getIndexableStringMonad(schema, index) {
  var fieldNameProperties = getIndexMeta(schema, index);
  var fieldNamePropertiesAmount = fieldNameProperties.length;
  var indexPartsFunctions = fieldNameProperties.map((r2) => r2.getIndexStringPart);
  var ret = function(docData) {
    var str = "";
    for (var i = 0; i < fieldNamePropertiesAmount; ++i) {
      str += indexPartsFunctions[i](docData);
    }
    return str;
  };
  return ret;
}
function getStringLengthOfIndexNumber(schemaPart) {
  var minimum = Math.floor(schemaPart.minimum);
  var maximum = Math.ceil(schemaPart.maximum);
  var multipleOf = schemaPart.multipleOf;
  var valueSpan = maximum - minimum;
  var nonDecimals = valueSpan.toString().length;
  var multipleOfParts = multipleOf.toString().split(".");
  var decimals = 0;
  if (multipleOfParts.length > 1) {
    decimals = multipleOfParts[1].length;
  }
  return {
    minimum,
    maximum,
    nonDecimals,
    decimals,
    roundedMinimum: minimum
  };
}
function getIndexStringLength(schema, index) {
  var fieldNameProperties = getIndexMeta(schema, index);
  var length = 0;
  fieldNameProperties.forEach((props) => {
    var schemaPart = props.schemaPart;
    var type2 = schemaPart.type;
    if (type2 === "string") {
      length += schemaPart.maxLength;
    } else if (type2 === "boolean") {
      length += 1;
    } else {
      var parsedLengths = props.parsedLengths;
      length = length + parsedLengths.nonDecimals + parsedLengths.decimals;
    }
  });
  return length;
}
function getPrimaryKeyFromIndexableString(indexableString, primaryKeyLength) {
  var paddedPrimaryKey = indexableString.slice(primaryKeyLength * -1);
  var primaryKey = paddedPrimaryKey.trim();
  return primaryKey;
}
function getNumberIndexString(parsedLengths, fieldValue) {
  if (typeof fieldValue === "undefined") {
    fieldValue = 0;
  }
  if (fieldValue < parsedLengths.minimum) {
    fieldValue = parsedLengths.minimum;
  }
  if (fieldValue > parsedLengths.maximum) {
    fieldValue = parsedLengths.maximum;
  }
  var nonDecimalsValueAsString = (Math.floor(fieldValue) - parsedLengths.roundedMinimum).toString();
  var str = nonDecimalsValueAsString.padStart(parsedLengths.nonDecimals, "0");
  if (parsedLengths.decimals > 0) {
    var splitByDecimalPoint = fieldValue.toString().split(".");
    var decimalValueAsString = splitByDecimalPoint.length > 1 ? splitByDecimalPoint[1] : "0";
    str += decimalValueAsString.padEnd(parsedLengths.decimals, "0");
  }
  return str;
}
function getStartIndexStringFromLowerBound(schema, index, lowerBound) {
  var str = "";
  index.forEach((fieldName, idx) => {
    var schemaPart = getSchemaByObjectPath(schema, fieldName);
    var bound2 = lowerBound[idx];
    var type2 = schemaPart.type;
    switch (type2) {
      case "string":
        var maxLength = ensureNotFalsy(schemaPart.maxLength, "maxLength not set");
        if (typeof bound2 === "string") {
          str += bound2.padEnd(maxLength, " ");
        } else {
          str += "".padEnd(maxLength, " ");
        }
        break;
      case "boolean":
        if (bound2 === null) {
          str += "0";
        } else if (bound2 === INDEX_MIN) {
          str += "0";
        } else if (bound2 === INDEX_MAX) {
          str += "1";
        } else {
          var boolToStr = bound2 ? "1" : "0";
          str += boolToStr;
        }
        break;
      case "number":
      case "integer":
        var parsedLengths = getStringLengthOfIndexNumber(schemaPart);
        if (bound2 === null || bound2 === INDEX_MIN) {
          var fillChar = "0";
          str += fillChar.repeat(parsedLengths.nonDecimals + parsedLengths.decimals);
        } else if (bound2 === INDEX_MAX) {
          str += getNumberIndexString(parsedLengths, parsedLengths.maximum);
        } else {
          var add2 = getNumberIndexString(parsedLengths, bound2);
          str += add2;
        }
        break;
      default:
        throw new Error("unknown index type " + type2);
    }
  });
  return str;
}
function getStartIndexStringFromUpperBound(schema, index, upperBound) {
  var str = "";
  index.forEach((fieldName, idx) => {
    var schemaPart = getSchemaByObjectPath(schema, fieldName);
    var bound2 = upperBound[idx];
    var type2 = schemaPart.type;
    switch (type2) {
      case "string":
        var maxLength = ensureNotFalsy(schemaPart.maxLength, "maxLength not set");
        if (typeof bound2 === "string" && bound2 !== INDEX_MAX) {
          str += bound2.padEnd(maxLength, " ");
        } else if (bound2 === INDEX_MIN) {
          str += "".padEnd(maxLength, " ");
        } else {
          str += "".padEnd(maxLength, INDEX_MAX);
        }
        break;
      case "boolean":
        if (bound2 === null) {
          str += "1";
        } else {
          var boolToStr = bound2 ? "1" : "0";
          str += boolToStr;
        }
        break;
      case "number":
      case "integer":
        var parsedLengths = getStringLengthOfIndexNumber(schemaPart);
        if (bound2 === null || bound2 === INDEX_MAX) {
          var fillChar = "9";
          str += fillChar.repeat(parsedLengths.nonDecimals + parsedLengths.decimals);
        } else if (bound2 === INDEX_MIN) {
          var _fillChar = "0";
          str += _fillChar.repeat(parsedLengths.nonDecimals + parsedLengths.decimals);
        } else {
          str += getNumberIndexString(parsedLengths, bound2);
        }
        break;
      default:
        throw new Error("unknown index type " + type2);
    }
  });
  return str;
}
var TaskQueue = function() {
  function t(t2, a2) {
    this.queue = PROMISE_RESOLVE_VOID, this.readTasks = [], this.beforeTaskReadOrWrite = [], this.lockId = t2, this.abstractLock = a2;
  }
  var a = t.prototype;
  return a.runRead = function(e) {
    return new Promise((t2, a2) => {
      this.readTasks.push((s2) => e(s2).then((e2) => t2(e2)).catch((e2) => a2(e2))), this.triggerReadTasks();
    });
  }, a.triggerReadTasks = function() {
    this.queue = this.queue.then(() => {
      if (0 !== this.readTasks.length) return this.abstractLock.request(this.lockId, async () => {
        var e = this.readTasks;
        this.readTasks = [];
        var t2 = { type: "READ", taskAmount: e.length, accessHandlers: /* @__PURE__ */ new Map(), awaitBeforeFinish: [] };
        return await Promise.all(this.beforeTaskReadOrWrite.map((e2) => e2(t2))), Promise.all(e.map((e2) => e2(t2))).then(() => this.cleanupAfterRun(t2));
      });
    }).catch((e) => {
      console.log("ERROR TaskQueue.triggerReadTasks.queue errored:"), console.log(e);
    });
  }, a.runWrite = function(e) {
    return new Promise((t2, a2) => {
      this.queue = this.queue.then(() => this.abstractLock.request(this.lockId, async () => {
        var s2 = { type: "WRITE", taskAmount: 1, accessHandlers: /* @__PURE__ */ new Map(), awaitBeforeFinish: [] };
        return await Promise.all(this.beforeTaskReadOrWrite.map((e2) => e2(s2))), e(s2).then((e2) => {
          t2(e2);
        }).catch((e2) => a2(e2)).then(() => this.cleanupAfterRun(s2));
      }));
    });
  }, a.runInit = function(e) {
    return new Promise((t2, a2) => {
      this.queue = this.queue.then(() => this.abstractLock.request(this.lockId, async () => {
        var s2 = { type: "INIT", taskAmount: 1, accessHandlers: /* @__PURE__ */ new Map(), awaitBeforeFinish: [] };
        return e(s2).then((e2) => t2(e2)).catch((e2) => a2(e2)).then(() => this.cleanupAfterRun(s2));
      }));
    });
  }, a.cleanupAfterRun = async function(e) {
    await Promise.all(e.awaitBeforeFinish.map((e2) => e2())), await Promise.all(Array.from(e.accessHandlers.values()).map((e2) => e2.then((e3) => e3.close()).catch((e3) => {
    })));
  }, a.awaitIdle = async function() {
    for (; ; ) {
      var e = this.queue;
      if (await this.queue, this.queue === e) return;
    }
  }, t;
}();
function getAccessHandle(e, t) {
  var a = t.accessHandlers.get(e);
  return a || (a = e.createAccessHandle(), t.accessHandlers.set(e, a)), a;
}
function getLockId(e) {
  return ["rxdb", "abstract-filesystem", "task-queue-lock", e.databaseName, e.collectionName, e.schema.version].join("||");
}
var r = new TextDecoder();
async function readFileContent(e, t = 0) {
  var n2 = t >>> 0, a = await e.read(n2);
  return r.decode(a);
}
function iterateStringChunks(e, r2, t) {
  for (var n2 = e.length, a = 0; a < n2; ) {
    var o = e.slice(a, a + r2);
    a += r2, t(o);
  }
}
function getChunkCells(e, r2) {
  var t = [], n2 = 0;
  for (var a of r2) {
    var o = e.slice(n2, n2 + a);
    n2 += a, t.push(o);
  }
  return t;
}
function iterateStringCells(r2, t, n2) {
  iterateStringChunks(r2, sumNumberArray(t), (e) => {
    var r3 = getChunkCells(e, t);
    n2(r3);
  });
}
var n = new TextDecoder(), s$1 = new TextEncoder();
var AbstractFile = function() {
  function h(t, a, r2) {
    this.fileHandle = t, this.headerSize = a, this.cells = r2, this.cellSizes = r2.map((e) => e.length), this.rowLength = sumNumberArray(this.cellSizes);
  }
  var c2 = h.prototype;
  return c2.getAccessHandle = function(e) {
    return this.fileHandle.then((a) => getAccessHandle(a, e));
  }, c2.readHeader = async function(e) {
    var t = await this.getAccessHandle(e), a = await t.read(0, this.headerSize);
    if (a.find((e2) => 0 !== e2)) {
      var r2 = n.decode(a).trim();
      return JSON.parse(r2);
    }
  }, c2.writeHeader = async function(e, t) {
    var a = s$1.encode(JSON.stringify(t).padStart(this.headerSize, " ")), r2 = await this.getAccessHandle(e), i = await r2.getWritable();
    await i.write(a, { at: 0 });
  }, c2.readRows = async function(e, t, i) {
    var n2 = await this.getAccessHandle(e), s2 = this.headerSize + t * this.rowLength, h2 = await readFileContent(n2, s2);
    iterateStringCells(h2, this.cellSizes, (e2) => {
      var t2 = this.cells.map((t3, a) => {
        var r2 = e2[a];
        if ("number" === t3.type) return parseInt(r2, 10);
        if ("string" === t3.type) return r2;
        throw new Error("unknown type " + t3.type);
      });
      i(t2);
    });
  }, c2.getRowString = function(e) {
    for (var t = "", a = this.cells, r2 = a.length, n2 = 0; n2 < r2; n2++) {
      var s2 = a[n2], h2 = e[n2];
      "number" === s2.type ? t += toPaddedString(h2, a[n2].length) : t += h2;
    }
    return t;
  }, c2.appendRows = async function(e, t) {
    var a = await this.getAccessHandle(e), r2 = await a.getSize();
    r2 < this.headerSize && (r2 = this.headerSize);
    for (var i = "", n2 = this.rowLength, h2 = t.length, c3 = 0; c3 < h2; c3++) {
      var o = t[c3], l = this.getRowString(o);
      if (l.length !== n2) throw new Error("rowString has wrong length (" + l.length + ")");
      i += l;
    }
    var w = s$1.encode(i), d = await a.getWritable();
    return await d.write(w, { at: r2 }), { startPosition: r2 };
  }, c2.replaceContent = async function(e, t) {
    var a = await this.getAccessHandle(e), r2 = t.map((e2) => this.getRowString(e2)).join(""), i = s$1.encode(r2), n2 = await a.getWritable();
    await n2.write(i, { at: this.headerSize });
    var h2 = this.headerSize + r2.length;
    await a.truncate(h2);
  }, c2.empty = async function(e) {
    var t = await this.getAccessHandle(e);
    await t.truncate(this.headerSize);
  }, h;
}();
var RXDB_PREMIUM_VERSION = "15.36.0";
function getIndexName(e) {
  return e.join("||");
}
var CLEANUP_INDEX = ["_deleted", "_meta.lwt"];
getIndexName(CLEANUP_INDEX);
function ge(a, y, c2, l, h) {
  var i = h + 1;
  while (l <= h) {
    var m2 = l + h >>> 1;
    var x = a[m2];
    var p2 = c2 !== void 0 ? c2(x, y) : x - y;
    if (p2 >= 0) {
      i = m2;
      h = m2 - 1;
    } else {
      l = m2 + 1;
    }
  }
  return i;
}
function gt(a, y, c2, l, h) {
  var i = h + 1;
  while (l <= h) {
    var m2 = l + h >>> 1;
    var x = a[m2];
    var p2 = c2 !== void 0 ? c2(x, y) : x - y;
    if (p2 > 0) {
      i = m2;
      h = m2 - 1;
    } else {
      l = m2 + 1;
    }
  }
  return i;
}
function lt(a, y, c2, l, h) {
  var i = l - 1;
  while (l <= h) {
    var m2 = l + h >>> 1, x = a[m2];
    var p2 = c2 !== void 0 ? c2(x, y) : x - y;
    if (p2 < 0) {
      i = m2;
      l = m2 + 1;
    } else {
      h = m2 - 1;
    }
  }
  return i;
}
function le(a, y, c2, l, h) {
  var i = l - 1;
  while (l <= h) {
    var m2 = l + h >>> 1, x = a[m2];
    var p2 = c2 !== void 0 ? c2(x, y) : x - y;
    if (p2 <= 0) {
      i = m2;
      l = m2 + 1;
    } else {
      h = m2 - 1;
    }
  }
  return i;
}
function eq(a, y, c2, l, h) {
  while (l <= h) {
    var m2 = l + h >>> 1, x = a[m2];
    var p2 = c2 !== void 0 ? c2(x, y) : x - y;
    if (p2 === 0) {
      return m2;
    }
    if (p2 <= 0) {
      l = m2 + 1;
    } else {
      h = m2 - 1;
    }
  }
  return -1;
}
function norm(a, y, c2, l, h, f2) {
  return f2(a, y, c2, l === void 0 ? 0 : l | 0, h === void 0 ? a.length - 1 : h | 0);
}
function boundGE(a, y, c2, l, h) {
  return norm(a, y, c2, l, h, ge);
}
function boundGT(a, y, c2, l, h) {
  return norm(a, y, c2, l, h, gt);
}
function boundLT(a, y, c2, l, h) {
  return norm(a, y, c2, l, h, lt);
}
function boundLE(a, y, c2, l, h) {
  return norm(a, y, c2, l, h, le);
}
function boundEQ(a, y, c2, l, h) {
  return norm(a, y, c2, l, h, eq);
}
var IndexState = function() {
  function n2(s2, n3, a2, h, p2) {
    this.rows = [], this.indexId = s2, this.index = n3, this.schema = h, this.jsonPositionSize = p2, this.name = getIndexName(this.index), this.fileHandle = a2.then((t) => t.getFileHandle(getIndexFileName(s2), { create: true })), this.getIndexableString = getIndexableStringMonad(this.schema, this.index), this.indexableStringLength = getIndexStringLength(this.schema, this.index), this.primaryPath = getPrimaryFieldOfPrimaryKey(this.schema.primaryKey), this.primaryKeyLength = ensureNotFalsy(this.schema.properties[this.primaryPath].maxLength), this.metaIdMap = 0 === s2 ? /* @__PURE__ */ new Map() : void 0, this.indexFile = new AbstractFile(this.fileHandle, 0, [{ type: "string", length: this.indexableStringLength }, { type: "number", length: p2 }, { type: "number", length: p2 }]);
  }
  var a = n2.prototype;
  return a.initRead = async function(t) {
    this.metaIdMap && this.metaIdMap.clear(), await this.indexFile.readRows(t, 0, (t2) => {
      var [e, i, r2] = t2, n3 = getPrimaryKeyFromIndexableString(e, this.primaryKeyLength).trim(), a2 = [e, n3, i, r2];
      this.metaIdMap && this.metaIdMap.set(n3, a2), this.rows.push(a2);
    });
  }, a.runChangelogOperation = function(t) {
    var e = t[1], i = t[3], r2 = i[1];
    if ("A" === t[2]) this.rows.splice(e, 0, i), this.metaIdMap && this.metaIdMap.set(r2, i);
    else if ("D" === t[2]) this.rows.splice(e, 1), this.metaIdMap && this.metaIdMap.delete(r2);
    else {
      if ("R" !== t[2]) throw new Error("unknown operation key " + t[2]);
      this.rows[e] = i, this.metaIdMap && this.metaIdMap.set(r2, i);
    }
  }, a.appendWriteOperations = function(e, i, r2) {
    for (var s2 = [], n3 = e.length, a2 = 0; a2 < n3; a2++) {
      var o = e[a2], p2 = i[a2], d = o.documentId, u2 = this.getIndexableString(o.documentData), l = o.previousDocumentData ? this.getIndexableString(o.previousDocumentData) : null, I = l ? boundEQ(this.rows, [l], compareIndexRows) : -1, g = [u2, d, p2[0], p2[1]];
      this.metaIdMap && this.metaIdMap.set(d, g), u2 === l ? (this.rows[I] = g, r2.push([this.indexId, I, "R", [u2, d, p2[0], p2[1]]])) : (o.previousDocumentData && (this.rows.splice(I, 1), r2.push([this.indexId, I, "D", [ensureNotFalsy(l), d, p2[0], p2[1]]])), s2.push(g));
    }
    for (var c2 = 0, f2 = (s2 = s2.sort(sortByIndexStringComparator)).length, y = 0; y < f2; y++) {
      var w = s2[y];
      c2 = pushAtSortPosition(this.rows, w, sortByIndexStringComparator, c2), r2.push([this.indexId, c2, "A", w]);
    }
    return r2;
  }, a.changeDocumentPosition = function(t, e) {
    var i = this.getIndexableString(t), r2 = boundEQ(this.rows, [i], compareIndexRows), s2 = [i, t[this.primaryPath], e[0], e[1]];
    return this.rows[r2] = s2, [this.indexId, r2, "R", s2];
  }, n2;
}();
function sortByIndexStringComparator(t, e) {
  return t[0] < e[0] ? -1 : 1;
}
var INDEX_ROW_ID_LENGTH = 8;
var INDEX_ID_LENGTH = 5;
function getIndexFileName(t) {
  return "index-" + toPaddedString(t, 5) + ".txt";
}
function getIndexesFromSchema(t) {
  var e = getPrimaryFieldOfPrimaryKey(t.primaryKey), i = toArray(t.indexes ? t.indexes : []);
  (i = (i = sortIndexes(i)).map((t2) => t2.slice(0))).push(["_meta.lwt", e]), i.push(CLEANUP_INDEX);
  var s2 = /* @__PURE__ */ new Set(), h = i.slice();
  return i = h.filter((t2) => {
    var e2 = getIndexName(t2);
    return !s2.has(e2) && (s2.add(e2), true);
  });
}
function sortIndexes(t) {
  return t.map((t2) => ({ index: t2, str: t2.join(",") })).sort((t2, e) => t2.str > e.str ? 1 : t2.str < e.str ? -1 : 0).map((t2) => t2.index);
}
function getChangelogFile(e, t, o) {
  return new AbstractFile(e.then((e2) => e2.getFileHandle("changelog.txt", { create: true })), 0, [{ type: "number", length: INDEX_ID_LENGTH }, { type: "number", length: INDEX_ROW_ID_LENGTH }, { type: "string", length: 1 }, { type: "string", length: t }, { type: "number", length: o }, { type: "number", length: o }]);
}
async function getChangelogOperations(n2, r2, a, o = 0) {
  var i = { lastRowId: o, operationsByIndexId: /* @__PURE__ */ new Map() };
  return await r2.readRows(n2, o, (n3) => {
    i.lastRowId = i.lastRowId + 1;
    var [r3, o2, p2, g, l, s2] = n3, d = getFromMapOrCreate(i.operationsByIndexId, r3, () => []), h = a[r3], m2 = g.slice(0, h.indexableStringLength), y = getPrimaryKeyFromIndexableString(m2, h.primaryKeyLength).trim();
    d.push([r3, o2, p2, [m2, y, l, s2]]);
  }), i;
}
async function addChangelogOperations(e, t, n2, r2) {
  var a = n2.map((e2) => [e2[0], e2[1], e2[2], e2[3][0].padEnd(r2), e2[3][2], e2[3][3]]);
  await t.appendRows(e, a);
}
async function getStorageInstanceInternalState(m2, l, d, g) {
  var h = m2.getDirectory(), p2 = getDirectoryPath({ databaseName: l.databaseName, collectionName: l.collectionName, schemaVersion: l.schema.version }), u2 = h.then((e) => e.getDirectoryHandle(p2, { create: true })), f2 = u2.then((e) => e.getFileHandle("documents.json", { create: true }));
  return d.runInit(async (m3) => {
    var p3 = f2.then((e) => getAccessHandle(e, m3)), x = u2.then((e) => e.getFileHandle("changes.json", { create: true })), b2 = getPrimaryFieldOfPrimaryKey(l.schema.primaryKey), y = ensureNotFalsy(l.schema.properties[b2].maxLength), v = getIndexesFromSchema(l.schema).map((e, a) => new IndexState(a, e, u2, l.schema, g)), w = maxOfNumbers(v.map((e) => e.indexableStringLength)), I = getChangelogFile(u2, w, g), S = await p3;
    if (await S.getSize() > 0) {
      var [C, N] = await Promise.all([Promise.all(v.map((e) => e.initRead(m3))), getChangelogOperations(m3, I, v, 0)]);
      Array.from(N.operationsByIndexId.entries()).map(([e, a]) => {
        var t = v[e];
        a.forEach((e2) => t.runChangelogOperation(e2));
      });
    }
    var j = l.multiInstance ? new BroadcastChannel(d.lockId) : void 0;
    j && j.unref && j.unref();
    var D = new Subject();
    return j && (j.onmessage = (e) => {
      var a = e.data;
      D.next(a);
    }), { params: l, taskQueue: d, indexStates: v, primaryPath: b2, primaryKeyLength: y, root: await h, dirHandle: await u2, changesFileHandle: await x, documentFileHandle: await f2, changelogFile: I, maxIndexableStringLength: w, broadcastChannel: j, broadcastChannelMessages$: D, mightHaveUnprocessedChanges: false };
  });
}
function toPaddedString(e, a) {
  return (e + "").padStart(a, "number" == typeof e ? "0" : " ");
}
var DEFAULT_DOC_JSON_POSITION_SIZE = 8;
function m(e) {
  return e.replace(/\//g, "__");
}
function getDirectoryPath(e) {
  return ["rxdb", m(e.databaseName), m(e.collectionName), e.schemaVersion].join("-");
}
function getTotalDocumentCount(a) {
  return ensureNotFalsy(a.indexStates[0]).rows.length;
}
function compareIndexRows(e, a) {
  return e[0] < a[0] ? -1 : e[0] === a[0] ? 0 : 1;
}
function broadcastChangelogOperations(e, a, t, n2) {
  if (a.broadcastChannel) {
    var r2 = { type: "event", eventBulk: n2, changelogOperations: t, info: { db: e.databaseName, col: e.collectionName } };
    a.broadcastChannel.postMessage(r2);
  }
}
var DECODER = new TextDecoder();
var ENCODER = new TextEncoder();
async function writeDocumentRows(e, t, r2) {
  for (var n2 = [], a = await getAccessHandle(t, e), i = await a.getSize(), s2 = [], c2 = 0, u2 = i, h = r2.length, l = 0; l < h; l++) {
    var g = r2[l].documentData, v = JSON.stringify(g), f2 = u2, p2 = ENCODER.encode(v);
    s2.push(p2);
    var w = p2.byteLength;
    c2 += w;
    var m2 = u2 += w;
    n2.push([f2, m2]);
  }
  for (var D = new Uint8Array(c2), d = 0, y = 0; y < s2.length; y++) {
    var x = s2[y];
    D.set(x, d), d += x.byteLength;
  }
  var C = await a.getWritable();
  return await C.write(D, { at: i }), n2;
}
async function getDocumentsJson(r2, n2, a, o) {
  var i = [], s2 = batchArray(o, 1e3);
  return await Promise.all(s2.map(async (t) => {
    var o2 = await getDocumentsJsonString(r2, n2, a, t), s3 = JSON.parse(o2);
    0 === i.length ? i = s3 : appendToArray(i, s3);
  })), i;
}
async function s(e, t, r2, n2) {
  if (!t.wholeDocumentsFileContent) {
    var a = 0.15;
    if (getTotalDocumentCount(e) * a < n2 && getTotalDocumentCount(e) > 1) {
      var o = await r2.read(0);
      t.wholeDocumentsFileContent = o;
    }
  }
}
var COMMA_AS_UINT8 = ENCODER.encode(",");
async function getDocumentsJsonString(e, t, r2, a) {
  await s(e, r2, t, a.length);
  var o = a.length, i = r2.wholeDocumentsFileContent;
  if (i) {
    for (var u2 = "", h = 0; h < o; h++) {
      var l = a[h];
      u2 += DECODER.decode(i.slice(l[2], l[3])), h !== o - 1 && (u2 += ",");
    }
    return "[" + u2 + "]";
  }
  var g = /* @__PURE__ */ new Map(), v = batchIndexRowReads(a, 25), f2 = o - 1;
  await Promise.all(v.map(async (e2) => {
    var r3 = await c(t, e2, g);
    f2 += r3;
  }));
  for (var p2 = new Uint8Array(f2), w = 0, m2 = 0; m2 < o; m2++) {
    var D = a[m2], d = getFromMapOrThrow(g, D);
    p2.set(d, w), w += d.byteLength, m2 !== o - 1 && (p2.set(COMMA_AS_UINT8, w), w += COMMA_AS_UINT8.byteLength);
  }
  return "[" + DECODER.decode(p2) + "]";
}
async function c(e, t, n2) {
  for (var o = t[0][2], i = ensureNotFalsy(lastOfArray$1(t))[3], s2 = await e.read(o, i), c2 = 0, u2 = 0; u2 < t.length; u2++) {
    var h = t[u2], l = s2.slice(h[2] - o, h[3] - o);
    c2 += l.byteLength, n2.set(h, l);
  }
  return c2;
}
function sortCompareIndexRowsByPosition(e, t) {
  return e[2] < t[2] ? -1 : e[2] > t[2] ? 1 : 0;
}
function getAverageDocSize(e, t) {
  var r2 = [];
  if (e.length >= t) r2 = e.slice();
  else for (; r2.length < t; ) {
    var n2 = u(e);
    r2.push(n2);
  }
  var a = 0;
  return r2.forEach((e2) => a += e2[3] - e2[2]), a / r2.length;
}
function batchIndexRowReads(e, t) {
  for (var r2 = e.slice(0).sort(sortCompareIndexRowsByPosition), n2 = getAverageDocSize(e, 5), o = [], i = [], s2 = 0; s2 < r2.length; s2++) {
    var c2 = r2[s2];
    if (0 !== i.length) {
      var u2 = lastOfArray$1(i);
      c2[2] - u2[3] < t * n2 ? i.push(c2) : (o.push(i), i = [c2]);
    } else i.push(c2);
  }
  return i.length > 0 && o.push(i), o;
}
function u(e) {
  return e[Math.floor(Math.random() * e.length)];
}
async function findDocumentsByIds(r2, i, s2, o) {
  var u2 = await r2.internals.statePromise;
  if (0 === getTotalDocumentCount(u2)) return "[]";
  for (var m2 = getAccessHandle(u2.documentFileHandle, o), f2 = ensureNotFalsy(u2.indexStates[0].metaIdMap), l = [], d = i.length, p2 = 0; p2 < d; p2++) {
    var c2 = i[p2], v = f2.get(c2);
    v && (s2 || "0" === v[0][0]) && l.push(v);
  }
  if (0 === l.length) return "[]";
  var g = await m2;
  return await getDocumentsJsonString(u2, g, o, l);
}
async function findDocumentsByIdsInternal(a, i, s2) {
  var o = /* @__PURE__ */ new Map(), u2 = await a.internals.statePromise;
  if (0 === getTotalDocumentCount(u2)) return o;
  for (var m2 = getAccessHandle(u2.documentFileHandle, s2), f2 = ensureNotFalsy(u2.indexStates[0].metaIdMap), l = [], d = i.length, p2 = 0; p2 < d; p2++) {
    var c2 = i[p2], v = f2.get(c2);
    v && l.push(v);
  }
  if (0 === l.length) return o;
  for (var g = await m2, h = await getDocumentsJson(u2, g, s2, l), w = l.length, x = 0; x < w; x++) {
    var I = h[x], y = l[x][1];
    o.set(y, I);
  }
  return o;
}
async function appendAttachmentFiles(a, e, c2, m2) {
  if (e.schema.attachments) {
    var r2 = c2.attachmentsAdd.concat(c2.attachmentsUpdate);
    0 !== r2.length && await Promise.all(r2.map(async (e2) => {
      var c3 = await getAttachmentFilename(e2.documentId, e2.attachmentId, attachmentWriteDataToNormalData(e2.attachmentData).digest), r3 = await m2.dirHandle.getFileHandle(c3, { create: true }), d = await getAccessHandle(r3, a);
      await d.truncate(0);
      var s2 = ENCODER.encode(e2.attachmentData.data), o = await d.getWritable();
      await o.write(s2, { at: 0 }), o.flush && await o.flush(), await o.close();
    }));
  }
}
async function clearDeletedAttachments(t, a, n2, c2) {
  if (a.schema.attachments) {
    var i = [];
    c2.events.forEach((t2) => {
      t2.previousDocumentData && Object.keys(t2.previousDocumentData._attachments).forEach((a2) => {
        t2.documentData._attachments[a2] && !t2.documentData._deleted || i.push({ documentId: t2.documentId, attachmentId: a2, digest: ensureNotFalsy(t2.previousDocumentData)._attachments[a2].digest });
      });
    }), 0 !== i.length && await Promise.all(i.map(async (t2) => {
      var a2 = await getAttachmentFilename(t2.documentId, t2.attachmentId, t2.digest), e = await n2.dirHandle.getFileHandle(a2, { create: true });
      await n2.dirHandle.removeEntry(e.name);
    }));
  }
}
async function getAttachmentData(t, a, e, i, m2) {
  var r2 = await a.internals.statePromise, d = await getAttachmentFilename(e, i, m2), s2 = await r2.dirHandle.getFileHandle(d, { create: false }), o = await getAccessHandle(s2, t), l = await o.read(0);
  return DECODER.decode(l);
}
async function getAttachmentFilename(t, e, n2) {
  return "z-attachment-" + (await defaultHashSha256(t + "||" + e)).slice(0, 20) + "-" + n2.slice(0, 20) + ".txt";
}
async function bulkWrite(n2, i, c2, h) {
  var l = i.primaryPath, p2 = !!i.schema.attachments, g = await i.internals.statePromise, u2 = [], w = getAccessHandle(g.changesFileHandle, n2).then((e) => e.getWritable()), f2 = c2.map((e) => e.document[l]), v = getTotalDocumentCount(g) > 0 ? await findDocumentsByIdsInternal(i, f2, n2) : /* @__PURE__ */ new Map(), C = categorizeBulkWriteRows(i, l, v, c2, h), H2 = C.eventBulk.events;
  if (u2 = C.errors, H2.length > 0) {
    var b2 = ensureNotFalsy(C.newestRow).document;
    ensureNotFalsy(b2), C.eventBulk.checkpoint = { id: b2[l], lwt: b2._meta.lwt }, g.mightHaveUnprocessedChanges = true, g.broadcastChannel && g.broadcastChannel.postMessage({ type: "pre-write", mightHaveUnprocessedChanges: true }), p2 && await appendAttachmentFiles(n2, i, C, g), C.eventBulk.endTime = now$1();
    var x = JSON.stringify(C.eventBulk), F = ENCODER.encode(x), k2 = await w, y = k2.write(F, { at: 0 });
    i.changes$.next(x), n2.awaitBeforeFinish.push(() => processChangesFileIfRequired(n2, g, i, true)), await y, k2.flush && await k2.flush();
  }
  return { error: u2 };
}
async function processChangesFileIfRequired(e, a, t, s2 = false) {
  if (a.mightHaveUnprocessedChanges) {
    var o = await getAccessHandle(a.changesFileHandle, e), d = await o.getSize();
    if (0 !== d) {
      var m2 = await o.read(0, d), g = DECODER.decode(m2), u2 = JSON.parse(g), w = u2.events.sort(p$1), f2 = await getAccessHandle(a.documentFileHandle, e), v = await writeDocumentRows(e, a.documentFileHandle, w);
      await f2.close(), await clearDeletedAttachments(e, t, a, u2), s2 || t.changes$.next(u2);
      for (var C = [], H2 = 0; H2 < a.indexStates.length; H2++) {
        a.indexStates[H2].appendWriteOperations(w, v, C);
      }
      await addChangelogOperations(e, a.changelogFile, C, a.maxIndexableStringLength), broadcastChangelogOperations(t, a, C, u2), await o.truncate(0), a.mightHaveUnprocessedChanges = false, a.broadcastChannel && a.broadcastChannel.postMessage({ type: "pre-write", mightHaveUnprocessedChanges: false });
    } else a.mightHaveUnprocessedChanges = false;
  }
}
function p$1(e, a) {
  return e.documentId < a.documentId ? -1 : e.documentId > a.documentId ? 1 : 0;
}
async function abstractFilesystemQuery(p2, v, h) {
  var y = await p2.internals.statePromise, w = v.queryPlan.index.slice(0), g = getIndexName(w), x = ensureNotFalsy(y.indexStates.find((e) => e.name === g));
  if (0 === x.rows.length) return { documents: [] };
  var b2 = v.queryPlan, q = v.query, k2 = q.skip ? q.skip : 0, P = k2 + (q.limit ? q.limit : 1 / 0), j = false;
  b2.selectorSatisfiedByIndex || (j = getQueryMatcher(p2.schema, v.query));
  var S = !b2.sortSatisfiedByIndex, B = b2.startKeys, F = getStartIndexStringFromLowerBound(p2.schema, w, B), I = b2.endKeys, K2 = getStartIndexStringFromUpperBound(p2.schema, w, I), E = (b2.inclusiveStart ? boundGE : boundGT)(x.rows, [F], compareIndexRows), H2 = (b2.inclusiveEnd ? boundLE : boundLT)(x.rows, [K2], compareIndexRows), Q = await getAccessHandle(y.documentFileHandle, h), z = [];
  if (j) for (var A = false; !A; ) {
    var C = x.rows[E];
    if (!C || E > H2) break;
    var D = (await getDocumentsJson(y, Q, h, [C]))[0];
    j(D) && z.push(D), (z.length >= P && !S || E >= x.rows.length) && (A = true), E++;
  }
  else {
    for (var G = [], J = false; !J; ) {
      var L = x.rows[E];
      if (!L || E > H2) break;
      G.push(L), (z.length >= P && !S || E >= x.rows.length) && (J = true), E++;
    }
    if (!S) {
      var M = (G = G.slice(k2, P)).length > 0 ? await getDocumentsJsonString(y, Q, h, G) : "[]";
      return Promise.resolve('{"documents": ' + M + "}");
    }
    z = await getDocumentsJson(y, Q, h, G);
  }
  if (S) {
    var N = getSortComparator(p2.schema, v.query);
    z = z.sort(N);
  }
  return z = z.slice(k2, P), Promise.resolve({ documents: z });
}
async function getChangedDocumentsSince(s2, d, c2, p2) {
  p2 || (p2 = { id: "", lwt: 0 });
  var l = await s2.internals.statePromise, u2 = ["_meta.lwt", s2.primaryPath], f2 = getIndexName(u2), w = ensureNotFalsy(l.indexStates.find((r2) => r2.name === f2));
  if (0 === w.rows.length) return { documents: [], checkpoint: p2 };
  var h = [p2.lwt, p2.id], g = getStartIndexStringFromLowerBound(s2.schema, u2, h), x = boundGT(w.rows, [g], compareIndexRows), v = await getAccessHandle(l.documentFileHandle, d), j = w.rows.slice(x, x + c2), y = [];
  for (var b2 of j) {
    var k2 = (await getDocumentsJson(l, v, d, [b2]))[0];
    y.push(k2);
  }
  var P = lastOfArray$1(y);
  return { documents: y, checkpoint: P ? { id: P[s2.primaryPath], lwt: P._meta.lwt } : p2 };
}
var f = getIndexName(CLEANUP_INDEX);
async function cleanup(e, a, t) {
  return !((await cleanupDeletedDocuments(e, a, t)).length > 0) && (!((await cleanupChangelogOperations(e, a)).length > 0) && !(await cleanupDocumentJsonFile(e, a) > 0));
}
async function cleanupDeletedDocuments(i, c2, p2) {
  var u2 = await i.internals.statePromise, h = ensureNotFalsy(u2.indexStates.find((e) => e.name === f)), x = now$1() - p2, v = getStartIndexStringFromLowerBound(i.schema, CLEANUP_INDEX, [true, 1]), S = getStartIndexStringFromUpperBound(i.schema, CLEANUP_INDEX, [true, x]), b2 = boundGT(h.rows, [v], compareIndexRows), F = boundLT(h.rows, [S], compareIndexRows);
  if (-1 === b2) return [];
  var y = h.rows.slice(b2, F + 1), D = [], I = await getAccessHandle(u2.documentFileHandle, c2);
  for (var C of y) {
    var j = C[1];
    D.push(j);
    var P = (await getDocumentsJson(u2, I, c2, [C]))[0], O = [];
    for (var H2 of u2.indexStates) {
      var J = H2.getIndexableString(P), L = boundEQ(H2.rows, [J], compareIndexRows), W2 = [H2.indexId, L, "D", H2.rows[L]];
      O.push(W2), H2.runChangelogOperation(W2);
    }
    await addChangelogOperations(c2, u2.changelogFile, O, u2.maxIndexableStringLength);
  }
  return D;
}
async function cleanupChangelogOperations(e, a) {
  var t = await e.internals.statePromise, n2 = await getChangelogOperations(a, t.changelogFile, t.indexStates, 0), r2 = t.indexStates.filter((e2) => {
    var a2 = n2.operationsByIndexId.get(e2.indexId);
    return !(!a2 || 0 === a2.length);
  });
  for (var i of r2) await i.indexFile.replaceContent(a, i.rows.map((e2) => [e2[0], e2[2], e2[3]]));
  return r2.length > 0 && await t.changelogFile.empty(a), r2;
}
async function cleanupDocumentJsonFile(a, t) {
  var n2 = await a.internals.statePromise, r2 = ensureNotFalsy(n2.indexStates.find((e) => "_meta.lwt" === e.index[0]));
  if (0 === r2.rows.length) return 0;
  var i = await getAccessHandle(n2.documentFileHandle, t), s2 = await i.getSize();
  n2.broadcastChannel && n2.broadcastChannel.postMessage({ type: "pre-write", mightHaveUnprocessedChanges: true });
  for (var l = 50, g = 0, p2 = 0, w = 0; ; ) {
    if (p2 >= l) return p2;
    var f2 = r2.rows[w];
    if (w += 1, !f2) return g < s2 && await i.truncate(g), p2;
    var h = f2[2], x = f2[3];
    if (h === g) g = x;
    else {
      p2 += 1;
      var v = (await getDocumentsJson(n2, i, t, [f2]))[0], S = g, b2 = h - S, F = ENCODER.encode(" ".repeat(b2)), y = await i.getWritable();
      await y.write(F, { at: S });
      var D = [];
      for (var I of n2.indexStates) {
        var C = I.changeDocumentPosition(v, [S, x]);
        D.push(C);
      }
      await addChangelogOperations(t, n2.changelogFile, D, n2.maxIndexableStringLength), broadcastChangelogOperations(a, n2, D);
      var j = JSON.stringify(v), P = j.length, O = ENCODER.encode(j + " ".repeat(b2 - P));
      y = await i.getWritable(), await y.write(O, { at: S });
      var H2 = S + P, J = [];
      for (var L of n2.indexStates) {
        var W2 = L.changeDocumentPosition(v, [S, H2]);
        J.push(W2);
      }
      await addChangelogOperations(t, n2.changelogFile, J, n2.maxIndexableStringLength), broadcastChangelogOperations(a, n2, J), g += P;
    }
  }
}
var clone = { exports: {} };
(function(module) {
  var clone2 = function() {
    function _instanceof(obj, type2) {
      return type2 != null && obj instanceof type2;
    }
    var nativeMap;
    try {
      nativeMap = Map;
    } catch (_) {
      nativeMap = function() {
      };
    }
    var nativeSet;
    try {
      nativeSet = Set;
    } catch (_) {
      nativeSet = function() {
      };
    }
    var nativePromise;
    try {
      nativePromise = Promise;
    } catch (_) {
      nativePromise = function() {
      };
    }
    function clone22(parent, circular, depth, prototype, includeNonEnumerable) {
      if (typeof circular === "object") {
        depth = circular.depth;
        prototype = circular.prototype;
        includeNonEnumerable = circular.includeNonEnumerable;
        circular = circular.circular;
      }
      var allParents = [];
      var allChildren = [];
      var useBuffer = typeof Buffer != "undefined";
      if (typeof circular == "undefined")
        circular = true;
      if (typeof depth == "undefined")
        depth = Infinity;
      function _clone(parent2, depth2) {
        if (parent2 === null)
          return null;
        if (depth2 === 0)
          return parent2;
        var child;
        var proto;
        if (typeof parent2 != "object") {
          return parent2;
        }
        if (_instanceof(parent2, nativeMap)) {
          child = new nativeMap();
        } else if (_instanceof(parent2, nativeSet)) {
          child = new nativeSet();
        } else if (_instanceof(parent2, nativePromise)) {
          child = new nativePromise(function(resolve2, reject) {
            parent2.then(function(value) {
              resolve2(_clone(value, depth2 - 1));
            }, function(err) {
              reject(_clone(err, depth2 - 1));
            });
          });
        } else if (clone22.__isArray(parent2)) {
          child = [];
        } else if (clone22.__isRegExp(parent2)) {
          child = new RegExp(parent2.source, __getRegExpFlags(parent2));
          if (parent2.lastIndex) child.lastIndex = parent2.lastIndex;
        } else if (clone22.__isDate(parent2)) {
          child = new Date(parent2.getTime());
        } else if (useBuffer && Buffer.isBuffer(parent2)) {
          if (Buffer.allocUnsafe) {
            child = Buffer.allocUnsafe(parent2.length);
          } else {
            child = new Buffer(parent2.length);
          }
          parent2.copy(child);
          return child;
        } else if (_instanceof(parent2, Error)) {
          child = Object.create(parent2);
        } else {
          if (typeof prototype == "undefined") {
            proto = Object.getPrototypeOf(parent2);
            child = Object.create(proto);
          } else {
            child = Object.create(prototype);
            proto = prototype;
          }
        }
        if (circular) {
          var index = allParents.indexOf(parent2);
          if (index != -1) {
            return allChildren[index];
          }
          allParents.push(parent2);
          allChildren.push(child);
        }
        if (_instanceof(parent2, nativeMap)) {
          parent2.forEach(function(value, key) {
            var keyChild = _clone(key, depth2 - 1);
            var valueChild = _clone(value, depth2 - 1);
            child.set(keyChild, valueChild);
          });
        }
        if (_instanceof(parent2, nativeSet)) {
          parent2.forEach(function(value) {
            var entryChild = _clone(value, depth2 - 1);
            child.add(entryChild);
          });
        }
        for (var i in parent2) {
          var attrs;
          if (proto) {
            attrs = Object.getOwnPropertyDescriptor(proto, i);
          }
          if (attrs && attrs.set == null) {
            continue;
          }
          child[i] = _clone(parent2[i], depth2 - 1);
        }
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(parent2);
          for (var i = 0; i < symbols.length; i++) {
            var symbol = symbols[i];
            var descriptor = Object.getOwnPropertyDescriptor(parent2, symbol);
            if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
              continue;
            }
            child[symbol] = _clone(parent2[symbol], depth2 - 1);
            if (!descriptor.enumerable) {
              Object.defineProperty(child, symbol, {
                enumerable: false
              });
            }
          }
        }
        if (includeNonEnumerable) {
          var allPropertyNames = Object.getOwnPropertyNames(parent2);
          for (var i = 0; i < allPropertyNames.length; i++) {
            var propertyName = allPropertyNames[i];
            var descriptor = Object.getOwnPropertyDescriptor(parent2, propertyName);
            if (descriptor && descriptor.enumerable) {
              continue;
            }
            child[propertyName] = _clone(parent2[propertyName], depth2 - 1);
            Object.defineProperty(child, propertyName, {
              enumerable: false
            });
          }
        }
        return child;
      }
      return _clone(parent, depth);
    }
    clone22.clonePrototype = function clonePrototype(parent) {
      if (parent === null)
        return null;
      var c2 = function() {
      };
      c2.prototype = parent;
      return new c2();
    };
    function __objToStr(o) {
      return Object.prototype.toString.call(o);
    }
    clone22.__objToStr = __objToStr;
    function __isDate(o) {
      return typeof o === "object" && __objToStr(o) === "[object Date]";
    }
    clone22.__isDate = __isDate;
    function __isArray(o) {
      return typeof o === "object" && __objToStr(o) === "[object Array]";
    }
    clone22.__isArray = __isArray;
    function __isRegExp(o) {
      return typeof o === "object" && __objToStr(o) === "[object RegExp]";
    }
    clone22.__isRegExp = __isRegExp;
    function __getRegExpFlags(re) {
      var flags2 = "";
      if (re.global) flags2 += "g";
      if (re.ignoreCase) flags2 += "i";
      if (re.multiline) flags2 += "m";
      return flags2;
    }
    clone22.__getRegExpFlags = __getRegExpFlags;
    return clone22;
  }();
  if (module.exports) {
    module.exports = clone2;
  }
})(clone);
var toStr$2 = Object.prototype.toString;
var isArguments = function isArguments2(value) {
  var str = toStr$2.call(value);
  var isArgs2 = str === "[object Arguments]";
  if (!isArgs2) {
    isArgs2 = str !== "[object Array]" && value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && toStr$2.call(value.callee) === "[object Function]";
  }
  return isArgs2;
};
var implementation$b;
var hasRequiredImplementation;
function requireImplementation() {
  if (hasRequiredImplementation) return implementation$b;
  hasRequiredImplementation = 1;
  var keysShim2;
  if (!Object.keys) {
    var has2 = Object.prototype.hasOwnProperty;
    var toStr2 = Object.prototype.toString;
    var isArgs2 = isArguments;
    var isEnumerable = Object.prototype.propertyIsEnumerable;
    var hasDontEnumBug = !isEnumerable.call({ toString: null }, "toString");
    var hasProtoEnumBug = isEnumerable.call(function() {
    }, "prototype");
    var dontEnums = [
      "toString",
      "toLocaleString",
      "valueOf",
      "hasOwnProperty",
      "isPrototypeOf",
      "propertyIsEnumerable",
      "constructor"
    ];
    var equalsConstructorPrototype = function(o) {
      var ctor = o.constructor;
      return ctor && ctor.prototype === o;
    };
    var excludedKeys = {
      $applicationCache: true,
      $console: true,
      $external: true,
      $frame: true,
      $frameElement: true,
      $frames: true,
      $innerHeight: true,
      $innerWidth: true,
      $onmozfullscreenchange: true,
      $onmozfullscreenerror: true,
      $outerHeight: true,
      $outerWidth: true,
      $pageXOffset: true,
      $pageYOffset: true,
      $parent: true,
      $scrollLeft: true,
      $scrollTop: true,
      $scrollX: true,
      $scrollY: true,
      $self: true,
      $webkitIndexedDB: true,
      $webkitStorageInfo: true,
      $window: true
    };
    var hasAutomationEqualityBug = function() {
      if (typeof window === "undefined") {
        return false;
      }
      for (var k2 in window) {
        try {
          if (!excludedKeys["$" + k2] && has2.call(window, k2) && window[k2] !== null && typeof window[k2] === "object") {
            try {
              equalsConstructorPrototype(window[k2]);
            } catch (e) {
              return true;
            }
          }
        } catch (e) {
          return true;
        }
      }
      return false;
    }();
    var equalsConstructorPrototypeIfNotBuggy = function(o) {
      if (typeof window === "undefined" || !hasAutomationEqualityBug) {
        return equalsConstructorPrototype(o);
      }
      try {
        return equalsConstructorPrototype(o);
      } catch (e) {
        return false;
      }
    };
    keysShim2 = function keys3(object) {
      var isObject2 = object !== null && typeof object === "object";
      var isFunction2 = toStr2.call(object) === "[object Function]";
      var isArguments5 = isArgs2(object);
      var isString2 = isObject2 && toStr2.call(object) === "[object String]";
      var theKeys = [];
      if (!isObject2 && !isFunction2 && !isArguments5) {
        throw new TypeError("Object.keys called on a non-object");
      }
      var skipProto = hasProtoEnumBug && isFunction2;
      if (isString2 && object.length > 0 && !has2.call(object, 0)) {
        for (var i = 0; i < object.length; ++i) {
          theKeys.push(String(i));
        }
      }
      if (isArguments5 && object.length > 0) {
        for (var j = 0; j < object.length; ++j) {
          theKeys.push(String(j));
        }
      } else {
        for (var name in object) {
          if (!(skipProto && name === "prototype") && has2.call(object, name)) {
            theKeys.push(String(name));
          }
        }
      }
      if (hasDontEnumBug) {
        var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
        for (var k2 = 0; k2 < dontEnums.length; ++k2) {
          if (!(skipConstructor && dontEnums[k2] === "constructor") && has2.call(object, dontEnums[k2])) {
            theKeys.push(dontEnums[k2]);
          }
        }
      }
      return theKeys;
    };
  }
  implementation$b = keysShim2;
  return implementation$b;
}
var slice = Array.prototype.slice;
var isArgs = isArguments;
var origKeys = Object.keys;
var keysShim = origKeys ? function keys(o) {
  return origKeys(o);
} : requireImplementation();
var originalKeys = Object.keys;
keysShim.shim = function shimObjectKeys() {
  if (Object.keys) {
    var keysWorksWithArguments = function() {
      var args = Object.keys(arguments);
      return args && args.length === arguments.length;
    }(1, 2);
    if (!keysWorksWithArguments) {
      Object.keys = function keys3(object) {
        if (isArgs(object)) {
          return originalKeys(slice.call(object));
        }
        return originalKeys(object);
      };
    }
  } else {
    Object.keys = keysShim;
  }
  return Object.keys || keysShim;
};
var objectKeys$1 = keysShim;
var esErrors = Error;
var _eval = EvalError;
var range = RangeError;
var ref = ReferenceError;
var syntax = SyntaxError;
var type = TypeError;
var uri = URIError;
var shams$1 = function hasSymbols() {
  if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
    return false;
  }
  if (typeof Symbol.iterator === "symbol") {
    return true;
  }
  var obj = {};
  var sym = Symbol("test");
  var symObj = Object(sym);
  if (typeof sym === "string") {
    return false;
  }
  if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
    return false;
  }
  if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
    return false;
  }
  var symVal = 42;
  obj[sym] = symVal;
  for (sym in obj) {
    return false;
  }
  if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
    return false;
  }
  if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
    return false;
  }
  var syms = Object.getOwnPropertySymbols(obj);
  if (syms.length !== 1 || syms[0] !== sym) {
    return false;
  }
  if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
    return false;
  }
  if (typeof Object.getOwnPropertyDescriptor === "function") {
    var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
    if (descriptor.value !== symVal || descriptor.enumerable !== true) {
      return false;
    }
  }
  return true;
};
var origSymbol = typeof Symbol !== "undefined" && Symbol;
var hasSymbolSham = shams$1;
var hasSymbols$4 = function hasNativeSymbols() {
  if (typeof origSymbol !== "function") {
    return false;
  }
  if (typeof Symbol !== "function") {
    return false;
  }
  if (typeof origSymbol("foo") !== "symbol") {
    return false;
  }
  if (typeof Symbol("bar") !== "symbol") {
    return false;
  }
  return hasSymbolSham();
};
var test = {
  __proto__: null,
  foo: {}
};
var $Object$1 = Object;
var hasProto$1 = function hasProto() {
  return { __proto__: test }.foo === test.foo && !(test instanceof $Object$1);
};
var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
var toStr$1 = Object.prototype.toString;
var max = Math.max;
var funcType = "[object Function]";
var concatty = function concatty2(a, b2) {
  var arr = [];
  for (var i = 0; i < a.length; i += 1) {
    arr[i] = a[i];
  }
  for (var j = 0; j < b2.length; j += 1) {
    arr[j + a.length] = b2[j];
  }
  return arr;
};
var slicy = function slicy2(arrLike, offset) {
  var arr = [];
  for (var i = offset, j = 0; i < arrLike.length; i += 1, j += 1) {
    arr[j] = arrLike[i];
  }
  return arr;
};
var joiny = function(arr, joiner) {
  var str = "";
  for (var i = 0; i < arr.length; i += 1) {
    str += arr[i];
    if (i + 1 < arr.length) {
      str += joiner;
    }
  }
  return str;
};
var implementation$a = function bind(that) {
  var target = this;
  if (typeof target !== "function" || toStr$1.apply(target) !== funcType) {
    throw new TypeError(ERROR_MESSAGE + target);
  }
  var args = slicy(arguments, 1);
  var bound2;
  var binder = function() {
    if (this instanceof bound2) {
      var result = target.apply(
        this,
        concatty(args, arguments)
      );
      if (Object(result) === result) {
        return result;
      }
      return this;
    }
    return target.apply(
      that,
      concatty(args, arguments)
    );
  };
  var boundLength = max(0, target.length - args.length);
  var boundArgs = [];
  for (var i = 0; i < boundLength; i++) {
    boundArgs[i] = "$" + i;
  }
  bound2 = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
  if (target.prototype) {
    var Empty = function Empty2() {
    };
    Empty.prototype = target.prototype;
    bound2.prototype = new Empty();
    Empty.prototype = null;
  }
  return bound2;
};
var implementation$9 = implementation$a;
var functionBind = Function.prototype.bind || implementation$9;
var call = Function.prototype.call;
var $hasOwn = Object.prototype.hasOwnProperty;
var bind$1 = functionBind;
var hasown = bind$1.call(call, $hasOwn);
var undefined$1;
var $Error = esErrors;
var $EvalError = _eval;
var $RangeError = range;
var $ReferenceError = ref;
var $SyntaxError$1 = syntax;
var $TypeError$4 = type;
var $URIError = uri;
var $Function = Function;
var getEvalledConstructor = function(expressionSyntax) {
  try {
    return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
  } catch (e) {
  }
};
var $gOPD$2 = Object.getOwnPropertyDescriptor;
if ($gOPD$2) {
  try {
    $gOPD$2({}, "");
  } catch (e) {
    $gOPD$2 = null;
  }
}
var throwTypeError = function() {
  throw new $TypeError$4();
};
var ThrowTypeError = $gOPD$2 ? function() {
  try {
    arguments.callee;
    return throwTypeError;
  } catch (calleeThrows) {
    try {
      return $gOPD$2(arguments, "callee").get;
    } catch (gOPDthrows) {
      return throwTypeError;
    }
  }
}() : throwTypeError;
var hasSymbols$3 = hasSymbols$4();
var hasProto2 = hasProto$1();
var getProto$1 = Object.getPrototypeOf || (hasProto2 ? function(x) {
  return x.__proto__;
} : null);
var needsEval = {};
var TypedArray = typeof Uint8Array === "undefined" || !getProto$1 ? undefined$1 : getProto$1(Uint8Array);
var INTRINSICS = {
  __proto__: null,
  "%AggregateError%": typeof AggregateError === "undefined" ? undefined$1 : AggregateError,
  "%Array%": Array,
  "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined$1 : ArrayBuffer,
  "%ArrayIteratorPrototype%": hasSymbols$3 && getProto$1 ? getProto$1([][Symbol.iterator]()) : undefined$1,
  "%AsyncFromSyncIteratorPrototype%": undefined$1,
  "%AsyncFunction%": needsEval,
  "%AsyncGenerator%": needsEval,
  "%AsyncGeneratorFunction%": needsEval,
  "%AsyncIteratorPrototype%": needsEval,
  "%Atomics%": typeof Atomics === "undefined" ? undefined$1 : Atomics,
  "%BigInt%": typeof BigInt === "undefined" ? undefined$1 : BigInt,
  "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined$1 : BigInt64Array,
  "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined$1 : BigUint64Array,
  "%Boolean%": Boolean,
  "%DataView%": typeof DataView === "undefined" ? undefined$1 : DataView,
  "%Date%": Date,
  "%decodeURI%": decodeURI,
  "%decodeURIComponent%": decodeURIComponent,
  "%encodeURI%": encodeURI,
  "%encodeURIComponent%": encodeURIComponent,
  "%Error%": $Error,
  "%eval%": eval,
  // eslint-disable-line no-eval
  "%EvalError%": $EvalError,
  "%Float32Array%": typeof Float32Array === "undefined" ? undefined$1 : Float32Array,
  "%Float64Array%": typeof Float64Array === "undefined" ? undefined$1 : Float64Array,
  "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined$1 : FinalizationRegistry,
  "%Function%": $Function,
  "%GeneratorFunction%": needsEval,
  "%Int8Array%": typeof Int8Array === "undefined" ? undefined$1 : Int8Array,
  "%Int16Array%": typeof Int16Array === "undefined" ? undefined$1 : Int16Array,
  "%Int32Array%": typeof Int32Array === "undefined" ? undefined$1 : Int32Array,
  "%isFinite%": isFinite,
  "%isNaN%": isNaN,
  "%IteratorPrototype%": hasSymbols$3 && getProto$1 ? getProto$1(getProto$1([][Symbol.iterator]())) : undefined$1,
  "%JSON%": typeof JSON === "object" ? JSON : undefined$1,
  "%Map%": typeof Map === "undefined" ? undefined$1 : Map,
  "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols$3 || !getProto$1 ? undefined$1 : getProto$1((/* @__PURE__ */ new Map())[Symbol.iterator]()),
  "%Math%": Math,
  "%Number%": Number,
  "%Object%": Object,
  "%parseFloat%": parseFloat,
  "%parseInt%": parseInt,
  "%Promise%": typeof Promise === "undefined" ? undefined$1 : Promise,
  "%Proxy%": typeof Proxy === "undefined" ? undefined$1 : Proxy,
  "%RangeError%": $RangeError,
  "%ReferenceError%": $ReferenceError,
  "%Reflect%": typeof Reflect === "undefined" ? undefined$1 : Reflect,
  "%RegExp%": RegExp,
  "%Set%": typeof Set === "undefined" ? undefined$1 : Set,
  "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols$3 || !getProto$1 ? undefined$1 : getProto$1((/* @__PURE__ */ new Set())[Symbol.iterator]()),
  "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined$1 : SharedArrayBuffer,
  "%String%": String,
  "%StringIteratorPrototype%": hasSymbols$3 && getProto$1 ? getProto$1(""[Symbol.iterator]()) : undefined$1,
  "%Symbol%": hasSymbols$3 ? Symbol : undefined$1,
  "%SyntaxError%": $SyntaxError$1,
  "%ThrowTypeError%": ThrowTypeError,
  "%TypedArray%": TypedArray,
  "%TypeError%": $TypeError$4,
  "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined$1 : Uint8Array,
  "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined$1 : Uint8ClampedArray,
  "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined$1 : Uint16Array,
  "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined$1 : Uint32Array,
  "%URIError%": $URIError,
  "%WeakMap%": typeof WeakMap === "undefined" ? undefined$1 : WeakMap,
  "%WeakRef%": typeof WeakRef === "undefined" ? undefined$1 : WeakRef,
  "%WeakSet%": typeof WeakSet === "undefined" ? undefined$1 : WeakSet
};
if (getProto$1) {
  try {
    null.error;
  } catch (e) {
    var errorProto = getProto$1(getProto$1(e));
    INTRINSICS["%Error.prototype%"] = errorProto;
  }
}
var doEval = function doEval2(name) {
  var value;
  if (name === "%AsyncFunction%") {
    value = getEvalledConstructor("async function () {}");
  } else if (name === "%GeneratorFunction%") {
    value = getEvalledConstructor("function* () {}");
  } else if (name === "%AsyncGeneratorFunction%") {
    value = getEvalledConstructor("async function* () {}");
  } else if (name === "%AsyncGenerator%") {
    var fn = doEval2("%AsyncGeneratorFunction%");
    if (fn) {
      value = fn.prototype;
    }
  } else if (name === "%AsyncIteratorPrototype%") {
    var gen = doEval2("%AsyncGenerator%");
    if (gen && getProto$1) {
      value = getProto$1(gen.prototype);
    }
  }
  INTRINSICS[name] = value;
  return value;
};
var LEGACY_ALIASES = {
  __proto__: null,
  "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
  "%ArrayPrototype%": ["Array", "prototype"],
  "%ArrayProto_entries%": ["Array", "prototype", "entries"],
  "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
  "%ArrayProto_keys%": ["Array", "prototype", "keys"],
  "%ArrayProto_values%": ["Array", "prototype", "values"],
  "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
  "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
  "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
  "%BooleanPrototype%": ["Boolean", "prototype"],
  "%DataViewPrototype%": ["DataView", "prototype"],
  "%DatePrototype%": ["Date", "prototype"],
  "%ErrorPrototype%": ["Error", "prototype"],
  "%EvalErrorPrototype%": ["EvalError", "prototype"],
  "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
  "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
  "%FunctionPrototype%": ["Function", "prototype"],
  "%Generator%": ["GeneratorFunction", "prototype"],
  "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
  "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
  "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
  "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
  "%JSONParse%": ["JSON", "parse"],
  "%JSONStringify%": ["JSON", "stringify"],
  "%MapPrototype%": ["Map", "prototype"],
  "%NumberPrototype%": ["Number", "prototype"],
  "%ObjectPrototype%": ["Object", "prototype"],
  "%ObjProto_toString%": ["Object", "prototype", "toString"],
  "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
  "%PromisePrototype%": ["Promise", "prototype"],
  "%PromiseProto_then%": ["Promise", "prototype", "then"],
  "%Promise_all%": ["Promise", "all"],
  "%Promise_reject%": ["Promise", "reject"],
  "%Promise_resolve%": ["Promise", "resolve"],
  "%RangeErrorPrototype%": ["RangeError", "prototype"],
  "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
  "%RegExpPrototype%": ["RegExp", "prototype"],
  "%SetPrototype%": ["Set", "prototype"],
  "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
  "%StringPrototype%": ["String", "prototype"],
  "%SymbolPrototype%": ["Symbol", "prototype"],
  "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
  "%TypedArrayPrototype%": ["TypedArray", "prototype"],
  "%TypeErrorPrototype%": ["TypeError", "prototype"],
  "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
  "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
  "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
  "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
  "%URIErrorPrototype%": ["URIError", "prototype"],
  "%WeakMapPrototype%": ["WeakMap", "prototype"],
  "%WeakSetPrototype%": ["WeakSet", "prototype"]
};
var bind2 = functionBind;
var hasOwn = hasown;
var $concat = bind2.call(Function.call, Array.prototype.concat);
var $spliceApply = bind2.call(Function.apply, Array.prototype.splice);
var $replace = bind2.call(Function.call, String.prototype.replace);
var $strSlice = bind2.call(Function.call, String.prototype.slice);
var $exec = bind2.call(Function.call, RegExp.prototype.exec);
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g;
var stringToPath = function stringToPath2(string) {
  var first = $strSlice(string, 0, 1);
  var last2 = $strSlice(string, -1);
  if (first === "%" && last2 !== "%") {
    throw new $SyntaxError$1("invalid intrinsic syntax, expected closing `%`");
  } else if (last2 === "%" && first !== "%") {
    throw new $SyntaxError$1("invalid intrinsic syntax, expected opening `%`");
  }
  var result = [];
  $replace(string, rePropName, function(match, number, quote, subString) {
    result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
  });
  return result;
};
var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
  var intrinsicName = name;
  var alias;
  if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
    alias = LEGACY_ALIASES[intrinsicName];
    intrinsicName = "%" + alias[0] + "%";
  }
  if (hasOwn(INTRINSICS, intrinsicName)) {
    var value = INTRINSICS[intrinsicName];
    if (value === needsEval) {
      value = doEval(intrinsicName);
    }
    if (typeof value === "undefined" && !allowMissing) {
      throw new $TypeError$4("intrinsic " + name + " exists, but is not available. Please file an issue!");
    }
    return {
      alias,
      name: intrinsicName,
      value
    };
  }
  throw new $SyntaxError$1("intrinsic " + name + " does not exist!");
};
var getIntrinsic = function GetIntrinsic(name, allowMissing) {
  if (typeof name !== "string" || name.length === 0) {
    throw new $TypeError$4("intrinsic name must be a non-empty string");
  }
  if (arguments.length > 1 && typeof allowMissing !== "boolean") {
    throw new $TypeError$4('"allowMissing" argument must be a boolean');
  }
  if ($exec(/^%?[^%]*%?$/, name) === null) {
    throw new $SyntaxError$1("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
  }
  var parts = stringToPath(name);
  var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
  var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
  var intrinsicRealName = intrinsic.name;
  var value = intrinsic.value;
  var skipFurtherCaching = false;
  var alias = intrinsic.alias;
  if (alias) {
    intrinsicBaseName = alias[0];
    $spliceApply(parts, $concat([0, 1], alias));
  }
  for (var i = 1, isOwn = true; i < parts.length; i += 1) {
    var part = parts[i];
    var first = $strSlice(part, 0, 1);
    var last2 = $strSlice(part, -1);
    if ((first === '"' || first === "'" || first === "`" || (last2 === '"' || last2 === "'" || last2 === "`")) && first !== last2) {
      throw new $SyntaxError$1("property names with quotes must have matching quotes");
    }
    if (part === "constructor" || !isOwn) {
      skipFurtherCaching = true;
    }
    intrinsicBaseName += "." + part;
    intrinsicRealName = "%" + intrinsicBaseName + "%";
    if (hasOwn(INTRINSICS, intrinsicRealName)) {
      value = INTRINSICS[intrinsicRealName];
    } else if (value != null) {
      if (!(part in value)) {
        if (!allowMissing) {
          throw new $TypeError$4("base intrinsic for " + name + " exists, but the property is not available.");
        }
        return void 0;
      }
      if ($gOPD$2 && i + 1 >= parts.length) {
        var desc = $gOPD$2(value, part);
        isOwn = !!desc;
        if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
          value = desc.get;
        } else {
          value = value[part];
        }
      } else {
        isOwn = hasOwn(value, part);
        value = value[part];
      }
      if (isOwn && !skipFurtherCaching) {
        INTRINSICS[intrinsicRealName] = value;
      }
    }
  }
  return value;
};
var GetIntrinsic$6 = getIntrinsic;
var $defineProperty$2 = GetIntrinsic$6("%Object.defineProperty%", true) || false;
if ($defineProperty$2) {
  try {
    $defineProperty$2({}, "a", { value: 1 });
  } catch (e) {
    $defineProperty$2 = false;
  }
}
var esDefineProperty = $defineProperty$2;
var GetIntrinsic$5 = getIntrinsic;
var $gOPD$1 = GetIntrinsic$5("%Object.getOwnPropertyDescriptor%", true);
if ($gOPD$1) {
  try {
    $gOPD$1([], "length");
  } catch (e) {
    $gOPD$1 = null;
  }
}
var gopd$1 = $gOPD$1;
var $defineProperty$1 = esDefineProperty;
var $SyntaxError = syntax;
var $TypeError$3 = type;
var gopd = gopd$1;
var defineDataProperty$1 = function defineDataProperty(obj, property, value) {
  if (!obj || typeof obj !== "object" && typeof obj !== "function") {
    throw new $TypeError$3("`obj` must be an object or a function`");
  }
  if (typeof property !== "string" && typeof property !== "symbol") {
    throw new $TypeError$3("`property` must be a string or a symbol`");
  }
  if (arguments.length > 3 && typeof arguments[3] !== "boolean" && arguments[3] !== null) {
    throw new $TypeError$3("`nonEnumerable`, if provided, must be a boolean or null");
  }
  if (arguments.length > 4 && typeof arguments[4] !== "boolean" && arguments[4] !== null) {
    throw new $TypeError$3("`nonWritable`, if provided, must be a boolean or null");
  }
  if (arguments.length > 5 && typeof arguments[5] !== "boolean" && arguments[5] !== null) {
    throw new $TypeError$3("`nonConfigurable`, if provided, must be a boolean or null");
  }
  if (arguments.length > 6 && typeof arguments[6] !== "boolean") {
    throw new $TypeError$3("`loose`, if provided, must be a boolean");
  }
  var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
  var nonWritable = arguments.length > 4 ? arguments[4] : null;
  var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
  var loose = arguments.length > 6 ? arguments[6] : false;
  var desc = !!gopd && gopd(obj, property);
  if ($defineProperty$1) {
    $defineProperty$1(obj, property, {
      configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
      enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
      value,
      writable: nonWritable === null && desc ? desc.writable : !nonWritable
    });
  } else if (loose || !nonEnumerable && !nonWritable && !nonConfigurable) {
    obj[property] = value;
  } else {
    throw new $SyntaxError("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
  }
};
var $defineProperty = esDefineProperty;
var hasPropertyDescriptors = function hasPropertyDescriptors2() {
  return !!$defineProperty;
};
hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
  if (!$defineProperty) {
    return null;
  }
  try {
    return $defineProperty([], "length", { value: 1 }).length !== 1;
  } catch (e) {
    return true;
  }
};
var hasPropertyDescriptors_1 = hasPropertyDescriptors;
var keys2 = objectKeys$1;
var hasSymbols$2 = typeof Symbol === "function" && typeof Symbol("foo") === "symbol";
var toStr = Object.prototype.toString;
var concat = Array.prototype.concat;
var defineDataProperty2 = defineDataProperty$1;
var isFunction = function(fn) {
  return typeof fn === "function" && toStr.call(fn) === "[object Function]";
};
var supportsDescriptors$2 = hasPropertyDescriptors_1();
var defineProperty$1 = function(object, name, value, predicate) {
  if (name in object) {
    if (predicate === true) {
      if (object[name] === value) {
        return;
      }
    } else if (!isFunction(predicate) || !predicate()) {
      return;
    }
  }
  if (supportsDescriptors$2) {
    defineDataProperty2(object, name, value, true);
  } else {
    defineDataProperty2(object, name, value);
  }
};
var defineProperties$1 = function(object, map2) {
  var predicates = arguments.length > 2 ? arguments[2] : {};
  var props = keys2(map2);
  if (hasSymbols$2) {
    props = concat.call(props, Object.getOwnPropertySymbols(map2));
  }
  for (var i = 0; i < props.length; i += 1) {
    defineProperty$1(object, props[i], map2[props[i]], predicates[props[i]]);
  }
};
defineProperties$1.supportsDescriptors = !!supportsDescriptors$2;
var defineProperties_1 = defineProperties$1;
var callBind$4 = { exports: {} };
var GetIntrinsic$4 = getIntrinsic;
var define$5 = defineDataProperty$1;
var hasDescriptors$1 = hasPropertyDescriptors_1();
var gOPD$2 = gopd$1;
var $TypeError$2 = type;
var $floor = GetIntrinsic$4("%Math.floor%");
var setFunctionLength = function setFunctionLength2(fn, length) {
  if (typeof fn !== "function") {
    throw new $TypeError$2("`fn` is not a function");
  }
  if (typeof length !== "number" || length < 0 || length > 4294967295 || $floor(length) !== length) {
    throw new $TypeError$2("`length` must be a positive 32-bit integer");
  }
  var loose = arguments.length > 2 && !!arguments[2];
  var functionLengthIsConfigurable = true;
  var functionLengthIsWritable = true;
  if ("length" in fn && gOPD$2) {
    var desc = gOPD$2(fn, "length");
    if (desc && !desc.configurable) {
      functionLengthIsConfigurable = false;
    }
    if (desc && !desc.writable) {
      functionLengthIsWritable = false;
    }
  }
  if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) {
    if (hasDescriptors$1) {
      define$5(
        /** @type {Parameters<define>[0]} */
        fn,
        "length",
        length,
        true,
        true
      );
    } else {
      define$5(
        /** @type {Parameters<define>[0]} */
        fn,
        "length",
        length
      );
    }
  }
  return fn;
};
(function(module) {
  var bind3 = functionBind;
  var GetIntrinsic3 = getIntrinsic;
  var setFunctionLength$1 = setFunctionLength;
  var $TypeError2 = type;
  var $apply = GetIntrinsic3("%Function.prototype.apply%");
  var $call = GetIntrinsic3("%Function.prototype.call%");
  var $reflectApply = GetIntrinsic3("%Reflect.apply%", true) || bind3.call($call, $apply);
  var $defineProperty2 = esDefineProperty;
  var $max = GetIntrinsic3("%Math.max%");
  module.exports = function callBind2(originalFunction) {
    if (typeof originalFunction !== "function") {
      throw new $TypeError2("a function is required");
    }
    var func = $reflectApply(bind3, $call, arguments);
    return setFunctionLength$1(
      func,
      1 + $max(0, originalFunction.length - (arguments.length - 1)),
      true
    );
  };
  var applyBind = function applyBind2() {
    return $reflectApply(bind3, $apply, arguments);
  };
  if ($defineProperty2) {
    $defineProperty2(module.exports, "apply", { value: applyBind });
  } else {
    module.exports.apply = applyBind;
  }
})(callBind$4);
var callBindExports = callBind$4.exports;
var GetIntrinsic$3 = getIntrinsic;
var callBind$3 = callBindExports;
var $indexOf = callBind$3(GetIntrinsic$3("String.prototype.indexOf"));
var callBound$7 = function callBoundIntrinsic(name, allowMissing) {
  var intrinsic = GetIntrinsic$3(name, !!allowMissing);
  if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
    return callBind$3(intrinsic);
  }
  return intrinsic;
};
var objectKeys = objectKeys$1;
var hasSymbols$1 = shams$1();
var callBound$6 = callBound$7;
var toObject = Object;
var $push = callBound$6("Array.prototype.push");
var $propIsEnumerable = callBound$6("Object.prototype.propertyIsEnumerable");
var originalGetSymbols = hasSymbols$1 ? Object.getOwnPropertySymbols : null;
var implementation$8 = function assign(target, source1) {
  if (target == null) {
    throw new TypeError("target must be an object");
  }
  var to = toObject(target);
  if (arguments.length === 1) {
    return to;
  }
  for (var s2 = 1; s2 < arguments.length; ++s2) {
    var from2 = toObject(arguments[s2]);
    var keys3 = objectKeys(from2);
    var getSymbols = hasSymbols$1 && (Object.getOwnPropertySymbols || originalGetSymbols);
    if (getSymbols) {
      var syms = getSymbols(from2);
      for (var j = 0; j < syms.length; ++j) {
        var key = syms[j];
        if ($propIsEnumerable(from2, key)) {
          $push(keys3, key);
        }
      }
    }
    for (var i = 0; i < keys3.length; ++i) {
      var nextKey = keys3[i];
      if ($propIsEnumerable(from2, nextKey)) {
        var propValue = from2[nextKey];
        to[nextKey] = propValue;
      }
    }
  }
  return to;
};
var implementation$7 = implementation$8;
var lacksProperEnumerationOrder = function() {
  if (!Object.assign) {
    return false;
  }
  var str = "abcdefghijklmnopqrst";
  var letters = str.split("");
  var map2 = {};
  for (var i = 0; i < letters.length; ++i) {
    map2[letters[i]] = letters[i];
  }
  var obj = Object.assign({}, map2);
  var actual = "";
  for (var k2 in obj) {
    actual += k2;
  }
  return str !== actual;
};
var assignHasPendingExceptions = function() {
  if (!Object.assign || !Object.preventExtensions) {
    return false;
  }
  var thrower = Object.preventExtensions({ 1: 2 });
  try {
    Object.assign(thrower, "xy");
  } catch (e) {
    return thrower[1] === "y";
  }
  return false;
};
var polyfill$4 = function getPolyfill() {
  if (!Object.assign) {
    return implementation$7;
  }
  if (lacksProperEnumerationOrder()) {
    return implementation$7;
  }
  if (assignHasPendingExceptions()) {
    return implementation$7;
  }
  return Object.assign;
};
var define$4 = defineProperties_1;
var getPolyfill$5 = polyfill$4;
var shim$5 = function shimAssign() {
  var polyfill2 = getPolyfill$5();
  define$4(
    Object,
    { assign: polyfill2 },
    { assign: function() {
      return Object.assign !== polyfill2;
    } }
  );
  return polyfill2;
};
var defineProperties = defineProperties_1;
var callBind$2 = callBindExports;
var implementation$6 = implementation$8;
var getPolyfill$4 = polyfill$4;
var shim$4 = shim$5;
var polyfill$3 = callBind$2.apply(getPolyfill$4());
var bound = function assign2(target, source1) {
  return polyfill$3(Object, arguments);
};
defineProperties(bound, {
  getPolyfill: getPolyfill$4,
  implementation: implementation$6,
  shim: shim$4
});
var functionsHaveNames = function functionsHaveNames2() {
  return typeof (function f2() {
  }).name === "string";
};
var gOPD$1 = Object.getOwnPropertyDescriptor;
if (gOPD$1) {
  try {
    gOPD$1([], "length");
  } catch (e) {
    gOPD$1 = null;
  }
}
functionsHaveNames.functionsHaveConfigurableNames = function functionsHaveConfigurableNames() {
  if (!functionsHaveNames() || !gOPD$1) {
    return false;
  }
  var desc = gOPD$1(function() {
  }, "name");
  return !!desc && !!desc.configurable;
};
var $bind = Function.prototype.bind;
functionsHaveNames.boundFunctionsHaveNames = function boundFunctionsHaveNames() {
  return functionsHaveNames() && typeof $bind === "function" && (function f2() {
  }).bind().name !== "";
};
var functionsHaveNames_1 = functionsHaveNames;
var define$3 = defineDataProperty$1;
var hasDescriptors = hasPropertyDescriptors_1();
var functionsHaveConfigurableNames2 = functionsHaveNames_1.functionsHaveConfigurableNames();
var $TypeError$1 = type;
var setFunctionName$1 = function setFunctionName(fn, name) {
  if (typeof fn !== "function") {
    throw new $TypeError$1("`fn` is not a function");
  }
  var loose = arguments.length > 2 && !!arguments[2];
  if (!loose || functionsHaveConfigurableNames2) {
    if (hasDescriptors) {
      define$3(
        /** @type {Parameters<define>[0]} */
        fn,
        "name",
        name,
        true,
        true
      );
    } else {
      define$3(
        /** @type {Parameters<define>[0]} */
        fn,
        "name",
        name
      );
    }
  }
  return fn;
};
var setFunctionName2 = setFunctionName$1;
var $TypeError = type;
var $Object = Object;
var implementation$5 = setFunctionName2(function flags() {
  if (this == null || this !== $Object(this)) {
    throw new $TypeError("RegExp.prototype.flags getter called on non-object");
  }
  var result = "";
  if (this.hasIndices) {
    result += "d";
  }
  if (this.global) {
    result += "g";
  }
  if (this.ignoreCase) {
    result += "i";
  }
  if (this.multiline) {
    result += "m";
  }
  if (this.dotAll) {
    result += "s";
  }
  if (this.unicode) {
    result += "u";
  }
  if (this.unicodeSets) {
    result += "v";
  }
  if (this.sticky) {
    result += "y";
  }
  return result;
}, "get flags", true);
var implementation$4 = implementation$5;
var supportsDescriptors$1 = defineProperties_1.supportsDescriptors;
var $gOPD = Object.getOwnPropertyDescriptor;
var polyfill$2 = function getPolyfill2() {
  if (supportsDescriptors$1 && /a/mig.flags === "gim") {
    var descriptor = $gOPD(RegExp.prototype, "flags");
    if (descriptor && typeof descriptor.get === "function" && "dotAll" in RegExp.prototype && "hasIndices" in RegExp.prototype) {
      var calls = "";
      var o = {};
      Object.defineProperty(o, "hasIndices", {
        get: function() {
          calls += "d";
        }
      });
      Object.defineProperty(o, "sticky", {
        get: function() {
          calls += "y";
        }
      });
      descriptor.get.call(o);
      if (calls === "dy") {
        return descriptor.get;
      }
    }
  }
  return implementation$4;
};
var supportsDescriptors = defineProperties_1.supportsDescriptors;
var getPolyfill$3 = polyfill$2;
var gOPD = Object.getOwnPropertyDescriptor;
var defineProperty = Object.defineProperty;
var TypeErr = TypeError;
var getProto = Object.getPrototypeOf;
var regex = /a/;
var shim$3 = function shimFlags() {
  if (!supportsDescriptors || !getProto) {
    throw new TypeErr("RegExp.prototype.flags requires a true ES5 environment that supports property descriptors");
  }
  var polyfill2 = getPolyfill$3();
  var proto = getProto(regex);
  var descriptor = gOPD(proto, "flags");
  if (!descriptor || descriptor.get !== polyfill2) {
    defineProperty(proto, "flags", {
      configurable: true,
      enumerable: false,
      get: polyfill2
    });
  }
  return polyfill2;
};
var define$2 = defineProperties_1;
var callBind$1 = callBindExports;
var implementation$3 = implementation$5;
var getPolyfill$2 = polyfill$2;
var shim$2 = shim$3;
var flagsBound = callBind$1(getPolyfill$2());
define$2(flagsBound, {
  getPolyfill: getPolyfill$2,
  implementation: implementation$3,
  shim: shim$2
});
var hasSymbols2 = shams$1;
var shams = function hasToStringTagShams() {
  return hasSymbols2() && !!Symbol.toStringTag;
};
var hasToStringTag$1 = shams();
var callBound$5 = callBound$7;
var $toString = callBound$5("Object.prototype.toString");
var isStandardArguments = function isArguments3(value) {
  if (hasToStringTag$1 && value && typeof value === "object" && Symbol.toStringTag in value) {
    return false;
  }
  return $toString(value) === "[object Arguments]";
};
var isLegacyArguments = function isArguments4(value) {
  if (isStandardArguments(value)) {
    return true;
  }
  return value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && $toString(value) !== "[object Array]" && $toString(value.callee) === "[object Function]";
};
(function() {
  return isStandardArguments(arguments);
})();
isStandardArguments.isLegacyArguments = isLegacyArguments;
var GetIntrinsic$2 = getIntrinsic;
var callBound$4 = callBound$7;
GetIntrinsic$2("%WeakMap%", true);
GetIntrinsic$2("%Map%", true);
callBound$4("WeakMap.prototype.get", true);
callBound$4("WeakMap.prototype.set", true);
callBound$4("WeakMap.prototype.has", true);
callBound$4("Map.prototype.get", true);
callBound$4("Map.prototype.set", true);
callBound$4("Map.prototype.has", true);
typeof StopIteration === "object" ? StopIteration : null;
shams();
if (hasSymbols$4() || shams$1()) ;
else {
  var GetIntrinsic$1 = getIntrinsic;
  var $Map = GetIntrinsic$1("%Map%", true);
  var $Set = GetIntrinsic$1("%Set%", true);
  var callBound$3 = callBound$7;
  callBound$3("Array.prototype.push");
  callBound$3("String.prototype.charCodeAt");
  callBound$3("String.prototype.slice");
  if (!$Map && !$Set) ;
  else {
    callBound$3("Map.prototype.forEach", true);
    callBound$3("Set.prototype.forEach", true);
    if (typeof process === "undefined" || !process.versions || !process.versions.node) {
      callBound$3("Map.prototype.iterator", true);
      callBound$3("Set.prototype.iterator", true);
    }
    callBound$3("Map.prototype.@@iterator", true) || callBound$3("Map.prototype._es6-shim iterator_", true);
    callBound$3("Set.prototype.@@iterator", true) || callBound$3("Set.prototype._es6-shim iterator_", true);
  }
}
var numberIsNaN = function(value) {
  return value !== value;
};
var implementation$2 = function is(a, b2) {
  if (a === 0 && b2 === 0) {
    return 1 / a === 1 / b2;
  }
  if (a === b2) {
    return true;
  }
  if (numberIsNaN(a) && numberIsNaN(b2)) {
    return true;
  }
  return false;
};
var implementation$1 = implementation$2;
var polyfill$1 = function getPolyfill3() {
  return typeof Object.is === "function" ? Object.is : implementation$1;
};
var getPolyfill$1 = polyfill$1;
var define$1 = defineProperties_1;
var shim$1 = function shimObjectIs() {
  var polyfill2 = getPolyfill$1();
  define$1(Object, { is: polyfill2 }, {
    is: function testObjectIs() {
      return Object.is !== polyfill2;
    }
  });
  return polyfill2;
};
var define = defineProperties_1;
var callBind = callBindExports;
var implementation = implementation$2;
var getPolyfill4 = polyfill$1;
var shim = shim$1;
var polyfill = callBind(getPolyfill4(), Object);
define(polyfill, {
  getPolyfill: getPolyfill4,
  implementation,
  shim
});
shams();
var callBound$2 = callBound$7;
var hasToStringTag = shams();
var isRegexMarker;
var badStringifier;
if (hasToStringTag) {
  callBound$2("Object.prototype.hasOwnProperty");
  callBound$2("RegExp.prototype.exec");
  isRegexMarker = {};
  var throwRegexMarker = function() {
    throw isRegexMarker;
  };
  badStringifier = {
    toString: throwRegexMarker,
    valueOf: throwRegexMarker
  };
  if (typeof Symbol.toPrimitive === "symbol") {
    badStringifier[Symbol.toPrimitive] = throwRegexMarker;
  }
}
callBound$2("Object.prototype.toString");
shams();
var callBound$1 = callBound$7;
callBound$1("Boolean.prototype.toString");
callBound$1("Object.prototype.toString");
shams();
hasSymbols$4();
var $BigInt = typeof BigInt !== "undefined" && BigInt;
var hasBigints = function hasNativeBigInts() {
  return typeof $BigInt === "function" && typeof BigInt === "function" && typeof $BigInt(42) === "bigint" && typeof BigInt(42) === "bigint";
};
hasBigints();
var callBound = callBound$7;
var GetIntrinsic2 = getIntrinsic;
callBound("SharedArrayBuffer.prototype.byteLength", true);
callBound("Date.prototype.getTime");
callBound("Object.prototype.toString");
GetIntrinsic2("%Set%", true);
callBound("Map.prototype.has", true);
callBound("Map.prototype.get", true);
callBound("Map.prototype.size", true);
callBound("Set.prototype.add", true);
callBound("Set.prototype.delete", true);
callBound("Set.prototype.has", true);
callBound("Set.prototype.size", true);
function randomString() {
  var length = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 8;
  var charset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "abcdefghijklmnopqrstuvwxyz";
  var text = "";
  for (var i = 0; i < length; i++) {
    text += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return text;
}
function randomNumber() {
  var min = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
  var max2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1e3;
  return Math.floor(Math.random() * (max2 - min + 1)) + min;
}
var isNode = { exports: {} };
(function(module, exports) {
  module.exports = !!(typeof process !== "undefined" && process.versions && process.versions.node);
})(isNode);
async function runBasicsTests(r2, m2) {
  try {
    var g = new TaskQueue("runBasicsTests", m2), y = await r2.getDirectory(), b2 = await y.getDirectoryHandle("basics-test", { create: true }), f2 = new AbstractFile(b2.getFileHandle("check-file.txt", { create: true }), 100, []), E = false;
    if (await g.runWrite(async (e) => {
      var t = await f2.readHeader(e);
      t && t.done && (E = true);
    }), E) return void console.log("dev-mode: runBasicsTests() HAS RUN ALREADY");
    console.log("dev-mode: runBasicsTests() START");
    var B = await b2.getFileHandle("write-test.txt", { create: true });
    console.log("dev-mode: runBasicsTests() 0.0");
    var R = await B.createAccessHandle();
    console.log("dev-mode: runBasicsTests() 0.1");
    var T = await R.getWritable();
    await T.write(ENCODER.encode("1234567890"), { at: 0 }), console.log("dev-mode: runBasicsTests() 0.2"), console.log("dev-mode: runBasicsTests() 1");
    var S = await R.read(2, 10);
    if ("34567890" !== DECODER.decode(S)) throw new Error("wrong readBufferA " + DECODER.decode(S));
    console.log("dev-mode: runBasicsTests() 2"), T = await R.getWritable(), await T.write(ENCODER.encode("FOOBAR"), { at: 4 }), console.log("dev-mode: runBasicsTests() 3");
    var N = await R.read(0, 10);
    if (console.log("dev-mode: runBasicsTests() 3.1"), "1234FOOBAR" !== DECODER.decode(N)) throw new Error("wrong readBuffer " + DECODER.decode(N));
    console.log("dev-mode: runBasicsTests() 4"), await R.close(), console.log("dev-mode: runBasicsTests() 5");
    var W2 = new AbstractFile(b2.getFileHandle("one-file.txt", { create: true }), 0, [{ type: "number", length: 5 }, { type: "string", length: 1 }, { type: "string", length: 20 }]), A = [[1, "A", toPaddedString("foobar1", 20)], [2, "B", toPaddedString("foobar2", 20)], [3, "C", toPaddedString("foobar3", 20)]];
    await g.runWrite(async (e) => {
      await W2.appendRows(e, A);
    }), await g.runRead(async (e) => {
      var t = [];
      if (await W2.readRows(e, 0, (e2) => t.push(e2)), JSON.stringify(A) !== JSON.stringify(t)) throw console.dir({ writeRows: A, readRows: t }), new Error("rows not equal!");
    }), await g.runWrite(async (e) => {
      await f2.writeHeader(e, { done: true });
    });
    var O = "runBasicsTests()";
    console.log("dev-mode: runBasicsTests() ENSURE CLEANUP WORKS 0");
    var U = getRxStorageAbstractFilesystem({ name: "test", abstractFilesystem: r2, abstractLock: m2, jsonPositionSize: DEFAULT_DOC_JSON_POSITION_SIZE });
    console.log("dev-mode: runBasicsTests() ENSURE CLEANUP WORKS 1");
    var h = await U.createStorageInstance({ databaseInstanceToken: randomCouchString(10), databaseName: randomCouchString(10), collectionName: randomCouchString(10), schema: fillWithDefaultSettings({ version: 0, type: "object", primaryKey: "key", properties: { key: { type: "string", maxLength: 50 }, stringValue: { type: "string", maxLength: 50 }, numberValue: { type: "number", minimum: 0, maximum: 1e3, multipleOf: 1 }, nes: { type: "object", properties: { ted: { type: "string", maxLength: 10 } }, required: ["ted"], additionalProperties: false }, list: { type: "array", items: { type: "object", additionalProperties: false, properties: { stringValue: { type: "string", maxLength: 50 }, numberValue: { type: "number", minimum: 0, maximum: 1e3, multipleOf: 1 } }, required: ["stringValue", "numberValue"] } } }, required: ["key", "stringValue", "numberValue", "nes", "list"], indexes: [["stringValue"], ["numberValue"], ["numberValue", "stringValue"]], additionalProperties: false }), multiInstance: false, options: {}, devMode: true });
    console.log("dev-mode: runBasicsTests() ENSURE CLEANUP WORKS 2"), await h.internals.statePromise, console.log("dev-mode: runBasicsTests() ENSURE CLEANUP WORKS 3"), await h.bulkWrite(new Array(2).fill(0).map((e, t) => ({ document: getWriteData({ key: "a-" + t, list: [] }) })), O);
    var V = getWriteData({ key: "foobar" });
    console.log("dev-mode: runBasicsTests() ENSURE CLEANUP WORKS 4");
    var k2 = [{ document: V }], L = await h.bulkWrite(k2, O);
    console.log("dev-mode: runBasicsTests() ENSURE CLEANUP WORKS 4.1");
    var P = getWrittenDocumentsFromBulkWriteResponse("key", k2, L), x = clone$1(P[0]);
    console.log("dev-mode: runBasicsTests() ENSURE CLEANUP WORKS 5"), await h.bulkWrite(new Array(2).fill(0).map((e, t) => ({ document: getWriteData({ key: "b-" + t, list: [] }) })), O), console.log("dev-mode: runBasicsTests() ENSURE CLEANUP WORKS 6"), x._rev = "2-22080c42d471e3d2625e49dcca3b8e2b", x._meta.lwt = now$1();
    await h.bulkWrite([{ previous: V, document: x }], O);
    console.log("dev-mode: runBasicsTests() ENSURE CLEANUP WORKS 7");
    for (var j = await p(h), C = false; !C; ) C = await h.cleanup(0);
    if (await p(h) >= j) throw new Error("dev-mode: runBasicsTests() docs not cleaned up");
    await h.close();
  } catch (e) {
    throw console.log("dev-mode: runBasicsTests() failed:"), console.dir(e), await promiseWait(1e7), e;
  }
  console.log("dev-mode: runBasicsTests() DONE");
}
async function p(e) {
  var t = -1;
  return await e.taskQueue.runRead(async (a) => {
    var s2 = await e.internals.statePromise, o = await getAccessHandle(s2.documentFileHandle, a);
    t = await o.getSize();
  }), t;
}
function getWriteData(e = {}) {
  return Object.assign({ key: randomString(10), stringValue: "barfoo", numberValue: randomNumber(1, 100), nes: { ted: randomString(10) }, list: [{ stringValue: randomString(5), numberValue: randomNumber(1, 100) }, { stringValue: randomString(5), numberValue: randomNumber(1, 100) }], _deleted: false, _attachments: {}, _meta: { lwt: now$1() }, _rev: "1-12080c42d471e3d2625e49dcca3b8e1a" }, e);
}
async function abstractFilesystemCount(d, u2, c2) {
  var f2 = await d.internals.statePromise, l = u2.queryPlan.index.slice(0), p2 = getIndexName(l), x = ensureNotFalsy(f2.indexStates.find((e) => e.name === p2));
  if (0 === x.rows.length) return { count: 0, mode: "fast" };
  for (var y = u2.queryPlan, b2 = y.index, g = y.startKeys, w = getStartIndexStringFromLowerBound(d.schema, b2, g), h = y.endKeys, v = getStartIndexStringFromUpperBound(d.schema, b2, h), P = (y.inclusiveStart ? boundGE : boundGT)(x.rows, [w], compareIndexRows), j = (y.inclusiveEnd ? boundLE : boundLT)(x.rows, [v], compareIndexRows), q = 0, K2 = false; !K2; ) {
    if (!x.rows[P] || P > j) break;
    q += 1, P++;
  }
  return { count: q, mode: "fast" };
}
var k = now$1();
var RxStorageInstanceAbstractFilesystem = function() {
  function t(t2, s2, a, i, r3, o, c2, u2, h) {
    this.changes$ = new Subject(), this.instanceId = k++, this.readQueueEntries = [], this.storage = t2, this.databaseName = s2, this.collectionName = a, this.schema = i, this.internals = r3, this.options = o, this.settings = c2, this.databaseInstanceToken = u2, this.jsonPositionSize = h, this.primaryPath = getPrimaryFieldOfPrimaryKey(this.schema.primaryKey), this.taskQueue = r3.taskQueue;
  }
  var r2 = t.prototype;
  return r2.bulkWrite = function(e, t2) {
    return this.taskQueue.runWrite(async (s2) => bulkWrite(s2, this, e, t2));
  }, r2.findDocumentsById = async function(e, t2) {
    return this.taskQueue.runRead((s2) => findDocumentsByIds(this, e, t2, s2));
  }, r2.query = function(e) {
    return this.taskQueue.runRead(async (t2) => abstractFilesystemQuery(this, e, t2));
  }, r2.count = async function(e) {
    return e.queryPlan.selectorSatisfiedByIndex ? this.taskQueue.runRead(async (t2) => await abstractFilesystemCount(this, e)) : { count: (await this.query(e)).documents.length, mode: "slow" };
  }, r2.getAttachmentData = function(e, t2, s2) {
    return this.taskQueue.runRead(async (a) => getAttachmentData(a, this, e, t2, s2));
  }, r2.getChangedDocumentsSince = function(e, t2) {
    return this.taskQueue.runRead(async (s2) => getChangedDocumentsSince(this, s2, e, t2));
  }, r2.changeStream = function() {
    return this.changes$.pipe(shareReplay(RXJS_SHARE_REPLAY_DEFAULTS));
  }, r2.cleanup = function(e) {
    return this.taskQueue.runWrite(async (t2) => await cleanup(this, t2, e));
  }, r2.close = async function() {
    return this.closed || (this.closed = (async () => {
      var e = await this.internals.statePromise;
      await this.taskQueue.awaitIdle(), e.broadcastChannelMessages$.complete(), this.changes$.complete();
    })()), this.closed;
  }, r2.remove = async function() {
    if (this.closed) throw new Error("instance is closed " + this.databaseName + "-" + this.collectionName);
    await this.taskQueue.awaitIdle(), await this.close(), await this.taskQueue.runWrite(async (e) => {
      var t2 = await this.internals.statePromise, s2 = [t2.documentFileHandle, t2.changelogFile.fileHandle];
      for (var a of t2.indexStates) s2.push(a.fileHandle);
      await Promise.all(s2.map(async (t3) => {
        var s3 = await t3, a2 = await getAccessHandle(s3, e);
        await a2.truncate(0);
      }));
    });
  }, r2.conflictResultionTasks = function() {
    return new Subject().asObservable();
  }, r2.resolveConflictResultionTask = function(e) {
    return PROMISE_RESOLVE_VOID;
  }, t;
}();
var b = false;
async function createAbstractFilesystemStorageInstance(e, t, s2) {
  !b && t.devMode && (b = true, await runBasicsTests(e.abstractFilesystem, e.abstractLock));
  var a = getLockId(t), n2 = new TaskQueue(a, e.abstractLock), i = { taskQueue: n2, statePromise: getStorageInstanceInternalState(e.abstractFilesystem, t, n2, e.jsonPositionSize) }, o = new RxStorageInstanceAbstractFilesystem(e, t.databaseName, t.collectionName, t.schema, i, t.options, s2, t.databaseInstanceToken, e.jsonPositionSize);
  return i.statePromise.then((e2) => {
    n2.beforeTaskReadOrWrite.push((t2) => processChangesFileIfRequired(t2, e2, o, false));
  }), i.statePromise.then((e2) => {
    e2.broadcastChannelMessages$.subscribe(async (t2) => {
      if ("event" === t2.type) t2.changelogOperations.forEach((t3) => {
        var s3 = t3[0];
        e2.indexStates[s3].runChangelogOperation(t3);
      }), t2.eventBulk && o.changes$.next(t2.eventBulk);
      else {
        if ("pre-write" !== t2.type) throw new Error("BroadcastChannelMessageChanges$: unknown type " + t2);
        e2.mightHaveUnprocessedChanges = t2.mightHaveUnprocessedChanges;
      }
    });
  }), o;
}
var RxStorageAbstractFilesystem = function() {
  function o(r2, t, e, s2, o2) {
    this.rxdbVersion = RXDB_PREMIUM_VERSION, this.name = r2, this.abstractFilesystem = t, this.abstractLock = e, this.inWorker = s2, this.jsonPositionSize = o2;
  }
  return o.prototype.createStorageInstance = async function(i) {
    ensureRxStorageInstanceParamsAreCorrect(i);
    var o2 = await createAbstractFilesystemStorageInstance(this, i, {});
    if (!this.inWorker) {
      ["findDocumentsById", "query", "bulkWrite"].forEach((r2) => {
        var t = o2[r2].bind(o2);
        o2[r2] = async (r3, e, s2, i2, o3) => {
          var n3 = await t(r3, e, s2, i2, o3);
          return "string" == typeof n3 && (n3 = JSON.parse(n3)), n3;
        };
      });
      var n2 = o2.changeStream.bind(o2);
      o2.changeStream = () => n2().pipe(map((r2) => ("string" == typeof r2 && (r2 = JSON.parse(r2)), r2)));
    }
    return o2;
  }, o;
}();
function getRxStorageAbstractFilesystem(r2) {
  return new RxStorageAbstractFilesystem(r2.name, r2.abstractFilesystem, r2.abstractLock, !!r2.inWorker && r2.inWorker, r2.jsonPositionSize ? r2.jsonPositionSize : DEFAULT_DOC_JSON_POSITION_SIZE);
}
var WorkerOPFSFilesystem = function() {
  function e() {
    this.opfsRootPromise = navigator.storage.getDirectory();
  }
  return e.prototype.getDirectory = async function() {
    var e2 = await this.opfsRootPromise;
    return new WorkerOPFSFilesystemDirectory(e2);
  }, e;
}();
var WorkerOPFSFilesystemDirectory = function() {
  function e(e2) {
    this.baseDir = e2;
  }
  var t = e.prototype;
  return t.getDirectoryHandle = async function(t2, n2) {
    return new e(await this.baseDir.getDirectoryHandle(t2, n2));
  }, t.getFileHandle = async function(e2, t2) {
    var n2 = await this.baseDir.getFileHandle(e2, t2);
    return new WorkerOPFSFilesystemFileHandle(e2, n2);
  }, t.removeEntry = function(e2) {
    return this.baseDir.removeEntry(e2);
  }, e;
}();
var WorkerOPFSFilesystemFileHandle = function() {
  function e(e2, t) {
    this.name = e2, this.fileHandle = t;
  }
  return e.prototype.createAccessHandle = async function() {
    return new WorkerOPFSFilesystemFileSyncAccessHandle(this);
  }, e;
}();
var WorkerOPFSFilesystemFileSyncAccessHandle = function() {
  function e(e2) {
    this.fileHandle = e2, this.syncAccessHandlePromise = createSyncAccessHandleFromFileHandle(this.fileHandle);
  }
  var t = e.prototype;
  return t.getHandle = function() {
    var e2 = this.syncAccessHandle;
    return e2 || this.syncAccessHandlePromise.then((e3) => (this.syncAccessHandle = e3, e3));
  }, t.getWritable = function() {
    return new WorkerOPFSFilesystemWritable(this);
  }, t.read = async function(e2, t2) {
    var n2 = await this.getHandle();
    t2 || (t2 = await n2.getSize());
    var a = new Uint8Array(t2 - e2);
    return await n2.read(a, { at: e2 }), a;
  }, t.truncate = async function(e2) {
    var t2 = await this.getHandle();
    await t2.truncate(e2);
  }, t.getSize = async function() {
    return (await this.getHandle()).getSize();
  }, t.close = async function() {
    var e2 = await this.getHandle();
    await e2.close();
  }, e;
}();
var WorkerOPFSFilesystemWritable = function() {
  function e(e2) {
    this.accessHandle = e2;
  }
  var t = e.prototype;
  return t.write = async function(e2, t2) {
    var n2 = await this.accessHandle.getHandle();
    await n2.write(e2, t2);
  }, t.flush = async function() {
    var e2 = await this.accessHandle.getHandle();
    await e2.flush();
  }, t.close = async function() {
    var e2 = await this.accessHandle.getHandle();
    await e2.close();
  }, e;
}();
async function createSyncAccessHandleFromFileHandle(e) {
  if ("function" != typeof e.fileHandle.createSyncAccessHandle) throw new Error('Could not access fileHandle.createSyncAccessHandle(). Likely this is because this storage only works "inside dedicated Web Workers"');
  try {
    return await e.fileHandle.createSyncAccessHandle();
  } catch (e2) {
    throw e2;
  }
}
var RX_STORAGE_NAME_OPFS = "opfs";
function getRxStorageOPFS(e = {}) {
  return getRxStorageAbstractFilesystem({ name: RX_STORAGE_NAME_OPFS, abstractFilesystem: new WorkerOPFSFilesystem(), abstractLock: navigator.locks, jsonPositionSize: e.jsonPositionSize ? e.jsonPositionSize : DEFAULT_DOC_JSON_POSITION_SIZE, inWorker: !e.usesRxDatabaseInWorker });
}
const testSchema = {
  schema: {
    title: "test",
    version: 1,
    type: "object",
    primaryKey: "id",
    properties: {
      id: {
        type: "string",
        maxLength: 100
      },
      test: {
        type: "string",
        maxLength: 100
      }
    }
  },
  migrationStrategies: {
    1: (oldDoc) => {
      oldDoc.test = "test";
      return oldDoc;
    }
  }
};
async function getOldCollectionMeta(migrationState) {
  var collectionDocKeys = getPreviousVersions(migrationState.collection.schema.jsonSchema).map((version) => migrationState.collection.name + "-" + version);
  var found = await migrationState.database.internalStore.findDocumentsById(collectionDocKeys.map((key) => getPrimaryKeyOfInternalDocument(key, INTERNAL_CONTEXT_COLLECTION)), false);
  if (found.length > 1) {
    throw new Error("more than one old collection meta found");
  }
  return found[0];
}
function migrateDocumentData(collection, docSchemaVersion, docData) {
  var attachmentsBefore = flatClone(docData._attachments);
  var mutateableDocData = clone$1(docData);
  var meta = mutateableDocData._meta;
  delete mutateableDocData._meta;
  mutateableDocData._attachments = attachmentsBefore;
  var nextVersion = docSchemaVersion + 1;
  var currentPromise = Promise.resolve(mutateableDocData);
  var _loop = function() {
    var version = nextVersion;
    currentPromise = currentPromise.then((docOrNull) => runStrategyIfNotNull(collection, version, docOrNull));
    nextVersion++;
  };
  while (nextVersion <= collection.schema.version) {
    _loop();
  }
  return currentPromise.then((doc) => {
    if (doc === null) {
      return PROMISE_RESOLVE_NULL;
    }
    doc._meta = meta;
    return doc;
  });
}
function runStrategyIfNotNull(collection, version, docOrNull) {
  if (docOrNull === null) {
    return PROMISE_RESOLVE_NULL;
  } else {
    var ret = collection.migrationStrategies[version](docOrNull, collection);
    var retPromise = toPromise(ret);
    return retPromise;
  }
}
async function mustMigrate(migrationState) {
  if (migrationState.collection.schema.version === 0) {
    return PROMISE_RESOLVE_FALSE;
  }
  var oldColDoc = await getOldCollectionMeta(migrationState);
  return !!oldColDoc;
}
var MIGRATION_DEFAULT_BATCH_SIZE = 200;
var DATA_MIGRATION_STATE_SUBJECT_BY_DATABASE = /* @__PURE__ */ new WeakMap();
function addMigrationStateToDatabase(migrationState) {
  var allSubject = getMigrationStateByDatabase(migrationState.database);
  var allList = allSubject.getValue().slice(0);
  allList.push(migrationState);
  allSubject.next(allList);
}
function getMigrationStateByDatabase(database) {
  return getFromMapOrCreate(DATA_MIGRATION_STATE_SUBJECT_BY_DATABASE, database, () => new BehaviorSubject([]));
}
function onDatabaseDestroy(database) {
  var subject = DATA_MIGRATION_STATE_SUBJECT_BY_DATABASE.get(database);
  if (subject) {
    subject.complete();
  }
}
var RxMigrationState = /* @__PURE__ */ function() {
  function RxMigrationState2(collection, migrationStrategies, statusDocKey = [collection.name, "v", collection.schema.version].join("-")) {
    this.started = false;
    this.updateStatusHandlers = [];
    this.updateStatusQueue = PROMISE_RESOLVE_TRUE;
    this.collection = collection;
    this.migrationStrategies = migrationStrategies;
    this.statusDocKey = statusDocKey;
    this.database = collection.database;
    this.oldCollectionMeta = getOldCollectionMeta(this);
    this.mustMigrate = mustMigrate(this);
    this.statusDocId = getPrimaryKeyOfInternalDocument(this.statusDocKey, INTERNAL_CONTEXT_MIGRATION_STATUS);
    addMigrationStateToDatabase(this);
    this.$ = observeSingle(this.database.internalStore, this.statusDocId).pipe(filter((d) => !!d), map((d) => ensureNotFalsy(d).data), shareReplay(RXJS_SHARE_REPLAY_DEFAULTS));
  }
  var _proto = RxMigrationState2.prototype;
  _proto.getStatus = function getStatus() {
    return firstValueFrom(this.$);
  };
  _proto.startMigration = async function startMigration(batchSize = MIGRATION_DEFAULT_BATCH_SIZE) {
    var must = await this.mustMigrate;
    if (!must) {
      return;
    }
    if (this.started) {
      throw newRxError("DM1");
    }
    this.started = true;
    var broadcastChannel = void 0;
    if (this.database.multiInstance) {
      broadcastChannel = new BroadcastChannel$1(["rx-migration-state", this.database.name, this.collection.name, this.collection.schema.version].join("|"));
      var leaderElector = createLeaderElection(broadcastChannel);
      await leaderElector.awaitLeadership();
    }
    var oldCollectionMeta = await this.oldCollectionMeta;
    var oldStorageInstance = await this.database.storage.createStorageInstance({
      databaseName: this.database.name,
      collectionName: this.collection.name,
      databaseInstanceToken: this.database.token,
      multiInstance: this.database.multiInstance,
      options: {},
      schema: oldCollectionMeta.data.schema,
      password: this.database.password,
      devMode: overwritable.isDevMode()
    });
    var connectedInstances = await this.getConnectedStorageInstances();
    var totalCount = await this.countAllDoucments([oldStorageInstance].concat(connectedInstances.map((r2) => r2.oldStorage)));
    await this.updateStatus((s2) => {
      s2.count.total = totalCount;
      return s2;
    });
    try {
      await Promise.all(connectedInstances.map(async (connectedInstance) => {
        await addConnectedStorageToCollection(this.collection, connectedInstance.newStorage.collectionName, connectedInstance.newStorage.schema);
        await this.migrateStorage(connectedInstance.oldStorage, connectedInstance.newStorage, batchSize);
        await connectedInstance.newStorage.close();
      }));
      await this.migrateStorage(
        oldStorageInstance,
        /**
         * Use the originalStorageInstance here
         * so that the _meta.lwt time keeps the same
         * and our replication checkpoints still point to the
         * correct checkpoint.
         */
        this.collection.storageInstance.originalStorageInstance,
        batchSize
      );
    } catch (err) {
      await oldStorageInstance.close();
      await this.updateStatus((s2) => {
        s2.status = "ERROR";
        s2.error = errorToPlainJson(err);
        return s2;
      });
      return;
    }
    await writeSingle(this.database.internalStore, {
      previous: oldCollectionMeta,
      document: Object.assign({}, oldCollectionMeta, {
        _deleted: true
      })
    }, "rx-migration-remove-collection-meta");
    await this.updateStatus((s2) => {
      s2.status = "DONE";
      return s2;
    });
    if (broadcastChannel) {
      await broadcastChannel.close();
    }
  };
  _proto.updateStatus = function updateStatus(handler) {
    this.updateStatusHandlers.push(handler);
    this.updateStatusQueue = this.updateStatusQueue.then(async () => {
      if (this.updateStatusHandlers.length === 0) {
        return;
      }
      var useHandlers = this.updateStatusHandlers;
      this.updateStatusHandlers = [];
      while (true) {
        var previous = await getSingleDocument(this.database.internalStore, this.statusDocId);
        var newDoc = clone$1(previous);
        if (!previous) {
          newDoc = {
            id: this.statusDocId,
            key: this.statusDocKey,
            context: INTERNAL_CONTEXT_MIGRATION_STATUS,
            data: {
              collectionName: this.collection.name,
              status: "RUNNING",
              count: {
                total: 0,
                handled: 0,
                percent: 0
              }
            },
            _deleted: false,
            _meta: getDefaultRxDocumentMeta(),
            _rev: getDefaultRevision(),
            _attachments: {}
          };
        }
        var status = ensureNotFalsy(newDoc).data;
        for (var oneHandler of useHandlers) {
          status = oneHandler(status);
        }
        status.count.percent = Math.round(status.count.handled / status.count.total * 100);
        if (newDoc && previous && deepEqual(newDoc.data, previous.data)) {
          break;
        }
        try {
          await writeSingle(this.database.internalStore, {
            previous,
            document: ensureNotFalsy(newDoc)
          }, INTERNAL_CONTEXT_MIGRATION_STATUS);
          break;
        } catch (err) {
          if (!isBulkWriteConflictError(err)) {
            throw err;
          }
        }
      }
    });
    return this.updateStatusQueue;
  };
  _proto.migrateStorage = async function migrateStorage(oldStorage, newStorage, batchSize) {
    var replicationMetaStorageInstance = await this.database.storage.createStorageInstance({
      databaseName: this.database.name,
      collectionName: "rx-migration-state-meta-" + this.collection.name + "-" + this.collection.schema.version,
      databaseInstanceToken: this.database.token,
      multiInstance: this.database.multiInstance,
      options: {},
      schema: getRxReplicationMetaInstanceSchema(oldStorage.schema, hasEncryption(oldStorage.schema)),
      password: this.database.password,
      devMode: overwritable.isDevMode()
    });
    var replicationHandlerBase = rxStorageInstanceToReplicationHandler(
      newStorage,
      /**
       * Ignore push-conflicts.
       * If this happens we drop the 'old' document state.
       */
      defaultConflictHandler,
      this.database.token,
      true
    );
    var replicationState = replicateRxStorageInstance({
      keepMeta: true,
      identifier: ["rx-migration-state", this.collection.name, oldStorage.schema.version, this.collection.schema.version].join("-"),
      replicationHandler: {
        masterChangesSince() {
          return Promise.resolve({
            checkpoint: null,
            documents: []
          });
        },
        masterWrite: async (rows) => {
          rows = await Promise.all(rows.map(async (row) => {
            var newDocData = row.newDocumentState;
            if (newStorage.schema.title === META_INSTANCE_SCHEMA_TITLE) {
              newDocData = row.newDocumentState.docData;
              if (row.newDocumentState.isCheckpoint === "1") {
                return {
                  assumedMasterState: void 0,
                  newDocumentState: row.newDocumentState
                };
              }
            }
            var migratedDocData = await migrateDocumentData(this.collection, oldStorage.schema.version, newDocData);
            var newRow = {
              // drop the assumed master state, we do not have to care about conflicts here.
              assumedMasterState: void 0,
              newDocumentState: newStorage.schema.title === META_INSTANCE_SCHEMA_TITLE ? Object.assign({}, row.newDocumentState, {
                docData: migratedDocData
              }) : migratedDocData
            };
            return newRow;
          }));
          rows = rows.filter((row) => !!row.newDocumentState);
          var result = await replicationHandlerBase.masterWrite(rows);
          return result;
        },
        masterChangeStream$: new Subject().asObservable()
      },
      forkInstance: oldStorage,
      metaInstance: replicationMetaStorageInstance,
      pushBatchSize: batchSize,
      pullBatchSize: 0,
      conflictHandler: defaultConflictHandler,
      hashFunction: this.database.hashFunction
    });
    var hasError = false;
    replicationState.events.error.subscribe((err) => hasError = err);
    replicationState.events.processed.up.subscribe(() => {
      this.updateStatus((status) => {
        status.count.handled = status.count.handled + 1;
        return status;
      });
    });
    await awaitRxStorageReplicationFirstInSync(replicationState);
    await cancelRxStorageReplication(replicationState);
    await this.updateStatusQueue;
    if (hasError) {
      await replicationMetaStorageInstance.close();
      throw hasError;
    }
    await Promise.all([oldStorage.remove(), replicationMetaStorageInstance.remove()]);
  };
  _proto.countAllDoucments = async function countAllDoucments(storageInstances) {
    var ret = 0;
    await Promise.all(storageInstances.map(async (instance) => {
      var preparedQuery = prepareQuery(instance.schema, normalizeMangoQuery(instance.schema, {
        selector: {}
      }));
      var countResult = await instance.count(preparedQuery);
      ret += countResult.count;
    }));
    return ret;
  };
  _proto.getConnectedStorageInstances = async function getConnectedStorageInstances() {
    var oldCollectionMeta = await this.oldCollectionMeta;
    var ret = [];
    await Promise.all(await Promise.all(oldCollectionMeta.data.connectedStorages.map(async (connectedStorage) => {
      if (connectedStorage.schema.title !== META_INSTANCE_SCHEMA_TITLE) {
        throw new Error("unknown migration handling for schema");
      }
      var newSchema = getRxReplicationMetaInstanceSchema(clone$1(this.collection.schema.jsonSchema), hasEncryption(connectedStorage.schema));
      newSchema.version = this.collection.schema.version;
      var [oldStorage, newStorage] = await Promise.all([this.database.storage.createStorageInstance({
        databaseInstanceToken: this.database.token,
        databaseName: this.database.name,
        devMode: overwritable.isDevMode(),
        multiInstance: this.database.multiInstance,
        options: {},
        schema: connectedStorage.schema,
        password: this.database.password,
        collectionName: connectedStorage.collectionName
      }), this.database.storage.createStorageInstance({
        databaseInstanceToken: this.database.token,
        databaseName: this.database.name,
        devMode: overwritable.isDevMode(),
        multiInstance: this.database.multiInstance,
        options: {},
        schema: newSchema,
        password: this.database.password,
        collectionName: connectedStorage.collectionName
      })]);
      ret.push({
        oldStorage,
        newStorage
      });
    })));
    return ret;
  };
  _proto.migratePromise = async function migratePromise(batchSize) {
    this.startMigration(batchSize);
    var must = await this.mustMigrate;
    if (!must) {
      return {
        status: "DONE",
        collectionName: this.collection.name,
        count: {
          handled: 0,
          percent: 0,
          total: 0
        }
      };
    }
    var result = await Promise.race([firstValueFrom(this.$.pipe(filter((d) => d.status === "DONE"))), firstValueFrom(this.$.pipe(filter((d) => d.status === "ERROR")))]);
    if (result.status === "ERROR") {
      throw newRxError("DM4", {
        collection: this.collection.name,
        error: result.error
      });
    } else {
      return result;
    }
  };
  return RxMigrationState2;
}();
var RxDocumentParent = createRxDocumentConstructor();
var RxLocalDocumentClass = /* @__PURE__ */ function(_RxDocumentParent) {
  function RxLocalDocumentClass2(id, jsonData, parent) {
    var _this2;
    _this2 = _RxDocumentParent.call(this, null, jsonData) || this;
    _this2.id = id;
    _this2.parent = parent;
    return _this2;
  }
  _inheritsLoose(RxLocalDocumentClass2, _RxDocumentParent);
  return RxLocalDocumentClass2;
}(RxDocumentParent);
var RxLocalDocumentPrototype = {
  get isLocal() {
    return true;
  },
  //
  // overwrites
  //
  get allAttachments$() {
    throw newRxError("LD1", {
      document: this
    });
  },
  get primaryPath() {
    return "id";
  },
  get primary() {
    return this.id;
  },
  get $() {
    var _this = this;
    var state = getFromMapOrThrow(LOCAL_DOC_STATE_BY_PARENT_RESOLVED, this.parent);
    return _this.parent.$.pipe(filter((changeEvent) => changeEvent.documentId === this.primary), filter((changeEvent) => changeEvent.isLocal), map((changeEvent) => getDocumentDataOfRxChangeEvent(changeEvent)), startWith(state.docCache.getLatestDocumentData(this.primary)), distinctUntilChanged((prev, curr) => prev._rev === curr._rev), map((docData) => state.docCache.getCachedRxDocument(docData)), shareReplay(RXJS_SHARE_REPLAY_DEFAULTS));
  },
  get $$() {
    var _this = this;
    var db = getRxDatabaseFromLocalDocument(_this);
    var reactivity = db.getReactivityFactory();
    return reactivity.fromObservable(_this.$, _this.getLatest()._data, db);
  },
  get deleted$$() {
    var _this = this;
    var db = getRxDatabaseFromLocalDocument(_this);
    var reactivity = db.getReactivityFactory();
    return reactivity.fromObservable(_this.deleted$, _this.getLatest().deleted, db);
  },
  getLatest() {
    var state = getFromMapOrThrow(LOCAL_DOC_STATE_BY_PARENT_RESOLVED, this.parent);
    var latestDocData = state.docCache.getLatestDocumentData(this.primary);
    return state.docCache.getCachedRxDocument(latestDocData);
  },
  get(objPath) {
    objPath = "data." + objPath;
    if (!this._data) {
      return void 0;
    }
    if (typeof objPath !== "string") {
      throw newRxTypeError("LD2", {
        objPath
      });
    }
    var valueObj = getProperty$1(this._data, objPath);
    valueObj = overwritable.deepFreezeWhenDevMode(valueObj);
    return valueObj;
  },
  get$(objPath) {
    objPath = "data." + objPath;
    if (overwritable.isDevMode()) {
      if (objPath.includes(".item.")) {
        throw newRxError("LD3", {
          objPath
        });
      }
      if (objPath === this.primaryPath) {
        throw newRxError("LD4");
      }
    }
    return this.$.pipe(map((localDocument) => localDocument._data), map((data) => getProperty$1(data, objPath)), distinctUntilChanged());
  },
  get$$(objPath) {
    var db = getRxDatabaseFromLocalDocument(this);
    var reactivity = db.getReactivityFactory();
    return reactivity.fromObservable(this.get$(objPath), this.getLatest().get(objPath), db);
  },
  async incrementalModify(mutationFunction) {
    var state = await getLocalDocStateByParent(this.parent);
    return state.incrementalWriteQueue.addWrite(this._data, async (docData) => {
      docData.data = await mutationFunction(docData.data, this);
      return docData;
    }).then((result) => state.docCache.getCachedRxDocument(result));
  },
  incrementalPatch(patch) {
    return this.incrementalModify((docData) => {
      Object.entries(patch).forEach(([k2, v]) => {
        docData[k2] = v;
      });
      return docData;
    });
  },
  async _saveData(newData) {
    var state = await getLocalDocStateByParent(this.parent);
    var oldData = this._data;
    newData.id = this.id;
    var writeRows = [{
      previous: oldData,
      document: newData
    }];
    return state.storageInstance.bulkWrite(writeRows, "local-document-save-data").then((res) => {
      if (res.error[0]) {
        throw res.error[0];
      }
      var success = getWrittenDocumentsFromBulkWriteResponse(this.collection.schema.primaryPath, writeRows, res)[0];
      newData = flatClone(newData);
      newData._rev = success._rev;
    });
  },
  async remove() {
    var state = await getLocalDocStateByParent(this.parent);
    var writeData = flatClone(this._data);
    writeData._deleted = true;
    return writeSingle(state.storageInstance, {
      previous: this._data,
      document: writeData
    }, "local-document-remove").then((writeResult) => state.docCache.getCachedRxDocument(writeResult));
  }
};
var INIT_DONE = false;
var _init = () => {
  if (INIT_DONE) return;
  else INIT_DONE = true;
  var docBaseProto = basePrototype;
  var props = Object.getOwnPropertyNames(docBaseProto);
  props.forEach((key) => {
    var exists = Object.getOwnPropertyDescriptor(RxLocalDocumentPrototype, key);
    if (exists) return;
    var desc = Object.getOwnPropertyDescriptor(docBaseProto, key);
    Object.defineProperty(RxLocalDocumentPrototype, key, desc);
  });
  var getThrowingFun = (k2) => () => {
    throw newRxError("LD6", {
      functionName: k2
    });
  };
  ["populate", "update", "putAttachment", "getAttachment", "allAttachments"].forEach((k2) => RxLocalDocumentPrototype[k2] = getThrowingFun(k2));
};
function createRxLocalDocument(data, parent) {
  _init();
  var newDoc = new RxLocalDocumentClass(data.id, data, parent);
  Object.setPrototypeOf(newDoc, RxLocalDocumentPrototype);
  newDoc.prototype = RxLocalDocumentPrototype;
  return newDoc;
}
function getRxDatabaseFromLocalDocument(doc) {
  var parent = doc.parent;
  if (isRxDatabase(parent)) {
    return parent;
  } else {
    return parent.database;
  }
}
var LOCAL_DOC_STATE_BY_PARENT = /* @__PURE__ */ new WeakMap();
var LOCAL_DOC_STATE_BY_PARENT_RESOLVED = /* @__PURE__ */ new WeakMap();
function createLocalDocStateByParent(parent) {
  var database = parent.database ? parent.database : parent;
  var collectionName = parent.database ? parent.name : "";
  var statePromise = (async () => {
    var storageInstance = await createLocalDocumentStorageInstance(database.token, database.storage, database.name, collectionName, database.instanceCreationOptions, database.multiInstance);
    storageInstance = getWrappedStorageInstance(database, storageInstance, RX_LOCAL_DOCUMENT_SCHEMA);
    var docCache = new DocumentCache("id", database.eventBulks$.pipe(filter((changeEventBulk) => {
      var ret = false;
      if (
        // parent is database
        collectionName === "" && !changeEventBulk.collectionName || // parent is collection
        collectionName !== "" && changeEventBulk.collectionName === collectionName
      ) {
        ret = true;
      }
      return ret && changeEventBulk.events[0].isLocal;
    }), map((b2) => b2.events)), (docData) => createRxLocalDocument(docData, parent));
    var incrementalWriteQueue = new IncrementalWriteQueue(storageInstance, "id", () => {
    }, () => {
    });
    var databaseStorageToken = await database.storageToken;
    var subLocalDocs = storageInstance.changeStream().subscribe((eventBulk) => {
      var events = new Array(eventBulk.events.length);
      var rawEvents = eventBulk.events;
      var collectionName2 = parent.database ? parent.name : void 0;
      for (var index = 0; index < rawEvents.length; index++) {
        var event = rawEvents[index];
        events[index] = {
          documentId: event.documentId,
          collectionName: collectionName2,
          isLocal: true,
          operation: event.operation,
          documentData: overwritable.deepFreezeWhenDevMode(event.documentData),
          previousDocumentData: overwritable.deepFreezeWhenDevMode(event.previousDocumentData)
        };
      }
      var changeEventBulk = {
        id: eventBulk.id,
        internal: false,
        collectionName: parent.database ? parent.name : void 0,
        storageToken: databaseStorageToken,
        events,
        databaseToken: database.token,
        checkpoint: eventBulk.checkpoint,
        context: eventBulk.context,
        endTime: eventBulk.endTime,
        startTime: eventBulk.startTime
      };
      database.$emit(changeEventBulk);
    });
    parent._subs.push(subLocalDocs);
    var state = {
      database,
      parent,
      storageInstance,
      docCache,
      incrementalWriteQueue
    };
    LOCAL_DOC_STATE_BY_PARENT_RESOLVED.set(parent, state);
    return state;
  })();
  LOCAL_DOC_STATE_BY_PARENT.set(parent, statePromise);
}
function getLocalDocStateByParent(parent) {
  var statePromise = LOCAL_DOC_STATE_BY_PARENT.get(parent);
  if (!statePromise) {
    var database = parent.database ? parent.database : parent;
    var collectionName = parent.database ? parent.name : "";
    throw newRxError("LD8", {
      database: database.name,
      collection: collectionName
    });
  }
  return statePromise;
}
function createLocalDocumentStorageInstance(databaseInstanceToken, storage2, databaseName, collectionName, instanceCreationOptions, multiInstance) {
  return storage2.createStorageInstance({
    databaseInstanceToken,
    databaseName,
    /**
     * Use a different collection name for the local documents instance
     * so that the local docs can be kept while deleting the normal instance
     * after migration.
     */
    collectionName: getCollectionLocalInstanceName(collectionName),
    schema: RX_LOCAL_DOCUMENT_SCHEMA,
    options: instanceCreationOptions,
    multiInstance,
    devMode: overwritable.isDevMode()
  });
}
function closeStateByParent(parent) {
  var statePromise = LOCAL_DOC_STATE_BY_PARENT.get(parent);
  if (statePromise) {
    LOCAL_DOC_STATE_BY_PARENT.delete(parent);
    return statePromise.then((state) => state.storageInstance.close());
  }
}
async function removeLocalDocumentsStorageInstance(storage2, databaseName, collectionName) {
  var databaseInstanceToken = randomCouchString(10);
  var storageInstance = await createLocalDocumentStorageInstance(databaseInstanceToken, storage2, databaseName, collectionName, {}, false);
  await storageInstance.remove();
}
function getCollectionLocalInstanceName(collectionName) {
  return "plugin-local-documents-" + collectionName;
}
var RX_LOCAL_DOCUMENT_SCHEMA = fillWithDefaultSettings({
  title: "RxLocalDocument",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 128
    },
    data: {
      type: "object",
      additionalProperties: true
    }
  },
  required: ["id", "data"]
});
async function insertLocal(id, data) {
  var state = await getLocalDocStateByParent(this);
  var docData = {
    id,
    data,
    _deleted: false,
    _meta: getDefaultRxDocumentMeta(),
    _rev: getDefaultRevision(),
    _attachments: {}
  };
  return writeSingle(state.storageInstance, {
    document: docData
  }, "local-document-insert").then((newDocData) => state.docCache.getCachedRxDocument(newDocData));
}
function upsertLocal(id, data) {
  return this.getLocal(id).then((existing) => {
    if (!existing) {
      var docPromise = this.insertLocal(id, data);
      return docPromise;
    } else {
      return existing.incrementalModify(() => {
        return data;
      });
    }
  });
}
async function getLocal(id) {
  var state = await getLocalDocStateByParent(this);
  var docCache = state.docCache;
  var found = docCache.getLatestDocumentDataIfExists(id);
  if (found) {
    return Promise.resolve(docCache.getCachedRxDocument(found));
  }
  return getSingleDocument(state.storageInstance, id).then((docData) => {
    if (!docData) {
      return null;
    }
    return state.docCache.getCachedRxDocument(docData);
  });
}
function getLocal$(id) {
  return this.$.pipe(startWith(null), mergeMap(async (cE) => {
    if (cE) {
      return {
        changeEvent: cE
      };
    } else {
      var doc = await this.getLocal(id);
      return {
        doc
      };
    }
  }), mergeMap(async (changeEventOrDoc) => {
    if (changeEventOrDoc.changeEvent) {
      var cE = changeEventOrDoc.changeEvent;
      if (!cE.isLocal || cE.documentId !== id) {
        return {
          use: false
        };
      } else {
        var doc = await this.getLocal(id);
        return {
          use: true,
          doc
        };
      }
    } else {
      return {
        use: true,
        doc: changeEventOrDoc.doc
      };
    }
  }), filter((filterFlagged) => filterFlagged.use), map((filterFlagged) => {
    return filterFlagged.doc;
  }));
}
var RxDBLocalDocumentsPlugin = {
  name: "local-documents",
  rxdb: true,
  prototypes: {
    RxCollection: (proto) => {
      proto.insertLocal = insertLocal;
      proto.upsertLocal = upsertLocal;
      proto.getLocal = getLocal;
      proto.getLocal$ = getLocal$;
    },
    RxDatabase: (proto) => {
      proto.insertLocal = insertLocal;
      proto.upsertLocal = upsertLocal;
      proto.getLocal = getLocal;
      proto.getLocal$ = getLocal$;
    }
  },
  hooks: {
    createRxDatabase: {
      before: (args) => {
        if (args.creator.localDocuments) {
          createLocalDocStateByParent(args.database);
        }
      }
    },
    createRxCollection: {
      before: (args) => {
        if (args.creator.localDocuments) {
          createLocalDocStateByParent(args.collection);
        }
      }
    },
    preDestroyRxDatabase: {
      after: (db) => {
        return closeStateByParent(db);
      }
    },
    postDestroyRxCollection: {
      after: (collection) => closeStateByParent(collection)
    },
    postRemoveRxDatabase: {
      after: (args) => {
        return removeLocalDocumentsStorageInstance(args.storage, args.databaseName, "");
      }
    },
    postRemoveRxCollection: {
      after: (args) => {
        return removeLocalDocumentsStorageInstance(args.storage, args.databaseName, args.collectionName);
      }
    }
  },
  overwritable: {}
};
var DATA_MIGRATOR_BY_COLLECTION = /* @__PURE__ */ new WeakMap();
var RxDBMigrationPlugin = {
  name: "migration-schema",
  rxdb: true,
  init() {
    addRxPlugin(RxDBLocalDocumentsPlugin);
  },
  hooks: {
    preDestroyRxDatabase: {
      after: onDatabaseDestroy
    }
  },
  prototypes: {
    RxDatabase: (proto) => {
      proto.migrationStates = function() {
        return getMigrationStateByDatabase(this).pipe(shareReplay(RXJS_SHARE_REPLAY_DEFAULTS));
      };
    },
    RxCollection: (proto) => {
      proto.getMigrationState = function() {
        return getFromMapOrCreate(DATA_MIGRATOR_BY_COLLECTION, this, () => new RxMigrationState(this.asRxCollection, this.migrationStrategies));
      };
      proto.migrationNeeded = function() {
        if (this.schema.version === 0) {
          return PROMISE_RESOLVE_FALSE;
        }
        return mustMigrate(this.getMigrationState());
      };
    }
  }
};
var RxDBMigrationSchemaPlugin = RxDBMigrationPlugin;
addRxPlugin(RxDBMigrationSchemaPlugin);
const storage = getRxStorageOPFS({ usesRxDatabaseInWorker: true });
exposeWorkerRxStorage({
  storage: getRxStorageOPFS({ usesRxDatabaseInWorker: true })
});
const initDatabase = async () => {
  const db = await createRxDatabase({
    name: "test",
    storage
  });
  await db.addCollections({
    test: testSchema
  });
  const docs = await db.test.find().exec();
  console.log(docs);
  return db;
};
initDatabase().then((db) => {
  console.log("Database initialized");
});
