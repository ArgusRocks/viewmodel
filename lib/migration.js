// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
this.Migration = new ReactiveDict("ViewModel_Migration");
Reload._onMigrate(function() {
  if (!ViewModel.persist) { return [true]; }
  const migrated = {};
  for (let vmId in ViewModel.byId) {
    const viewmodel = ViewModel.byId[vmId];
    if (!viewmodel.persist || viewmodel.persist()) {
      const vmHash = viewmodel.vmHash();
      if (migrated[vmHash]) {
        const templateName = ViewModel.templateName(viewmodel.templateInstance);
        console.error(`Could not create unique identifier for an instance of template '${templateName}'. This can usually be resolved by wrapping a plain text in a div or adding a vmTag to the view model. Now you need to manually refresh the page. See https://viewmodel.org/docs/misc#hotcodepush for more information.`);
        return [false];
      }
      migrated[vmHash] = 1;
      Migration.set(vmHash, viewmodel.data());
    }
  }
  return [true];});
