// main.js
const { generateVideo } = require("./index.js");

const transcriptions = [
  {
    id: 0,
    start: 0,
    end: 3,
    text: "What would you say?",
  },
  {
    id: 1,
    start: 3,
    end: 7,
    text: "Is this balance between doing what you find?",
  },
  {
    id: 2,
    start: 7,
    end: 10,
    text: "Do what you like. Kind of vibes versus making money.",
  },
  {
    id: 3,
    start: 10,
    end: 13,
    text: "random random random.",
  },
];

const videoLinks = [
  "https://videos.pexels.com/video-files/4535145/4535145-hd_1080_1920_25fps.mp4",
  "https://videos.pexels.com/video-files/2516159/2516159-hd_1920_1080_24fps.mp4",
  "https://videos.pexels.com/video-files/5013993/5013993-hd_1920_1080_25fps.mp4",
];

const audioLink =
  "https://dbuzz-assets.s3.amazonaws.com/static/sample_audio.mp3";

generateVideo(transcriptions, videoLinks, audioLink)
  .then((videoPath) => console.log("Video generated at:", videoPath))
  .catch((error) => console.error("Failed to generate video:", error));
