const express = require('express');
const { join } = require('path');
const cookieParser = require('../app');
const {
  getFromDataStorage,
  removeItem,
  togleClass,
  addItem,
  checkAndSendData,
  clearAll,
  writeThankYouMessage,
} = require('../utils/utils');
const {
  verifyUserName,
  verifyTextFromInput,
} = require('../utils/verify');

const todoRouter = express.Router();
let userName = null;

todoRouter
  .post('/name', async (req, res) => {
    userName = null;
    if (!(await verifyUserName(req.body.name))) {
      if (await verifyUserName(req.cookies.ToDoCookie)) {
        userName = req.cookies.ToDoCookie;
      } else {
        const filePath = join(__dirname, '../public/badindex.html');
        res.sendFile(filePath);
      }
    } else {
      res.clearCookie('ToDoCookie');
      userName = req.body.name;
    }
    if (await verifyUserName(userName)) {
      await checkAndSendData(`${userName}`);
      res
        .cookie('ToDoCookie', `${userName}`, {
          maxAge: 1000 * 60 * 60 * 24 * 30,
          httpOnly: true,
        })
        .render('home');
    } else {
      const filePath = join(__dirname, '../public/badindex.html');
      res.sendFile(filePath);
    }
  })
  .post('/clear', async (req, res) => {
    userName = req.cookies.ToDoCookie;
    await clearAll(userName);
    await writeThankYouMessage('Everything is Cleared');
    const filePath = join(__dirname, '../public/indexNew.html');
    res
      .clearCookie('ToDoCookie')
      .sendFile(filePath);
  })
  .all('/:else?', async (req, res) => {
    userName = req.cookies.ToDoCookie;

    if (verifyUserName(userName)) {
      const data = JSON.parse(await getFromDataStorage(`${userName}`));
      let reqValue = Object.values(req.body);
      let reqKey = Object.keys(req.body);
      reqValue = reqValue.toString(); // value
      reqKey = reqKey.toString(); // key
      if (reqValue === 'delete') {
        await removeItem(reqKey, data, userName);
      } else if (reqValue === 'close' || reqValue === 'open') {
        await togleClass(reqKey, data, userName);
      } else if (reqKey === 'name') {
        if (await verifyTextFromInput(reqValue)) {
          await addItem(reqValue, data, userName);
        } else {
          await checkAndSendData(`${userName}`);
        }
      }
    } else {
      const filePath = join(__dirname, '../public/badindex.html');
      res.sendFile(filePath);
    }
    // console.log(JSON.parse(await getFromDataStorage(`${userName}`)));
    // await sendToDataStorage(userName, JSON.stringify(data));
    //
    res.render('home');
  });

module.exports = {
  todoRouter,
};
