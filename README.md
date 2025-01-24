# Video Transcript Adder

A Node.js application to add text overlays (transcripts) to videos, encode them to vertical format, concatenate multiple videos, and add background audio.

## Features

- Download videos from URLs.
- Encode videos to vertical format (1080x1920).
- Add text overlays (transcripts) to videos with customizable font, size, and position.
- Concatenate multiple videos into a single video.
- Add background audio to the final video.
- Clean up temporary files after processing.

## File Structure

```
Video-Transcript-Adder/
├── .gitignore
├── index.js
├── main.js
├── package-lock.json
├── package.json
├── temp.py
├── usage.md
└── README.md
```

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:webcrafter011/Video-Transcript-Adder.git
   cd Video-Transcript-Adder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure FFmpeg is installed on your system. You can download it from [FFmpeg's official website](https://ffmpeg.org/download.html).

## Usage

1. Update the `main.js` file with your video URLs, transcription details, and audio link.

2. Run the script:
   ```bash
   node main
   ```

## Configuration

- **Video URLs**: Add the URLs of the videos you want to process in the `videoLinks` array in `main.js`.
- **Transcription Details**: Define the text, start time, and end time for each transcription in the `transcriptions` array in `main.js`.
- **Audio Link**: Provide the URL of the background audio in the `audioLink` variable in `main.js`.

## Dependencies

- [axios](https://www.npmjs.com/package/axios): For downloading files.
- [fluent-ffmpeg](https://www.npmjs.com/package/fluent-ffmpeg): For video processing.
- [ffmpeg-static](https://www.npmjs.com/package/ffmpeg-static): Provides a static build of FFmpeg.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

- **webcrafter011**
