const stringDouble = '"(?:[^"\\\\]|\\\\.)*"';
const stringSingle = '\'(?:[^\'\\\\]|\\\\.)*\'';
const stringRegexp = '/(?:[^/\\\\]|\\\\.)*/w*';
const specials = ',"\'{}()/:[\\]';
const everyThingElse = '[^\\s:,/][^' + specials + ']*[^\\s' + specials + ']';
const oneNotSpace = '[^\\s]';
const _bindingToken = RegExp(stringDouble + '|' + stringSingle + '|' + stringRegexp + '|' + everyThingElse + '|' + oneNotSpace, 'g');

const _divisionLookBehind = /[\])"'A-Za-z0-9_$]+$/;
const _keywordRegexLookBehind = {
  in: 1,
  return: 1,
  typeof: 1
};

const _operators = "+-*/&|=><";

ViewModel.parseBind = function(objectLiteralString) {
  let str = $.trim(objectLiteralString);
  if (str.charCodeAt(0) === 123) { str = str.slice(1, -1); }
  const result = {};
  let toks = str.match(_bindingToken);
  let depth = 0;
  let key = undefined;
  let values = undefined;
  if (toks) {
    toks.push(',');
    let i = -1;
    let tok = undefined;
    while ((tok = toks[++i])) {
      const c = tok.charCodeAt(0);
      if (c === 44) {
        if (depth <= 0) {
          if (key) {
            if (!values) {
              throw new Error("Error parsing: " + objectLiteralString);
            } else {
              let v = values.join('');
              if (v.indexOf('{') === 0) { v = this.parseBind(v); }
              result[key] = v;
            }
          }
          key = (values = (depth = 0));
          continue;
        }
      } else if (c === 58) {
        if (!values) {
          continue;
        }
      } else if ((c === 47) && i && (tok.length > 1)) {
        const match = toks[i-1].match(_divisionLookBehind);
        if (match && !_keywordRegexLookBehind[match[0]]) {
          str = str.substr(str.indexOf(tok) + 1);
          toks = str.match(_bindingToken);
          toks.push(',');
          i = -1;
          tok = '/';
        }
      } else if ((c === 40) || (c === 123) || (c === 91)) {
        ++depth;
      } else if ((c === 41) || (c === 125) || (c === 93)) {
        --depth;
      } else if (!key && !values) {
        key = (((c === 34) || (c === 39)) ? tok.slice(1, -1) : tok);
        continue;
      }

      if (~_operators.indexOf(tok[0])) {
        tok = ' ' + tok;
      }

      if (~_operators.indexOf(tok[tok.length - 1])) {
        tok += ' ';
      }

      if (values) {
        values.push(tok);
      } else {
        values = [tok];
      }
    }
  }
  if (objectLiteralString && !Object.getOwnPropertyNames(result).length) {
    throw new Error("Error parsing: " + objectLiteralString);
  } else {
    return result;
  }
};