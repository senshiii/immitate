import { EntityLike, Model, Schema, SchemaItem, StringIndexedObject } from '../../types';
import Utils from '../Util';
import { randomBytes } from 'crypto';
import FileOps from './FileOps';
import fs from 'fs';
import lodash from 'lodash';
import { ServerResponse } from '../Response';
import QueryProcessor from './QueryProcessor';
import Logger from '../../logging/Logger';

interface DbOperations {
	findAll(modelName: string, queryParams?: StringIndexedObject): Promise<Array<EntityLike>>;

	findById(modelName: string, id: string): Promise<EntityLike>;

	create(modelName: string, model: Model, body: StringIndexedObject): Promise<EntityLike>;

	update(
		modelName: string,
		body: StringIndexedObject,
		updateTimestamp: boolean,
		queryParams?: StringIndexedObject
	): Promise<Array<EntityLike>>;

	updateById(
		modelName: string,
		id: string,
		updateParams: StringIndexedObject,
		updateTimestamp: boolean
	): Promise<EntityLike>;

	delete(modelName: string, queryParams?: StringIndexedObject): Promise<ServerResponse>;

	deleteById(modelName: string, id: string): Promise<ServerResponse>;
}

export default class Database implements DbOperations {
	private _dbPath: string = '';
	private db: StringIndexedObject = {};

	constructor() {}

	private static addToCollection(dataObject: StringIndexedObject, modelName: string, newData: StringIndexedObject) {
		if (Utils.objectHasKey(dataObject, modelName) && Array.isArray(dataObject[modelName])) {
			dataObject[modelName].push(newData);
		} else {
			dataObject[modelName] = [newData];
		}
	}

	private static generatedId(): string {
		return randomBytes(10).toString('hex');
	}

	private autoInsertFields(schema: Schema, body: StringIndexedObject, autoInsert: boolean): StringIndexedObject {
		// console.log('[autoInsertFields] body', body)
		if (Utils.isNullOrUndefined(body)) body = {};
		for (const key of Object.keys(schema)) {
			if (typeof schema[key] === 'object') {
				// Schema Key contains an object
				if (Utils.objectHasKey(schema[key] as Schema, 'type')) {
					// SchemaItem Object
					if (Utils.objectHasKey(schema[key] as StringIndexedObject, 'default')) {
						// Default Value is provided
						// Setting Value to provided default value
						body[key] = (schema[key] as SchemaItem)['default'];
					}
				} else if (autoInsert)
					// Custom Object detected. Recursively filling custom object
					body[key] = this.autoInsertFields(schema[key] as Schema, body[key], autoInsert);
			}
			if (!Utils.objectHasKey(body, key) && autoInsert) {
				body[key] = null;
			}
		}

		return body;
	}

	findAll(modelName: string, queryParams?: StringIndexedObject): Promise<EntityLike[]> {
		if (!Utils.isNullOrUndefined(queryParams) && Object.keys(queryParams!).length > 0)
			return Promise.resolve(
				QueryProcessor.filterArrayByQueries(this.db[modelName], queryParams!) as Array<EntityLike>
			);
		return Promise.resolve(this.db[modelName] ?? []);
	}

	findById(modelName: string, id: string): Promise<EntityLike> {
		const entities: Array<EntityLike> = this.db[modelName] ?? [];
		const searchedEntity = entities.find((e) => e.id == id);
		if (Utils.isNullOrUndefined(searchedEntity))
			return Promise.reject(new ServerResponse(404, `Could not find ${Utils.capitalize(modelName)} with id = ${id}`));

		return Promise.resolve(searchedEntity as EntityLike);
	}

	create(modelName: string, model: Model, body: StringIndexedObject): Promise<EntityLike> {
		const { schema, timestamps, strict } = model;

		// TODO: ADD VALIDATION

		// CREATING THE ENTITY OBJECT
		const entity = this.autoInsertFields(
			schema,
			{
				id: Database.generatedId(),
				...JSON.parse(JSON.stringify(body)),
			},
			strict ?? false
		) as EntityLike;

		// Add TIMESTAMPS
		if (timestamps) {
			const date = new Date().toLocaleString();
			entity['createdAt'] = date;
			entity['updatedAt'] = date;
		}

		// Add to in-memory db object
		Database.addToCollection(this.db, modelName, entity);

		// Write updated data object to db.json
		FileOps.writeObjectToFile(this._dbPath, this.db);
		return Promise.resolve(entity);
	}

	update(
		modelName: string,
		body: StringIndexedObject,
		updateTimestamp: boolean,
		queryParams?: StringIndexedObject
	): Promise<EntityLike[]> {
		if (Utils.objectHasKey(body, 'id')) delete body['id'];
		else if (Utils.objectHasKey(body, 'createdAt')) delete body['createdAt'];
		else if (Utils.objectHasKey(body, 'updatedAt')) delete body['updatedAt'];

		// Empty Collection
		if (!Utils.objectHasKey(this.db, modelName)) {
			return Promise.reject({
				status: 404,
				message: `Could not find any ${modelName}. ${Utils.capitalize(modelName)}s`,
			});
		}

		let updateIds: Array<string> = [];
		const updatedEntities: Array<EntityLike> = [];
		if (!Utils.isNullOrUndefined(queryParams) && Object.keys(queryParams!).length > 0) {
			updateIds = QueryProcessor.filterArrayByQueries(this.db[modelName], queryParams!).map((item) => item.id);
			// console.log('[Database.update] Updated Ids', updateIds);
		} else {
			updateIds = (this.db[modelName] as Array<EntityLike>).map((item) => item.id);
		}

		// Setting the updated list of entities
		this.db[modelName] = (this.db[modelName] as Array<EntityLike>).map((ce) => {
			if (updateIds.includes(ce.id)) {
				ce = lodash.merge(ce, body);
				if (updateTimestamp) ce['updatedAt'] = new Date().toLocaleString();
				updatedEntities.push(ce);
			}
			return ce;
		});

		FileOps.writeObjectToFile(this._dbPath, this.db);

		return Promise.resolve(updatedEntities);
	}

	updateById(modelName: string, id: string, body: StringIndexedObject, updateTimestamp: boolean): Promise<EntityLike> {
		// Remove Auto-set properties
		if (Utils.objectHasKey(body, 'id')) delete body['id'];
		else if (Utils.objectHasKey(body, 'createdAt')) delete body['createdAt'];
		else if (Utils.objectHasKey(body, 'updatedAt')) delete body['updatedAt'];

		// Empty Collection
		if (!Utils.objectHasKey(this.db, modelName)) {
			return Promise.reject({
				status: 404,
				message: `Could not update ${modelName}. ${Utils.capitalize(modelName)} with id = ${id} not found`,
			});
		}

		let updatedEntity: EntityLike | unknown;

		// List of entities
		let collectionEntities = this.db[modelName] as Array<EntityLike>;
		// Locating and updating the entity
		collectionEntities = collectionEntities.map((ce) => {
			if (ce.id === id) {
				ce = lodash.merge(ce, body);
				if (updateTimestamp) ce['updatedAt'] = new Date().toLocaleString();
				updatedEntity = ce;
			}
			return ce;
		});
		// Setting the updated list of entities
		this.db[modelName] = collectionEntities;

		// Entity to be updated does not exist
		if (!updatedEntity) {
			return Promise.reject({
				status: 404,
				message: `Could not updated ${modelName}. ${Utils.capitalize(modelName)} with id = ${id} not found`,
			});
		}

		FileOps.writeObjectToFile(this._dbPath, this.db);
		return Promise.resolve(updatedEntity as EntityLike);
	}

	delete(modelName: string, queryParams?: StringIndexedObject): Promise<ServerResponse> {
		let length: number = 0;
		if (Utils.objectHasKey(this.db, modelName)) {
			// Filter by query params and delete
			if (!Utils.isNullOrUndefined(queryParams) && Object.keys(queryParams!).length > 0) {
				// Filtering the entities and retaining the ids of the entities to be deleted
				const deleteIds = QueryProcessor.filterArrayByQueries(this.db[modelName], queryParams!).map(
					(entity) => entity.id
				);
				length = deleteIds.length;

				this.db[modelName] = (this.db[modelName] as Array<EntityLike>).filter(
					(entity) => !deleteIds.includes(entity.id)
				);

				FileOps.writeObjectToFile(this._dbPath, this.db);
			} else {
				// Delete all entities
				length = (this.db[modelName] as Array<EntityLike>).length;
				delete this.db[modelName];
			}
		} else {
			return Promise.reject(new ServerResponse(404, `No entities found for ${Utils.capitalize(modelName)}`));
		}
		FileOps.writeObjectToFile(this._dbPath, this.db);
		const res = new ServerResponse(200, `Deleted ${length} entities from ${modelName}`);
		return Promise.resolve(res);
	}

	deleteById(modelName: string, id: string): Promise<ServerResponse> {
		const entities: Array<EntityLike> = this.db[modelName] ?? [];
		// No entities present
		if (entities.length == 0) {
			return Promise.reject(new ServerResponse(404, `No entities found for ${Utils.capitalize(modelName)}`));
		}

		// Searching targeted entity
		const searchedEntity = entities.find((e) => e.id == id);
		if (Utils.isNullOrUndefined(searchedEntity)) {
			return Promise.reject(new ServerResponse(404, `${Utils.capitalize(modelName)} with id = ${id} does not exist`));
		}

		this.db[modelName] = entities.filter((e) => e.id != id);
		FileOps.writeObjectToFile(this._dbPath, this.db);
		return Promise.resolve(new ServerResponse(200, `Successfully deleted ${modelName} with id = ${id}`));
	}

	set dbPath(dbPath: string) {
		this._dbPath = dbPath;
	}

	createDbFile(removeExisting: boolean) {
		if (fs.existsSync(this._dbPath)) {
			Logger.warn(`Db File existing at ${this._dbPath}`);
			if (removeExisting) {
				Logger.warn('Removing previous data in db file');
				FileOps.writeObjectToFile(this._dbPath, {});
			} else {
				// Loading existing data into memory
				try {
					this.db = FileOps.readObjectFromFile(this._dbPath);
				} catch (error) {
					console.error('Failed to read previous data. Resetting Data');
					FileOps.writeObjectToFile(this._dbPath, {});
				}
			}
			return;
		}
		Logger.ok(`DB file created at ${this._dbPath}`);
		FileOps.writeObjectToFile(this._dbPath, {});
	}
}
