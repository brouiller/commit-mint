const fs = require("fs");

const init = () => {
  doesBatchFileExist();
//   infiniteMonkey();

};

//checks to see if the commands batch file exits, if it doesn't, it writes the file
const doesBatchFileExist = () => {
  const commands = `git add .\ngit commit\ngit push`;
  fs.stat("commands.bat", function (err, stat) {
    if (err !== null) {
      fs.writeFile("commands.bat", commands, (err) => {
        if (err) console.log(err);
        else {
          console.log("File written successfully\n");
          console.log("The written has the following contents:");
          console.log(fs.readFileSync("commands.bat", "utf8"));
        }
      });
        execShellCommand(
          `SCHTASKS /CREATE /SC DAILY /TN "CommitMint task" /TR "runNode.bat" /ST 11:00`
        );
    } else {
          execShellCommand("commands.bat");
    }
  });
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

init();
