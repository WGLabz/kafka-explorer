# kafka-explorer

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


<!--  -->
cd C:\kafka\zookeeper && .\apache-zookeeper-3.7.0-bin\bin\zkServer.cmd
cd  C:\kafka\kafka\bin\windows and .\bin\windows\kafka-server-start.bat .\config\server.properties
cd C:\kafka\kafka\bin\windows && .\kafka-console-producer.bat --broker-list localhost:9092 --topic test
cd C:\kafka\kafka\bin\windows && .\kafka-console-consumer.bat --bootstrap-server localhost:9092 --topic test
