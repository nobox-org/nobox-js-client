# How to Use Nobox
### 1: Register An Account On Nobox Cloud
- Go to https://nobox.cloud
- Click on Login, and Copy the Token

### 2: Install Nobox Client
`npm i nobox-client`

### 2: Add the Config File in your project
- Create a `config.ts` file in your project as seen below


```ts
import  {  Config,  getFunctions,  getSchemaCreator  }  from  "nobox-client";

export const config: Config = {
endpoint:  "https://api.nobox.cloud",
project:  "[project]",
token: "[eternalToken]",
};
export  const  createSchema  =  getSchemaCreator(config);
export  const  Nobox  =  getFunctions(config);
```

`[project]` : the chosen name for your project
`[eternalToken]`: the eternal token copied from nobox cloud	

### 3: Create Your Record Structures
- Create a folder called record-structures ( could be any other name)
- Create a file e.g. user.ts

```ts
// record-structures/user.ts
import { Space } from "nobox-client";
import { createSchema } from "./config";

interface User {
    email: string;
    password: string;
    firstName: string;
    otp?: string;
}

export const UserStructure: Space<User> = {
    space: "User",
    description: "A Record Space for Users",
    structure: {
        email: {
            description: "User's Email"
            unique: true,
            type: "TEXT",
            required: true
        },
        password: {
            description: "User's Password",
            required: true,
            type: "TEXT",
            hashed: true
        },
        firstName: {
            description: "User's First Name",
            required: true,
            type: "TEXT",
        },
        otp: {
            description: "User's Street Number",
            required: false,
            type: "TEXT",
        }
    }
}

export const UserModel = createSchema<UserStructureParams>(UserStructure);
```

- `createSchema` : this was imported from the Config File we previously created
- `User`: this interface file helps to apply typings to the record structure and its usage
- `UserStructure`: this object will define how Users will be stored and retrieved in Nobox
- `Space: "User"` refers to the name of the space or record ( this has to be unique). **Two RecordSpaces can't have the same name. It can lead to unpredictable behaviour.**
- `description: "A Record Space for Users",` refers to the description of the Space or record
-  `Structure` contains the structure of the Space itself. Structure contains keys that represents the fields allowed for the Space. In this case, this includes `email` , `password`. `firstName` and `otp`. Each of these fields is allowed to have an object that contains rules that determine how these fields are meant to behave. This is explained below:


    - `Description [string]: (optional)` This is the description of the field itself. This defaults to empty when not provided. *(defaults to empty string)*

    - `required [boolean] (optional)` : When true, it means the field must always be provided when inserting records, when false , it becomes optional to provide it when inserting record. *(defaults to false)*
When required is false, It becomes important to make this field optional  in your typescript interface to make the typings corresponding to the field details. 
    - `type ["TEXT" | "NUMBER"] (required)` : This determines the type of the field. for instance, an age field will most likely be of type `"NUMBER"` and a firstName will be of type `"TEXT"`
    - `hashed [boolean] (optional)`: This determines how the field will be stored and retrieved.  When `hashed: true`, the field will be stored as an hash, it will also not be returned in response result. Only hash fields when they are necessary, as having many hashed fields can significantly slow your requests to nobox
    - `unique [boolean] (optional)`: This determines if the content of the field can be repeated in more than one document.For instance, If `unique: true` for a username field , it means only one instance of a username can be allowed. This means when a user's details is submitted with the username `Sandrava`, nobox will throw an error when such username is used in a subsequent request
    - `defaultValue [boolean] (optional)`: This determines if a default value is set when the field property is not sent. For instance, if a country field is has `defaultValue: United Kingdom`, the country field will always default to `United Kingdom` when country is not set.


#### 4: Finally, you can now Insert/Find/Delete/Update your first Record
To perform the mentioned operations,

- You call the model of the recordStructure like we have in the previous step on `/record-structures/user.ts`
- Then call an insertOne/findOne/find/updateOneById/find on the model depending on your use case.

```ts

import UserModel from "../record-structures/user.ts";

const data = {
email: "test@gmail.com",
firstName: "akin",
password: "123456*",
otp: 3456
}

// Insert
const insertedData = await UserModel.insertOne(data);
console({ insertedData });

// FindOne
//The below operation will return the inserted data
const foundData = await UserModel.findOne({id: insertedData.id});
console.log({ foundData})

//UpdateOneById
// The below operation allows you to update a previously inserted record with its id
const updatedData = await UserModel.updateOneById(id, { firstName: "akin2"})
console.log({ updatedData})

// Find
//This will return all data in within that space with `email: test@gmail.com`
const allData = await UserModel.find({email: "test@gmail.com"})
console.log(allData);
```
