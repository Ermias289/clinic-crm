class BannerModel {
  final int id;
  final String image;
  final bool isActive;

  BannerModel({required this.id, required this.image, required this.isActive});

  factory BannerModel.fromJson(Map<String, dynamic> json) {
    return BannerModel(
      id: json['id'] ?? 0,
      image: json['image'] ?? '',
      isActive: json['isActive'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {'id': id, 'image': image, 'isActive': isActive};
  }
}
