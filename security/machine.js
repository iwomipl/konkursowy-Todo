const { randomBytes } = require('crypto');
const { readFile, writeFile } = require('fs').promises;

const secretSitePassword = 'jas;oiu2342wuqr9j34pjweopu8jgo  94itpdkjfdj';

const getLoginDataFromDataFile = async (userName) => {
  const usersDataBase = await JSON.parse(await readFile('users/users-pass.json', 'utf-8'));
  const loginObjOfUser = await usersDataBase.filter((singleUserObject) => singleUserObject.name === userName);
  return loginObjOfUser;
};

const changePropertyOfVariable = async (userName, changedProperty, newProperty) => {
  const loginObjOfUser = await getLoginDataFromDataFile(userName);
  for (const variable of loginObjOfUser) {
    variable[changedProperty] = newProperty;
  }
  return loginObjOfUser;
};

async function changeOneUserOnly(userName, newUserObject) {
  const usersDataBase = await readFile('users/users-pass.json', 'utf-8');
  console.log(usersDataBase);
  console.log(usersDataBase.replace(`${getLoginDataFromDataFile(userName)}`, JSON.stringify(newUserObject)));

  const { name, salt, hashedPassword } = newUserObject;
  // usersDataBase.findIndex((object) => {
  //   if (object.name === newUserObject.name) {
  //     // delete object;
  //   }
  // });
  console.log(usersDataBase);
  // await writeFile('users/users-pass.json', JSON.stringify(usersDataBase));
}

changeOneUserOnly('drugiuzytkownik', {
  name: 'drugiuzytkownik',
  salt: 'This is juast a dummy text',
  hashedPassword: 'laskd;laskdlakjsdlkajslkjdlksajlkjds1111119999999',
});

async function randomStringGenerator(stringSize) {
  return randomBytes(stringSize).toString('hex');
}

module.exports = {
  getLoginDataFromDataFile,
  changePropertyOfVariable,
};
