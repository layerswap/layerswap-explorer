export const formatAmount = (amount: number | undefined): string => {
    if (amount === undefined || isNaN(amount)) {
      return '-';
    }
  
    if (amount === 0) {
      return '0.00';
    }
  
    const [decimalPart] = amount.toString().split('.');
  
    if (decimalPart && decimalPart.length > 3) {
      const rounded = amount.toFixed(3); 
      return `${Number(rounded).toLocaleString()}...`;
    }
  
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    });
  };