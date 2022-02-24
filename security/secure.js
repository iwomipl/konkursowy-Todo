const { encryptText, decryptText, aaa } = require('./cryptor.js');
const { getLoginDataFromDataFile, changePropertyOfVariable } = require('./machine.js');

const SALT = 'jas;oiu2342wuqr9j34pjweopu8jgo  94itpdkjfdj';

async function createEncryptedObject(passwordFromUser, secretSitePassword, SALT) {
  const encryptedObject = await encryptText('Zażółć gęślą jaźń', 'Tajne hasło', SALT);

  console.log(encryptedObject);
  console.log(encryptedObject.encrypted);
  console.log(encryptedObject.iv);

  return encryptedObject;
}

(async () => {
  // const decrypted = await decryptText(encrypted.encrypted, 'Tajne hasło', SALT, encrypted.iv);
  //
  // console.log(decrypted);
  // return decrypted;
})();
const newproperty = 'laskd;laskdlakjsdlkajslkjdlksajlkjds';
(async () => { const bbb = await changePropertyOfVariable('drugiuzytkownik', 'hashedPassword', newproperty); })();
// (async () => { const bbb = await getLoginDataFromDataFile('Nowy uzytkownik'); console.log(bbb); }
// )();

module.exports = { createEncryptedObject };
