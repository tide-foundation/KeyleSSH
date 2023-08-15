/* eslint-disable import/no-extraneous-dependencies */
import { io } from 'socket.io-client';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faBars, faClipboard, faDownload, faKey, faCog } from '@fortawesome/free-solid-svg-icons';
import Heimdall from "heimdall-tide";
import { Buffer } from 'buffer';
window.Buffer = Buffer;

// for Internet Explorer compatibility... i know gross...
declare global {
  interface Navigator {
      msSaveBlob?: (blob: any, defaultName?: string) => boolean
      msSaveOrOpenBlob?: (blob: any, defaultName?: string) => boolean
  }
}

library.add(faBars, faClipboard, faDownload, faKey, faCog);
dom.watch();

const debug = require('debug')('WebSSH2');
require('xterm/css/xterm.css');
require('../css/style.css');

/* global Blob, logBtn, credentialsBtn, reauthBtn, downloadLogBtn */ // eslint-disable-line
let sessionLogEnable = false;
let loggedData = false;
let allowreplay = false;
let allowreauth = false;
let sessionLog: string;
let sessionFooter: any;
let logDate: {
  getFullYear: () => any;
  getMonth: () => number;
  getDate: () => any;
  getHours: () => any;
  getMinutes: () => any;
  getSeconds: () => any;
};
let currentDate: Date;
let myFile: string;
let errorExists: boolean;
const term = new Terminal();
// DOM properties
const logBtn = document.getElementById('logBtn');
const credentialsBtn = document.getElementById('credentialsBtn');
const reauthBtn = document.getElementById('reauthBtn');
const downloadLogBtn = document.getElementById('downloadLogBtn');
const status = document.getElementById('status');
const header = document.getElementById('header');
const footer = document.getElementById('footer');
const countdown = document.getElementById('countdown');
const fitAddon = new FitAddon();
const terminalContainer = document.getElementById('terminal-container');
term.loadAddon(fitAddon);
term.open(terminalContainer);
term.focus();
fitAddon.fit();

const socket = io({
  path: '/ssh/socket.io',
});

// reauthenticate
function reauthSession () { // eslint-disable-line
  debug('re-authenticating');
  window.location.href = '/ssh/reauth';
  return false;
}

// cross browser method to "download" an element to the local system
// used for our client-side logging feature
function downloadLog () { // eslint-disable-line
  if (loggedData === true) {
    myFile = `WebSSH2-${logDate.getFullYear()}${
      logDate.getMonth() + 1
    }${logDate.getDate()}_${logDate.getHours()}${logDate.getMinutes()}${logDate.getSeconds()}.log`;
    // regex should eliminate escape sequences from being logged.
    const blob = new Blob(
      [
        sessionLog.replace(
          // eslint-disable-next-line no-control-regex
          /[\u001b\u009b][[\]()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><;]/g,
          ''
        ),
      ],
      {
        // eslint-disable-line no-control-regex
        type: 'text/plain',
      }
    );
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, myFile);
    } else {
      const elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = myFile;
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
    }
  }
  term.focus();
}
// Set variable to toggle log data from client/server to a varialble
// for later download
function toggleLog () { // eslint-disable-line
  if (sessionLogEnable === true) {
    sessionLogEnable = false;
    loggedData = true;
    logBtn.innerHTML = '<i class="fas fa-clipboard fa-fw"></i> Start Log';
    // console.log(`stopping log, ${sessionLogEnable}`);
    currentDate = new Date();
    sessionLog = `${sessionLog}\r\n\r\nLog End for ${sessionFooter}: ${currentDate.getFullYear()}/${
      currentDate.getMonth() + 1
    }/${currentDate.getDate()} @ ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}\r\n`;
    logDate = currentDate;
    term.focus();
    return false;
  }
  sessionLogEnable = true;
  loggedData = true;
  logBtn.innerHTML = '<i class="fas fa-cog fa-spin fa-fw"></i> Stop Log';
  downloadLogBtn.style.color = '#000';
  downloadLogBtn.addEventListener('click', downloadLog);
  // console.log(`starting log, ${sessionLogEnable}`);
  currentDate = new Date();
  sessionLog = `Log Start for ${sessionFooter}: ${currentDate.getFullYear()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getDate()} @ ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}\r\n\r\n`;
  logDate = currentDate;
  term.focus();
  return false;
}

// replay password to server, requires
function replayCredentials () { // eslint-disable-line
  socket.emit('control', 'replayCredentials');
  // console.log('replaying credentials');
  term.focus();
  return false;
}

// draw/re-draw menu and reattach listeners
// when dom is changed, listeners are abandonded
function drawMenu() {
  logBtn.addEventListener('click', toggleLog);
  if (allowreauth) {
    reauthBtn.addEventListener('click', reauthSession);
    reauthBtn.style.display = 'block';
  }
  if (allowreplay) {
    credentialsBtn.addEventListener('click', replayCredentials);
    credentialsBtn.style.display = 'block';
  }
  if (loggedData) {
    downloadLogBtn.addEventListener('click', downloadLog);
    downloadLogBtn.style.display = 'block';
  }
}

function resizeScreen() {
  fitAddon.fit();
  socket.emit('resize', { cols: term.cols, rows: term.rows });
}

window.addEventListener('resize', resizeScreen, false);

term.onData((data) => {
  socket.emit('data', data);
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getOpenSSHPublicKey(base64ed25519point){
    // these bytes read: 0, 0, 0, 11, "ssh-ed25519", 0, 0, 0, 32
    const staticBytes = Buffer.from(new Uint8Array([0x00, 0x00, 0x00, 0x0b, 0x73, 0x73, 0x68, 0x2d, 0x65, 0x64, 0x32, 0x35, 0x35, 0x31, 0x39, 0x00, 0x00, 0x00, 0x20]));
    const keyBytes = Buffer.from(base64ed25519point, 'base64');
    const combinedBytesB64 = Buffer.concat([staticBytes, keyBytes]).toString('base64');

    return "ssh-ed25519 " + combinedBytesB64
}
function getUsername(hex){
  const num = BigInt("0x" + hex);
  return "user" + num.toString().slice(0, 10);
}

var TideInfo = undefined;
const config = {
  vendorPublic: "j1tL3xpgcuNEV/+biWUuaDiWNyH9+Uyr8tYoB784OGE=",
  vendorUrlSignature: "e5MsoSUYzRgQ8J5MIGnFagOMbxMHDtTp7RJSW3d1xBwnmUmbYYELpJV0KyaiBSQYRsp3hPY/oqTVDjJfKyeWBQ==",
  homeORKUrl: "https://prod-ork1.azurewebsites.net",
  mode: "openssh",
}

const container = document.createElement('div');
container.style.position = 'fixed';
container.style.top = '0';
container.style.right = '0';
container.style.bottom = '0';
container.style.left = '0';
container.style.display = 'flex';
container.style.alignItems = 'center';
container.style.justifyContent = 'center';
container.style.zIndex = '1000'; // Ensure the container is above other elements
// Create the button element
const button = document.createElement('button');
// Set the button text
button.innerHTML = 'Lets go!';
// Create the text box as a div element
const textBox = document.createElement('textarea');
// Apply some styling to the text box
textBox.style.padding = '10px';
textBox.style.border = '1px solid black';
textBox.style.backgroundColor = 'white';
textBox.cols = 195; // Characters wide
textBox.rows = 25; // Lines tall
textBox.style.color = 'black';
textBox.style.overflow = 'hidden';
textBox.style.resize = 'none';


const heimdall = new Heimdall(config);
socket.on('getInfo', async (createUser) => {
  // Add a click event listener to the button
  button.addEventListener('click', async function() {
    container.removeChild(button);
    if(TideInfo == undefined){
      let result = (await heimdall.OpenEnclave());
      if('PublicKey' in result){
        TideInfo = {
          Username: getUsername(result.UID),
          PublicKey: getOpenSSHPublicKey(result.PublicKey)
        };
        if(result.NewAccount){
          textBox.value = `Provide this info to this system's administrator: \n==============================================================================================\n ${createUser ? "Username: " + TideInfo.Username + "\n" : ``} Public Key: ` + TideInfo.PublicKey + "\n" + "==============================================================================================\n";
          container.appendChild(textBox);
          await heimdall.CompleteSignIn(); // user will fail to login in this event, but we want to complete their sign in process and show their public key for admin to add
          socket.emit('returnedInfo', false);
          return;
        }
      }
      else{
        throw Error();
      }
    } 
    socket.emit('returnedInfo', TideInfo);
    document.body.removeChild(container);
  });
  // Append the button to the container
  container.appendChild(button);
  // Append the container to the body of the document
  document.body.appendChild(container);
})

socket.on('getSignature', async(dataToSign) => {
  let result = await heimdall.CompleteSignIn(dataToSign);
  if('ModelSig' in result){
    socket.emit('returnedSignature', Buffer.from(result.ModelSig, 'base64'));
  }else{
    socket.emit('returnedSignature', false);
    throw Error();
  }
});
 




socket.on('data', (data: string | Uint8Array) => {
  term.write(data);
  if (sessionLogEnable) {
    sessionLog += data;
  }
});

socket.on('connect', () => {
  socket.emit('geometry', term.cols, term.rows);
});

socket.on(
  'setTerminalOpts',
  (data: { cursorBlink: any; scrollback: any; tabStopWidth: any; bellStyle: any }) => {
    term.options.cursorBlink = data.cursorBlink;
    term.options.scrollback = data.scrollback;
    term.options.tabStopWidth = data.tabStopWidth;
    term.options.bellStyle = data.bellStyle;
  }
);

socket.on('title', (data: string) => {
  document.title = data;
});

socket.on('menu', () => {
  drawMenu();
});

socket.on('status', (data: string) => {
  status.innerHTML = data;
});

socket.on('ssherror', (data: string) => {
  status.innerHTML = data;
  status.style.backgroundColor = 'red';
  errorExists = true;
});

socket.on('headerBackground', (data: string) => {
  header.style.backgroundColor = data;
});

socket.on('header', (data: string) => {
  if (data) {
    header.innerHTML = data;
    header.style.display = 'block';
    // header is 19px and footer is 19px, recaculate new terminal-container and resize
    terminalContainer.style.height = 'calc(100% - 38px)';
    resizeScreen();
  }
});

socket.on('footer', (data: string) => {
  sessionFooter = data;
  footer.innerHTML = data;
});

socket.on('statusBackground', (data: string) => {
  status.style.backgroundColor = data;
});

socket.on('allowreplay', (data: boolean) => {
  if (data === true) {
    debug(`allowreplay: ${data}`);
    allowreplay = true;
    drawMenu();
  } else {
    allowreplay = false;
    debug(`allowreplay: ${data}`);
  }
});

socket.on('allowreauth', (data: boolean) => {
  if (data === true) {
    debug(`allowreauth: ${data}`);
    allowreauth = true;
    drawMenu();
  } else {
    allowreauth = false;
    debug(`allowreauth: ${data}`);
  }
});

socket.on('disconnect', (err: any) => {
  if (!errorExists) {
    status.style.backgroundColor = 'red';
    status.innerHTML = `WEBSOCKET SERVER DISCONNECTED: ${err}`;
  }
  socket.io.reconnection(false);
  countdown.classList.remove('active');
});

socket.on('error', (err: any) => {
  if (!errorExists) {
    status.style.backgroundColor = 'red';
    status.innerHTML = `ERROR: ${err}`;
  }
});

socket.on('reauth', () => {
  if (allowreauth) {
    reauthSession();
  }
});

// safe shutdown
let hasCountdownStarted = false;

socket.on('shutdownCountdownUpdate', (remainingSeconds: any) => {
  if (!hasCountdownStarted) {
    countdown.classList.add('active');
    hasCountdownStarted = true;
  }
  countdown.innerText = `Shutting down in ${remainingSeconds}s`;
});

term.onTitleChange((title) => {
  document.title = title;
});
