import '../../core/api_client.dart';
import '../models/banner_model.dart';

abstract class BannerRemoteDataSource {
  Future<List<BannerModel>> getAllActiveBanners();
}

class BannerRemoteDataSourceImpl implements BannerRemoteDataSource {
  final ApiClient apiClient;

  BannerRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<List<BannerModel>> getAllActiveBanners() async {
    try {
      print('🎯 Fetching active banners from API');
      final response = await apiClient.get('/Banner');

      if (response.statusCode == 200) {
        final List<dynamic> bannersJson = response.body;
        final banners = bannersJson
            .map((json) => BannerModel.fromJson(json))
            .where((banner) => banner.isActive) // Filter only active banners
            .toList();

        print('✅ Successfully fetched ${banners.length} active banners');
        return banners;
      } else {
        print('❌ Failed to fetch banners: ${response.statusCode}');
        throw Exception('Failed to fetch banners: ${response.statusCode}');
      }
    } catch (e) {
      print('💥 Banner fetch exception: $e');
      throw Exception('Failed to fetch banners: $e');
    }
  }
}
