export interface Clipboard {
  id: string;
  code: string;
  content: string;
  hasPassword: boolean;
  password?: string;
  expiresAt: Date | null;
  burnAfterReading: boolean;
  createdAt: Date;
  viewCount: number;
}

export interface CreateClipboardRequest {
  content: string;
  password?: string;
  expiryMinutes?: number;
  burnAfterReading?: boolean;
}

export interface GetClipboardRequest {
  code: string;
  password?: string;
}