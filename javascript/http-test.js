'use strict';
// client - here pass your service name
const tracer = require('./tracer')('client');


const http = require('http');

http.get({
      host: 'express-svc',
      port: 8081,
      path: '/run_test',
    }, (response) => {
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => {
      });
   });

console.log('Sleeping 10 seconds before shutdown to ensure all records are flushed.');
setTimeout(() => { console.log('Completed.'); }, 10000);
