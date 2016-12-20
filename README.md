Proxo
-----

A commandline http proxy supporting multiple endpoints

### Example

    proxo --port 3000 \
      --rule /::http://localhost:3001 \
      --rule /api::https://api.server.com

It will forward
- all requests at 127.0.0.1:3000 to localhost:3001
- all requests at 127.0.0.1:3000/api to https://api.server.com/api

Last rules have higher priority.
