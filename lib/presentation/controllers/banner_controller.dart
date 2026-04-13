import 'package:get/get.dart';
import '../../data/models/banner_model.dart';
import '../../domain/repositories/banner_repository.dart';

class BannerController extends GetxController {
  final BannerRepository bannerRepository;

  BannerController({required this.bannerRepository});

  final RxList<BannerModel> banners = <BannerModel>[].obs;
  final RxBool isLoading = false.obs;

  @override
  void onInit() {
    super.onInit();
    fetchBanners();
  }

  Future<void> fetchBanners() async {
    try {
      isLoading.value = true;
      final fetchedBanners = await bannerRepository.getAllActiveBanners();
      banners.assignAll(fetchedBanners);
    } catch (e) {
      // Don't show error to user, just fail silently for banners
    } finally {
      isLoading.value = false;
    }
  }
}
