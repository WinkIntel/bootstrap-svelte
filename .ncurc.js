module.exports = {
    // sass is pinned at 1.77.6: newer Dart Sass releases deprecate `@import` and
    // global built-in functions, which Bootstrap 5's Sass source relies on, and
    // flood the build with deprecation warnings. Revisit when Bootstrap migrates
    // to the Sass module system (`@use`).
    reject: ['sass'],
    cooldown: '1d'
};
