'use strict';

const opentelemetry = require('@opentelemetry/api');

const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { Resource } = require('@opentelemetry/resources');

// Instrumentations
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');

// Add ConsoleSpanExporter e.g { BatchSpanProcessor, ConsoleSpanExporter }  - debug purposes
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');

// Uncomment in case of additional debug logging
//const { diag, DiagConsoleLogger, DiagLogLevel } = opentelemetry;
//diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

module.exports = (name) => {
 const resources = new Resource({
  'service.name': name,
  'application': 'development',
  //'ANY_OTHER_ATTRIBUTE_KEY': 'ANY_OTHER_ATTRIBUTE_VALUE',
 });

 const provider = new NodeTracerProvider({ resource: resources});

 const exporterOptions = {
  url: process.env.SUMO_HTTP_TRACES_URL
 }

 // Uncomment in case of enabled ConsoleExporter
 //const consoleExporter = new ConsoleSpanExporter();
 //provider.addSpanProcessor(new BatchSpanProcessor(consoleExporter));

 const exporter = new OTLPTraceExporter(exporterOptions);
 provider.addSpanProcessor(new BatchSpanProcessor(exporter));
 provider.register();

 registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
  ],
 })
 return opentelemetry.trace.getTracer("instrumentation-example");
}
