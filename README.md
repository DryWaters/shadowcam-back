# ShadowCam Backend API Project
ShadowCam Backend API Node/Express application that uses Postgres database 
for user's workout data and authentication that can be used with the 
[frontend](https://github.com/DryWaters/shadowcam-front)
companion React application for recording boxing workouts.

* [Instructions](#instructions)
* [Getting Started](#getting-started)
* [Prerequisites](#prerequisites)
* [Built With](#built-with)
* [Contributing](#contributing)
* [Example](#example)
* [Authors](#authors)

## Instructions

1. Install or Enable a remote Postgres DB, ex. Heroku application
2. Create a database inside Posgres for the User's data location
3. Create a .env file.  Includes DB login information and which DB name

``` Shell
#Example of .env file

DB_HOST=localhost
DB_USER=postgres
DB_PASS=password
DB_DATABASE=shadowcam
DB_PORT=5432

LOCAL=TRUE
REBUILD_DATA=FALSE
NODE_ENV=development
KEY=password

```

4. Install NPM Packages using ``` npm install ```
5. Run with ``` npm start ```

ShadowCam table definitions will be created upon start up with the flag
REBUILD_DATA=TRUE.  The information only needs to be rebuilt once, and 
will need to be set to FALSE to keep from erasing user's saved data.

## Getting Started
All needed NPM packages are included in the package.json file. 

If you are using with a Heroku application, the application will pull
from the environment variables the DATABASE_URL without being
set within your .env files.

## Prerequisites
All needed NPM packages are included in the package.json file.

Local or remote PostGres database URL to start the application.

## Built With
[NodeJS](https://nodejs.org/en/)

[ExpressJS](https://expressjs.com/)

[pg-promise](https://github.com/vitaly-t/pg-promise)

and other great NPM packages.  See package.json for full list.

## Contributing
Feel free to fork into your own repo to add additional features.

## Example
As of this writing an example of the application can be located at:

Frontend Application
https://shadow-cam.firebaseapp.com/

Backend Application
https://shadowcam-back.herokuapp.com/

## Authors
[Daniel Waters](https://www.watersjournal.com)

[Dan Rachou](https://github.com/danrachou)

