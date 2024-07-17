const portfinder = require('portfinder');
portfinder.getPort({ port: 3005 }, function (err, port) {
  process.stdout.write(port.toString())
});