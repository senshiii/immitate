export enum DataType {
	Date = 'Date',
	Integer = 'Integer',
	Decimal = 'Decimal',
	String = 'String',
}

export enum DefaultRoutes {
	GET_BY_ID = 'GET_BY_ID',
	GET = 'GET',
	CREATE = 'CREATE',
	UPDATE = 'UPDATE',
	UPDATE_BY_ID = 'UPDATE_BY_ID',
	DELETE = 'DELETE',
	DELETE_BY_ID = 'DELETE_BY_ID',
	ALL = 'ALL',
}

export interface Error {
	status: number;
	message: string;
}

export type StringIndexedObject = { [x: string]: any };
export type EntityLike = StringIndexedObject & { id: string };

interface ValidationOptionsList {
	lt: number;
	lte: number;
	gt: number;
	gte: number;
	len: number; // Checks whether a number or string is of the exact length.
	range: {
		from: number;
		to: number;
		inclusive?: boolean;
	};
	isEmail: boolean; // Checks whether a string is an email
}
type ValidationOptions = Partial<ValidationOptionsList>;
export interface ValidationResult {
	errors: Array<string>;
	success: boolean;
}

// TODO: Add "unique"
export interface SchemaItem extends ValidationOptions {
	type: DataType;
	required?: boolean;
	default?: any;
}
export type Schema = { [x: string]: SchemaItem | DataType | Schema };
export interface Model {
	schema: Schema;
	strictStructure?: boolean; // Determines whether flexibility should be allowed in the structure
	includeTimestamps?: boolean;
}

export declare interface Route {
	resource: string;
	model: string;
	routes: Array<DefaultRoutes>;
}

export declare interface DbOptions {
	name?: string;
	removeExisting: boolean; // Default = false. Deletes the existing db.json on server restart
}

export declare interface ConfigOptions {
	port?: number;
	db?: DbOptions | string;
	models: { [x: string]: Model };
	routes: Array<Route>;
}

export type NumOrStr = number | string;
