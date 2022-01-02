import lu from 'log-utils';
import Utils from '../server/Util';

export default class Logger {
	private static colorByMethod(method: string): string {
		switch (method.toUpperCase()) {
			case 'GET':
				return `${lu.bold.greenBright(method)}`;
			case 'POST':
				return `${lu.bold.yellow(method)}`;
			case 'PUT':
				return `${lu.bold.blue(method)}`;
			case 'DELETE':
				return `${lu.bold.red(method)}`;
		}
		return '';
	}

	static logRequest(path: string, method: string, body: object) {
		console.log(lu.timestamp, Logger.colorByMethod(method), lu.bgYellow.black(path), 'Body', body, '\n');
	}

	static log(message: string, excludeTimestamp?: boolean) {
		if (excludeTimestamp) console.log(message);
		else console.log(lu.timestamp, message);
	}

	static ok(message: string, prepend?: string) {
		if (!Utils.isNullOrUndefined(prepend)) {
			console.log(lu.timestamp, prepend, lu.ok(lu.greenBright(message)));
			return;
		}
		console.log(lu.timestamp, lu.ok(lu.greenBright(message)));
	}

	static warn(message: string, prepend?: string) {
		if (!Utils.isNullOrUndefined(prepend)) {
			console.log(lu.timestamp, prepend, lu.warning, lu.yellow(message));
			return;
		}
		console.log(lu.timestamp, lu.warning, lu.yellow(message));
	}

	static info(message: string, prepend?: string) {
		if (!Utils.isNullOrUndefined(prepend)) {
			console.log(lu.timestamp, prepend, lu.blueBright(`${lu.info} ${message}`));
			return;
		}
		console.log(lu.timestamp, lu.info, lu.blueBright(message));
	}

	static error(message: string, prepend?: string) {
		if (!Utils.isNullOrUndefined(prepend)) {
			console.log(lu.timestamp, prepend, lu.error, lu.red(message));
			return;
		}
		console.log(lu.timestamp, lu.error, lu.red(message));
	}

	static print(message: any) {
		console.log(message);
	}
}
