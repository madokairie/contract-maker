'use client';

import { useEffect, useState, useRef, use } from 'react';
import Link from 'next/link';
import { ContractData, ContractType, CONTRACT_TYPE_LABELS } from '@/lib/types';
import { getContract, saveContract } from '@/lib/storage';
import { generatePdf } from '@/lib/pdf';
import { todayStr, addMonths } from '@/lib/date-utils';
import ContractPreview from '@/components/ContractPreview';

export default function ContractEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<ContractData | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loaded = getContract(id);
    if (loaded) setData(loaded);
  }, [id]);

  const updateField = <K extends keyof ContractData>(key: K, value: ContractData[K]) => {
    setData((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [key]: value };

      // Auto-calculate end date for consultant contracts
      if (key === 'startDate' || key === 'type') {
        const type = key === 'type' ? (value as ContractType) : updated.type;
        const start = key === 'startDate' ? (value as string) : updated.startDate;
        if (type === 'consultant-3') {
          updated.endDate = addMonths(start, 3);
        } else if (type === 'consultant-6') {
          updated.endDate = addMonths(start, 6);
        }
      }

      saveContract(updated);
      return updated;
    });
  };

  const handleExportPdf = async () => {
    if (!pdfRef.current || !data) return;
    setIsExporting(true);
    try {
      const filename = `${data.clientName || '契約書'}_${CONTRACT_TYPE_LABELS[data.type]}`;
      await generatePdf(pdfRef.current, filename);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('PDF出力に失敗しました');
    } finally {
      setIsExporting(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-gray-500">
          <p className="text-lg mb-4">契約書が見つかりません</p>
          <Link href="/" className="text-[#1a2744] hover:underline font-medium">
            ホームに戻る
          </Link>
        </div>
      </div>
    );
  }

  const needsDateRange = data.type === 'consultant-3' || data.type === 'consultant-6' || data.type === 'general-outsource';

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      <header className="bg-[#1a2744] text-white px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-300 hover:text-white text-sm">
            &larr; 戻る
          </Link>
          <span className="text-lg font-bold">{data.clientName || '（名前未入力）'}</span>
          <span className="text-sm text-gray-400">{CONTRACT_TYPE_LABELS[data.type]}</span>
        </div>
        <button
          onClick={handleExportPdf}
          disabled={isExporting}
          className="bg-white text-[#1a2744] px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
        >
          {isExporting ? '出力中...' : 'PDF出力'}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor Sidebar */}
        <aside className="w-96 bg-white border-r border-gray-200 overflow-y-auto p-6 shrink-0">
          <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4">
            契約情報を入力
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">契約書の種類</label>
              <select
                value={data.type}
                onChange={(e) => updateField('type', e.target.value as ContractType)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]"
              >
                {(Object.entries(CONTRACT_TYPE_LABELS) as [ContractType, string][]).map(([type, label]) => (
                  <option key={type} value={type}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">契約相手の名前</label>
              <input
                type="text"
                value={data.clientName}
                onChange={(e) => updateField('clientName', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]"
                placeholder="山田 太郎 / 株式会社ABC"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isCompany"
                checked={data.clientIsCompany}
                onChange={(e) => updateField('clientIsCompany', e.target.checked)}
                className="rounded"
              />
              <label htmlFor="isCompany" className="text-sm text-gray-700">法人（会社）</label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">金額（税込）</label>
              <input
                type="text"
                value={data.amount}
                onChange={(e) => updateField('amount', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]"
                placeholder="990,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">契約締結日</label>
              <input
                type="date"
                value={data.contractDate}
                onChange={(e) => updateField('contractDate', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]"
              />
            </div>

            {needsDateRange && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">契約開始日</label>
                  <input
                    type="date"
                    value={data.startDate}
                    onChange={(e) => updateField('startDate', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">契約終了日</label>
                  <input
                    type="date"
                    value={data.endDate}
                    onChange={(e) => updateField('endDate', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]"
                  />
                  {(data.type === 'consultant-3' || data.type === 'consultant-6') && (
                    <p className="text-xs text-gray-400 mt-1">開始日から自動計算済み（手動変更可）</p>
                  )}
                </div>
              </>
            )}
          </div>
        </aside>

        {/* Preview */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-100">
          <div className="bg-white shadow-lg mx-auto" style={{ width: '210mm', minHeight: '297mm' }}>
            <ContractPreview data={data} />
          </div>
        </main>
      </div>

      {/* Hidden PDF render */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0, width: '210mm' }}>
        <ContractPreview ref={pdfRef} data={data} />
      </div>
    </div>
  );
}
