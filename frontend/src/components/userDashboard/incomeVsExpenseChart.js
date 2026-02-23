import { useState } from 'react';
import {
    AreaChart, Area,
    BarChart, Bar,
    LineChart, Line,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';

/* ─── Theme colours ─── */
const INCOME_COLOR = '#34d399';
const EXPENSE_COLOR = '#f43f5e';
const PIE_COLORS = [INCOME_COLOR, EXPENSE_COLOR];

/* ─── Chart type options ─── */
const CHART_TYPES = [
    { id: 'area', label: 'Area', icon: '⌇' },
    { id: 'bar', label: 'Bar', icon: '▐' },
    { id: 'line', label: 'Line', icon: '∿' },
    { id: 'pie', label: 'Pie', icon: '◔' },
];

/* ─── Custom Tooltip ─── */
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'rgba(10,20,40,0.95)',
            border: '1px solid rgba(52,211,153,0.25)',
            borderRadius: '12px',
            padding: '12px 18px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            fontFamily: 'Inter, sans-serif',
        }}>
            {label && (
                <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>
                    {label}
                </p>
            )}
            {payload.map((entry) => (
                <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color, display: 'inline-block' }} />
                    <span style={{ color: '#cbd5e1', fontSize: '13px' }}>{entry.name}:</span>
                    <span style={{ color: entry.color, fontWeight: 700, fontSize: '13px' }}>
                        ₹{Number(entry.value).toLocaleString()}
                    </span>
                </div>
            ))}
        </div>
    );
};

/* ─── Custom Legend ─── */
const CustomLegend = ({ payload }) => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '28px', marginTop: '12px' }}>
        {payload?.map((entry) => (
            <div key={entry.value} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: 28, height: 3, borderRadius: 99, background: entry.color, display: 'inline-block' }} />
                <span style={{ color: '#94a3b8', fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                    {entry.value}
                </span>
            </div>
        ))}
    </div>
);

/* ─── Pie custom label ─── */
const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (percent < 0.05) return null;
    return (
        <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
            fontSize={12} fontWeight={600} fontFamily="Inter, sans-serif">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

/* ─── Shared axis props ─── */
const xAxisProps = {
    tick: { fill: '#64748b', fontSize: 11, fontFamily: 'Inter, sans-serif' },
    axisLine: { stroke: 'rgba(255,255,255,0.08)' },
    tickLine: false,
    tickFormatter: (v) => v.slice(0, 3),
};
const yAxisProps = {
    tick: { fill: '#64748b', fontSize: 11, fontFamily: 'Inter, sans-serif' },
    axisLine: false,
    tickLine: false,
    tickFormatter: (v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v,
    width: 45,
};
const gridProps = {
    strokeDasharray: '4 4',
    stroke: 'rgba(255,255,255,0.05)',
    vertical: false,
};

/* ─── Main Component ─── */
function IncomeVsExpenseChart({ data }) {
    const [chartType, setChartType] = useState('area');

    /* Build pie data: sum all months */
    const pieData = [
        { name: 'Income', value: data.reduce((s, d) => s + (d.totalIncome || 0), 0) },
        { name: 'Expense', value: data.reduce((s, d) => s + (d.totalExpense || 0), 0) },
    ];

    const sharedDotProps = { dot: false };
    const activeDot = (color) => ({ r: 5, fill: color, stroke: '#0a1428', strokeWidth: 2 });

    return (
        <div style={{
            width: '100%',
            padding: '28px 24px 20px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(52,211,153,0.12)',
            borderRadius: '20px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
            marginTop: '16px',
            boxSizing: 'border-box',
        }}>

            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ color: '#34d399', fontSize: '17px', fontWeight: 700, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.3px', margin: 0 }}>
                        Income vs Expense
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px', fontFamily: 'Inter, sans-serif' }}>
                        Last 12 months overview
                    </p>
                </div>

                {/* Chart type selector */}
                <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '5px', border: '1px solid rgba(255,255,255,0.07)' }}>
                    {CHART_TYPES.map(({ id, label, icon }) => {
                        const active = chartType === id;
                        return (
                            <button
                                key={id}
                                onClick={() => setChartType(id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '6px 14px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    transition: 'all 0.2s ease',
                                    background: active ? 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(6,182,212,0.15))' : 'transparent',
                                    color: active ? '#34d399' : '#64748b',
                                    boxShadow: active ? '0 0 0 1px rgba(52,211,153,0.3)' : 'none',
                                }}
                            >
                                <span style={{ fontSize: '14px' }}>{icon}</span>
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Area Chart ── */}
            {chartType === 'area' && (
                <ResponsiveContainer width="100%" height={340}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={INCOME_COLOR} stopOpacity={0.35} />
                                <stop offset="95%" stopColor={INCOME_COLOR} stopOpacity={0.02} />
                            </linearGradient>
                            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={EXPENSE_COLOR} stopOpacity={0.35} />
                                <stop offset="95%" stopColor={EXPENSE_COLOR} stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="monthName" {...xAxisProps} />
                        <YAxis {...yAxisProps} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={<CustomLegend />} />
                        <Area type="monotone" dataKey="totalIncome" name="Income" stroke={INCOME_COLOR} strokeWidth={2.5} fill="url(#incomeGrad)"  {...sharedDotProps} activeDot={activeDot(INCOME_COLOR)} />
                        <Area type="monotone" dataKey="totalExpense" name="Expense" stroke={EXPENSE_COLOR} strokeWidth={2.5} fill="url(#expenseGrad)" {...sharedDotProps} activeDot={activeDot(EXPENSE_COLOR)} />
                    </AreaChart>
                </ResponsiveContainer>
            )}

            {/* ── Bar Chart ── */}
            {chartType === 'bar' && (
                <ResponsiveContainer width="100%" height={340}>
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barCategoryGap="30%">
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="monthName" {...xAxisProps} />
                        <YAxis {...yAxisProps} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={<CustomLegend />} />
                        <Bar dataKey="totalIncome" name="Income" fill={INCOME_COLOR} radius={[4, 4, 0, 0]} opacity={0.9} />
                        <Bar dataKey="totalExpense" name="Expense" fill={EXPENSE_COLOR} radius={[4, 4, 0, 0]} opacity={0.9} />
                    </BarChart>
                </ResponsiveContainer>
            )}

            {/* ── Line Chart ── */}
            {chartType === 'line' && (
                <ResponsiveContainer width="100%" height={340}>
                    <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="monthName" {...xAxisProps} />
                        <YAxis {...yAxisProps} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={<CustomLegend />} />
                        <Line type="monotone" dataKey="totalIncome" name="Income" stroke={INCOME_COLOR} strokeWidth={2.5} {...sharedDotProps} activeDot={activeDot(INCOME_COLOR)} />
                        <Line type="monotone" dataKey="totalExpense" name="Expense" stroke={EXPENSE_COLOR} strokeWidth={2.5} strokeDasharray="6 3" {...sharedDotProps} activeDot={activeDot(EXPENSE_COLOR)} />
                    </LineChart>
                </ResponsiveContainer>
            )}

            {/* ── Pie Chart ── */}
            {chartType === 'pie' && (
                <ResponsiveContainer width="100%" height={340}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={90}
                            outerRadius={140}
                            paddingAngle={4}
                            dataKey="value"
                            labelLine={false}
                            label={renderPieLabel}
                            strokeWidth={0}
                        >
                            {pieData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} opacity={0.9} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            formatter={(value) => (
                                <span style={{ color: '#94a3b8', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>{value}</span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

export default IncomeVsExpenseChart;