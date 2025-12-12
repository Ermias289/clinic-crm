import 'package:flutter/services.dart';

class DateInputFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
      TextEditingValue oldValue, TextEditingValue newValue) {
    
    // 1. Remove any non-digits from the input
    final text = newValue.text.replaceAll(RegExp(r'[^0-9]'), '');

    // Validation Logic
    // Validate Month
    if (text.length >= 5) {
      // 1st digit of month can only be 0 or 1
      int firstDigit = int.parse(text[4]);
      if (firstDigit > 1) return oldValue;
    }
    if (text.length >= 6) {
      int month = int.parse(text.substring(4, 6));
      if (month == 0 || month > 12) return oldValue;
    }

    // Validate Day
    if (text.length >= 7) {
      // 1st digit of day can only be 0, 1, 2, 3
      int firstDigit = int.parse(text[6]);
      if (firstDigit > 3) return oldValue;
    }
    if (text.length >= 8) {
      int day = int.parse(text.substring(6, 8));
      if (day == 0 || day > 31) return oldValue;
    }
    
    // 2. Re-format with hyphens
    final buffer = StringBuffer();
    for (int i = 0; i < text.length; i++) {
      buffer.write(text[i]);
      var index = i + 1;
      // Add hyphen after year (4 digits) and month (6 digits total)
      // Only if there are more digits coming
      if ((index == 4 || index == 6) && text.length != index) {
        buffer.write('-');
      }
    }
    
    final formatted = buffer.toString();
    
    // 3. Return updated value
    // We intentionally put selection at the end to simplify cursor logic during formatting,
    // which is acceptable for this use-case (Date of Birth usually typed linearly).
    return TextEditingValue(
      text: formatted,
      selection: TextSelection.collapsed(offset: formatted.length),
    );
  }
}
