import 'package:flutter_dotenv/flutter_dotenv.dart';

class ImageUtils {
  static String buildImageUrl(String filename) {
    if (filename.isEmpty || filename == 'non') return '';

    // If it's already a full URL, return as is
    if (filename.startsWith('http')) return filename;

    // Get base URL from environment
    final baseUrl = dotenv.env['API_BASE_URL']!;

    // Construct the full URL for file download
    return '$baseUrl/api/FileUpload/$filename';
  }
}
