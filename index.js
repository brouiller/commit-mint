const fs = require("fs");

//runs the program
const init = () => {
  try {
    if (fs.existsSync("runNode.bat")) {
      commitMint();
    } else {
      fs.writeFile(
        "runNode.bat",
        "@echo off\ncd C:\\Users\\Bradley\\Documents\\projects\\commit-mint\nnode index.js",
        (error) => (error ? console.log(error) : console.log("stuff ran"))
      );
      execShellCommand(
        `SCHTASKS /CREATE /SC DAILY /TN "CommitMint\\MyTask" /TR "C:\\Users\\Bradley\\Documents\\projects\\commit-mint\\runNode.bat" /ST 13:21\n`
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
  for (let i = 0; i < 3; i++) {
    const formatDate = Date(Date.now().toLocaleString) + i;
    console.log("format date: ",formatDate)
    fs.writeFile("currentTime.txt", formatDate, (error) => console.log("git error: ",error));
    setTimeout(() => {
      execShellCommand(`git add .\n`);
    }, 500);
    setTimeout(() => {
      execShellCommand(`git commit -m "${formatDate.slice(0, 24)}"\n`);
    }, 1000);
    setTimeout(() => {

      execShellCommand(`git push --force origin bradley\n`);

    }, 1500);
  }
};

init();
