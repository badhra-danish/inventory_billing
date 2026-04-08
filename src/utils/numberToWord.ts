export function numberToWordsIndian(num: number): string {
  if (num === 0) return "Zero";

  const belowTwenty = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function helper(n: number): string {
    if (n === 0) return "";
    if (n < 20) return belowTwenty[n] + " ";
    if (n < 100) return tens[Math.floor(n / 10)] + " " + helper(n % 10);
    return belowTwenty[Math.floor(n / 100)] + " Hundred " + helper(n % 100);
  }

  let result = "";

  const crore = Math.floor(num / 10000000);
  num %= 10000000;

  const lakh = Math.floor(num / 100000);
  num %= 100000;

  const thousand = Math.floor(num / 1000);
  num %= 1000;

  const hundred = num;

  if (crore) result += helper(crore) + "Crore ";
  if (lakh) result += helper(lakh) + "Lakh ";
  if (thousand) result += helper(thousand) + "Thousand ";
  if (hundred) result += helper(hundred);

  return result.trim();
}
