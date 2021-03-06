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

  it('should add a blog post on POST', function() {
  	const newPost = {title: 'Test', content: 'Blablablabla', author: 'Jane'};
  	return chai.request(app)
  		.post('/blog-posts')
  		.send(newPost)
  		.then(function(res) {
  			newPost.publishDate = res.body.publishDate;
  			res.should.have.status(201);
  			res.should.be.json;
  			res.body.should.be.a('object');
  			res.body.should.include.keys('id', 'title', 'content', 'author');
  			res.body.id.should.not.be.null;
  			res.body.should.deep.equal(Object.assign(newPost, {id: res.body.id}));
  		});
  });

  // it('should update blog posts on PUT', function() {
  // 	const updatePost = {
  // 		title: 'foo',
  // 		content: 'lorem ipsum dolor sit amet',
  // 		author: 'bizz'
  // 	};
  // 	return chai.request(app)
  // 		.get('/blog-posts')
  // 		.then(function(res) {
  // 			// console.log('res body---',res.body);
  // 			updatePost.id = res.body[0].id;
  // 			updatePost.publishDate = res.body[0].publishDate;
  // 			console.log('updatePost---',updatePost);
  // 			return chai.request(app)
  // 				.put(`/blog-posts/${updatePost.id}`)
  // 				.send(updatePost)
  // 		})
  // 		.then(function(res) {
  // 			console.log('put res body ---',res);
  // 			res.should.have.status(204);
  // 			// res.should.be.json;
  // 			res.body.should.be.a('object');
  // 			res.body.should.deep.equal(updatePost);
  // 		});
  // });

  it('should delete blog posts on DELETE', function() {
  	return chai.request(app)
  		.get('/blog-posts')
  		.then(function(res) {
  			return chai.request(app)
  				.delete(`/blog-posts/${res.body[0].id}`)
  		})
  		.then(function(res) {
  			res.should.have.status(204);
  		});
  });

}); 




























