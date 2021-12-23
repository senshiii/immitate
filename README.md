![Immitate Banner Image](./assets/banner.png)


### A highly configurable 📝, feature packed 💥 fake rest api server.

&nbsp;
# Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
  - [Configuration Options](#configuration-options)
  - [DB Options](#db-options)
  - [Model](#model)
    - [Schema](#schema)
      - [Data Types](#data-types)
      - [SchemaItem](#schemaitem)
  - [Route](#route)
- [Query String Usage](#query-string)

# Features

1. Highly configurable
2. Custom defined data models to with optional strictness.
3. Validation checks using built-in operators
4. Predefined routes for CRUD operations
5. Query String filtering using built-in operators
6. Data storage in json file

# Installation
```bash
npm install --save immitate
```

# Usage

The server builds itself upon a [configuration](#configuration) object. The configuration can be provided as a json file or as a JavaScript object. Check the examples for more.

```js
// First import all the good stuff
const { createServer, DataTypes, CrudRoutes } = require("immitate");

// Define your Data Models
const dataModels = {
  User: {
    schema: {
      name: DataTypes.String, // Setting just Data Type. No Validation options
      email: { // SchemaItem object
        type: DataTypes.String,
        isEmail: true,
        required: true,
      },
      password: { // SchemaItem object
        type: DataTypes.String,
        required: true,
        minmax: [6, 14],
      },
      age: DataTypes.Integer, // Setting just Data Type. No Validation options
      address: {
        // Custom Nested Object
        street: DataTypes.String,
        pinCode: DataTypes.Integer,
      },
    },
    includeTimestamps: true,
  },
  Post: {
    schema: {
      title: { // SchemaItem
        type: DataTypes.String,
        required: true,
      },
      description: { // SchemaItem
        type: DataTypes.String,
        max: 500,
      },
      likes: { // SchemaItem
        type: DataTypes.Inteer,
        default: 0,
      },
    },
    strictStructure: true,
    includeTimestamps: true,
  },
};

// Defining the routes we want to use with the models
const restRoutes = [
  {
    resource: "user", // this allows us to make requests to /user
    model: "User", // model name is case-sensitive
    routes: [ CrudRoutes.ALL ],
  },
  {
    resource: "post",
    model: "Post",
    routes: [
      CrudRoutes.GET,
      CrudRoutes.GET_BY_ID,
      CrudRoutes.CREATE,
      CrudRoutes.UPDATE_BY_ID,
      CrudRoutes.DELETE,
      CrudRoutes.DELETE_BY_ID,
    ],
  },
];

const config = {
  port: 5000,
  db: {
    name: "db.json", // Optional. If ommitted, defaults to "immitate.db.json"
    removeExisting: true,
  },
  models: dataModels,
  routes: restRoutes,
};

// Build and start the server

createServer(config);
```
&nbsp;
# Configuration

The following options can be set on the configuration object

## Configuration Options

| Property | Description | Type | Default | Required |
| - | - | - | - | - |
| port   | The port on which the server listens | Integer | 8080 | ❌ |
| db     | Configuration options for the json db file | String specifying the name od the db json file or a [DB Options](#db-options) option | db.json | ❌ |
| models | User-defined Data Models to be used for storing data | An object in which every property represents a new data model and contains a [model](#model) object. | None | ✔️ |
| routes | Lists the routes to be set for different resources and models. | An array of [Route](#route) objects | None | ✔️ |

## DB Options


| Property | Description | Type | Default | Required |
| - | - | - | - | - |
| name | Name of the db json file | String  | immitate.db.json | ❌       |
| removeExisting | If the server is restarted with removeExisting set to true, the previous db file ( if it exists ) will be emptied | boolean | false| ❌ |

## Model

| Property | Description | Type | Default | Required |
| -| - | - | - | - |
| schema | Defines the structure of the model | [`Schema`](#schema) object | None    | ✔️ |
| strictStructure   | Determines whether the structure is strict. Learn more [here](#strict-schema) | boolean | false | ❌ |
| includeTimestamps | If set to true, aautomatically inserts the `createdAt` and `updatedAt` fields to the entity on create operation and updates the `updatedAt` field on update operations | boolean | false | ❌ |

Whenever you create a new model entity using the [CREATE](#create) route, an `id` field is auto-generated. `id` cannot be set manually by passing it in the request body.

## Schema

A Schema is basically an object which depicts the structure of your data [model](#model). Specify the properties of the model in this object. Each property has to specify it's data type. 

### Data Types

List of available data types :- 

- Integer
- Decimal
- String
- Date

```js
const { DataTypes } = require('aweosme-rest')

DataTypes.String // 'John Doe' 
DataTypes.Integer //  200
DataTypes.Decimal // 49.99
DataTypes.Date // Any valid Date format String
```

The value of a property in the schema object can be either of these things :- 

- A data type set by the `DataTypes` object
  ```js
  { // Schema Object
    propertyName: DataTypes.String // DataType
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
    propertyName: { // Custom Object containing nested properties
      nestedProperty: DataTypes.String, // DataType
      anotherNestedProperty: { // SchemaItem
        type: DataTypes.Date,
        required: true
      },
      oneMoreNestedProperty: { // Custom nested object
        // ... more properties 
      }
    }
  }
  ```
> NOTE: A Schema cannot contain fields which are autogenerated and handled internally by the package. These are the `id`, `createdAt` and `updatedAt` fields.


## SchemaItem

| Property | Description | Type | Default | Required
| - | - |- | - | - |
| type | The data type of the field | [Data Type](#data-types) | None | ✔️
| required | Determines whether a proeprty is absolutely necessary. If set to true, this property needs to be set when creating an entity | boolean | false | ❌

The following are operators you can add to the schema item object on a property of your schema to specify what kind of data is allowed to be stored in that particular property

| Property | Description | Applicable on Data Types | Type |
|-|-|-|-
| lte | Less than or equal to | String / Integer / Decimal | Integer 
| lt | Less than | String / Integer / Decimal | Integer
| gte | Greater than or equal to | String / Integer / Decimal | Integer
| gt | Greater than | String / Integer / Decimal | Integer
| len | Matches length to the supplied length | String / Integer | Integer
| isEmail | Checks whether provided string is a valid email | String | boolean
| range | Checks whether the input is in between the given range | Integer / Decimal | [Range Options](#range-options)

> NOTE: When `lte`, `lt`, `gte`, `gt` is used on `DataTypes.String`, then the respective checks are performed against the length of the string.  

&nbsp;
### Range Options
| Property | Description | type
|-|-|-
|from|The lower bound of the range|integer
|to|The upper bound of the range|integer
|inclusive| Specifies whether the end values should be considered. Default is `false`| boolean


## Route

A route object has the following structure

```js
{
  resource: "ENTER RESOURCE NAME",
  model: "ENTER MODEL NAME",
  routes: [] //Specify which routes you want this resource/endpoint to have from list of pre-defined routes. Check list below
}
```

### Resource
The `resource` property specifies the request mapping. For example, if the resource is `user`, then you can send requests to `http://localhost:PORT/user` as per the routes you have added.

### Model
Each resource ( request mapping ) HAS to be associated with a model. Model cannot be blank. The model name is case-sensitive and should be exactly as defined in the [models](#configuration-options) object.

### Routes
The routes array contains the list of routes you want to be defined on this resource. The list of available routes are 

| Route Name | HTTP Method | Description | Format | Example
| - | - | - | - | -
| **GET** | GET | Retrieves all entities of the model. Results can be filtered using a [query string](#query-string) | `/resource/` or `/resource?foo=bar` | `/user/` or `/user?foo=bar`
**GET_BY_ID** | GET | Retrieves a particular entity using the `id` property | `/resource/:id` | `/user/12wa3`
| **CREATE** | POST | Creates an entity of the model. Data of the entity should be sent in the body of the request. | `/resource/` | `/user/`
| **UPDATE** | PUT | Updates all the entities using the data sent as the request body. You can update a subset of the persisted entities using a [query string](#query-string) | `/resource/` or `/resource?foo=bar` | `/user/` or `/user?foo=bar`
| **UPDATE_BY_ID** | PUT | Updates a particular entity using the `id` property. The data used to update should be provided as the request body | `/resource/:id` | `/user/12wa3`
| **DELETE** | DELETE | Deletes all entities of the model. You can delete a subset of the persisted entites using a [query string](#query-string) | `/resource/` or `/resource?foo=bar` | `/user/` or `/user?foo=bar`
**DELETE_BY_ID** | DELETE | Deletes a particular entity using the `id` property | `/resource/:id` | `/user/12wa3`

> NOTE : If you want to register all the routes on a model, you can just specify `CrudRoutes.ALL` in the `routes` array 
---

&nbsp;

# Query String

A [Query String](https://en.wikipedia.org/wiki/Query_string) can be used to filter results in various routes as mentioned in the [routes](#routes) section. A query string can be used in its general form `?foo=bar`. Two additional forms are also supported for the defined routes that allow *using operators* and *filtering using nested properties*.

### **Using Operators**
The list of supported operators are `lt`, `lte`, `gt`, `gte` and `len`. The usage of these operators can be found [here](#schemaitem). Operators are used in a query string as `?param_operator=value`. For example :- `/age?age_gte=18`. This query returns the users (who have an 'age' property) who are 18 years of age or older.

### **Nested Properties**
If your schema has a property which has nested properties in it as shown below, then you can filter entities based on these nested properties. Nested properties can be used in the query as `?property.nestedProperty=value`. You can nest properties as deep as you like as per your model structure. 

For example :- `/user?name.lastName=Doe` returns all users with the last name of 'Doe'. 
```js
name: {
  firstName: DataTypes.String,
  lastName: DataTypes.String
}
```

You can alos use nesting along with operators. For example:- `/user?dob.year_lt=2020` returns all users who were born before 2020
```js
dob: {
  day: DataTypes.Integer,
  month: DataTypes.Integer,
  year: DataTypes.Integer
}
```

