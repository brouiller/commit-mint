const fs = require("fs");

//runs the program
const init = () => {
  doesBatchFileExist();
};

//checks to see if the commands batch file exits, if it doesn't, it writes the file
const doesBatchFileExist = () => {
  try {
    if (fs.existsSync("runNode.bat")) {
      commitMint();
    } else {
      fs.writeFile("runNode.bat", `@echo off\nnode index.js`, (error) => error ? console.log(error) : console.log(error));
      execShellCommand(
        `SCHTASKS /CREATE /SC DAILY /TN "CommitMint" /TR "runNode.bat" /ST 12:14\n`
      );
      commitMint();
    }
  } catch (err) {
    console.error(err);
  }
};

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
  const formattedDate = Date(Date.now().toLocaleString).slice(0, 24);
  const formatDate = Date(Date.now().toLocaleString);
  fs.writeFile("currentTime.txt", formatDate, (error) => console.log(error));
  setTimeout(() => {
    execShellCommand(`git add .\n`);
  }, 500);
  setTimeout(() => {
    execShellCommand(`git commit -m "${formattedDate}"\n`);
  }, 1000);
  setTimeout(() => {
    execShellCommand(`git push --force origin bradley\n`);
  }, 1500);
};

init();
