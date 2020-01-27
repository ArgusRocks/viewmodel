Package.describe({
  name: "arggh:viewmodel",
  summary:
    "MVVM, two-way data binding, and components for Meteor. Similar to Angular and Knockout.",
  version: "7.0.0",
  git: "https://github.com/arggh/viewmodel"
});

var CLIENT = "client";

Package.onUse(function(api) {
  api.use(
    [
      "ecmascript@0.1.6",
      "blaze@2.1.2",
      "templating@1.1.1",
      "jquery@3.0.0",
      "underscore@1.0.3",
      "tracker@1.0.7",
      "reload@1.1.3",
      "sha@1.0.3",
      "reactive-dict@1.1.0",
      "manuel:isdev@1.0.0",
      "manuel:reactivearray@1.0.9",
      "manuel:viewmodel-debug@2.7.2"
    ],
    CLIENT
  );

  api.addFiles(
    [
      "lib/viewmodel.js",
      "lib/viewmodel-parseBind.js",
      "lib/bindings.js",
      "lib/template.js",
      "lib/migration.js",
      "lib/viewmodel-onUrl.js",
      "lib/viewmodel-property.js",
      "lib/lzstring.js"
    ],
    CLIENT
  );

  api.export(["ViewModel"], CLIENT);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use(
    [
      "ecmascript",
      "blaze",
      "templating",
      "jquery@3.0.0",
      "underscore",
      "tracker",
      "reload",
      "sha",
      "reactive-dict",
      "manuel:reactivearray",
      "meteortesting:mocha",
      "manuel:isdev"
    ],
    CLIENT
  );


  api.mainModule('tests/tests.js', 'client');

  api.export(["ViewModel"], CLIENT);
});
