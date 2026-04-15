import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ComposedChart, Line, Cell
} from 'recharts';
import { 
  TrendingDown, TrendingUp, DollarSign, PieChart, 
  ArrowDownRight, ArrowUpRight, Briefcase, Calendar, Layers,
  ChevronDown, ChevronRight, Lock, LogOut, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Data ---
const categories = [
  { id: "05", name: "05.Serv. Terceiros", color: "#3b82f6" }, // Highlight color
  { id: "07", name: "07.Transformação Digital", color: "#94a3b8" },
  { id: "08", name: "08.Deslocamento", color: "#cbd5e1" },
  { id: "09", name: "09.Outros Custos/ Desp. Operac.", color: "#94a3b8" },
  { id: "10", name: "10.Publicidade & Propaganda", color: "#e2e8f0" }
];

const rawData = [
  // 05.Serv. Terceiros
  { category: "05", dir: "Gestão de Operações e Integração", actualQ1: 0, budgetQ1: 12000, remanejadoQ1: 0, varQ1: 12000, actualQ2: 0, budgetQ2: 28000, remanejadoQ2: 0, varQ2: 28000, budgetQ3: 19000, budgetQ4: 22000 },
  { category: "05", dir: "VP de Operação Nacional e Growth", actualQ1: 16302.60, budgetQ1: 150000, remanejadoQ1: -127263.84, varQ1: 6433.56, actualQ2: 0, budgetQ2: 150000, remanejadoQ2: -70000, varQ2: 80000, budgetQ3: 150000, budgetQ4: 150000 },
  { category: "05", dir: "Diretoria de Expansões", actualQ1: 52855.00, budgetQ1: 158741.34, remanejadoQ1: 0, varQ1: 105886.34, actualQ2: 0, budgetQ2: 178741.34, remanejadoQ2: 0, varQ2: 178741.34, budgetQ3: 178741.34, budgetQ4: 168741.34 },
  { category: "05", dir: "Expansão Semipresencial", actualQ1: 0, budgetQ1: 172451.40, remanejadoQ1: 0, varQ1: 172451.40, actualQ2: 0, budgetQ2: 132588.55, remanejadoQ2: 0, varQ2: 132588.55, budgetQ3: 134588.55, budgetQ4: 90725.70 },
  
  // 07.Transformação Digital
  { category: "07", dir: "Gestão de Operações e Integração", actualQ1: 5454.94, budgetQ1: 10000, remanejadoQ1: 0, varQ1: 4545.06, actualQ2: 0, budgetQ2: 10000, remanejadoQ2: 0, varQ2: 10000, budgetQ3: 0, budgetQ4: 12000 },
  { category: "07", dir: "VP de Operação Nacional e Growth", actualQ1: 246663.84, budgetQ1: 0, remanejadoQ1: 246663.84, varQ1: 0, actualQ2: 0, budgetQ2: 0, remanejadoQ2: 0, varQ2: 0, budgetQ3: 0, budgetQ4: 0 },
  { category: "07", dir: "Diretoria de Expansões", actualQ1: -6186.04, budgetQ1: 0, remanejadoQ1: 0, varQ1: 6186.04, actualQ2: 0, budgetQ2: 0, remanejadoQ2: 0, varQ2: 0, budgetQ3: 0, budgetQ4: 0 },

  // 08.Deslocamento
  { category: "08", dir: "Gestão de Operações e Integração", actualQ1: 10585.22, budgetQ1: 27300, remanejadoQ1: 0, varQ1: 16714.78, actualQ2: 0, budgetQ2: 35700, remanejadoQ2: 0, varQ2: 35700, budgetQ3: 24800, budgetQ4: 45200 },
  { category: "08", dir: "VP de Operação Nacional e Growth", actualQ1: 44606.12, budgetQ1: 41200, remanejadoQ1: -5000, varQ1: 8406.12, actualQ2: 0, budgetQ2: 41200, remanejadoQ2: 0, varQ2: 41200, budgetQ3: 41200, budgetQ4: 41200 },
  { category: "08", dir: "Diretoria de Expansões", actualQ1: 31744.17, budgetQ1: 45900, remanejadoQ1: 0, varQ1: 14155.83, actualQ2: 0, budgetQ2: 53700, remanejadoQ2: 0, varQ2: 53700, budgetQ3: 54200, budgetQ4: 61200 },
  { category: "08", dir: "Expansão Semipresencial", actualQ1: 0, budgetQ1: 55000, remanejadoQ1: 0, varQ1: 55000, actualQ2: 0, budgetQ2: 58000, remanejadoQ2: 0, varQ2: 58000, budgetQ3: 63000, budgetQ4: 60000 },
  { category: "08", dir: "Projeto Agronegócio", actualQ1: 51019.16, budgetQ1: 23000, remanejadoQ1: 5000, varQ1: -23019.16, actualQ2: 0, budgetQ2: 26000, remanejadoQ2: 0, varQ2: 26000, budgetQ3: 26000, budgetQ4: 26000 },

  // 09.Outros Custos/ Desp. Operac.
  { category: "09", dir: "Gestão de Operações e Integração", actualQ1: 1010.76, budgetQ1: 5000, remanejadoQ1: 0, varQ1: 3989.24, actualQ2: 0, budgetQ2: 10000, remanejadoQ2: 0, varQ2: 10000, budgetQ3: 5000, budgetQ4: 3000 },
  { category: "09", dir: "VP de Operação Nacional e Growth", actualQ1: 1926.55, budgetQ1: 103000, remanejadoQ1: -20440, varQ1: 80633.45, actualQ2: 0, budgetQ2: 102500, remanejadoQ2: 0, varQ2: 99093.24, budgetQ3: 103000, budgetQ4: 102000 },
  { category: "09", dir: "Diretoria de Expansões", actualQ1: 756.90, budgetQ1: 30000, remanejadoQ1: 0, varQ1: 29243.10, actualQ2: 0, budgetQ2: 40000, remanejadoQ2: 0, varQ2: 40000, budgetQ3: 50000, budgetQ4: 30000 },
  { category: "09", dir: "Expansão Semipresencial", actualQ1: 0, budgetQ1: 175000, remanejadoQ1: 0, varQ1: 175000, actualQ2: 0, budgetQ2: 325000, remanejadoQ2: 0, varQ2: 325000, budgetQ3: 325000, budgetQ4: 25000 },
  { category: "09", dir: "Projeto Agronegócio", actualQ1: 59.98, budgetQ1: 3000, remanejadoQ1: 0, varQ1: 3059.98, actualQ2: 0, budgetQ2: 3000, remanejadoQ2: 0, varQ2: 3000, budgetQ3: 3000, budgetQ4: 3000 },

  // 10.Publicidade & Propaganda
  { category: "10", dir: "VP de Operação Nacional e Growth", actualQ1: 0, budgetQ1: 0, remanejadoQ1: 1040, varQ1: 1040, actualQ2: 0, budgetQ2: 0, remanejadoQ2: 0, varQ2: 0, budgetQ3: 0, budgetQ4: 0 },
  { category: "10", dir: "Diretoria de Expansões", actualQ1: 0, budgetQ1: 0, remanejadoQ1: 0, varQ1: 0, actualQ2: 0, budgetQ2: 0, remanejadoQ2: 0, varQ2: 0, budgetQ3: 0, budgetQ4: 0 },
].map(item => ({
  ...item,
  adjustedBudgetQ1: item.budgetQ1 + item.remanejadoQ1,
  adjustedBudgetQ2: item.budgetQ2 + item.remanejadoQ2,
}));

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatCompact = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1
  }).format(value);
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('anima_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);
  }, []);

  const handleLogin = (password: string) => {
    if (password === 'Expansao123') {
      setIsAuthenticated(true);
      localStorage.setItem('anima_auth', 'true');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('anima_auth');
  };

  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({ "05": true });
  const [adjustmentValues, setAdjustmentValues] = useState<Record<string, { adj2: number, adj3: number, adj4: number, details: string }>>({});

  const toggleCat = (id: string) => {
    setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const updateAdjustment = (dir: string, field: 'adj2' | 'adj3' | 'adj4' | 'details', val: any) => {
    setAdjustmentValues(prev => ({
      ...prev,
      [dir]: {
        ...(prev[dir] || { adj2: 0, adj3: 0, adj4: 0, details: '' }),
        [field]: val
      }
    }));
  };

  // Aggregations
  const totalActualQ2 = useMemo(() => rawData.reduce((acc, curr) => acc + (curr.actualQ2 || 0), 0), []);
  const totalVarQ2 = useMemo(() => rawData.reduce((acc, curr) => acc + curr.varQ2, 0), []);
  
  const combinedCatsData = useMemo(() => rawData.filter(d => ["05", "09"].includes(d.category)), []);
  const combinedActualQ2 = useMemo(() => combinedCatsData.reduce((acc, curr) => acc + (curr.actualQ2 || 0), 0), [combinedCatsData]);
  const combinedVarQ2Base = useMemo(() => combinedCatsData.reduce((acc, curr) => acc + curr.varQ2, 0), [combinedCatsData]);
  
  // Adjustment totals
  const totalAdj2 = useMemo(() => (Object.values(adjustmentValues) as any[]).reduce((acc, curr) => acc + (curr.adj2 || 0), 0), [adjustmentValues]);
  const totalAdj3 = useMemo(() => (Object.values(adjustmentValues) as any[]).reduce((acc, curr) => acc + (curr.adj3 || 0), 0), [adjustmentValues]);
  const totalAdj4 = useMemo(() => (Object.values(adjustmentValues) as any[]).reduce((acc, curr) => acc + (curr.adj4 || 0), 0), [adjustmentValues]);

  const combinedVarQ2Adjusted = combinedVarQ2Base + totalAdj2;
  const combinedAdjustedBudgetQ2 = useMemo(() => combinedCatsData.reduce((acc, curr) => acc + curr.adjustedBudgetQ2, 0), [combinedCatsData]);
  const combinedSavingsPct = combinedAdjustedBudgetQ2 !== 0 ? (combinedVarQ2Adjusted / combinedAdjustedBudgetQ2) * 100 : 0;

  // Resumo Gerencial Calculation (Broken by CC)
  const uniqueDirs = useMemo(() => Array.from(new Set(combinedCatsData.map(d => d.dir))).sort(), [combinedCatsData]);
  const summaryByDir = useMemo(() => uniqueDirs.map(dir => {
    const items = combinedCatsData.filter(d => d.dir === dir);
    const baseValue = items.reduce((acc, curr) => acc + curr.varQ2 + curr.budgetQ3 + curr.budgetQ4, 0);
    const adj = adjustmentValues[dir] || { adj2: 0, adj3: 0, adj4: 0, details: '' };
    return {
      dir,
      baseValue,
      ...adj,
      total: baseValue + adj.adj2 + adj.adj3 + adj.adj4
    };
  }), [uniqueDirs, combinedCatsData, adjustmentValues]);

  const summaryTotalBase = useMemo(() => summaryByDir.reduce((acc, curr) => acc + curr.baseValue, 0), [summaryByDir]);
  const summaryTotalAdjustment = totalAdj2 + totalAdj3 + totalAdj4;
  const summaryTotalFinal = summaryTotalBase + summaryTotalAdjustment;

  // Helper for remanejado colors
  const getRemanejadoColor = (val: number, isFooter = false) => {
    if (val > 0) return isFooter ? "text-emerald-400" : "text-emerald-600";
    if (val < 0) return isFooter ? "text-rose-300" : "text-rose-600";
    return isFooter ? "text-slate-400" : "text-slate-400";
  };

  // Chart Data: By Category
  const chartDataByCategory = useMemo(() => categories.map(cat => {
    const items = rawData.filter(d => d.category === cat.id);
    return {
      name: cat.name.split('.')[1].trim(), // e.g. "Serv. Terceiros"
      fullName: cat.name,
      realizado: items.reduce((acc, curr) => acc + curr.actualQ1, 0),
      orcado: items.reduce((acc, curr) => acc + curr.adjustedBudgetQ1, 0),
      isHighlight: cat.id === "05"
    };
  }), []);

  // Chart Data: Trend for (05 + 09) vs Total
  const trendData = useMemo(() => [
    { 
      name: "1º Tri", 
      Total_Orçado: rawData.reduce((acc, curr) => acc + curr.adjustedBudgetQ1, 0),
      Combined_Orçado: combinedCatsData.reduce((acc, curr) => acc + curr.adjustedBudgetQ1, 0),
      Combined_Realizado: combinedCatsData.reduce((acc, curr) => acc + curr.actualQ1, 0)
    },
    { 
      name: "2º Tri", 
      Total_Orçado: rawData.reduce((acc, curr) => acc + curr.adjustedBudgetQ2, 0),
      Combined_Orçado: combinedCatsData.reduce((acc, curr) => acc + curr.adjustedBudgetQ2, 0),
      Combined_Realizado: combinedActualQ2
    },
    { 
      name: "3º Tri", 
      Total_Orçado: rawData.reduce((acc, curr) => acc + curr.budgetQ3, 0),
      Combined_Orçado: combinedCatsData.reduce((acc, curr) => acc + curr.budgetQ3, 0),
    },
    { 
      name: "4º Tri", 
      Total_Orçado: rawData.reduce((acc, curr) => acc + curr.budgetQ4, 0),
      Combined_Orçado: combinedCatsData.reduce((acc, curr) => acc + curr.budgetQ4, 0),
    },
  ], [combinedCatsData, combinedActualQ2]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Layers className="w-5 h-5" />
              <span className="font-semibold tracking-wide uppercase text-sm">Anima Holding • Visão Geral</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Despesas por Aglutinador
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Acompanhamento global com foco em <strong className="text-blue-600">05. Serviços de Terceiros</strong>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
              <Calendar className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-700">Visão Anual (Q1 a Q4)</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all border border-transparent hover:border-rose-100"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard 
            title="Realizado 2º Tri" 
            value={formatCurrency(totalActualQ2)} 
            icon={<DollarSign className="w-5 h-5 text-slate-600" />}
            subtitle="Todas as linhas de despesa"
          />
          <KpiCard 
            title="Orçamento 2º Tri" 
            value={formatCurrency(totalVarQ2)} 
            icon={<PieChart className="w-5 h-5 text-slate-600" />}
            subtitle="Baseado na coluna Variação"
          />
          <KpiCard 
            title="Realizado Serv. Terceiro + Outros Custos 2º Tri" 
            value={formatCurrency(combinedActualQ2)} 
            icon={<Briefcase className="w-5 h-5 text-blue-600" />}
            valueClassName="text-blue-600"
            subtitle={`Orçado: ${formatCurrency(combinedAdjustedBudgetQ2)}`}
            className="border-blue-200 bg-blue-50/50"
          />
          <KpiCard 
            title="Saldo Serv. Terceiros + Outros Custos 2º Tri" 
            value={formatCurrency(combinedVarQ2Adjusted)} 
            icon={<TrendingDown className="w-5 h-5 text-emerald-600" />}
            valueClassName="text-emerald-600"
            subtitle={`${combinedSavingsPct.toFixed(1)}% vs Orçamento Ajustado`}
            trend="positive"
            className="border-emerald-200 bg-emerald-50/50"
          />
          <KpiCard 
            title="Saldo Serv. Terceiros + Outros Custos (2º, 3º e 4º Tri)" 
            value={formatCurrency(summaryTotalFinal)} 
            icon={<Layers className="w-5 h-5 text-purple-600" />}
            valueClassName="text-purple-600"
            subtitle="Soma Var. Q2 + Orç. Q3 + Orç. Q4"
            className="border-purple-200 bg-purple-50/50"
          />
        </div>

        {/* Resumo Gerencial Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              Resumo Gerencial (Serv. Terceiros + Outros Custos) por Centro de Custo
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Centro de Custo (Diretoria)</th>
                  <th className="px-4 py-3">Base</th>
                  <th className="px-4 py-3">Ajuste Manual 2º Tri</th>
                  <th className="px-4 py-3">Ajuste Manual 3º Tri</th>
                  <th className="px-4 py-3">Ajuste Manual 4º Tri</th>
                  <th className="px-4 py-3 min-w-[300px]">Detalhamento</th>
                  <th className="px-4 py-3 text-right">Totalizador Final</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {summaryByDir.map(item => (
                  <tr key={item.dir} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 font-medium text-slate-600">{item.dir}</td>
                    <td className="px-4 py-4 text-slate-700">
                      {formatCurrency(item.baseValue)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative max-w-[140px]">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-[10px]">R$</span>
                        <input 
                          type="number" 
                          value={item.adj2 || ''} 
                          onChange={(e) => updateAdjustment(item.dir, 'adj2', Number(e.target.value))}
                          placeholder="0,00"
                          className="w-full pl-7 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-xs font-medium text-slate-700"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative max-w-[140px]">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-[10px]">R$</span>
                        <input 
                          type="number" 
                          value={item.adj3 || ''} 
                          onChange={(e) => updateAdjustment(item.dir, 'adj3', Number(e.target.value))}
                          placeholder="0,00"
                          className="w-full pl-7 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-xs font-medium text-slate-700"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative max-w-[140px]">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-[10px]">R$</span>
                        <input 
                          type="number" 
                          value={item.adj4 || ''} 
                          onChange={(e) => updateAdjustment(item.dir, 'adj4', Number(e.target.value))}
                          placeholder="0,00"
                          className="w-full pl-7 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-xs font-medium text-slate-700"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <input 
                        type="text" 
                        value={item.details} 
                        onChange={(e) => updateAdjustment(item.dir, 'details', e.target.value)}
                        placeholder="Descreva o ajuste..."
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-xs text-slate-600"
                      />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className={cn(
                        "font-bold px-3 py-1 rounded-lg text-sm",
                        item.total >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                      )}>
                        {formatCurrency(item.total)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-800 font-bold text-white">
                <tr>
                  <td className="px-4 py-4">Total Geral (05 + 09)</td>
                  <td className="px-4 py-4">{formatCurrency(summaryTotalBase)}</td>
                  <td className="px-4 py-4">{formatCurrency(totalAdj2)}</td>
                  <td className="px-4 py-4">{formatCurrency(totalAdj3)}</td>
                  <td className="px-4 py-4">{formatCurrency(totalAdj4)}</td>
                  <td className="px-4 py-4"></td>
                  <td className="px-4 py-4 text-right text-lg">
                    {formatCurrency(summaryTotalFinal)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart: By Category */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Realizado vs Orçado Ajustado (1º Tri) por Aglutinador</h3>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartDataByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={formatCompact}
                    domain={[0, 'auto']}
                  />
                  <RechartsTooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }} />
                  <Bar dataKey="realizado" name="Realizado" radius={[4, 4, 0, 0]} maxBarSize={50}>
                    {chartDataByCategory.map((entry, index) => (
                      <Cell key={`cell-realizado-${index}`} fill={entry.isHighlight ? '#1e40af' : '#0f172a'} />
                    ))}
                  </Bar>
                  <Bar dataKey="orcado" name="Orçado Ajustado" radius={[4, 4, 0, 0]} maxBarSize={50}>
                    {chartDataByCategory.map((entry, index) => (
                      <Cell key={`cell-orcado-${index}`} fill={entry.isHighlight ? '#60a5fa' : '#94a3b8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Area Chart: Trend */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Evolução de Orçamento: Total vs (05 + 09)</h3>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCombined" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={formatCompact}
                    domain={[0, 'auto']}
                  />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }} />
                  <Area type="monotone" dataKey="Total_Orçado" name="Orçado Total" stroke="#94a3b8" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                  <Area type="monotone" dataKey="Combined_Orçado" name="Orçado (05 + 09)" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCombined)" />
                  <Line type="monotone" dataKey="Combined_Realizado" name="Realizado (05 + 09)" stroke="#1e40af" strokeWidth={3} dot={{ r: 6, strokeWidth: 2 }} activeDot={{ r: 8 }} connectNulls />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-base font-semibold text-slate-800">Detalhamento por Aglutinador e Diretoria</h3>
            <span className="text-xs text-slate-500">Clique na linha do aglutinador para expandir/recolher</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5">Aglutinador / Diretoria</th>
                  <th className="px-3 py-2.5 text-right">Realizado 1º Tri</th>
                  <th className="px-3 py-2.5 text-right">Orçado 1º Tri</th>
                  <th className="px-3 py-2.5 text-right">Remanejado 1º Tri</th>
                  <th className="px-3 py-2.5 text-right">Var. 1º Tri</th>
                  <th className="px-3 py-2.5 text-right">Orçado 2º Tri</th>
                  <th className="px-3 py-2.5 text-right">Remanejado 2º Tri</th>
                  <th className="px-3 py-2.5 text-right">Var. 2º Tri</th>
                  <th className="px-3 py-2.5 text-right">Orçado 3º Tri</th>
                  <th className="px-3 py-2.5 text-right">Orçado 4º Tri</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map(cat => {
                  const catData = rawData.filter(d => d.category === cat.id);
                  if (catData.length === 0) return null;
                  
                  // Category Summary Row
                  const catActualQ1 = catData.reduce((a, c) => a + c.actualQ1, 0);
                  const catBudgetQ1 = catData.reduce((a, c) => a + c.budgetQ1, 0);
                  const catRemanejadoQ1 = catData.reduce((a, c) => a + c.remanejadoQ1, 0);
                  const catVarQ1 = catData.reduce((a, c) => a + c.varQ1, 0);
                  const catBudgetQ2 = catData.reduce((a, c) => a + c.budgetQ2, 0);
                  const catRemanejadoQ2 = catData.reduce((a, c) => a + c.remanejadoQ2, 0);
                  const catVarQ2 = catData.reduce((a, c) => a + c.varQ2, 0);
                  const catBudgetQ3 = catData.reduce((a, c) => a + c.budgetQ3, 0);
                  const catBudgetQ4 = catData.reduce((a, c) => a + c.budgetQ4, 0);

                  const isHighlight = cat.id === "05";
                  const isExpanded = expandedCats[cat.id];

                  return (
                    <React.Fragment key={cat.id}>
                      <tr 
                        onClick={() => toggleCat(cat.id)}
                        className={cn("font-semibold border-t-2 border-slate-200 cursor-pointer hover:opacity-90 transition-opacity", isHighlight ? "bg-blue-50 text-blue-900" : "bg-slate-100 text-slate-800")}
                      >
                        <td className="px-3 py-2.5 flex items-center gap-1">
                          {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                          {cat.name}
                        </td>
                        <td className="px-3 py-2.5 text-right">{formatCurrency(catActualQ1)}</td>
                        <td className="px-3 py-2.5 text-right">{formatCurrency(catBudgetQ1)}</td>
                        <td className={cn("px-3 py-2.5 text-right", getRemanejadoColor(catRemanejadoQ1))}>
                          {catRemanejadoQ1 !== 0 ? formatCurrency(catRemanejadoQ1) : '-'}
                        </td>
                        <td className="px-3 py-2.5 text-right text-emerald-600">{formatCurrency(catVarQ1)}</td>
                        <td className="px-3 py-2.5 text-right">{formatCurrency(catBudgetQ2)}</td>
                        <td className={cn("px-3 py-2.5 text-right", getRemanejadoColor(catRemanejadoQ2))}>
                          {catRemanejadoQ2 !== 0 ? formatCurrency(catRemanejadoQ2) : '-'}
                        </td>
                        <td className="px-3 py-2.5 text-right text-emerald-600">{formatCurrency(catVarQ2)}</td>
                        <td className="px-3 py-2.5 text-right">{formatCurrency(catBudgetQ3)}</td>
                        <td className="px-3 py-2.5 text-right">{formatCurrency(catBudgetQ4)}</td>
                      </tr>
                      {isExpanded && catData.map(row => (
                        <tr key={`${cat.id}-${row.dir}`} className={cn("hover:bg-slate-50 transition-colors", isHighlight ? "bg-blue-50/30" : "")}>
                          <td className="px-3 py-1.5 pl-8 text-slate-600">{row.dir}</td>
                          <td className="px-3 py-1.5 text-right text-slate-900">{formatCurrency(row.actualQ1)}</td>
                          <td className="px-3 py-1.5 text-right text-slate-600">{formatCurrency(row.budgetQ1)}</td>
                          <td className={cn("px-3 py-1.5 text-right", getRemanejadoColor(row.remanejadoQ1))}>
                            {row.remanejadoQ1 !== 0 ? formatCurrency(row.remanejadoQ1) : '-'}
                          </td>
                          <td className="px-3 py-1.5 text-right font-medium text-emerald-600">{formatCurrency(row.varQ1)}</td>
                          <td className="px-3 py-1.5 text-right text-slate-500">{formatCurrency(row.budgetQ2)}</td>
                          <td className={cn("px-3 py-1.5 text-right", getRemanejadoColor(row.remanejadoQ2))}>
                            {row.remanejadoQ2 !== 0 ? formatCurrency(row.remanejadoQ2) : '-'}
                          </td>
                          <td className="px-3 py-1.5 text-right font-medium text-emerald-600">{formatCurrency(row.varQ2)}</td>
                          <td className="px-3 py-1.5 text-right text-slate-500">{formatCurrency(row.budgetQ3)}</td>
                          <td className="px-3 py-1.5 text-right text-slate-500">{formatCurrency(row.budgetQ4)}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-800 font-semibold text-white">
                <tr>
                  <td className="px-3 py-2.5">Total Geral</td>
                  <td className="px-3 py-2.5 text-right">{formatCurrency(rawData.reduce((a, c) => a + c.actualQ1, 0))}</td>
                  <td className="px-3 py-2.5 text-right">{formatCurrency(rawData.reduce((a, c) => a + c.budgetQ1, 0))}</td>
                  <td className={cn("px-3 py-2.5 text-right", getRemanejadoColor(rawData.reduce((a, c) => a + c.remanejadoQ1, 0), true))}>
                    {formatCurrency(rawData.reduce((a, c) => a + c.remanejadoQ1, 0))}
                  </td>
                  <td className="px-3 py-2.5 text-right text-emerald-400">{formatCurrency(rawData.reduce((a, c) => a + c.varQ1, 0))}</td>
                  <td className="px-3 py-2.5 text-right">{formatCurrency(rawData.reduce((a, c) => a + c.budgetQ2, 0))}</td>
                  <td className={cn("px-3 py-2.5 text-right", getRemanejadoColor(rawData.reduce((a, c) => a + c.remanejadoQ2, 0), true))}>
                    {formatCurrency(rawData.reduce((a, c) => a + c.remanejadoQ2, 0))}
                  </td>
                  <td className="px-3 py-2.5 text-right text-emerald-400">{formatCurrency(rawData.reduce((a, c) => a + c.varQ2, 0))}</td>
                  <td className="px-3 py-2.5 text-right">{formatCurrency(rawData.reduce((a, c) => a + c.budgetQ3, 0))}</td>
                  <td className="px-3 py-2.5 text-right">{formatCurrency(rawData.reduce((a, c) => a + c.budgetQ4, 0))}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

function Login({ onLogin }: { onLogin: (password: string) => boolean }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Área Restrita</h2>
            <p className="text-slate-400 text-sm mt-1">Anima Holding • Dashboard de Despesas</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                Senha de Acesso
              </label>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha..."
                  className={cn(
                    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none transition-all",
                    "focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                    error && "border-rose-500/50 ring-2 ring-rose-500/20 animate-shake"
                  )}
                  autoFocus
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <AnimatePresence>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-rose-400 text-xs font-medium ml-1"
                  >
                    Senha incorreta. Tente novamente.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]"
            >
              Acessar Dashboard
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em]">
              © 2024 Anima Holding • Todos os direitos reservados
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function KpiCard({ 
  title, 
  value, 
  icon, 
  subtitle, 
  trend,
  valueClassName,
  className
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  subtitle?: string;
  trend?: 'positive' | 'negative' | 'neutral';
  valueClassName?: string;
  className?: string;
}) {
  return (
    <div className={cn("bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between", className)}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-slate-600 font-medium text-sm">{title}</h3>
        <div className="p-2 bg-white/50 rounded-lg">
          {icon}
        </div>
      </div>
      <div>
        <p className={cn("text-2xl font-bold text-slate-900", valueClassName)}>
          {value}
        </p>
        {subtitle && (
          <div className="flex items-center gap-1 mt-2">
            {trend === 'positive' && <ArrowDownRight className="w-4 h-4 text-emerald-500" />}
            {trend === 'negative' && <ArrowUpRight className="w-4 h-4 text-rose-500" />}
            <p className="text-sm text-slate-600">{subtitle}</p>
          </div>
        )}
      </div>
    </div>
  );
}
