const {
  normalize,
  resolve,
} = require('path');
const { readFile, writeFile, unlink } = require('fs').promises;
const { changeFile } = require('./createHtmlFile');

const safeJoin = async (base, target) => {
  const targetPath = `.${normalize(`/${target}`)}`;
  return resolve(base, targetPath);
};

const safeJoinForUserNameOnly = async (userName) => {
  const filePath = await safeJoin(`${__dirname}/..`, `/data/${userName}.json`);
  return filePath;
};

const sendToDataStorage = async (userName, data) => {
  const filePath = await safeJoinForUserNameOnly(userName);
  if (data === undefined || data === null) {
    const dummyData = await JSON.parse(await readFile(await safeJoinForUserNameOnly('data'), 'utf-8'));
    await writeFile(filePath, JSON.stringify(dummyData));
    return;
  }
  await writeFile(filePath, JSON.stringify(data));
};

const updateIdNumbers = async (data) => {
  if (data === undefined || data === null) {

  } else {
    let newData = [...data];
    newData = newData.map((obj, index) => obj = {
      id: index + 1,
      name: obj.name,
      open: obj.open,
    });
    return newData;
  }
};

const createHTMLCode = async (userName) => {
  await updateIdNumbers(userName);
  const filePath = await safeJoin(`${__dirname}/..`, '/views/home.hbs');
  const start = '<div id="grid-container">';
  const end = '</div>';
  const middle = await changeFile(filePath, userName);
  await writeFile(filePath, `${start}${middle}${end}`);
};

const writeThankYouMessage = async (message) => {
  const filePath = await safeJoin(`${__dirname}/..`, '/views/home.hbs');
  await writeFile(filePath, `<h2>${message}</h2>`);
};

const getFromDataStorage = async (userName) => {
  const filePath = await safeJoinForUserNameOnly(userName);
  try {
    const data = await readFile(filePath);
    return data;
  } catch (e) {
    return null;
  }
};

const checkAndSendData = async (userName, data) => {
  if (data === undefined) {
    // check if username does not exist in this place, get the data for user
    const tempData = await JSON.parse(await getFromDataStorage(`${userName}`));
    // send data to user, and now sendToDataStorage, that have if statement
    // in case of not having data if data is unidentified, the function will insert dummy content
    // if not
    // it will overwrite old content with itself
    await sendToDataStorage(userName, tempData);
    const changedData = await JSON.parse(await getFromDataStorage(`${userName}`));
    await updateIdNumbers(data);
    await sendToDataStorage(userName, changedData);
    await createHTMLCode(userName);
  } else {
    const changedData = await updateIdNumbers(data);
    await sendToDataStorage(userName, changedData);
    await createHTMLCode(userName);
  }
};

const lastItemInObject = async (data) => {
  let highestId = 0;
  const changedData = [...data];
  changedData.forEach((obj) => {
    if (obj.id > highestId) {
      highestId = obj.id;
    }
  });
  return highestId + 1;
};

const removeItem = async (sentId, data, userName) => {
  const filteredData = data.filter((obj) => Number(sentId) !== Number(obj.id));
  await checkAndSendData(userName, filteredData);
};

const togleClass = async (sentId, data, userName) => {
  const changedData = [...data];
  changedData.forEach((obj) => {
    if (obj.id === Number(sentId)) {
      if (obj.open === true) {
        obj.open = false;
      } else {
        obj.open = true;
      }
    }
  });
  await checkAndSendData(userName, changedData);
};

const addItem = async (nameValue, data, userName) => {
  const changedData = [...data];
  const newVariable = {
    id: await lastItemInObject(data),
    name: `${nameValue}`,
    open: true,
  };
  changedData.push(newVariable);
  await checkAndSendData(userName, changedData);
};

const removeFile = async (userName) => {
  const filePath = await safeJoinForUserNameOnly(userName);
  await unlink(filePath);
};

const clearAll = async (userName) => {
  await removeFile(userName);
};

module.exports = {
  sendToDataStorage,
  getFromDataStorage,
  removeItem,
  togleClass,
  addItem,
  updateIdNumbers,
  createHTMLCode,
  checkAndSendData,
  clearAll,
  writeThankYouMessage,
};
