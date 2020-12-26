import React, { PureComponent } from 'react';
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
    Tooltip,
    BarChart,
    Bar,
    CartesianGrid,
    Legend
} from "recharts";
const data = [];
 //    [{ S1: 0,S3: 0,S4: 0, S5: 0,S6: 0,S8: 0,S11: 0,S12: 0,S13: 0,S16: 0,S22: 0,S23: 0,S25: 0,S27: 0,name: "Jan",s25: 0},
 //    { S1: 0,S3: 0,S4: 0, S5: 0,S6: 0,S8: 0,S11: 0,S12: 0,S13: 0,S16: 0,S22: 0,S23: 0,S25: 0,S27: 0,name: "Feb",s25: 0},
 //     { S1: 0,S3: 0,S4: 0, S5: 0,S6: 0,S8: 0,S11: 0,S12: 0,S13: 0,S16: 0,S22: 0,S23: 0,S25: 0,S27: 0,name: "Mar",s25: 0},
 //     { S1: 0,S3: 0,S4: 0, S5: 0,S6: 0,S8: 0,S11: 3,S12: 0,S13: 0,S16: 2,S22: 0,S23: 2,S25: 4,S27: 3,name: "Apr",s25: 0},
 //     { S1: 0,S3: 0,S4: 0, S5: 2,S6: 0,S8: 5,S11: 2,S12: 0,S13: 0,S16: 0,S22: 0,S23: 0,S25: 0,S27: 0,name: "May",s25: 0},
 //     { S1: 0,S3: 0,S4: 0, S5: 0,S6: 0,S8: 0,S11: 0,S12: 0,S13: 0,S16: 0,S22: 0,S23: 0,S25: 0,S27: 0,name: "Jun",s25: 0},
 //     { S1: 0,S3: 0,S4: 0, S5: 0,S6: 0,S8: 0,S11: 0,S12: 0,S13: 0,S16: 0,S22: 0,S23: 0,S25: 0,S27: 0,name: "Jul",s25: 0},
 //     { S1: 0,S3: 0,S4: 0, S5: 0,S6: 0,S8: 0,S11: 0,S12: 0,S13: 0,S16: 0,S22: 0,S23: 0,S25: 0,S27: 0,name: "Aug",s25: 0},
 //     { S1: 0,S3: 0,S4: 0, S5: 0,S6: 0,S8: 0,S11: 0,S12: 0,S13: 0,S16: 0,S22: 0,S23: 0,S25: 0,S27: 0,name: "Sep",s25: 0},
 //    { S1: 0,S3: 0,S4: 0, S5: 0,S6: 0,S8: 0,S11: 0,S12: 0,S13: 0,S16: 0,S22: 0,S23: 0,S25: 0,S27: 0,name: "Oct",s25: 0},
 //     { S1: 0,S3: 0,S4: 0, S5: 0,S6: 0,S8: 0,S11: 0,S12: 0,S13: 0,S16: 0,S22: 0,S23: 0,S25: 0,S27: 0,name: "Nov",s25: 0},
 //     { S1: 0,S3: 0,S4: 0, S5: 0,S6: 0,S8: 0,S11: 0,S12: 0,S13: 0,S16: 0,S22: 0,S23: 0,S25: 0,S27: 0,name: "Dec",s25: 0},
 //
 // ];
//     {
//         name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
//     },
//     {
//         name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
//     },
//     {
//         name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
//     },
//     {
//         name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
//     },
//     {
//         name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
//     },
//     {
//         name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
//     },
//     {
//         name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
//     },
// ];
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

export default class Sample extends PureComponent {
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    array = [];
    ary = [];
    model = [];
    state = {
        account: [],
        data: [],
        product: [],
        value: [],
    }
    componentDidMount() {
        this.getAccount();
    }
    getAccount() {
        let url = 'http://localhost:8081/api/sale/chart/bar';
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
                    const date = this.state.account.map(prod => new Date(prod.salesDate).toDateString());
                    const dd = date.map(dat => dat.slice(4, 7));
                    const qty = this.state.account.map(prod => prod.qty);
                    const product = this.state.account.map(prod => prod.product);
                    this.state.product = this.state.account.map(prod => prod.product);

                    const month = this.state.account.map(prod => prod._id.month);
                    const name = this.state.account.map(prod => prod.product);
                    console.log('THE MONTH =====>', date, dd, qty, product);
                    for (let k = 0; k < this.months.length; k++) {
                        for (let i = 0; i < dd.length; i++) {
                            // console.log('THE MONTH =====>', this.months[k]);
                            // console.log('THE MONTH =====>', dd[i]);
                            if (this.months[k] === dd[i]) {
                                console.log('if loop');
                                const prod = product[i];
                                const q = qty[i];
                                console.log('seperate element', this.array);
                                this.array[[prod]] = qty[i]
                            } else if (this.months[k] !== dd[i]) {
                                console.log('else loop');
                                const pro = product[i];
                                this.array[[pro]] = 0;
                                console.log('seperate element', this.array);

                            }
                        }
                        this.model.push({name: this.months[k], ...Object.assign({}, this.array)});
                        // this.model.push({name: this.months[k], data:this.ary});
                        console.log('in loop===>', this.model);
                        this.array = [];
                        this.ary = [];
                    }

                    this.setState({
                        data: [...this.model]
                    });

                } else {

                }
            })
            .catch(err => console.log(err))
    }
    render() {
        return (
            <BarChart
                width={1200}
                height={700}
                data={this.state.data}
                margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {this.state.product.map((value, index) => {
                    return <Bar  dataKey= {this.state.product[index]} fill={COLORS[index]}  />
                })}
                {/*<Bar dataKey="pv" fill="#8884d8" background={{ fill: '#eee' }} />*/}
                {/*<Bar dataKey="uv" fill="#82ca9d" />*/}
            </BarChart>
        );
    }
}
