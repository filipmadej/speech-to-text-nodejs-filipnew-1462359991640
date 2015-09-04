/**
 * Copyright 2014, 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express = require('express'),
    app = express(),
    errorhandler = require('errorhandler'),
    bluemix = require('./config/bluemix'),
    watson = require('watson-developer-cloud'),
    path = require('path'),
    // environmental variable points to demo's json config file
    extend = require('util')._extend;

// For local development, put username and password in config
// or store in your environment
var config = {
  version: 'v1',
  url: 'https://stream-s.watsonplatform.net/speech-to-text/api',
  //username: '<username>',
  //password: '<password>'
  username: 'a46caca4-4028-403b-a019-bc52f9714a9c',
  password: 'UsWg5540i7Xg',
  //username: 'c9122908-2741-4610-93b9-f33a731ba920',
  //password: '74jxojn8LV9i'
};

// if bluemix credentials exist, then override local
//var credentials = extend(config, bluemix.getServiceCreds('speech_to_text'));
var credentials = config;
var authorization = watson.authorization(credentials);

// Setup static public directory
app.use(express.static(path.join(__dirname , './public')));

// Get token from Watson using your credentials
app.get('/token', function(req, res) {
  authorization.getToken({url: credentials.url}, function(err, token) {
    if (err) {
      console.log('error:', err);
      res.status(err.code);
    }

    res.send(token);
  });
});

// Add error handling in dev
if (!process.env.VCAP_SERVICES) {
  app.use(errorhandler());
}
var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('listening at:', port);