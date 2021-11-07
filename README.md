# kafka-explorer

## Kafka Commands

```sh
cd C:\kafka\zookeeper
.\apache-zookeeper-3.7.0-bin\bin\zkServer.cmd

cd  C:\kafka\kafka
.\bin\windows\kafka-server-start.bat .\config\server.properties

cd  C:\kafka\kafka\bin\windows
.\kafka-console-producer.bat --broker-list localhost:9092 --topic test2

cd C:\kafka\kafka\bin\windows
.\kafka-console-consumer.bat --bootstrap-server localhost:9092 --topic test
```
