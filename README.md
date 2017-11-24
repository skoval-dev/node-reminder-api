Welcome to Reminder Rest-API!
===================

Reminder REST API was build based on node.js and express with MongoDB storage.
The App contains two instances of data: Users and Reminders. For authentication were used bcrypt and JSON web token modules.
Application uses environment variables for configuration, so it easily can be deployed to heroku.

----------


How to use:
-------------
#### Clone the repository
> git clone https://github.com/skoval-dev/node-reminder-api.git

----------


#### Configure project

 - Create /server/config/config.json file
 - Identify variables for production, development and QA environments:
	 - PORT
	 - MONGODB_URI
	 - JWT_SECRET

Result:

    {
	    "development": {
			"PORT": 3000,
			"MONGODB_URI": mongodb://localhost:12344/Reminder,
			"JWT_SECRET": "the_best_secret"
		},
		"test": {
			"PORT": 3001,
			"MONGODB_URI": mongodb://localhost:12344/Reminder_QA,
			"JWT_SECRET": "the_best_secret"
		}
	}


> **Production env:** Should be configured in order to provided variables name on hosted storage.


#### Run app:

> **Development** /<project_dir>: npm run dev

> **Run tests** /<project_dir>: npm run test-watch


#### Routers:

 1. **POST** /reminders
 2. **GET:** /reminders
 3. **GET:** /reminders:id
 4. **DELETE:** /reminders:id
 5. **PATCH:** /reminders:id
 6. **POST:** /users
 7. **GET:** /users/me
 8. **POST:** /users/login
 9. **DELETE** /users/me