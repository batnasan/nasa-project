const express = require('express');
const {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAborLaunch,
} = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpAddNewLaunch);
launchesRouter.delete('/:id', httpAborLaunch);

module.exports = launchesRouter;
