import 'dart:io';

class NetworkHelper {
  static Future<bool> hasInternetConnection() async {
    try {
      final result = await InternetAddress.lookup('google.com');
      return result.isNotEmpty && result[0].rawAddress.isNotEmpty;
    } on SocketException catch (_) {
      return false;
    }
  }

  static Future<bool> canReachAPI() async {
    try {
      final result = await InternetAddress.lookup(
        'crmgate.nexabusinessgroup.com',
      );
      return result.isNotEmpty && result[0].rawAddress.isNotEmpty;
    } on SocketException catch (_) {
      return false;
    }
  }
}
