import sinon from 'sinon';
import { assert } from 'chai';

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
    this.templateInstance =
      {autorun: Tracker.autorun};
  });

  describe("input value nested", () => beforeEach(function() {
    const bindObject =
      {value: "formData.position"};
    this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
  }));

  it("gets value", function() {
    assert.equal("X", this.viewmodel.formData().position);
  });

  it("sets value from vm", function(done) {
    this.viewmodel.formData({ position: "Y" });
    delay(() => {
      assert.equal("Y", this.viewmodel.formData().position);
      done();
    });
  });
});

describe("bindings", function() {

  beforeEach(function() {
    this.viewmodel = new ViewModel({
      name: '',
      changeName(v) { this.name(v); },
      on: true,
      off: false,
      array: []});
    this.element = $("<button></button>");
    this.templateInstance =
      {autorun: Tracker.autorun};
  });

  describe("input value", function() {
    beforeEach(function() {
      const bindObject =
        {value: 'name'};
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });


    it("sets value from vm", function(done) {
      this.viewmodel.name('X');
      delay(() => {
        assert.equal("X", this.element.val());
        done();
      });
    });

    it("sets value from element", function(done) {
      this.element.val('X');
      this.element.trigger('input');
      delay(() => {
        assert.equal("X", this.viewmodel.name());
        done();
      });
    });

    it("can handle undefined triggered by element", function(done) {
      this.viewmodel.name(undefined);
      delay(() => {
        this.element.val('X');
        this.element.trigger('input');
        delay(() => {
          assert.equal("X", this.viewmodel.name());
          done();
        });
      });
    });

    it("can handle null triggered by element", function(done) {
      this.viewmodel.name(null);
      delay(() => {
        this.element.val('X');
        this.element.trigger('input');
        delay(() => {
          assert.equal("X", this.viewmodel.name());
          done();
        });
      });
    });

    it("can handle undefined", function(done) {
      this.element.val('X');
      this.viewmodel.name(undefined);
      delay(() => {
        assert.equal("", this.element.val());
        done();
      });
    });

    it("can handle null", function(done) {
      this.element.val('X');
      this.viewmodel.name(null);
      delay(() => {
        assert.equal("", this.element.val());
        done();
      });
    });

    it("sets value from element (change event)", function(done) {
      this.element.val('X');
      this.element.trigger('change');
      delay(() => {
        assert.equal("X", this.viewmodel.name());
        done();
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
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings, 99, {});});

    afterEach(function() {
      this.clock.restore();
    });

    it("delays value from element", function() {
      this.element.val('X');
      this.element.trigger('input');
      this.clock.tick(1);
      assert.equal('', this.viewmodel.name());
      this.clock.tick(12);
      assert.equal('X', this.viewmodel.name());
    });

    it("throttles the value", function() {
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
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    it("triggers event", function(done) {
      this.element.trigger('click');
      delay(() => {
        assert.equal("X", this.viewmodel.name());
        done();
      });
    });
  });

  describe("toggle", function() {
    beforeEach(function() {
      const bindObject =
        {toggle: 'off'};
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    it("flips boolean", function(done) {
      this.element.trigger('click');
      delay(() => {
        assert.equal(true, this.viewmodel.off());
        done();
      });
    });
  });

  describe("if", function() {
    beforeEach(function() {
      const bindObject =
        {if: 'on'};
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    it("does not hide element when true", function(done) {
      delay(() => {
        assert.equal("", this.element.inlineStyle("display"));
        // Fixing Manuel's tests: There is no inline style "display" when true
        // assert.equal("inline-block", this.element.inlineStyle("display"));
        done();
      });
    });

    it("hides element when false", function(done) {
      this.viewmodel.on(false);
      delay(() => {
        assert.equal("none", this.element.inlineStyle("display"));
        done();
      });
    });
  });

  describe("visible", function() {
    beforeEach(function() {
      const bindObject =
        {visible: 'on'};
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    it("does not hide element when true", function(done) {
      delay(() => {
        assert.equal("", this.element.inlineStyle("display"));
        // Fixing Manuel's tests: There is no inline style "display" when true
        // assert.equal("inline-block", this.element.inlineStyle("display"));
        done();
      });
    });

    it("hides element when false", function(done) {
      this.viewmodel.on(false);
      delay(() => {
        assert.equal("none", this.element.inlineStyle("display"));
        done();
      });
    });
  });

  describe("unless", function() {
    beforeEach(function() {
      const bindObject =
        {unless: 'off'};
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    it("does not hide element when true", function(done) {
      delay(() => {
        assert.equal("", this.element.inlineStyle("display"));
        // Fixing Manuel's tests: There is no inline style "display" when true
        // assert.equal("inline-block", this.element.inlineStyle("display"));
        done();
      });
    });

    it("hides element when false", function(done) {
      this.viewmodel.off(true);
      delay(() => {
        assert.equal("none", this.element.inlineStyle("display"));
        done();
      });
    });
  });

  describe("hide", function() {
    beforeEach(function() {
      const bindObject =
        {hide: 'off'};
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    it("does not hide element when true", function(done) {
      delay(() => {
        assert.equal("", this.element.inlineStyle("display"));
        // Fixing Manuel's tests: There is no inline style "display" when true
        // assert.equal("inline-block", this.element.inlineStyle("display"));
        done();
      });
    });

    it("hides element when false", function(done) {
      this.viewmodel.off(true);
      delay(() => {
        assert.equal("none", this.element.inlineStyle("display"));
        done();
      });
    });
  });

  describe("text", function() {
    beforeEach(function() {
      const bindObject =
        {text: 'name'};
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    it("sets from vm", function(done) {
      this.viewmodel.name('X');
      delay(() => {
        assert.equal("X", this.element.text());
        done();
      });
    });
  });

  describe("html", function() {
    beforeEach(function() {
      const bindObject =
        {html: 'name'};
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    it("sets from vm", function(done) {
      this.viewmodel.name('X');
      delay(() => {
        assert.equal("X", this.element.html());
        done();
      });
    });
  });

  describe("change", function() {

    it("uses default without other bindings", function(done) {
      const bindObject =
        {change: 'name'};
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
      this.element.trigger('change');
      delay(() => {
        assert.isTrue(this.viewmodel.name() instanceof jQuery.Event);
        done();
      });
    });

    it("uses other bindings", function(done) {
      const bindObject = {
        value: 'name',
        change: 'on'
      };
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
      this.element.trigger('change');
      delay(() => {
        assert.isFalse(this.viewmodel.name() instanceof jQuery.Event);
        done();
      });
    });
  });

  describe("enter", function() {
    beforeEach(function() {
      const bindObject =
        {enter: "changeName('X')"};
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    it("uses e.which", function(done) {
      const e = jQuery.Event("keyup");
      e.which = 13;
      this.element.trigger(e);
      delay(() => {
        assert.equal('X', this.viewmodel.name());
        done();
      });
    });

    it("uses e.keyCode", function(done) {
      const e = jQuery.Event("keyup");
      e.keyCode = 13;
      this.element.trigger(e);
      delay(() => {
        assert.equal('X', this.viewmodel.name());
        done();
      });
    });

    it("doesn't do anything without key", function(done) {
      const e = jQuery.Event("keyup");
      this.element.trigger(e);
      delay(() => {
        assert.equal('', this.viewmodel.name());
        done();
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
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    it("sets from vm", function(done) {
      this.viewmodel.name('X');
      this.viewmodel.on('Y');
      this.viewmodel.viewBox;
      delay(() => {
        assert.equal('X', this.element.attr('title'));
        assert.equal('Y', this.element[0].getAttribute('viewBox'));
        done();
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
      delay(() => {
        assert.equal('Y', this.element.attr('href'));
        done();
      });
    });

    it("sets from string", function(done) {
      ViewModel.addAttributeBinding( 'src' );
      const bindObject =
        {src: 'on'};
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
      this.viewmodel.on('Y');
      delay(() => {
        assert.equal('Y', this.element.attr('src'));
        done();
      });
    });
  });


  describe("check", function() {
    beforeEach(function() {
      const bindObject =
        {check: 'on'};
      this.element = $("<input type='checkbox'>");
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    it("has default value", function(done) {
      delay(() => {
        assert.isTrue(this.element.is(':checked'));
        assert.isTrue(this.viewmodel.on());
        done();
      });
    });

    it("sets value from vm", function(done) {
      this.viewmodel.on(false);
      delay(() => {
        assert.isFalse(this.element.is(':checked'));
        done();
      });
    });

    it("sets value from element", function(done) {
      this.element.prop('checked', false);
      this.element.trigger('change');
      delay(() => {
        assert.isFalse(this.viewmodel.on());
        done();
      });
    });
  });

  describe("checkbox group", function() {
    beforeEach(function() {
      const bindObject =
        {group: 'array'};
      this.element = $("<input type='checkbox' value='A'>");
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    it("has default value", function(done) {
      delay(() => {
        assert.equal(0, this.viewmodel.array().length);
        assert.isFalse(this.element.is(':checked'));
        done();
      });
    });

    it("sets value from vm", function(done) {
      this.viewmodel.array().push('A');
      delay(() => {
        assert.isTrue(this.element.is(':checked'));
        done();
      });
    });

    it("sets value from element", function(done) {
      this.element.prop('checked', true);
      this.element.trigger('change');
      delay(() => {
        assert.equal(1, this.viewmodel.array().length);
        done();
      });
    });
  });

  describe("radio group", function() {
    beforeEach(function() {
      const bindObject =
        {group: 'name'};
      this.element = $("<input type='radio' value='A' name='B'>");
      this.viewmodel.bind(bindObject, this.templateInstance, this.element, ViewModel.bindings);
    });

    it("has default value", function(done) {
      delay(() => {
        assert.equal('', this.viewmodel.name());
        assert.isFalse(this.element.is(':checked'));
        done();
      });
    });

    it("sets value from vm", function(done) {
      this.viewmodel.name('A');
      delay(() => {
        assert.isTrue(this.element.is(':checked'));
        done();
      });
    });

    it("sets value from element", function(done) {
      let triggeredChange = false;
      this.templateInstance.$ = () => ({
        each() { triggeredChange = true; }
      });
      this.element.prop('checked', true);
      this.element.trigger('change');
      delay(() => {
        assert.equal('A', this.viewmodel.name());
        assert.isTrue(triggeredChange);
        done();
      });
    });
  });

  describe("style", function() {
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
        delay(() => {
          assert.equal("", this.element[0].style.color);
          done();
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
        delay(() => {
          assert.equal("", this.element[0].style.color);
          done();
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
        done();
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
        done();
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
        done();
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
        done();
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
        done();
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
        done();
      });
    });

    it("removes the style from array", function(done) {
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
        delay(() => {
          assert.equal("", this.element[0].style.color);
          done();
        });
      });
    });
  });
});