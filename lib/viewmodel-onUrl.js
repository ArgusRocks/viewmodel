// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const isArray = obj => obj instanceof Array || Array.isArray(obj);

(function(history) {
  const {
    pushState
  } = history;
  const {
    replaceState
  } = history;

  if (pushState) {
    history.pushState = function(state, title, url) {
      if (typeof history.onstatechange === 'function') {
        history.onstatechange(state, title, url);
      }
      return pushState.apply(history, arguments);
    };
    history.replaceState = function(state, title, url) {
      if (typeof history.onstatechange === 'function') {
        history.onstatechange(state, title, url);
      }
      return replaceState.apply(history, arguments);
    };
  } else {
    history.pushState = function() {};
    history.replaceState = function() {};
  }
})(window.history);

var parseUri = function(str) {
  const o = parseUri.options;
  const m = o.parser[(o.strictMode ? "strict" : "loose")].exec(str);
  const uri = {};
  let i = 14;
  while (i--) { uri[o.key[i]] = m[i] || ""; }
  uri[o.q.name] = {};
  uri[o.key[12]].replace(o.q.parser, function($0, $1, $2) {
    if ($1) { uri[o.q.name][$1] = $2; }
  });

  return uri;
};

parseUri.options = {
  strictMode: false,
  key: [
    "source",
    "protocol",
    "authority",
    "userInfo",
    "user",
    "password",
    "host",
    "port",
    "relative",
    "path",
    "directory",
    "file",
    "query",
    "anchor"
  ],
  q: {
    name: "queryKey",
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },

  parser: {
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};

const getUrl = function(target) { if (target == null) { target = document.URL; } return parseUri(target); };

const updateQueryString = function(key, value, url) {
  if (!url) {
    url = window.location.href;
  }
  const re = new RegExp('([?&])' + key + '=.*?(&|#|$)(.*)', 'gi');
  let hash = undefined;
  if (re.test(url)) {
    if ((typeof value !== 'undefined') && (value !== null)) {
      return url.replace(re, '$1' + key + '=' + value + '$2$3');
    } else {
      hash = url.split('#');
      url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
      if ((typeof hash[1] !== 'undefined') && (hash[1] !== null)) {
        url += '#' + hash[1];
      }
      return url;
    }
  } else {
    if ((typeof value !== 'undefined') && (value !== null)) {
      const separator = url.indexOf('?') !== -1 ? '&' : '?';
      hash = url.split('#');
      url = hash[0] + separator + key + '=' + value;
      if ((typeof hash[1] !== 'undefined') && (hash[1] !== null)) {
        url += '#' + hash[1];
      }
      return url;
    } else {
      return url;
    }
  }
};

const getSavedData = function(url) {
  if (url == null) { url = document.URL; }
  const urlData = getUrl(url).queryKey.data;
  if (!urlData) { return; }
  const dataString = LZString.decompressFromEncodedURIComponent(urlData);
  let obj = {};
  try {
    return obj = JSON.parse(dataString);
  } finally {
    return obj;
  }
};

ViewModel.saveUrl = viewmodel => viewmodel.templateInstance.autorun(function(c) {
  ViewModel.check('@saveUrl', viewmodel);
  const vmHash = viewmodel.vmHash();
  let url = window.location.href;
  const savedData = getSavedData() || {};
  const fields = isArray(viewmodel.onUrl()) ? viewmodel.onUrl() : [viewmodel.onUrl()];
  const data = viewmodel.data(fields);
  savedData[vmHash] = data;
  const dataString = JSON.stringify(savedData);
  const dataCompressed = LZString.compressToEncodedURIComponent(dataString);
  url = updateQueryString("data", dataCompressed, url);
  if (!c.firstRun && (document.URL !== url)) { return window.history.pushState(null, null, url); }
});

ViewModel.loadUrl = function(viewmodel) {
  const updateFromUrl = function(state, title, url) {
    if (url == null) { url = document.URL; }
    const data = getSavedData(url);
    if (!data) { return; }
    const vmHash = viewmodel.vmHash();
    const savedData = data[vmHash];
    if (savedData) {
      return viewmodel.load(savedData);
    }
  };
  window.onpopstate = (window.history.onstatechange = updateFromUrl);
  return updateFromUrl();
};