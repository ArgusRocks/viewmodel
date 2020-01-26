/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const isArray = obj => obj instanceof Array || Array.isArray(obj);

var ViewModel = (function() {
  let _nextId = undefined;
  let getBindHelper = undefined;
  let delayed = undefined;
  let getDelayedSetter = undefined;
  let stringRegex = undefined;
  let quoted = undefined;
  let removeQuotes = undefined;
  let isPrimitive = undefined;
  let getPrimitive = undefined;
  let tokens = undefined;
  let tokenGroup = undefined;
  let dotRegex = undefined;
  let firstToken = undefined;
  let getMatchingParenIndex = undefined;
  let currentView = undefined;
  let currentContext = undefined;
  let getValue = undefined;
  let setValue = undefined;
  let loadMixinShare = undefined;
  let loadToContainer = undefined;
  let childrenProperty = undefined;
  let signalContainer = undefined;
  ViewModel = class ViewModel {
    static initClass() {
  
      //@@@@@@@@@@@@@@
      // Class methods
  
      _nextId = 1;
      this.persist = true;
  
      // These are view model properties the user can use
      // but they have special meaning to ViewModel
      this.properties = {
        autorun: 1,
        events: 1,
        share: 1,
        mixin: 1,
        signal: 1,
        ref: 1,
        load: 1,
        onRendered: 1,
        onCreated: 1,
        onDestroyed: 1
      };
  
      // The user can't use these properties
      // when defining a view model
      this.reserved = {
        vmId: 1,
        vmPathToParent: 1,
        vmOnCreated: 1,
        vmOnRendered: 1,
        vmOnDestroyed: 1,
        vmAutorun: 1,
        vmEvents: 1,
        vmInitial: 1,
        vmProp: 1,
        templateInstance: 1,
        templateName: 1,
        parent: 1,
        children: 1,
        child: 1,
        reset: 1,
        data: 1,
        b: 1
      };
  
  
      // These are objects used as bindings but do not have
      // an implementation
      this.nonBindings = {
        throttle: 1,
        optionsText: 1,
        optionsValue: 1,
        defaultText: 1,
        defaultValue: 1
      };
  
      // Properties which the user needs to be more explicit in what they want
      // e.g. in a bind "if: prop.valid" the assumption is that the user wants to invoke
      // "prop.valid", not "prop().valid". If 'valid' is part of the object contained in
      // the property then the user must use the parenthesis: "if: prop().valid"
      this.funPropReserved = {
        valid: 1,
        validMessage: 1,
        invalid: 1,
        invalidMessage: 1,
        validating: 1,
        message: 1
      };
  
      this.bindObjects = {};
  
      this.byId = {};
      this.byTemplate = {};
  
      this.bindIdAttribute = 'b-id';
  
      getBindHelper = function(useBindings) {
        let {
          bindIdAttribute
        } = ViewModel;
        if (!useBindings) { bindIdAttribute += "-e"; }
        return function(bindString) {
          const bindId = ViewModel.nextId();
          const bindObject = ViewModel.parseBind(bindString);
          ViewModel.bindObjects[bindId] = bindObject;
          const templateInstance = Template.instance();
  
          if (!templateInstance.viewmodel) {
            ViewModel.addEmptyViewModel(templateInstance);
          }
  
          const bindings = useBindings ? ViewModel.bindings : _.pick(ViewModel.bindings, 'default');
  
          ({
            currentView
          } = Blaze);
  
          // The template on which the element is rendered might not be
          // the one where the user puts it on the html. If it sounds confusing
          // it's because it IS confusing. The only case I know of is with
          // Iron Router's contentFor blocks.
          // See https://github.com/ManuelDeLeon/viewmodel/issues/142
          const currentViewInstance = currentView._templateInstance || templateInstance;
  
          // Blaze.currentView.onViewReady fails for some packages like jagi:astronomy and tap:i18n
          Tracker.afterFlush(function() {
            if (currentView.isDestroyed) { return; } // The element may be removed before it can even be bound/used
            const element = currentViewInstance.$(`[${bindIdAttribute}='${bindId}']`);
            // Don't bind the element because of a context change
            if (element.length && !element[0].vmBound) {
              if (!element.removeAttr) { return; }
              element[0].vmBound = true;
              element.removeAttr(bindIdAttribute);
              return templateInstance.viewmodel.bind(bindObject, templateInstance, element, bindings, bindId, currentView);
            }
          });
  
          const bindIdObj = {};
          bindIdObj[bindIdAttribute] = bindId;
          return bindIdObj;
        };
      };
  
      this.bindHelper = getBindHelper(true);
      this.eventHelper = getBindHelper(false);
  
      delayed = { };
  
      this.bindings = {};
  
      getDelayedSetter = function(bindArg, setter, bindId) {
        if (bindArg.elementBind.throttle) {
          return (...args) => ViewModel.delay(bindArg.getVmValue(bindArg.elementBind.throttle), bindId, () => setter(...Array.from(args || [])));
        } else {
          return setter;
        }
      };
  
      stringRegex = /^(?:"(?:[^"]|\\")*[^\\]"|'(?:[^']|\\')*[^\\]')$/;
      quoted = str => stringRegex.test(str);
      removeQuotes = str => str.substr(1, str.length - 2);
      isPrimitive = val => (val === "true") || (val === "false") || (val === "null") || (val === "undefined") || $.isNumeric(val);
  
      getPrimitive = function(val) {
        switch (val) {
          case "true": return true;
          case "false": return false;
          case "null": return null;
          case "undefined": return undefined;
          default: if ($.isNumeric(val)) { return parseFloat(val); } else { return val; }
        }
      };
  
      tokens = {
        '**'(a, b) { return Math.pow(a, b); },
        '*'(a, b) { return a * b; },
        '/'(a, b) { return a / b; },
        '%'(a, b) { return a % b; },
        '+'(a, b) { return a + b; },
        '-'(a, b) { return a - b; },
        '<'(a, b) { return a < b; },
        '<='(a, b) { return a <= b; },
        '>'(a, b) { return a > b; },
        '>='(a, b) { return a >= b; },
        '=='(a, b) { return a == b; },
        '!=='(a, b) { return a !== b; },
        '==='(a, b) { return a === b; },
        '!==='(a, b) { return a !== b; },
        '&&'(a, b) { return a && b; },
        '||'(a, b) { return a || b; }
      };
  
      tokenGroup = {};
      for (let _t in tokens) {
        if (!tokenGroup[_t.length]) { tokenGroup[_t.length] = {}; }
        tokenGroup[_t.length][_t] = 1;
      }
  
      dotRegex = /(\D\.)|(\.\D)/;
  
      firstToken = function(str) {
        let tokenIndex = -1;
        let token = null;
        let inQuote = null;
        let parensCount = 0;
        for (let i = 0; i < str.length; i++) {
          const c = str[i];
          if (token) { break; }
          if ((c === '"') || (c === "'")) {
            if (inQuote === c) {
              inQuote = null;
            } else if (!inQuote) {
              inQuote = c;
            }
          } else if (!inQuote && ((c === '(') || (c === ')'))) {
            if (c === '(') {
              parensCount++;
            }
            if (c === ')') {
              parensCount--;
            }
          } else if (!inQuote && (parensCount === 0) && ~"+-*/%&|><=".indexOf(c)) {
            tokenIndex = i;
            for (let length = 4; length >= 1; length--) {
              if (str.length > (tokenIndex + length)) {
                const candidateToken = str.substr(tokenIndex, length);
                if (tokenGroup[length] && tokenGroup[length][candidateToken]) {
                  token = candidateToken;
                  break;
                }
              }
            }
          }
        }
        return [token, tokenIndex];
      };
  
      getMatchingParenIndex = function(bindValue, parenIndexStart) {
        if (!~parenIndexStart) { return -1; }
        let openParenCount = 0;
        for (let start = parenIndexStart + 1, i = start, end = bindValue.length, asc = start <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
          const currentChar = bindValue.charAt(i);
          if (currentChar === ')') {
            if (openParenCount === 0) {
              return i;
            } else {
              openParenCount--;
            }
          } else if (currentChar === '(') {
            openParenCount++;
          }
        }
  
        throw new Error("Unbalanced parenthesis");
      };
  
      currentView = null;
      currentContext = function() {
        if (currentView) {
          return Blaze.getData(currentView);
        } else {
          return __guard__(Template.instance(), x => x.data);
        }
      };
  
      getValue = function(container, bindValue, viewmodel, funPropReserved, event) {
        let value;
        bindValue = bindValue.trim();
        if (isPrimitive(bindValue)) { return getPrimitive(bindValue); }
        const [token, tokenIndex] = Array.from(firstToken(bindValue));
        if (~tokenIndex) {
          const left = getValue(container, bindValue.substring(0, tokenIndex), viewmodel);
          if (((token === '&&') && !left) || ((token === '||') && left)) {
            value = left;
          } else {
            const right = getValue(container, bindValue.substring(tokenIndex + token.length), viewmodel);
            value = tokens[token.trim()]( left, right );
          }
        } else if (bindValue === "this") {
          value = currentContext();
        } else if (quoted(bindValue)) {
          value = removeQuotes(bindValue);
        } else {
          const negate = bindValue.charAt(0) === '!';
          if (negate) { bindValue = bindValue.substring(1); }
  
          let dotIndex = bindValue.search(dotRegex);
          if (~dotIndex && (bindValue.charAt(dotIndex) !== '.')) { dotIndex += 1; }
          const parenIndexStart = bindValue.indexOf('(');
          const parenIndexEnd = getMatchingParenIndex(bindValue, parenIndexStart);
  
          const breakOnFirstDot = ~dotIndex && (!~parenIndexStart || (dotIndex < parenIndexStart) || (dotIndex === (parenIndexEnd + 1)));
  
          if (breakOnFirstDot) {
            const newBindValue = bindValue.substring(dotIndex + 1);
            const newBindValueCheck = newBindValue.endsWith('()') ? newBindValue.substr(0, newBindValue.length - 2) : newBindValue;
            const newContainer = getValue(container, bindValue.substring(0, dotIndex), viewmodel, ViewModel.funPropReserved[newBindValueCheck]);
            value = getValue(newContainer, newBindValue, viewmodel);
          } else {
            if (container == null) {
              value = undefined;
            } else {
              let name = bindValue;
              const args = [];
              if (~parenIndexStart) {
                const parsed = ViewModel.parseBind(bindValue);
                name = Object.keys(parsed)[0];
                const second = parsed[name];
                if (second.length > 2) {
                  for (let arg of Array.from(second.substr(1, second.length - 2).split(','))) { //remove parenthesis
                    arg = $.trim(arg);
                    let newArg = undefined;
                    if (arg === "this") {
                      newArg = currentContext();
                    } else if (quoted(arg)) {
                      newArg = removeQuotes(arg);
                    } else {
                      const neg = arg.charAt(0) === '!';
                      if (neg) { arg = arg.substring(1); }
  
                      arg = getValue(viewmodel, arg, viewmodel);
                      if (viewmodel && arg in viewmodel) {
                        newArg = getValue(viewmodel, arg, viewmodel);
                      } else {
                        newArg = arg; //getPrimitive(arg)
                      }
                      if (neg) { newArg = !newArg; }
                    }
                    args.push(newArg);
                  }
                }
              }
  
              const primitive = isPrimitive(name);
              if (container instanceof ViewModel && !primitive && !container[name]) {
                container[name] = ViewModel.makeReactiveProperty(undefined, viewmodel);
              }
  
              if (!primitive && !((container != null) && ((container[name] != null) || _.isObject(container)))) {
                let errorMsg = `Can't access '${name}' of '${container}'.`;
                if (viewmodel) {
                  const templateName = ViewModel.templateName(viewmodel.templateInstance);
                  errorMsg += ` This is for template '${templateName}'.`;
                }
                throw new Error(errorMsg);
              } else if (primitive) {
                value = getPrimitive(name);
              } else if (!name in container) {
                return undefined;
              } else {
                if (!funPropReserved && _.isFunction(container[name])) {
                  if (event) { args.push(event); }
                  value = container[name].apply(container, args);
                } else {
                  value = container[name];
                }
              }
            }
          }
          if (negate) { value = !value; }
        }
  
        return value;
      };
  
      setValue = function(value, container, bindValue, viewmodel, event, initialProp) {
        bindValue = bindValue.trim();
        if (isPrimitive(bindValue)) { return getPrimitive(bindValue); }
        const [token, tokenIndex] = Array.from(firstToken(bindValue));
        let retValue = undefined;
        if (~tokenIndex) {
          const left = setValue(value, container, bindValue.substring(0, tokenIndex), viewmodel);
          if ((token === '&&') && !left) { return left; }
          if ((token === '||') && left) { return left; }
          const right = setValue(value, container, bindValue.substring(tokenIndex + token.length), viewmodel);
          retValue = tokens[token.trim()]( left, right );
        } else if (~bindValue.indexOf(')', bindValue.length - 1)) {
          retValue = getValue(viewmodel, bindValue, viewmodel, undefined, event);
        } else if (dotRegex.test(bindValue)) {
          let i = bindValue.search(dotRegex);
          if (bindValue.charAt(i) !== '.') { i += 1; }
          const newContainer = getValue(container, bindValue.substring(0, i), viewmodel, undefined);
          const newBindValue = bindValue.substring(i + 1);
          const initProp = initialProp || container[bindValue.substring(0, i)];
          retValue = setValue(value, newContainer, newBindValue, viewmodel, undefined, initProp);
        } else {
          if (_.isFunction(container[bindValue])) { 
            retValue = container[bindValue](value); 
          } else { 
            container[bindValue] = value;
            if (initialProp && initialProp.changed) {
              initialProp.changed();
            }
            retValue = value;
          }
        }
        return retValue;
      };
  
      loadMixinShare = function(toLoad, collection, viewmodel, onlyEvents) {
        if (toLoad) {
          if (isArray(toLoad)) {
            for (let element of Array.from(toLoad)) {
              if (_.isString(element)) {
                //viewmodel.load collection[element], onlyEvents
                loadToContainer(viewmodel, viewmodel, collection[element], onlyEvents);
    //            if viewmodel instanceof ViewModel
    //              viewmodel.load collection[element], onlyEvents
    //            else
    //              ViewModel.loadProperties collection[element], viewmodel
              } else {
                loadMixinShare(element, collection, viewmodel, onlyEvents);
              }
            }
          } else if (_.isString(toLoad)) {
            loadToContainer(viewmodel, viewmodel, collection[toLoad], onlyEvents);
    //        if viewmodel instanceof ViewModel
    //        viewmodel.load collection[toLoad], onlyEvents
    //        else
    //          ViewModel.loadProperties collection[toLoad], viewmodel
          } else {
            for (let ref in toLoad) {
              const container = {};
              const mixshare = toLoad[ref];
              if (isArray(mixshare)) {
                for (let item of Array.from(mixshare)) {
    //              loadMixinShare collection[item], container, onlyEvents
                  loadToContainer(container, viewmodel, collection[item], onlyEvents);
                }
    //              ViewModel.loadProperties collection[item], container
              } else {
    //            loadMixinShare collection[mixshare], container, onlyEvents
                loadToContainer(container, viewmodel, collection[mixshare], onlyEvents);
              }
    //            ViewModel.loadProperties collection[mixshare], container
              viewmodel[ref] = container;
            }
          }
        }
      };
  
      loadToContainer = function(container, viewmodel, toLoad, onlyEvents) {
        let hooks, item;
        if (!toLoad) { return; }
  
        if (isArray(toLoad)) {
          for (item of Array.from(toLoad)) { loadToContainer( container, viewmodel, item, onlyEvents ); }
        }
  
        if (!onlyEvents) {
          // Signals are loaded 1st
          const signals = ViewModel.signalToLoad(toLoad.signal, container);
          for (let signal of Array.from(signals)) {
            loadToContainer(container, viewmodel, signal, onlyEvents);
            viewmodel.vmOnCreated.push(signal.onCreated);
            viewmodel.vmOnDestroyed.push(signal.onDestroyed);
          }
        }
  
        // Shared are loaded 2nd
        loadMixinShare(toLoad.share, ViewModel.shared, container, onlyEvents);
  
        // Mixins are loaded 3rd
        loadMixinShare(toLoad.mixin, ViewModel.mixins, container, onlyEvents);
  
        // Whatever is in 'load' is loaded before direct properties
        loadToContainer(container, viewmodel, toLoad.load, onlyEvents);
  
        if (!onlyEvents) {
          // Direct properties are loaded last.
          ViewModel.loadProperties(toLoad, container);
        }
  
        if (onlyEvents) {
          hooks =
            {events: 'vmEvents'};
        } else {
          hooks = {
            onCreated: 'vmOnCreated',
            onRendered: 'vmOnRendered',
            onDestroyed: 'vmOnDestroyed',
            autorun: 'vmAutorun'
          };
        }
  
  
        return (() => {
          const result = [];
          for (var hook in hooks) {
            var vmProp = hooks[hook];
            if (toLoad[hook]) {
              if (isArray(toLoad[hook])) {
                result.push((() => {
                  const result1 = [];
                  for (item of Array.from(toLoad[hook])) {
                    result1.push(viewmodel[vmProp].push(item));
                  }
                  return result1;
                })());
              } else {
                result.push(viewmodel[vmProp].push(toLoad[hook]));
              }
            }
          }
          return result;
        })();
      };
  
    //############
      // Constructor
  
      childrenProperty = function() {
        const array = new ReactiveArray();
        const funProp = function(search, predicate) {
          array.depend();
          if (arguments.length) {
            ViewModel.check("#children", search);
            let newPredicate = undefined; 
            if (_.isString(search)) {
              const first = vm => ViewModel.templateName(vm.templateInstance) === search;
              if (predicate) {
                newPredicate = vm => first(vm) && predicate(vm);
              } else {
                newPredicate = first;
              }
            } else {
              newPredicate = search;
            }
            return _.filter(array, newPredicate);
          } else {
            return array;
          }
        };
  
        return funProp;
      };
  
      this.shared = {};
  
      this.globals = [];
  
      this.mixins = {};
  
      this.signals = {};
  
      signalContainer = function(containerName, container) {
        const all = [];
        if (!containerName) { return all; }
        const signalObject = ViewModel.signals[containerName];
        for (let key in signalObject) {
          const value = signalObject[key];
          (function(key, value) {
            const single = {};
            single[key] = {};
            const transform = value.transform || (e => e);
            const boundProp = `_${key}_Bound`;
            single.onCreated = function() {
              const vmProp = container[key];
              const func = e => vmProp(transform(e));
              const funcToUse = value.throttle ? _.throttle( func, value.throttle ) : func;
              container[boundProp] = funcToUse;
              return value.target.addEventListener(value.event, funcToUse);
            };
            single.onDestroyed = function() {
              return value.target.removeEventListener(value.event, this[boundProp]);
            };
            return all.push(single);
          })(key, value);
        }
        return all;
      };
    }
    static nextId() { return _nextId++; }
    static add(viewmodel) {
      ViewModel.byId[viewmodel.vmId] = viewmodel;
      const templateName = ViewModel.templateName(viewmodel.templateInstance);
      if (templateName) {
        if (!ViewModel.byTemplate[templateName]) {
          ViewModel.byTemplate[templateName] = {};
        }
        return ViewModel.byTemplate[templateName][viewmodel.vmId] = viewmodel;
      }
    }

    static remove(viewmodel) {
      delete ViewModel.byId[viewmodel.vmId];
      const templateName = ViewModel.templateName(viewmodel.templateInstance);
      if (templateName) {
        return delete ViewModel.byTemplate[templateName][viewmodel.vmId];
      }
    }

    static find(templateNameOrPredicate, predicateOrNothing) {
      const templateName = _.isString(templateNameOrPredicate) && templateNameOrPredicate;
      const predicate = templateName ? predicateOrNothing : _.isFunction(templateNameOrPredicate) && templateNameOrPredicate;

      const vmCollection = templateName ? ViewModel.byTemplate[templateName] : ViewModel.byId;
      if (!vmCollection) { return undefined; }
      const vmCollectionValues = _.values(vmCollection);
      if (predicate) {
        return _.filter(vmCollection, predicate);
      } else {
        return vmCollectionValues;
      }
    }

    static findOne(templateNameOrPredicate, predicateOrNothing) {
      return _.first(ViewModel.find( templateNameOrPredicate, predicateOrNothing ));
    }

    static check(key, ...args) {
      if (Meteor.isDev && !ViewModel.ignoreErrors) {
        if (Package['manuel:viewmodel-debug'] != null) {
          Package['manuel:viewmodel-debug'].VmCheck(key, ...Array.from(args));
        }
      }
    }

    static onCreated(template) {
      return function() {
        const templateInstance = this;
        const viewmodel = template.createViewModel(templateInstance.data);
        templateInstance.viewmodel = viewmodel;
        viewmodel.templateInstance = templateInstance;
        ViewModel.add(viewmodel);

        if (templateInstance.data != null ? templateInstance.data.ref : undefined) {
          const parentTemplate = ViewModel.parentTemplate(templateInstance);
          if (parentTemplate) {
            if (!parentTemplate.viewmodel) {
              ViewModel.addEmptyViewModel(parentTemplate);
            }
            viewmodel.parent()[templateInstance.data.ref] = viewmodel;
          }
        }

        const loadData = () => ViewModel.delay(0, function() {
          // Don't bother if the template
          // gets destroyed by the time it gets here (the next js cycle)
          let migrationData;
          if (templateInstance.isDestroyed) { return; }

          ViewModel.assignChild(viewmodel);

          for (let obj of Array.from(ViewModel.globals)) {
            viewmodel.load(obj);
          }

          const vmHash = viewmodel.vmHash();
          if (migrationData = Migration.get(vmHash)) {
            viewmodel.load(migrationData);
            ViewModel.removeMigration(viewmodel, vmHash);
          }
          if (viewmodel.onUrl) {
            ViewModel.loadUrl(viewmodel);
            return ViewModel.saveUrl(viewmodel);
          }
        });

        const autoLoadData = () => templateInstance.autorun(() => viewmodel.load(Template.currentData()));

        // Can't use delay in a simulation.
        // By default onCreated runs in a computation
        if (Tracker.currentComputation) {
          loadData();
          // Crap, I have no idea why I'm delaying the load
          // data from the context. I think Template.currentData()
          // blows up if it's called inside a computation ?_?
          ViewModel.delay(0, autoLoadData);
        } else {
          // Loading the context data needs to happen immediately
          // so the Blaze helpers can work with inherited values
          autoLoadData();
          // Running in a simulation
          // setup the load data after tracker is done with the current queue
          Tracker.afterFlush(() => loadData());
        }

        for (let fun of Array.from(viewmodel.vmOnCreated)) {
          fun.call(viewmodel, templateInstance);
        }

        const helpers = {};
        for (let prop in viewmodel) {
          if (!ViewModel.reserved[prop]) {
            ((prop => helpers[prop] = function(...args) {
              const instanceVm = Template.instance().viewmodel;
              // We have to check that the view model has the property
              // as they may not be present if they're inherited properties
              // See: https://github.com/ManuelDeLeon/viewmodel/issues/223
              if (instanceVm[prop]) { return instanceVm[prop](...Array.from(args || [])); }
            }))(prop);
          }
        }

        template.helpers(helpers);

      };
    }

    static addEmptyViewModel(templateInstance) {
      const {
        template
      } = templateInstance.view;
      template.viewmodelInitial = {};
      const onCreated = ViewModel.onCreated(template, template.viewmodelInitial);
      onCreated.call(templateInstance);
      const onRendered = ViewModel.onRendered(template.viewmodelInitial);
      onRendered.call(templateInstance);
      const onDestroyed = ViewModel.onDestroyed(template.viewmodelInitial);
      templateInstance.view.onViewDestroyed(() => onDestroyed.call(templateInstance));
    }

    static getInitialObject(initial, context) {
      if (_.isFunction(initial)) {
        return initial(context) || {};
      } else {
        return initial || {};
      }
    }
    static delay(time, nameOrFunc, fn) {
      let d, name;
      const func = fn || nameOrFunc;
      if (fn) { name = nameOrFunc; }
      if (name) { d = delayed[name]; }
      if (d != null) { Meteor.clearTimeout(d); }
      const id = Meteor.setTimeout(func, time);
      if (name) { return delayed[name] = id; }
    }

    static makeReactiveProperty(initial, viewmodel) {
      const dependency = new Tracker.Dependency();
      const initialValue = initial instanceof ViewModel.Property ?
        initial.defaultValue
      :
        initial;

      let _value = undefined;
      const reset = function() {
        if (isArray(initialValue)) {
          return _value = new ReactiveArray(initialValue, dependency);
        } else {
          return _value = initialValue;
        }
      };

      reset();

      const validator = initial instanceof ViewModel.Property ?
        initial
      :
        ViewModel.Property.validator(initial);

      var funProp = function(value) {
        if (arguments.length) {
          if (_value !== value) {
            const changeValue = function() {

              if (validator.beforeUpdates.length) {
                validator.beforeValueUpdate(_value, viewmodel);
              }

              if (isArray(value)) {
                _value = new ReactiveArray(value, dependency);
              } else {
                _value = value;
              }

              if (validator.convertIns.length) {
                _value = validator.convertValueIn(_value, viewmodel);
              }

              if (validator.afterUpdates.length) {
                validator.afterValueUpdate(_value, viewmodel);
              }

              return dependency.changed();
            };
            if (funProp.delay > 0) {
              ViewModel.delay(funProp.delay, funProp.vmProp, changeValue);
            } else {
              changeValue();
            }
          }
        } else {
          dependency.depend();
        }

        if (validator.convertOuts.length) {
          return validator.convertValueOut(_value, viewmodel);
        } else {
          return _value;
        }
      };

      funProp.reset = function() {
        reset();
        return dependency.changed();
      };

      funProp.depend = () => dependency.depend();
      funProp.changed = () => dependency.changed();
      funProp.delay = 0;
      funProp.vmProp = ViewModel.nextId();



      const hasAsync = validator.hasAsync();
      let validDependency = undefined;
      let validatingItems = undefined;
      if (hasAsync) {
        validDependency = new Tracker.Dependency();
        validatingItems = new ReactiveArray();
      }

      let validationAsync = {};

      const getDone = hasAsync ?
        function(initialValue) {
          validatingItems.push(1);
          return function(result) {
            validatingItems.pop();
            if ((_value === initialValue) && !((validationAsync.value === _value) || result)) {
              validationAsync = { value: _value };
              return validDependency.changed();
            }
          };
        } : undefined;

      funProp.valid = function(noAsync) {
        dependency.depend();
        if (hasAsync) {
          validDependency.depend();
        }
        if (validationAsync && validationAsync.hasOwnProperty('value') && (validationAsync.value === _value)) {
          return false;
        } else {
          if (hasAsync && !noAsync) {
            validator.verifyAsync(_value, getDone(_value), viewmodel);
          }
          return validator.verify(_value, viewmodel);
        }
      };

      funProp.validMessage = () => validator.validMessageValue;

      funProp.invalid = function(noAsync) { return !this.valid(noAsync); };
      funProp.invalidMessage = () => validator.invalidMessageValue;

      funProp.validating = function() {
        if (!hasAsync) { return false; }
        validatingItems.depend();
        return !!validatingItems.length;
      };

      funProp.message = function() {
        if (this.valid(true)) {
          return validator.validMessageValue;
        } else {
          return validator.invalidMessageValue;
        }
      };

      // to give the feel of non reactivity
      Object.defineProperty(funProp, 'value', { get() { return _value; }});

      return funProp;
    }
    static addBinding(binding) {
      ViewModel.check("@addBinding", binding);
      if (!binding.priority) { binding.priority = 1; }
      if (binding.selector) { binding.priority++; }
      if (binding.bindIf) { binding.priority++; }

      const {
        bindings
      } = ViewModel;
      if (!bindings[binding.name]) {
        bindings[binding.name] = [];
      }
      const bindingArray = bindings[binding.name];
      bindingArray[bindingArray.length] = binding;
    }

    static addAttributeBinding(attrs) {
      if (isArray(attrs)) {
        for (let attr of Array.from(attrs)) {
          ((attr => ViewModel.addBinding({
            name: attr,
            bind(bindArg) {
              bindArg.autorun(() => bindArg.element[0].setAttribute(attr, bindArg.getVmValue(bindArg.bindValue[attr])));
            }
          })))(attr);
        }
      } else if (_.isString(attrs)) {
        ViewModel.addBinding({
          name: attrs,
          bind(bindArg) {
            bindArg.autorun(() => bindArg.element[0].setAttribute(attrs, bindArg.getVmValue(bindArg.bindValue[attrs])));
          }
        });
      }
    }

    static getBinding(bindName, bindArg, bindings) {
      let binding = null;
      const bindingArray = bindings[bindName];
      if (bindingArray) {
        if ((bindingArray.length === 1) && !(bindingArray[0].bindIf || bindingArray[0].selector)) {
          binding = bindingArray[0];
        } else {
          binding = _.find(_.sortBy(bindingArray, (b => -b.priority)), b => !( (b.bindIf && !b.bindIf(bindArg)) || (b.selector && !bindArg.element.is(b.selector)) ));
        }
      }
      return binding || ViewModel.getBinding('default', bindArg, bindings);
    }

    static getBindArgument(templateInstance, element, bindName, bindValue, bindObject, viewmodel, bindId, view) {
      var bindArg = {
        templateInstance,
        autorun(f) {
          const fun = c => f(bindArg, c);
          templateInstance.autorun(fun);
        },
        element,
        elementBind: bindObject,
        getVmValue: ViewModel.getVmValueGetter(viewmodel, bindValue, view),
        bindName,
        bindValue,
        viewmodel
      };

      bindArg.setVmValue = getDelayedSetter(bindArg, ViewModel.getVmValueSetter(viewmodel, bindValue, view), bindId);
      return bindArg;
    }

    static bindSingle(templateInstance, element, bindName, bindValue, bindObject, viewmodel, bindings, bindId, view) {
      const bindArg = ViewModel.getBindArgument(templateInstance, element, bindName, bindValue, bindObject, viewmodel, bindId, view);
      const binding = ViewModel.getBinding(bindName, bindArg, bindings);
      if (!binding) { return; }

      if (binding.bind) {
        binding.bind(bindArg);
      }

      if (binding.autorun) {
        bindArg.autorun(binding.autorun);
      }

      if (binding.events) {
        for (let eventName in binding.events) {
          const eventFunc = binding.events[eventName];
          (((eventName, eventFunc) => element.bind(eventName, e => eventFunc(bindArg, e))))(eventName, eventFunc);
        }
      }
    }

    static getVmValueGetter(viewmodel, bindValue, view) {
      return  function(optBindValue) {
        if (optBindValue == null) { optBindValue = bindValue; }
        currentView = view;
        return getValue(viewmodel, optBindValue.toString(), viewmodel);
      };
    }

    static getVmValueSetter(viewmodel, bindValue, view) {
      if (!_.isString(bindValue)) { return (function() {}); }
      return function(value) {
        currentView = view;
        return setValue(value, viewmodel, bindValue, viewmodel, value);
      };
    }


    static parentTemplate(templateInstance) {
      let view = templateInstance.view != null ? templateInstance.view.parentView : undefined;
      while (view) {
        if ((view.name.substring(0, 9) === 'Template.') || (view.name === 'body')) {
          return view.templateInstance();
        }
        view = view.parentView;
      }
    }

    static assignChild(viewmodel) {
      __guard__(viewmodel.parent(), x => x.children().push(viewmodel));
    }

    static onRendered() {
      return function() {
        const templateInstance = this;
        const {
          viewmodel
        } = templateInstance;
        const initial = viewmodel.vmInitial;
        ViewModel.check("@onRendered", initial.autorun, templateInstance);

        // onRendered happens before onViewReady
        // We want bindings to be in place before we run
        // the onRendered functions and autoruns
        ViewModel.delay(0, function() {
          // Don't bother running onRendered or autoruns if the template
          // gets destroyed by the time it gets here (the next js cycle)
          let fun;
          if (templateInstance.isDestroyed) { return; }
          for (fun of Array.from(viewmodel.vmOnRendered)) {
            fun.call(viewmodel, templateInstance);
          }

          for (let autorun of Array.from(viewmodel.vmAutorun)) {
            (function(autorun) {
              fun = c => autorun.call(viewmodel, c);
              return templateInstance.autorun(fun);
            })(autorun);
          }
        });
      };
    }

    static loadProperties(toLoad, container) {
      const loadObj = function(obj) {
        for (let key in obj) {
          const value = obj[key];
          if (!ViewModel.properties[key]) {
            if (ViewModel.reserved[key]) {
              throw new Error("Can't use reserved word '" + key + "' as a view model property.");
            } else {
              if (_.isFunction(value)) {
                // we don't care, just take the new function
                container[key] = value;
              } else if (container[key] && container[key].vmProp && _.isFunction(container[key])) {
                // keep the reference to the old property we already have
                container[key](value);
              } else {
                // Create a new property
                container[key] = ViewModel.makeReactiveProperty(value, container);
              }
            }
          }
        }
      };
      if (isArray(toLoad)) {
        for (let obj of Array.from(toLoad)) { loadObj(obj); }
      } else {
        loadObj(toLoad);
      }
    }

    //#################
    // Instance methods

    bind(bindObject, templateInstance, element, bindings, bindId, view) {
      const viewmodel = this;
      for (let bindName in bindObject) {
        const bindValue = bindObject[bindName];
        if (!ViewModel.nonBindings[bindName]) {
          if (~bindName.indexOf(' ')) {
            for (let bindNameSingle of Array.from(bindName.split(' '))) {
              ViewModel.bindSingle(templateInstance, element, bindNameSingle, bindValue, bindObject, viewmodel, bindings, bindId, view);
            }
          } else {
            ViewModel.bindSingle(templateInstance, element, bindName, bindValue, bindObject, viewmodel, bindings, bindId, view);
          }
        }
      }
    }

    load(toLoad, onlyEvents) { return loadToContainer(this, this, toLoad, onlyEvents); }

    parent(...args) {
      let parentTemplate;
      ViewModel.check("#parent", ...Array.from(args));
      const viewmodel = this;
      let instance = viewmodel.templateInstance;
      while ((parentTemplate = ViewModel.parentTemplate(instance))) {
        if (parentTemplate.viewmodel) {
          return parentTemplate.viewmodel;
        } else {
          instance = parentTemplate;
        }
      }
    }

    reset() {
      const viewmodel = this;
      return (() => {
        const result = [];
        for (let prop in viewmodel) {
          if (_.isFunction(viewmodel[prop] != null ? viewmodel[prop].reset : undefined)) {
            result.push(viewmodel[prop].reset());
          }
        }
        return result;
      })();
    }


    data(fields) {
      if (fields == null) { fields = []; }
      const viewmodel = this;
      const js = {};
      for (let prop in viewmodel) {
        if ((viewmodel[prop] != null ? viewmodel[prop].vmProp : undefined) && ((fields.length === 0) || Array.from(fields).includes(prop))) {
          viewmodel[prop].depend();
          const {
            value
          } = viewmodel[prop];
          if (value instanceof Array) {
            js[prop] = value.array();
          } else {
            js[prop] = value;
          }
        }
      }
      return js;
    }

    valid(fields) {
      if (fields == null) { fields = []; }
      const viewmodel = this;
      for (let prop in viewmodel) {
        if ((viewmodel[prop] != null ? viewmodel[prop].vmProp : undefined) && ((fields.length === 0) || Array.from(fields).includes(prop))) {
          if (!viewmodel[prop].valid(true)) { return false; }
        }
      }
      return true;
    }

    validMessages(fields) {
      if (fields == null) { fields = []; }
      const viewmodel = this;
      const messages = [];
      for (let prop in viewmodel) {
        if ((viewmodel[prop] != null ? viewmodel[prop].vmProp : undefined) && ((fields.length === 0) || Array.from(fields).includes(prop))) {
          if (viewmodel[prop].valid(true)) {
            const message = viewmodel[prop].message();
            if (message) {
              messages.push(message);
            }
          }
        }
      }
      return messages;
    }

    invalid(fields) { if (fields == null) { fields = []; } return !this.valid(fields); }
    invalidMessages(fields) {
      if (fields == null) { fields = []; }
      const viewmodel = this;
      const messages = [];
      for (let prop in viewmodel) {
        if ((viewmodel[prop] != null ? viewmodel[prop].vmProp : undefined) && ((fields.length === 0) || Array.from(fields).includes(prop))) {
          if (!viewmodel[prop].valid(true)) {
            const message = viewmodel[prop].message();
            if (message) {
              messages.push(message);
            }
          }
        }
      }
      return messages;
    }

    templateName() { return ViewModel.templateName(this.templateInstance); }

    static getPathTo(element) {
      // use ~ and #
      if (!element || !element.parentNode || (element.tagName === 'HTML') || (element === document.body)) {
        return '/';
      }

      let ix = 0;
      const siblings = element.parentNode.childNodes;
      let i = 0;
      while (i < siblings.length) {
        const sibling = siblings[i];
        if (sibling === element) {
          return ViewModel.getPathTo(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
        }
        if ((sibling.nodeType === 1) && (sibling.tagName === element.tagName)) {
          ix++;
        }
        i++;
      }
    }

    constructor(initial) {
      ViewModel.check("#constructor", initial);
      const viewmodel = this;
      viewmodel.vmId = ViewModel.nextId();

      // These will be filled from load/mixin/share/initial
      this.vmOnCreated = [];
      this.vmOnRendered = [];
      this.vmOnDestroyed = [];
      this.vmAutorun = [];
      this.vmEvents = [];

      viewmodel.load(initial);

      this.children = childrenProperty();

      viewmodel.vmPathToParent = function() {
        const viewmodelPath = ViewModel.getPathTo(viewmodel.templateInstance.firstNode);
        if (!viewmodel.parent()) {
          return viewmodelPath;
        }
        const parentPath = ViewModel.getPathTo(viewmodel.parent().templateInstance.firstNode);
        let i = 0;
        while ((parentPath[i] === viewmodelPath[i]) && (parentPath[i] != null)) { i++; }
        const difference = viewmodelPath.substr(i);
        return difference;
      };


    }

    child(...args) {
      const children = this.children(...Array.from(args || []));
      if (children != null ? children.length : undefined) {
        return children[0];
      } else {
        return undefined;
      }
    }

    static onDestroyed(initial) {
      return function() {
        const templateInstance = this;
        if (_.isFunction(initial)) { initial = initial(templateInstance.data); }
        const {
          viewmodel
        } = templateInstance;

        for (let fun of Array.from(viewmodel.vmOnDestroyed)) {
          fun.call(viewmodel, templateInstance);
        }

        const parent = viewmodel.parent();
        if (parent) {
          const children = parent.children();
          let indexToRemove = -1;
          for (let child of Array.from(children)) {
            indexToRemove++;
            if (child.vmId === viewmodel.vmId) {
              children.splice(indexToRemove, 1);
              break;
            }
          }
        }
        ViewModel.remove(viewmodel);
      };
    }

    static templateName(templateInstance) {
      const name = __guard__(templateInstance != null ? templateInstance.view : undefined, x => x.name);
      if (!name) { return ''; }
      if (name === 'body') { return name; } else { return name.substr(name.indexOf('.') + 1); }
    }

    vmHash() {
      const viewmodel = this;
      let key = ViewModel.templateName(viewmodel.templateInstance);
      if (viewmodel.parent()) {
        key += viewmodel.parent().vmHash();
      }

      if (viewmodel.vmTag) {
        key += viewmodel.vmTag();
      } else if (viewmodel._id) {
        key += viewmodel._id();
      } else {
        key += viewmodel.vmPathToParent();
      }

      return SHA256(key).toString();
    }

    static removeMigration(viewmodel, vmHash) {
      return Migration.delete(vmHash);
    }
    static share(obj) {
      for (let key in obj) {
        const value = obj[key];
        ViewModel.shared[key] = {};
        for (let prop in value) {
          const content = value[prop];
          if (_.isFunction(content) || ViewModel.properties[prop]) {
            ViewModel.shared[key][prop] = content;
          } else {
            ViewModel.shared[key][prop] = ViewModel.makeReactiveProperty(content);
          }
        }
      }

    }
    static global(obj) {
      return ViewModel.globals.push(obj);
    }
    static mixin(obj) {
      for (let key in obj) {
        const value = obj[key];
        ViewModel.mixins[key] = value;
      }
    }
    static signal(obj) {
      for (let key in obj) {
        const value = obj[key];
        ViewModel.signals[key] = value;
      }
    }

    static signalToLoad(containerName, container) {
      if (isArray(containerName)) {
        return _.flatten( (Array.from(containerName).map((name) => signalContainer(name, container))), true );
      } else {
        return signalContainer(containerName, container);
      }
    }
  };
  ViewModel.initClass();
  return ViewModel;
})();
function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}