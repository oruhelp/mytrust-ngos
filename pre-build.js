'use strict';

const fs = require('fs');
const {exec} = require('child_process');
let appName = '';
exec('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => {
  if (err) {
    return;
  }
  function copyFile(_src, _dest) {
    fs.copyFile(_src, _dest, _err => {
      if (_err) {
        console.log(
          `PRE_BUILD: Error copying file from "${_src}" to "${_dest}"`,
        );
        console.log('Error', _err);
        return;
      }

      console.log(`PRE_BUILD: Copyied file from "${_src}" to "${_dest}"`);
    });
  }
  function replaceStringFromFile(_filePath, _srcString, _destString) {
    fs.readFile(_filePath, 'utf8', function(_err, data) {
      if (_err) {
        return console.log(_err);
      }

      var regex = new RegExp(_srcString, 'g');
      var result = data.replace(regex, _destString);

      fs.writeFile(_filePath, result, 'utf8', function(__err) {
        if (__err) {
          return console.log(__err);
        }
      });
    });
  }
  if (typeof stdout === 'string') {
    if (stdout.trim() === 'master') {
      appName = 'mytrust';
    } else {
      appName = stdout.trim();
    }
    console.log(`PRE_BUILD: Building with the app key "${appName}"`);

    // package json entry changes
    let rawPackageData = fs.readFileSync('./package.json');
    let packageConfig = JSON.parse(rawPackageData);

    let rawBuildAppData = fs.readFileSync('./app.json');
    let buildAppConfig = JSON.parse(rawBuildAppData);

    let rawAppData = fs.readFileSync(`./data/${appName}/app.json`);
    let rawAppConfig = JSON.parse(rawAppData);

    console.log('PRE_BUILD: App data\n', rawAppConfig);

    buildAppConfig.name = appName;
    buildAppConfig.displayName = rawAppConfig.displayName;
    buildAppConfig.trustName = rawAppConfig.trustName;
    buildAppConfig.packagename = `com.oruhelp.ngos.${appName}`;
    buildAppConfig.version = `${packageConfig.majorVersion}.0.${
      rawAppConfig.versioncode
    }`;
    buildAppConfig.versioncode = rawAppConfig.versioncode;

    let data = JSON.stringify(buildAppConfig, null, '\t');
    fs.writeFileSync('./app.json', data);

    // copy firebase keys and theme
    copyFile(
      `./data/${appName}/google-services.json`,
      './android/app/google-services.json',
    );
    copyFile(`./data/${appName}/theme.js`, './constants/theme.js');

    // adding JAVA files
    copyFile(
      './data/common/MainActivity.java',
      `./android/app/src/main/java/com/oruhelp/ngos/${appName}/MainActivity.java`,
    );
    copyFile(
      './data/common/MainApplication.java',
      `./android/app/src/main/java/com/oruhelp/ngos/${appName}/MainApplication.java`,
    );
    replaceStringFromFile(
      `./android/app/src/main/java/com/oruhelp/ngos/${appName}/MainActivity.java`,
      'mytrust1',
      appName,
    );
    replaceStringFromFile(
      `./android/app/src/main/java/com/oruhelp/ngos/${appName}/MainApplication.java`,
      'mytrust1',
      appName,
    );
  }
});
