import '../../data/models/branch_setting_model.dart';

abstract class BranchSettingRepository {
  Future<List<BranchSettingModel>> getBranchSettings();
}
