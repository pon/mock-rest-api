var Hapi    = require('hapi');
var Joi     = require('joi');

var users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    posts: [
      {
        id: 1,
        title: 'Post 1',
        body: 'Post 1 Body'
      },
      {
        id: 2,
        title: 'Post 2',
        body: 'Post 2 Body'
      }
    ]
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'janedoe@gmail.com',
    posts: [
      {
        id: 3,
        title: 'Post 3',
        body: 'Post 3 Body'
      },
      {
        id: 4,
        title: 'Post 4',
        body: 'Post 4 Body'
      }
    ]
  }

];

var server = new Hapi.Server('0.0.0.0', '8080');

var routes = [
  {
    method: 'GET',
    path: '/users',
    config: {
      handler: function (request, reply) {
        reply(users);
      }
    }
  },
  {
    method: 'GET',
    path: '/users/{user_id}',
    config: {
      handler: function (request, reply) {
        if (users[request.params.user_id - 1]) {
          reply(users[request.params.user_id - 1]);
        } else {
           reply({
            error: 'User Not Found'
          }).code(404);
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/users',
    config: {
      handler: function (request, reply) {
        reply({
          id: users.length + 1,
          name: request.payload.name,
          email: request.payload.email,
          posts: []
        });
      },
      validate: {
        payload: {
          name: Joi.string().required(),
          email: Joi.string().email().required()
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/users/{user_id}',
    config: {
      handler: function (request, reply) {
        if (users[request.params.user_id - 1]) {
          reply({
            id: users[request.params.user_id - 1].id,
            name: request.payload.name || users[request.params.user_id - 1].name,
            email: request.payload.email || users[request.params.user_id - 1].email
          });
        } else {
          reply({
            error: 'User Not Found'
          }).code(404);
        }
     }
    }
  },
  {
    method: 'DELETE',
    path: '/users/{user_id}',
    config: {
      handler: function (request, reply) {
        var user = users[request.params.user_id - 1];
        if (user) {
          reply({
            id: request.params.user_id,
            deleted: true
          });
        } else {
          reply({
            error: 'User Not Found'
          }).code(404);
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/users/{user_id}/posts',
    config: {
      handler: function (request, reply) {
        var user = users[request.params.user_id - 1];
        if (user) {
          reply(user.posts);
        } else {
          reply({
            error: 'User Not Found'
          }).code(404);
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/users/{user_id}/posts/{post_id}',
    config: {
      handler: function (request, reply) {
        var post = users[request.params.user_id - 1]
          .posts[request.params.post_id - request.params.user_id - (request.params.user_id == 1 ? 0 : 1)];

        if (post) {
          reply(post);
        } else {
          reply({
            error: 'Post Not Found'
          }).code(404);
        }
      }
    }
  }
];

server.route(routes);

console.log('Server started on port: 8080');
server.start();

