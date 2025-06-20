import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function hslToHex(h: number, s: number, l: number): string {
  // Convert h, s, l to the range [0,1]
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  let m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
}

export function getRandomPastelColor(seed?: number) {
  const hue =
    seed !== undefined
      ? (seed * 137.508) % 360
      : Math.floor(Math.random() * 360);
  // 70% saturation, 80% lightness for pastel
  return hslToHex(hue, 70, 80);
}

export function getRandomPastelGradient(seed?: number) {
  const baseHue =
    seed !== undefined
      ? (seed * 137.508) % 360
      : Math.floor(Math.random() * 360);
  const hue2 = (baseHue + 20) % 360; // 20 degrees apart for subtle variation
  const color1 = `hsl(${baseHue}, 70%, 70%)`; // deeper pastel
  const color2 = `hsl(${hue2}, 70%, 60%)`; // even deeper for gradient
  return `linear-gradient(135deg, ${color1}, ${color2})`;
}

export function formatCurrency(
  amount: number = 0,
  showSymbol: boolean = true,
  currency: string = "NGN",
  locale: string = "en-NG"
): string {
  const options: Intl.NumberFormatOptions = {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    currencyDisplay: showSymbol ? "symbol" : "code",
  };
  let formatted = amount.toLocaleString(locale, options);
  if (!showSymbol) {
    // Remove currency code (e.g. "NGN") and any space after minus sign
    formatted = formatted.replace(/^(-)?\s?[A-Z]{3}\s?/, "$1");
  }
  return formatted;
}
