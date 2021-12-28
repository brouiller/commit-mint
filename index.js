const fs = require("fs");

//runs the program
const init = () => {
  try {
    if (fs.existsSync("runNode.bat")) {
      commitMint();
    } else {
      fs.writeFile(
        "runNode.bat",
        "@echo off\ncd C:\\Users\\Morga\\Desktop\\Projects\\commit-mint\nnode index.js",
        (error) => (error ? console.log(error) : console.log("stuff ran"))
      );
      execShellCommand(
        `SCHTASKS /CREATE /SC DAILY /TN "CommitMint\\MyTask" /TR "C:\\Users\\Morga\\Desktop\\Projects\\commit-mint\\runNode.bat" /ST 13:21\n`
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
  for (let i = 0; i < 20; i++) {
    let stringI = "commit index: " + i + Date(Date.now().toLocaleString);
    setTimeout(() => {
      // console.log("format date: ",i)
      console.log("fs 500 index: ", i);
      fs.writeFile("currentTime.txt", stringI, (error) =>
        error ? console.log("git error: ", error) : false
      );
    }, 50 + (i ? i * 500 : 1));
    setTimeout(() => {
      console.log("git add 1500 index: ",i)
      execShellCommand(`git add .\n`);
    }, 100 + (i ? i * 500 : 1));
    setTimeout(() => {
      console.log("git commit 2500 index: ", i);
      execShellCommand(`git commit -m "${stringI}"\n`);
    }, 150 + (i ? i * 500 : 1));
    setTimeout(() => {
      console.log("git push 3500 index: ", i);
      execShellCommand(`git push --force origin bradley\n`);
    }, 200 + (i ? i * 500 : 1));
  }
};

init();
