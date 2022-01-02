import { DataType, NumOrStr, SchemaItem } from '../../types';
import Utils from '../Util';
import ValidatonOperators from './ValidationOperators';
import { ValidationResponse } from '../Response';

// FIXME: Validation Error Messages
export default class SchemaValidator extends ValidatonOperators {
	private siValCaseType(propertyName: string, value: any, dataType: DataType, errors: Array<string>): boolean {
		const typeValRes = this.validateType(dataType, value);
		if (!typeValRes) {
			errors.push(`Type mismatch at property ${propertyName}. Expected ${dataType}, found ${typeof value}`);
		}
		return typeValRes;
	}

	private siValCaseIsEmail(propertyName: string, email: string, errors: Array<string>): boolean {
		try {
			const isEmailRes = ValidatonOperators.isEmail(email);
			if (!isEmailRes) {
				errors.push(`${Utils.capitalize(propertyName)} should be a valid email`);
			}
			return isEmailRes;
		} catch (error) {
			errors.push(error as any);
		}
		return false;
	}

	private siValCaseLte(keyName: string, value: NumOrStr, test: number, errors: Array<string>): boolean {
		try {
			const pass = ValidatonOperators.lte(value, test);
			if (!pass) errors.push(`${keyName} should be <= ${test}. Value found ${value}`);
			return pass;
		} catch (error) {
			errors.push(error as string);
		}
		return false;
	}

	private siValCaseGte(keyName: string, value: NumOrStr, test: number, errors: Array<string>): boolean {
		try {
			const pass = ValidatonOperators.gte(value, test);
			if (!pass) {
				errors.push(`${keyName} should be >= ${test}. Value found ${value}`);
			}
			return pass;
		} catch (error) {
			errors.push(error as string);
		}
		return false;
	}

	private siValCaseLt(keyName: string, value: NumOrStr, test: number, errors: Array<string>): boolean {
		try {
			const pass = ValidatonOperators.lt(value, test);
			if (!pass) errors.push(`${keyName} should be < ${test}. Value found ${value}`);
			return pass;
		} catch (error) {
			errors.push(error as string);
		}
		return false;
	}

	private siValCaseGt(keyName: string, value: NumOrStr, test: number, errors: Array<string>): boolean {
		try {
			const pass = ValidatonOperators.gt(value, test);
			if (!pass) errors.push(`${keyName} should be > ${test}. Value found ${value}`);
			return pass;
		} catch (error) {
			errors.push(error as string);
		}
		return false;
	}

	private siValCaseLength(keyName: string, value: NumOrStr, length: number, errors: Array<string>): boolean {
		try {
			const pass = ValidatonOperators.len(value, length);
			if (!pass) errors.push(`Length of ${keyName} should be ${length}`);
			return pass;
		} catch (error) {
			errors.push(error as string);
		}
		return false;
	}

	private siValCaseRange(
		keyName: string,
		value: NumOrStr,
		from: number,
		to: number,
		errors: Array<string>,
		inclusive?: boolean
	) {
		try {
			const pass = ValidatonOperators.range(value, from, to, inclusive);
			if (!pass) errors.push(`Length of ${keyName} should be ${length}`);
			return pass;
		} catch (error) {
			errors.push(error as string);
		}
		return false;
	}

	protected validateSchemaItem(keyName: string, schemaItem: SchemaItem, objValue: any): ValidationResponse {
		let success = true;
		let errors: Array<string> = [];
		// Validate only if value is present
		if (!Utils.isNullOrUndefined(objValue)) {
			for (const key of Object.keys(schemaItem)) {
				switch (key) {
					case 'type':
						success = success && this.siValCaseType(keyName, objValue, schemaItem['type'], errors);
						break;

					case 'lte':
						success = success && this.siValCaseLte(keyName, objValue, schemaItem['lte']!, errors);
						break;

					case 'lt':
						// lt will be processed only if lte is not set
						if (!Utils.objectHasKey(schemaItem, 'lte')) {
							success = success && this.siValCaseLt(keyName, objValue, schemaItem['lt']!, errors);
						}
						break;

					case 'gt':
						if (!Utils.objectHasKey(schemaItem, 'gte')) {
							success = success && this.siValCaseGt(keyName, objValue, schemaItem['gt']!, errors);
						}
						break;

					case 'gte':
						success = success && this.siValCaseGte(keyName, objValue, schemaItem['gte']!, errors);
						break;

					case 'len':
						success = success && this.siValCaseLength(keyName, objValue, schemaItem['length']!, errors);
						break;

					case 'range':
						const { from, to, inclusive } = schemaItem['range']!;
						success = success && this.siValCaseRange(keyName, objValue, from, to, errors, inclusive);
						break;

					case 'isEmail':
						success = success && this.siValCaseIsEmail(keyName, objValue, errors);
						break;
				}
			}
		}
		return new ValidationResponse(success, errors);
	}

	protected validateType(targetType: DataType, value: any): boolean {
		const inputType = typeof value;
		let result: boolean = true;
		switch (targetType) {
			case DataType.String:
				result = inputType === 'string';
				break;

			case DataType.Integer:
				result = inputType === 'number' && Number.isSafeInteger(value);
				break;
			case DataType.Decimal:
				result = inputType === 'number' && Number.isFinite(value);
				break;

			case DataType.Date:
				let date = new Date(value);
				result = !isNaN(date.getTime());
				break;
		}
		return result;
	}
}
