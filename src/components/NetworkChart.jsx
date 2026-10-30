import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const networkData = [
  { time: "10:00", http: 24, icmp: 18, tcp: 21 },
  { time: "10:05", http: 32, icmp: 22, tcp: 25 },
  { time: "10:10", http: 28, icmp: 20, tcp: 23 },
  { time: "10:15", http: 45, icmp: 30, tcp: 35 },
  { time: "10:20", http: 35, icmp: 25, tcp: 28 },
  { time: "10:25", http: 55, icmp: 38, tcp: 42 },
  { time: "10:30", http: 42, icmp: 32, tcp: 36 },
  { time: "10:35", http: 65, icmp: 45, tcp: 50 },
  { time: "10:40", http: 48, icmp: 35, tcp: 40 },
  { time: "10:45", http: 58, icmp: 42, tcp: 47 },
  { time: "10:50", http: 38, icmp: 28, tcp: 32 },
  { time: "10:55", http: 46, icmp: 34, tcp: 39 },
  { time: "11:00", http: 30, icmp: 23, tcp: 27 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="custom-chart-tooltip">
      <p className="tooltip-time">{label}</p>

      {payload.map((item) => (
        <div className="tooltip-item" key={item.dataKey}>
          <span className="tooltip-dot" style={{ backgroundColor: item.color }} />

          <span>{item.name}</span>

          <strong>{item.value} ms</strong>
        </div>
      ))}
    </div>
  );
}

function NetworkChart() {
  return (
    <div className="network-chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={networkData}
          margin={{
            top: 15,
            right: 10,
            left: -15,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="httpGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#43d8ef" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#43d8ef" stopOpacity={0} />
            </linearGradient>

            <linearGradient id="icmpGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
            </linearGradient>

            <linearGradient id="tcpGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#40d6a0" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#40d6a0" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#263247" strokeDasharray="3 3" vertical={false} />

          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#8492a8", fontSize: 10 }} interval="preserveStartEnd" />

          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#8492a8", fontSize: 10 }} tickFormatter={(value) => `${value}`} domain={[0, "auto"]} />

          <Tooltip content={<CustomTooltip />} />

          <Area type="monotone" dataKey="http" name="HTTP" stroke="#43d8ef" strokeWidth={2} fill="url(#httpGradient)" activeDot={{ r: 5 }} />

          <Area type="monotone" dataKey="icmp" name="ICMP" stroke="#a78bfa" strokeWidth={2} fill="url(#icmpGradient)" activeDot={{ r: 5 }} />

          <Area type="monotone" dataKey="tcp" name="TCP SYN" stroke="#40d6a0" strokeWidth={2} fill="url(#tcpGradient)" activeDot={{ r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default NetworkChart;
