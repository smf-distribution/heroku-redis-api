# heroku-redis-api

<img src="public/redis.png" alt="Redis + Node.js" /><br />
A Redis REST API with NodeJS using Expressjs and Redis, Inspired by [lucianostraga/heroku-redis-node-rest-api](https://github.com/lucianostraga/heroku-redis-node-rest-api).

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/velizarn/heroku-redis-api)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/velizarn/heroku-redis-api/blob/main/LICENSE)

## Setup

### Heroku

You can deploy your own copy of the app using the web-based flow:<br />
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/velizarn/heroku-redis-api/tree/main)

Click on "*Deploy to Heroku*" button above and follow the instructions:
* Enter an application name
* Choose a region
* Update config vars or leave default values

You can customize the button, for example you might have the following button URL:
```html
<a href="https://heroku.com/deploy?template=https://github.com/velizarn/heroku-redis-api/tree/main&
env[WHITELIST_IP]=11.11.11.11">Deploy to Heroku</a>
```
This will cause the Heroku app-set interface to prefill IP address for the WHITELIST_IP environment variable and to use specific branch from your repo.

#### Creating an app without a name

*The app name argument is optional. If no app name is specified, a random name will be generated.
Since Heroku app names are in a global namespace, you can expect that common names, like “blog” or “wiki”, will already be taken. It’s often easier to start with a default name and rename the app later.*

### Local environment

1) Install Javascript dependencies (via yarn or npm)

2) Create .env file with required params, refer to .env.sample

3) Start the application (npm run start)

## How to use it

@TODO

## License

MIT
