const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../app');

// this lets us use *should* style syntax in our tests
// so we can do things like `(1 + 1).should.equal(2);`
// http://chaijs.com/api/bdd/
const should = chai.should();

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('Blog API', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should list blog posts on GET', function() {
  	return chai.request(app)
  		.get('/blog-posts')
  		.then(function(res) {
  			res.should.have.status(200);
  			res.should.be.json;
  			res.body.should.be.a('array');
  			res.body.length.should.be.at.least(1);
  			res.body.forEach(function(item) {
  				item.should.be.a('object');
  				item.should.include.keys('id', 'title', 'content', 'author');
  			});
  		});
  });
  
})