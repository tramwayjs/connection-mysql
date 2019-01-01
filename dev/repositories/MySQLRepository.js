import {Repository} from 'tramway-core-connection';

export default class MySQLRepository extends Repository {
    /**
     * 
     * @param {MySQLProvider} provider 
     * @param {Factory} factory 
     * @param {string} tableName 
     */
    constructor(provider, factory, tableName) {
        super(provider, factory);
        this.tableName = tableName;
    }

    /**
     * @param {String|Number} id
     * @returns {boolean}
     * 
     * @memberOf Repository
     */
    async exists(id) {
        return await this.provider.has(id, this.tableName);
    }

    /**
     * @param {String|Number} id
     * @returns {Entity}
     * 
     * @memberOf Repository
     */
    async getOne(id) {
        let [item] = await this.provider.getOne(id, this.tableName);

        if (!item) {
            return;
        }

        return this.factory.create(item);
    }

    /**
     * @returns {Collection}
     * 
     * @memberOf Repository
     */
    async get() {
        let items = await this.provider.get(this.tableName);
        return this.factory.createCollection(items);
    }

    /**
     * @param {Entity} entity
     * @returns
     * 
     * @memberOf Repository
     */
    async create(entity) {
        entity = this.factory.create(entity);
        let item = await this.provider.create(entity, this.tableName);
        entity.setId(item.insertId);
        return entity;
    }

    /**
     * @param {Object[]} items
     * 
     * @memberOf Repository
     */
    async createMany(items) {
        items = items.map(entity => this.factory.create(entity));
        return await this.provider.createMany(items, this.tableName);
    }

    /**
     * @param {Entity} entity
     * @returns
     * 
     * @memberOf Repository
     */
    async update(entity) {
        entity = this.factory.create(entity);
        return await this.provider.update(entity.getId(), entity, this.tableName);
    }

    /**
     * @param {String|Number} id
     * @returns
     * 
     * @memberOf Repository
     */
    async delete(id) {
        return await this.provider.delete(id, this.tableName);
    }

    /**
     * @param {string | Object} conditions
     * @returns {Collection}
     * 
     * @memberOf Repository
     */
    async find(conditions) {
        let items = await this.provider.find(conditions, this.tableName);
        return this.factory.createCollection(items);
    }

    /**
     * @param {number[] | stringp[]} ids
     * @returns {Collection}
     * 
     * @memberOf Repository
     */
    async getMany(ids) {
        let items = await this.provider.getMany(ids, this.tableName);
        return this.factory.createCollection(items);
    }

    /**
     * @param {string | Object} conditions
     * 
     * @memberOf Repository
     */
    async count(conditions) {
        return await this.provider.count(conditions, this.tableName);
    }
}