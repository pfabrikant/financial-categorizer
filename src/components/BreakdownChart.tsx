import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface BreakdownChartProps {
  transactions: any[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const BreakdownChart: React.FC<BreakdownChartProps> = ({ transactions }) => {
  const breakdown = transactions.reduce((acc, transaction) => {
    const { category, Betrag } = transaction;
    if (category && Betrag) {
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += parseFloat(Betrag);
    }
    return acc;
  }, {} as {[key: string]: number});

  const data = Object.keys(breakdown).map(category => ({
    name: category,
    value: breakdown[category],
  }));

  const renderLabel = ({ name, percent }: { name: string, percent?: number }) => {
    if (percent === undefined) {
        return name;
    }
    return `${name} ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx={200}
        cy={200}
        labelLine={false}
        label={renderLabel}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default BreakdownChart;