const { readFileSync } = require('fs');
const { wrap } = require('module');

const { Client } = require("./lib/index.js");

import pkg from 'file://c:/Users/admin/source/repos/ork-enclave/ork-enclave/dist/main.bundle.js';
const {Utils} = pkg;

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.shell((err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      console.log('Stream :: close');
      conn.end();
    }).on('data', (data) => {
      console.log('OUTPUT: ' + data);
    });
    stream.write("echo hello!\n")
    stream.end('ls -l\nexit\n');
  });
}).connect({
  host: 'localhost',
  port: 2222,
  username: 'user',
  privateKey: readFileSync("C:/Users/admin/.ssh/id_ed25519")
});