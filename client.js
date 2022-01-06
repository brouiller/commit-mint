//selects all the user input fields
const loopLength = document.getElementById("loopLength");
const projectDirectory = document.getElementById("projectDir");
const runFrequency = document.getElementById("runFreq");
const runTime = document.getElementById("runTime");
const taskName = document.getElementById("taskName");
const commitPrefix = document.getElementById("commitPrefix");
const branchName = document.getElementById("branchName");
const button = document.getElementById("button");

//assembles user input into an array and sends it to the file creation function
const writeConfig = () => {
  const configText = `{"loopLength": "${
    loopLength.value
  }","projectDirectory": "${projectDirectory.value.replaceAll(
    "\\",
    "\\\\"
  )}","runFrequency": "${runFrequency.value}","runTime": "${
    runTime.value
  }","taskName": "${taskName.value}","commitPrefix": "${
    commitPrefix.value
  }","branchName": "${branchName.value}"}`;
  console.log(configText);
  downloadToFile(configText, "config.json", "text/plain");
};

//outputs user input data into a config.json file to be read by the server and initiates a file save/download
const downloadToFile = (content, filename, contentType) => {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
};

//listens for a user to click the submit button and starts the file creation process
document.querySelector(".btn-primary").addEventListener("click", (event) => {
  event.preventDefault();
  writeConfig();
});
