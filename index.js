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
const svgIcons = {
    flight: `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" fill="#0066EE" width="48px" height="48px"><g><rect fill="none" height="24" width="24"/></g><g><g><g><path d="M2.5,19h19v2h-19V19z M22.07,9.64c-0.21-0.8-1.04-1.28-1.84-1.06L14.92,10l-6.9-6.43L6.09,4.08l4.14,7.17l-4.97,1.33 l-1.97-1.54l-1.45,0.39l2.59,4.49c0,0,7.12-1.9,16.57-4.43C21.81,11.26,22.28,10.44,22.07,9.64z"/></g></g></g></svg>`,
    train: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0066EE" width="48px" height="48px"><path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M0 0h24v24H0V0z" fill="none"/></svg>`,
    hotel: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0066EE" width="48px" height="48px"><path d="M0 0h24v24H0z" fill="none"/><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/></svg>`,
    note: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0066EE" width="48px" height="48px"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/><path d="M0 0h24v24H0z" fill="none"/></svg>`
};
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
            <div class="section2-header">${svgIcons.note}</div>
            <div class="section2-content">
                <div class="row">
                ${
                    argv.map(line => {
                        return `<p>${line.replace(/^#\&nbsp;(.+)$/, '<span class="big1">$1</span>')}</p>`
                    }).join('')
                }
                </div>
            </div>
        </div>`;
    },

    date: (argv) => {
        return `<div class="ff-monospace" data-type="date">
            ${argv[0]}
        </div>`;
    },

    contact: (argv) => {
        return `<div class="section2 ff-sansserif" data-type="contact">
            ${
                argv.map(line => {
                    return `<p>${line.replace(/^#\&nbsp;(.+)$/, '<span class="big1">$1</span>')}</p>`
                }).join('')
            }
        </div>`;
    },

    flight: (argv) => {
        return `<div class="section2" data-cell="flight">
            <div class="section2-header">${svgIcons.flight}</div>
            <div class="section2-content">
                <div class="row padless ff-monospace">
                    <div class="col-1 big1">
                        ${argv[3]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="lig-arrow-right">-&gt;</span><span class="sup invisible">!</span>
                    </div><div class="col-2 big1">
                        ${argv[5]}<span class="sup">${((argv[6] === undefined || argv[6] === '+0') ? '' : argv[6])}</span>
                    </div>
                </div>
                <div class="row ff-monospace">
                    <div class="col-1">
                        ${argv[2]}
                    </div><div class="col-2">
                        ${argv[4]}
                    </div>
                </div>
                <div class="row ff-monospa ff-monospace">
                    <div class="col-1 bold">
                        ${argv[0]}
                    </div><div class="col-2">
                        ${argv[1]}
                    </div>
                </div>
                <div class="row">
                    <div class="col ff-sansserif">
                        ${argv.slice(7).map(x => `<p>${x}</p>`).join('')}
                    </div>
                </div>
            </div>
        </div>`;
    },

    train: (argv) => {
        return `<div class="section2" data-cell="train">
            <div class="section2-header">${svgIcons.train}</div>
            <div class="section2-content">
                <div class="row padless ff-monospace">
                    <div class="col-1 big1">
                        ${argv[3]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="lig-arrow-right">-&gt;</span><span class="sup invisible">!</span>
                    </div><div class="col-2 big1">
                        ${argv[5]}<span class="sup">${((argv[6] === undefined || argv[6] === '+0') ? '' : argv[6])}</span>
                    </div>
                </div>
                <div class="row ff-monospace">
                    <div class="col-1">
                        ${argv[2]}
                    </div><div class="col-2">
                        ${argv[4]}
                    </div>
                </div>
                <div class="row ff-monospace">
                    <div class="col-1 bold">
                        ${argv[0]}
                    </div><div class="col-2">
                        ${argv[1]}
                    </div>
                </div>
                <div class="row ${ argv[7] === undefined ? 'd-none' : ''}">
                    <div class="col ff-sansserif">
                        ${argv.slice(7).map(x => `<p>${x}</p>`).join('')}
                    </div>
                </div>
            </div>
        </div>`;
    },

    hotel: (argv) => {
        return `<div class="section2" data-cell="hotel">
            <div class="section2-header">${svgIcons.hotel}</div>
            <div class="section2-content">
                <div class="row">
                    <div class="col big1 ff-sansserif">
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
