'use strict';

const fs = require('fs');

let rawPackageData = fs.readFileSync('package.json');
let packageConfig = JSON.parse(rawPackageData);

let rawAppData = fs.readFileSync(`./data/${packageConfig.name}/app.json`);
let appConfig = JSON.parse(rawAppData);

packageConfig.name = appConfig.name;
packageConfig.displayName = appConfig.displayName;
packageConfig.trustName = appConfig.trustName;
packageConfig.packagename = appConfig.packagename;
packageConfig.version = appConfig.version;
packageConfig.versioncode = appConfig.versioncode;

let data = JSON.stringify(packageConfig, null, '\t');
fs.writeFileSync('package.json', data);
