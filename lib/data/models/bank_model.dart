class Bank {
  final int id;
  final String name;
  final String logo;
  final List<BankAccount>? bankAccounts;

  Bank({
    required this.id,
    required this.name,
    required this.logo,
    this.bankAccounts,
  });

  factory Bank.fromJson(Map<String, dynamic> json) {
    return Bank(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      logo: json['logo'] ?? '',
      bankAccounts: json['bankAccounts'] != null
          ? (json['bankAccounts'] as List)
                .map((account) => BankAccount.fromJson(account))
                .toList()
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'logo': logo,
      'bankAccounts': bankAccounts?.map((account) => account.toJson()).toList(),
    };
  }
}

class BankAccount {
  final int id;
  final String name;
  final String accountNumber;
  final int bankId;
  final Bank? bank;

  BankAccount({
    required this.id,
    required this.name,
    required this.accountNumber,
    required this.bankId,
    this.bank,
  });

  factory BankAccount.fromJson(Map<String, dynamic> json) {
    return BankAccount(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      accountNumber: json['accountNumber'] ?? '',
      bankId: json['bankId'] ?? 0,
      bank: json['bank'] != null ? Bank.fromJson(json['bank']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'accountNumber': accountNumber,
      'bankId': bankId,
      'bank': bank?.toJson(),
    };
  }
}
