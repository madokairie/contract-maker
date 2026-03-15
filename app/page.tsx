'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ContractData,
  ContractType,
  CompanyEntity,
  CONTRACT_TYPE_LABELS,
  COMPANY_LABELS,
  CONSULTANT_3_PLANS,
  CONSULTANT_6_PLANS,
} from '@/lib/types';
import { getContracts, saveContract, deleteContract } from '@/lib/storage';
import { todayStr, addMonths } from '@/lib/date-utils';

export default function Home() {
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [formType, setFormType] = useState<ContractType>('consultant-3');
  const [formCompany, setFormCompany] = useState<CompanyEntity>('mcreate');
  const [formName, setFormName] = useState('');
  const [formIsCompany, setFormIsCompany] = useState(false);
  const [formPaymentPlan, setFormPaymentPlan] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formStartDate, setFormStartDate] = useState(todayStr());
  const [formContractDate, setFormContractDate] = useState(todayStr());
  const [formLaunchFee, setFormLaunchFee] = useState('');
  const [formJybRole, setFormJybRole] = useState<'supporter' | 'counselor'>('counselor');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage initial load
    setContracts(getContracts());
  }, []);

  const isConsultant = formType === 'consultant-3' || formType === 'consultant-6';
  const needsDateRange = isConsultant || formType === 'general-outsource' || formType === 'jyb-base' || formType === 'jyb-individual';
  const needsAmount = isConsultant || formType === 'launch-receive';
  const isJyb = formType === 'jyb-base' || formType === 'jyb-individual';

  const paymentPlans = formType === 'consultant-3' ? CONSULTANT_3_PLANS : CONSULTANT_6_PLANS;
  const isCustomAmount = formPaymentPlan === 'カスタム金額';

  const handlePaymentPlanChange = (planLabel: string) => {
    setFormPaymentPlan(planLabel);
    const plans = formType === 'consultant-3' ? CONSULTANT_3_PLANS : CONSULTANT_6_PLANS;
    const plan = plans.find((p) => p.label === planLabel);
    if (plan && plan.amount) {
      setFormAmount(plan.amount);
    } else {
      setFormAmount('');
    }
  };

  const handleTypeChange = (type: ContractType) => {
    setFormType(type);
    setFormPaymentPlan('');
    setFormAmount('');
    if (type === 'jyb-base' || type === 'jyb-individual') {
      setFormCompany('jyb');
    }
  };

  const handleCreate = () => {
    const months = formType === 'consultant-3' ? 3 : formType === 'consultant-6' ? 6 : 0;
    const endDate = months > 0 ? addMonths(formStartDate, months) : '';
    const now = new Date().toISOString();

    const contract: ContractData = {
      id: crypto.randomUUID(),
      type: formType,
      company: formCompany,
      clientName: formName,
      clientIsCompany: formIsCompany,
      paymentPlan: formPaymentPlan,
      amount: formAmount,
      contractDate: formContractDate,
      startDate: formStartDate,
      endDate,
      launchFee: formLaunchFee,
      jybRole: formJybRole,
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
    setFormCompany('mcreate');
    setFormName('');
    setFormIsCompany(false);
    setFormPaymentPlan('');
    setFormAmount('');
    setFormStartDate(todayStr());
    setFormContractDate(todayStr());
    setFormLaunchFee('');
    setFormJybRole('counselor');
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
            <p className="text-gray-500 text-lg mb-2">まだ契約書がありません</p>
            <p className="text-gray-400 text-sm">「新しい契約書を作成」ボタンから始めましょう</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {contracts
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map((c) => (
                <div key={c.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:border-[#1a2744] transition-colors group">
                  <div className="flex items-center justify-between">
                    <Link href={`/contract/${c.id}`} className="flex-1 min-w-0">
                      <h2 className="text-lg font-bold text-[#1a2744] group-hover:underline truncate">
                        {c.clientName || '（名前未入力）'}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {CONTRACT_TYPE_LABELS[c.type]}
                        <span className="text-gray-400 ml-2">({COMPANY_LABELS[c.company]})</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-2">作成日: {formatDate(c.createdAt)}</p>
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
            <h2 className="text-xl font-bold text-[#1a2744] mb-6">新しい契約書を作成</h2>
            <div className="space-y-4">
              {/* 契約書の種類 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">契約書の種類</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(CONTRACT_TYPE_LABELS) as [ContractType, string][]).map(([type, label]) => (
                    <button
                      key={type}
                      onClick={() => handleTypeChange(type)}
                      className={`border rounded-lg p-2.5 text-left text-xs transition-colors ${
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

              {/* 発行元会社 */}
              {!isJyb && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">発行元</label>
                  <div className="flex gap-2">
                    {(Object.entries(COMPANY_LABELS) as [CompanyEntity, string][]).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setFormCompany(key)}
                        className={`flex-1 border rounded-lg p-2.5 text-xs transition-colors ${
                          formCompany === key
                            ? 'border-[#1a2744] bg-[#1a2744]/5 text-[#1a2744] font-medium'
                            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 契約相手 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">契約相手の名前</label>
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

              {/* 顧問: 支払い方法プルダウン */}
              {isConsultant && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">支払い方法</label>
                  <select
                    value={formPaymentPlan}
                    onChange={(e) => handlePaymentPlanChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]"
                  >
                    <option value="">選択してください</option>
                    {paymentPlans.map((plan) => (
                      <option key={plan.label} value={plan.label}>
                        {plan.label}{plan.amount ? ` — ${plan.amount}円` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* 金額（顧問カスタム or ローンチ受託） */}
              {isConsultant && isCustomAmount && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">金額（税込）</label>
                  <input
                    type="text"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]"
                    placeholder="例: 990,000"
                  />
                </div>
              )}

              {formType === 'launch-receive' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">委託料（税込）</label>
                  <input
                    type="text"
                    value={formLaunchFee}
                    onChange={(e) => setFormLaunchFee(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]"
                    placeholder="例: 2,200,000"
                  />
                </div>
              )}

              {/* JYB個別: 役割選択 */}
              {formType === 'jyb-individual' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">業務種別</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFormJybRole('counselor')}
                      className={`flex-1 border rounded-lg p-2.5 text-sm ${
                        formJybRole === 'counselor' ? 'border-[#1a2744] bg-[#1a2744]/5 font-medium' : 'border-gray-300'
                      }`}
                    >
                      カウンセラー
                    </button>
                    <button
                      onClick={() => setFormJybRole('supporter')}
                      className={`flex-1 border rounded-lg p-2.5 text-sm ${
                        formJybRole === 'supporter' ? 'border-[#1a2744] bg-[#1a2744]/5 font-medium' : 'border-gray-300'
                      }`}
                    >
                      サポーター
                    </button>
                  </div>
                </div>
              )}

              {/* 契約締結日 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">契約締結日</label>
                <input
                  type="date"
                  value={formContractDate}
                  onChange={(e) => setFormContractDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]"
                />
              </div>

              {/* 契約開始日 */}
              {needsDateRange && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">契約開始日</label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]"
                  />
                  {isConsultant && (
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
