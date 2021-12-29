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
        `SCHTASKS /CREATE /SC DAILY /TN "CommitMint" /TR "C:\\Users\\Pkeld\\Documents\\commit-mint\\runNode.bat" /ST 10:00\n`
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
let logFileText = "Daily log for " + Date(Date.now().toLocaleString);
  fs.writeFile("currentTime.txt", logFileText, (error) =>
  error ? console.log("git error: ", error) : false
);

  for (let i = 0; i < 5; i++) {
    let stringI = "commit index: " + i + Date(Date.now().toLocaleString) + "\n";
    setTimeout(() => {
      // console.log("format date: ",i)
      console.log("fs 500 index: ", i);
      fs.appendFile("currentTime.txt", stringI, (error) =>
        error ? console.log("git error: ", error) : false
      );
    }, 50 + (i ? i * 1000 : 1));
    setTimeout(() => {
      console.log("git add 1500 index: ",i)
      execShellCommand(`git add .\n`);
    }, 100 + (i ? i * 1000 : 1));
    setTimeout(() => {
      console.log("git commit 2500 index: ", i);
      execShellCommand(`git commit -m "${stringI}"\n`);
    }, 150 + (i ? i * 1000 : 1));
    setTimeout(() => {
      console.log("git push 3500 index: ", i);
      execShellCommand(`git push --force origin paul\n`);
    }, 200 + (i ? i * 1000 : 1));
  }
}

init();
