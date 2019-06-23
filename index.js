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


const gen = {
    note: (argv) => {
        return `<div class="section note">
            <div class="bold large-text"><span class="leading">📎 </span>${argv.slice(0, 1)}</div>
            ${
                argv.slice(1).map(line => {
                    return `<div>${line.replace(/^#\&nbsp;(.+)$/, '<strong class="large-text">$1</strong>')}<sup class="invisible">!</sup></div>`
                }).join('')
            }
        </div>`;
    },

    contact: (argv) => {
        return `<div class="section contact">
            ${
                argv.map(line => {
                    return `<div>${line.replace(/^#\&nbsp;(.+)$/, '<strong class="large-text">$1</strong>')}<sup class="invisible">!</sup></div>`
                }).join('')
            }
        </div>`;
    },

    flight: (argv) => {
        return `<div class="section flight">
            <div class="bold large-text">
                <span class="leading">✈️ </span><span class="underline">${argv[0]}</span> / ${argv[1]}
            </div>
            <div class="">
                ${argv[2]} (${argv[3]}) → ${argv[4]} (${argv[5]}<span><sup>${argv[6]||''}</sup></span>)
            </div>
            <div>Ticket Booked? [ ] __________________<sup class="invisible">!</sup></div>
        </div>`;
    },

    train: (argv) => {
        return `<div class="section train">
            <div class="bold large-text">
                <span class="leading">🚄 </span><span class="underline">${argv[0]}</span> / ${argv[1]}
            </div>
            <div class="">
                ${argv[2]} (${argv[3]}) → ${argv[4]} (${argv[5]}<span><sup>${argv[6]||''}</sup></span>)
            </div>
            <div>Ticket Booked? [ ]</div>
        </div>`;
    },

    hotel: (argv) => {
        return `<div class="section hotel">
            <div class="bold large-text">
                <span class="leading">🏨 </span><span class="">${argv[0]}</span>
            </div>
            ${
                argv.slice(1).map(line => {
                    return `<div>${line}<sup class="invisible">!</sup></div>`
                }).join('')
            }
        </div>`;
    },

    qr: (argv) => {
        return `<div class="section qr">

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
