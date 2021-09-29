'use strict';

const opentelemetry = require('@opentelemetry/api');

const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector-proto');
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

module.exports = () => {
 const resources = new Resource({
  'service.name': 'YOUR_SERVICE_NAME',
  'application': 'YOUR_APPLICATION_NAME',
  //'ANY_OTHER_ATTRIBUTE_KEY': 'ANY_OTHER_ATTRIBUTE_VALUE',
 });

 const provider = new NodeTracerProvider({ resource: resources});

 const exporterOptions = {
  url: 'http://otelcol:55681/v1/traces',
 }

 // Uncomment in case of enabled ConsoleExporter
 //const consoleExporter = new ConsoleSpanExporter();
 //provider.addSpanProcessor(new BatchSpanProcessor(consoleExporter));

 const exporter = new CollectorTraceExporter(exporterOptions);
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
