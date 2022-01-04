# Planning Poker

Planning Poker is an agile estimating and planning technique that is consensus based.
Live Demo: https://agile-poker-beta.herokuapp.com/

### How to use
1. Visit the base url
2. A new shareable link will be generated for you. Remember to open the link once, to become admin. Then share the link with your teammates.
3. Done!

### Tech Stack
- Node.js
- MySQL/PostgreSQL (choosable)

### Local Setup
1. Take  git pull of this repo.
2. Run ```npm install```
3. Update the ```config/db.json```  according to your db configuration
4. Create the necessary db in MySQL/PG
4. Run ```npm run local``` to locally deploy the app. When you run the app for the first time, all the necessary tables will be created for you.
5. By default, the app is available on ```http://localhost:8090```
6. If you want to try/modify something on the frontend side, please visit this repo : Planning Poker (Frontend)

### API Documentation
Once you run the application, access the API documentation using the following link : http://localhost:8090/docs
