# kafka-explorer

[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=WGLabz_kafka-explorer&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=WGLabz_kafka-explorer) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=WGLabz_kafka-explorer&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=WGLabz_kafka-explorer) [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=WGLabz_kafka-explorer&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=WGLabz_kafka-explorer) [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=WGLabz_kafka-explorer&metric=bugs)](https://sonarcloud.io/summary/new_code?id=WGLabz_kafka-explorer)

## APP Screenshots

<table style="border: 0px;">
    <tr style="border: 0px;">
        <td style="border: 0px;">
            <img src=".assets/landing.png" width="250"/>
        </td>
        <td style="border: 0px;">
            <img src=".assets/messages.png" width="250"/>
        </td>
    </tr>
    <tr style="border: 0px;">
        <td style="border: 0px;">
            <img src=".assets/logs.png" width="250"/>
        </td>
        <td style="border: 0px;">
            <img src=".assets/conf.png" width="250"/>
        </td>
    </tr>
</table>

### Useful Kafka Commands

>

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
