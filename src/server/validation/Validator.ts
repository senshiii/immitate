import { DataType, Model, Schema, SchemaItem, StringIndexedObject } from '../../types';
import Utils from '../Util';
import SchemaValidator from './SchemaValidator';
import { ValidationResponse } from '../Response';

export default class Validator extends SchemaValidator {
	private static hasExtraKey(schema: StringIndexedObject, body: StringIndexedObject): string | undefined {
		const schemaKeys = Object.keys(schema);
		const bodyKeys = Object.keys(body);
		// console.info("Schema Keys", schemaKeys, "Body Keys", bodyKeys)
		return bodyKeys.find((key) => !schemaKeys.includes(key));
	}

	createOperationValidation(model: Model, body: StringIndexedObject): ValidationResponse {
		const { schema, strictStructure, includeTimestamps } = model;

		if (typeof schema !== 'object') {
			throw new Error('Invalid Schema');
		}

		// Checking for timestamps being manually set
		if (includeTimestamps && (Utils.objectHasKey(body, 'createdAt') || Utils.objectHasKey(body, 'updatedAt'))) {
			return new ValidationResponse(false, ['Cannot set timestamp properties manually when']);
		} else if (Utils.objectHasKey(body, 'id')) {
			// Checking for manually set id
			return new ValidationResponse(false, ['ID is a reserved field and cannot be set manually']);
		}

		// Check for unknown/extra key if schema is strict
		if (typeof body === 'object' && strictStructure) {
			const extraKey = Validator.hasExtraKey(schema, body);
			if (extraKey) return new ValidationResponse(false, [`Unknown property ${extraKey}`]);
		}

		let bodyHasKey: boolean;
		for (const key of Object.keys(schema)) {
			bodyHasKey = Utils.objectHasKey(body, key);
			if (typeof schema[key] == 'object') {
				// SchemaItem Validation
				if (Utils.objectHasKey(schema[key] as StringIndexedObject, 'type')) {
					// Required property check
					let schemaItem: SchemaItem = schema[key] as SchemaItem;
					if (schemaItem.required && !bodyHasKey) {
						return new ValidationResponse(false, [`Required property ${key} missing`]);
					}

					// If the field is set on "body"
					// the property is validating based on validation options (other then "required")
					// If the field is required then it is already validated in the previous step
					if (bodyHasKey) {
						const siValRes = this.validateSchemaItem(key, schema[key] as SchemaItem, body[key]);
						if (!siValRes.success) return siValRes;
					}
				} else {
					// Custom Nested Object Found. Recursively validate the nested object
					
					// Checking if body[key] contains nested object
					if (bodyHasKey && typeof body[key] != 'object')
						return new ValidationResponse(false, [`Expecting ${key} to be an object, found ${typeof body[key]}`]);
					const nestObjRes = this.createOperationValidation({ ...model, schema: schema[key] as Schema }, body[key]);
					if (!nestObjRes.success) return nestObjRes;
				}
			} else if (bodyHasKey) {
				// If the schema element is not an object that means only the data type is set
				// Validate field type only if set in "body"
				if (!this.validateType(schema[key] as DataType, body[key]))
					return new ValidationResponse(false, [`Type mismatch for key ${key}`]);
			}
		}

		return new ValidationResponse(true);
	}

	updateOperationValidation(model: Model, body: StringIndexedObject): ValidationResponse {
		const { schema, strictStructure, includeTimestamps } = model;

		// Checking if both parameters are objects
		if (typeof schema !== 'object') {
			throw new Error('Invalid Schema');
		}

		// Checking for automatic keys
		if (includeTimestamps && (Utils.objectHasKey(body, 'createdAt') || Utils.objectHasKey(body, 'updatedAt'))) {
			return new ValidationResponse(false, ['Cannot update timestamp properties manually']);
		} else if (Utils.objectHasKey(body, 'id')) {
			return new ValidationResponse(false, ['ID is a reserved field and cannot be set manually']);
		}

		// Check for unknown/extra key if schema is strict
		if (typeof body === 'object' && strictStructure) {
			const extraKey = Validator.hasExtraKey(schema, body);
			if (extraKey) return new ValidationResponse(false, [`Unknown property ${extraKey}`]);
		}

		let bodyHasKey: boolean;
		for (const key of Object.keys(schema)) {
			bodyHasKey = Utils.objectHasKey(body, key);
			// Validate property if set in updation body
			if (bodyHasKey) {
				if (typeof schema[key] === 'object') {
					// SchemaItem Validation
					if (Utils.objectHasKey(schema[key] as StringIndexedObject, 'type')) {
						const siValRes = this.validateSchemaItem(key, schema[key] as SchemaItem, body[key]);
						if (!siValRes.success) return siValRes;
					} else {
						// Custom Nested Object Found
						const nestObjRes = this.updateOperationValidation({ ...model, schema: schema[key] as Schema }, body[key]);
						if (!nestObjRes.success) return nestObjRes;
					}
				} else if (bodyHasKey) {
					// If the schema element is not an object that means only the data type is set
					// Validate field type only if set in "body"
					if (!this.validateType(schema[key] as DataType, body[key]))
						return new ValidationResponse(false, [`Type mismatch for key ${key}`]);
				}
			}
		}

		return new ValidationResponse(true);
	}
}
