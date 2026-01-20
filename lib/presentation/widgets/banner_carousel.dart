import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../core/theme/app_colors.dart';
import '../../core/utils/image_utils.dart';
import '../controllers/banner_controller.dart';
import '../../data/datasources/banner_remote_datasource.dart';
import '../../data/repositories/banner_repository_impl.dart';
import '../../core/api_client.dart';

class BannerCarousel extends StatelessWidget {
  const BannerCarousel({super.key});

  BannerController _getBannerController() {
    if (!Get.isRegistered<BannerController>()) {
      final apiClient = Get.find<ApiClient>();
      final bannerRemote = BannerRemoteDataSourceImpl(apiClient: apiClient);
      final bannerRepo = BannerRepositoryImpl(remoteDataSource: bannerRemote);
      return Get.put(BannerController(bannerRepository: bannerRepo));
    }
    return Get.find<BannerController>();
  }

  @override
  Widget build(BuildContext context) {
    try {
      final controller = _getBannerController();

      return Obx(() {
        // Show loading indicator while fetching
        if (controller.isLoading.value) {
          return const SizedBox.shrink();
        }

        // Don't show anything if no banners
        if (controller.banners.isEmpty) {
          return const SizedBox.shrink();
        }

        // Show banners
        return Container(
          height: 120,
          margin: const EdgeInsets.symmetric(vertical: 16),
          child: PageView.builder(
            controller: PageController(viewportFraction: 0.85),
            itemCount: controller.banners.length,
            itemBuilder: (context, index) {
              final banner = controller.banners[index];
              return Container(
                margin: const EdgeInsets.symmetric(horizontal: 8),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.1),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: banner.image.isEmpty
                      ? Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                AppColors.primaryBlue.withValues(alpha: 0.8),
                                AppColors.accentGreen.withValues(alpha: 0.8),
                              ],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                          ),
                          child: const Center(
                            child: Icon(
                              Icons.image,
                              color: Colors.white,
                              size: 48,
                            ),
                          ),
                        )
                      : Image.network(
                          ImageUtils.buildImageUrl(banner.image),
                          width: double.infinity,
                          fit: BoxFit.cover,
                          loadingBuilder: (context, child, loadingProgress) {
                            if (loadingProgress == null) return child;
                            return Container(
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [
                                    AppColors.primaryBlue.withValues(
                                      alpha: 0.3,
                                    ),
                                    AppColors.accentGreen.withValues(alpha: 0.3),
                                  ],
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                ),
                              ),
                              child: const Center(
                                child: CircularProgressIndicator(
                                  color: AppColors.primaryBlue,
                                ),
                              ),
                            );
                          },
                          errorBuilder: (context, error, stackTrace) {
                            return Container(
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [
                                    AppColors.primaryBlue.withValues(
                                      alpha: 0.8,
                                    ),
                                    AppColors.accentGreen.withValues(alpha: 0.8),
                                  ],
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                ),
                              ),
                              child: const Center(
                                child: Icon(
                                  Icons.image_not_supported,
                                  color: Colors.white,
                                  size: 48,
                                ),
                              ),
                            );
                          },
                        ),
                ),
              );
            },
          ),
        );
      });
    } catch (e) {
      // If anything fails, don't show anything
      return const SizedBox.shrink();
    }
  }
}
