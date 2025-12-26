import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

class AuthInterceptor {
  static void attach(GetHttpClient client) {
    final box = GetStorage();

    client.addRequestModifier<dynamic>((request) {
      final token = box.read('token');
      if (token != null) {
        request.headers['Authorization'] = 'Bearer $token';
        print('🔑 Auth token added to request: ${request.url}');
      } else {
        print('⚠️ No auth token found for request: ${request.url}');
      }
      return request;
    });

    client.addResponseModifier((request, response) {
      if (response.statusCode == 401) {
        box.remove('token');
        Get.offAllNamed('/login');
      }
      return response;
    });
  }
}
