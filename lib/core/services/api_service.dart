import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiService {
  // Base URL for your API - change this to match your backend URL
  static const String baseUrl = 'http://localhost:5000/api';

  // Headers for all requests
  static const Map<String, String> headers = {
    'Content-Type': 'application/json',
  };

  // Auth endpoints
  static const String loginEndpoint = '$baseUrl/auth/login';
  static const String registerEndpoint = '$baseUrl/auth/register';
  static const String forgotPasswordEndpoint = '$baseUrl/auth/forgotPassword';
  static const String resetPasswordEndpoint = '$baseUrl/auth/resetPassword';
  static const String changePasswordEndpoint = '$baseUrl/auth/changePassword';

  // Generic HTTP POST method
  static Future<http.Response> post(String endpoint, Map<String, dynamic> data) async {
    try {
      final response = await http.post(
        Uri.parse(endpoint),
        headers: headers,
        body: jsonEncode(data),
      );
      return response;
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // Generic HTTP GET method
  static Future<http.Response> get(String endpoint, {Map<String, String>? headers}) async {
    try {
      final response = await http.get(
        Uri.parse(endpoint),
        headers: headers ?? ApiService.headers,
      );
      return response;
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // Auth specific methods
  static Future<http.Response> login(String phoneOrEmail, String password) async {
    return post(loginEndpoint, {
      'phoneOrEmail': phoneOrEmail,
      'password': password,
    });
  }

  static Future<http.Response> register(Map<String, dynamic> userData) async {
    return post(registerEndpoint, userData);
  }

  static Future<http.Response> forgotPassword(String email) async {
    return post(forgotPasswordEndpoint, {
      'email': email.toLowerCase().trim(),
    });
  }

  static Future<http.Response> resetPassword(String email, String newPassword, String otp) async {
    return post(resetPasswordEndpoint, {
      'email': email.toLowerCase().trim(),
      'newPassword': newPassword,
      'otp': otp,
    });
  }

  static Future<http.Response> changePassword(Map<String, dynamic> passwordData) async {
    return post(changePasswordEndpoint, passwordData);
  }
}
