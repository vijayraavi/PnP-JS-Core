//******************************************************************************
//* publish.js
//*
//* Defines a custom gulp task for publishing this repository to npm in 
//* both main and beta versions for different branches
//*
//******************************************************************************

const
    gulp = require("gulp"),
    tslint = require("gulp-tslint"),
    config = require('./@configuration.js'),
    semver = require('semver'),
    fs = require('fs'),
    package = require("../package.json"),
    execSync = require('child_process').execSync,
    readline = require('readline');

const log = (value) => { console.log(value); return value };
const exec = (command) => execSync(log(command), { encoding: 'utf8' })

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function publishSetup() {

    log(`Starting automated npm publish of ${package.name}...`);
}

function mergeDevToMaster() {

    log('## Merge dev -> master');
    exec('git checkout dev');
    exec('git pull');
    exec('git checkout master');
    exec('git pull');
    exec('git merge dev');
    log(exec('npm install'));
}

function incrementPackage() {

    log('## Incrementing the package version');
    const npmVersion = semver.clean(exec(`npm show ${package.name} version`));
    const newVersion = exec('npm version patch');

    log(`Current version in package.json: ${package.version}`);
    log(`Latest version on npm: ${npmVersion}`);
    log(`New version after patch: ${newVersion}`);

    if (!semver.gt(newVersion, npmVersion)) {
        log('Aborting publish, local version is not new.');
        process.exit(0);
    }
    log('## Incremented the package version');
}

function updateDistFiles() {

    log('## Updating dist files');
    exec('git checkout master');
    log('Updating .gitignore to allow dist/ upload');
    var data = fs.readFileSync('./.gitignore', 'utf-8');
    var newValue = data.replace(/^dist\/$/gim, '#dist/');
    fs.writeFileSync('.gitignore', newValue, 'utf-8');
    log('Updated .gitignore to allow dist/ upload');
    log(exec('git status'));
    exec('gulp package');
    log('## Updated dist files');
}

function commitDistFiles() {

    log('## Committing Dist Files');
    exec('git add dist/');
    exec('git commit -m "update to dist during master merge"');
    exec('git checkout .gitignore');
    exec('git push');
    log('## Committed Dist Files');
}

function publishToNPMGate() {

    log('##');
    log('## -->> The next step will publish the package to NPM!!! <<--');
    log('##');
}

function publishToNPM() {
    log('## Publishing to NPM');
    log(exec('npm publish'));
    log('## Published to NPM');
}

function mergeMasterToDev() {

    log('## Merging master -> dev');
    exec('git checkout master');
    exec('git pull');
    exec('git checkout dev');
    exec('git pull');
    exec('git merge master');
    exec('rmdir /S /Q dist');
    exec('git add .');
    exec('git commit -m "clean-up dist for dev branch"');
    exec('git push');
    log('## Merged master -> dev');
}

function engine(tasks) {

    let task = tasks.shift();

    task();

    if (tasks.length > 0) {

        rl.question('Do you want to continue? (/^y(es)?$/i): ', (answer) => {
            if (answer.match(/^y(es)?$/i)) {
                rl.pause();
                engine(tasks);
            } else {

                tasks.pop();
            }
        });
    }
}

gulp.task("publish", (done) => {

    const publishTasks = [
        publishSetup,
        mergeDevToMaster,
        incrementPackage,
        updateDistFiles,
        commitDistFiles,
        publishToNPMGate,
        publishToNPM,
        mergeMasterToDev,
        function () {
            log('Publishing complete');
            rl.close();
            done();
        },
    ];

    engine(publishTasks);
});


    //log(`Tagging repo with v${package.version}...`);
    // exec('git fetch --unshallow || true');
    // exec(`git tag v${packageVersion}`);
    // exec('git push git@github.com:foo/bar.git --tags');  


// gulp.task("publish-beta", function () {

// });
