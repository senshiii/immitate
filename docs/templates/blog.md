Back to [home](../README.md)

# Blog Template

## Configuration

The blog template has the following configuration. There are two data models - `User` and `Blog` with all the routes defined on them. The `port` and `db` options fallback to the default values.

```js
{
	models: {
		User: {
			schema: {
				name: {
					type: DataType.String,
					required: true,
				},
				email: {
					type: DataType.String,
					required: true,
					isEmail: true,
				},
				password: {
					type: DataType.String,
					required: true,
					range: {
						from: 8,
						to: 16,
						inclusive: true,
					},
				},
				followers: {
					type: DataType.Integer,
					default: 0,
				},
			},
			timestamps: true,
			routes: [DefaultRoutes.ALL],
		},
		Blog: {
			schema: {
				title: {
					type: DataType.String,
					required: true,
					gte: 1
				},
				body: {
					type: DataType.String,
					required: true,
					gte: 1
				},
				likes: {
					type: DataType.Integer,
					default: 0
				},
				userId: {
					type: DataType.String,
					required: true
				}
			},
			routes: [DefaultRoutes.ALL],
		},
	},
}
```

## Usage

```js
const { createWithTemplate } = require("immitate");
createWithTemplate("blog");
```
