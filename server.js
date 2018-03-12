const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.use(bodyParser.json());
app.use(express.static('public'))

app.get('/', (request, response) => {

});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} server running on port 3000.`)
})
