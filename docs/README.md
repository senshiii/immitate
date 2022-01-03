# Immitate <!-- {docsify-ignore} -->

A highly configurable, feature packed fake rest api server. <!-- {docsify-ignore} -->

---

# Features

1. Highly configurable
2. Custom defined data models to with optional [strictness](#schema-strictness).
3. Validation checks using built-in operators
4. Predefined routes for CRUD operations
5. [Query String](#query-string) filtering using built-in operators
6. Data storage in json file
7. Rapid prototyping
8. [Templates](#templates) for popular use-cases

# Installation

```bash
npm install --save immitate
```

# Usage

The server builds itself upon a configuration object. The configuration can be provided as a JSON file or as a JavaScript object. Check the [configuration](#configuration) section for the complete list of options. 
This is a very basic example. 

To find more detailed examples, check the [examples][examples].

```js
// First import all the good stuff
const { createServer, DataTypes, CrudRoutes } = require("immitate");
const { GET, GET_BY_ID, CREATE, UPDATE_BY_ID, DELETE_BY_ID } = CrudRoutes;

// Define your Data Models
const dataModels = {
  // Defining a User Data Model
  User: {
    schema: {
      name: DataTypes.String, // Defining the mandatory data type. No extra operators
      email: {
        // SchemaItem object
        type: DataTypes.String,
        isEmail: true,
        required: true,
      },
      password: {
        // SchemaItem object
        type: DataTypes.String,
        required: true,
        range: {
          from: 6,
          to: 14,
          inclusive: true,
        },
      },
    },
    // Adding creation and updation timestamps to entities
    timestamps: true,
    // Setting the routes on this model
    routes: [GET, GET_BY_ID, CREATE, UPDATE_BY_ID, DELETE_BY_ID],
  },
  // Define more models here ...
};

const config = {
  port: 5000,
  db: {
    name: "my-json-db-file.json", // Optional. If ommitted, defaults to "immitate.db.json"
    removeExisting: true,
  },
  models: dataModels,
};

// Build and start the server

createServer(config);
```

# Templates

Templates can be used to quickly initialize a fake server with predefined models for a particular use-case. To quickly spin up a server usign a template, use the `createWithTemplate` function and pass the template identifier as the argument. The available templates are 

- [Social Media][social-media] - `social-media`
- [E-Commerce][e-commerce] - `e-commerce`

```js
const { createWithTemplate } = require("immitate")
createWithTemplate("social-media")
createWithTemplate("e-commerce")
```

# Configuration

The configuration object has the following options

| Property | Description | Type | Default | Required |
| -| - | - | - | - |
| port | The port on which the server listens | integer |8080| ❌| 
| db| Configuration options for the json db file | String specifying the name of the db json file or a [DB Options](#db-options) option | immitate.db.json | ❌ |
| models   | User-defined Data Models | An object in which every property represents a new data model and contains a [model](#model) object. | None | ✔️       |

## DB Options

| Property       | Description                                                                                                                 | Type    | Default          | Required |
| -------------- | --------------------------------------------------------------------------------------------------------------------------- | ------- | ---------------- | -------- |
| name           | Name of the db json file                                                                                                    | String  | immitate.db.json | ❌       |
| removeExisting | If the server is restarted with removeExisting set to true, the previously created db file ( if it exists ) will be emptied | boolean | false            | ❌       |

## Model

| Property   | Description                                                                                                                                                            | Type                       | Default | Required |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ------- | -------- |
| schema     | Defines the structure of the model                                                                                                                                     | [`Schema`](#schema)        | None    | ✔️       |
| routes     | Specifies the list of predefined CRUD routes to be registered on this model                                                                                            | Array of [Routes](#routes) | None    | ✔️       |
| strict     | Determines whether the structure is strict. Learn more about it [here](#schema-strictness)                                                                             | boolean                    | false   | ❌       |
| timestamps | If set to true, aautomatically inserts the `createdAt` and `updatedAt` fields to the entity on create operation and updates the `updatedAt` field on update operations | boolean                    | false   | ❌       |

> **NOTE**: Whenever you create a new model entity using the [CREATE](#routes) routes, an `id` field is auto-generated. `id` cannot be set manually by passing it in the request body.

## Schema

A Schema is basically an object which depicts the structure of your data [model](#model). Specify the properties of the model in this object. Each property has to specify it's data type.

## Data Types

List of available data types :-

- Integer
- Decimal
- String
- Date

```js
const { DataTypes } = require("immitate");

DataTypes.String; // 'John Doe'
DataTypes.Integer; //  200
DataTypes.Decimal; // 49.99
DataTypes.Date; // Any valid Date format String
```

The value of a property in the schema object can be either of these three :-

- A data type set using the `DataTypes` object
  ```js
  {
    // Schema Object
    propertyName: DataTypes.String; // DataType
  }
  ```
- A [`SchemaItem`](#schemaitem) object.
  ```js
  { // Schema Object
    propertyName: { // SchemaItem object
      type: DataTypes.Integer,
      required: true,
      // other options ...
    }
  }
  ```
- A custom nested object

  ```js
  { // Schema Object
    schemaProperty: { // Custom Object containing nested properties
      nestedProperty: DataTypes.String, // DataType
      anotherNestedProperty: { // SchemaItem
        type: DataTypes.Date,
        required: true
      },
      oneMoreNestedProperty: { // Custom nested object
        // ... more nested properties
      }
    }
  }
  ```

  > NOTE: A Schema cannot contain fields which are autogenerated and handled internally by the package. These are the `id`, `createdAt` and `updatedAt` fields.

## SchemaItem

| Property | Description                                                                                                                  | Type                             | Default | Required |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ------- | -------- |
| type     | The data type of the property                                                                                                | [Data Type](#data-types)         | None    | ✔️       |
| required | Determines whether a proeprty is absolutely necessary. If set to true, this property needs to be set when creating an entity | boolean                          | false   | ❌       |
| default  | Specifies the default value to be used to populate the field if not set explicitly                                           | Same as the type of the property | None    | ❌       |

The following are operators you can add to a schema property to filter what kind of data is allowed to be stored in that particular property

| Property | Description | Applicable on Data Types | Type |
| - | - | - | - |
| lte      | Less than or equal to| String, Integer, Decimal | integer|
| lt | Less than | String, Integer, Decimal | integer |
| gte | Greater than or equal to | String, Integer, Decimal | integer|
| gt | Greater than | String, Integer, Decimal | integer |
| len | Matches length to the supplied length | String, Integer | integer |
| isEmail  | Checks whether provided string is a valid email | String | boolean |
| range | Checks whether the input lies in the range `from < input < to`. End valuea are not included by default | Integer, Decimal | [Range Options](#range-options) |

> NOTE: When `lte`, `lt`, `gte`, or `gt` is used on `DataTypes.String`, then the respective checks are performed against the length of the string.

### Range Options <!-- {docsify-ignore} -->

| Property  | Description                                                               | type    | Required |
| --------- | ------------------------------------------------------------------------- | ------- | -------- |
| from      | The lower bound of the range                                              | integer | ✔️       |
| to        | The upper bound of the range                                              | integer | ✔️       |
| inclusive | Specifies whether the end values should be considered. Default is `false` | boolean | ❌       |

## Routes

This is an array which contains the list of pre-defined routes you can define on a model. The list of available routes are

| Name | HTTP Method | Description | URL | Example |
| - | - | - | - | - |
| **GET** | GET | Retrieves all entities of the model. Results can be filtered using a [query string](#query-string) | `/resource/` or `/resource?foo=bar` | `/user/` or `/user?foo=bar` |
| **GET_BY_ID** | GET | Retrieves a particular entity using the `id` property | `/resource/:id` | `/user/12wa3` |
| **CREATE** | POST | Creates an entity of the model. Data of the entity should be sent in the body of the request. | `/resource/` | `/user/` |
| **UPDATE** | PUT | Updates all the entities using the data sent as the request body. You can update a subset of the persisted entities using a [query string](#query-string) | `/resource/` or `/resource?foo=bar` | `/user/` or `/user?foo=bar` |
| **UPDATE_BY_ID** | PUT | Updates a particular entity using the `id` property. The data used to update should be provided as the request body | `/resource/:id` | `/user/12wa3` |
| **DELETE** | DELETE | Deletes all entities of the model. You can delete a subset of the persisted entites using a [query string](#query-string) | `/resource/` or `/resource?foo=bar` | `/user/` or `/user?foo=bar` |
| **DELETE_BY_ID** | DELETE | Deletes a particular entity using the `id` property | `/resource/:id` | `/user/12wa3` |

> NOTE : If you want to register all the routes on a model, you can just specify `CrudRoutes.ALL` in the `routes` array

# Query String

A [Query String](https://en.wikipedia.org/wiki/Query_string) can be used to filter results in various routes as mentioned in the [routes](#routes) section. A query string can be used in its general form `?foo=bar`. Two additional forms are also supported for the defined routes that allow filtering data using _operators_ and _nested properties_.

## Using Operators

The list of supported operators are `lt`, `lte`, `gt`, `gte` and `len`. The usage of these operators can be found [here](#schemaitem). Operators are used in a query string as `?param_operator=value`. For example :- `/age?age_gte=18`. This query returns the user entities ( with an 'age' property) who are 18 years of age or older.

## Nested Properties

If your schema has a property which has nested properties in it as shown below, then you can filter entities based on these nested properties. Nested properties can be used in the query as `?property.nestedProperty=value`. You can nest properties as deep as you like as per your model structure.

For the below schema, the query `/user?name.lastName=Doe` returns all users with the last name of 'Doe'.

```js
name: {
  firstName: DataTypes.String,
  lastName: DataTypes.String
}
```

You can also use nesting along with operators. For example, for the below schema, the query `/user?dob.year_lt=2000` returns all users who were born before 2000

```js
dob: {
  day: DataTypes.Integer,
  month: DataTypes.Integer,
  year: DataTypes.Integer
}
```

# Schema Strictness

A schema is said to be strict if the entities of the schema store only those properties ( in all hierarchy levels ) as defined in the schema and an attempt to persist additional properties will result in an error. This results in a fixed data model. 

On the other hand, a not-strict schema treats the defined schema as a base and allows additional properties to be added to it dynamically, which makes it a flexible data model. 

# Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct][code-of-conduct]. We expect all contributors to follow the [Code of Conduct][code-of-conduct] and to treat fellow humans with respect.

# Contributing

We LOVE and INVITE all kinds of contribution. If you wish to contribute to Immitate, please go through the [guidelines][contributing] first.

# Changelog

Read the changelog [here][Changelog]

[code-of-conduct]: /code-of-conduct
[contributing]: /contribute
[examples]: https:/github.com/senshiii/immitate/tree/master/examples
[social-media]: ./templates/social-media.md
[e-commerce]: ./templates/e-commerce.md
[Changelog]: /changelog