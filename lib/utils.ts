import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import Papa from 'papaparse';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToPureGold(weight: number, karat: number): number {
  return (weight * karat) / (24 * 0.995);
}

export function parseDate(dateString: string): Date {
  const [day, month, year] = dateString.split('/').map(Number);
  const fullYear = year < 100 ? 2000 + year : year;
  return new Date(Date.UTC(fullYear, month - 1, day));
}

export async function processLossData(file: File) {
  const text = await file.text()
  const { data } = Papa.parse(text, { header: true, skipEmptyLines: true })
  return data.map((row: any) => ({
    date: parseDate(row.DATE),
    item_no: row['ITEM NO.'],
    kt: parseInt(row.KT),
    karigar: row.KAR,
    process: row.PROCESS,
    loss: parseFloat(row.LOSS),
    pure_gold_loss: convertToPureGold(parseFloat(row.LOSS), parseInt(row.KT)),
  }))
}

export async function processWeightData(file: File) {
  const text = await file.text()
  const { data } = Papa.parse(text, { header: true, skipEmptyLines: true })
  return data.map((row: any) => ({
    date: parseDate(row.DATE),
    item_no: row['ITEM NO.'],
    kt: parseInt(row.KT),
    gross_wt: parseFloat(row['GROSS WT']),
    net_wt: parseFloat(row['NET WT.']),
    pure_gold_weight: (parseFloat(row['NET WT.']) * parseInt(row.KT)) / (24 * 0.995),
  }))
}
