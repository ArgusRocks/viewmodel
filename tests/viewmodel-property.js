// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
describe("ViewModel Properties", function() {
  describe("string", function() {
    const prop = new ViewModel.Property().string;

    it("fails with a number", () => assert.isFalse(prop.verify(1)));

    it("fails with an object", () => assert.isFalse(prop.verify({})));

    it("passes with a string", () => assert.isTrue(prop.verify("")));

    it("fails with a date", () => assert.isFalse(prop.verify(new Date())));

    return it("fails with a boolean", () => assert.isFalse(prop.verify(true)));
  });

  describe("number", function() {
    const prop = new ViewModel.Property().number;

    it("passes with an integer", () => assert.isTrue(prop.verify(1)));

    it("passes with a float", () => assert.isTrue(prop.verify(1.1)));

    it("passes with a string/float", () => assert.isTrue(prop.verify("1.0")));

    it("fails with a number + string", () => assert.isFalse(prop.verify("1a")));

    it("fails with an object", () => assert.isFalse(prop.verify({})));

    it("fails with an empty string", () => assert.isFalse(prop.verify("")));

    it("fails with a date", () => assert.isFalse(prop.verify(new Date())));

    return it("fails with a boolean", () => assert.isFalse(prop.verify(true)));
  });

  describe("integer", function() {
    const prop = new ViewModel.Property().integer;

    it("passes with an integer", () => assert.isTrue(prop.verify(1)));

    it("fails with a float", () => assert.isFalse(prop.verify(1.1)));

    it("passes with a string/integer", () => assert.isTrue(prop.verify("1")));

    it("fails with a number + string", () => assert.isFalse(prop.verify("1a")));

    it("fails with an object", () => assert.isFalse(prop.verify({})));

    it("fails with an empty string", () => assert.isFalse(prop.verify("")));

    it("fails with a date", () => assert.isFalse(prop.verify(new Date())));

    return it("fails with a boolean", () => assert.isFalse(prop.verify(true)));
  });

  describe("boolean", function() {
    const prop = new ViewModel.Property().boolean;

    it("fails with a number", () => assert.isFalse(prop.verify(1)));

    it("fails with an object", () => assert.isFalse(prop.verify({})));

    it("fails with a string", () => assert.isFalse(prop.verify("")));

    it("fails with a date", () => assert.isFalse(prop.verify(new Date())));

    return it("passes with a boolean", () => assert.isTrue(prop.verify(false)));
  });

  describe("object", function() {
    const prop = new ViewModel.Property().object;

    it("fails with a number", () => assert.isFalse(prop.verify(1)));

    it("passes with an object", () => assert.isTrue(prop.verify({})));

    it("fails with a string", () => assert.isFalse(prop.verify("")));

    it("fails with a date", () => assert.isFalse(prop.verify(new Date())));

    return it("fails with a boolean", () => assert.isFalse(prop.verify(true)));
  });

  describe("date", function() {
    const prop = new ViewModel.Property().date;

    it("fails with a number", () => assert.isFalse(prop.verify(1)));

    it("fails with an object", () => assert.isFalse(prop.verify({})));

    it("fails with a string", () => assert.isFalse(prop.verify("")));

    it("passes with a date", () => assert.isTrue(prop.verify(new Date())));

    return it("fails with a boolean", () => assert.isFalse(prop.verify(true)));
  });


  describe("min", function() {

    describe("string", function() {
      const prop = new ViewModel.Property().string.min(2);

      it("x", () => assert.isFalse(prop.verify("x")));

      it("xx", () => assert.isTrue(prop.verify("xx")));

      return it("xxx", () => assert.isTrue(prop.verify("xxx")));
    });

    describe("number", function() {
      const prop = new ViewModel.Property().number.min(2);

      it("1", () => assert.isFalse(prop.verify(1)));

      it("2", () => assert.isTrue(prop.verify(2)));

      return it("3", () => assert.isTrue(prop.verify(3)));
    });

    describe("integer", function() {
      const prop = new ViewModel.Property().integer.min(2);

      it("1", () => assert.isFalse(prop.verify(1)));

      it("2", () => assert.isTrue(prop.verify(2)));

      return it("3", () => assert.isTrue(prop.verify(3)));
    });

    describe("date", function() {
      const prop = new ViewModel.Property().date.min(new Date(2020, 1, 2));

      it("new Date(2020, 1, 1)", () => assert.isFalse(prop.verify(new Date(2020, 1, 1))));

      it("new Date(2020, 1, 2)", () => assert.isTrue(prop.verify(new Date(2020, 1, 2))));

      return it("new Date(2020, 1, 3)", () => assert.isTrue(prop.verify(new Date(2020, 1, 3))));
    });

    return describe("not specified", function() {
      const prop = new ViewModel.Property().min(2);

      return it("1", () => assert.isTrue(prop.verify(2)));
    });
  });


  describe("max", function() {

    describe("string", function() {
      const prop = new ViewModel.Property().string.max(2);

      it("x", () => assert.isTrue(prop.verify("x")));

      it("xx", () => assert.isTrue(prop.verify("xx")));

      return it("xxx", () => assert.isFalse(prop.verify("xxx")));
    });

    describe("number", function() {
      const prop = new ViewModel.Property().number.max(2);

      it("1", () => assert.isTrue(prop.verify(1)));

      it("2", () => assert.isTrue(prop.verify(2)));

      return it("3", () => assert.isFalse(prop.verify(3)));
    });

    describe("integer", function() {
      const prop = new ViewModel.Property().integer.max(2);

      it("1", () => assert.isTrue(prop.verify(1)));

      it("2", () => assert.isTrue(prop.verify(2)));

      return it("3", () => assert.isFalse(prop.verify(3)));
    });

    describe("date", function() {
      const prop = new ViewModel.Property().date.max(new Date(2020, 1, 2));

      it("new Date(2020, 1, 1)", () => assert.isTrue(prop.verify(new Date(2020, 1, 1))));

      it("new Date(2020, 1, 2)", () => assert.isTrue(prop.verify(new Date(2020, 1, 2))));

      return it("new Date(2020, 1, 3)", () => assert.isFalse(prop.verify(new Date(2020, 1, 3))));
    });

    return describe("not specified", function() {
      const prop = new ViewModel.Property().max(2);

      return it("1", () => assert.isTrue(prop.verify(1)));
    });
  });


  describe("validate", function() {
    const prop = new ViewModel.Property().validate( (v => v === 2) );

    it("1", () => assert.isFalse(prop.verify(1)));

    return it("2", () => assert.isTrue(prop.verify(2)));
  });


  describe("equal", function() {
    const prop = new ViewModel.Property().equal(1);

    it("'1'", () => assert.isFalse(prop.verify("1")));

    return it("1", () => assert.isTrue(prop.verify(1)));
  });

  describe("notEqual", function() {
    const prop = new ViewModel.Property().notEqual(1);

    it("'1'", () => assert.isTrue(prop.verify("1")));

    return it("1", () => assert.isFalse(prop.verify(1)));
  });

  describe("notBlank", function() {
    const prop = new ViewModel.Property().notBlank;

    it("' 0 '", () => assert.isTrue(prop.verify(" 0 ")));

    it("'0'", () => assert.isTrue(prop.verify("0")));

    it("' '", () => assert.isFalse(prop.verify(" ")));

    it("null", () => assert.isFalse(prop.verify(null)));

    return it("undefined", () => assert.isFalse(prop.verify(undefined)));
  });

  describe("between", function() {

    describe("string", function() {
      const prop = new ViewModel.Property().string.between(2, 4);

      it("x", () => assert.isFalse(prop.verify("x")));

      it("xx", () => assert.isTrue(prop.verify("xx")));

      it("xxxx", () => assert.isTrue(prop.verify("xxxx")));

      return it("xxxxx", () => assert.isFalse(prop.verify("xxxxx")));
    });

    return describe("number", function() {
      const prop = new ViewModel.Property().number.between(2, 4);

      it("1", () => assert.isFalse(prop.verify(1)));

      it("2", () => assert.isTrue(prop.verify(2)));

      it("4", () => assert.isTrue(prop.verify(4)));

      return it("5", () => assert.isFalse(prop.verify(5)));
    });
  });

  describe("notBetween", function() {

    describe("string", function() {
      const prop = new ViewModel.Property().string.notBetween(2, 4);

      it("x", () => assert.isTrue(prop.verify("x")));

      it("xx", () => assert.isFalse(prop.verify("xx")));

      it("xxxx", () => assert.isFalse(prop.verify("xxxx")));

      return it("xxxxx", () => assert.isTrue(prop.verify("xxxxx")));
    });

    return describe("number", function() {
      const prop = new ViewModel.Property().number.notBetween(2, 4);

      it("1", () => assert.isTrue(prop.verify(1)));

      it("2", () => assert.isFalse(prop.verify(2)));

      it("4", () => assert.isFalse(prop.verify(4)));

      return it("5", () => assert.isTrue(prop.verify(5)));
    });
  });

  return describe("regex", function() {
    const prop = new ViewModel.Property().regex(/x/);

    it("axc", () => assert.isTrue(prop.verify("axc")));

    return it("abc", () => assert.isFalse(prop.verify("abc")));
  });
});