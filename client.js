const loopLength = document.getElementById("loopLength");
const projectDirectory = document.getElementById("projectDir");
const runFrequency = document.getElementById("runFreq");
const runTime = document.getElementById("runTime");
const taskName = document.getElementById("taskName");
const commitPrefix = document.getElementById("commitPrefix");
const branchName = document.getElementById("branchName");
const button = document.getElementById("button");


const writeConfig = () => {
    const configText = `{"loopLength": "${loopLength.value}","projectDirectory": "${projectDirectory.value}","runFrequency": "${runFrequency.value}","runTime": "${runTime.value}","taskName": "${taskName.value}","commitPrefix": "${commitPrefix.value}","branchName": "${branchName.value}"}`
    console.log(configText)
    downloadToFile(configText,"config.json","text/plain")
    }   
    const downloadToFile = (content, filename, contentType) => {
        const a = document.createElement('a');
        const file = new Blob([content], {type: contentType});
        a.href= URL.createObjectURL(file);
        a.download = filename;
        a.click();
          URL.revokeObjectURL(a.href);
    };
      
      document.querySelector('.btn-primary').addEventListener('click', (event) => {
        event.preventDefault()
        writeConfig()
      });