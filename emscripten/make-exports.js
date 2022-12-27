#!node

const fs = require('fs');
const path = require('path');

const OUTPUT_NAME = path.resolve(__dirname, 'exports.txt');
const INCLUDE_DIR = path.resolve(__dirname, '../include');
const IGNORE_FUNCTIONS = [
    'fluid_seq_gettrace',
    'fluid_seq_cleartrace',
];

/**
 * @param {String[][]} a
 * @return {String[]}
 */
function flattenArray(a) {
    return a.reduce((p, c) => c.concat(p), []);
}

/**
 * @param {String} dir
 * @param {boolean} [recursive]
 * @param {(entry:string, fullName:string)=>boolean} [excludeFn]
 * @return {String[]}
 */
function gatherIncludeFiles(dir, recursive, excludeFn) {
    const entries = fs.readdirSync(dir, 'utf8');
    /** @type {String[]} */
    let files = [];
    /** @type {String[]} */
    let dirs = [];
    entries.forEach((entry) => {
        const name = path.join(dir, entry);
        const st = fs.statSync(name);
        if (st.isDirectory()) {
            dirs.push(name);
        } else {
            if (/\.h(?:\.in)?$/.test(entry)) {
                if (!excludeFn || !excludeFn(entry, name)) {
                    files.push(name);
                }
            }
        }
    });
    if (recursive) {
        files = files.concat(
            flattenArray(dirs.map((subDir) => gatherIncludeFiles(subDir, recursive, excludeFn)))
        );
    }
    return files;
}

/**
 * @param {String} file
 * @return {String[]}
 */
function gatherAPIDeclarations(file) {
    const lines = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n').split(/[\r\n]/g);
    /** @type {String[]} */
    const funcs = [];
    let cachedLine = '';
    lines.forEach((line) => {
        if (/^[ \t]*\#/g.test(line)) {
            return;
        }
        cachedLine += ' ' + line;
        while (true) {
            const ra = /^(.*)?\;(.*)$/g.exec(cachedLine);
            if (!ra) {
                break;
            }
            const targetData = ra[1];
            cachedLine = ra[2];
            const ra2 = /FLUIDSYNTH_API(?:[ \r\n]+?[A-Za-z0-9_\*]+?)+?[ \r\n]+?\*?([A-Za-z0-9_]+)\(/.exec(targetData);
            if (ra2) {
                funcs.push(ra2[1]);
            }
        }
    });
    return funcs;
}

const includes = gatherIncludeFiles(INCLUDE_DIR, true, (e) => e === 'shell.h');
const funcs = flattenArray(includes.map((file) => gatherAPIDeclarations(file)))
    .filter((name) => IGNORE_FUNCTIONS.indexOf(name) < 0);

fs.writeFileSync(OUTPUT_NAME, '"_' + funcs.join('",\n"_') + '",\n');
