export interface Transaction {
  id: string;
  date: string;
  description: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  category: string;
}

export interface FinancialReport {
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  healthScore: number; // 1 - 10
  aiAdvice: string;
}

export interface TargetSegment {
  segmentName: string;
  characteristics: string;
  relevance: string;
  acquisitionChannel: string;
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface MarketingChannel {
  channelName: string;
  tacticDescription: string;
  costLevel: string;
  difficulty: "Mudah" | "Sedang" | "Sulit" | string;
}

export interface GrowthTactic {
  stepNumber: number;
  title: string;
  actionPlan: string;
}

export interface MarketAnalysisResponse {
  targetSegments: TargetSegment[];
  swot: SWOT;
  marketingChannels: MarketingChannel[];
  tactics: GrowthTactic[];
  aiStrategicAdvice: string;
}
