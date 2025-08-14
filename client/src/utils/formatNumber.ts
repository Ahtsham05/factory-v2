/**
 * Format numbers for display with proper localization
 * @param num - The number to format
 * @param isUrdu - Whether to use Urdu/Pakistani formatting
 * @returns Formatted number string
 */
export const formatNumber = (num: number, isUrdu: boolean = false): string => {
  if (isUrdu) {
    // Format numbers for Urdu (using Pakistani locale)
    // For RTL languages, we want the minus sign on the left side
    const formatted = num.toLocaleString('ur-PK');
    
    // Handle negative numbers - ensure minus sign is on the left
    if (num < 0) {
      const absFormatted = Math.abs(num).toLocaleString('ur-PK');
      return `${absFormatted}-`;
    }
    
    return formatted;
  }
  return num.toLocaleString('en-US');
};

/**
 * Format currency with proper localization
 * @param amount - The amount to format
 * @param isUrdu - Whether to use Urdu/Pakistani formatting
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, isUrdu: boolean = false): string => {
  if (isUrdu) {
    const formatted = formatNumber(amount, isUrdu);
    return `${formatted} روپے`;
  }
  return `$${formatNumber(amount, false)}`;
};
