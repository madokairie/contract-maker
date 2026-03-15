import { ContractData } from './types';

const STORAGE_KEY = 'contract-maker-data';

function isBrowser() {
  return typeof window !== 'undefined';
}

export function getContracts(): ContractData[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getContract(id: string): ContractData | null {
  return getContracts().find((c) => c.id === id) || null;
}

export function saveContract(contract: ContractData) {
  const contracts = getContracts();
  const idx = contracts.findIndex((c) => c.id === contract.id);
  contract.updatedAt = new Date().toISOString();
  if (idx >= 0) {
    contracts[idx] = contract;
  } else {
    contracts.push(contract);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contracts));
}

export function deleteContract(id: string) {
  const contracts = getContracts().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contracts));
}
