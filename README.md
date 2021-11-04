# kafka-explorer


## Build `Sqlite`

```sh
    ./node_modules/.bin/electron-rebuild  -f -w sqlite3
```

## Kafka Commands

```sh
$ .\apache-zookeeper-3.7.0-bin\bin\zkServer.cmd .\bin\windows\kafka-server-start.bat .\config\server.properties 
$ .\kafka-console-producer.bat --broker-list localhost:9092 --topic test 
$ cd C:\kafka\kafka\bin\windows && .\kafka-console-consumer.bat --bootstrap-server localhost:9092 --topic test

```
