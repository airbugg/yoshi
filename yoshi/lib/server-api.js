'use strict';

const fs = require('fs');
const path = require('path');
const spdy = require('spdy');
const del = require('del');
const http = require('http');
const selfsigned = require('selfsigned');
const express = require('express');
const projectConfig = require('../config/project');

function corsMiddleware() {
  return (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  };
}

function start({middlewares = [], host}) {
  const port = projectConfig.servers.cdn.port();
  const files = projectConfig.clientFilesPath();
  const app = express();

  [corsMiddleware(), express.static(files), ...middlewares]
    .forEach(mw => app.use(mw));

  let listeningApp;

  if (projectConfig.servers.cdn.https()) {
    let fakeCert;
    // Use a self-signed certificate if no certificate was configured.
    // Cycle certs every 24 hours
    const certPath = path.join(__dirname, 'server.pem');
    let certExists = fs.existsSync(certPath);

    if (certExists) {
      const certStat = fs.statSync(certPath);
      const certTtl = 1000 * 60 * 60 * 24;
      const now = new Date();

      // cert is more than 30 days old, kill it with fire
      if ((now - certStat.ctime) / certTtl > 30) {
        console.log('SSL Certificate is more than 30 days old. Removing.');
        del.sync([certPath], {force: true});
        certExists = false;
      }
    }

    if (!certExists) {
      console.log('Generating SSL Certificate');
      const attrs = [{name: 'commonName', value: 'localhost'}];
      const pems = selfsigned.generate(attrs, {
        algorithm: 'sha256',
        days: 30,
        keySize: 2048
      });

      fs.writeFileSync(certPath, pems.private + pems.cert, {encoding: 'utf-8'});
    }
    fakeCert = fs.readFileSync(certPath);
    let https = {};

    https.key = https.key || fakeCert;
    https.cert = https.cert || fakeCert;

    if (!https.spdy) {
      https.spdy = {
        protocols: ['h2', 'http/1.1']
      };
    }
    listeningApp = spdy.createServer(https, app);
  } else {
    listeningApp = http.createServer(app);
  }



  return new Promise((resolve, reject) => {
    const server = listeningApp.listen(port, host, err =>
      err ? reject(err) : resolve(server));
  });
}

module.exports = {start};
