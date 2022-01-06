// library used to read and write files
const fs = require("fs");

// default variables
let loopLength = 1;
let projectDirectory = "";
let runFrequency = "DAILY";
let runTime = "11:00";
let taskName = "CommitMint";
let commitPrefix = "commit";
let branchName = "main";

//reads the config file to set variables and runs function to check whether necessary files have been created
const init = () => {
  fs.readFile("config.json", "utf8", (err, data) => {
    const fileContents = JSON.parse(data);
    loopLength = parseInt(fileContents.loopLength);
    projectDirectory = fileContents.projectDirectory;
    runFrequency = fileContents.runFrequency;
    runTime = fileContents.runTime;
    taskName = fileContents.taskName;
    commitPrefix = fileContents.commitPrefix;
    branchName = fileContents.branchName;
    console.log(typeof loopLength);
    doFilesExist();
  });
};

//checks to see if the bat and vbs files exits, if they don't, it writes the vbs and bat files
const doFilesExist = () => {
  try {
    if (fs.existsSync("runNode.bat") && fs.existsSync("run.vbs")) {
      commitMint();
    } else {
      fs.writeFile( //this is the file that runs the index.js file in node in the appropriate directory
        "runNode.bat",
        `@echo off\ncd ${projectDirectory}\nnode index.js`,
        (error) =>
          error ? console.log(error) : console.log("bat file created")
      );
      fs.writeFile( //this file that task scheduler runs and makes it so that the batch file is run in the background instead of in a command prompt
        "run.vbs",
        `Set WshShell = CreateObject("WScript.Shell")\n
        WshShell.Run chr(34) & "${projectDirectory}\\runNode.bat" & Chr(34), 0\n
        Set WshShell = Nothing\n`,
        (error) =>
          error ? console.log(error) : console.log("vbs file created")
      );
      execShellCommand( //this command schedules the task
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

//writes a log file (overwrites if it already exists) and appends new information each time the loop runs so that
//there are changes to commit and push
const commitMint = () => {
  let logFileText = `"date": "${Date(Date.now().toLocaleString)}",`;
  fs.writeFile("commitMint.txt", logFileText, (error) =>
    error ? console.log("git error: ", error) : false
  );
  console.log("LoopLength: ", loopLength)
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