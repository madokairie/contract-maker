'use client';

export async function generatePdf(element: HTMLElement, filename: string) {
  const html2pdf = (await import('html2pdf.js')).default;
  const opt = {
    margin: [10, 15, 10, 15] as [number, number, number, number],
    filename: `${filename}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
    pagebreak: { mode: ['avoid-all' as const, 'css' as const, 'legacy' as const] },
  };
  await html2pdf().set(opt).from(element).save();
}
