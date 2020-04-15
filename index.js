#!/usr/bin/env node

if (!process.argv[2]) {
    console.log('Must specify un file name!');
    process.exit()
}

const homedir = require('os').homedir();
const exec = require('child_process').exec;
const fs = require('fs');
const qrcode = require('qr-image');
// const base64img = require('base64-img');


// --------------------------------------------------------

const rightPad = (arr, len, filler) => {
    if (arr.length >= len) {
        return arr;
    } else {
        return arr + ((new Array(len-arr.length)).fill(filler)).join('');
    }
};

const gen = {
    note: (argv) => {
        return `<div class="section2" data-type="note">
            <div class="section2-header">📎</div>
            <div class="section2-content">
                <div class="row">
                    ${argv.slice(0,1)}
                </div>
                <div class="row">
                ${
                    argv.slice(1).map(line => {
                        return `<p>${line.replace(/^#\&nbsp;(.+)$/, '<span class="big">$1</span>')}</p>`
                    }).join('')
                }
                </div>
            </div>
        </div>`;
    },

    contact: (argv) => {
        return `<div class="section2 ff-sansserif" data-type="contact">
            ${
                argv.map(line => {
                    return `<p>${line.replace(/^#\&nbsp;(.+)$/, '<span class="big">$1</span>')}</p>`
                }).join('')
            }
        </div>`;
    },

    flight: (argv) => {
        return `<div class="section2" data-cell="flight">
            <div class="section2-header">✈️</div>
            <div class="section2-content">
                <div class="row padless ff-monospace">
                    <div class="col-1 big">
                        ${argv[3]}<span class="sup invisible">!</span>
                    </div><div class="col-2 big">
                        ${argv[5]}<span class="sup">${((argv[6] === undefined || argv[6] === '+0') ? '' : argv[6])}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-1">
                        ${argv[2]}
                    </div><div class="col-2">
                        ${argv[4]}
                    </div>
                </div>
                <div class="row">
                    <div class="col-1 bold">
                        ${argv[0]}
                    </div><div class="col-2 bold">
                        ${argv[1]}
                    </div>
                </div>
                <div class="row">
                    <div class="col ff-sansserif">
                        <p>${argv[7]}</p>
                    </div>
                </div>
            </div>
        </div>`;
    },

    train: (argv) => {
        return `<div class="section2" data-cell="train">
            <div class="section2-header">🚄</div>
            <div class="section2-content">
                <div class="row padless ff-monospace">
                    <div class="col-1 big">
                        ${argv[3]}<span class="sup invisible">!</span>
                    </div><div class="col-2 big">
                        ${argv[5]}<span class="sup">${((argv[6] === undefined || argv[6] === '+0') ? '' : argv[6])}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-1">
                        ${argv[2]}
                    </div><div class="col-2">
                        ${argv[4]}
                    </div>
                </div>
                <div class="row">
                    <div class="col-1 bold">
                        ${argv[0]}
                    </div><div class="col-2 bold">
                        ${argv[1]}
                    </div>
                </div>
                <div class="row">
                    <div class="col ff-sansserif">
                        <p>${argv[7]}</p>
                    </div>
                </div>
            </div>
        </div>`;
    },

    hotel: (argv) => {
        return `<div class="section2" data-cell="hotel">
            <div class="section2-header">🏨</div>
            <div class="section2-content">
                <div class="row">
                    <div class="col big ff-sansserif">
                        ${argv[0]}
                    </div>
                </div>
                <div class="row">
                    <div class="col ff-sansserif">
                        ${
                            argv.slice(1).map(line => {
                                return `<p>${line}</p>`
                            }).join('')
                        }
                    </div>
                </div>
            </div>
        </div>`;
    },

    qr: (argv) => {
        return `<div class="section2" data-type="qr">

                <span class="leading" style="float: left;">⬆️ </span>


            ${
                argv.map((line) => {
                    return `<div class="qrcode-matrix" style="display: block; float: left; font-size: 8pt !important; line-height: 4pt !important;">
                        ${ qrcode.matrix(line, 'M').map((y) => {
                            return y.map((x) => {
                                return x ? '<strong style="display: inline-block; width: 4pt;">◼︎</strong>' : '<strong style="display: inline-block; width: 4pt;" class="invisible">◼︎</strong>'
                            }).join('');
                        }).join('<br>') }
                    </div>`;
                }).join('')
            }
            <div style="clear: both;"></div>
        </div>`;
    }
};


// --------------------------------------------------------

var caseRaw = fs.readFileSync(process.argv[2]).toString().trim().replace(/\n\n+/g, '\n\n').replace(/ /g, '&nbsp;');

var caseRendered = caseRaw.split('\n\n').map((line) => {
    if (line.indexOf('>>\n') === -1) {
        // Note
        return gen.note(line.split('\n').map(x => x.trim()));
    } else {
        // Other
        return gen[line.split('>>\n')[0]](line.split('>>\n')[1].split('\n').map(x => x.trim()));
    }
}).join('\n');

var htmlTmpl = fs.readFileSync(__dirname + '/src/templates/index.html').toString();

var finalHtml = htmlTmpl.replace('{{CONTENT}}', caseRendered);

var outputFilename = 'trsu--' + process.argv[2].replace(/[:\/]/g, '--') + '.html';

fs.writeFileSync(outputFilename, finalHtml);

console.log('Summary generated.');

exec(`open ${outputFilename};`);
