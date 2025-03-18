export interface Match {
  matchid: string;
  matchNumber: number; // 👈 viktig
  lag1: string;
  lag1Abbreviation: string;
  lag2: string;
  lag2Abbreviation: string;
  poangLag1: number;
  poangLag2: number;
  createdAt: number;
}