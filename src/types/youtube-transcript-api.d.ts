declare module 'youtube-transcript-api' {
  export interface TranscriptEntry {
    text: string;
    offset: number;
    duration: number;
  }

  export class YoutubeTranscript {
    static fetchTranscript(videoId: string): Promise<TranscriptEntry[]>;
  }
} 