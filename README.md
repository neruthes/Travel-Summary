# Travel-Summary

## How to Use

### Install

```
$ npm install travel-summary
```

### Compose

You may write un txt file which looks like:

```
contact>>
NERUTHES
SAAZYPMNL
+82 (55) 5555-5555

flight>>
CZ1234
2019-01-01
SHA T2
23:00
CAN T3
00:10
yes

hotel>>
IntelContinental Guangzhou
+86 (20) 8922-8888
12345678
No. 828, Yuejiang Middle Road, Haizhu District, Guangzhou, 510308

train>>
G99
2019-01-03
Hong Kong
09:20
Shanghai
17:35
no
```

The last line for flights and trains is the indicator of being overnight.

### Generate

If your summary file is named `summary.txt`, you may run

```
$ trsu summary.txt
```

... to generate the HTML version of the plan. The print preview panel should appear automatically.

## Copyright

© 2019 [Neruthes (D5E2F043)](https://neruthes.xyz)

Licensed under AGPL 3.0.
