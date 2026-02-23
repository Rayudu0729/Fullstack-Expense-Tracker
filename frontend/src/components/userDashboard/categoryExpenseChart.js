import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';


function CategoryExpenseChart({ categorySummary }) {
    const COLORS = ["#34d399", "#fb923c", "#06b6d4", "#8b5cf6", "#f472b6", "#facc15", "#38bdf8", "#a78bfa", "#94a3b8"];

    return (
        <div className='chart'>
            <ResponsiveContainer>
                <PieChart width={50} height={100}>
                    <Pie
                        data={categorySummary}
                        cx={280}
                        cy={135}
                        innerRadius={80}
                        outerRadius={110}
                        fill="#8884d8"
                        paddingAngle={0}
                        dataKey="amount"
                        label
                    >
                        {categorySummary.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend dataKey='category' />
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>


    )
}

export default CategoryExpenseChart;