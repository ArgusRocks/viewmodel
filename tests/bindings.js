// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const delay = f => setTimeout(f, 0);

describe("bindings - input value nested", function() {

  beforeEach(function() {
    this.viewmodel = new ViewModel({
      formData: {
        position: "X"
      }
    });
    this.element = $("<input></input>");
    return this.templateInstance =
      {autorun: Tracker.autorun};
  });

  describe("input value nested", () => beforeEach(function() {
    const bindObject =
      {value: "formData.position"};
    return this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
  }));

  it("gets value", function() {
    return assert.equal("X", this.viewmodel.formData().position);
  });

  return it("sets value from vm", function(done) {
    this.viewmodel.formData({ position: "Y" });
    return delay(() => {
      assert.equal("Y", this.viewmodel.formData().position);
      return done();
    });
  });
});

describe("bindings", function() {

  beforeEach(function() {
    this.viewmodel = new ViewModel({
      name: '',
      changeName(v) { return this.name(v); },
      on: true,
      off: false,
      array: []});
    this.element = $("<button></button>");
    return this.templateInstance =
      {autorun: Tracker.autorun};
  });

  describe("input value", function() {
    beforeEach(function() {
      const bindObject =
        {value: 'name'};
      return this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });


    it("sets value from vm", function(done) {
      this.viewmodel.name('X');
      return delay(() => {
        assert.equal("X", this.element.val());
        return done();
      });
    });

    it("sets value from element", function(done) {
      this.element.val('X');
      this.element.trigger('input');
      return delay(() => {
        assert.equal("X", this.viewmodel.name());
        return done();
      });
    });

    it("can handle undefined triggered by element", function(done) {
      this.viewmodel.name(undefined);
      return delay(() => {
        this.element.val('X');
        this.element.trigger('input');
        return delay(() => {
          assert.equal("X", this.viewmodel.name());
          return done();
        });
      });
    });

    it("can handle null triggered by element", function(done) {
      this.viewmodel.name(null);
      return delay(() => {
        this.element.val('X');
        this.element.trigger('input');
        return delay(() => {
          assert.equal("X", this.viewmodel.name());
          return done();
        });
      });
    });

    it("can handle undefined", function(done) {
      this.element.val('X');
      this.viewmodel.name(undefined);
      return delay(() => {
        assert.equal("", this.element.val());
        return done();
      });
    });

    it("can handle null", function(done) {
      this.element.val('X');
      this.viewmodel.name(null);
      return delay(() => {
        assert.equal("", this.element.val());
        return done();
      });
    });

    return it("sets value from element (change event)", function(done) {
      this.element.val('X');
      this.element.trigger('change');
      return delay(() => {
        assert.equal("X", this.viewmodel.name());
        return done();
      });
    });
  });

  describe("input value throttle", function() {
    beforeEach(function() {
      this.clock = sinon.useFakeTimers();
      const bindObject = {
        value: 'name',
        throttle: '10',
        bindId: 1
      };
      return this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings, 99, {});});

    afterEach(function() {
      return this.clock.restore();
    });

    it("delays value from element", function() {
      this.element.val('X');
      this.element.trigger('input');
      this.clock.tick(1);
      assert.equal('', this.viewmodel.name());
      this.clock.tick(12);
      assert.equal('X', this.viewmodel.name());
    });

    return it("throttles the value", function() {
      this.element.val('X');
      this.element.trigger('input');
      this.clock.tick(8);
      assert.equal('', this.viewmodel.name());
      this.element.val('Y');
      this.element.trigger('input');
      this.clock.tick(8);
      assert.equal('', this.viewmodel.name());
      this.element.val('Z');
      this.element.trigger('input');
      this.clock.tick(12);
      assert.equal('Z', this.viewmodel.name());
    });
  });

  describe("default", function() {
    beforeEach(function() {
      const bindObject =
        {click: 'changeName("X")'};
      return this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    return it("triggers event", function(done) {
      this.element.trigger('click');
      return delay(() => {
        assert.equal("X", this.viewmodel.name());
        return done();
      });
    });
  });

  describe("toggle", function() {
    beforeEach(function() {
      const bindObject =
        {toggle: 'off'};
      return this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    return it("flips boolean", function(done) {
      this.element.trigger('click');
      return delay(() => {
        assert.equal(true, this.viewmodel.off());
        return done();
      });
    });
  });

  describe("if", function() {
    beforeEach(function() {
      const bindObject =
        {if: 'on'};
      return this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    it("hides element when true", function(done) {
      return delay(() => {
        assert.equal("inline-block", this.element.inlineStyle("display"));
        return done();
      });
    });

    return it("hides element when false", function(done) {
      this.viewmodel.on(false);
      return delay(() => {
        assert.equal("none", this.element.inlineStyle("display"));
        return done();
      });
    });
  });

  describe("visible", function() {
    beforeEach(function() {
      const bindObject =
        {visible: 'on'};
      return this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    it("hides element when true", function(done) {
      return delay(() => {
        assert.equal("inline-block", this.element.inlineStyle("display"));
        return done();
      });
    });

    return it("hides element when false", function(done) {
      this.viewmodel.on(false);
      return delay(() => {
        assert.equal("none", this.element.inlineStyle("display"));
        return done();
      });
    });
  });

  describe("unless", function() {
    beforeEach(function() {
      const bindObject =
        {unless: 'off'};
      return this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    it("hides element when true", function(done) {
      return delay(() => {
        assert.equal("inline-block", this.element.inlineStyle("display"));
        return done();
      });
    });

    return it("hides element when false", function(done) {
      this.viewmodel.off(true);
      return delay(() => {
        assert.equal("none", this.element.inlineStyle("display"));
        return done();
      });
    });
  });

  describe("hide", function() {
    beforeEach(function() {
      const bindObject =
        {hide: 'off'};
      return this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    it("hides element when true", function(done) {
      return delay(() => {
        assert.equal("inline-block", this.element.inlineStyle("display"));
        return done();
      });
    });

    return it("hides element when false", function(done) {
      this.viewmodel.off(true);
      return delay(() => {
        assert.equal("none", this.element.inlineStyle("display"));
        return done();
      });
    });
  });

  describe("text", function() {
    beforeEach(function() {
      const bindObject =
        {text: 'name'};
      return this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    return it("sets from vm", function(done) {
      this.viewmodel.name('X');
      return delay(() => {
        assert.equal("X", this.element.text());
        return done();
      });
    });
  });

  describe("html", function() {
    beforeEach(function() {
      const bindObject =
        {html: 'name'};
      return this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    return it("sets from vm", function(done) {
      this.viewmodel.name('X');
      return delay(() => {
        assert.equal("X", this.element.html());
        return done();
      });
    });
  });

  describe("change", function() {

    it("uses default without other bindings", function(done) {
      const bindObject =
        {change: 'name'};
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
      this.element.trigger('change');
      return delay(() => {
        assert.isTrue(this.viewmodel.name() instanceof jQuery.Event);
        return done();
      });
    });

    return it("uses other bindings", function(done) {
      const bindObject = {
        value: 'name',
        change: 'on'
      };
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
      this.element.trigger('change');
      return delay(() => {
        assert.isFalse(this.viewmodel.name() instanceof jQuery.Event);
        return done();
      });
    });
  });

  describe("enter", function() {
    beforeEach(function() {
      const bindObject =
        {enter: "changeName('X')"};
      return this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    it("uses e.which", function(done) {
      const e = jQuery.Event("keyup");
      e.which = 13;
      this.element.trigger(e);
      return delay(() => {
        assert.equal('X', this.viewmodel.name());
        return done();
      });
    });

    it("uses e.keyCode", function(done) {
      const e = jQuery.Event("keyup");
      e.keyCode = 13;
      this.element.trigger(e);
      return delay(() => {
        assert.equal('X', this.viewmodel.name());
        return done();
      });
    });

    return it("doesn't do anything without key", function(done) {
      const e = jQuery.Event("keyup");
      this.element.trigger(e);
      return delay(() => {
        assert.equal('', this.viewmodel.name());
        return done();
      });
    });
  });

  describe("attr", function() {
    beforeEach(function() {
      const bindObject = {
        attr: {
          title: 'name',
          viewBox: 'on'
        }
      };
      return this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    return it("sets from vm", function(done) {
      this.viewmodel.name('X');
      this.viewmodel.on('Y');
      this.viewmodel.viewBox;
      return delay(() => {
        assert.equal('X', this.element.attr('title'));
        assert.equal('Y', this.element[0].getAttribute('viewBox'));
        return done();
      });
    });
  });



  describe("addAttributeBinding", function() {
    it("sets from array", function(done) {
      ViewModel.addAttributeBinding( ['href'] );
      const bindObject =
        {href: 'on'};
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
      this.viewmodel.on('Y');
      return delay(() => {
        assert.equal('Y', this.element.attr('href'));
        return done();
      });
    });

    return it("sets from string", function(done) {
      ViewModel.addAttributeBinding( 'src' );
      const bindObject =
        {src: 'on'};
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
      this.viewmodel.on('Y');
      return delay(() => {
        assert.equal('Y', this.element.attr('src'));
        return done();
      });
    });
  });


  describe("check", function() {
    beforeEach(function() {
      const bindObject =
        {check: 'on'};
      this.element = $("<input type='checkbox'>");
      return this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    it("has default value", function(done) {
      return delay(() => {
        assert.isTrue(this.element.is(':checked'));
        assert.isTrue(this.viewmodel.on());
        return done();
      });
    });

    it("sets value from vm", function(done) {
      this.viewmodel.on(false);
      return delay(() => {
        assert.isFalse(this.element.is(':checked'));
        return done();
      });
    });

    return it("sets value from element", function(done) {
      this.element.prop('checked', false);
      this.element.trigger('change');
      return delay(() => {
        assert.isFalse(this.viewmodel.on());
        return done();
      });
    });
  });

  describe("checkbox group", function() {
    beforeEach(function() {
      const bindObject =
        {group: 'array'};
      this.element = $("<input type='checkbox' value='A'>");
      return this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    it("has default value", function(done) {
      return delay(() => {
        assert.equal(0, this.viewmodel.array().length);
        assert.isFalse(this.element.is(':checked'));
        return done();
      });
    });

    it("sets value from vm", function(done) {
      this.viewmodel.array().push('A');
      return delay(() => {
        assert.isTrue(this.element.is(':checked'));
        return done();
      });
    });

    return it("sets value from element", function(done) {
      this.element.prop('checked', true);
      this.element.trigger('change');
      return delay(() => {
        assert.equal(1, this.viewmodel.array().length);
        return done();
      });
    });
  });

  describe("radio group", function() {
    beforeEach(function() {
      const bindObject =
        {group: 'name'};
      this.element = $("<input type='radio' value='A' name='B'>");
      return this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    it("has default value", function(done) {
      return delay(() => {
        assert.equal('', this.viewmodel.name());
        assert.isFalse(this.element.is(':checked'));
        return done();
      });
    });

    it("sets value from vm", function(done) {
      this.viewmodel.name('A');
      return delay(() => {
        assert.isTrue(this.element.is(':checked'));
        return done();
      });
    });

    return it("sets value from element", function(done) {
      let triggeredChange = false;
      this.templateInstance.$ = () => ({
        each() { return triggeredChange = true; }
      });
      this.element.prop('checked', true);
      this.element.trigger('change');
      return delay(() => {
        assert.equal('A', this.viewmodel.name());
        assert.isTrue(triggeredChange);
        return done();
      });
    });
  });

  return describe("style", function() {
    it("removes the style from string", function(done) {
      const bindObject =
        {style: "styleLabel"};
      this.viewmodel.load({
        styleLabel: { 
          color: "red"
        }
      });
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
      delay(() => {
        assert.equal("red", this.element[0].style.color);
        this.viewmodel.styleLabel({ color: null });
        return delay(() => {
          assert.equal("", this.element[0].style.color);
          return done();
        });
      });
    });

    it("removes the style from object", function(done) {
      const bindObject = {
        style: {
          color: "color"
        }
      };
      this.viewmodel.load({
        color: "red"});
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
      delay(() => {
        assert.equal("red", this.element[0].style.color);
        this.viewmodel.color(null);
        return delay(() => {
          assert.equal("", this.element[0].style.color);
          return done();
        });
      });
    });

    it("element has the style from object", function(done) {
      const bindObject = {
        style: {
          color: "'red'"
        }
      };
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
      delay(() => {
        assert.equal("red", this.element.inlineStyle("color"));
        return done();
      });
    });

    it("element has the style from string", function(done) {
      const bindObject =
        {style: "styles.label"};
      this.viewmodel.load({
        styles: {
          label: {
            color: 'red'
          }
        }
      });
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
      delay(() => {
        assert.equal("red", this.element.inlineStyle("color"));
        return done();
      });
    });

    it("element has the style from string take 2", function(done) {
      const bindObject =
        {style: "styleLabel"};
      this.viewmodel.load({
        styleLabel: "color: red"});
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
      delay(() => {
        assert.equal("red", this.element.inlineStyle("color"));
        return done();
      });
    });

    it("element has the style with commas", function(done) {
      const bindObject =
        {style: "styleLabel"};
      this.viewmodel.load({
        styleLabel: "color: red, border-color: blue"});
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
      delay(() => {
        assert.equal("red", this.element.inlineStyle("color"));
        assert.equal("blue", this.element.inlineStyle("border-color"));
        return done();
      });
    });

    it("element has the style with semi-colons", function(done) {
      const bindObject =
        {style: "styleLabel"};
      this.viewmodel.load({
        styleLabel: "color: red; border-color: blue;"});
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
      delay(() => {
        assert.equal("red", this.element.inlineStyle("color"));
        assert.equal("blue", this.element.inlineStyle("border-color"));
        return done();
      });
    });

    it("element has the style from array", function(done) {
      const bindObject =
        {style: "[styles.label, styles.button]"};
      this.viewmodel.load({
        styles: {
          label: {
            color: 'red'
          },
          button: {
            height: '10px'
          }
        }
      });
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
      delay(() => {
        assert.equal("red", this.element.inlineStyle("color"));
        assert.equal("10px", this.element.inlineStyle("height"));
        return done();
      });
    });

    return it("removes the style from array", function(done) {
      const bindObject =
        {style: "[styles.label]"};
      this.viewmodel.load({
        styles: {
          label: {
            color: 'red'
          }
        }
      });
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
      delay(() => {
        assert.equal("red", this.element.inlineStyle("color"));
        this.viewmodel.styles({ label: { color: null } });
        return delay(() => {
          assert.equal("", this.element[0].style.color);
          return done();
        });
      });
    });
  });
});