import formidable from 'formidable';
import fs from 'fs';
import jimp from 'jimp';
import mkdirp from 'mkdirp';
import env from '../../env';
import db from '../../config/db';

const debug = require('debug')('trelloClone:Helpers/UploadFile');

/**
 *  UploadFile
 * @param {*} req
 * @return {object} - {success: true, filedetails: [], fields: {}}
 */


function uploadFile(req, next) {
  const uploadDir = env.IMAGE_PATH;
  const fileDetail = [];
  const form = new formidable.IncomingForm();
  form.uploadDir = uploadDir;
  form.on('file', (fields, file) => {
    const row = {};
    row.fileName = file.path;
    row.fileType = file.type;
    debug(row);
    fileDetail.push(row);
  });
  form.parse(req, (errFile, fields) => {
    if (errFile) {
      return next({
        success: false,
        msg: errFile
      });
    }
    return next({
      success: true,
      fileDetail,
      fields
    });
  });
}

/**
 * Compress File
 * @param {string} path
 * @param {string} fileName
 * @param {string} fileType - file extension
 * @return {object} - {success: true, image: '', thumbnailImage: ''}
 */


function compressFile(Path, fileName, fileType, next) {
  // eslint-disable-next-line consistent-return
  mkdirp(env.IMAGE_PATH + Path, (err) => {
    if (err) {
      return next({
        success: false,
        msg: err
      });
    }
    const oldPath = fileName;
    const fileEx = (fileType == 'image/jpeg') ? '.jpg' : '.png';
    const newFileName = `${new Date().getTime()}${fileEx}`;
    const newPath = env.IMAGE_PATH + Path + newFileName;
    // eslint-disable-next-line consistent-return
    fs.rename(oldPath, newPath, (fsErr) => {
      if (fsErr) {
        return next({
          success: false,
          mesg: fsErr
        });
      }
      jimp.read(newPath)
        .then((thumbnail) => {
          thumbnail
            .resize(jimp.AUTO, 250)
            .write(`${env.IMAGE_PATH}${`${Path}thumbnail_${newFileName}`}`); // save
          return next({
            success: true,
            image: env.IMAGE_URL + Path + newFileName,
            thumbnailImg: `${env.IMAGE_URL}${Path}thumbnail_${newFileName}`
          });
        })
        .catch((e) => {
          debug(e);
        });
    });
  });
}

/**
 * Generate thumbnail profile image
 * @params userId
 * @params imgpath
 * @params fileDetail
 */


function generateThumbnail(imgpath, fileDetail, cb) {
  compressFile(imgpath, fileDetail.fileName, fileDetail.fileType, async (filecb) => {
    if (filecb.success === false) {
      debug('Thumbnail not generated');
    } else {
      const post = {
        profile_image: filecb.image,
        profile_thumbnail_image: filecb.thumbnailImg
      };
      debug('fileObj', post);
      return cb(post);
    }
  });
}

export default {
  uploadFile,
  compressFile,
  generateThumbnail
};
