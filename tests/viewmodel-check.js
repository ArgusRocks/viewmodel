import sinon from 'sinon';
import { assert } from 'chai';

// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
describe("ViewModel", () => describe("@check", function() {
  beforeEach(function() {
    Package['manuel:viewmodel-debug'] =
      {VmCheck() {}};
    this.vmCheckStub = sinon.stub(Package['manuel:viewmodel-debug'], "VmCheck");
  });

  afterEach(() => sinon.restoreAll());

  it("doesn't check if ignoreErrors is true", function() {
    ViewModel.ignoreErrors = true;
    ViewModel.check();
    ViewModel.ignoreErrors = false;
    assert.isFalse(this.vmCheckStub.called);
  });

  it("calls VmCheck with parameters", function() {
    ViewModel.check(1, 2, 3);
    assert.isTrue(this.vmCheckStub.calledWithExactly(1, 2, 3));
  });

  it("returns undefined", () => assert.isUndefined(ViewModel.check()));
}));
