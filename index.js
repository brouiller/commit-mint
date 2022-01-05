const fs = require("fs");
let loopLength = 5;
let projectDirectory = "C:\\Users\\Bradley\\Documents\\projects\\commit-mint";
let runFrequency = "DAILY";
let runTime = "11:00";
let taskName = "CommitMint";
let commitPrefix = "commit";
let branchName = "bradley";
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
        `@echo off\ncd ${projectDirectory}\nnode index.js`,
        (error) =>
          error ? console.log(error) : console.log("bat file created")
      );
      fs.writeFile(
        "run.vbs",
        `Set WshShell = CreateObject("WScript.Shell")\n
        WshShell.Run chr(34) & "${projectDirectory}\\runNode.bat" & Chr(34), 0\n
        Set WshShell = Nothing\n`,
        (error) =>
          error ? console.log(error) : console.log("vbs file created")
      );
      execShellCommand(
        `SCHTASKS /CREATE /SC ${runFrequency} /TN "${taskName}" /TR "${projectDirectory}\\run.vbs" /ST ${runTime}\n`
      );
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
  let logFileText = `"date": "${Date(Date.now().toLocaleString)}",`;
  fs.writeFile("commitMint.txt", logFileText, (error) =>
    error ? console.log("git error: ", error) : false
  );
  for (let i = 0; i < loopLength; i++) {
    let commitMessage = `${commitPrefix}: ${i}`;
    setTimeout(() => {
      console.log("fs command: ", i);
      fs.appendFile(
        "commitMint.txt",
        `"fs command${i}": "appendFile", "fsTime${i}": "${
          50 + (i ? i * 1000 : 1)
        }",`,
        (error) => (error ? console.log("git error: ", error) : false)
      );
    }, 50 + (i ? i * 1000 : 1));
    setTimeout(() => {
      console.log("git add: ", i);
      fs.appendFile(
        "commitMint.txt",
        `"gitAdd${i}": "add", "addTime${i}": "${100 + (i ? i * 1000 : 1)}",`,
        (error) => (error ? console.log("git error: ", error) : false)
      );
      execShellCommand(`git add .\n`);
    }, 100 + (i ? i * 1000 : 1));
    setTimeout(() => {
      fs.appendFile(
        "commitMint.txt",
        `"gitCommit${i}": "commit", "commitTime${i}": "${
          150 + (i ? i * 1000 : 1)
        }",`,
        (error) => (error ? console.log("git error: ", error) : false)
      );
      execShellCommand(`git commit -m "${commitMessage}"\n`);
    }, 150 + (i ? i * 1000 : 1));
    setTimeout(() => {
      fs.appendFile(
        "commitMint.txt",
        `"gitPush${i}": "push", "pushTime${i}": "${
          200 + (i ? i * 1000 : 1)
        }"\n`,
        (error) => (error ? console.log("git error: ", error) : false)
      );
      execShellCommand(`git push --force origin ${branchName}\n`);
    }, 200 + (i ? i * 1000 : 1));
  }
};

init();
