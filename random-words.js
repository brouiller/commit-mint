const fs = require("fs");
const fetch = require("cross-fetch");

const shakespeare = [
  "who's",
  "there",
  "nay",
  "answer",
  "me",
  "stand",
  "and",
  "unfold",
  "yourself",
  "long",
  "live",
  "the",
  "king",
  "bernardo",
  "he",
  "you",
  "come",
  "most",
  "carefully",
  "upon",
  "your",
  "hour",
  "tis",
  "now",
  "struck",
  "twelve",
  "get",
  "thee",
  "to",
  "bed",
  "francisco",
  "for",
  "this",
  "relief",
  "much",
  "thanks",
  "tis",
  "bitter",
  "cold",
  "and",
  "I",
  "am",
  "sick",
  "at",
  "heart",
  "have",
  "you",
  "had",
  "quiet",
  "guard",
  "not",
  "a",
  "mouse",
  "stirring",
  "well",
  "good",
  "night",
  "if",
  "you",
  "do",
  "meet",
  "horatio",
  "and",
  "marcellus",
  "the",
  "rivals",
  "of",
  "my",
  "watch",
  "bid",
  "them",
  "make",
  "haste",
];

async function infiniteMonkey() {
  let monkey = await fetch(
    "https://random-word-api.herokuapp.com/word?number=73&swear=0"
  )
    .then((response) => response.json())
    .then((monkey) => {
      if (monkey === shakespeare) {
        console.log("HOLY SHIT IT ACTUALLY WROTE SHAKESPEARE");
      } else {
        console.log("SORRY, IT DID NOT WRITE SHAKESPEARE");
      }
      let monkeyData = monkey.toString();
      fs.writeFile("monkey-attempt.txt", monkeyData, (err) => {
        if (err) console.log(err);
        else {
          console.log("File written successfully");
        }
      });
    });
}

infiniteMonkey();
