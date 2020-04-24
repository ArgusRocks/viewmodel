# Important update

This is a forked and _decaffeinated_ version of [ViewModel](https://github.com/ManuelDeLeon/viewmodel) by [Manuel De Leon](https://github.com/ManuelDeLeon).

Changes so far:

- [x] Transpiled to JS with Decaffeinate
- [x] Switched `cultofcoders:mocha` to `meteortesting:mocha`
- [x] Update `chai` and `sinon` dependencies
- [x] Package renamed to `arggh:viewmodel`
- [x] Version bumped to `7.0.0` (though not published yet)
- [x] Removed unnecessary return statements
- [x] Fixed some broken tests

Contributions are very welcome:

- [ ] Combing through the transpiled code and applying suggestions by Decaffeinate
- [ ] Fixing weird code created in the transpilation process
- [ ] Performance improvements!

# ViewModel
## A new level of simplicity

ViewModel is a view layer for Meteor. You can think of it as Angular, Knockout, Aurelia, Vue, etc. but without the boilerplate code required to make those work.

Here are some things it can do to make your life easier:

- [Less code to get things done][1]
- [State is automatically saved for you across hot code pushes][2]
- [Save the state on the url][3]
- [Components can be used as controls][4]
- [Share state between components][5]
- [Compose view elements via mixins][6]
- [Inline/scoped styles][7]
- [Better error messages][8]

Go to [viewmodel.org][9] for examples and full documentation.

Go to the [help section][10] if you have any questions, comments, feedback, or just want to talk about anything related to ViewModel and Meteor.

[1]:https://viewmodel.org/docs#comparison
[2]:https://viewmodel.org/docs/misc#hotcodepush
[3]:https://viewmodel.org/docs/misc#stateonurl
[4]:https://viewmodel.org/docs/misc#controls
[5]:https://viewmodel.org/docs/viewmodels#share
[6]:https://viewmodel.org/docs/viewmodels#mixin
[7]:https://viewmodel.org/docs/misc#inlinestyles
[8]:https://viewmodel.org/docs/misc#bettererrors
[9]:https://viewmodel.org/
[10]:https://viewmodel.org/help
