import axios, { AxiosResponse } from 'axios';

// API Response interfaces
export interface TranscriptionApiResponse {
  id: string;
  s3_url: string;
  message: string;
  transcript: string;
  translation: string;
  transcript_confidence: number;
  translation_confidence: number;
  metadata: {
    user_id: string;
    session_id: string;
  };
}

// Request interfaces
export interface TranscriptionRequestMetadata {
  user_id: string;
  session_id: string;
}

export interface TranscriptionRequest {
  audio: File | Blob;
  metadata?: TranscriptionRequestMetadata;
}

// Error types
export class TranscriptionError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public apiMessage?: string
  ) {
    super(message);
    this.name = 'TranscriptionError';
  }
}

export class NetworkError extends Error {
  constructor(message: string, public originalError: unknown) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class FileFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileFormatError';
  }
}

// Utility functions
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const validateAudioFile = (file: File | Blob): void => {
  const maxSize = 50 * 1024 * 1024; // 50MB limit
  
  if (file.size > maxSize) {
    throw new FileFormatError('Audio file too large. Maximum size is 50MB.');
  }
  
  if (file.size === 0) {
    throw new FileFormatError('Audio file is empty.');
  }
  
  // Check file type if it's a File object
  if (file instanceof File) {
    const supportedTypes = [
      'audio/wav', 'audio/wave', 'audio/x-wav',
      'audio/mp3', 'audio/mpeg',
      'audio/mp4', 'audio/x-m4a',
      'audio/ogg', 'audio/webm'
    ];
    
    if (!supportedTypes.includes(file.type)) {
      throw new FileFormatError(
        `Unsupported audio format: ${file.type}. Supported formats: WAV, MP3, M4A, OGG, WebM.`
      );
    }
  }
};

const createFormData = (request: TranscriptionRequest): FormData => {
  const formData = new FormData();
  
  // Generate metadata if not provided
  const metadata: TranscriptionRequestMetadata = request.metadata || {
    user_id: generateUUID(),
    session_id: generateUUID()
  };
  
  // Determine file name and type
  let fileName = 'recording.wav';
  if (request.audio instanceof File) {
    fileName = request.audio.name;
  }
  
  // Append audio file
  formData.append('file', request.audio, fileName);
  
  // Append metadata
  formData.append('user_id', metadata.user_id);
  formData.append('session_id', metadata.session_id);
  
  return formData;
};

// Main transcription service
class TranscriptionService {
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly maxRetries: number = 3;
  private readonly retryDelay: number = 1000; // 1 second

  constructor() {
    this.apiUrl = import.meta.env.VITE_TRANSCRIPTION_API_URL;
    this.apiKey = import.meta.env.VITE_TRANSCRIPTION_API_KEY;
    
    if (!this.apiUrl || !this.apiKey) {
      throw new Error('Missing API configuration. Please check your environment variables.');
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequest(formData: FormData, attempt: number = 1): Promise<AxiosResponse<TranscriptionApiResponse>> {
    try {
      const response = await axios.post<TranscriptionApiResponse>(
        this.apiUrl,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'multipart/form-data',
          },
          timeout: 120000, // 2 minutes timeout
        }
      );

      return response;
    } catch (error: unknown) {
      // Handle different types of errors
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new NetworkError('Request timeout. The server took too long to respond.', error);
        }
        
        if (!error.response) {
          throw new NetworkError('Network error. Please check your internet connection.', error);
        }
        
        const statusCode = error.response.status;
        const apiMessage = error.response.data?.message || error.response.statusText;
        
        // Retry on server errors (5xx) and some client errors
        if ((statusCode >= 500 || statusCode === 429) && attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt);
          return this.makeRequest(formData, attempt + 1);
        }
        
        // Handle specific error codes
        switch (statusCode) {
          case 400:
            throw new TranscriptionError('Invalid request. Please check your audio file.', statusCode, apiMessage);
          case 401:
            throw new TranscriptionError('Authentication failed. Invalid API key.', statusCode, apiMessage);
          case 403:
            throw new TranscriptionError('Access forbidden. You do not have permission to use this API.', statusCode, apiMessage);
          case 413:
            throw new FileFormatError('Audio file too large for the server.');
          case 415:
            throw new FileFormatError('Unsupported audio format.');
          case 429:
            throw new TranscriptionError('Rate limit exceeded. Please try again later.', statusCode, apiMessage);
          case 500:
            throw new TranscriptionError('Server error. Please try again later.', statusCode, apiMessage);
          default:
            throw new TranscriptionError(`API error: ${apiMessage}`, statusCode, apiMessage);
        }
      }
      
      // Re-throw if it's already our custom error
      if (error instanceof TranscriptionError || error instanceof NetworkError || error instanceof FileFormatError) {
        throw error;
      }
      
      // Generic error fallback
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new TranscriptionError('An unexpected error occurred during transcription.', undefined, errorMessage);
    }
  }

  /**
   * Process audio file or blob for transcription
   */
  async processAudio(request: TranscriptionRequest): Promise<TranscriptionApiResponse> {
    try {
      // Validate the audio file
      validateAudioFile(request.audio);
      
      // Create form data
      const formData = createFormData(request);
      
      // Make the API request
      const response = await this.makeRequest(formData);
      
      // Validate response data
      const data = response.data;
      if (!data.transcript || !data.translation) {
        throw new TranscriptionError('Invalid API response: missing transcript or translation.');
      }
      
      return data;
    } catch (error) {
      // Re-throw our custom errors
      if (error instanceof TranscriptionError || error instanceof NetworkError || error instanceof FileFormatError) {
        throw error;
      }
      
      // Handle any other unexpected errors
      console.error('Unexpected error in processAudio:', error);
      throw new TranscriptionError('An unexpected error occurred while processing your audio.');
    }
  }

  /**
   * Process uploaded file
   */
  async processFile(file: File, metadata?: TranscriptionRequestMetadata): Promise<TranscriptionApiResponse> {
    return this.processAudio({ audio: file, metadata });
  }

  /**
   * Process recorded audio blob
   */
  async processRecording(blob: Blob, metadata?: TranscriptionRequestMetadata): Promise<TranscriptionApiResponse> {
    return this.processAudio({ audio: blob, metadata });
  }

  /**
   * Check if API is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Create a minimal test request to check API availability
      // You might want to implement a proper health check endpoint
      return true;
    } catch (error) {
      console.warn('API health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const transcriptionService = new TranscriptionService();

// Export utility functions for external use
export { generateUUID, validateAudioFile };