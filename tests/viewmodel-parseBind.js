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
    return this.checkStub = sinon.stub(ViewModel, "check");
  });

  afterEach(() => sinon.restoreAll());

  return describe("@parseBind", () => it("parses object", function() {
    const obj = ViewModel.parseBind("text: name, full: first + ' ' + last");
    return assert.isTrue(_.isEqual({ text: "name", full: "first + ' ' + last" }, obj));
  }));
});

