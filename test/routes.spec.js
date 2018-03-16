const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage with text', () => {
    return chai.request(server)
      .get('/')
      .then(response => {
        response.should.have.status(200);
        response.should.be.html;
      })
      .catch(err => {
        throw err;
    });
  });

  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
      .get('/sad')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(err => {
        throw err;
    });
  });
});

describe('API Routes', () => {
  beforeEach((done) => {
    database.migrate.rollback()
    .then(() => {
      database.migrate.latest()
      .then(() => {
        return database.seed.run()
        .then(() => {
          done()
        })
      })
    })
  })

  describe('GET /api/v1/projects', () => {
    it('should return all of the projects', () => {
      return chai.request(server)
        .get('/api/v1/projects')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Fun Project');
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
        })
        .catch(error => {
          throw error;
      });
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should create a new project', () => {
      return chai.request(server)
        .post('/api/v1/projects')
        .send({
          name: 'Sad Project'
        })
        .then(response => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('name');
          response.body.name.should.equal('Sad Project');
          response.body.should.have.property('id');
          response.body.id.should.equal(2);
        })
        .catch(error => {
          throw error;
      });
    });

    it('should not create a project with missing data', () => {
      return chai.request(server)
        .post('/api/v1/projects')
        .send({
          notName: 'herrow'
        })
        .then(response => {
          response.should.have.status(422);
          response.body.error.should.equal('Expected format: { name: <String> }. You\'re missing a "name" property.');
        })
        .catch(error => {
          throw error;
      });
    });
  });

  describe('GET /api/v1/palettes', () => {
    it('should return all of the palettes', () => {
      return chai.request(server)
        .get('/api/v1/palettes')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Warm Colors');
          response.body[0].should.have.property('project_id');
          response.body[0].project_id.should.equal(1);
          response.body[0].should.have.property('color_1');
          response.body[0].color_1.should.equal('#3E92CC');
          response.body[0].should.have.property('color_2');
          response.body[0].color_2.should.equal('#3E92CC');
          response.body[0].should.have.property('color_3');
          response.body[0].color_3.should.equal('#3E92CC');
          response.body[0].should.have.property('color_4');
          response.body[0].color_4.should.equal('#3E92CC');
          response.body[0].should.have.property('color_5');
          response.body[0].color_5.should.equal('#3E92CC');
        })
        .catch(error => {
          throw error;
        })
    });
  });

  describe('GET /api/v1/palettes/:id', () => {
    it('should return palette with associated id', () => {
      return chai.request(server)
        .get('/api/v1/palettes/1')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Warm Colors');
          response.body[0].should.have.property('project_id');
          response.body[0].project_id.should.equal(1);
          response.body[0].should.have.property('color_1');
          response.body[0].color_1.should.equal('#3E92CC');
          response.body[0].should.have.property('color_2');
          response.body[0].color_2.should.equal('#3E92CC');
          response.body[0].should.have.property('color_3');
          response.body[0].color_3.should.equal('#3E92CC');
          response.body[0].should.have.property('color_4');
          response.body[0].color_4.should.equal('#3E92CC');
          response.body[0].should.have.property('color_5');
          response.body[0].color_5.should.equal('#3E92CC');
        })
        .catch(error => {
          throw error;
        })
    })
  })

  describe('POST /api/v1/palettes', () => {
    it('should create a new palette', () => {
      return chai.request(server)
        .post('/api/v1/palettes')
        .send({
          name: 'Tron Palette',
          project_id: 1,
          color_1: '#8B80F9',
          color_2: '#8B80F9',
          color_3: '#8B80F9',
          color_4: '#8B80F9',
          color_5: '#8B80F9',
        })
        .then(response => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('name');
          response.body.name.should.equal('Tron Palette');
          response.body.should.have.property('project_id');
          response.body.project_id.should.equal(1);
          response.body.should.have.property('color_1');
          response.body.color_1.should.equal('#8B80F9');
          response.body.should.have.property('color_2');
          response.body.color_2.should.equal('#8B80F9');
          response.body.should.have.property('color_3');
          response.body.color_3.should.equal('#8B80F9');
          response.body.should.have.property('color_4');
          response.body.color_4.should.equal('#8B80F9');
          response.body.should.have.property('color_5');
          response.body.color_5.should.equal('#8B80F9');
        })
        .catch(error => {
          throw error;
      });
    });

    it('should not create a palette with missing data', () => {
      return chai.request(server)
        .post('/api/v1/palettes')
        .send({
          name: 'Sad Palette',
          project_id: 1
        })
        .then(response => {
          response.should.have.status(422);
          response.body.error.should.equal('Expected format: { name: <String>, color_1: <String>, color_2: <String>, color_3: <String>, color_4: <String>, color_5: <String>, project_id: <Integer> }. You\'re missing a "color_1" property.')
        })
        .catch(error => {
          throw error;
      });
    });
  });

  describe('GET /api/v1/projects/:id/palettes/', () => {
    it('should return palettes associated with project id', () => {
      return chai.request(server)
      .get('/api/v1/projects/1/palettes')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(2);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Warm Colors');
        response.body[0].should.have.property('project_id');
        response.body[0].project_id.should.equal(1);
        response.body[0].should.have.property('color_1');
        response.body[0].color_1.should.equal('#3E92CC');
        response.body[0].should.have.property('color_2');
        response.body[0].color_2.should.equal('#3E92CC');
        response.body[0].should.have.property('color_3');
        response.body[0].color_3.should.equal('#3E92CC');
        response.body[0].should.have.property('color_4');
        response.body[0].color_4.should.equal('#3E92CC');
        response.body[0].should.have.property('color_5');
        response.body[0].color_5.should.equal('#3E92CC');
      })
      .catch(error => {
        throw error;
      })
    })
  })

  describe('DELETE /api/v1/palettes/', () => {
    it('should delete a palette associated with palette id', () => {
      return chai.request(server)
      .delete('/api/v1/palettes/')
      .send({
        id: 1
      })
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
      })
      .catch(error => {
        throw error;
      })
    })
  })
});
