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

// app.get('*', function(req, res) {  
//     res.redirect('https://' + req.headers.host + req.url);

//     // Or, if you don't want to automatically detect the domain name from the request header, you can hard code it:
//     // res.redirect('https://example.com' + req.url);
// })

app.use((req, res, next) => {
  console.log('the request is secure', req.secure)
  // check if it is a secure (https) request
  // if not redirect to the equivalent https url
  !req.secure ? res.redirect('https://' + req.hostname + req.url) : next()
  }
)

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

app.post('/api/v1/projects/', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['name']) {
    if (!project[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('projects').insert(project, 'id')
    .then(proj => {
      const { name } = project;
      
      response.status(201).json({ id: proj[0], name })
    })
    .catch(error => {
      response.status(500).json({ error })
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

app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;

  for (let requiredParameter of ['name', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5', 'project_id']) {
    if (!palette[requiredParameter]) {
      return response
        .status(422)
        .send({error: `Expected format: { name: <String>, color_1: <String>, color_2: <String>, color_3: <String>, color_4: <String>, color_5: <String>, project_id: <Integer> }. You're missing a "${requiredParameter}" property.`})
    }
  }

  database('palettes').insert(palette, 'id')
    .then(pal => {
      response.status(201).json({ ...palette, id: pal[0] })
    })
    .catch(error => {
      response.status(500).json({ error })
    });
})

app.get('/api/v1/projects/:id/palettes/', (request, response) => {
  database('palettes').where('project_id', request.params.id).select()
    .then(palettes => {
      if (palettes.length) {
        response.status(200).json(palettes);
      } else {
        response.status(404).json({
          error: `Could not find palettes associated with project id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/palettes/:id', (request, response) => {
  database('palettes').where('id', request.params.id).select()
    .then(palette => {
      if (palette.length) {
        response.status(200).json(palette);
      } else {
        response.status(404).json({
          error: `Could not find palette associated with palette id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
})

app.delete('/api/v1/palettes/', (request, response) => {
  database('palettes').where('id', request.body.id).del()
    .then(palette => {
      response.status(200).json();
    })
    .catch(error => {
      response.status(500).json({ error });
    })
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} server running on port 3000.`)
});

module.exports = app;
