const fs = require('fs');
const readline = require('readline');
const filePath = '02-write-file/text-file.txt';
const fileWriteStream = fs.createWriteStream(filePath, { flags: 'a' });
console.log('Enter text to be written to the file. Type "exit" to end.');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
});

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('Hooray! You did it!!!');
    rl.close();
    process.exit();
  }

  fileWriteStream.write(input + '\n');
  rl.prompt();
});

rl.on('close', () => {
  process.exit();
});
rl.prompt();

