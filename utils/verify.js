const verifyUserName = async (userName) => {
  const regex = /[^a-zząęółśżźćń ]/gi;
  if (userName === undefined || userName === null || userName.length < 6 || userName.length > 25) {
    return false;
  } if (regex.test(userName)) {
    return false;
  }
  return true;
};

const verifyTextFromInput = async (data) => {
  const regex = /[^a-ząęółśżźćń ,!.?\0-9]/i;
  if (data === undefined || data === null || data.length < 6 || data.length > 150) {
    return false;
  } if (regex.test(data)) {
    return false;
  }
  return true;
};

module.exports = { verifyUserName, verifyTextFromInput };
