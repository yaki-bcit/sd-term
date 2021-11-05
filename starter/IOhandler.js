/*
 * Project: COMP1320 Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 * 
 * Created Date: 
 * Author: 
 * 
 */

const unzipper = require('unzipper'),
  fs = require('fs'),
  PNG = require('pngjs').PNG,
  path = require('path');


/**
 * Description: decompress file from given pathIn, write to given pathOut 
 *  
 * @param {string} pathIn 
 * @param {string} pathOut 
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  fs.createReadStream(pathIn)
    .pipe(unzipper.Extract({path: pathOut}))
    .on('finish', () => console.log('Extraction operation complete'));
};

/* unzip(`${__dirname}/myfile.zip`, `${__dirname}/unzipped`); */

/**
 * Description: read all the png files from given directory  
 * and return Promise containing array of each png file path
 * @param {string} path 
 * @return {promise}
 */
const readDir = dir => {
  fs.readdir(dir, (err, files) => {
    if (err) { 
      console.log(err) 
    } else {
      console.log(files);
    }
  });

};

/* readDir(`${__dirname}/unzipped`); */

const grayScaleAlg = () => {
  const grayScaleValue = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
  // invert color
  this.data[idx] = grayScaleValue;
  this.data[idx + 1] = grayScaleValue;
  this.data[idx + 2] = grayScaleValue;

  this.pack().pipe(fs.createWriteStream("out.png"));
};

/**
 * Description: Read in png file by given pathIn, 
 * convert to grayscale and write to given pathOut
 * 
 * @param {array} files 
 * @param {string} pathOut 
 * @return {promise}
 */
const grayScale = (files, pathOut) => {
  for (file of files) {
    if (file.endsWith('.png')) {
      fs.createReadStream(file)
        .pipe(
          new PNG({
            filterType: -1,
          })
          .on('parsed', function() {
            /* for (var y = 0; y < this.height; y++) {
              for (var x = 0; x < this.width; x++) {
                console.log(this.data)
                var idx = (this.width * y + x) << 2;
         
                // invert color
                this.data[idx] = 255 - this.data[idx];
                this.data[idx + 1] = 255 - this.data[idx + 1];
                this.data[idx + 2] = 255 - this.data[idx + 2];
         
                // and reduce opacity
                this.data[idx + 3] = this.data[idx + 3] >> 1;
              }
            } */
            console.log(this.data);
            this.pack().pipe(fs.createWriteStream("out.png"));

          })
        )
    }
  }
  
};

grayScale(['./unzipped/1.png',], 'a');

module.exports = {
  unzip,
  readDir,
  grayScale
};


