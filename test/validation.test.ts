import ValidationOperators from '../src/server/validation/ValidationOperators';

class ValidOpsTest extends ValidationOperators {
	lte(ip: any, test: any) {
		return ValidationOperators.lte(ip, test);
	}

	lt(ip: any, test: any) {
		return ValidationOperators.gt(ip, test);
	}

	gte(ip: any, test: any) {
		return ValidationOperators.gte(ip, test);
	}

	gt(ip: any, test: any) {
		return ValidationOperators.gt(ip, test);
	}

	range(ip: any, from: any, to: any, inclusive: boolean) {
		return ValidationOperators.range(ip, from, to, inclusive);
	}

	len(ip: any, test: any) {
		return ValidationOperators.len(ip, test);
	}

	isEmail(email: any) {
		return ValidationOperators.isEmail(email);
	}
}

describe('Validation', () => {
	describe('Validation Operators', () => {
		const validOps = new ValidOpsTest();

		test('lte', () => {
			// Number
			expect(validOps.lte(10, 10)).toEqual(true);
			expect(validOps.lte(10, 20)).toEqual(true);

			// Strings
			expect(validOps.lte('ABCD', 4)).toEqual(true);
			expect(validOps.lte('ABCD', 5)).toEqual(true);
		});
	});
});
