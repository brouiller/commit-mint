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
        "@echo off\ncd C:\\Users\\Morga\\Desktop\\Projects\\commit-mint\nnode index.js",
        (error) =>
          error ? console.log(error) : console.log("bat file created")
      );
      fs.writeFile(
        "run.vbs",
        `Set WshShell = CreateObject("WScript.Shell")\n
        WshShell.Run chr(34) & "C:\\Users\\Morga\\Desktop\\Projects\\commit-mint\\runNode.bat" & Chr(34), 0\n
        Set WshShell = Nothing\n`,
        (error) =>
          error ? console.log(error) : console.log("vbs file created")
      );
      execShellCommand(
        `SCHTASKS /CREATE /SC DAILY /TN "CommitMint\\commit" /TR "C:\\Users\\Morga\\Desktop\\Projects\\commit-mint\\run.vbs" /ST 09:09\n`
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
  let logFileText = `{"date": "${Date(Date.now().toLocaleString)}",`;
  fs.writeFile("log.json", logFileText, (error) =>
    error ? console.log("git error: ", error) : false
  );
  let loopLength = 20;
  for (let i = 0; i < loopLength; i++) {
    let stringI = `{"commit": "${i}"}`;
    setTimeout(() => {
      fs.appendFile(
        "log.json",
        `"fs command": "appendFile", "fsTime": "${50 + (i ? i * 1000 : 1)}",`,
        (error) => (error ? console.log("git error: ", error) : false)
      );
    }, 50 + (i ? i * 1000 : 1));
    setTimeout(() => {
      fs.appendFile(
        "log.json",
        `"git command": "add", "addTime": "${100 + (i ? i * 1000 : 1)}",`,
        (error) => (error ? console.log("git error: ", error) : false)
      );
      execShellCommand(`git add .\n`);
    }, 100 + (i ? i * 1000 : 1));
    setTimeout(() => {
      fs.appendFile(
        "log.json",
        `"git command": "commit", "commitTime": "${150 + (i ? i * 1000 : 1)}",`,
        (error) => (error ? console.log("git error: ", error) : false)
      );
      execShellCommand(`git commit -m "${stringI}"\n`);
    }, 150 + (i ? i * 1000 : 1));
    setTimeout(() => {
      fs.appendFile(
        "log.json",
        `"git command": "push", "pushTime": "${200 + (i ? i * 1000 : 1)}",`,
        (error) => (error ? console.log("git error: ", error) : false)
      );
      execShellCommand(`git push --force origin Morga\n`);
    }, 200 + (i ? i * 1000 : 1));
    if (i = loopLength - 1) {
      setTimeout(() => {
        fs.appendFile("log.json", `"end": "${250 + (i ? i * 1000 : 1)}"}`, (error) =>
          error ? console.log("git error: ", error) : false
        );
      }, 250 + (i ? i * 1000 : 1));
    }
  }
};

init();
