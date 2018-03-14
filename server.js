const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.use(bodyParser.json());
app.use(express.static('public'))

// app.locals.projects = [
//   {id: 1, name: 'Happy Project'},
//   {id: 2, name: 'So Sleepy Project'}
// ];

app.locals.palettes = {
  1: [{ projectId: 1, name: 'Warm Colors', colors: ['#3E92CC', '#3E92CC', '#3E92CC', '#3E92CC','#3E92CC'], id: 1}, { projectId: 1, name: 'Color Colors', colors: ['#3E92CC', '#3E92CC', '#3E92CC', '#3E92CC','#3E92CC'], id: 2}],
  2: [{ projectId: 2, name: 'Darkness', colors: ['#59F8E8', '#59F8E8', '#59F8E8', '#59F8E8', '#59F8E8'], id: 1}]
}

app.get('/', (request, response) => {

});

app.get('/api/v1/projects/', (request, response) => {
  database('projects').select()
    .then(projects => {
      response.status(200).json(projects);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then(palettes => {
      response.status(200).json(palettes);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/projects/:id/palettes/', (request, response) => {
  const { id } = request.params;
  const palettes = app.locals.palettes[id];

  return response.status(200).json(palettes)
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} server running on port 3000.`)
});
