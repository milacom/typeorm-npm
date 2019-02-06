var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { EntityManager } from "./EntityManager";
import { DocumentToEntityTransformer } from "../query-builder/transformer/DocumentToEntityTransformer";
import { FindOptionsUtils } from "../find-options/FindOptionsUtils";
import { PlatformTools } from "../platform/PlatformTools";
import { InsertResult } from "../query-builder/result/InsertResult";
import { UpdateResult } from "../query-builder/result/UpdateResult";
import { DeleteResult } from "../query-builder/result/DeleteResult";
/**
 * Entity manager supposed to work with any entity, automatically find its repository and call its methods,
 * whatever entity type are you passing.
 *
 * This implementation is used for MongoDB driver which has some specifics in its EntityManager.
 */
var MongoEntityManager = /** @class */ (function (_super) {
    __extends(MongoEntityManager, _super);
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function MongoEntityManager(connection) {
        return _super.call(this, connection) || this;
    }
    Object.defineProperty(MongoEntityManager.prototype, "queryRunner", {
        // -------------------------------------------------------------------------
        // Overridden Properties
        // -------------------------------------------------------------------------
        /**
         * Gets query runner used to execute queries.
         */
        get: function () {
            return this.connection.driver.queryRunner;
        },
        enumerable: true,
        configurable: true
    });
    // -------------------------------------------------------------------------
    // Overridden Methods
    // -------------------------------------------------------------------------
    /**
     * Finds entities that match given find options or conditions.
     */
    MongoEntityManager.prototype.find = function (entityClassOrName, optionsOrConditions) {
        return __awaiter(this, void 0, void 0, function () {
            var query, cursor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.convertFindOptionsOrConditionsToMongodbQuery(optionsOrConditions);
                        return [4 /*yield*/, this.createEntityCursor(entityClassOrName, query)];
                    case 1:
                        cursor = _a.sent();
                        if (FindOptionsUtils.isFindOptions(optionsOrConditions)) {
                            if (optionsOrConditions.skip)
                                cursor.skip(optionsOrConditions.skip);
                            if (optionsOrConditions.take)
                                cursor.limit(optionsOrConditions.take);
                            if (optionsOrConditions.order)
                                cursor.sort(this.convertFindOptionsOrderToOrderCriteria(optionsOrConditions.order));
                        }
                        return [2 /*return*/, cursor.toArray()];
                }
            });
        });
    };
    /**
     * Finds entities that match given find options or conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (from and take options).
     */
    MongoEntityManager.prototype.findAndCount = function (entityClassOrName, optionsOrConditions) {
        return __awaiter(this, void 0, void 0, function () {
            var query, cursor, _a, results, count;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query = this.convertFindOptionsOrConditionsToMongodbQuery(optionsOrConditions);
                        return [4 /*yield*/, this.createEntityCursor(entityClassOrName, query)];
                    case 1:
                        cursor = _b.sent();
                        if (FindOptionsUtils.isFindOptions(optionsOrConditions)) {
                            if (optionsOrConditions.skip)
                                cursor.skip(optionsOrConditions.skip);
                            if (optionsOrConditions.take)
                                cursor.limit(optionsOrConditions.take);
                            if (optionsOrConditions.order)
                                cursor.sort(this.convertFindOptionsOrderToOrderCriteria(optionsOrConditions.order));
                        }
                        return [4 /*yield*/, Promise.all([
                                cursor.toArray(),
                                this.count(entityClassOrName, query),
                            ])];
                    case 2:
                        _a = __read.apply(void 0, [_b.sent(), 2]), results = _a[0], count = _a[1];
                        return [2 /*return*/, [results, parseInt(count)]];
                }
            });
        });
    };
    /**
     * Finds entities by ids.
     * Optionally find options can be applied.
     */
    MongoEntityManager.prototype.findByIds = function (entityClassOrName, ids, optionsOrConditions) {
        return __awaiter(this, void 0, void 0, function () {
            var metadata, query, objectIdInstance, cursor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        metadata = this.connection.getMetadata(entityClassOrName);
                        query = this.convertFindOptionsOrConditionsToMongodbQuery(optionsOrConditions) || {};
                        objectIdInstance = PlatformTools.load("mongodb").ObjectID;
                        query["_id"] = { $in: ids.map(function (id) {
                                if (id instanceof objectIdInstance)
                                    return id;
                                return id[metadata.objectIdColumn.propertyName];
                            }) };
                        return [4 /*yield*/, this.createEntityCursor(entityClassOrName, query)];
                    case 1:
                        cursor = _a.sent();
                        if (FindOptionsUtils.isFindOptions(optionsOrConditions)) {
                            if (optionsOrConditions.skip)
                                cursor.skip(optionsOrConditions.skip);
                            if (optionsOrConditions.take)
                                cursor.limit(optionsOrConditions.take);
                            if (optionsOrConditions.order)
                                cursor.sort(this.convertFindOptionsOrderToOrderCriteria(optionsOrConditions.order));
                        }
                        return [4 /*yield*/, cursor.toArray()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Finds first entity that matches given conditions and/or find options.
     */
    MongoEntityManager.prototype.findOne = function (entityClassOrName, optionsOrConditions, maybeOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var objectIdInstance, id, query, cursor, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        objectIdInstance = PlatformTools.load("mongodb").ObjectID;
                        id = (optionsOrConditions instanceof objectIdInstance) || typeof optionsOrConditions === "string" ? optionsOrConditions : undefined;
                        query = this.convertFindOneOptionsOrConditionsToMongodbQuery((id ? maybeOptions : optionsOrConditions)) || {};
                        if (id) {
                            query["_id"] = (id instanceof objectIdInstance) ? id : new objectIdInstance(id);
                        }
                        return [4 /*yield*/, this.createEntityCursor(entityClassOrName, query)];
                    case 1:
                        cursor = _a.sent();
                        if (FindOptionsUtils.isFindOptions(optionsOrConditions)) {
                            if (optionsOrConditions.order)
                                cursor.sort(this.convertFindOptionsOrderToOrderCriteria(optionsOrConditions.order));
                        }
                        return [4 /*yield*/, cursor.limit(1).toArray()];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result.length > 0 ? result[0] : undefined];
                }
            });
        });
    };
    /**
     * Inserts a given entity into the database.
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient INSERT query.
     * Does not check if entity exist in the database, so query will fail if duplicate entity is being inserted.
     * You can execute bulk inserts using this method.
     */
    MongoEntityManager.prototype.insert = function (target, entity, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var result, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = new InsertResult();
                        if (!(entity instanceof Array)) return [3 /*break*/, 2];
                        _a = result;
                        return [4 /*yield*/, this.insertMany(target, entity)];
                    case 1:
                        _a.raw = _c.sent();
                        Object.keys(result.raw.insertedIds).forEach(function (key) {
                            var insertedId = result.raw.insertedIds[key];
                            result.generatedMaps.push(_this.connection.driver.createGeneratedMap(_this.connection.getMetadata(target), insertedId));
                            result.identifiers.push(_this.connection.driver.createGeneratedMap(_this.connection.getMetadata(target), insertedId));
                        });
                        return [3 /*break*/, 4];
                    case 2:
                        _b = result;
                        return [4 /*yield*/, this.insertOne(target, entity)];
                    case 3:
                        _b.raw = _c.sent();
                        result.generatedMaps.push(this.connection.driver.createGeneratedMap(this.connection.getMetadata(target), result.raw.insertedId));
                        result.identifiers.push(this.connection.driver.createGeneratedMap(this.connection.getMetadata(target), result.raw.insertedId));
                        _c.label = 4;
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Updates entity partially. Entity can be found by a given conditions.
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient UPDATE query.
     * Does not check if entity exist in the database.
     */
    MongoEntityManager.prototype.update = function (target, criteria, partialEntity, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(criteria instanceof Array)) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all(criteria.map(function (criteriaItem) {
                                return _this.update(target, criteriaItem, partialEntity);
                            }))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        metadata = this.connection.getMetadata(target);
                        return [4 /*yield*/, this.updateOne(target, this.convertMixedCriteria(metadata, criteria), { $set: partialEntity })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, new UpdateResult()];
                }
            });
        });
    };
    /**
     * Deletes entities by a given conditions.
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient DELETE query.
     * Does not check if entity exist in the database.
     */
    MongoEntityManager.prototype.delete = function (target, criteria, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(criteria instanceof Array)) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all(criteria.map(function (criteriaItem) {
                                return _this.delete(target, criteriaItem);
                            }))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.deleteOne(target, this.convertMixedCriteria(this.connection.getMetadata(target), criteria))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, new DeleteResult()];
                }
            });
        });
    };
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Creates a cursor for a query that can be used to iterate over results from MongoDB.
     */
    MongoEntityManager.prototype.createCursor = function (entityClassOrName, query) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.cursor(metadata.tableName, query);
    };
    /**
     * Creates a cursor for a query that can be used to iterate over results from MongoDB.
     * This returns modified version of cursor that transforms each result into Entity model.
     */
    MongoEntityManager.prototype.createEntityCursor = function (entityClassOrName, query) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        var cursor = this.createCursor(entityClassOrName, query);
        this.applyEntityTransformationToCursor(metadata, cursor);
        return cursor;
    };
    /**
     * Execute an aggregation framework pipeline against the collection.
     */
    MongoEntityManager.prototype.aggregate = function (entityClassOrName, pipeline, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.aggregate(metadata.tableName, pipeline, options);
    };
    /**
     * Execute an aggregation framework pipeline against the collection.
     * This returns modified version of cursor that transforms each result into Entity model.
     */
    MongoEntityManager.prototype.aggregateEntity = function (entityClassOrName, pipeline, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        var cursor = this.queryRunner.aggregate(metadata.tableName, pipeline, options);
        this.applyEntityTransformationToCursor(metadata, cursor);
        return cursor;
    };
    /**
     * Perform a bulkWrite operation without a fluent API.
     */
    MongoEntityManager.prototype.bulkWrite = function (entityClassOrName, operations, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.bulkWrite(metadata.tableName, operations, options);
    };
    /**
     * Count number of matching documents in the db to a query.
     */
    MongoEntityManager.prototype.count = function (entityClassOrName, query, options, mongoOptions) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.count(metadata.tableName, query, mongoOptions);
    };
    /**
     * Creates an index on the db and collection.
     */
    MongoEntityManager.prototype.createCollectionIndex = function (entityClassOrName, fieldOrSpec, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.createCollectionIndex(metadata.tableName, fieldOrSpec, options);
    };
    /**
     * Creates multiple indexes in the collection, this method is only supported for MongoDB 2.6 or higher.
     * Earlier version of MongoDB will throw a command not supported error.
     * Index specifications are defined at http://docs.mongodb.org/manual/reference/command/createIndexes/.
     */
    MongoEntityManager.prototype.createCollectionIndexes = function (entityClassOrName, indexSpecs) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.createCollectionIndexes(metadata.tableName, indexSpecs);
    };
    /**
     * Delete multiple documents on MongoDB.
     */
    MongoEntityManager.prototype.deleteMany = function (entityClassOrName, query, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.deleteMany(metadata.tableName, query, options);
    };
    /**
     * Delete a document on MongoDB.
     */
    MongoEntityManager.prototype.deleteOne = function (entityClassOrName, query, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.deleteOne(metadata.tableName, query, options);
    };
    /**
     * The distinct command returns returns a list of distinct values for the given key across a collection.
     */
    MongoEntityManager.prototype.distinct = function (entityClassOrName, key, query, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.distinct(metadata.tableName, key, query, options);
    };
    /**
     * Drops an index from this collection.
     */
    MongoEntityManager.prototype.dropCollectionIndex = function (entityClassOrName, indexName, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.dropCollectionIndex(metadata.tableName, indexName, options);
    };
    /**
     * Drops all indexes from the collection.
     */
    MongoEntityManager.prototype.dropCollectionIndexes = function (entityClassOrName) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.dropCollectionIndexes(metadata.tableName);
    };
    /**
     * Find a document and delete it in one atomic operation, requires a write lock for the duration of the operation.
     */
    MongoEntityManager.prototype.findOneAndDelete = function (entityClassOrName, query, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.findOneAndDelete(metadata.tableName, query, options);
    };
    /**
     * Find a document and replace it in one atomic operation, requires a write lock for the duration of the operation.
     */
    MongoEntityManager.prototype.findOneAndReplace = function (entityClassOrName, query, replacement, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.findOneAndReplace(metadata.tableName, query, replacement, options);
    };
    /**
     * Find a document and update it in one atomic operation, requires a write lock for the duration of the operation.
     */
    MongoEntityManager.prototype.findOneAndUpdate = function (entityClassOrName, query, update, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.findOneAndUpdate(metadata.tableName, query, update, options);
    };
    /**
     * Execute a geo search using a geo haystack index on a collection.
     */
    MongoEntityManager.prototype.geoHaystackSearch = function (entityClassOrName, x, y, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.geoHaystackSearch(metadata.tableName, x, y, options);
    };
    /**
     * Execute the geoNear command to search for items in the collection.
     */
    MongoEntityManager.prototype.geoNear = function (entityClassOrName, x, y, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.geoNear(metadata.tableName, x, y, options);
    };
    /**
     * Run a group command across a collection.
     */
    MongoEntityManager.prototype.group = function (entityClassOrName, keys, condition, initial, reduce, finalize, command, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.group(metadata.tableName, keys, condition, initial, reduce, finalize, command, options);
    };
    /**
     * Retrieve all the indexes on the collection.
     */
    MongoEntityManager.prototype.collectionIndexes = function (entityClassOrName) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.collectionIndexes(metadata.tableName);
    };
    /**
     * Retrieve all the indexes on the collection.
     */
    MongoEntityManager.prototype.collectionIndexExists = function (entityClassOrName, indexes) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.collectionIndexExists(metadata.tableName, indexes);
    };
    /**
     * Retrieves this collections index info.
     */
    MongoEntityManager.prototype.collectionIndexInformation = function (entityClassOrName, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.collectionIndexInformation(metadata.tableName, options);
    };
    /**
     * Initiate an In order bulk write operation, operations will be serially executed in the order they are added, creating a new operation for each switch in types.
     */
    MongoEntityManager.prototype.initializeOrderedBulkOp = function (entityClassOrName, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.initializeOrderedBulkOp(metadata.tableName, options);
    };
    /**
     * Initiate a Out of order batch write operation. All operations will be buffered into insert/update/remove commands executed out of order.
     */
    MongoEntityManager.prototype.initializeUnorderedBulkOp = function (entityClassOrName, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.initializeUnorderedBulkOp(metadata.tableName, options);
    };
    /**
     * Inserts an array of documents into MongoDB.
     */
    MongoEntityManager.prototype.insertMany = function (entityClassOrName, docs, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.insertMany(metadata.tableName, docs, options);
    };
    /**
     * Inserts a single document into MongoDB.
     */
    MongoEntityManager.prototype.insertOne = function (entityClassOrName, doc, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.insertOne(metadata.tableName, doc, options);
    };
    /**
     * Returns if the collection is a capped collection.
     */
    MongoEntityManager.prototype.isCapped = function (entityClassOrName) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.isCapped(metadata.tableName);
    };
    /**
     * Get the list of all indexes information for the collection.
     */
    MongoEntityManager.prototype.listCollectionIndexes = function (entityClassOrName, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.listCollectionIndexes(metadata.tableName, options);
    };
    /**
     * Run Map Reduce across a collection. Be aware that the inline option for out will return an array of results not a collection.
     */
    MongoEntityManager.prototype.mapReduce = function (entityClassOrName, map, reduce, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.mapReduce(metadata.tableName, map, reduce, options);
    };
    /**
     * Return N number of parallel cursors for a collection allowing parallel reading of entire collection.
     * There are no ordering guarantees for returned results.
     */
    MongoEntityManager.prototype.parallelCollectionScan = function (entityClassOrName, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.parallelCollectionScan(metadata.tableName, options);
    };
    /**
     * Reindex all indexes on the collection Warning: reIndex is a blocking operation (indexes are rebuilt in the foreground) and will be slow for large collections.
     */
    MongoEntityManager.prototype.reIndex = function (entityClassOrName) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.reIndex(metadata.tableName);
    };
    /**
     * Reindex all indexes on the collection Warning: reIndex is a blocking operation (indexes are rebuilt in the foreground) and will be slow for large collections.
     */
    MongoEntityManager.prototype.rename = function (entityClassOrName, newName, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.rename(metadata.tableName, newName, options);
    };
    /**
     * Replace a document on MongoDB.
     */
    MongoEntityManager.prototype.replaceOne = function (entityClassOrName, query, doc, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.replaceOne(metadata.tableName, query, doc, options);
    };
    /**
     * Get all the collection statistics.
     */
    MongoEntityManager.prototype.stats = function (entityClassOrName, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.stats(metadata.tableName, options);
    };
    /**
     * Update multiple documents on MongoDB.
     */
    MongoEntityManager.prototype.updateMany = function (entityClassOrName, query, update, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.updateMany(metadata.tableName, query, update, options);
    };
    /**
     * Update a single document on MongoDB.
     */
    MongoEntityManager.prototype.updateOne = function (entityClassOrName, query, update, options) {
        var metadata = this.connection.getMetadata(entityClassOrName);
        return this.queryRunner.updateOne(metadata.tableName, query, update, options);
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Overrides cursor's toArray and next methods to convert results to entity automatically.
     */
    MongoEntityManager.prototype.applyEntityTransformationToCursor = function (metadata, cursor) {
        var ParentCursor = PlatformTools.load("mongodb").Cursor;
        cursor.toArray = function (callback) {
            if (callback) {
                ParentCursor.prototype.toArray.call(this, function (error, results) {
                    if (error) {
                        callback(error, results);
                        return;
                    }
                    var transformer = new DocumentToEntityTransformer();
                    return callback(error, transformer.transformAll(results, metadata));
                });
            }
            else {
                return ParentCursor.prototype.toArray.call(this).then(function (results) {
                    var transformer = new DocumentToEntityTransformer();
                    return transformer.transformAll(results, metadata);
                });
            }
        };
        cursor.next = function (callback) {
            if (callback) {
                ParentCursor.prototype.next.call(this, function (error, result) {
                    if (error || !result) {
                        callback(error, result);
                        return;
                    }
                    var transformer = new DocumentToEntityTransformer();
                    return callback(error, transformer.transform(result, metadata));
                });
            }
            else {
                return ParentCursor.prototype.next.call(this).then(function (result) {
                    if (!result)
                        return result;
                    var transformer = new DocumentToEntityTransformer();
                    return transformer.transform(result, metadata);
                });
            }
        };
    };
    /**
     * Converts FindOptions to mongodb query.
     */
    MongoEntityManager.prototype.convertFindOptionsOrConditionsToMongodbQuery = function (optionsOrConditions) {
        if (!optionsOrConditions)
            return undefined;
        if (FindOptionsUtils.isFindOptions(optionsOrConditions))
            return optionsOrConditions.where;
        return optionsOrConditions;
    };
    /**
     * Converts FindOneOptions to mongodb query.
     */
    MongoEntityManager.prototype.convertFindOneOptionsOrConditionsToMongodbQuery = function (optionsOrConditions) {
        if (!optionsOrConditions)
            return undefined;
        if (FindOptionsUtils.isFindOptions(optionsOrConditions))
            // If where condition is passed as a string which contains sql we have to ignore
            // as mongo is not a sql database
            return typeof optionsOrConditions.where === "string"
                ? {}
                : optionsOrConditions.where;
        return optionsOrConditions;
    };
    /**
     * Converts FindOptions into mongodb order by criteria.
     */
    MongoEntityManager.prototype.convertFindOptionsOrderToOrderCriteria = function (order) {
        return Object.keys(order).reduce(function (orderCriteria, key) {
            switch (order[key]) {
                case "DESC":
                    orderCriteria[key] = -1;
                    break;
                case "ASC":
                    orderCriteria[key] = 1;
                    break;
                default:
                    orderCriteria[key] = order[key];
            }
            return orderCriteria;
        }, {});
    };
    /**
     * Ensures given id is an id for query.
     */
    MongoEntityManager.prototype.convertMixedCriteria = function (metadata, idMap) {
        if (idMap instanceof Object) {
            return metadata.columns.reduce(function (query, column) {
                var columnValue = column.getEntityValue(idMap);
                if (columnValue !== undefined)
                    query[column.databasePath] = columnValue;
                return query;
            }, {});
        }
        // means idMap is just object id
        var objectIdInstance = PlatformTools.load("mongodb").ObjectID;
        return {
            "_id": (idMap instanceof objectIdInstance) ? idMap : new objectIdInstance(idMap)
        };
    };
    return MongoEntityManager;
}(EntityManager));
export { MongoEntityManager };

//# sourceMappingURL=MongoEntityManager.js.map
