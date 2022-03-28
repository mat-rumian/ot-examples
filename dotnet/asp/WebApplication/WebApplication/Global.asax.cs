using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using OpenTelemetry;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

namespace WebApplication
{
    public class MvcApplication : System.Web.HttpApplication
    {
        private TracerProvider tracerProvider;
        protected void Application_Start()
        {   
            // Uncomment if OTLP HTTP protocol used
            // AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport",
            //     true);
            
            Environment.SetEnvironmentVariable("OTEL_SERVICE_NAME","application-service-name");
            Environment.SetEnvironmentVariable("OTEL_RESOURCE_ATTRIBUTES","application=my-app");
            Environment.SetEnvironmentVariable("OTEL_EXPORTER_OTLP_PROTOCOL","http/protobuf");
            Environment.SetEnvironmentVariable("OTEL_EXPORTER_OTLP_ENDPOINT","http://localhost:55681");
            
            tracerProvider = Sdk.CreateTracerProviderBuilder()
                .SetResourceBuilder(ResourceBuilder.CreateDefault()
                    .AddTelemetrySdk()
                    .AddEnvironmentVariableDetector())
                .AddAspNetInstrumentation()
                .AddHttpClientInstrumentation()
                .AddOtlpExporter()
                .AddConsoleExporter()
                .Build();
            
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
        
        protected void Application_End()
        {
            tracerProvider?.Dispose();
        }
    }
}