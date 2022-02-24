const { join } = require('path');
const { readFile } = require('fs').promises;

function checkIfOpen(isItOpen) {
  if (isItOpen) {
    return 'open';
  }
  return '';
}

function openOrClosed(isItOpen) {
  if (isItOpen) {
    return 'Close';
  }
  return 'Open';
}

const changeFile = async (pathToHbsFile, userName) => {
  const filePath = join(__dirname, '../data/', `${userName}.json`);
  const data = await JSON.parse(await readFile(filePath));
  const arrayWithObjects = [...data];
  const result = [];
  arrayWithObjects.forEach(({ id, name, open }) => {
    result.push(`<div class="divs ${checkIfOpen(open)}" name="${id}"><p>${name}</p>
    <form method="POST" action="/to/${id}" >
        <button type="submit" name="${id}" value="${openOrClosed(open).toLowerCase()}">${openOrClosed(open)}</button>
        <button type="submit" name="${id}" value="delete">Delete</button>
    </form></div>`);
  });
  return result.join('');
};

module.exports = { changeFile };
