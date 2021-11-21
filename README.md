<h1 style="border-bottom: none">
    <b>
        Kafka Explorer
    </b>
    <h4>An open-source tool to test kafka consumers and producers</h4>
    <br>
</h1>

[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=WGLabz_kafka-explorer&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=WGLabz_kafka-explorer) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=WGLabz_kafka-explorer&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=WGLabz_kafka-explorer) [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=WGLabz_kafka-explorer&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=WGLabz_kafka-explorer) [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=WGLabz_kafka-explorer&metric=bugs)](https://sonarcloud.io/summary/new_code?id=WGLabz_kafka-explorer)

<br/>
<p align="center"><img src=".assets/image.png" alt="Kafka Explorer" width="1000px" /></p>
<br/>


## Built With

- VueJS
- Electron
- KafkaJS
- NeDB Promise
- Vuetify
- Antd Vue


<br/>

## License

Distributed under the AGPLv3 License. See `LICENSE.md` for more information.

<br/>

### Useful Kafka Commands
<br/>

```sh
cd C:\kafka\zookeeper
.\apache-zookeeper-3.7.0-bin\bin\zkServer.cmd

cd  C:\kafka\kafka
.\bin\windows\kafka-server-start.bat .\config\server.properties

cd  C:\kafka\kafka\bin\windows
.\kafka-console-producer.bat --broker-list localhost:9092 --topic test2

cd C:\kafka\kafka\bin\windows
.\kafka-console-consumer.bat --bootstrap-server localhost:9092 --topic test2
```
