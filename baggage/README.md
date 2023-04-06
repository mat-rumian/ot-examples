# Baggage example with Real User Monitoring and backend node server

## Requirements
- [Sumo Logic HTTP Traces URL](https://help.sumologic.com/docs/send-data/hosted-collectors/http-source/traces/)
- [Sumo Logic Real User Monitoring Endpoint](https://help.sumologic.com/docs/apm/real-user-monitoring/configure-data-collection/#step-1-create-a-rum-http-traces-source)
- Docker and docker-compose

## Deployment

1. Configure environment variables

```bash
export REACT_APP_COLLECTION_SOURCE_URL=YOUR_SUMO_LOGIC_REAL_USER_MONITORING_ENDPOINT_URL
export SUMO_HTTP_TRACES_URL=YOUR_SUMO_LOGIC_HTTP_TRACES_URL
```

1. Build docker images

```bash
docker-compose build
```

1. Run application

```bash
docker-compose up
```

1. Navigate to web app http://localhost:3000

To generate traffic with `baggage` please delete one of the uses from the Contact list.

## Examples
- [Custom resource attribute in every span in RUM](./contactmanager/src/App.js#L18)
- [Custom attribute in Frontend RUM](./contactmanager/src/components/Contacts/Contact.js#L30-L37)
- [Baggage creation](./contactmanager/src/components/Contacts/Contact.js#L39-L73)
- [Custom attribute in nodejs](./contactserver/express-http-test.js#L55-L76)
