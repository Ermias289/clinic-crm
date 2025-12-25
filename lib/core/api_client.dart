import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:get/get.dart';
import 'auth_interceptor.dart';

class ApiClient extends GetConnect {
  @override
  String get baseUrl =>
      (dotenv.env['API_BASE_URL'] ?? 'http://localhost:5000') + '/api';

  @override
  void onInit() {
    httpClient.baseUrl = baseUrl;
    httpClient.timeout = const Duration(seconds: 30);

    // Debug logging
    print('🌐 API Client initialized with baseUrl: $baseUrl');

    AuthInterceptor.attach(httpClient);
    super.onInit();
  }
}
