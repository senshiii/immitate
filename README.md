![Immitate Banner Image](assets/banner.png)

## A highly configurable 📝, feature packed 💥 fake rest api server.

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
    - [Endpoints](#endpoints)
- [Query String Usage](#query-string)
- [Schema Strictness](#schema-strictness)

# Features

1. ### Highly configurable
2. ### Custom defined data models to with optional strictness.
3. ### Validation checks using built-in operators
4. ### Predefined routes for CRUD operations
5. ### [Query String](#query-string) filtering using built-in operators
6. ### Data storage in json file
7. ### Rapid prototyping
8. ### [Templates](#templates) for popular use-cases

&nbsp;

# Installation

```bash
npm install --save immitate
```

# Usage

### The server builds itself upon a [configuration](#configuration) object. The configuration can be provided as a json file or as a JavaScript object. Check the examples for more.

```js
// First import all the good stuff
const { createServer, DataTypes, CrudRoutes } = require("immitate");

// Define your Data Models
const dataModels = {
  // Defining a User Data Model
  User: {
    schema: {
      name: DataTypes.String, // Setting just Data Type. No Validation options
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
    // Additional Options on the schema
    timestamps: true,
  },
  // Define more models here ...
};

// Defining the routes we want to use with the models
const restRoutes = [
  {
    resource: "user", // this allows us to make requests to /user
    model: "User", // model name is case-sensitive
    routes: [
      // Setting the routes. Check the route section to find the list of all routes.
      CrudRoutes.GET,
      CrudRoutes.GET_BY_ID,
      CrudRoutes.CREATE,
      CrudRoutes.UPDATE_BY_ID,
      CrudRoutes.DELETE,
      CrudRoutes.DELETE_BY_ID,
    ],
  },
  // Define routes for other models (if any )
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

## Documentation

You can find the complete documentation [here](#somewhere)