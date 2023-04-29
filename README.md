# How to Use Nobox


- Install nobox-client in your project: `npm i nobox-client` --save
- Go to https://nobox.cloud, register and copy the token
- Create a folder and name it `nobox`
- Create a `config.ts` file in the `nobox` folder you created and add the codes below
```ts
import  {  Config,  getFunctions,  getSchemaCreator  }  from  "nobox-client";

export const config: Config = {
endpoint:  "https://api.nobox.cloud",
project:  "[yourproject]",
token: "[yourToken]",
};
export  const  createSchema  =  getSchemaCreator(config);
export  const  Nobox  =  getFunctions(config);
```
- Replace `[yourProject]` with your desired project name
- Replace `[yourtoken]` with the token you copied on nobox.cloud website
- Create a folder called `record-structures` (could be any other name) inside the `nobox` folder too
- Create a file inside the `record-structures` folder and call it `user.ts`, this is just an example
- Copy the code below inside the `user.ts` file.  You can restructure it as you see fit

```ts
import { Space } from "nobox-client";
import { createSchema } from "../config";

interface User {
    email: string;
    password: string;
    firstName: string;
    age: number;
}

export const UserStructure: Space<User> = {
    space: "User",
    description: "A Record Space for Users",
    structure: {
        email: {
            description: "User's Email",
            type: String,
            required: true
        },
        password: {
            description: "User's Password",
            required: true,
            type: String,
            hashed: true
        },
        firstName: {
            description: "User's First Name",
            required: true,
            type: String,
        },
        age: {
            description: "User's Street Number",
            required: false,
            type: Number,
        }
    }
}

export const UserModel = createSchema<User>(UserStructure);
```
- Finally, you can now Insert/Find/Delete/Update your first Record, call an insertOne/findOne/find/updateOneById/find on the model depending on your use case. The code below can act as a guide

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

After following the steps above , your project folder structure should look like this:

<img width="463" alt="Screenshot 2023-04-29 at 09 43 08" src="https://user-images.githubusercontent.com/17033759/235294073-e3f858a8-c430-41cc-9d66-fac94c426d35.png">

You can check [this example project](https://github.com/nobox-org/nobox-react-example) to see how nobox should be setup 



