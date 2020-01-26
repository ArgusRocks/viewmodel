// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const isArray = obj => obj instanceof Array || Array.isArray(obj);

const {
  addBinding
} = ViewModel;


addBinding({
  name: 'default',
  bind(bindArg) {
    bindArg.element.on(bindArg.bindName, function(event) {
      bindArg.setVmValue(event);
    });
  }
});

addBinding({
  name: 'toggle',
  events: {
    click(bindArg) {
      const value = bindArg.getVmValue();
      return bindArg.setVmValue(!value);
    }
  }
});

const showHide = reverse => (function(bindArg) {
  let show = bindArg.getVmValue();
  if (reverse) { show = !show; }
  if (show) {
    return bindArg.element.show();
  } else {
    return bindArg.element.hide();
  }
});

addBinding({
  name: 'if',
  autorun: showHide(false)
});

addBinding({
  name: 'visible',
  autorun: showHide(false)
});

addBinding({
  name: 'unless',
  autorun: showHide(true)
});

addBinding({
  name: 'hide',
  autorun: showHide(true)
});

const valueEvent = function(bindArg) {
  const newVal = bindArg.element.val();
  let vmVal = bindArg.getVmValue();
  vmVal = vmVal == null ? "" : vmVal.toString();
  if (bindArg.elementBind.throttle && !bindArg.viewmodel.hasOwnProperty(bindArg.bindValue)) {
    bindArg.viewmodel[bindArg.bindValue] = {};
  }
  if ((newVal !== vmVal) || (bindArg.elementBind.throttle && (!bindArg.viewmodel[bindArg.bindValue].hasOwnProperty('nextVal') || (newVal !== bindArg.viewmodel[bindArg.bindValue].nextVal) ))) {
    if (bindArg.elementBind.throttle) {
      bindArg.viewmodel[bindArg.bindValue].nextVal = newVal;
      bindArg.setVmValue(newVal); 
    } else {
      bindArg.setVmValue(newVal); 
    }
  }
};

const valueAutorun = function(bindArg) {
  let newVal = bindArg.getVmValue();
  newVal = newVal == null ? "" : newVal.toString();
  if (newVal !== bindArg.element.val()) { bindArg.element.val(newVal); }
};

addBinding({
  name: 'value',
  events: {
    'input change': valueEvent
  },
  autorun: valueAutorun
});

addBinding({
  name: 'text',
  autorun(bindArg) {
    bindArg.element.text(bindArg.getVmValue());
  }
});

addBinding({
  name: 'html',
  autorun(bindArg) {
    return bindArg.element.html(bindArg.getVmValue());
  }
});

const changeBinding = eb => eb.value || eb.check || eb.text || eb.html || eb.focus || eb.hover || eb.toggle || eb.if || eb.visible || eb.unless || eb.hide || eb.enable || eb.disable;

addBinding({
  name: 'change',
  bind(bindArg){
    const bindValue = changeBinding(bindArg.elementBind);
    return bindArg.autorun(function(bindArg, c) {
      const newValue = bindArg.getVmValue(bindValue);
      if (!c.firstRun) { return bindArg.setVmValue(newValue); }
    });
  },

  bindIf(bindArg){ return changeBinding(bindArg.elementBind); }
});

addBinding({
  name: 'enter',
  events: {
    'keyup'(bindArg, event) {
      if ((event.which === 13) || (event.keyCode === 13)) {
        return bindArg.setVmValue(event);
      }
    }
  }
});

addBinding({
  name: 'attr',
  bind(bindArg) {
    for (let attr in bindArg.bindValue) {
      ((attr => bindArg.autorun(() => bindArg.element[0].setAttribute(attr, bindArg.getVmValue(bindArg.bindValue[attr])))))(attr);
    }
  }
});

addBinding({
  name: 'check',
  events: {
    'change'(bindArg) {
      bindArg.setVmValue(bindArg.element.is(':checked'));
    }
  },

  autorun(bindArg) {
    const vmValue = bindArg.getVmValue();
    const elementCheck = bindArg.element.is(':checked');
    if (elementCheck !== vmValue) { return bindArg.element.prop('checked', vmValue); }
  }
});

addBinding({
  name: 'check',
  selector: 'input[type=radio]',
  events: {
    'change'(bindArg) {
      let name;
      const checked = bindArg.element.is(':checked');
      bindArg.setVmValue(checked);
      const rawElement = bindArg.element[0];
      if (checked && (name = rawElement.name)) {
        bindArg.templateInstance.$(`input[type=radio][name=${name}]`).each(function() {
          if (rawElement !== this) { return $(this).trigger('change'); }
        });
      }
    }
  },

  autorun(bindArg) {
    const vmValue = bindArg.getVmValue();
    const elementCheck = bindArg.element.is(':checked');
    if (elementCheck !== vmValue) { return bindArg.element.prop('checked', vmValue); }
  }
});

addBinding({
  name: 'group',
  selector: 'input[type=checkbox]',
  events: {
    'change'(bindArg) {
      const vmValue = bindArg.getVmValue();
      const elementValue = bindArg.element.val();
      if (bindArg.element.is(':checked')) {
        if (!Array.from(vmValue).includes(elementValue)) { return vmValue.push(elementValue); }
      } else {
        return vmValue.remove(elementValue);
      }
    }
  },

  autorun(bindArg) {
    const vmValue = bindArg.getVmValue();
    const elementCheck = bindArg.element.is(':checked');
    const elementValue = bindArg.element.val();
    const newValue = Array.from(vmValue).includes(elementValue);
    if (elementCheck !== newValue) { return bindArg.element.prop('checked', newValue); }
  }
});

addBinding({
  name: 'group',
  selector: 'input[type=radio]',
  events: {
    'change'(bindArg) {
      const checked = bindArg.element.is(':checked');
      if (checked) {
        let name;
        bindArg.setVmValue(bindArg.element.val());
        const rawElement = bindArg.element[0];
        if (name = rawElement.name) {
          bindArg.templateInstance.$(`input[type=radio][name=${name}]`).each(function() {
            if (rawElement !== this) { return $(this).trigger('change'); }
          });
        }
      }
    }
  },

  autorun(bindArg) {
    const vmValue = bindArg.getVmValue();
    const elementValue = bindArg.element.val();
    return bindArg.element.prop('checked', vmValue === elementValue);
  }
});

addBinding({
  name: 'class',
  bindIf(bindArg) { return _.isString(bindArg.bindValue); },
  bind(bindArg) {
    return bindArg.prevValue = '';
  },
  autorun(bindArg) {
    const newValue = bindArg.getVmValue();
    bindArg.element.removeClass(bindArg.prevValue);
    bindArg.element.addClass(newValue);
    return bindArg.prevValue = newValue;
  }
});

addBinding({
  name: 'class',
  bindIf(bindArg) { return !_.isString(bindArg.bindValue); },
  bind(bindArg) {
    for (let cssClass in bindArg.bindValue) {
      ((cssClass => bindArg.autorun(function() {
        if (bindArg.getVmValue(bindArg.bindValue[cssClass])) {
          bindArg.element.addClass(cssClass);
        } else {
          bindArg.element.removeClass(cssClass);
        }
      })))(cssClass);
    }
  }
});

addBinding({
  name: 'style',
  priority: 2,
  bindIf(bindArg) { return _.isString(bindArg.bindValue) && (bindArg.bindValue.charAt(0) === '['); },
  autorun(bindArg) {
    const itemString = bindArg.bindValue.substr(1, bindArg.bindValue.length - 2);
    const items = itemString.split(',');
    for (let item of Array.from(items)) {
      const value = bindArg.getVmValue($.trim(item));
      for (let style in value) {
        bindArg.element[0].style[style] = value[style];
      }
    }
  }
});

addBinding({
  name: 'style',
  bindIf(bindArg) { return _.isString(bindArg.bindValue); },
  autorun(bindArg) {
    let newValue = bindArg.getVmValue();
    if (_.isString(newValue)) {
      if (~newValue.indexOf(";")) {
        newValue = newValue.split(";").join(",");
      }
      newValue = ViewModel.parseBind(newValue);
    }
    return (() => {
      const result = [];
      for (let style in newValue) {
        result.push(bindArg.element[0].style[style] = newValue[style]);
      }
      return result;
    })();
  }});

addBinding({
  name: 'style',
  bindIf(bindArg) { return !_.isString(bindArg.bindValue); },
  bind(bindArg) {
    for (let style in bindArg.bindValue) {
      ((style => bindArg.autorun(function() {
        bindArg.element[0].style[style] = bindArg.getVmValue(bindArg.bindValue[style]);
      })))(style);
    }
  }
});

addBinding({
  name: 'hover',
  bind(bindArg) {
    const setBool = val => () => bindArg.setVmValue(val);
    bindArg.element.hover(setBool(true), setBool(false));
  }
});

addBinding({
  name: 'focus',
  events: {
    focus(bindArg) {
      if (!bindArg.getVmValue()) { bindArg.setVmValue(true); }
    },
    blur(bindArg) {
      if (bindArg.getVmValue()) { bindArg.setVmValue(false); }
    }
  },
  autorun(bindArg) {
    const value = bindArg.getVmValue();
    if (bindArg.element.is(':focus') !== value) {
      if (value) {
        bindArg.element.focus();
      } else {
        bindArg.element.blur();
      }
    }
  }
});

const canDisable = elem => elem.is('button') || elem.is('input') || elem.is('textarea') || elem.is('select');

const enable = function(elem) {
  if (canDisable(elem)) {
    return elem.removeAttr('disabled');
  } else {
    return elem.removeClass('disabled');
  }
};

const disable = function(elem) {
  if (canDisable(elem)) {
    return elem.attr('disabled', 'disabled');
  } else {
    return elem.addClass('disabled');
  }
};

const enableDisable = reverse => (function(bindArg) {
  let isEnable = bindArg.getVmValue();
  if (reverse) { isEnable = !isEnable; }
  if (isEnable) {
    return enable(bindArg.element);
  } else {
    return disable(bindArg.element);
  }
});

addBinding({
  name: 'enable',
  autorun: enableDisable(false)
});

addBinding({
  name: 'disable',
  autorun: enableDisable(true)
});

addBinding({
  name: 'options',
  selector: 'select:not([multiple])',
  autorun(bindArg) {
    let itemText, itemValue;
    const {
      optionsText
    } = bindArg.elementBind;
    const {
      optionsValue
    } = bindArg.elementBind;
    const selection = bindArg.getVmValue(bindArg.elementBind.value);
    bindArg.element.find('option').remove();
    const {
      defaultText
    } = bindArg.elementBind;
    const {
      defaultValue
    } = bindArg.elementBind;
    if ((defaultText != null) || (defaultValue != null)) {
      itemText = _.escape(((defaultText != null) && bindArg.getVmValue(defaultText)) || '');
      itemValue = _.escape(((defaultValue != null) && bindArg.getVmValue(defaultValue)) || '');
      bindArg.element.append(`<option selected='selected' value=\"${itemValue}\">${itemText}</option>`);
    }
    const source = bindArg.getVmValue();
    const collection = source instanceof Mongo.Cursor ? source.fetch() : source;
    for (let item of Array.from(collection)) {
      const itemTextRaw = optionsText ?
        item.hasOwnProperty(optionsText) ?
          item[optionsText]
        : _.isFunction(bindArg.viewmodel[optionsText]) ?
          bindArg.viewmodel[optionsText](item)
        :
          undefined
      :
        item;
      itemText = _.escape(itemTextRaw);
      itemValue = _.escape(optionsValue ? item[optionsValue] : item);
      const selected = selection === itemValue ? "selected='selected'" : "";
      bindArg.element.append(`<option ${selected} value=\"${itemValue}\">${itemText}</option>`);
    }
  }
});

addBinding({
  name: 'options',
  selector: 'select[multiple]',
  autorun(bindArg) {
    const {
      optionsText
    } = bindArg.elementBind;
    const {
      optionsValue
    } = bindArg.elementBind;
    const selection = bindArg.getVmValue(bindArg.elementBind.value);
    bindArg.element.find('option').remove();
    const source = bindArg.getVmValue();
    const collection = source instanceof Mongo.Cursor ? source.fetch() : source;
    for (let item of Array.from(collection)) {
      const itemTextRaw = optionsText ?
        item.hasOwnProperty(optionsText) ?
          item[optionsText]
        : _.isFunction(bindArg.viewmodel[optionsText]) ?
          bindArg.viewmodel[optionsText](item)
        :
          undefined
      :
        item;
      const itemText = _.escape(itemTextRaw);
      const itemValue = _.escape(optionsValue ? item[optionsValue] : item);
      const selected = Array.from(selection).includes(itemValue) ? "selected='selected'" : "";
      bindArg.element.append(`<option ${selected} value=\"${itemValue}\">${itemText}</option>`);
    }
  }
});

addBinding({
  name: 'value',
  selector: 'select[multiple]',
  events: {
    change(bindArg) {
      const elementValues = bindArg.element.val();
      const selected = bindArg.getVmValue();
      if (isArray(selected)) {
        selected.clear();
        if (isArray(elementValues)) {
          for (let v of Array.from(elementValues)) { selected.push(v); }
        }
      }
    }
  }
});

addBinding({
  name: 'ref',
  bind(bindArg) {
    ViewModel.check("refBinding", bindArg);
    bindArg.viewmodel[bindArg.bindValue] = bindArg.element;
  }
});

addBinding({
  name: 'refGroup',
  bind(bindArg) {
    if (!bindArg.viewmodel[bindArg.bindValue]) {
      bindArg.viewmodel[bindArg.bindValue] = $();
    }
    const group = bindArg.viewmodel[bindArg.bindValue];
    group.push.apply(group, bindArg.element);
  }
});

addBinding({
  name: 'value',
  selector: 'input[type=file]:not([multiple])',
  events: {
    change(bindArg, event) {
      const file = (event.target.files != null ? event.target.files.length : undefined) ? event.target.files[0] : null;
      bindArg.setVmValue(file);
    }
  }
});

addBinding({
  name: 'value',
  selector: 'input[type=file][multiple]',
  events: {
    change(bindArg, event) {
      const files = bindArg.getVmValue();
      files.clear();
      return Array.from(event.target.files).map((file) => files.push(file));
    }
  }
});
