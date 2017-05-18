const PORT = 3002;
const min = 50;
const max = 250;
const http = require('http');
const connect = require('connect');
const connectStatic = require('serve-static');
const exec = require('child_process').exec;

const command = (servo, progress) => {
  servo = servo || 0;
  if (isNaN(progress) || typeof progress !== 'number') {
    progress = 50;
  }

  if (progress < 5) {
    progress = 5;
  } else if (progress > 95) {
    progress = 95;
  }

  const cmd = 50 + 200*progress/100;
  return `echo ${servo}=${cmd} > /dev/servoblaster`;
};


const app = connect();
app.use(connectStatic('dist'))
const server = http.createServer(app);
server.listen(PORT, console.log.bind(this, 'server listening on port %s', PORT));

const io = require('socket.io')(server);

io.on('connection', client => {
  client.on('progress', (servo, progress) => {
    exec(command(servo, progress), (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
    });
  });
});
