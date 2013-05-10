'use strict';
var util = require('util');
var path = require('path');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');


var DurandalGenerator = module.exports = function DurandalGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  // setup the test-framework property, Gruntfile template will need this
  this.testFramework = options['test-framework'] || 'mocha';

  // for hooks to resolve on mocha by default
  if (!options['test-framework']) {
    options['test-framework'] = 'mocha';
  }

  // resolved to mocha by default (could be switched to jasmine for instance)
  this.hookFor('test-framework', { as: 'app' });

  //this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
  //this.mainJsFile = '';
  //this.mainCoffeeFile = 'console.log "\'Allo from CoffeeScript!"';

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(DurandalGenerator, yeoman.generators.NamedBase);

DurandalGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  var welcome =
  '\n     _-----_' +
  '\n    |       |' +
  '\n    |' + '--(o)--'.red + '|   .--------------------------.' +
  '\n   `---------´  |    ' + 'Welcome to Yeoman,'.yellow.bold + '    |' +
  '\n    ' + '( '.yellow + '_' + '´U`'.yellow + '_' + ' )'.yellow + '   |   ' + 'ladies and gentlemen!'.yellow.bold + '  |' +
  '\n    /___A___\\   \'__________________________\'' +
  '\n     |  ~  |'.yellow +
  '\n   __' + '\'.___.\''.yellow + '__' +
  '\n ´   ' + '`  |'.red + '° ' + '´ Y'.red + ' `\n';

  console.log(welcome);
  console.log('Out of the box I include Durandal (of course), Knockout, Sammy, jQuery, Bootstrap and Modernizr.');

  var prompts = [{
    name: 'compassBootstrap',
    message: 'Would you like to include Twitter Bootstrap for Sass?',
    default: 1,
    warning: 'Yes: All Twitter Bootstrap files will be placed into the styles directory.'
  },
  {
    name: 'includeFontAwesome',
    message: 'Would you like to include Font Awesome (for cool icons)?',
    default: 1,
    warning: 'Yes: Font Awesome will be placed into the view styles directory.'
  }];
  /*{
    name: 'includeRequireJS',
    message: 'Would you like to include RequireJS (for AMD support)?',
    default: 1,
    warning: 'Yes: RequireJS will be placed into the JavaScript vendor directory.'
  }*/

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.
    this.compassBootstrap = (/y/i).test(props.compassBootstrap);
    //this.includeRequireJS = (/y/i).test(props.includeRequireJS);
    this.includeFontAwesome = (/y/i).test(props.includeFontAwesome);

    cb();
  }.bind(this));
};

DurandalGenerator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js');
};

DurandalGenerator.prototype.bower = function bower() {
  this.copy('_bower.json', 'bower.json');
  this.copy('bowerrc', '.bowerrc');
};

DurandalGenerator.prototype.packageJSON = function packageJSON() {
  this.template('_package.json', 'package.json');
};

DurandalGenerator.prototype.git = function git() {
  this.copy('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

DurandalGenerator.prototype.jshint = function jshint() {
  this.copy('jshintrc', '.jshintrc');
};

DurandalGenerator.prototype.travis = function travis() {
  this.copy('travis.yml', 'travis.yml');
};

DurandalGenerator.prototype.editorConfig = function editorConfig() {
  this.copy('editorconfig', '.editorconfig');
};

DurandalGenerator.prototype.views = function views() {
  this.copy('favicon.ico', 'app/favicon.ico');
  this.copy('robots.txt', 'app/robots.txt');
  this.copy('htaccess', 'app/.htaccess');

  this.copy('views/404.html', 'app/views/404.html');
  this.copy('views/detail.html', 'app/views/detail.html');
  this.copy('views/flickr.html', 'app/views/flickr.html');
  this.copy('views/flickr.html', 'app/views/shell.html');
  this.copy('views/flickr.html', 'app/views/welcome.html');

  //Images
  this.copy('views/images/icon.png', 'app/views/images/icon.png');
  this.copy('views/images/icon_32.png', 'app/views/images/icon_32.png');
  this.copy('views/images/icon_64.png', 'app/views/images/icon_64.png');
  this.copy('views/images/icon_128.png', 'app/views/images/icon_128.png');
  this.copy('views/images/icon_256.png', 'app/views/images/icon_256.png');
  this.copy('views/images/icon_512.png', 'app/views/images/icon_512.png');
  this.copy('views/images/icon_large.png', 'app/views/images/icon_large.png');
  this.copy('views/images/ios-startup-image-landscape.png', 'app/views/images/ios-startup-image-landscape.png');
  this.copy('views/images/ios-startup-image-portrait.png', 'app/views/images/ios-startup-image-portrait.png');
};

DurandalGenerator.prototype.viewmodels = function viewmodels() {
  this.directory('viewmodels', 'app/viewmodels');
};

DurandalGenerator.prototype.durandal = function durandal() {
  this.directory('durandal', 'app/durandal');
};

/*DurandalGenerator.prototype.bootstrapImg = function bootstrapImg() {
  if (this.compassBootstrap) {
    this.copy('views/styles/glyphicons-halflings.png', 'app/views/styles/images/glyphicons-halflings.png');
    this.copy('views/styles/glyphicons-halflings-white.png', 'app/views/styles/images/glyphicons-halflings-white.png');
  }
};

DurandalGenerator.prototype.bootstrapJs = function bootstrapJs() {
  // TODO: create a Bower component for this
  if (this.compassBootstrap) {
    this.copy('scripts/vendor/bootstrap.js', 'app/scripts/vendor/bootstrap.js');
    this.copy('scripts/vendor/bootstrap.min.js', 'app/scripts/vendor/bootstrap.min.js');
  }
};*/

DurandalGenerator.prototype.mainStylesheets = function mainStylesheets() {
  /*if (this.compassBootstrap) {
    //this.write('app/styles/app.scss', '$iconSpritePath: "../views/styles/images/glyphicons-halflings.png";\n$iconWhiteSpritePath: "../views/styles/images/glyphicons-halflings-white.png";\n\n@import \'sass-bootstrap/lib/bootstrap\';\n\n.hero-unit {\n    margin: 50px auto 0 auto;\n    width: 300px;\n}');
    this.copy('views/styles/bootstrap-responsive.css', 'app/views/styles/bootstrap-responsive.css');
    this.copy('views/styles/bootstrap-responsive.min.css', 'app/views/styles/bootstrap-responsive.min.css');
    this.copy('views/styles/bootstrap.css', 'app/views/styles/bootstrap.css');
    this.copy('views/styles/bootstrap.min.css', 'app/views/styles/bootstrap.min.css');
  }*/

  this.copy('views/styles/app.css', 'app/views/styles/app.scss');
  this.copy('views/styles/ie10mobile.css', 'app/views/styles/ie10mobile.css');
};

/*DurandalGenerator.prototype.fontAwesome = function fontAwesome() {
  if (this.includeFontAwesome) {
    this.copy('views/styles/font-awesome.css', 'app/views/styles/font-awesome.css');
    this.copy('views/styles/font-awesome.min.css', 'app/views/styles/font-awesome.min.css');
    this.copy('views/styles/font-awesome-ie7.min.css', 'app/views/styles/font-awesome-ie7.min.css');
    //Fonts
    this.mkdir('app/views/styles/font');
    this.copy('views/styles/font/fontawesome-webfont.eot', 'app/views/styles/font/fontawesome-webfont.eot');
    this.copy('views/styles/font/fontawesome-webfont.svg', 'app/views/styles/font/fontawesome-webfont.svg');
    this.copy('views/styles/font/fontawesome-webfont.ttf', 'app/views/styles/font/fontawesome-webfont.ttf');
    this.copy('views/styles/font/fontawesome-webfont.woff', 'app/views/styles/font/fontawesome-webfont.woff');
    this.copy('views/styles/font/FontAwesome.otf', 'app/views/styles/font/FontAwesome.otf');
  }
};*/

//Todo: rewrite this
/*DurandalGenerator.prototype.requirejs = function requirejs() {
  if (this.includeRequireJS) {
    this.copy('main.js', 'app/main.js');
  }
};*/

DurandalGenerator.prototype.app = function app() {
  this.mkdir('app');
  this.mkdir('app/bower_components');
  this.mkdir('dist');
  //this.mkdir('app/viewmodels');
  //this.mkdir('app/durandal');
  this.mkdir('app/views');
  this.mkdir('app/views/styles');
  this.mkdir('app/scripts');
  this.mkdir('app/scripts/vendor');

  if(this.includeFontAwesome && this.compassBootstrap){
    this.copy('index_bootstrap_fontawesome.html', 'app/index.html');
  }else if(this.compassBootstrap){
    this.copy('index_bootstrap.html', 'app/index.html');
  }else if(this.includeFontAwesome){
    this.copy('index_fontawesome.html', 'app/index.html');
  }else{
    this.copy('index.html', 'app/index.html');
  }
  
  this.copy('README.md', 'app/README.md');
  this.copy('main.js', 'app/main.js');
};