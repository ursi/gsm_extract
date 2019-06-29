const fs = require('fs');
const path = require('path');
const config = 'gsm_extract.json';

function del(path) {
    if (process.argv[2] != 'soft' && fs.existsSync(path)) fs.unlinkSync(path);
}

(function gsmExtract(dir, extract = false) {
    console.log(dir);
    if (fs.existsSync(path.join(dir, config))) {
        if (process.argv[2] != 'soft') fs.unlinkSync(path.join(dir, '.gitmodules'));
        try {
            var configObj = JSON.parse(fs.readFileSync(path.join(dir, config)));
        } catch (error) {
            console.error(`${config} not configured propery`);
            process.exit();
        }

        for (let [msdir, modules] of Object.entries(configObj)) {
            if (modules == 'all') {
                for (let mdir of fs.readdirSync(path.join(dir, msdir))) {
                    gsmExtract(path.join(dir, msdir, mdir), true);
                }
            }
        }

        del(path.join(dir, '.gitmodules'));
        del(path.join(dir, config));
    }

    if (extract) {
        for (let file of fs.readdirSync(dir)) {
            if (file != '.git') {
                if (process.argv[2] == 'soft') {
                    fs.copyFileSync(path.join(dir, file), path.join(dir, '..', file));
                } else {
                    fs.renameSync(path.join(dir, file), path.join(dir, '..', file));
                    if (fs.existsSync(path.join(dir, '.git'))) fs.unlinkSync(path.join(dir, '.git'));
                    fs.rmdir(dir, console.log);
                }
            }
        }
    }
})(path.join(__dirname, '..'));