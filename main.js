const { generateVideo } = require("./index.js");

const transcriptions = [
  {
    id: 0,
    start: 0, // Start time in seconds
    end: 3, // End time in seconds
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
    end: 13,
    text: "Do what you like. Kind of vibes versus making money.",
  },
  // {
  //   id: 3,
  //   start: 13,
  //   end: 14,
  //   text: "Well, that's the thing. Know your passion.",
  // },
  // {
  //   id: 4,
  //   start: 14,
  //   end: 16,
  //   text: "Imagine you're on a desert island.",
  // },
  // {
  //   id: 5,
  //   start: 16,
  //   end: 17,
  //   text: "You're allowed four or five books.",
  // },
  // {
  //   id: 6,
  //   start: 17,
  //   end: 30,
  //   text: "They're only about one topic. What's the topic?",
  // },
];

const videoLinks = [
  "https://videos.pexels.com/video-files/4535145/4535145-hd_1080_1920_25fps.mp4",
  "https://videos.pexels.com/video-files/2516159/2516159-hd_1920_1080_24fps.mp4",
  // "https://videos.pexels.com/video-files/855388/855388-uhd_2560_1440_25fps.mp4",
  // "https://videos.pexels.com/video-files/2697636/2697636-uhd_1920_1440_30fps.mp4",
  // "https://videos.pexels.com/video-files/1538130/1538130-hd_1920_1080_30fps.mp4",
];

const audioLink =
  "https://dbuzz-assets.s3.amazonaws.com/static/sample_audio.mp3";

generateVideo(transcriptions, videoLinks, audioLink)
  .then((videoPath) => console.log("Video generated at:", videoPath))
  .catch(console.error);
