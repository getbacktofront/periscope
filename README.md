# periscope

A css / js / html playpen written in node.

## gulp

This project uses an ES6 gulpfile. You need gulp >= 3.9 to use it.

## quickstart

    npm install
    gulp
    gulp assets
    gulp server
    open http://localhost:3000

Gulp assets is a one-time build of svg fonts, etc.

## tests

    gulp scripts client-scripts && gulp test

NB. The nodeunit task doesn't support streams, so 'gulp test' won't work.

## fonts

To build webfonts on OSX install the required dependencies:

    brew install fontforge ttf2eot batik
    gulp fonts

See https://github.com/agentk/fontfacegen#requirements

Note that font building is not done as part of the watch or default task.

## license

This software is released under the MIT license.
