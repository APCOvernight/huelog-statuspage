# HueStatus Log Status Page

[![NPM Package](https://img.shields.io/npm/v/huelog-statuspage.svg?maxAge=2592000)](https://npmjs.com/package/huelog-statuspage) ![License](https://img.shields.io/npm/l/huelog-statuspage.svg) [![Build Status](https://travis-ci.org/APCOvernight/huelog-statuspage.svg?branch=master)](https://travis-ci.org/APCOvernight/huelog-statuspage) [![Coverage Status](https://coveralls.io/repos/github/APCOvernight/huelog-statuspage/badge.svg?branch=master)](https://coveralls.io/github/APCOvernight/huelog-statuspage?branch=master) [![Maintainability](	https://img.shields.io/codeclimate/maintainability/APCOvernight/huelog-statuspage.svg)](https://codeclimate.com/github/APCOvernight/huelog-statuspage/maintainability) 
[![Dependencies](https://img.shields.io/david/APCOvernight/huelog-statuspage.svg)](https://david-dm.org/APCOvernight/huelog-statuspage) [![Greenkeeper badge](https://badges.greenkeeper.io/APCOvernight/huelog-statuspage.svg)](https://greenkeeper.io/)

HTML page for HueStatus logs

## Features
- Quickly see the most recent log event 
- Shows the most recent 

## Installation

```
npm install -g huestatus huelog-statuspage
```

Create a .huerc file on your home directory, see [HueStatus Docs](https://www.npmjs.com/package/huestatus) for more info. Add an object like this to the reporters array:

```js
{
  "name": "huelog-statuspage", // Required to tell HueStatus to load this reporter
  "logLevel": "info", // Level of logs to be sent to the Status Page - debug, info or error (info is most useful)
  "port": 3131 // Port to serve the status page on. Make sure this port is not in use by antother process (Defaults to 80)
}

```

Then run `huestatus`, an express server will be started and you can browse to it to see the latest status.
