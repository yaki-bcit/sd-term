/*
 * Project: COMP1320 Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 * 
 * Created Date: 
 * Author: 
 * 
 */

const { resolve } = require('path');
const unzipper = require('unzipper'),
  fs = require('fs'),
  PNG = require('pngjs').PNG,
  path = require('path');

/**
 * Description: Decompress file from given pathIn, write to given pathOut 
 *  
 * @param {string} pathIn 
 * @param {string} pathOut 
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(pathIn)
      .pipe(unzipper.Extract({path: pathOut}))
      .on('finish', () => {
        console.log('Extraction operation complete');
        resolve();
      })
      .on('error', err => reject(err))
  });
};

/**
 * Description: Read all the png files from given path  
 * and return Promise containing array of each png file path
 * @param {string} path 
 * @return {promise}
 */
const readDir = dir => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) { 
        reject(err) 
      } else {
        resolve(files);
      }
    });
  })
};

/**
 * Description: Create a given directory
 * @param {string} dir 
 * @return {promise}
 */
const mkDir = dir => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, (err) => {
      if (err) {
        if (err.code === 'EEXIST') {
          resolve();
        } else {
          reject(err);
        }
      } else {
        resolve()
      }
    });
  });
};

/**
 * Description: Helper function to implement grayscale 
 * for png files. Read files by given pathIn, convert 
 * to grayscale by given pathOut
 * 
 * @param {array} files 
 * @param {string} pathIn
 * @param {string} pathOut 
 * @return {promise}
 */
const grayScaleAlg = (files, pathIn, pathOut) => {
  return new Promise(function(resolve, reject) {
    for (const file of files) {
      if (file.endsWith('.png')) {
        const filePath = pathIn + file;
        fs.createReadStream(filePath)
          .pipe(
            new PNG({
              filterType: -1,
            })
          )
          .on('parsed', function() {
            for (let y = 0; y < this.height; y++) {
              for (let x = 0; x < this.width; x++) {
                const idx = (this.width * y + x) << 2;
                const grayScaleValue = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
                this.data[idx] = grayScaleValue;
                this.data[idx + 1] = grayScaleValue;
                this.data[idx + 2] = grayScaleValue;
              }
            }

            this.pack()
              .pipe(fs.createWriteStream(pathOut + file)).on('error', err => reject(err))
              .on('error', err => reject(err));
            resolve();
          })
          .on('error', err => reject(err));
      } else {
        continue;
      }
    }
  })
};

/**
 * Description: Read in png file by given pathIn, 
 * convert to grayscale and write to given pathOut
 * 
 * @param {array} files 
 * @param {string} pathIn
 * @param {string} pathOut 
 * @return {promise}
 */
function grayScale (files, pathIn, pathOut) {
  return new Promise((resolve, reject) => {
    mkDir(pathOut)
      .then(() => grayScaleAlg(files, pathIn, pathOut))
      .then(() => resolve())
      .catch(err => reject(err));
  });
};

module.exports = {
  unzip,
  readDir,
  grayScale
};
