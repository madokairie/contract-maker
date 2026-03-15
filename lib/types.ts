export type ContractType =
  | 'consultant-3'
  | 'consultant-6'
  | 'launch-outsource'
  | 'launch-receive'
  | 'general-outsource'
  | 'jyb-base'
  | 'jyb-individual';

export type CompanyEntity = 'mcreate' | 'jyb';

export const COMPANY_LABELS: Record<CompanyEntity, string> = {
  mcreate: '株式会社エムクリエイト',
  jyb: '一般社団法人 日本陰陽五行トーンビューティー協会',
};

export const COMPANY_ADDRESS: Record<CompanyEntity, string> = {
  mcreate: '千葉県松戸市西馬橋2-40-41',
  jyb: '千葉県松戸市西馬橋2-40-41',
};

export const COMPANY_REPRESENTATIVE: Record<CompanyEntity, { title: string; name: string }> = {
  mcreate: { title: '代表取締役', name: '入江円香' },
  jyb: { title: '代表理事', name: '入江円香' },
};

export interface ContractData {
  id: string;
  type: ContractType;
  company: CompanyEntity;
  clientName: string;
  clientIsCompany: boolean;
  paymentPlan: string;
  amount: string;
  contractDate: string;
  startDate: string;
  endDate: string;
  // ローンチ受託用
  launchFee: string;
  // 業務委託一般用
  hourlyRate: string;
  // JYB個別用
  jybRole: 'supporter' | 'counselor';
  createdAt: string;
  updatedAt: string;
}

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  'consultant-3': '顧問サービス契約書（3ヶ月）',
  'consultant-6': '顧問サービス契約書（6ヶ月）',
  'launch-outsource': 'ローンチ構築業務委託（外注）',
  'launch-receive': 'ローンチ構築業務委託（受託）',
  'general-outsource': '業務委託契約書（一般）',
  'jyb-base': 'JYB業務委託基本契約書',
  'jyb-individual': 'JYB業務委託個別契約書',
};

export interface PaymentOption {
  label: string;
  amount: string;
}

export const CONSULTANT_3_PLANS: PaymentOption[] = [
  { label: '一括払い（銀行振込）', amount: '990,000' },
  { label: '一括払い（クレジットカード）', amount: '990,000' },
  { label: 'カスタム金額', amount: '' },
];

export const CONSULTANT_6_PLANS: PaymentOption[] = [
  { label: '一括払い（銀行振込）', amount: '2,039,400' },
  { label: '一括払い（クレジットカード）', amount: '2,039,400' },
  { label: 'カスタム金額', amount: '' },
];
