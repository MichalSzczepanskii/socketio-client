# Socket.io Client

[![buildable](https://github.com/MichalSzczepanskii/socketio-client/actions/workflows/buildable.yml/badge.svg?branch=main)](https://github.com/MichalSzczepanskii/socketio-client/actions/workflows/buildable.yml)

Socket.IO Client is a simple client for the socket.io-client built with Angular.

## Table of contents

- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)

## Technologies

- Nx: 16.1.4
- Angular: 16.0.0
- Angular Material: 16.0.1
- Jest: 29.4.1
- Socket.io Client: 4.6.1
- Docker: 20.10.22

## Installation

Clone the repo: `git clone https://github.com/MichalSzczepanskii/socketio-client.git`

### Npm

For local installation, you will need `node` and `npm installed globally on your machine.

`npm install`

To start the app: `npm run start`

To run tests: `npm run test`

### Docker

For Docker installation, you will need `docker` installed on your machine.

`docker-compose up -d`

To visit the app: http://localhost:4201

## Usage

To connect to a websocket, you have to pass the url and optionally the configuration JSON. After a successful connection, you can subscribe to channels.

If at least one channel is subscribed you can:

- filter incoming messages by them
- send messages to the channel as text or a JSON object

Default socket.io client events are logged in the "Log" section.

If a websocket connection is closed by a server or a client, it will show the setup form again, clear messages, and subscribed channels.

## Screenshots

![main screen](./images/2023-05-29%201.png)
![connected screen](./images/2023-05-29%202.png)
![connected screen](./images/2023-05-29%203.png)
