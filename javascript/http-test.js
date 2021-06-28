'use strict';
const tracer = require('./tracer')()


const http = require('http');

http.get({
      host: 'httpbin.org',
      port: 80,
      path: '/',
    }, (response) => {
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => {
      });
   });

console.log('Sleeping 10 seconds before shutdown to ensure all records are flushed.');
setTimeout(() => { console.log('Completed.'); }, 10000);
