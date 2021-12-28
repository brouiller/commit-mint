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

// const formatDate = Date(Date.now().toLocaleString);
//runs the loop
const commitMint = () => {
  for (let i = 0; i < 3; i++) {
    let stringI = "commit index: " + i + Date(Date.now().toLocaleString);
    setTimeout(() => {
      // console.log("format date: ",i)
      fs.writeFile("currentTime.txt", stringI, (error) =>
        console.log("git error: ", error)
      );
    }, 500 * (i * 2));
    setTimeout(() => {
      execShellCommand(`git add .\n`);
    }, 1500 * (i * 2));
    setTimeout(() => {
      execShellCommand(`git commit -m "${stringI}"\n`);
    }, 2500 * (i * 2));
    setTimeout(() => {
      execShellCommand(`git push --force origin bradley\n`);
    }, 3500 * (i * 2));
  }
};

init();
