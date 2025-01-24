const fs = require("fs");
const path = require("path");
const axios = require("axios");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

// Configure ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

// Helper function: Download a file from a URL
async function downloadFile(url, outputPath) {
  const writer = fs.createWriteStream(outputPath);
  const response = await axios.get(url, { responseType: "stream" });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

// Helper function: Escape special characters in text
function escapeText(text) {
  return text.replace(/'/g, "'\\''").replace(/\\/g, "\\\\");
}

// Helper function: Split text into lines
function splitTextIntoLines(text, maxLineWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    if ((currentLine + word).length <= maxLineWidth) {
      currentLine += `${word} `;
    } else {
      lines.push(currentLine.trim());
      currentLine = `${word} `;
    }
  });

  if (currentLine) lines.push(currentLine.trim());
  return lines;
}

// Helper function: Display a loading bar
function showLoadingBar(step, totalSteps, stepName) {
  const barLength = 20;
  const filled = Math.round((step / totalSteps) * barLength);
  const empty = barLength - filled;
  const bar = "█".repeat(filled) + "░".repeat(empty);
  process.stdout.write(
    `\r${stepName} [${bar}] ${Math.round((step / totalSteps) * 100)}%`
  );
  if (step === totalSteps) {
    process.stdout.write("\n"); // Move to the next line after completion
  }
}

// Step 2: Encode each video as a vertical video
async function encodeToVertical(inputVideo, outputVideo) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputVideo)
      .outputOptions([
        "-vf",
        "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920", // Scale and crop
        "-c:v",
        "libx264", // Video codec
        "-c:a",
        "aac", // Audio codec
        "-r",
        "30", // Frame rate
        "-strict",
        "experimental", // Allow experimental codecs
      ])
      .on("error", (err) => {
        console.error("Error encoding video:", err.message);
        reject(err);
      })
      .on("end", () => {
        resolve(outputVideo);
      })
      .save(outputVideo);
  });
}

// Step 3: Add text overlay to a video
async function addTranscriptsToVideo(
  inputVideo,
  transcriptionDetails,
  outputVideo
) {
  return new Promise((resolve, reject) => {
    const textFilters = transcriptionDetails
      .map((transcript) => {
        const escapedText = escapeText(transcript.text);
        const startTime = transcript.start; // Start timestamp in seconds
        const endTime = transcript.end; // End timestamp in seconds

        // Split the text into lines
        const maxLineWidth = 30; // Maximum characters per line
        const lines = splitTextIntoLines(escapedText, maxLineWidth);

        // Create a drawtext filter for each line
        return lines
          .map(
            (line, index) =>
              `drawtext=text='${line}':fontsize=52:fontcolor=white:fontfile='C\\:/Windows/Fonts/Arial.ttf':x=(w-text_w)/2:y=(h-text_h-50-${
                index * 60
              }):enable='between(t,${startTime},${endTime})'`
          )
          .join(",");
      })
      .join(",");

    console.log("Applying text filters:", textFilters); // Log the filters for debugging

    ffmpeg(inputVideo)
      .videoFilters(textFilters)
      .on("error", (err) => {
        console.error("Error adding transcripts:", err.message);
        console.error("FFmpeg stderr:", err); // Log the full error
        reject(err);
      })
      .on("end", () => {
        console.log("Transcripts added successfully!");
        resolve();
      })
      .save(outputVideo);
  });
}

// Step 4: Concatenate videos
async function concatenateVideos(videoList, outputVideo) {
  const concatFile = path.join(__dirname, "concat_list.txt");
  fs.writeFileSync(
    concatFile,
    videoList.map((video) => `file '${video}'`).join("\n")
  );

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(concatFile)
      .inputOptions(["-f concat", "-safe 0"])
      .outputOptions(["-c:v libx264", "-c:a aac"])
      .on("error", (err) => {
        console.error("Error concatenating videos:", err.message);
        reject(err);
      })
      .on("end", () => {
        fs.unlinkSync(concatFile);
        resolve(outputVideo);
      })
      .save(outputVideo);
  });
}

// Step 5: Add background audio to a video
async function addBackgroundAudio(video, audio, outputVideo) {
  return new Promise((resolve, reject) => {
    ffmpeg(video)
      .input(audio)
      .outputOptions([
        "-c:v copy",
        "-c:a aac",
        "-shortest",
        "-map 0:v:0",
        "-map 1:a:0",
      ])
      .on("error", (err) => {
        console.error("Error adding background audio:", err.message);
        reject(err);
      })
      .on("end", () => {
        resolve(outputVideo);
      })
      .save(outputVideo);
  });
}

// Helper function: Delete all files in a directory except the final output video
function cleanupTempDir(tempDir, finalOutputVideo) {
  const files = fs.readdirSync(tempDir);
  files.forEach((file) => {
    const filePath = path.join(tempDir, file);
    if (filePath !== finalOutputVideo) {
      fs.unlinkSync(filePath);
    }
  });
}

// Main function: Generate the video
async function generateVideo(transcriptionDetails, videoDetails, audioLink) {
  const tempDir = path.join(__dirname, "temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const downloadedVideos = [];
  const verticalVideos = [];
  let backgroundAudioPath;

  console.log("Starting video generation process...");
  try {
    // Step 1: Download videos
    console.log("Downloading videos...");
    for (let i = 0; i < videoDetails.length; i++) {
      showLoadingBar(i, videoDetails.length, "Downloading videos");
      const videoPath = path.join(tempDir, `video_${i}.mp4`);
      await downloadFile(videoDetails[i], videoPath);
      downloadedVideos.push(videoPath);
    }
    showLoadingBar(
      videoDetails.length,
      videoDetails.length,
      "Downloading videos"
    );

    // Step 2: Encode videos to vertical format
    console.log("Encoding videos to vertical format...");
    for (let i = 0; i < downloadedVideos.length; i++) {
      showLoadingBar(i, downloadedVideos.length, "Encoding videos");
      const inputVideo = downloadedVideos[i];
      const verticalVideoPath = path.join(tempDir, `vertical_${i}.mp4`);
      await encodeToVertical(inputVideo, verticalVideoPath);
      verticalVideos.push(verticalVideoPath);
    }
    showLoadingBar(
      downloadedVideos.length,
      downloadedVideos.length,
      "Encoding videos"
    );

    // Step 3: Concatenate all vertical videos
    console.log("Concatenating videos...");
    const concatenatedVideo = path.join(tempDir, "concatenated_video.mp4");
    await concatenateVideos(verticalVideos, concatenatedVideo);
    showLoadingBar(1, 1, "Concatenating videos");

    // Step 4: Add transcripts to the concatenated video
    console.log("Adding transcripts...");
    const finalVideoWithText = path.join(tempDir, "final_video_with_text.mp4");
    await addTranscriptsToVideo(
      concatenatedVideo,
      transcriptionDetails,
      finalVideoWithText
    );
    showLoadingBar(1, 1, "Adding transcripts");

    // Step 5: Download and add background audio
    console.log("Adding background audio...");
    backgroundAudioPath = path.join(tempDir, "background_audio.mp3");
    await downloadFile(audioLink, backgroundAudioPath);
    showLoadingBar(1, 1, "Downloading audio");

    const finalVideo = path.join(tempDir, "final_output.mp4");
    await addBackgroundAudio(
      finalVideoWithText,
      backgroundAudioPath,
      finalVideo
    );
    showLoadingBar(1, 1, "Adding background audio");

    console.log("Video generation completed successfully!");

    // Clean up temporary files (keep only the final output video)
    cleanupTempDir(tempDir, finalVideo);

    return finalVideo; // Return path to the final video
  } catch (error) {
    console.error("Error during video generation:", error.message);
    throw error;
  }
}

// Export the main function
module.exports = { generateVideo };
