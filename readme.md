# Project Management

This is a Sample Node.js API project. It contains most of the things which you may need for any basic Node.js Application like MongoDB,Swagger, etc.

Project Management is a Node.js application which allows you to manage projects for your company and assign/manage users to projects. We have exposed multiple APIs like get all projects,create project, update project, create a user etc to allow you to access the different functionalities provided by this application.

### Tech Stack
- Server : Node.js
- Database : MongoDB
- API Doc: Swagger
- Coding Guidelines Enforcer : ESLint
- Testing Framework : Mocha + Chai
- Testing Implemented : Integration Testing 

### How to run the application on your local machine
>Prerequisites: Node.js, Mongodb
1. Download the source code to your machine. 
2. Enter the root folder using terminal
3. Run : ```npm install```
4. Run : ```npm start```

### Testing
The testing is done using Mocha and Chai framework of Node.js. All the exposed APIs have test cases written in the ```/tests``` folder.
To run test cases, run the following command in the root folder : ```npm run test```

### API Documentation
Once you run the application, access the API documentation using the following link : http://localhost:3000/docs
