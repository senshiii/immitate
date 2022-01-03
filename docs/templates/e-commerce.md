Back to [home](../README.md)

# E-Commerce Template

## Configuration

The social media template has the following configuration. There are three data models - `User`, `Product` and `Orders` with all the routes defined on them. The `port` and `db` options fallback to the default values.

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
				phone: DataType.Integer,
				address: {
					street: DataType.String,
					houseNumber: DataType.String,
					city: DataType.String,
					zipCode: DataType.Integer,
				},
			},
			timestamps: true,
			routes: [DefaultRoutes.ALL],
		},
		Product: {
			schema: {
				title: {
					type: DataType.String,
					required: true,
				},
				description: {
					type: DataType.String,
					lte: 700,
				},
				price: {
					type: DataType.Decimal,
					required: true,
					gte: 0.0,
				},
			},
			timestamps: true,
			routes: [DefaultRoutes.ALL],
		},
		Orders: {
			schema: {
				userId: {
					type: DataType.String,
					required: true,
				},
				productId: {
					type: DataType.String,
					required: true,
				},
			},
			routes: [DefaultRoutes.ALL],
			timestamps: true,
		},
	},
}
```

## Usage

```js
const { createWithTemplate } = require("immitate");
createWithTemplate("e-commerce");
```
