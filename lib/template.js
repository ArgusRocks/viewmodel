// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
Template.registerHelper('b', ViewModel.bindHelper);
Template.registerHelper('on', ViewModel.eventHelper);

Blaze.Template.prototype.viewmodel = function(initial) {
  const template = this;
  ViewModel.check('T#viewmodel', initial, template);
  ViewModel.check('T#viewmodelArgs', template, arguments);
  template.viewmodelInitial = initial;
  template.onCreated(ViewModel.onCreated(template, initial));
  template.onRendered(ViewModel.onRendered(initial));
  template.onDestroyed(ViewModel.onDestroyed(initial));
  const initialObject = ViewModel.getInitialObject(initial);
  let viewmodel = new ViewModel();
  viewmodel.load(initialObject, true);
  for (let eventGroup of Array.from(viewmodel.vmEvents)) {
    for (let event in eventGroup) {
      const eventFunction = eventGroup[event];
      (function(event, eventFunction) {
        const eventObj = {};
        eventObj[event] = function(e, t) {
          const templateInstance = Template.instance();
          ({
            viewmodel
          } = templateInstance);
          return eventFunction.call(viewmodel, e, t);
        };
        return template.events(eventObj);
      })(event, eventFunction);
    }
  }
};

Blaze.Template.prototype.createViewModel = function(context) {
  const template = this;
  const initial = ViewModel.getInitialObject(template.viewmodelInitial, context);
  const viewmodel = new ViewModel(initial);
  viewmodel.vmInitial = initial;
  return viewmodel;
};

const htmls = { };
Blaze.Template.prototype.elementBind = function(selector, data) {
  const name = this.viewName;
  let html = null;
  if (data) {
    html = $("<div></div>").append($(Blaze.toHTMLWithData(this, data)));
  } else if (htmls[name]) {
    html = htmls[name];
  } else {
    html = $("<div></div>").append($(Blaze.toHTML(this)));
    htmls[name] = html;
  }

  const bindId = html.find(selector).attr("b-id");
  const bindOject = ViewModel.bindObjects[bindId];
  return bindOject;
};

Template.registerHelper('vmRef', function(prop) {
  const instance = Template.instance();
  return () => instance.viewmodel[prop];
});