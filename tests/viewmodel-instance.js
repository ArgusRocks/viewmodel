import sinon from 'sinon';
import { assert } from 'chai';

// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
describe("ViewModel instance", function() {

  beforeEach(function() {
    this.checkStub = sinon.stub(ViewModel, "check");
    this.viewmodel = new ViewModel();
  });

  afterEach(() => sinon.restoreAll());

  describe("constructor", function() {
    it("checks the arguments", function() {
      const obj = { name: 'A'};
      const vm = new ViewModel(obj);
      assert.isTrue(this.checkStub.calledWith('#constructor', obj));
    });

    it("adds property as function", function() {
      const vm = new ViewModel({ name: 'A'});
      assert.isFunction(vm.name);
      assert.equal('A', vm.name());
      vm.name('B');
      assert.equal('B', vm.name());
    });

    it("adds properties in load object", function() {
      const obj = { name: "A" };
      const vm = new ViewModel({
        load: obj});
      assert.equal('A', vm.name());
    });

    it("adds properties in load array", function() {
      const arr = [ { name: "A" }, { age: 1 } ];
      const vm = new ViewModel({
        load: arr});
      assert.equal('A', vm.name());
      assert.equal(1, vm.age());
    });

    it("doesn't convert functions", function() {
      const f = function() {};
      const vm = new ViewModel({
        fun: f});
      assert.equal(f, vm.fun);
    });

    describe("loading hooks direct", function() {
      beforeEach(function() {
        ViewModel.mixins = {};
        ViewModel.mixin({
          hooksMixin: {
            onCreated() { return 'onCreatedMixin'; },
            onRendered() { return 'onRenderedMixin'; },
            onDestroyed() { return 'onDestroyedMixin'; },
            autorun() { return 'autorunMixin'; }
          }
        });
        ViewModel.shared = {};
        ViewModel.share({
          hooksShare: {
            onCreated() { return 'onCreatedShare'; },
            onRendered() { return 'onRenderedShare'; },
            onDestroyed() { return 'onDestroyedShare'; },
            autorun() { return 'autorunShare'; }
          }
        });
              
        this.viewmodel = new ViewModel({
          share: 'hooksShare',
          mixin: 'hooksMixin',
          load: {
            onCreated() { return 'onCreatedLoad'; },
            onRendered() { return 'onRenderedLoad'; },
            onDestroyed() { return 'onDestroyedLoad'; },
            autorun() { return 'autorunLoad'; }
          },
          onCreated() { return 'onCreatedBase'; },
          onRendered() { return 'onRenderedBase'; },
          onDestroyed() { return 'onDestroyedBase'; },
          autorun() { return 'autorunBase'; }
        });
      });

      it("adds hooks to onCreated", function() {
        assert.equal(this.viewmodel.vmOnCreated.length, 4);
        assert.equal(this.viewmodel.vmOnCreated[0](), 'onCreatedShare');
        assert.equal(this.viewmodel.vmOnCreated[1](), 'onCreatedMixin');
        assert.equal(this.viewmodel.vmOnCreated[2](), 'onCreatedLoad');
        assert.equal(this.viewmodel.vmOnCreated[3](), 'onCreatedBase');
      });
      it("adds hooks to onRendered", function() {
        assert.equal(this.viewmodel.vmOnRendered.length, 4);
        assert.equal(this.viewmodel.vmOnRendered[0](), 'onRenderedShare');
        assert.equal(this.viewmodel.vmOnRendered[1](), 'onRenderedMixin');
        assert.equal(this.viewmodel.vmOnRendered[2](), 'onRenderedLoad');
        assert.equal(this.viewmodel.vmOnRendered[3](), 'onRenderedBase');
      });
      it("adds hooks to onDestroyed", function() {
        assert.equal(this.viewmodel.vmOnDestroyed.length, 4);
        assert.equal(this.viewmodel.vmOnDestroyed[0](), 'onDestroyedShare');
        assert.equal(this.viewmodel.vmOnDestroyed[1](), 'onDestroyedMixin');
        assert.equal(this.viewmodel.vmOnDestroyed[2](), 'onDestroyedLoad');
        assert.equal(this.viewmodel.vmOnDestroyed[3](), 'onDestroyedBase');
      });
      it("adds hooks to autorun", function() {
        assert.equal(this.viewmodel.vmAutorun.length, 4);
        assert.equal(this.viewmodel.vmAutorun[0](), 'autorunShare');
        assert.equal(this.viewmodel.vmAutorun[1](), 'autorunMixin');
        assert.equal(this.viewmodel.vmAutorun[2](), 'autorunLoad');
        assert.equal(this.viewmodel.vmAutorun[3](), 'autorunBase');
      });
    });

    describe("loading hooks from array", function() {
      beforeEach(function() {
        ViewModel.mixins = {};
        ViewModel.mixin({
          hooksMixin: {
            onCreated: [ (() => 'onCreatedMixin')],
            onRendered: [ (() => 'onRenderedMixin')],
            onDestroyed: [ (() => 'onDestroyedMixin')],
            autorun: [ (() => 'autorunMixin')]
          }});
        ViewModel.shared = {};
        ViewModel.share({
          hooksShare: {
            onCreated: [ (() => 'onCreatedShare')],
            onRendered: [ (() => 'onRenderedShare')],
            onDestroyed: [ (() => 'onDestroyedShare')],
            autorun: [ (() => 'autorunShare')]
          }});

        this.viewmodel = new ViewModel({
          share: 'hooksShare',
          mixin: 'hooksMixin',
          load: {
            onCreated: [ (() => 'onCreatedLoad')],
            onRendered: [ (() => 'onRenderedLoad')],
            onDestroyed: [ (() => 'onDestroyedLoad')],
            autorun: [ (() => 'autorunLoad')]
          },
          onCreated: [ (() => 'onCreatedBase')],
          onRendered: [ (() => 'onRenderedBase')],
          onDestroyed: [ (() => 'onDestroyedBase')],
          autorun: [ (() => 'autorunBase')]});
      });

      it("adds hooks to onCreated", function() {
        assert.equal(this.viewmodel.vmOnCreated.length, 4);
        assert.equal(this.viewmodel.vmOnCreated[0](), 'onCreatedShare');
        assert.equal(this.viewmodel.vmOnCreated[1](), 'onCreatedMixin');
        assert.equal(this.viewmodel.vmOnCreated[2](), 'onCreatedLoad');
        assert.equal(this.viewmodel.vmOnCreated[3](), 'onCreatedBase');
      });
      it("adds hooks to onRendered", function() {
        assert.equal(this.viewmodel.vmOnRendered.length, 4);
        assert.equal(this.viewmodel.vmOnRendered[0](), 'onRenderedShare');
        assert.equal(this.viewmodel.vmOnRendered[1](), 'onRenderedMixin');
        assert.equal(this.viewmodel.vmOnRendered[2](), 'onRenderedLoad');
        assert.equal(this.viewmodel.vmOnRendered[3](), 'onRenderedBase');
      });
      it("adds hooks to onDestroyed", function() {
        assert.equal(this.viewmodel.vmOnDestroyed.length, 4);
        assert.equal(this.viewmodel.vmOnDestroyed[0](), 'onDestroyedShare');
        assert.equal(this.viewmodel.vmOnDestroyed[1](), 'onDestroyedMixin');
        assert.equal(this.viewmodel.vmOnDestroyed[2](), 'onDestroyedLoad');
        assert.equal(this.viewmodel.vmOnDestroyed[3](), 'onDestroyedBase');
      });
      it("adds hooks to autorun", function() {
        assert.equal(this.viewmodel.vmAutorun.length, 4);
        assert.equal(this.viewmodel.vmAutorun[0](), 'autorunShare');
        assert.equal(this.viewmodel.vmAutorun[1](), 'autorunMixin');
        assert.equal(this.viewmodel.vmAutorun[2](), 'autorunLoad');
        assert.equal(this.viewmodel.vmAutorun[3](), 'autorunBase');
      });
    });
  });

  describe("load order", function() {
    beforeEach(function() {
      ViewModel.mixins = {};
      ViewModel.mixin({
        name: {
          name: 'mixin'
        }
      });
      ViewModel.shared = {};
      ViewModel.share({
        name: {
          name: 'share'
        }
      });

      ViewModel.signals = {};
      ViewModel.signal({
        name: {
          name: {
            target: document,
            event: 'keydown'
          }
        }
      });
    });

    it("loads base name last", function() {
      const vm = new ViewModel({
        name: 'base',
        load: {
          name: 'load'
        },
        mixin: 'name',
        share: 'name',
        signal: 'name'
      });
      assert.equal(vm.name(), "base");
    });

    it("loads from load 2nd to last", function() {
      const vm = new ViewModel({
        load: {
          name: 'load'
        },
        mixin: 'name',
        share: 'name',
        signal: 'name'
      });
      assert.equal(vm.name(), "load");
    });

    it("loads from mixin 3rd to last", function() {
      const vm = new ViewModel({
        mixin: 'name',
        share: 'name',
        signal: 'name'
      });
      assert.equal(vm.name(), "mixin");
    });

    it("loads from share 4th to last", function() {
      const vm = new ViewModel({
        share: 'name',
        signal: 'name'
      });
      assert.equal(vm.name(), "share");
    });

    it("loads from signal first", function() {
      const vm = new ViewModel({
        signal: 'name'
      });
      assert.equal(_.keys(vm.name()).length, 0);
    });
  });

  describe("#bind", function() {

    beforeEach(function() {
      this.bindSingleStub = sinon.stub(ViewModel, 'bindSingle');
    });

    it("calls bindSingle for each entry in bindObject", function() {
      const bindObject = {
        a: 1,
        b: 2
      };
      const vm = {};
      const bindings = {
        a: 1,
        b: 2
      };
      this.viewmodel.bind.call(vm, bindObject, 'templateInstance', 'element', bindings);
      assert.isTrue(this.bindSingleStub.calledTwice);
      assert.isTrue(this.bindSingleStub.calledWith('templateInstance', 'element', 'a', 1, bindObject, vm, bindings));
      assert.isTrue(this.bindSingleStub.calledWith('templateInstance', 'element', 'b', 2, bindObject, vm, bindings));
    });

    it("returns undefined", function() {
      const bindObject = {};
      const ret = this.viewmodel.bind(bindObject, 'templateInstance', 'element', 'bindings');
      assert.isUndefined(ret);
    });
  });

  describe("validation", () => it("vm is valid with an undefined", function() {
    this.viewmodel.load({ name: undefined });
    assert.equal(true, this.viewmodel.valid());
  }));

  describe("#load", function() {

    it("adds a property to the view model", function() {
      this.viewmodel.load({ name: 'Alan' });
      assert.equal('Alan', this.viewmodel.name());
    });

    it("adds onRendered from an array", function() {
      const f = function() {};
      this.viewmodel.load([ {onRendered: f} ]);
      assert.equal(f, this.viewmodel.vmOnRendered[0]);
  });

    it("adds a properties from an array", function() {
      this.viewmodel.load([{ name: 'Alan' },{ two: 'Brito' }]);
      assert.equal('Alan', this.viewmodel.name());
      assert.equal('Brito', this.viewmodel.two());
    });

    it("adds function to the view model", function() {
      const f = function() {};
      this.viewmodel.load({ fun: f });
      assert.equal(f, this.viewmodel.fun);
    });

    it("doesn't create a new property when extending the same name", function() {
      this.viewmodel.load({ name: 'Alan' });
      const old = this.viewmodel.name;
      this.viewmodel.load({ name: 'Brito' });
      assert.equal('Brito', this.viewmodel.name());
      assert.equal(old, this.viewmodel.name);
    });

    it("overwrite existing functions", function() {
      this.viewmodel.load({ name() { return 'Alan'; } });
      const old = this.viewmodel.name;
      this.viewmodel.load({ name: 'Brito' });
      const theNew = this.viewmodel.name;
      assert.equal('Brito', this.viewmodel.name());
      assert.equal(theNew, this.viewmodel.name);
      assert.notEqual(old, theNew);
    });

    it("doesn't add events", function() {
      this.viewmodel.load({ events: { 'click one'() {} } });
      assert.equal(0, this.viewmodel.vmEvents.length);
    });

    it("adds events", function() {
      this.viewmodel.load({ events: { 'click one'() {} } }, true);
      assert.equal(1, this.viewmodel.vmEvents.length);
    });

    it("doesn't do anything with null and undefined", function() {
      this.viewmodel.load(undefined );
      this.viewmodel.load(null);
    });
  });

  describe("#parent", function() {

    beforeEach(function() {
      this.viewmodel.templateInstance = {
        view: {
          parentView: {
            name: 'Template.A',
            templateInstance() {
              return {viewmodel: "X"};
            }
          }
        }
      };
    });

    it("returns the view model of the parent template", function() {
      const parent = this.viewmodel.parent();
      assert.equal("X", parent);
    });

    it("returns the first view model up the chain", function() {
      this.viewmodel.templateInstance = {
        view: {
          parentView: {
            name: 'Template.something',
            templateInstance() {
              return {
                view: {
                  parentView: {
                    name: 'Template.A',
                    templateInstance() {
                      return {viewmodel: "Y"};
                    }
                  }
                }
              };
            }
          }
        }
      };
      const parent = this.viewmodel.parent();
      assert.equal("Y", parent);
    });

    it("checks the arguments", function() {
      this.viewmodel.parent('X');
      assert.isTrue(this.checkStub.calledWith('#parent', 'X'));
    });
  });

  describe("#children", function() {

    beforeEach(function() {
      this.viewmodel.children().push({
        age() { return 1; },
        name() { return "AA"; },
        templateInstance: {
          view: {
            name: 'Template.A'
          }
        }
      });
      this.viewmodel.children().push({
        age() { return 2; },
        name() { return "BB"; },
        templateInstance: {
          view: {
            name: 'Template.B'
          }
        }
      });
      this.viewmodel.children().push({
        age() { return 1; },
        templateInstance: {
          view: {
            name: 'Template.A'
          }
        }
      });
    });

    it("returns all without arguments", function() {
      assert.equal(3, this.viewmodel.children().length);
      this.viewmodel.children().push("X");
      assert.equal(4, this.viewmodel.children().length);
      assert.equal("X", this.viewmodel.children()[3]);
  });

    it("returns by template when passed a string", function() {
      const arr = this.viewmodel.children('A');
      assert.equal(2, arr.length);
      assert.equal(1, arr[0].age());
      assert.equal(1, arr[1].age());
    });

    it("returns array from a predicate", function() {
      const arr = this.viewmodel.children(vm => vm.age() === 2);
      assert.equal(1, arr.length);
      assert.equal("BB", arr[0].name());
    });

    it("calls .depend", function() {
      const array = this.viewmodel.children();
      const spy = sinon.spy(array, 'depend');
      this.viewmodel.children();
      assert.isTrue(spy.called);
    });

    it("doesn't check without arguments", function() {
      this.viewmodel.children();
      assert.isFalse(this.checkStub.calledWith('#children'));
    });

    it("checks with arguments", function() {
      this.viewmodel.children('X');
      assert.isTrue(this.checkStub.calledWith('#children', 'X'));
    });
  });

  describe("#reset", function() {

    beforeEach(function() {
      this.viewmodel.templateInstance = {
        view: {
          name: 'body'
        }
      };
      this.viewmodel.load({
        name: 'A',
        arr: ['A']});
    });

    it("resets a string", function() {
      this.viewmodel.name('B');
      this.viewmodel.reset();
      assert.equal("A", this.viewmodel.name());
    });

    it("resets an array", function() {
      this.viewmodel.arr().push('B');
      this.viewmodel.reset();
      assert.equal(1, this.viewmodel.arr().length);
      assert.equal('A', this.viewmodel.arr()[0]);
  });
});

  describe("#data", function() {

    beforeEach(function() {
      this.viewmodel.load({
        name: 'A',
        arr: ['B']});
    });

    it("creates js object", function() {
      const obj = this.viewmodel.data();
      assert.equal('A', obj.name);
      assert.equal('B', obj.arr[0]);
    });

    it("only loads fields specified", function() {
      const obj = this.viewmodel.data(['name']);
      assert.equal('A', obj.name);
      assert.isUndefined(obj.arr);
    });
  });

  describe("#load", function() {

    beforeEach(function() {
      return this.viewmodel.load({
        name: 'A',
        age: 2,
        f() { return 'X'; }
      });
    });

    it("loads js object", function() {
      this.viewmodel.load({
        name: 'B',
        f() { return 'Y'; }
      });
      assert.equal('B', this.viewmodel.name());
      assert.equal(2, this.viewmodel.age());
      assert.equal('Y', this.viewmodel.f());
    });
  });

  describe("mixin", function() {

    beforeEach(() => ViewModel.mixin({
      house: {
        address: 'A'
      },
      person: {
        name: 'X'
      },
      glob: {
        mixin: 'person'
      },
      prom: {
        mixin: {
          scoped: 'glob'
        }
      },
      bland: {
        mixin: [ { subGlob: 'glob'}, 'house']
      }}));

    it("sub-mixin adds property to vm", function() {
      const vm = new ViewModel({
        mixin: 'glob'});
      assert.equal('X', vm.name());
    });

    it("sub-mixin adds sub-property to vm", function() {
      const vm = new ViewModel({
        mixin: {
          scoped: 'glob'
        }
      });
      assert.equal('X', vm.scoped.name());
    });

    it("sub-mixin adds sub-property to vm prom", function() {
      const vm = new ViewModel({
        mixin: 'prom'});
      assert.equal('X', vm.scoped.name());
    });

    it("sub-mixin adds sub-property to vm bland", function() {
      const vm = new ViewModel({
        mixin: 'bland'});
      assert.equal('A', vm.address());
      assert.equal('X', vm.subGlob.name());
    });

    it("sub-mixin adds sub-property to vm bland scoped", function() {
      const vm = new ViewModel({
        mixin: {
          scoped: 'bland'
        }
      });
      assert.equal('A', vm.scoped.address());
      assert.equal('X', vm.scoped.subGlob.name());
    });

    it("adds property to vm", function() {
      const vm = new ViewModel({
        mixin: 'house'});
      assert.equal('A', vm.address());
    });

    it("adds property to vm from array", function() {
      const vm = new ViewModel({
        mixin: ['house']});
      assert.equal('A', vm.address());
    });

    it("doesn't share the property", function() {
      const vm1 = new ViewModel({
        mixin: 'house'});
      const vm2 = new ViewModel({
        mixin: 'house'});
      vm2.address('B');
      assert.equal('A', vm1.address());
      assert.equal('B', vm2.address());
    });

    it("adds object to vm", function() {
      const vm = new ViewModel({
        mixin: {
          location: 'house'
        }
      });
      assert.equal('A', vm.location.address());
    });

    it("adds array to vm", function() {
      const vm = new ViewModel({
        mixin: {
          location: ['house', 'person']
        }});
      assert.equal('A', vm.location.address());
      assert.equal('X', vm.location.name());
    });

    it("adds mix to vm", function() {
      const vm = new ViewModel({
        mixin: [
          { location: 'house' },
          'person'
        ]});
      assert.equal('A', vm.location.address());
      assert.equal('X', vm.name());
    });
  });

  describe("share", function() {

    beforeEach(() => ViewModel.share({
      house: {
        address: 'A'
      },
      person: {
        name: 'X'
      }
    }));

    it("adds property to vm", function() {
      const vm = new ViewModel({
        share: 'house'});
      assert.equal('A', vm.address());
    });

    it("adds property to vm from array", function() {
      const vm = new ViewModel({
        share: ['house']});
      assert.equal('A', vm.address());
    });

    it("adds object to vm", function() {
      const vm = new ViewModel({
        share: {
          location: 'house'
        }
      });
      assert.equal('A', vm.location.address());
    });

    it("shares the property", function() {
      const vm1 = new ViewModel({
        share: 'house'});
      const vm2 = new ViewModel({
        share: 'house'});
      vm2.address('B');
      assert.equal('B', vm1.address());
      assert.equal('B', vm2.address());
      assert.equal(vm1.address, vm1.address);
    });

    it("adds array to vm", function() {
      const vm = new ViewModel({
        share: {
          location: ['house', 'person']
        }});
      assert.equal('A', vm.location.address());
      assert.equal('X', vm.location.name());
    });

    it("adds mix to vm", function() {
      const vm = new ViewModel({
        share: [
          { location: 'house' },
          'person'
        ]});
      assert.equal('A', vm.location.address());
      assert.equal('X', vm.name());
    });
  });
});