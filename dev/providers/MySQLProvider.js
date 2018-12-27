import {Provider} from 'tramway-core-connection';
import mysql from 'mysql';

export default class MySQLProvider extends Provider {
    /**
     * 
     * @param {Object} params Configurable params as per https://github.com/mysqljs/mysql#connection-options 
     */
    constructor(params = {}) {
        super();

        this.params = params;

        this.connect(params);

        this.connection.on('error', err => {
            if ('ECONNRESET' === err.code) {
                this.connect(params);
            } else {
                throw err;
            }
        });
    }

    connect(params) {
        if (!params) {
            params = this.params;
        }

        const {database, username, password, dialect, host, ...rest} = params;
        this.connection = mysql.createConnection({
            host,
            user: username,
            password,
            database,
            ...rest,
        });
    }

    /**
     * @param {number|string} id
     * @param {string} tableName
     * @returns {Promise<Object>}
     * 
     * @memberOf Provider
     */
    async getOne(id, tableName) {
        const template = `SELECT * FROM ?? WHERE id = ?`;
        let query = mysql.format(template, [tableName, id]);
        return await this.execute(query);
    }

    /**
     * @param {string[] | number[]} ids
     * @param {string} tableName
     * 
     * @memberOf Provider
     */
    async getMany(ids, tableName) {
        const template = `SELECT * FROM ?? WHERE id IN (?)`;
        let query = mysql.format(template, [tableName, ids]);
        return await this.execute(query);
    }

    /**
     * @param {string} tableName
     * @memberOf Provider
     */
    async get(tableName) {
        const template = `SELECT * FROM ??`;
        let query = mysql.format(template, [tableName]);
        return await this.execute(query);
    }

    /**
     * @param {string | Object} conditions
     * @param {string} tableName
     * 
     * @memberOf Provider
     */
    async find(conditions, tableName) {
        conditions = this.prepareConditions(conditions);
        const template = `SELECT * FROM ?? ${conditions.length ? `WHERE ${this.prepareWhere(conditions)}` : ''}`;
        let query = mysql.format(template, [tableName, ...this.flattenConditions(conditions)]);
        return await this.execute(query);
    }

    /**
     * @param {number|string} id
     * @param {string} tableName
     * @returns {Promise<boolean>}
     * 
     * @memberOf Provider
     */
    async has(id, tableName) {
        return await this.getOne(id, tableName);
    }

    /**
     * @param { string[] | number[] } ids
     * @param {string} tableName
     * 
     * @memberOf Provider
     */
    async hasThese(ids, tableName) {
        return await this.getMany(ids, tableName);
    }

    /**
     * @param {string | Object} conditions
     * @param {string} tableName
     * 
     * @memberOf Provider
     */
    async count(conditions = {}, tableName) {
        conditions = this.prepareConditions(conditions);
        const template = `SELECT COUNT(1) FROM ?? ${conditions.length ? `WHERE ${this.prepareWhere(conditions)}` : ''}`;
        let query = mysql.format(template, [tableName, ...this.flattenConditions(conditions)]);
        return await this.execute(query);
    }

    /**
     * @param {Object} item
     * @param {string} tableName
     * 
     * @memberOf Provider
     */
    async create(item, tableName) {
        const template = `INSERT INTO ?? SET ?`;
        let query = mysql.format(template, [tableName, item]);
        return await this.execute(query);
    }

    /**
     * @param {Object[]} items
     * @param {string} tableName
     * 
     * @memberOf Provider
     */
    async createMany(items, tableName) {
        const template = `INSERT INTO ?? SET ?`;
        let queries = items.map(item => mysql.format(template, [tableName, item]));
        return await this.executeTransaction(queries);
    }

    /**
     * @param {number|string} id
     * @param {Object} item
     * @param {string} tableName
     * 
     * @memberOf Provider
     */
    async update(id, item, tableName) {
        const template = `UPDATE ?? SET ? WHERE id = ?`;
        const {id: itemId, ...entity} = item;

        let query = mysql.format(template, [tableName, entity, id]);
        return await this.execute(query);
    }

    /**
     * @param {number|string} id
     * @param {string} tableName
     * 
     * @memberOf Provider
     */
    async delete(id, tableName) {
        const template = `DELETE FROM ?? WHERE id = ?`;
        let query = mysql.format(template, [tableName, id]);
        return await this.execute(query);
    }

    /**
     * @param { number[] | string[]} id
     * @param {string} tableName
     * 
     * @memberOf Provider
     */
    async deleteMany(ids, tableName) {
        const template = `DELETE FROM ?? WHERE id IN (?)`;
        let query = mysql.format(template, [tableName, ids]);
        return await this.execute(query);
    }

    /**
     * Recommended to use other functions first.
     * @param {string} query
     * @param {[] | Object} values
     * 
     * @memberOf Provider
     */
    async query(query, values) {
        query = mysql.format(query, values);
        return await this.execute(query);
    } 

    async execute(query) {
        return new Promise((resolve, reject) => {
            return this.connection.query(query, (error, results, fields) => {
                if (error) {
                    reject(error);
                }

                return resolve(results);
            });
        });
    }

    async executeTransaction(queries) {
        return new Promise(resolve => {
            this.connection.beginTransaction(async (err) => {
                if (err) {
                    throw err;
                }

                queries = queries.map(query => new Promise(resolve => {
                    return this.connection.query(query, (error, results, fields) => {
                        if (error) {
                            return this.connection.rollback(() => {
                                throw error;
                            });
                        }

                        return resolve(results);
                    });
                }));

                let results = await Promise.all(queries).then(() => {
                    return this.connection.commit(err => {
                        if (err) {
                            return this.connection.rollback(() => {
                                throw err;
                            });
                        }
                    });
                });

                return resolve(results);
            });
        });
    }

    /**
     * 
     * @param {{key: value}} conditions 
     * @returns {[[key, value]]}
     */
    prepareConditions(conditions) {
        return Object.keys(conditions).map(key => [key, conditions[key]]);
    }

    /**
     * 
     * @param {[[key, value]]} conditions 
     * @returns {string}
     */
    prepareWhere(conditions) {
        return conditions.map(c => '?? = ?').join(' AND ');
    }

    /**
     * 
     * @param {[[key, value]]} conditions 
     * @returns {[key, value, key, value]}
     */
    flattenConditions(conditions) {
        return conditions.reduce((res, current) => [...res, ...current]);
    }
}