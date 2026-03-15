export type ContractType = 'consultant-3' | 'consultant-6' | 'launch-outsource' | 'general-outsource';

export interface ContractData {
  id: string;
  type: ContractType;
  clientName: string;
  clientIsCompany: boolean;
  amount: string;
  contractDate: string; // 令和X年X月X日
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  'consultant-3': '顧問サービス契約書（3ヶ月）',
  'consultant-6': '顧問サービス契約書（6ヶ月）',
  'launch-outsource': 'ローンチ構築業務委託契約書',
  'general-outsource': '業務委託契約書',
};
