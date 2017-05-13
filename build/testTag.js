#!/usr/bin/env node

require('shelljs/global');

/**
 * The style of tags will be
 * 0.0.1
 * 0.0.2
 * 0.0.10
 * 0.0.11
 *
 * The tag 1.2.14 would be represented as:
 * {
 *   major: 1,
 *   minor: 2,
 *   point: 14
 * }
 */

var getArguments = function () {
  var args = {deploy_to: 'test', release_type: 'point'};
  // Break the args on equals signs
  var splitArgs = process.argv.map(function (val) {
    return val.split('=');
  });
  splitArgs = splitArgs.filter(function (argArray) {
    return argArray.length === 2;
  });
  splitArgs.forEach(function (argPair) {
    if (argPair[0] == 'deploy_to' && argPair[1] == 'live') { args.deploy_to = 'live'; }
    if (argPair[0] == 'release_type' && argPair[1] == 'minor') { args.release_type = 'minor'; }
  });

  return args;
}

var getOutputFromExec = function (output, defaultReturn) {
  if ('output' in output) {
    return output.output;
  }
  if ('stdout' in output) {
    return output.stdout;
  }
  return defaultReturn;
}

var getTagStrings = function () {
  var defaultTagString = '0.0.0';
  // Get all of the current tags
  // This will need to be updated for v1 and forward
  var tags = exec('git tag -l 0*', {silent: true});
  tags = getOutputFromExec(tags, defaultTagString);
  // ensure that all the tags being passed on are well-formed
  tags = tags.split('\n');

  tags = tags.filter( (version) => { return version.length != 0});
  tags = tags.filter( (version) => { return version.split('.').length == 3});
  if (tags.length > 0) {
    return tags;
  }
  return [defaultTagString];
}

var convertTagStringToTagObject = function (tagString) {
  var versionNumbers = tagString.split('.');
  var tagObject = {
    major: versionNumbers[0],
    minor: versionNumbers[1],
    point: versionNumbers[2]
  };
  return tagObject;
}

var convertTagObjectToTagString = function (tagObject) {
  var tagString = tagObject.major;
  tagString += '.' + tagObject.minor;
  tagString += '.' + tagObject.point;
  return tagString;
}

var compareTagObjects = function (tagObject1, tagObject2) {
  // Compare the major versions first.
  if (tagObject1.major > tagObject2.major) {
    return tagObject1;
  }
  else if (tagObject1.major < tagObject2.major) {
    return tagObject2;
  }
  // Major's the same! Compare the minor release.
  if (tagObject1.minor > tagObject2.minor) {
    return tagObject1;
  }
  else if (tagObject1.minor < tagObject2.minor) {
    return tagObject2;
  }
  // Major and minor are the same. Compare the point release.
  if (tagObject1.point > tagObject2.point) {
    return tagObject1;
  }
  else if (tagObject1.point < tagObject2.point) {
    return tagObject2;
  }
  // Major and minor and point are the same.
  return tagObject1;
}

var incrementPointRelease = function (tagObject) {
  tagObject.point = parseInt(tagObject.point) + 1;
  return tagObject;
}

var incrementMinorRelease = function (tagObject) {
  tagObject.point = 0;
  tagObject.minor = parseInt(tagObject.minor) + 1;
  return tagObject;
}

function needToIncrementPointRelease(maxTagObj) {
  var defaultTagStr = '0.0.0';

  var maxTagStr = convertTagObjectToTagString(maxTagObj);
  if (maxTagStr === defaultTagStr) {
    return true;
  }

  var maxTagCommitId = exec('git rev-parse ' + maxTagStr, {silent: true});
  maxTagCommitId = getOutputFromExec(maxTagCommitId, false);
  if (maxTagCommitId === false) {
    return true;
  }
  maxTagCommitId = maxTagCommitId.trim();

  var currentCommitId = exec('git rev-parse HEAD', {silent: true});
  currentCommitId = getOutputFromExec(currentCommitId, false);
  if (currentCommitId === false) {
    return true;
  }
  currentCommitId = currentCommitId.trim();

  return maxTagCommitId !== currentCommitId;
}

var userArgs = getArguments();

if (userArgs.deploy_to === 'test') {
  var tags = getTagStrings();
  var tagObjects = tags.map(convertTagStringToTagObject);
  var maxTag = tagObjects.reduce(compareTagObjects);
  if (needToIncrementPointRelease(maxTag)) {
    var newMaxTag = (userArgs.release_type === 'minor') ? incrementMinorRelease(maxTag) : incrementPointRelease(maxTag);
    var newMaxTagStr = convertTagObjectToTagString(newMaxTag);
    console.log('Updating the tag on test to ' + newMaxTagStr + '.');
    exec('git tag ' + newMaxTagStr, {silent: true});
  }
  else {
    console.log('No need to update the tag on test.');
  }
}
else if (userArgs.deploy_to === 'live') {
  console.log('Time to deploy to live, I guess.');
}
