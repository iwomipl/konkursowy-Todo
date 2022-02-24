const express = require('express');
const rateLimit = require('express-rate-limit');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const { todoRouter } = require('./routes/todos');

const app = express();

// LIMITOWANIE ZAPYTAŃ W NODE.JS
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 150,
  message: '<h2>Sorewicz, za dużo zapytań, dopiero zaczynam naukę i pewnie ta strona jest dziurawa, jak sito</h2><h1>Poczekaj minutę i walcz dalej</h1>',
});
app.use(limiter);
app.use(express.static('./public/'));
app.use(express.urlencoded({
  extended: true,
}));
app.use(cookieParser());
app.engine('.hbs', hbs({ extname: 'hbs' }));
app.set('view engine', '.hbs');

app.use('/to', todoRouter);

app.listen(3000);

module.exports = {
  cookieParser,
};
