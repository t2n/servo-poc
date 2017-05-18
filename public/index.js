const _ = require('underscore');
const socket = io();

const command = _.throttle((servo, progress) => {
  console.log('0 emittint %s', progress);
  socket.emit('progress', servo, progress);
}, 100);
const command2 = _.throttle((servo, progress) => {
  console.log('1 emittint %s', progress);
  socket.emit('progress', servo, progress);
}, 100);

document.querySelector('.control').addEventListener('mousemove', e => {
  const mouseControlOn = document.querySelector('[name="controlOn"]:checked');
  if (mouseControlOn) {
    let x = e.offsetX;
    let y = e.offsetY;
    if (x < 0) x = 0;
    if (x > 100) x = 100;
    if (y < 0) y = 0;
    if (y > 100) y = 100;

    command(0, x);
    command2(1, y);
  }
});


document.querySelector('#progress').addEventListener('change', e => {
  const progress = parseInt(e.target.value, 10);
  const servo = document.querySelector('input[name="servo"]:checked').value;
  if (!isNaN(progress)) {
    console.log('emitting %s', progress);
    command(servo, progress);
  }
});
