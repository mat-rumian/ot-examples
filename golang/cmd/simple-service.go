package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/baggage"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"

	//"go.opentelemetry.io/otel/exporters/stdout/stdouttrace"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/trace"
)

func initTracer() func() {
    ctx := context.Background()
    
    client := otlptracehttp.NewClient()

    otlpTraceExporter, err := otlptrace.New(ctx, client)
    if err != nil {
        log.Fatal(err)
    }
    
    batchSpanProcessor := trace.NewBatchSpanProcessor(otlpTraceExporter)

    // Uncomment in case of debug, print spans to console
    // consoleExporter, err := stdouttrace.New(stdouttrace.WithPrettyPrint())
	// if err != nil {
	// 	log.Panicf("failed to initialize stdouttrace exporter %v\n", err)
	// }
    // ssp := trace.NewSimpleSpanProcessor(consoleExporter)

    tracerProvider := trace.NewTracerProvider(
        trace.WithSpanProcessor(batchSpanProcessor),
        //trace.WithSpanProcessor(ssp), Uncomment in case of consoleExporter
        //trace.WithSampler(trace.AlwaysSample()), //- please check TracerProvider.WithSampler() implementation for details.
    )
    
    otel.SetTracerProvider(tracerProvider)
    otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(
        propagation.TraceContext{}, propagation.Baggage{}))

    return func() {
            // Shutdown will flush any remaining spans and shut down the exporter.
            handleErr(tracerProvider.Shutdown(ctx), "failed to shutdown TracerProvider")
    }
}

func main() {

    initTracer()
    ctx := baggage.ContextWithoutBaggage(context.Background())

    client := http.Client{Transport: otelhttp.NewTransport(http.DefaultTransport)}


    
    req, _ := http.NewRequestWithContext(ctx, "GET", "https://sumologic.com", nil)

    fmt.Printf("Sending request...\n")
    res, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    fmt.Printf("Response status code: %v\n", res.Status)
    fmt.Printf("Waiting for few seconds to export spans ...\n\n")
    time.Sleep(15 * time.Second)
}

func handleErr(err error, message string) {
	if err != nil {
		log.Fatalf("%s: %v", message, err)
	}
}
