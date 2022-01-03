Back to [home](../README.md)

# Social Media Template

## Configuration
The social media template has the following configuration. There are three data models - `User`, `Post` and `Comment` with all the routes defined on them. The `port` and `db` options fallback to the default values.

```js
{
	models: {
		User: {
			schema: {
				name: {
					type: DataType.String,
					required: true,
				},
				username: DataType.String,
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
				phone: DataType.Integer,
			},
			timestamps: true,
			routes: [DefaultRoutes.ALL],
		},
		Post: {
			schema: {
				title: {
					type: DataType.String,
					required: true,
					lte: 150,
				},
				description: {
					type: DataType.String,
					lte: 750,
				},
				likes: {
					type: DataType.Integer,
					default: 0,
					gte: 0,
				},
				shares: {
					type: DataType.Integer,
					default: 0,
					gte: 0,
				},
				userId: {
					type: DataType.String,
					required: true,
				},
			},
			routes: [DefaultRoutes.ALL],
			timestamps: true,
		},
		Comment: {
			schema: {
				schema: {
					title: {
						type: DataType.String,
						required: true,
					},
					postId: {
						type: DataType.String,
						required: true,
					},
					upvotes: {
						type: DataType.Integer,
						default: 0,
						gte: 0,
					},
					downvotes: {
						type: DataType.Integer,
						default: 0,
						gte: 0,
					},
				},
			},
			routes: [DefaultRoutes.ALL],
			timetsmaps: true,
		},
	},
}
```
## Usage

```js
const { createWithTemplate } = require("immitate")
createWithTemplate("social-media")
```
















