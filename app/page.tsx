'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ContractData, ContractType, CONTRACT_TYPE_LABELS } from '@/lib/types';
import { getContracts, saveContract, deleteContract } from '@/lib/storage';
import { todayStr, addMonths } from '@/lib/date-utils';

export default function Home() {
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [formType, setFormType] = useState<ContractType>('consultant-3');
  const [formName, setFormName] = useState('');
  const [formIsCompany, setFormIsCompany] = useState(false);
  const [formAmount, setFormAmount] = useState('');
  const [formStartDate, setFormStartDate] = useState(todayStr());
  const [formContractDate, setFormContractDate] = useState(todayStr());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage initial load
    setContracts(getContracts());
  }, []);

  const handleCreate = () => {
    const months = formType === 'consultant-3' ? 3 : formType === 'consultant-6' ? 6 : 0;
    const endDate = months > 0 ? addMonths(formStartDate, months) : '';
    const now = new Date().toISOString();

    const contract: ContractData = {
      id: crypto.randomUUID(),
      type: formType,
      clientName: formName,
      clientIsCompany: formIsCompany,
      amount: formAmount,
      contractDate: formContractDate,
      startDate: formStartDate,
      endDate,
      createdAt: now,
      updatedAt: now,
    };

    saveContract(contract);
    setContracts(getContracts());
    setShowDialog(false);
    resetForm();
  };

  const resetForm = () => {
    setFormType('consultant-3');
    setFormName('');
    setFormIsCompany(false);
    setFormAmount('');
    setFormStartDate(todayStr());
    setFormContractDate(todayStr());
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`「${name}」の契約書を削除しますか？`)) {
      deleteContract(id);
      setContracts(getContracts());
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const needsDateRange = formType === 'consultant-3' || formType === 'consultant-6' || formType === 'general-outsource';

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <header className="bg-[#1a2744] text-white">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold">契約書メーカー</h1>
          <p className="text-sm text-gray-300 mt-1">
            契約書テンプレートに情報を入力してPDF出力
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <button
            onClick={() => setShowDialog(true)}
            className="bg-[#1a2744] text-white px-6 py-3 rounded-lg hover:bg-[#2a3a5c] transition-colors font-medium text-sm"
          >
            + 新しい契約書を作成
          </button>
        </div>

        {contracts.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="text-gray-400 text-4xl mb-4">📄</div>
            <p className="text-gray-500 text-lg mb-2">
              まだ契約書がありません
            </p>
            <p className="text-gray-400 text-sm">
              「新しい契約書を作成」ボタンから始めましょう
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {contracts
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:border-[#1a2744] transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <Link href={`/contract/${c.id}`} className="flex-1 min-w-0">
                      <h2 className="text-lg font-bold text-[#1a2744] group-hover:underline truncate">
                        {c.clientName || '（名前未入力）'}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {CONTRACT_TYPE_LABELS[c.type]}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        作成日: {formatDate(c.createdAt)}
                      </p>
                    </Link>
                    <div className="flex items-center gap-3 ml-4">
                      <Link
                        href={`/contract/${c.id}`}
                        className="px-4 py-2 text-sm text-[#1a2744] border border-[#1a2744] rounded-md hover:bg-[#1a2744] hover:text-white transition-colors"
                      >
                        編集・PDF
                      </Link>
                      <button
                        onClick={() => handleDelete(c.id, c.clientName)}
                        className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>

      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#1a2744] mb-6">
              新しい契約書を作成
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">契約書の種類</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(CONTRACT_TYPE_LABELS) as [ContractType, string][]).map(([type, label]) => (
                    <button
                      key={type}
                      onClick={() => setFormType(type)}
                      className={`border rounded-lg p-3 text-left text-sm transition-colors ${
                        formType === type
                          ? 'border-[#1a2744] bg-[#1a2744]/5 text-[#1a2744] font-medium'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  契約相手の名前
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]"
                  placeholder="例: 山田 太郎 / 株式会社ABC"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isCompany"
                  checked={formIsCompany}
                  onChange={(e) => setFormIsCompany(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="isCompany" className="text-sm text-gray-700">法人（会社）</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  金額（税込）
                </label>
                <input
                  type="text"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]"
                  placeholder="例: 990,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  契約締結日
                </label>
                <input
                  type="date"
                  value={formContractDate}
                  onChange={(e) => setFormContractDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]"
                />
              </div>

              {needsDateRange && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    契約開始日
                  </label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]"
                  />
                  {(formType === 'consultant-3' || formType === 'consultant-6') && (
                    <p className="text-xs text-gray-400 mt-1">
                      終了日は開始日から{formType === 'consultant-3' ? '3' : '6'}ヶ月後に自動計算されます
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => { setShowDialog(false); resetForm(); }}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleCreate}
                className="px-6 py-2 text-sm text-white bg-[#1a2744] rounded-md hover:bg-[#2a3a5c]"
              >
                作成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
