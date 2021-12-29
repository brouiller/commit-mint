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
        `SCHTASKS /CREATE /SC DAILY /TN "CommitMint" /TR "C:\\Users\\Bradley\\Documents\\projects\\commit-mint\\runNode.bat" /ST 10:00\n`
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
  let stringI = ""
  for (let i = 0; i < 3; i++) {
    stringI = stringI + "commit index: " + i + Date(Date.now().toLocaleString).slice(0,24) + "\n";
    setTimeout(() => {
      // console.log("format date: ",i)
      console.log("fs: ", i);
      fs.writeFile("currentTime.txt", stringI, (error) =>
        error ? console.log("git error: ", error) : false
      );
    }, 50 + (i ? i * 1000 : 10));
    setTimeout(() => {
      console.log("git add: ",i)
      execShellCommand(`git add .\n`);
    }, 100 + (i ? i * 1000 : 10));
    setTimeout(() => {
      console.log("git commit: ", i);
      execShellCommand(`git commit -m "commit-index ${stringI}"`);
    }, 150 + (i ? i * 1000 : 10));
    setTimeout(() => {
      console.log("git push: ", i);
      execShellCommand(`git push --force origin bradley`);
    }, 200 + (i ? i * 1000 : 10));
  }
};

init();
