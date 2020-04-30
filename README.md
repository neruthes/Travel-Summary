# Travel-Summary

## Introduction

This is un Nodejs utility to render travel summary plaintext into HTML, which can be used as the source for generating images to be printed ou to be saved in mobile devices.

There is un online web service version as well: [github.com/neruthes/travel-summary-web](https://github.com/neruthes/travel-summary-web).

## How to Use

### Install

```
$ npm install trsu -g
```

### Compose

You may write un plaintext file which look like:

```
contact>>
NERUTHES
SAAZYPMNL
+82 (55) 5555-5555

date>>
2019-01-01

flight>>
CZ1234
2019-01-01
SHA/T2
23:00
CAN/T3
00:10
+1

hotel>>
IntelContinental Guangzhou
+86 (20) 8922-8888
12345678
No. 828, Yuejiang Middle Road, Haizhu District, Guangzhou, 510308

date>>
2019-01-03

train>>
G99
2019-01-03
Hong Kong
09:20
Shanghai
17:35
```

Line 7 for flights and trains is the indicator of date change upon arrival (e.g. being overnight). May be omitted if not overnight.

For flights specifically, line 8 is optional if you would like to note ticket number. But you have to specify `+0` in line 7 in order to use this feature.

### Generate

If your summary file is named `summary.txt`, you may run

```
$ trsu summary.txt
```

... to generate the HTML version of the plan.

## Copyright

© 2019 [Neruthes (5200DF38)](https://neruthes.xyz)

Licensed under GNU AGPL v3.
