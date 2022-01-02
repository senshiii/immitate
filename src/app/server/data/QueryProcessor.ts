import { StringIndexedObject } from '../../types';
import Utils from '../Util';
import ValidatonOperators from '../validation/ValidationOperators';

export default class QueryProcessor extends ValidatonOperators {
	private static evalQp(paramValue: any, inputVal: any, op: string | null): boolean {
		if (Utils.isNullOrUndefined(paramValue) || Utils.isNullOrUndefined(inputVal)) {
			return false;
		}

		if (op) {
			switch (op) {
				case 'lt':
					try {
						return ValidatonOperators.lt(inputVal, +paramValue);
					} catch (error) {
						return false;
					}
				case 'lte':
					try {
						return ValidatonOperators.lte(inputVal, +paramValue);
					} catch (error) {
						return false;
					}
				case 'gt':
					try {
						return ValidatonOperators.gt(inputVal, +paramValue);
					} catch (error) {
						return false;
					}
				case 'gte':
					try {
						return ValidatonOperators.gte(inputVal, +paramValue);
					} catch (error) {
						// console.log(error);
						return false;
					}
				case 'len':
					try {
						return ValidatonOperators.len(inputVal, +paramValue);
					} catch (error) {
						return false;
					}
			}
		}
		if (typeof inputVal == 'number') inputVal = `${inputVal}`;
		return Object.is(inputVal, paramValue);
	}

	private static extractQpValue(key: string, data: object) {
		const dotIndex = key.indexOf('.');
		if (dotIndex == -1) {
			// Supports dynamic keys for NoSQL type schema as well
			if (Utils.objectHasKey(data, key)) {
				return data[key];
			}
		} else {
			const curKey = key.substring(0, dotIndex),
				nestedKeys = key.substring(dotIndex + 1);
			if (Utils.objectHasKey(data, curKey) && typeof data[curKey] === 'object') {
				return this.extractQpValue(nestedKeys, data[curKey]);
			}
		}
		return undefined;
	}

	private static filterHelper(data: StringIndexedObject, params: StringIndexedObject): boolean {
		// p is the param key, the property being used to filter
		// val is the value of this param
		// the value of param key is to be extracted from the entity
		for (let [paramKey, paramVal] of Object.entries(params)) {
			let op: string | null = null;
			// Extract Operator and Entity value of paramKey
			const opIndex = paramKey.lastIndexOf('_');
			if (opIndex > -1) {
				op = paramKey.substring(opIndex + 1);
				paramKey = paramKey.substring(0, opIndex);
			}
			const extVal = this.extractQpValue(paramKey, data);
			const evalRes = this.evalQp(paramVal, extVal, op);
			// console.log(
			// 	'filterHelper() paramKey',
			// 	paramKey,
			// 	'paramVal',
			// 	paramVal,
			// 	'inputVal',
			// 	extVal,
			// 	'op',
			// 	op,
			// 	'result',
			// 	evalRes
			// );
			if (!evalRes) return false;
		}
		return true;
	}

	static filterArrayByQueries(
		arr: Array<StringIndexedObject>,
		params: StringIndexedObject
	): Array<StringIndexedObject> {
		return arr.filter((entry) => this.filterHelper(entry, params));
	}
}
