//  import {Pie} from 'react-chartjs-2';
// import React,{Component} from 'react';
// // import Chart from 'chart.js';
// // var Pie = require('react-chartjs').Pie;
// // var Chart = require('chart.js');
// class PieChart extends Component{
//     state = {
//         labels : ['under','18','20'],
//         datasets: [{
//             data:[200,400,600],
//             backgroundColor:['red','blue','green']
//         }]
//     }
//     render() {
//         return (
//             <div> <p> Pie Chart</p>
//             <Pie
//             data = {{
//                 labels: this.state.labels,
//                     datasets: this.state.datasets
//         }}
//         height = '50%'
//         />
//             <br />
//             </div>
//         )
//     }
// }
// export default PieChart;


import React, {PureComponent} from 'react';
import {
    ResponsiveContainer,
    ComposedChart,
    AreaChart,
    LineChart,
    Line,
    Area,
    PieChart,
    Pie,
    Cell,
    YAxis,
    XAxis,
    Sector,
    Tooltip
} from "recharts";
import { useTheme } from "@material-ui/styles";
 const data =[];
//     [
//     {name: "LG", value: 2},
//     {name: "ketan", value: 2},
//     {name: "sowbakya", value: 1},
//     {name: "preethi", value: 4},
//     {name: "LG", value: 3},
//     {name: "piegien", value: 3},
    // {name: "v-guard", value: 1},
    // {name: "viedocon", value: 2},
    // {name: "whirlpool", value: 3},
    // {name: "sony", value: 3},
    // {name: "PANASONIC", value: 1},
    // {name: "samsung", value: 3},
    // {name: "viedocon", value: 6},
    // {name: "samsung", value: 2},
    // {name: "V-GUARD", value: 1},
// ];

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042','#82CA9D'];
const COLORS = [
    "#65d3da",
    "#79d69f",
    "#fad144",
    "#d76c6c",
    "#138185",
    "#26a0a7",
    "#ec983d",
    "#cbe989",
    "#f9ec86",
    "#ebf898",
    "#82ca9d",
    '#0088fe',
    '#00c49f',
    '#ffbb28',
    '#ff8042'
];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
                                   cx, cy, midAngle, innerRadius, outerRadius, percent, index,
                               }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export default class Example extends PureComponent {
    // constructor(){
    //     super();
    //     this.getAccount();
    // }
    array = []
    state = {
        account: [],
        data: [],
        name: [],
        value: [],
    }

    componentDidMount() {
         this.getAccount();
    }

    getAccount() {
        let url = 'http://localhost:8081/api/sale/chart';
        console.log('query', url);
        fetch(url)
            .then(response => response.json())
            .then(res => {
                this.setState({
                    account: res,
                });
                console.log('responce', res);
                console.log('state', this.state.account);
                if (this.state.account) {
                    this.value = this.state.account.map(acc => acc.qty);
                    this.name = this.state.account.map(acc => acc.product);
                    console.log('THE  PIE DATE ====>', this.value, this.name);
                    for (let k = 0; k < this.name.length; k++) {
                        data.push({name: this.name[k], value: this.value[k]});
                    }
                    this.setState({
                        data: [...data]});

                } else {

                }
            })
            .catch(err => console.log(err))
    }

    render() {
         // const data = [];
         // data.push(...this.array);
console.log('the pushed data====>',data);

        console.log('THE  PIE DATE ====>', this.state.data);
        return (
            <ResponsiveContainer marginLeft={300} height={1200} width='100%'>
            <PieChart marginLeft={400} textAlign= {"center"} width={1200} height={1200}>
                <Pie
                    data={this.state.data}
                    cx={250}
                    cy={250}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    innerRadius={10}
                    outerRadius={250}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {
                        data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>)
                    }
                </Pie>
                <Tooltip/>
            </PieChart>
            </ResponsiveContainer>
        );
    }
}

{/*<ResponsiveContainer width="100%" height={144}>*/
}
{/*    <PieChart margin={{ left: theme.spacing(2) }}>*/
}
{/*        <Pie*/
}
{/*            data={PieChartData}*/
}
{/*            innerRadius={45}*/
}
{/*            outerRadius={60}*/
}
{/*            dataKey="value"*/
}
{/*        >*/
}
{/*            {PieChartData.map((entry, index) => (*/
}
{/*                <Cell*/
}
{/*                    key={`cell-${index}`}*/
}
{/*                    fill={theme.palette[entry.color].main}*/
}
{/*                />*/
}
{/*            ))}*/
}
{/*        </Pie>*/
}
{/*    </PieChart>*/
}
{/*</ResponsiveContainer>*/
}
