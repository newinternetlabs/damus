//
//  zone-file-1.0.0.js
//  damus
//
//  Created by New Internet Labs Limited on 2023-01-18.
//
//
//ISC License (ISC)
//
//Copyright (c) 2014, Elgs Qian Chen
//Copyright (c) 2016, Halfmoon Labs Inc.
//
//Permission to use, copy, modify, and/or distribute this software for any
//purpose with or without fee is hereby granted, provided that the above
//copyright notice and this permission notice appear in all copies.
//
//THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
//REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
//AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
//INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
//LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
//OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
//PERFORMANCE OF THIS SOFTWARE.

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  it = o[Symbol.iterator]();
  return it.next.bind(it);
}

function getZoneFileTemplate() {
  return '{$origin}\n\
{$ttl}\n\
\n\
; SOA Record\n\
{name} {ttl}    IN  SOA {mname}{rname}(\n\
{serial} ;serial\n\
{refresh} ;refresh\n\
{retry} ;retry\n\
{expire} ;expire\n\
{minimum} ;minimum ttl\n\
)\n\
\n\
; NS Records\n\
{ns}\n\
\n\
; MX Records\n\
{mx}\n\
\n\
; A Records\n\
{a}\n\
\n\
; AAAA Records\n\
{aaaa}\n\
\n\
; CNAME Records\n\
{cname}\n\
\n\
; PTR Records\n\
{ptr}\n\
\n\
; TXT Records\n\
{txt}\n\
\n\
; SRV Records\n\
{srv}\n\
\n\
; SPF Records\n\
{spf}\n\
\n\
; URI Records\n\
{uri}\n\
';
}

function makeZoneFile(jsonZoneFile, template) {
  if (template === void 0) {
    template = getZoneFileTemplate();
  }

  template = processOrigin(jsonZoneFile['$origin'], template);
  template = processTTL(jsonZoneFile['$ttl'], template);
  template = processSOA(jsonZoneFile['soa'], template);
  template = processNS(jsonZoneFile['ns'], template);
  template = processA(jsonZoneFile['a'], template);
  template = processAAAA(jsonZoneFile['aaaa'], template);
  template = processCNAME(jsonZoneFile['cname'], template);
  template = processMX(jsonZoneFile['mx'], template);
  template = processPTR(jsonZoneFile['ptr'], template);
  template = processTXT(jsonZoneFile['txt'], template);
  template = processSRV(jsonZoneFile['srv'], template);
  template = processSPF(jsonZoneFile['spf'], template);
  template = processURI(jsonZoneFile['uri'], template);
  template = processValues(jsonZoneFile, template);
  return template.replace(/\n{2,}/gim, '\n\n');
}

function processOrigin(data, template) {
  var ret = '';

  if (typeof data !== 'undefined') {
    ret += '$ORIGIN ' + data;
  }

  return template.replace('{$origin}', ret);
}

function processTTL(data, template) {
  var ret = '';

  if (typeof data !== 'undefined') {
    ret += '$TTL ' + data;
  }

  return template.replace('{$ttl}', ret);
}

function processSOA(data, template) {
  var ret = template;

  if (typeof data !== 'undefined') {
    data.name = data.name || '@';
    data.ttl = data.ttl || '';

    for (var key in data) {
      var value = data[key];
      ret = ret.replace('{' + key + '}', value + '\t');
    }
  }

  return ret;
}

function processNS(data, template) {
  var ret = '';

  if (data) {
    for (var _iterator = _createForOfIteratorHelperLoose(data), _step; !(_step = _iterator()).done;) {
      var record = _step.value;
      ret += (record.name || '@') + '\t';
      if (record.ttl) ret += record.ttl + '\t';
      ret += 'IN\tNS\t' + record.host + '\n';
    }
  }

  return template.replace('{ns}', ret);
}

function processA(data, template) {
  var ret = '';

  if (data) {
    for (var _iterator2 = _createForOfIteratorHelperLoose(data), _step2; !(_step2 = _iterator2()).done;) {
      var record = _step2.value;
      ret += (record.name || '@') + '\t';
      if (record.ttl) ret += record.ttl + '\t';
      ret += 'IN\tA\t' + record.ip + '\n';
    }
  }

  return template.replace('{a}', ret);
}

function processAAAA(data, template) {
  var ret = '';

  if (data) {
    for (var _iterator3 = _createForOfIteratorHelperLoose(data), _step3; !(_step3 = _iterator3()).done;) {
      var record = _step3.value;
      ret += (record.name || '@') + '\t';
      if (record.ttl) ret += record.ttl + '\t';
      ret += 'IN\tAAAA\t' + record.ip + '\n';
    }
  }

  return template.replace('{aaaa}', ret);
}

function processCNAME(data, template) {
  var ret = '';

  if (data) {
    for (var _iterator4 = _createForOfIteratorHelperLoose(data), _step4; !(_step4 = _iterator4()).done;) {
      var record = _step4.value;
      ret += (record.name || '@') + '\t';
      if (record.ttl) ret += record.ttl + '\t';
      ret += 'IN\tCNAME\t' + record.alias + '\n';
    }
  }

  return template.replace('{cname}', ret);
}

function processMX(data, template) {
  var ret = '';

  if (data) {
    for (var _iterator5 = _createForOfIteratorHelperLoose(data), _step5; !(_step5 = _iterator5()).done;) {
      var record = _step5.value;
      ret += (record.name || '@') + '\t';
      if (record.ttl) ret += record.ttl + '\t';
      ret += 'IN\tMX\t' + record.preference + '\t' + record.host + '\n';
    }
  }

  return template.replace('{mx}', ret);
}

function processPTR(data, template) {
  var ret = '';

  if (data) {
    for (var _iterator6 = _createForOfIteratorHelperLoose(data), _step6; !(_step6 = _iterator6()).done;) {
      var record = _step6.value;
      ret += (record.name || '@') + '\t';
      if (record.ttl) ret += record.ttl + '\t';
      ret += 'IN\tPTR\t' + record.host + '\n';
    }
  }

  return template.replace('{ptr}', ret);
}

function processTXT(data, template) {
  var ret = '';

  if (data) {
    for (var _iterator7 = _createForOfIteratorHelperLoose(data), _step7; !(_step7 = _iterator7()).done;) {
      var record = _step7.value;
      ret += (record.name || '@') + '\t';
      if (record.ttl) ret += record.ttl + '\t';
      ret += 'IN\tTXT\t';
      var txtData = record.txt;

      if (typeof txtData === 'string') {
        ret += '"' + txtData + '"';
      } else if (txtData instanceof Array) {
        ret += txtData.map(function (datum) {
          return '"' + datum + '"';
        }).join(' ');
      }

      ret += '\n';
    }
  }

  return template.replace('{txt}', ret);
}

function processSRV(data, template) {
  var ret = '';

  if (data) {
    for (var _iterator8 = _createForOfIteratorHelperLoose(data), _step8; !(_step8 = _iterator8()).done;) {
      var record = _step8.value;
      ret += (record.name || '@') + '\t';
      if (record.ttl) ret += record.ttl + '\t';
      ret += 'IN\tSRV\t' + record.priority + '\t';
      ret += record.weight + '\t';
      ret += record.port + '\t';
      ret += record.target + '\n';
    }
  }

  return template.replace('{srv}', ret);
}

function processSPF(data, template) {
  var ret = '';

  if (data) {
    for (var _iterator9 = _createForOfIteratorHelperLoose(data), _step9; !(_step9 = _iterator9()).done;) {
      var record = _step9.value;
      ret += (record.name || '@') + '\t';
      if (record.ttl) ret += record.ttl + '\t';
      ret += 'IN\tSPF\t' + record.data + '\n';
    }
  }

  return template.replace('{spf}', ret);
}

function processURI(data, template) {
  var ret = '';

  if (data) {
    for (var _iterator10 = _createForOfIteratorHelperLoose(data), _step10; !(_step10 = _iterator10()).done;) {
      var record = _step10.value;
      ret += (record.name || '@') + '\t';
      if (record.ttl) ret += record.ttl + '\t';
      ret += 'IN\tURI\t' + record.priority + '\t';
      ret += record.weight + '\t';
      ret += '"' + record.target + '"\n';
    }
  }

  return template.replace('{uri}', ret);
}

function processValues(jsonZoneFile, template) {
  template = template.replace('{zone}', jsonZoneFile['$origin'] || (jsonZoneFile['soa'] ? jsonZoneFile['soa']['name'] : false) || '');
  template = template.replace('{datetime}', new Date().toISOString());
  var time = Math.round(Date.now() / 1000);
  return template.replace('{time}', "" + time);
}

function parseZoneFile(text) {
  text = removeComments(text);
  text = flatten(text);
  return parseRRs(text);
}

function removeComments(text) {
  var re = /(^|[^\\]);.*/g;
  return text.replace(re, function (_m, g1) {
    return g1 ? g1 : ''; // if g1 is set/matched, re-insert it, else remove
  });
}

function flatten(text) {
  var captured = [];
  var re = /\([\s\S]*?\)/gim;
  var match = re.exec(text);

  while (match !== null) {
    var replacement = match[0].replace(/\s+/gm, ' ');
    captured.push({
      match: match,
      replacement: replacement
    }); // captured Text, index, input

    match = re.exec(text);
  }

  var arrText = text.split('');

  for (var _i = 0, _captured = captured; _i < _captured.length; _i++) {
    var cur = _captured[_i];
    var _match = cur.match,
        _replacement = cur.replacement;
    arrText.splice(_match.index, _match[0].length, _replacement);
  }

  return arrText.join('').replace(/\(|\)/gim, ' ');
}

function parseRRs(text) {
  var ret = {};
  var rrs = text.split('\n');

  for (var _iterator = _createForOfIteratorHelperLoose(rrs), _step; !(_step = _iterator()).done;) {
    var rr = _step.value;

    if (!rr || !rr.trim()) {
      continue;
    }

    var uRR = rr.toUpperCase();

    if (/\s+TXT\s+/.test(uRR)) {
      ret.txt = ret.txt || [];
      ret.txt.push(parseTXT(rr));
    } else if (uRR.indexOf('$ORIGIN') === 0) {
      ret.$origin = rr.split(/\s+/g)[1];
    } else if (uRR.indexOf('$TTL') === 0) {
      ret.$ttl = parseInt(rr.split(/\s+/g)[1], 10);
    } else if (/\s+SOA\s+/.test(uRR)) {
      ret.soa = parseSOA(rr);
    } else if (/\s+NS\s+/.test(uRR)) {
      ret.ns = ret.ns || [];
      ret.ns.push(parseNS(rr));
    } else if (/\s+A\s+/.test(uRR)) {
      ret.a = ret.a || [];
      ret.a.push(parseA(rr, ret.a));
    } else if (/\s+AAAA\s+/.test(uRR)) {
      ret.aaaa = ret.aaaa || [];
      ret.aaaa.push(parseAAAA(rr));
    } else if (/\s+CNAME\s+/.test(uRR)) {
      ret.cname = ret.cname || [];
      ret.cname.push(parseCNAME(rr));
    } else if (/\s+MX\s+/.test(uRR)) {
      ret.mx = ret.mx || [];
      ret.mx.push(parseMX(rr));
    } else if (/\s+PTR\s+/.test(uRR)) {
      ret.ptr = ret.ptr || [];
      ret.ptr.push(parsePTR(rr, ret.ptr, ret.$origin));
    } else if (/\s+SRV\s+/.test(uRR)) {
      ret.srv = ret.srv || [];
      ret.srv.push(parseSRV(rr));
    } else if (/\s+SPF\s+/.test(uRR)) {
      ret.spf = ret.spf || [];
      ret.spf.push(parseSPF(rr));
    } else if (/\s+URI\s+/.test(uRR)) {
      ret.uri = ret.uri || [];
      ret.uri.push(parseURI(rr));
    }
  }

  return ret;
}

function parseSOA(rr) {
  var soa = {};
  var rrTokens = rr.trim().split(/\s+/g);
  var l = rrTokens.length;
  soa.name = rrTokens[0];
  soa.minimum = parseInt(rrTokens[l - 1], 10);
  soa.expire = parseInt(rrTokens[l - 2], 10);
  soa.retry = parseInt(rrTokens[l - 3], 10);
  soa.refresh = parseInt(rrTokens[l - 4], 10);
  soa.serial = parseInt(rrTokens[l - 5], 10);
  soa.rname = rrTokens[l - 6];
  soa.mname = rrTokens[l - 7];
  if (!isNaN(rrTokens[1])) soa.ttl = parseInt(rrTokens[1], 10);
  return soa;
}

function parseNS(rr) {
  var rrTokens = rr.trim().split(/\s+/g);
  var l = rrTokens.length;
  var result = {
    name: rrTokens[0],
    host: rrTokens[l - 1]
  };
  if (!isNaN(rrTokens[1])) result.ttl = parseInt(rrTokens[1], 10);
  return result;
}

function parseA(rr, recordsSoFar) {
  var rrTokens = rr.trim().split(/\s+/g);
  var urrTokens = rr.trim().toUpperCase().split(/\s+/g);
  var l = rrTokens.length;
  var result = {
    name: rrTokens[0],
    ip: rrTokens[l - 1]
  };

  if (urrTokens.lastIndexOf('A') === 0) {
    if (recordsSoFar.length) {
      result.name = recordsSoFar[recordsSoFar.length - 1].name;
    } else {
      result.name = '@';
    }
  }

  if (!isNaN(rrTokens[1])) result.ttl = parseInt(rrTokens[1], 10);
  return result;
}

function parseAAAA(rr) {
  var rrTokens = rr.trim().split(/\s+/g);
  var l = rrTokens.length;
  var result = {
    name: rrTokens[0],
    ip: rrTokens[l - 1]
  };
  if (!isNaN(rrTokens[1])) result.ttl = parseInt(rrTokens[1], 10);
  return result;
}

function parseCNAME(rr) {
  var rrTokens = rr.trim().split(/\s+/g);
  var l = rrTokens.length;
  var result = {
    name: rrTokens[0],
    alias: rrTokens[l - 1]
  };
  if (!isNaN(rrTokens[1])) result.ttl = parseInt(rrTokens[1], 10);
  return result;
}

function parseMX(rr) {
  var rrTokens = rr.trim().split(/\s+/g);
  var l = rrTokens.length;
  var result = {
    name: rrTokens[0],
    preference: parseInt(rrTokens[l - 2], 10),
    host: rrTokens[l - 1]
  };
  if (!isNaN(rrTokens[1])) result.ttl = parseInt(rrTokens[1], 10);
  return result;
}

function parseTXT(rr) {
  var rrTokens = rr.trim().match(/[^\s"']+|"[^"]*"|'[^']*'/g);
  if (!rrTokens) throw new Error('Failure to tokenize TXT record');
  var l = rrTokens.length;
  var indexTXT = rrTokens.indexOf('TXT');

  function stripText(txt) {
    if (txt.indexOf('"') > -1) {
      txt = txt.split('"')[1];
    }

    return txt;
  }

  var tokenTxt;

  if (l - indexTXT - 1 > 1) {
    tokenTxt = [].concat(rrTokens.slice(indexTXT + 1).map(stripText));
  } else {
    tokenTxt = stripText(rrTokens[l - 1]);
  }

  var result = {
    name: rrTokens[0],
    txt: tokenTxt
  };
  if (!isNaN(rrTokens[1])) result.ttl = parseInt(rrTokens[1], 10);
  return result;
}

function parsePTR(rr, recordsSoFar, currentOrigin) {
  var rrTokens = rr.trim().split(/\s+/g);
  var urrTokens = rr.trim().toUpperCase().split(/\s+/g);

  if (urrTokens.lastIndexOf('PTR') === 0 && recordsSoFar[recordsSoFar.length - 1]) {
    rrTokens.unshift(recordsSoFar[recordsSoFar.length - 1].name);
  }

  var l = rrTokens.length;
  var result = {
    name: rrTokens[0],
    fullname: rrTokens[0] + '.' + currentOrigin,
    host: rrTokens[l - 1]
  };
  if (!isNaN(rrTokens[1])) result.ttl = parseInt(rrTokens[1], 10);
  return result;
}

function parseSRV(rr) {
  var rrTokens = rr.trim().split(/\s+/g);
  var l = rrTokens.length;
  var result = {
    name: rrTokens[0],
    target: rrTokens[l - 1],
    priority: parseInt(rrTokens[l - 4], 10),
    weight: parseInt(rrTokens[l - 3], 10),
    port: parseInt(rrTokens[l - 2], 10)
  };
  if (!isNaN(rrTokens[1])) result.ttl = parseInt(rrTokens[1], 10);
  return result;
}

function parseSPF(rr) {
  var rrTokens = rr.trim().split(/\s+/g);
  var result = {
    name: rrTokens[0],
    data: ''
  };
  var l = rrTokens.length;

  while (l-- > 4) {
    result.data = rrTokens[l] + ' ' + result.data.trim();
  }

  if (!isNaN(rrTokens[1])) result.ttl = parseInt(rrTokens[1], 10);
  return result;
}

function parseURI(rr) {
  var rrTokens = rr.trim().split(/\s+/g);
  var l = rrTokens.length;
  var result = {
    name: rrTokens[0],
    target: rrTokens[l - 1].replace(/"/g, ''),
    priority: parseInt(rrTokens[l - 3], 10),
    weight: parseInt(rrTokens[l - 2], 10)
  };
  if (!isNaN(rrTokens[1])) result.ttl = parseInt(rrTokens[1], 10);
  return result;
}

var ZoneFile = /*#__PURE__*/function () {
  function ZoneFile(zoneFile) {
    if (typeof zoneFile === 'object') {
      this.jsonZoneFile = JSON.parse(JSON.stringify(zoneFile));
    } else if (typeof zoneFile === 'string') {
      this.jsonZoneFile = parseZoneFile(zoneFile);
    } else {
      this.jsonZoneFile = undefined;
    }
  }

  var _proto = ZoneFile.prototype;

  _proto.toJSON = function toJSON() {
    return this.jsonZoneFile;
  };

  _proto.toString = function toString() {
    return makeZoneFile(this.toJSON());
  };

  return ZoneFile;
}();
