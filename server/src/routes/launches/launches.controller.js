const {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchByID,
} = require('../../models/launches.model');

const { getPagination } = require('../../services/query');

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(Array.from(launches));
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: 'Missing required launch property!',
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  // if (launch.launchDate.toString() === 'Invalid Date') {
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'Invalid launch date',
    });
  }

  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAborLaunch(req, res) {
  const launchId = Number(req.params.id);

  const existsLaunch = existsLaunchWithId(launchId);
  if (!existsLaunch) {
    return res.status(400).json({
      error: 'Launch not found',
    });
  }

  const aborted = await abortLaunchByID(launchId);
  if (!aborted) {
    return res.status(400).json({
      error: 'Launch not aborted',
    });
  }
  return res.status(200).json({
    ok: true,
  });
}

module.exports = {
  httpGetAllLaunches,
  httpAborLaunch,
  httpAddNewLaunch,
};
