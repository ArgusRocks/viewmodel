import sinon from 'sinon';
import { assert } from 'chai';

// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
describe("ViewModel", function() {

  beforeEach(function() {
    this.checkStub = sinon.stub(ViewModel, "check");
    this.delay = ViewModel.delay;
    ViewModel.delay = (t, f) => f();
  });

  afterEach(function() {
    sinon.restoreAll();
    ViewModel.delay = this.delay;
  });

  describe("@nextId", () => it("increments the numbers", function() {
    const a = ViewModel.nextId();
    const b = ViewModel.nextId();
    assert.equal(b, a + 1);
  }));

  describe("@reserved", () => it("has reserved words", () => assert.ok(ViewModel.reserved.vmId)));

  describe("@onDestroyed", function() {

    it("returns a function", () => assert.isFunction(ViewModel.onDestroyed()));

    describe("return function", function() {
      beforeEach(function() {
        this.viewmodel = {
          vmId: 1,
          vmOnDestroyed: [],
          templateInstance: {
            view: {
              name: 'Template.A'
            }
          },
          parent() { return undefined; }
        };
        return this.instance = {
          autorun(f) { return f(); },
          viewmodel: this.viewmodel
        };
      });

      it("removes the view model from ViewModel.byId", function() {
        ViewModel.byId = {};
        ViewModel.add(this.viewmodel);
        ViewModel.onDestroyed().call(this.instance);
        assert.isUndefined(ViewModel.byId[1]);
    });

      it("removes the view model from ViewModel.byTemplate", function() {
        ViewModel.byTemplate = {};
        ViewModel.add(this.viewmodel);
        assert.ok(ViewModel.byTemplate['A'][1]);
        ViewModel.onDestroyed().call(this.instance);
        assert.isUndefined(ViewModel.byTemplate['A'][1]);
    });

      it("calls viewmodel.onDestroyed", function() {
        let ran = false;
        this.instance.viewmodel = new ViewModel({
          onDestroyed() { ran = true; }});

        this.instance.viewmodel.templateInstance = {
          view: {
            name: 'Template.A'
          }
        };

        ViewModel.onDestroyed({}).call(this.instance);
        assert.isTrue(ran);
      });
    });
  });

  describe("@onRendered", function() {

    it("returns a function", () => assert.isFunction(ViewModel.onRendered()));

    describe("return function", function() {
      let {
        afterFlush
      } = Tracker;
      beforeEach(function() {
        this.viewmodel = new ViewModel();
        this.viewmodel.vmInitial = {};
        this.instance = {
          autorun(f) { return f(); },
          viewmodel: this.viewmodel
        };
        ({
          afterFlush
        } = Tracker);
        return Tracker.afterFlush = f => f();
      });

      afterEach(() => Tracker.afterFlush = afterFlush);

      it("checks the arguments", function() {
        this.viewmodel.vmInitial.autorun = "X";
        ViewModel.onRendered().call(this.instance);
        assert.isTrue(this.checkStub.calledWithExactly('@onRendered', "X", this.instance));
      });

      it("sets autorun for single function", function() {
        let ran = false;
        this.viewmodel.vmAutorun.push(() => ran = true);
        ViewModel.onRendered().call(this.instance);
        assert.isTrue(ran);
      });

      it("calls viewmodel.onRendered", function() {
        let ran = false;
        this.viewmodel.vmOnRendered.push(() => ran = true);
        ViewModel.onRendered().call(this.instance);
        assert.isTrue(ran);
      });
    });
  });



  describe("@onCreated", function() {

    it("returns a function", () => assert.isFunction(ViewModel.onCreated()));

    describe("return function", function() {

      beforeEach(function() {

        this.helper = null;
        this.template = {
          createViewModel() {
            const vm = new ViewModel();
            vm.vmId = 1;
            vm.id = function() {};
            return vm;
          },
          helpers: obj => { return this.helper = obj; }
        };

        this.assignChildStub = sinon.stub(ViewModel, 'assignChild');
        this.retFun = ViewModel.onCreated(this.template);
        this.helpersSpy = sinon.spy(this.template, 'helpers');
        this.currentDataStub = sinon.stub(Template , 'currentData');
        this.afterFlushStub = sinon.stub(Tracker, 'afterFlush');
        this.instance = {
          data: "A",
          autorun(f) { return f( { firstRun: true }); },
          view: {
            name: 'body'
          }
        };
      });

      it("sets the viewmodel property on the template instance", function() {
        this.retFun.call(this.instance);
        assert.isTrue(this.instance.viewmodel instanceof ViewModel);
      });

      it("adds the viewmodel to ViewModel.byId", function() {
        ViewModel.byId = {};
        this.retFun.call(this.instance);
        assert.equal(this.instance.viewmodel, ViewModel.byId[this.instance.viewmodel.vmId]);
    });

      it("adds the viewmodel to ViewModel.byTemplate", function() {
        ViewModel.byTemplate = {};
        this.retFun.call(this.instance);
        assert.equal(this.instance.viewmodel, ViewModel.byTemplate['body'][this.instance.viewmodel.vmId]);
    });

      it("adds templateInstance to the view model", function() {
        this.retFun.call(this.instance);
        assert.equal(this.instance.viewmodel.templateInstance, this.instance);
      });

      it("adds view model properties as helpers", function() {
        this.retFun.call(this.instance);
        assert.ok(this.helper.id);
      });

      it("doesn't add reserved words as helpers", function() {
        this.retFun.call(this.instance);
        assert.notOk(this.helper.vmId);
      });

      it("extends the view model with the data context", function() {
        const cache = Tracker.afterFlush;
        Tracker.afterFlush = f => f();
        this.instance.data =
          {name: 'Alan'};
        this.currentDataStub.returns(this.instance.data);
        this.retFun.call(this.instance);
        Tracker.afterFlush = cache;
        assert.equal('Alan', this.instance.viewmodel.name());
      });

      it("assigns viewmodel as child of the parent", function() {
        const cache = Tracker.afterFlush;
        Tracker.afterFlush = f => f();
        this.retFun.call(this.instance);
        Tracker.afterFlush = cache;
        assert.isTrue(this.assignChildStub.calledWithExactly(this.instance.viewmodel));
      });
    });
  });



  describe("@bindIdAttribute", () => it("has has default value", () => assert.equal("b-id", ViewModel.bindIdAttribute)));

  describe("@eventHelper", function() {
    beforeEach(function() {
      this.nextIdStub = sinon.stub(ViewModel, 'nextId');
      this.nextIdStub.returns(99);
      this.onViewReadyFunction = null;
      Blaze.currentView =
        {onViewReady: f => { return this.onViewReadyFunction = f; }};
    });

    it("returns object with the next bind id", function() {
      const instanceStub = sinon.stub(Template, 'instance');
      const templateInstance = {
        viewmodel: {},
        '$'() { return "X"; }
      };
      instanceStub.returns(templateInstance);
      const ret = ViewModel.eventHelper();
      assert.equal(ret[ViewModel.bindIdAttribute + '-e'], 99);
    });
  });

  describe("@bindHelper", function() {
    beforeEach(function() {
      this.nextIdStub = sinon.stub(ViewModel, 'nextId');
      this.nextIdStub.returns(99);
      this.onViewReadyFunction = null;
      Blaze.currentView = {
        onViewReady: f => { return this.onViewReadyFunction = f; },
        _templateInstance: {
          '$'() { return 'X'; }
        }
      };
    });

    it("returns object with the next bind id", function() {
      const instanceStub = sinon.stub(Template, 'instance');
      const templateInstance = {
        viewmodel: {},
        '$'() { return "X"; }
      };
      instanceStub.returns(templateInstance);
      const ret = ViewModel.bindHelper();
      assert.equal(ret[ViewModel.bindIdAttribute], 99);
    });

    it("adds the binding to ViewModel.bindObjects", function() {
      const viewmodel = new ViewModel();
      const instanceStub = sinon.stub(Template, 'instance');
      const parseBindStub = sinon.stub(ViewModel, 'parseBind');
      const bindObject =
        {text: 'name'};
      parseBindStub.returns(bindObject);
      const templateInstance = {
        viewmodel,
        '$'() { return "X"; }
      };
      instanceStub.returns(templateInstance);
      ViewModel.bindHelper("text: name");
      assert.equal(ViewModel.bindObjects[99], bindObject);
    });

    it("adds a view model if the template doesn't have one", function() {
      const addEmptyViewModelStub = sinon.stub(ViewModel, 'addEmptyViewModel');
      const instanceStub = sinon.stub(Template, 'instance');
      const templateInstance =
        {'$'() { return "X"; }};
      instanceStub.returns(templateInstance);
      ViewModel.bindHelper("text: name");
      assert.isTrue(addEmptyViewModelStub.calledWith(templateInstance));
    });
  });

  describe("@getInitialObject", function() {
    it("returns initial when initial is an object", function() {
      const initial = {};
      const context = "X";
      const ret = ViewModel.getInitialObject(initial, context);
      assert.equal(initial, ret);
    });

    it("returns the result of the function when initial is a function", function() {
      const initial = context => context + 1;
      const context = 1;
      const ret = ViewModel.getInitialObject(initial, context);
      assert.equal(2, ret);
    });
  });

  describe("@makeReactiveProperty", function() {
    it("returns a function", () => assert.isFunction(ViewModel.makeReactiveProperty("X")));
    it("sets default value", function() {
      const actual = ViewModel.makeReactiveProperty("X");
      assert.equal("X", actual());
    });
    it("sets and gets values", function() {
      const actual = ViewModel.makeReactiveProperty("X");
      actual("Y");
      assert.equal("Y", actual());
    });
    it("resets the value", function() {
      const actual = ViewModel.makeReactiveProperty("X");
      actual("Y");
      actual.reset();
      assert.equal("X", actual());
    });
    it("has depend and changed", function() {
      const actual = ViewModel.makeReactiveProperty("X");
      assert.isFunction(actual.depend);
      assert.isFunction(actual.changed);
    });
    it("reactifies arrays", function() {
      const actual = ViewModel.makeReactiveProperty([]);
      assert.ok(actual().depend);
      assert.isTrue(actual() instanceof Array);
    });

    it("resets arrays", function() {
      const actual = ViewModel.makeReactiveProperty([1]);
      actual().push(2);
      assert.equal(2, actual().length);
      actual.reset();
      assert.equal(1, actual().length);
      assert.equal(1, actual()[0]);
  });

    describe("delay", function() {
      beforeEach(function() {
        this.clock = sinon.useFakeTimers();
        ViewModel.delay = this.delay;
      });
      afterEach(function() {
        this.clock.restore();
        this.delay = ViewModel.delay;
      });

      it("delays values", function() {
        const actual = ViewModel.makeReactiveProperty("X");
        actual.delay = 10;
        actual("Y");
        this.clock.tick(8);
        assert.equal("X", actual());
        this.clock.tick(4);
        assert.equal("Y", actual());
      });
    });

    describe("validations", function() {
      it("returns a function", () => assert.isFunction(ViewModel.makeReactiveProperty(ViewModel.property.string)));
      it("sets default value", function() {
        const actual = ViewModel.makeReactiveProperty(ViewModel.property.string.default("X"));
        assert.equal("X", actual());
      });
      it("sets and gets values", function() {
        const actual = ViewModel.makeReactiveProperty(ViewModel.property.string.default("X"));
        actual("Y");
        assert.equal("Y", actual());
      });
      it("resets the value", function() {
        const actual = ViewModel.makeReactiveProperty(ViewModel.property.string.default("X"));
        actual("Y");
        actual.reset();
        assert.equal("X", actual());
      });

      it("reactifies arrays", function() {
        const actual = ViewModel.makeReactiveProperty(ViewModel.property.array);
        assert.ok(actual().depend);
        assert.isTrue(actual() instanceof Array);
      });

      it("resets arrays", function() {
        const actual = ViewModel.makeReactiveProperty(ViewModel.property.array.default([1]));
        actual().push(2);
        assert.equal(2, actual().length);
        actual.reset();
        assert.equal(1, actual().length);
        assert.equal(1, actual()[0]);
    });
  });
});

  describe("@addBinding", function() {

    let last = 1;
    const getBindingName = () => "test" + last++;

    it("checks the arguments", function() {
      ViewModel.addBinding("X");
      assert.isTrue(this.checkStub.calledWithExactly('@addBinding', "X"));
    });

    it("returns nothing", function() {
      const ret = ViewModel.addBinding("X");
      assert.isUndefined(ret);
    });

    it("adds the binding to @bindings", function() {
      const name = getBindingName();
      ViewModel.addBinding({
        name,
        bind() { return "X"; }
      });
      assert.equal(1, ViewModel.bindings[name].length);
      assert.equal("X", ViewModel.bindings[name][0].bind());
    });

    it("adds the binding to @bindings array", function() {
      const name = getBindingName();
      ViewModel.addBinding({
        name,
        bind() { return "X"; }
      });
      ViewModel.addBinding({
        name,
        bind() { return "Y"; }
      });
      assert.equal(2, ViewModel.bindings[name].length);
      assert.equal("X", ViewModel.bindings[name][0].bind());
      assert.equal("Y", ViewModel.bindings[name][1].bind());
    });

    it("adds default priority 1 to the binding", function() {
      const name = getBindingName();
      ViewModel.addBinding({
        name});
      assert.equal(1, ViewModel.bindings[name][0].priority);
    });

    it("adds priority 10 to the binding", function() {
      const name = getBindingName();
      ViewModel.addBinding({
        name,
        priority: 10
      });
      assert.equal(10, ViewModel.bindings[name][0].priority);
    });

    it("adds priority 2 with a selector", function() {
      const name = getBindingName();
      ViewModel.addBinding({
        name,
        selector: 'A'
      });
      assert.equal(2, ViewModel.bindings[name][0].priority);
    });

    it("adds priority 2 with a bindIf", function() {
      const name = getBindingName();
      ViewModel.addBinding({
        name,
        bindIf() {}
      });
      assert.equal(2, ViewModel.bindings[name][0].priority);
    });

    it("adds priority 3 with a selector and bindIf", function() {
      const name = getBindingName();
      ViewModel.addBinding({
        name,
        selector: 'A',
        bindIf() {}
      });
      assert.equal(3, ViewModel.bindings[name][0].priority);
    });
  });


  describe("@bindSingle", function() {

    beforeEach(function() {
      this.getBindArgumentStub = sinon.stub(ViewModel, 'getBindArgument');
      return this.getBindingStub = sinon.stub(ViewModel, 'getBinding');
    });

    it("returns undefined", function() {
      this.getBindingStub.returns({
        events: { a: 1 }});
      const element =
        {bind() {}};
      const ret = ViewModel.bindSingle(null, element);
      assert.isUndefined(ret);
    });

    it("uses getBindArgument", function() {

      ViewModel.bindSingle('templateInstance', 'element', 'bindName', 'bindValue', 'bindObject', 'viewmodel', 'bindingArray', 'bindId', 'view');
      assert.isTrue(this.getBindArgumentStub.calledWithExactly('templateInstance', 'element', 'bindName', 'bindValue', 'bindObject', 'viewmodel', 'bindId', 'view'));
    });

    it("uses getBinding", function() {
      const bindArg = {};
      this.getBindArgumentStub.returns(bindArg);
      ViewModel.bindSingle('templateInstance', 'element', 'bindName', 'bindValue', 'bindObject', 'viewmodel', 'bindingArray');
      assert.isTrue(this.getBindingStub.calledWithExactly('bindName', bindArg, 'bindingArray'));
    });

    it("executes autorun", function() {
      const bindArg =
        {autorun() {}};
      this.getBindArgumentStub.returns(bindArg);
      const spy = sinon.spy(bindArg, 'autorun');
      const bindingAutorun = function() {};
      this.getBindingStub.returns({
        autorun: bindingAutorun});

      ViewModel.bindSingle();
      assert.isTrue(spy.calledWithExactly(bindingAutorun));
    });

    it("executes bind", function() {
      this.getBindArgumentStub.returns('X');
      const arg =
        {bind() {}};
      const spy = sinon.spy(arg, 'bind');
      this.getBindingStub.returns(arg);

      ViewModel.bindSingle();
      assert.isTrue(spy.calledWithExactly('X'));
    });

    it("binds events", function() {
      this.getBindingStub.returns({
        events: { a: 1, b: 2 }});
      const element =
        {bind() {}};
      const spy = sinon.spy(element, 'bind');
      ViewModel.bindSingle(null, element);
      assert.isTrue(spy.calledTwice);
      assert.isTrue(spy.calledWith('a'));
      assert.isTrue(spy.calledWith('b'));
    });
  });

  describe("@getBinding", function() {

    it("returns default binding if can't find one", function() {
      const bindName = 'default';
      const defaultB =
        {name: bindName};
      const bindings = {};
      bindings[bindName] = [defaultB];

      const ret = ViewModel.getBinding('bindName', 'bindArg', bindings);
      assert.equal(ret, defaultB);
    });

    it("returns first binding in one element array", function() {
      const bindName = 'one';
      const oneBinding =
        {name: bindName};
      const bindings = {};
      bindings[bindName] = [oneBinding];

      const ret = ViewModel.getBinding(bindName, 'bindArg', bindings);
      assert.equal(ret, oneBinding);
    });

    it("returns default binding if can't find one that passes bindIf", function() {
      const bindName = 'default';
      const defaultB =
        {name: bindName};
      const bindings = {};
      bindings[bindName] = [defaultB];
      const oneBinding = {
        name: 'none',
        bindIf() { return false; }
      };
      bindings['none'] = [oneBinding];

      const ret = ViewModel.getBinding('none', 'bindArg', bindings);
      assert.equal(ret, defaultB);
    });

    it("returns highest priority binding", function() {
      const oneBinding = {
        name: 'X',
        priority: 1
      };
      const twoBinding = {
        name: 'X',
        priority: 2
      };
      const bindings =
        {X: [oneBinding, twoBinding]};

      const ret = ViewModel.getBinding('X', 'bindArg', bindings);
      assert.equal(ret, twoBinding);
    });

    it("returns first that passes bindIf", function() {
      const oneBinding = {
        name: 'X',
        priority: 1,
        bindIf() { return false; }
      };
      const twoBinding = {
        name: 'X',
        priority: 1,
        bindIf() { return true; }
      };
      const bindings =
        {X: [oneBinding, twoBinding]};

      const ret = ViewModel.getBinding('X', 'bindArg', bindings);
      assert.equal(ret, twoBinding);
    });

    it("returns first that passes selector", function() {
      const oneBinding = {
        name: 'X',
        priority: 1,
        selector: "A"
      };
      const twoBinding = {
        name: 'X',
        priority: 1,
        selector: "B"
      };
      const bindings =
        {X: [oneBinding, twoBinding]};

      const bindArg = {
        element: {
          is(s) { return s === "B"; }
        }
      };
      const ret = ViewModel.getBinding('X', bindArg, bindings);
      assert.equal(ret, twoBinding);
    });

    it("returns first that passes bindIf and selector", function() {
      const oneBinding = {
        name: 'X',
        priority: 1,
        selector: "B",
        bindIf() { return false; }
      };
      const twoBinding = {
        name: 'X',
        priority: 1,
        selector: "B",
        bindIf() { return true; }
      };
      const bindings =
        {X: [oneBinding, twoBinding]};

      const bindArg = {
        element: {
          is(s) { return s === "B"; }
        }
      };
      const ret = ViewModel.getBinding('X', bindArg, bindings);
      assert.equal(ret, twoBinding);
    });

    it("returns first that passes bindIf and selector with highest priority", function() {
      const oneBinding = {
        name: 'X',
        priority: 1,
        selector: "B",
        bindIf() { return true; }
      };
      const twoBinding = {
        name: 'X',
        priority: 2,
        selector: "B",
        bindIf() { return true; }
      };
      const bindings =
        {X: [oneBinding, twoBinding]};

      const bindArg = {
        element: {
          is(s) { return s === "B"; }
        }
      };
      const ret = ViewModel.getBinding('X', bindArg, bindings);
      assert.equal(ret, twoBinding);
    });
  });

  describe("@getBindArgument", function() {

    beforeEach(function() {
      this.getVmValueGetterStub = sinon.stub(ViewModel, 'getVmValueGetter');
      this.getVmValueSetterStub = sinon.stub(ViewModel, 'getVmValueSetter');
    });

    it("returns right object", function() {
      let ret = ViewModel.getBindArgument('templateInstance', 'element', 'bindName', 'bindValue', 'bindObject', 'viewmodel');
      ret = _.omit(ret, 'autorun', 'getVmValue', 'setVmValue');
      const expected = {
        templateInstance: 'templateInstance',
        element: 'element',
        elementBind: 'bindObject',
        bindName: 'bindName',
        bindValue: 'bindValue',
        viewmodel: 'viewmodel'
      };
      assert.isTrue(_.isEqual(expected, ret));
    });

    it("returns argument with autorun", function() {
      const templateInstance =
        {autorun() {}};
      const spy = sinon.spy(templateInstance, 'autorun');
      const bindArg = ViewModel.getBindArgument(templateInstance, 'element', 'bindName', 'bindValue', 'bindObject', 'viewmodel');
      bindArg.autorun(function() {});
      assert.isTrue(spy.calledOnce);
    });

    it("returns argument with vmValueGetter", function() {
      this.getVmValueGetterStub.returns(() => "A");
      const bindArg = ViewModel.getBindArgument('templateInstance', 'element', 'bindName', 'bindValue', 'bindObject', 'viewmodel');
      assert.equal("A", bindArg.getVmValue());
    });

    it("returns argument with vmValueSetter", function() {
      this.getVmValueSetterStub.returns(() => "A");
      const bindArg = ViewModel.getBindArgument('templateInstance', 'element', 'bindName', 'bindValue', 'bindObject', 'viewmodel');
      assert.equal("A", bindArg.setVmValue());
    });
  });

  describe("@getVmValueGetter", function() {

    it("returns value from 1 + 'A'", function() {
      const viewmodel = {};
      const bindValue = ViewModel.parseBind("x: 1 + 'A'").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal("1A", getVmValue());
    });

    it("returns value from name", function() {
      const viewmodel =
        {name() { return "A"; }};
      const bindValue = 'name';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal("A", getVmValue());
    });

    it("returns short circuits false && true", function() {
      let called = false;
      const viewmodel = {
        a() { return false; },
        b() {
          called = true;
          return true;
        }
      };
      const bindValue = "a && b";
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal(false, getVmValue());
      assert.equal(false, called);
    });

    it("returns short circuits true || false", function() {
      let called = false;
      const viewmodel = {
        a() { return true; },
        b() {
          called = true;
          return true;
        }
      };
      const bindValue = "a || b";
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal(true, getVmValue());
      assert.equal(false, called);
    });

    it("returns value from call(1, -2)", function() {
      const viewmodel =
        {call(a, b) { return b; }};
      const bindValue = "call(1, -2)";
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal(-2, getVmValue());
    });

    it("returns value from call(1 - 2)", function() {
      const viewmodel =
        {call(a) { return a; }};
      const bindValue = "call(1 - 2)";
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal(-1, getVmValue());
    });

    it("returns value from call(1, 1 - 2)", function() {
      const viewmodel =
        {call(a, b) { return b; }};
      const bindValue = "call(1, 1 - 2)";
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal(-1, getVmValue());
    });

    it("returns value from name(address.zip)", function() {
      const viewmodel = {
        name(val) { return val === 100; },
        address: {
          zip: 100
        }
      };
      const bindValue = 'name(address.zip)';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isTrue(getVmValue());
    });

    it("returns false from !'A'", function() {
      const viewmodel =
        {name() { return "A"; }};
      const bindValue = '!name';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal(false, getVmValue());
    });

    it("returns value from name.first (first is prop)", function() {
      const viewmodel = {
        name() {
          return {first: "A"};
        }
      };
      const bindValue = 'name.first';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal("A", getVmValue());
    });

    it("returns value from name.first (first is func)", function() {
      const viewmodel = {
        name() {
          return {first() { return "A"; }};
        }
      };
      const bindValue = 'name.first';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal("A", getVmValue());
    });

    it("returns value from name()", function() {
      const viewmodel =
        {name() { return "A"; }};
      const bindValue = 'name()';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal("A", getVmValue());
    });

    it("doesn't give arguments to name()", function() {
      const viewmodel =
        {name() { return arguments.length; }};
      const bindValue = 'name()';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal(0, getVmValue());
    });

    it("returns value from name('a')", function() {
      const viewmodel =
        {name(a) { return a; }};
      const bindValue = "name('a')";
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal("a", getVmValue());
    });

    it("returns value from name('a', 1)", function() {
      const viewmodel =
        {name(a, b) { return a + b; }};
      const bindValue = "name('a', 1)";
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal("a1", getVmValue());
    });

    it("returns value from name(first) with string", function() {
      const viewmodel = {
        name(v) { return v; },
        first() { return "A"; }
      };
      const bindValue = 'name(first)';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal("A", getVmValue());
    });

    it("returns value from name(first, second)", function() {
      const viewmodel = {
        name(a, b) { return a + b; },
        first() { return "A"; },
        second() { return "B"; }
      };
      const bindValue = 'name(first, second)';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal("AB", getVmValue());
    });

    it("returns value from name(first, second) with numbers", function() {
      const viewmodel = {
        name(a, b) { return a + b; },
        first() { return 1; },
        second() { return 2; }
      };
      const bindValue = 'name(first, second)';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal(3, getVmValue());
    });

    it("returns value from name(first, second) with booleans", function() {
      const viewmodel = {
        name(a, b) { return a || b; },
        first() { return false; },
        second() { return true; }
      };
      const bindValue = 'name(first, second)';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isTrue(getVmValue());
    });

    it("returns value from name(first) with null", function() {
      const viewmodel = {
        name(a) { return a; },
        first() { return null; }
      };
      const bindValue = 'name(first)';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isNull(getVmValue());
    });

    it("returns value from name(first) with undefined", function() {
      const viewmodel = {
        name(a) { return a; },
        first() { return undefined; }
      };
      const bindValue = 'name(first)';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isUndefined(getVmValue());
    });

    it("returns value from name(1, 2)", function() {
      const viewmodel =
        {name(a, b) { return a + b; }};
      const bindValue = 'name(1, 2)';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal(3, getVmValue());
    });

    it("returns value from name(false, true)", function() {
      const viewmodel =
        {name(a, b) { return a || b; }};
      const bindValue = 'name(false, true)';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isTrue(getVmValue());
    });

    it("returns value from name(null)", function() {
      const viewmodel =
        {name(a) { return a; }};
      const bindValue = 'name(null)';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isNull(getVmValue());
    });

    it("returns value from name(undefined)", function() {
      const viewmodel =
        {name(a) { return a; }};
      const bindValue = 'name(undefined)';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isUndefined(getVmValue());
    });

    it("returns value from name(!first, !second) with booleans", function() {
      const viewmodel = {
        name(a, b) { return a && b; },
        first() { return false; },
        second() { return false; }
      };
      const bindValue = 'name(!first, !second)';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isTrue(getVmValue());
    });

    it("returns value from name().first (first is prop)", function() {
      const viewmodel = {
        name() {
          return {first: "A"};
        }
      };
      const bindValue = 'name.first';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal("A", getVmValue());
    });

    it("returns value from name().first (first is func)", function() {
      const viewmodel = {
        name() {
          return {first() { return "A"; }};
        }
      };
      const bindValue = 'name.first';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal("A", getVmValue());
    });

    it("returns value from name(1).first (first is prop)", function() {
      const viewmodel = {
        name(v) {
          if (v === 1) {
            return {first: "A"};
          }
        }
      };
      const bindValue = 'name(1).first';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal("A", getVmValue());
    });

    it("returns value from name(1)", function() {
      const viewmodel =
        {name(a) { return a; }};
      const bindValue = 'name(1)';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isTrue(1 === getVmValue());
    });

    it("returns value from name().first()", function() {
      const viewmodel = {
        name() {
          return {first() { return "A"; }};
        }
      };
      const bindValue = 'name().first()';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal("A", getVmValue());
    });


    it("returns value from name().first.second", function() {
      const viewmodel = {
        name() {
          return {
            first: {
              second: "A"
            }
          };
        }
      };
      const bindValue = 'name().first.second';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal("A", getVmValue());
    });

    it("returns value from name().first.second()", function() {
      const viewmodel = {
        name() {
          return {
            first: {
              second() { return "A"; }
            }
          };
        }
      };
      const bindValue = 'name().first.second()';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal("A", getVmValue());
    });

    it("returns value from name().first.second()", function() {
      const viewmodel = {
        name() {
          return {
            first: {
              second() { return "A"; }
            }
          };
        }
      };
      const bindValue = 'name().first.second()';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal("A", getVmValue());
    });

    it("returns value from first + second", function() {
      const viewmodel = {
        first: 1,
        second: 2
      };
      const bindValue = ViewModel.parseBind("x: first + second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal(3, getVmValue());
    });

    it("returns value from first + ' - ' + second", function() {
      const viewmodel = {
        first: 1,
        second: 2
      };
      const bindValue = ViewModel.parseBind("x: first + ' - ' + second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal("1 - 2", getVmValue());
    });

    it("returns value from first + second", function() {
      const viewmodel = {
        first: 1,
        second: 2
      };
      const bindValue = ViewModel.parseBind("x: first + second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal(3, getVmValue());
    });

    it("returns value from first - second", function() {
      const viewmodel = {
        first: 3,
        second: 2
      };
      const bindValue = ViewModel.parseBind("x: first - second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal(1, getVmValue());
    });

    it("returns value from first * second", function() {
      const viewmodel = {
        first: 3,
        second: 2
      };
      const bindValue = ViewModel.parseBind("x: first * second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal(6, getVmValue());
    });

    it("returns value from first / second", function() {
      const viewmodel = {
        first: 6,
        second: 2
      };
      const bindValue = ViewModel.parseBind("x: first / second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal(3, getVmValue());
    });

    it("returns value from first && second", function() {
      const viewmodel = {
        first: true,
        second: true
      };
      const bindValue = ViewModel.parseBind("x: first && second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isTrue(getVmValue());
    });

    it("returns value from first || second", function() {
      const viewmodel = {
        first: false,
        second: true
      };
      const bindValue = ViewModel.parseBind("x: first || second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isTrue(getVmValue());
    });

    it("returns value from first == second", function() {
      const viewmodel = {
        first: 1,
        second: '1'
      };
      const bindValue = ViewModel.parseBind("x: first == second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isTrue(getVmValue());
    });

    it("returns value from first === second", function() {
      const viewmodel = {
        first: 1,
        second: 1
      };
      const bindValue = ViewModel.parseBind("x: first === second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isTrue(getVmValue());
    });

    it("returns value from first !== second", function() {
      const viewmodel = {
        first: 1,
        second: 1
      };
      const bindValue = ViewModel.parseBind("x: first !== second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isFalse(getVmValue());
    });

    it("returns value from first !=== second", function() {
      const viewmodel = {
        first: 1,
        second: 1
      };
      const bindValue = ViewModel.parseBind("x: first !=== second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isFalse(getVmValue());
    });

    it("returns value from first > second", function() {
      const viewmodel = {
        first: 1,
        second: 0
      };
      const bindValue = ViewModel.parseBind("x: first > second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isTrue(getVmValue());
    });

    it("returns value from first > second", function() {
      const viewmodel = {
        first: 1,
        second: 1
      };
      const bindValue = ViewModel.parseBind("x: first > second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isFalse(getVmValue());
    });

    it("returns value from first > second", function() {
      const viewmodel = {
        first: 1,
        second: 2
      };
      const bindValue = ViewModel.parseBind("x: first > second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isFalse(getVmValue());
    });

    it("returns value from first >= second", function() {
      const viewmodel = {
        first: 1,
        second: 0
      };
      const bindValue = ViewModel.parseBind("x: first >= second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isTrue(getVmValue());
    });

    it("returns value from first >= second", function() {
      const viewmodel = {
        first: 1,
        second: 1
      };
      const bindValue = ViewModel.parseBind("x: first >= second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isTrue(getVmValue());
    });

    it("returns value from first >= second", function() {
      const viewmodel = {
        first: 1,
        second: 2
      };
      const bindValue = ViewModel.parseBind("x: first >= second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isFalse(getVmValue());
    });

    it("returns value from first < second", function() {
      const viewmodel = {
        first: 1,
        second: 0
      };
      const bindValue = ViewModel.parseBind("x: first < second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isFalse(getVmValue());
    });

    it("returns value from first < second", function() {
      const viewmodel = {
        first: 1,
        second: 1
      };
      const bindValue = ViewModel.parseBind("x: first < second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isFalse(getVmValue());
    });

    it("returns value from first < second", function() {
      const viewmodel = {
        first: 1,
        second: 2
      };
      const bindValue = ViewModel.parseBind("x: first < second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isTrue(getVmValue());
    });

    it("returns value from first <= second", function() {
      const viewmodel = {
        first: 1,
        second: 0
      };
      const bindValue = ViewModel.parseBind("x: first <= second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isFalse(getVmValue());
    });

    it("returns value from first <= second", function() {
      const viewmodel = {
        first: 1,
        second: 1
      };
      const bindValue = ViewModel.parseBind("x: first <= second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isTrue(getVmValue());
    });

    it("returns value from first <= second", function() {
      const viewmodel = {
        first: 1,
        second: 2
      };
      const bindValue = ViewModel.parseBind("x: first <= second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isTrue(getVmValue());
    });

    it("returns value from first(1.1)", function() {
      const viewmodel =
        {first(v) { return v; }};
      const bindValue = 'first(1.1)';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal(1.1, getVmValue());
    });

    it("returns value from first1.second", function() {
      const viewmodel = {
        first1: {
          second: 2
        }
      };
      const bindValue = 'first1.second';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal(2, getVmValue());
    });

    it("returns value from first.1second", function() {
      const viewmodel = {
        first: {
          '1second': 2
        }
      };
      const bindValue = 'first.1second';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal(2, getVmValue());
    });

    it("returns value from first(this)", function() {
      const instance = {
        data: {
          a: 1
        }
      };
      const stub = sinon.stub(Template, 'instance');
      stub.returns(instance);
      const viewmodel =
        {first(ins) { return ins.a === 1; }};
      const bindValue = 'first(this)';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isTrue(getVmValue());
    });

    it("returns value from first(this.a)", function() {
      const instance = {
        data: {
          a: 1
        }
      };
      const stub = sinon.stub(Template, 'instance');
      stub.returns(instance);
      const viewmodel =
        {first(ins) { return ins === 1; }};
      const bindValue = 'first(this.a)';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isTrue(getVmValue());
    });

    it("returns value from parent.first", function() {
      const viewmodel = {
        name() { return 'A'; },
        parent() {
          const val = this.name();
          return {first: val};
        }
      };
      const bindValue = 'parent.first';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal('A', getVmValue());
    });

    it("creates property on view model", function() {
      const viewmodel = new ViewModel();
      const bindValue = 'name';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isUndefined(getVmValue());
      assert.ok(viewmodel.name);
    });

    it("returns quoted string", function() {
      const viewmodel = {};
      const bindValue = '"Hi"';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal('Hi', getVmValue());
    });

    it("returns single quoted string", function() {
      const viewmodel = {};
      const bindValue = "'Hi'";
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal('Hi', getVmValue());
    });

    it("returns value from parent.first.second", function() {
      const viewmodel = {
        parent: {
          first: {
            second: 'A'
          }
        }
      };
      const bindValue = 'parent.first.second';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal('A', getVmValue());
    });

    it("returns value from parent.first(second)", function() {
      const parent = new ViewModel();
      parent.first = v => v === 'A';
      const viewmodel = new ViewModel();
      viewmodel.second = 'A';
      viewmodel.parent = parent;

      const bindValue = 'parent.first(second)';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isTrue(getVmValue());
    });

    it("returns value from first( second )", function() {
      const viewmodel = new ViewModel();
      viewmodel.load({
        first(v) { return v; },
        second: 'A'
      });
      const bindValue = 'first( second )';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal('A', getVmValue());
    });

    it("returns value from first( second , third )", function() {
      const viewmodel = new ViewModel();
      viewmodel.load({
        first(a, b) { return a + b; },
        second: 'A',
        third: 'B'
      });
      const bindValue = 'first( second , third )';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal('AB', getVmValue());
    });

    it("returns value from !first && second", function() {
      const viewmodel = {
        first: true,
        second: true
      };
      const bindValue = ViewModel.parseBind("x: !first && second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isFalse(getVmValue());
    });

    it("returns value from !first && second _2", function() {
      const viewmodel = {
        first: false,
        second: true
      };
      const bindValue = ViewModel.parseBind("x: !first && second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isTrue(getVmValue());
    });

    it("returns value from !first && second _3", function() {
      const viewmodel = {
        first: false,
        second: false
      };
      const bindValue = ViewModel.parseBind("x: !first && second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isFalse(getVmValue());
    });

    it("returns value from !first || second", function() {
      const viewmodel = {
        first: false,
        second: true
      };
      const bindValue = ViewModel.parseBind("x: !first || second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isTrue(getVmValue());
    });

    it("returns value from !first || second _2", function() {
      const viewmodel = {
        first: true,
        second: false
      };
      const bindValue = ViewModel.parseBind("x: !first || second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isFalse(getVmValue());
    });

    it("returns value from !first || second _3", function() {
      const viewmodel = {
        first: true,
        second: true
      };
      const bindValue = ViewModel.parseBind("x: !first || second").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.isTrue(getVmValue());
    });

    it("returns value from 2**3", function() {
      const viewmodel = {};
      const bindValue = ViewModel.parseBind("x: 2**3").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal(getVmValue(), 8);
    });

    it("returns value from 9%4", function() {
      const viewmodel = {};
      const bindValue = ViewModel.parseBind("x: 9%4").x;
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal(getVmValue(), 1);
    });
  });

  describe("@getVmValueSetter", function() {

    it("sets first && second", function() {
      let firstVal = null;
      let secondVal = null;
      const viewmodel = {
        first(v) { return firstVal = v; },
        second(v) { return secondVal = v; }
      };
      const bindValue = 'first && second';
      const setVmValue = ViewModel.getVmValueSetter(viewmodel, bindValue);
      setVmValue(2);
      assert.equal(2, firstVal);
      assert.equal(2, secondVal);
    });

    it("sets first func", function() {
      let val = null;
      const viewmodel =
        {first(v) { return val = v; }};
      const bindValue = 'first';
      const setVmValue = ViewModel.getVmValueSetter(viewmodel, bindValue);
      setVmValue(2);
      assert.equal(2, val);
    });

    it("sets first(true)", function() {
      let val = null;
      const viewmodel =
        {first(v) { return val = v; }};
      const bindValue = 'first(true)';
      const setVmValue = ViewModel.getVmValueSetter(viewmodel, bindValue);
      setVmValue(2);
      assert.isTrue(val);
    });

    it("sets first(second)", function() {
      let val = null;
      const viewmodel = {
        first(v) { return val = v; },
        second: 2
      };
      const bindValue = 'first(second)';
      const setVmValue = ViewModel.getVmValueSetter(viewmodel, bindValue);
      setVmValue();
      assert.equal(val , 2);
    });

    it("sets first(second) with event", function() {
      let val = null;
      let evt = null;
      const viewmodel = {
        first(v, e) { 
          val = v;
          return evt = e;
        },
        second: 2
      };
      const bindValue = 'first(second)';
      const setVmValue = ViewModel.getVmValueSetter(viewmodel, bindValue);
      setVmValue(3);
      assert.equal(val , 2);
      assert.equal(evt , 3);
    });

    it("works with sub properties", function() {
      const viewmodel = {
        formData: { 
          position: ""
        }
      };
      const bindValue = 'formData.position';
      const getVmValue = ViewModel.getVmValueGetter(viewmodel, bindValue);
      assert.equal(getVmValue() , "");
    });

    it("doesn't do anything if bindValue isn't a string", function() {
      let val = null;
      const viewmodel =
        {first(v) { return val = v; }};
      const setVmValue = ViewModel.getVmValueSetter(viewmodel, {});
      setVmValue(2);
    });

    it("sets first prop", function() {
      const viewmodel =
        {first: 1};
      const bindValue = 'first';
      const setVmValue = ViewModel.getVmValueSetter(viewmodel, bindValue);
      setVmValue(2);
      assert.equal(2, viewmodel.first);
    });

    it("sets first.second func.func", function() {
      let val = null;
      const viewmodel = {
        first() {
          return {second(v) { return val = v; }};
        }
      };
      const bindValue = 'first.second';
      const setVmValue = ViewModel.getVmValueSetter(viewmodel, bindValue);
      setVmValue(2);
      assert.equal(2, val);
    });

    it("sets first().second func.func", function() {
      let val = null;
      const viewmodel = {
        first() {
          return {second(v) { return val = v; }};
        }
      };
      const bindValue = 'first().second';
      const setVmValue = ViewModel.getVmValueSetter(viewmodel, bindValue);
      setVmValue(2);
      assert.equal(2, val);
    });

    it("sets first.second.third p.p.p", function() {
      const viewmodel = {
        first: {
          second: {
            third: false
          }
        }
      };
      const bindValue = 'first.second.third';
      const setVmValue = ViewModel.getVmValueSetter(viewmodel, bindValue);
      setVmValue(true);
      assert.isTrue(viewmodel.first.second.third);
    });
  });

  describe("@addEmptyViewModel", () => it("adds a view model to the template instance", function() {
    let context = null;
    let onViewDestroyedCalled = false;
    const f = function() {
      return context = this;
    };
    const onCreatedStub = sinon.stub(ViewModel, 'onCreated');
    onCreatedStub.returns(f);
    const vm = new ViewModel();
    vm.vmInitial = {};
    const templateInstance = {
      viewmodel: vm,
      view: {
        onViewDestroyed() { return onViewDestroyedCalled = true; },
        template: {}
      }
    };
    ViewModel.addEmptyViewModel(templateInstance);
    assert.equal(context, templateInstance);
    assert.isTrue(onViewDestroyedCalled);
  }));

  describe("@parentTemplate", function() {

    it("returns undefined if it doesn't have a parent view", function() {
      const templateInstance =
        {view: {}};
      const parent = ViewModel.parentTemplate(templateInstance);
      assert.isUndefined(parent);
    });

    it("returns undefined if parent view isn't a template", function() {
      const templateInstance = {
        view: {
          parentView: {
            name: 'X'
          }
        }
      };
      const parent = ViewModel.parentTemplate(templateInstance);
      assert.isUndefined(parent);
    });

    it("returns template instance if parent view is a template", function() {
      const templateInstance = {
        view: {
          parentView: {
            name: 'Template.A',
            templateInstance() { return "X"; }
          }
        }
      };
      const parent = ViewModel.parentTemplate(templateInstance);
      assert.equal("X", parent);
    });

    it("returns template instance if parent view is body", function() {
      const templateInstance = {
        view: {
          parentView: {
            name: 'body',
            templateInstance() { return "X"; }
          }
        }
      };
      const parent = ViewModel.parentTemplate(templateInstance);
      assert.equal("X", parent);
    });
  });

  describe("@assignChild", function() {

    it("adds viewmodel to children", function() {
      const arr = [];
      const vm = {
        parent() {
          return {children() { return arr; }};
        }
      };
      ViewModel.assignChild(vm);
      assert.equal(1, arr.length);
      assert.equal(vm, arr[0]);
  });

    it("doesn't do anything without a parent template", function() {
      const vm =
        {parent() {}};
      ViewModel.assignChild(vm);
    });
  });

  describe("@templateName", function() {
    it("returns body if the template is the body", function() {
      const name = ViewModel.templateName({
        view: {
          name: 'body'
        }
      });
      assert.equal('body', name);
    });

    it("returns name of the template", function() {
      const name = ViewModel.templateName({
        view: {
          name: 'Template.mine'
        }
      });
      assert.equal('mine', name);
    });
  });

  describe("@find", function() {
    before(function() {
      ViewModel.byId = {};
      ViewModel.byTemplate = {};
      this.vm1 = new ViewModel({
        name: 'A',
        age: 2
      });
      this.vm1.templateInstance = {
        view: {
          name: 'Template.X'
        }
      };
      ViewModel.add(this.vm1);
      this.vm2 = new ViewModel({
        name: 'B',
        age: 1
      });
      this.vm2.templateInstance = {
        view: {
          name: 'Template.X'
        }
      };
      ViewModel.add(this.vm2);
      this.vm3 = new ViewModel({
        name: 'C',
        age: 1
      });
      this.vm3.templateInstance = {
        view: {
          name: 'Template.Y'
        }
      };
      ViewModel.add(this.vm3);
    });


    it("returns all without parameters", function() {
      const vms = ViewModel.find();
      assert.isTrue(vms instanceof Array);
      assert.equal(3, vms.length);
      assert.equal(this.vm1, vms[0]);
      assert.equal(this.vm2, vms[1]);
      assert.equal(this.vm3, vms[2]);
  });

    it("returns all for template X", function() {
      const vms = ViewModel.find('X');
      assert.isTrue(vms instanceof Array);
      assert.equal(2, vms.length);
      assert.equal(this.vm1, vms[0]);
      assert.equal(this.vm2, vms[1]);
  });

    it("returns all for template X with a predicate", function() {
      const vms = ViewModel.find('X', vm => vm.name() === 'B');
      assert.isTrue(vms instanceof Array);
      assert.equal(1, vms.length);
      assert.equal(this.vm2, vms[0]);
  });

    it("returns all for a predicate", function() {
      const vms = ViewModel.find(vm => vm.age() === 1);
      assert.isTrue(vms instanceof Array);
      assert.equal(2, vms.length);
      assert.equal(this.vm2, vms[0]);
      assert.equal(this.vm3, vms[1]);
  });

    describe("@findOne", function() {

      it("returns first one without params", function() {
        const vm = ViewModel.findOne();
        assert.equal(this.vm1, vm);
      });

      it("returns first for template X", function() {
        const vm = ViewModel.findOne('X');
        assert.equal(this.vm1, vm);
      });

      it("returns first for template X with predicate", function() {
        const vm = ViewModel.findOne('X', vm => vm.name() === 'B');
        assert.equal(this.vm2, vm);
      });

      it("returns first with predicate", function() {
        const vm = ViewModel.findOne(vm => vm.age() === 1);
        assert.equal(this.vm2, vm);
      });
    });
  });
});