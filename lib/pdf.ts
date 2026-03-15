'use client';

export async function generatePdf(element: HTMLElement, filename: string) {
  const html2pdf = (await import('html2pdf.js')).default;
  const opt = {
    margin: [10, 15, 10, 15] as [number, number, number, number],
    filename: `${filename}.pdf`,
    image: { type: 'png' as const, quality: 1 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
    pagebreak: { mode: ['css' as const, 'legacy' as const] },
  };
  await html2pdf().set(opt).from(element).save();
}
