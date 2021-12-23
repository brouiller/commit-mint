const fs = require("fs");
const fetch = require("cross-fetch");

//runs the program
const init = () => {
  doesBatchFileExist();
};

//checks to see if the commands batch file exits, if it doesn't, it writes the file
async function doesBatchFileExist() {
  const commands = `@echo off\nnode index.js\nexit`;
  fs.stat("runNode.bat", function (err, stat) {
    if (err !== null) {
      fs.writeFile("runNode.bat", commands, (err) => {
        if (err) console.log(err);
        else {
          console.log("File written successfully\n");
          console.log("The written has the following contents:");
          console.log(fs.readFileSync("runNode.bat", "utf8"));
        }
      });
      execShellCommand(
        `SCHTASKS /CREATE /SC DAILY /TN "CommitMint" /TR "runNode.bat" /ST 11:00`
      );
      infiniteMonkey();
      commitMint();
    } else {
      commitMint();
    }
  });
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
async function commitMint() {
  for (let i = 0; i < 2; i++) {
    execShellCommand("git add .");
    execShellCommand(
      `git commit -m "the first word in monkey-attempt.txt is ${firstWord}"`
    );
    await execShellCommand("git push origin main");
    console.log("first word: ", firstWord);
    infiniteMonkey();
  }
}

let firstWord = "";
//generates a text file with random words in it
async function infiniteMonkey() {
  let monkey = await fetch(
    "https://random-word-api.herokuapp.com/word?number=73&swear=0"
  )
    .then((response) => response.json())
      .then((monkey) => {
          firstWord = monkey[0];
      let monkeyData = monkey.toString();
      fs.writeFile("monkey-attempt.txt", monkeyData, (err) => {
        //we're going to write any errors/successes to a log file
        if (err) console.log(err);
      });
    });
}

init();
