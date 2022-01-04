const request = require('supertest');
var app = require("../server")
var expect = require('chai').expect
let projectFactory = require("./factories/project")

describe('Projects', function () {

  beforeEach(async function () {
    await projectFactory.deleteAllProjects()
  })

  describe('GET ALL', function () {
    it('should get all projects', async function () {
      await projectFactory.createProject()
      request(app)
        .get('/projects')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          expect(res.body.success).to.equal(true)
          expect(res.body.data).to.have.length(1)
        });
    });
  });

  describe('GET ONE', function () {
    it('should give error if project not found', function (done) {
      request(app)
        .get('/projects/1')
        .expect('Content-Type', /json/)
        .expect(404)
        .end(function (err, res) {
          if (err) throw err;
          expect(res.body.success).to.equal(false)
          done()
        });
    });
    it('should get one project', async function () {
      await projectFactory.createProject({ id: 1, name: "UMS" })
      request(app)
        .get('/projects/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          expect(res.body.success).to.equal(true)
          expect(res.body.data).to.not.equal(null)
        });
    });
  });

  describe('UPDATE', function () {
    it('should throw error if project not found', function () {
      request(app)
        .put('/projects/1')
        .expect('Content-Type', /json/)
        .expect(404)
        .end(function (err, res) {
          if (err) throw err;
          expect(res.body.success).to.equal(false)
        });
    });
    it('should update project', async function () {
      await projectFactory.createProject({ id: 1, name: "UMS" })
      request(app)
        .put('/projects/1')
        .send({ name: "CMS" })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async function (err, res) {
          if (err) throw err;
          expect(res.body.success).to.equal(true)
          let projects = await projectFactory.getProjects({ id: 1 })
          expect(projects[0].name).to.equal("CMS")
        });
    });
  });

  describe('DELETE', function () {
    it('should delete project', async function () {
      await projectFactory.createProject({ id: 1, name: "UMS" })
      request(app)
        .delete('/projects/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          expect(res.body.success).to.equal(true)
        });
    });
  });

  describe('CREATE', function () {
    it('should create project', function () {
      request(app)
        .post('/projects')
        .send({
          id: 1,
          name: "UMS"
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async function (err, res) {
          if (err) throw err;
          expect(res.body.success).to.equal(true)
          let projects=await projectFactory.getProjects()
          expect(projects.length).to.equal(1)
        });
    });
  });
});
