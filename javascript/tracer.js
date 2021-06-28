'use strict';

const opentelemetry = require("@opentelemetry/api");

const { NodeTracerProvider } = require('@opentelemetry/node');
const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');

// Instrumentations
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');

// Add ConsoleSpanExporter e.g { BatchSpanProcessor, ConsoleSpanExporter }  - debug purposes
const { BatchSpanProcessor } = require("@opentelemetry/tracing");

// Uncomment in case of additional debug logging
//const { diag, DiagConsoleLogger, DiagLogLevel } = opentelemetry;
//diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

module.exports = () => {
 const provider = new NodeTracerProvider();

 const exporterOptions = {
  serviceName: "js-test",
  url: 'http://otelcol:55681/v1/traces',
  headers: {}
 }

 // Uncomment in case of enabled ConsoleExporter
 //let consoleExporter = new ConsoleSpanExporter();
 //provider.addSpanProcessor(new BatchSpanProcessor(consoleExporter));

 let exporter = new CollectorTraceExporter(exporterOptions);
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
