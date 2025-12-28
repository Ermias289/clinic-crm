import apiClient from './client';

const API_BASE_URL = 'https://crmgate.nexabusinessgroup.com';

export const fileUploadService = {
  /**
   * Upload a file and get back the filename
   * Use this filename to save to entities (e.g., company logo, patient photo)
   */
  upload: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<string>('/api/FileUpload/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Upload multiple files
   */
  uploadMultiple: async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await apiClient.post<string[]>('/api/FileUpload/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get the direct URL for a file by filename
   * Use this to display images in the UI
   */
  getFileUrl: (fileName: string): string => {
    if (!fileName) return '';
    return `${API_BASE_URL}/api/FileUpload/${fileName}`;
  },

  /**
   * Get file as blob (for downloading or viewing)
   */
  getFile: async (fileName: string): Promise<Blob> => {
    const response = await apiClient.get(`/api/FileUpload/${fileName}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Download a file
   */
  downloadFile: async (fileName: string): Promise<Blob> => {
    const response = await apiClient.get(`/api/FileUpload/download/${fileName}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Helper: Upload a file and return the URL
   */
  uploadAndGetUrl: async (file: File): Promise<{ fileName: string; url: string }> => {
    const fileName = await fileUploadService.upload(file);
    return {
      fileName,
      url: fileUploadService.getFileUrl(fileName),
    };
  },
};
