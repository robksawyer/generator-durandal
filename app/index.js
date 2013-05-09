'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var ncp = require('ncp').ncp;


var DurandalGenerator = module.exports = function DurandalGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

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

  //Disabled until I figure this out.
  var prompts = [{
    name: 'bootstrapOption',
    message: 'Would you like to add bootstrap?',
    default: 'Y/n',
    warning: 'Yes: Enabling this will be totally awesome!'
  }];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    this.bootstrapOption = (/y/i).test(props.bootstrapOption);
    console.log('You selected ' + this.bootstrapOption + ' for the bootstrap option.');

    cb();
  }.bind(this));
};

DurandalGenerator.prototype.app = function app() {
  this.mkdir('dist');

  ncp('app/', 'app', function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('Durandal successfully scaffolded!');
  });

  this.copy('_package.json', 'package.json');
  this.copy('_bower.json', 'bower.json');
};

DurandalGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
  this.copy('Gruntfile.js', 'Gruntfile.js');
  this.copy('README.md', 'README.md');

  //Check to see if the bootstrap option was chosen
  if (this.bootstrapOption) {
    //Do something
    console.log('You chose the bootstrap option – great!');
  }

};
