import { NumOrStr } from '../../types';

export default class ValidatonOperators {
	private static validateTestParam(test: number, operator: string) {
		if (typeof test != 'number' || isNaN(test)) throw `Invalid 'test' value for '${operator}' operator`;
	}

	private static validateNumOrStrParam(input: NumOrStr, operator: string) {
		if (!['string', 'number'].includes(typeof input) || (typeof input == 'number' && isNaN(input)))
			throw `Invalid 'input' value for '${operator}' operator`;
	}

	protected static len(input: NumOrStr, test: number): boolean {
		this.validateTestParam(test, 'len');
		this.validateNumOrStrParam(input, 'len');

		return `${input}`.length == test;
	}

	protected static isEmail(input: string): boolean {
		if (typeof input != 'string') throw "Invalid input type for 'isEmail' operator";
		return new RegExp(
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		).test(input);
	}

	protected static lte(input: NumOrStr, test: number): boolean {
		this.validateTestParam(test, 'lte');
		this.validateNumOrStrParam(input, 'lte');

		return typeof input == 'string' ? input.length <= test : input <= test;
	}

	protected static gte(input: NumOrStr, test: number): boolean {
		this.validateTestParam(test, 'gte');
		this.validateNumOrStrParam(input, 'gte');
		return typeof input == 'string' ? input.length >= test : input >= test;
	}

	protected static lt(input: NumOrStr, test: number): boolean {
		this.validateTestParam(test, 'lt');
		this.validateNumOrStrParam(input, 'lt');

		return typeof input == 'string' ? input.length < test : input < test;
	}

	protected static gt(input: NumOrStr, test: number): boolean {
		this.validateTestParam(test, 'gte');
		this.validateNumOrStrParam(input, 'gt');

		return typeof input == 'string' ? input.length > test : input > test;
	}

	protected static range(input: NumOrStr, from: number, to: number, inclusive?: boolean) {
		this.validateNumOrStrParam(input, 'range');
		if (typeof from != 'number' || isNaN(from)) throw "Invalid 'from' value for 'range' operator";
		else if (typeof to != 'number' || isNaN(to)) throw "Invalid 'to' value for 'range' operator";

		const val = typeof input == 'string' ? (input as string).length : input;

		return inclusive ? val >= from && val <= to : val > from && val < to;
	}
}
