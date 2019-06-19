# Frame Data Parser

Frame Data Parser is a nodejs application that is meant to take a community created document on Super Smash Bros Ultimate the game and make the data within those docs usable for web applications.

The program takes the data from following goolge sheet using googles api, gets the character names from the sheets, transforms the data and saves each characters move data into its own json file.

[Smash Bros Ultimate 3.0.1 patch notes sheet](https://docs.google.com/spreadsheets/d/16fmsoqDoQaR1eteVk2uuzIH2DB4iQHVrqiG8VRbRA7Q/edit#gid=123650910)

# New Features!

- Data is now being written to json files after being transformed

### Installation

Clone this repo

Install the dependencies and devDependencies and start the server.

```sh
$ cd frame-data-parser
$ npm install
```

Now in the following files you would need to change to the `spreadsheetId` to a copy you make of the sheet I have attached above

- `sheet-char-data.js`
- `sheet-char-names.js`

## Starting the app
```sh
$ npm run start

you will then be prompted to follow a link 
and authenticate with your google account
```


### Todos

 - Clean up data for specific characters
 - Update the sheet being used to 3.0.1 from 3.0.0
 - Find a better solution for holding data besides individual json objects
 - Write Tests
 - Better documentation
 - Rest api to server the data
 - A front end application to showcase data

License
----

MIT


