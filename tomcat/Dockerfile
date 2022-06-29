FROM openjdk:8

RUN wget https://dlcdn.apache.org/tomcat/tomcat-8/v8.5.81/bin/apache-tomcat-8.5.81.zip -O apache-tomcat.zip

RUN unzip apache-tomcat.zip && mv apache-tomcat-8.5.81 apache-tomcat

WORKDIR apache-tomcat

RUN chmod +x ./bin/catalina.sh

RUN wget https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/download/v1.15.0/opentelemetry-javaagent.jar -O ./lib/opentelemetry-javaagent.jar
