import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../data/datasources/medical_service_remote_datasource.dart';
import '../../data/repositories/medical_service_repository_impl.dart';
import '../../data/datasources/card_remote_datasource.dart';
import '../../data/repositories/card_repository_impl.dart';
import '../../core/api_client.dart';
import '../controllers/medical_service_controller.dart';
import '../widgets/banner_carousel.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/utils/image_utils.dart';

class ServicesView extends StatefulWidget {
  const ServicesView({super.key});

  @override
  State<ServicesView> createState() => _ServicesViewState();
}

class _ServicesViewState extends State<ServicesView> {
  late final MedicalServiceController controller;
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    if (!Get.isRegistered<MedicalServiceController>()) {
      final apiClient = Get.find<ApiClient>();
      final medicalRemote = MedicalServiceRemoteDataSourceImpl(
        apiClient: apiClient,
      );
      final medicalRepo = MedicalServiceRepositoryImpl(
        remoteDataSource: medicalRemote,
      );
      final cardRemote = CardRemoteDataSourceImpl(apiClient: apiClient);
      final cardRepo = CardRepositoryImpl(remoteDataSource: cardRemote);
      controller = Get.put(MedicalServiceController(medicalRepo, cardRepo));
    } else {
      controller = Get.find<MedicalServiceController>();
      WidgetsBinding.instance.addPostFrameCallback((_) {
        controller.checkAndLoadServices();
      });
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GetBuilder<MedicalServiceController>(
      builder: (_) => _ServicesListView(
        controller: controller,
        searchController: _searchController,
      ),
    );
  }
}

class _ServicesListView extends StatelessWidget {
  final MedicalServiceController controller;
  final TextEditingController searchController;

  const _ServicesListView({
    required this.controller,
    required this.searchController,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      body: Column(
        children: [
          // Header with fixed height to prevent overflow
          _buildHeader(),
          // Content
          Expanded(child: _buildContent()),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [
            AppColors.primaryBlue,
            AppColors.primaryBlueLight,
            AppColors.accentTeal,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(30),
          bottomRight: Radius.circular(30),
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.primaryBlue.withValues(alpha: 0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Title and Icon
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Our Services',
                          style: AppTextStyles.h2.copyWith(
                            color: Colors.white,
                            fontSize: 22,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Choose a medical service',
                          style: AppTextStyles.bodyMedium.copyWith(
                            color: Colors.white.withValues(alpha: 0.9),
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(
                      Icons.medical_services,
                      color: Colors.white,
                      size: 20,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 12),

              // Search Bar
              Container(
                height: 38,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.1),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: TextField(
                  controller: searchController,
                  onChanged: (value) => controller.searchServices(value),
                  decoration: InputDecoration(
                    hintText: 'Search services...',
                    hintStyle: AppTextStyles.bodyMedium.copyWith(
                      color: AppColors.textHint,
                      fontSize: 13,
                    ),
                    prefixIcon: const Icon(
                      Icons.search,
                      color: AppColors.primaryBlue,
                      size: 18,
                    ),
                    suffixIcon: Obx(
                      () => controller.searchQuery.value.isNotEmpty
                          ? IconButton(
                              onPressed: () {
                                searchController.clear();
                                controller.searchServices('');
                              },
                              icon: const Icon(
                                Icons.clear,
                                color: AppColors.textHint,
                                size: 16,
                              ),
                            )
                          : const SizedBox.shrink(),
                    ),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 8,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildContent() {
    return Obx(() {
      if (controller.isLoading.value) {
        return const Center(
          child: CircularProgressIndicator(color: AppColors.primaryBlue),
        );
      }

      final servicesToShow = controller.filteredServices.isNotEmpty
          ? controller.filteredServices
          : controller.services;

      if (servicesToShow.isEmpty) {
        return Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                controller.searchQuery.value.isNotEmpty
                    ? Icons.search_off
                    : Icons.medical_services_outlined,
                size: 60,
                color: AppColors.textHint,
              ),
              const SizedBox(height: 16),
              Text(
                controller.searchQuery.value.isNotEmpty
                    ? 'No services found for "${controller.searchQuery.value}"'
                    : 'No services found',
                style: AppTextStyles.bodyLarge,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              if (controller.searchQuery.value.isEmpty)
                ElevatedButton(
                  onPressed: () => controller.refreshServices(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryBlue,
                    foregroundColor: Colors.white,
                  ),
                  child: const Text('Retry'),
                ),
            ],
          ),
        );
      }

      return RefreshIndicator(
        onRefresh: () => controller.refreshServices(),
        color: AppColors.primaryBlue,
        child: CustomScrollView(
          slivers: [
            // Services List
            SliverPadding(
              padding: const EdgeInsets.all(20),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    // Show banner after 4 services if no search
                    if (index == 4 &&
                        servicesToShow.length > 4 &&
                        controller.searchQuery.value.isEmpty) {
                      return const Padding(
                        padding: EdgeInsets.symmetric(vertical: 16),
                        child: BannerCarousel(),
                      );
                    }

                    // Adjust index for services after banner
                    final serviceIndex = index > 4 ? index - 1 : index;
                    if (serviceIndex >= servicesToShow.length) return null;

                    final service = servicesToShow[serviceIndex];
                    return _buildServiceCard(service);
                  },
                  childCount:
                      servicesToShow.length > 4 &&
                          controller.searchQuery.value.isEmpty
                      ? servicesToShow.length +
                            1 // +1 for banner
                      : servicesToShow.length,
                ),
              ),
            ),
          ],
        ),
      );
    });
  }

  Widget _buildServiceCard(dynamic service) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppColors.cardShadow,
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(16),
        child: InkWell(
          onTap: () => controller.onServiceSelected(service),
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                // Service Image
                Container(
                  width: 70,
                  height: 70,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.1),
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: service.servicePicture.isEmpty
                        ? Container(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  AppColors.primaryBlue.withValues(alpha: 0.1),
                                  AppColors.accentTeal.withValues(alpha: 0.1),
                                ],
                              ),
                            ),
                            child: const Center(
                              child: Icon(
                                Icons.local_hospital_rounded,
                                color: AppColors.primaryBlue,
                                size: 28,
                              ),
                            ),
                          )
                        : Image.network(
                            ImageUtils.buildImageUrl(service.servicePicture),
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) =>
                                Container(
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: [
                                        AppColors.primaryBlue.withValues(
                                          alpha: 0.1,
                                        ),
                                        AppColors.accentTeal.withValues(
                                          alpha: 0.1,
                                        ),
                                      ],
                                    ),
                                  ),
                                  child: const Center(
                                    child: Icon(
                                      Icons.local_hospital_rounded,
                                      color: AppColors.primaryBlue,
                                      size: 28,
                                    ),
                                  ),
                                ),
                          ),
                  ),
                ),

                const SizedBox(width: 16),

                // Service Details
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Service Name
                      Text(
                        service.name,
                        style: AppTextStyles.h3.copyWith(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),

                      const SizedBox(height: 6),

                      // Service Description
                      Text(
                        service.description.isNotEmpty
                            ? service.description
                            : 'Professional medical service with expert care',
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: AppTextStyles.bodyMedium.copyWith(
                          fontSize: 13,
                          color: AppColors.textSecondary,
                        ),
                      ),

                      const SizedBox(height: 8),

                      // Service Info
                      Row(
                        children: [
                          // Duration
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 6,
                              vertical: 3,
                            ),
                            decoration: BoxDecoration(
                              color: AppColors.accentTeal.withValues(
                                alpha: 0.1,
                              ),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(
                                  Icons.access_time_rounded,
                                  size: 12,
                                  color: AppColors.accentTeal,
                                ),
                                const SizedBox(width: 3),
                                Text(
                                  '${service.durationInMinutes} mins',
                                  style: AppTextStyles.caption.copyWith(
                                    color: AppColors.accentTeal,
                                    fontWeight: FontWeight.w600,
                                    fontSize: 11,
                                  ),
                                ),
                              ],
                            ),
                          ),

                          const SizedBox(width: 8),

                          // Available
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 6,
                              vertical: 3,
                            ),
                            decoration: BoxDecoration(
                              color: AppColors.successGreen.withValues(
                                alpha: 0.1,
                              ),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  width: 5,
                                  height: 5,
                                  decoration: const BoxDecoration(
                                    color: AppColors.successGreen,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 3),
                                Text(
                                  'Available',
                                  style: AppTextStyles.caption.copyWith(
                                    color: AppColors.successGreen,
                                    fontWeight: FontWeight.w600,
                                    fontSize: 11,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Arrow
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: AppColors.primaryBlue.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Icon(
                    Icons.arrow_forward_ios,
                    color: AppColors.primaryBlue,
                    size: 14,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// Compatibility class
class ServicesListView extends GetView<MedicalServiceController> {
  const ServicesListView({super.key});

  @override
  Widget build(BuildContext context) {
    return const ServicesView();
  }
}
