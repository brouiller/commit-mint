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
      fs.writeFile(
        "runNode.bat",
        "@echo off\ncd C:\\Users\\Pkeld\\Desktop\\commit-mint\nnode index.js",
        (error) => (error ? console.log(error) : console.log("stuff ran"))
      );
      execShellCommand(
        `SCHTASKS /CREATE /SC DAILY /TN "CommitMint\\MyTask" /TR "C:\\Users\\Pkeld\\Desktop\\commit-mint\\runNode.bat" /ST 13:21\n`
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
const commitMint = async () => {
  const formattedDate = Date(Date.now().toLocaleString).slice(0, 24);
  const formatDate = Date(Date.now().toLocaleString);

 makeCommits()
 setTimeout(() => {
  execShellCommand(`git push --force origin paul\n`);

 }, 5000)

  //   for (let i = 0; i < 3; i++) {

  //   fs.writeFile("currentTime.txt", formatDate, (error) => console.log(error));
  //   setTimeout(() => {
  //     execShellCommand(`git add .\n`);
  //   }, 500);
  //   setTimeout(() => {
  //     execShellCommand(`git commit -m "${formattedDate}"\n`);
  //   }, 1000);
  //   setTimeout(() => {

  //     execShellCommand(`git push --force origin paul\n`);

  //   }, 1500);
  // }
};

function makeCommits() {
 
  for (let i = 0; i < 3; i++) {
    randomNumberString = Math.floor(Math.random() * 100).toString();
    const formattedDate = Date(Date.now().toLocaleString).slice(0, 24);


    console.log(randomNumberString);
    fs.writeFile("currentTime.txt", randomNumberString, (error) =>
      console.log(error)
    );
    setTimeout(() => {
      execShellCommand(`git add .\n`);
    }, 500);
    setTimeout(() => {
      execShellCommand(`git commit -m "${formattedDate}"\n`);
    }, 1000);
  }
}

init();
