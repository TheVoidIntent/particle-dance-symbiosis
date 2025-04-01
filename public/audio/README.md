
# Audio Files Directory for IntentSim

This directory contains audio files for the Intent Universe Framework website.

## Organized Audio Structure

Audio files are now organized into categorized directories to make it easier to manage a large collection:

```
/audio/
  ├── README.md (this file)
  ├── categories/
  │   ├── README.md (category structure documentation)
  │   ├── lectures/
  │   │   ├── README.md (lectures-specific guidelines)
  │   │   ├── introduction-to-intent-theory.mp3
  │   │   └── charge-knowledge-transfer.mp3
  │   ├── technical/
  │   │   ├── README.md (technical-specific guidelines)
  │   │   ├── particle-interaction-dynamics.mp3
  │   │   └── simulation-parameters-explained.mp3
  │   ├── research/
  │   │   ├── README.md (research-specific guidelines)
  │   │   └── emergent-complexity-patterns.mp3
  │   ├── interviews/
  │   │   ├── README.md (interviews-specific guidelines)
  │   │   └── dr-samantha-chen-interview.mp3
  │   └── ambient/
  │       ├── README.md (ambient-specific guidelines)
  │       └── field-fluctuation-sonification.mp3
```

## Required Audio Files

The following audio files are expected by the SharedAudioLibrary component. Place your MP3 files in their respective category folders:

1. `categories/lectures/introduction-to-intent-theory.mp3` - Overview of the fundamental concepts
2. `categories/technical/particle-interaction-dynamics.mp3` - Technical explanation of particle interactions
3. `categories/research/emergent-complexity-patterns.mp3` - Analysis of patterns emerging from simulations
4. `categories/lectures/charge-knowledge-transfer.mp3` - How particle charge affects information exchange
5. `categories/technical/simulation-parameters-explained.mp3` - Guide to simulation parameters

## Audio File Specifications

For best results:
- Use MP3 format with 128-256 kbps bitrate
- Keep file sizes below 15MB per file for faster loading
- Ensure clear audio quality for better user experience
- Add proper metadata to your audio files (artist, title, etc.)

## Managing Large Audio Collections

When dealing with a large number of audio files:
1. Always place files in the appropriate category folder
2. Follow the naming conventions specified in each category's README
3. Consider compressing larger files to reduce loading times
4. Use the AudioFileUploader component to maintain metadata
5. Regularly backup your audio collection

## Troubleshooting

If audio files are not playing:
- Verify files have correct names and are in MP3 format
- Check browser console for any errors
- Ensure your server is configured to serve MP3 files
- Make sure the files aren't too large (15MB+ can cause loading issues)
