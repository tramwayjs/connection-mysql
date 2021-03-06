Tramway MySQLProvider is a simple Provider add-on to simplify the process of implementing calls to MySQL databases and provides an async/await wrapper on the `mysql` module.

# Installation:
1. `npm install tramway-connection-mysql --save`

# Documentation

## Recommended Folder Structure in addition to Tramway
- config
- providers
- repositories
- entities

## MySQLProvider
The `MySQLProvider` is a derived `Provider` which follows the same interface.

### Configuration parameters
Please refer to https://github.com/mysqljs/mysql#connection-options for full connection options.

| Parameter | Environment Variable | Default | Usage |
| --- | --- | --- | --- |
| host | MYSQL_HOST | localhost | The host of your MySQL database |
| username | MYSQL_USERNAME | | The username for the database |
| password | MYSQL_PASSWORD | | The password for the database |
| database | MYSQL_DATABASE | | The name of the default database to connect to |
| port | MYSQL_PORT | 3306 | The port for the database |

## Getting started
It is recommended to make a config file with the core MySQL configuration and make an extension class to handle it before injecting that extension class into the Repository to work with the rest of Tramway's built-in features. The alternative to the extension class is calling the config parameters with the Repository every time the repository is used instead of just importing the provider to the repository.

### Quick install with dependency injection:

Parameters:

In `src/config/parameters/global/index.js` add the following:

```javascript
import {parameters as mysql} from 'tramway-connection-mysql';

export {
    mysql,
}
```

Services:

In `src/config/services/index.js` add the following:

```javascript
import { services as mysql } from 'tramway-connection-mysql';

export {
    ...mysql,
}
```

### Manually

In your config folder add a 'mysql' file.

mysql.js:

```javascript
const {
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USERNAME,
    MYSQL_PASSWORD,
    MYSQL_DATABASE
} = process.env;

const settings = {
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    username: MYSQL_USERNAME,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
};

export default settings;
```

Note, the same can be achieved using your environment variables and passing the declaration from your instantiated .env to the placeholders in the above example.

To get the most of it, pass the provider to your `Repository` class.

```
import MySQLProvider, {repositories} from 'tramway-connection-mysql';
import options from '../config/mysql.js';

const {MySQLRepository} = repositories;

new MySQLRepository(new MySQLProvider(options), new Factory());
```

The following can also be easily achieved with dependency injection using `tramway-core-dependency-injector`.

## Exposed Methods with this Library

### Provider

Note, the extended `MySQLProvider` expects an additional parameter `tableName` on most methods. Using the `MySQLRepository` handles this for you. In addition, bulk inserts are possible.

| Function | Availability |
| ----- | ----- |
| ```getOne(id: any, tableName: string)``` | Available |
| ```getMany(ids: any[], tableName: string)``` | Available |
| ```get(tableName: string)``` | Available |
| ```find(conditions: string/Object, tableName: string)``` | Available |
| ```has(id: any, tableName: string)``` | Available |
| ```hasThese(ids : any[], tableName: string)``` | Available |
| ```count(conditions: any, tableName: string)``` | Available |
| ```create(item: Entity/Object, tableName: string)``` | Available |
| ```createMany(item: Entity/Object[], tableName: string)``` | Additional, creates a transaction for bulk inserts |
| ```update(id: any, item: Entity/Object, tableName: string)``` | Available |
| ```delete(id: any, tableName: string)``` | Available |
| ```deleteMany(ids : any[], tableName: string)``` | Available |
| ```query(query: string/Object, values: Object)``` | Available |

### Repository

| Function | Usability |
| --- | --- |
| ```exists(id: any)``` | Usable |
| ```getOne(id: any)``` | Usable |
| ```get()``` | Usable |
| ```create(entity: Entity)``` | Usable |
| ```createMany(entities: Entity[])``` | Additional |
| ```update(entity: Entity)``` | Usable |
| ```delete(id: any)``` | Usable |
| ```find(condtions: string/Object)``` | Usable |
| ```getMany(ids: any[])``` | Usable |
| ```count(conditions)``` | Usable |