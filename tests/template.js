/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
describe("Template", function() {

  beforeEach(function() {
    this.checkStub = sinon.stub(ViewModel, "check");
    this.vmOnCreatedStub = sinon.stub(ViewModel, "onCreated");
    this.vmOnRenderedStub = sinon.stub(ViewModel, "onRendered");
    return this.vmOnDestroyedStub = sinon.stub(ViewModel, "onDestroyed");
  });

  afterEach(() => sinon.restoreAll());

  describe("#viewmodel", function() {
    beforeEach(function() {
      this.context = {
        onCreated() {},
        onRendered() {},
        onDestroyed() {}
      };
      this.templateOnCreatedStub = sinon.stub(this.context, "onCreated");
      this.templateOnRenderedStub = sinon.stub(this.context, "onRendered");
      return this.templateOnDestroyedStub = sinon.stub(this.context, "onDestroyed");
    });

    it("checks the arguments", function() {
      Template.prototype.viewmodel.call(this.context, "X");
      return assert.isTrue(this.checkStub.calledWithExactly('T#viewmodel', "X", this.context));
    });

    it("saves the initial object", function() {
      Template.prototype.viewmodel.call(this.context, "X");
      return assert.equal("X", this.context.viewmodelInitial);
    });

    it("adds onCreated", function() {
      this.vmOnCreatedStub.returns("Y");
      Template.prototype.viewmodel.call(this.context, "X");
      assert.isTrue(this.vmOnCreatedStub.calledWithExactly(this.context, "X"));
      return assert.isTrue(this.templateOnCreatedStub.calledWithExactly("Y"));
    });

    it("adds onRendered", function() {
      this.vmOnRenderedStub.returns("Y");
      Template.prototype.viewmodel.call(this.context, "X");
      assert.isTrue(this.vmOnRenderedStub.calledWithExactly("X"));
      return assert.isTrue(this.templateOnRenderedStub.calledWithExactly("Y"));
    });

    it("adds onDestroyed", function() {
      this.vmOnDestroyedStub.returns("Y");
      Template.prototype.viewmodel.call(this.context, "X");
      assert.isTrue(this.vmOnDestroyedStub.called);
      return assert.isTrue(this.templateOnDestroyedStub.calledWithExactly("Y"));
    });
      
    it("returns undefined", function() {
      return assert.isUndefined(Template.prototype.viewmodel.call(this.context, "X"));
    });

    return it("adds the events", function() {
      const called = [];
      const initial = {
        events: {
          a: null,
          b: null
        }
      };
      this.context.events = eventObj => called.push(eventObj);
      Template.prototype.viewmodel.call(this.context, initial);
      assert.isFunction(called[0].a);
      assert.isFunction(called[1].b);
      return assert.equal(called.length, 2);
    });
  });

  return describe("#createViewModel", function() {
    beforeEach(function() {
      this.createViewModel = Template.prototype.createViewModel;
      this.getInitialObjectStub = sinon.stub(ViewModel, 'getInitialObject');
      this.getInitialObjectStub.returns("X");
      return this.template =
        {viewmodelInitial: "A"};
    });

    it("calls getInitialObject", function() {
      this.createViewModel.call(this.template, "B");
      return assert.isTrue(this.getInitialObjectStub.calledWith("A", "B"));
    });

    return it("returns a view model", function() {
      const vm = this.createViewModel.call(this.template, "B");
      return assert.isTrue(vm instanceof ViewModel);
    });
  });
});
