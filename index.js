const fs = require("fs");
const fsp = require("fs/promises");
const fetch = require("cross-fetch");
let temp = "";

//runs the program
const init = () => {
  doesBatchFileExist();
};

//checks to see if the commands batch file exits, if it doesn't, it writes the file
async function doesBatchFileExist() {
  try {
    if (fs.existsSync("runNode.bat")) {
      commitMint();
    } else {
      await fsp
        .writeFile("runNode.bat", `@echo off\nnode index.js`)
        .then(
          execShellCommand(
            `SCHTASKS /CREATE /SC DAILY /TN "CommitMint" /TR "runNode.bat" /ST 11:00`
          )
        )
        .then(commitMint());
    }
  } catch (err) {
    console.error(err);
  }
}

//creates a child process for running shell commands
const execShellCommand = (cmd) => {
  const exec = require("child_process").exec;
  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 1024 * 500 }, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      } else if (stdout) {
        console.log(stdout);
      } else {
        console.log(stderr);
      }
      resolve(stdout ? true : false);
    });
  });
};

//runs the loop
const commitMint = () => {
  const formattedDate = Date(Date.now().toLocaleString).slice(0, 24)
  infiniteMonkey()
    .then(execShellCommand(`git add .`))
    .then(
      execShellCommand(
        `git commit -m "${formattedDate}"`
      )
    )
    .then(execShellCommand(`git push origin main`));
};

//generates a text file with random words in it
async function infiniteMonkey() {
  await fetch("https://random-word-api.herokuapp.com/word?number=73&swear=0")
    .then((response) => response.json())
    .then((monkey) => {
      temp = monkey[0];
      let monkeyData = monkey.toString();
      fs.writeFile("monkey-attempt.txt", monkeyData, (err) => {
        //we're going to write any errors/successes to a log file
        if (err) console.log(err);
      });
    });
}

init();
