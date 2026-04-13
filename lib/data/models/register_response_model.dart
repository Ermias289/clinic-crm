class RegisterResponseModel {
  final bool success;
  final String message;

  RegisterResponseModel({required this.success, required this.message});

  factory RegisterResponseModel.fromJson(Map<String, dynamic> json) {
    // If the response contains an ID or username, it's a successful user object
    bool isSuccess = json.containsKey('id') || json.containsKey('username') || (json['success'] == true);
    
    return RegisterResponseModel(
      success: isSuccess,
      message: json['message'] ?? (isSuccess ? 'Registration Successful' : 'Unknown Error'),
    );
  }
}
