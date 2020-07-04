const assert = require('assert');
const utils = require('tramway-core-testsuite');
const lib = require('../dist/index.js');
var describeCoreClass = utils.describeCoreClass;
var describeFunction = utils.describeFunction;

describe("Simple acceptance tests to ensure library returns what's promised.", function(){
    describe("Should return a proper 'MySQLProvider' class", describeCoreClass(
        lib.default, 
        "MySQLProvider", 
        [],
        ["connect", "get", "getOne", "getMany", "has", "hasThese", "create", "createMany", "update", "delete", "deleteMany", "find", "count", "query", "execute", "executeTransaction", "prepareConditions", "prepareWhere", "flattenConditions", "closeConnection"]
    ));

    describe("Should return an object for repositories.", function(){
        it("Should return an object for repositories.", function(){
            assert.strictEqual(typeof lib.repositories, "object");
        });
        it("There should be the same services as in the previous version", function(){
            assert.deepEqual(Object.keys(lib.repositories), ["MySQLRepository"]);
        });
        describe("Should return a proper 'MySQLRepository' class", describeCoreClass(
            lib.repositories.MySQLRepository, 
            "MySQLRepository", 
            [],
            ["exists", "getOne", "get", "create", "createMany", "update", "delete", "find", "getMany", "count"]    
        ));
    });
});