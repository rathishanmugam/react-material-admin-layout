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
    Tooltip,
    CartesianGrid,
    Legend
} from "recharts";

// const {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} = Recharts;
const data =[]
// { S1: 0,S3: 0,S4: 0, S5: 0,S6: 0,S8: 0,S11: 0,S12: 0,S13: 0,S16: 0,S22: 0,S23: 0,S25: 0,S27: 0,name: "Jan",s25: 0},
//     { S1: 0,S3: 0,S4: 0, S5: 0,S6: 0,S8: 0,S11: 0,S12: 0,S13: 0,S16: 0,S22: 0,S23: 0,S25: 0,S27: 0,name: "Feb",s25: 0},
//     { S1: 0,S3: 0,S4: 0, S5: 0,S6: 0,S8: 0,S11: 0,S12: 0,S13: 0,S16: 0,S22: 0,S23: 0,S25: 0,S27: 0,name: "Mar",s25: 0},
//     { S1: 0,S3: 0,S4: 0, S5: 0,S6: 0,S8: 0,S11: 3,S12: 0,S13: 0,S16: 2,S22: 0,S23: 2,S25: 4,S27: 3,name: "Apr",s25: 0},
//     { S1: 0,S3: 0,S4: 0, S5: 2,S6: 0,S8: 5,S11: 2,S12: 0,S13: 0,S16: 0,S22: 0,S23: 0,S25: 0,S27: 0,name: "May",s25: 0},
//     { S1: 0,S3: 0,S4: 0, S5: 0,S6: 0,S8: 0,S11: 0,S12: 0,S13: 0,S16: 0,S22: 0,S23: 0,S25: 0,S27: 0,name: "Jun",s25: 0},
//     { S1: 0,S3: 0,S4: 0, S5: 0,S6: 0,S8: 0,S11: 0,S12: 0,S13: 0,S16: 0,S22: 0,S23: 0,S25: 0,S27: 0,name: "Jul",s25: 0},
//     { S1: 0,S3: 0,S4: 0, S5: 0,S6: 0,S8: 0,S11: 0,S12: 0,S13: 0,S16: 0,S22: 0,S23: 0,S25: 0,S27: 0,name: "Aug",s25: 0},
//     { S1: 0,S3: 0,S4: 0, S5: 0,S6: 0,S8: 0,S11: 0,S12: 0,S13: 0,S16: 0,S22: 0,S23: 0,S25: 0,S27: 0,name: "Sep",s25: 0},
//     { S1: 0,S3: 0,S4: 0, S5: 0,S6: 0,S8: 0,S11: 0,S12: 0,S13: 0,S16: 0,S22: 0,S23: 0,S25: 0,S27: 0,name: "Oct",s25: 0},
//     { S1: 0,S3: 0,S4: 0, S5: 0,S6: 0,S8: 0,S11: 0,S12: 0,S13: 0,S16: 0,S22: 0,S23: 0,S25: 0,S27: 0,name: "Nov",s25: 0},
//     { S1: 0,S3: 0,S4: 0, S5: 0,S6: 0,S8: 0,S11: 0,S12: 0,S13: 0,S16: 0,S22: 0,S23: 0,S25: 0,S27: 0,name: "Dec",s25: 0},
//
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











// name: "Jan"
//     {0: "S25:0", 1: "S22:0", 2: "S11:0", 3: "S25:0", 4: "S12:0", 5: "S16:0", 6: "S6:0", 7: "s25:0", 8: "S3:0", 9: "S4:0", 10: "S8:0", 11: "S5:0", 12: "S13:0", 13: "S23:0", 14: "S6:0", 15: "S1:0", 16: "S5:0", 17: "S27:0", 18: "S11:0", name: "Oct"}
//     {name: 'March',one: 2000, two: 9800},
//     {name: 'Apr', one: 2780, two: 3908},
//     {name: 'May', one: 1890, two: 4800},
//     {name: 'June', one: 2390, two: 3800},
//     {name: 'July', one: 3490, two: 4300},
// ];
class SimpleLineChart extends PureComponent {
    componentDidMount() {
        this.getAccount();
    }

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
                                // var map1 = new Map();
                                //
                                // map1.set([prod], q);
                                // for (let [key, value] of map1) {
                                //     const arr1 = key + ":" + value;
                                //     this.ary.push(key + ":" + value);
                                // }
                                // console.log('seperate element', this.ary);
                                console.log('seperate element', this.array);

                                 // this.array.push({[prod]: qty[i]});
                                this.array[[prod]] = qty[i]
                            } else if (this.months[k] !== dd[i]) {
                                console.log('else loop');
                                const pro = product[i];
                                // var map = new Map();
                                // map.set([pro], 0);
                                // for (let [key, value] of map) {
                                //      const arr = key + ":" + value;
                                //     this.ary.push(key + ":" + value);
                                // }
                                //
                                // console.log('seperate element', this.ary);
                                // this.array.push({[pro]: 0})
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
        console.log('THE DATA FOR LINE CHART===>', this.state.data);
        return (
            <ResponsiveContainer marginLeft={10} height={1000} width='100%'>

                <LineChart data={this.state.data} width={800} height={700}
                           margin={{top: 10, right: 10, left: 10, bottom: 10}}>
                    {/*{ this.months.map(mon => (*/}
                    {/*<XAxis dataKey={mon}/>))}*/}
                    <XAxis dataKey="name" />
                    <YAxis/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip/>
                    <Legend/>
                    {this.state.product.map((value, index) => {

                    {/*{ this.state.product.map(prod => (*/}
                   return <Line type="monotone" dataKey= {this.state.product[index]} stroke={COLORS[index]} />
                    })}
                </LineChart>
            </ResponsiveContainer>
        );
    }
}

export default SimpleLineChart;

// var arrOfObj = [{name: 'eve'},{name:'john'},{name:'jane'}];
// var injectObj = {isActive:true, timestamp:new Date()};
//
// // function to inject key values in all object of json array
//
// function injectKeyValueInArray (array, keyValues){
//     return new Promise((resolve, reject) => {
//         if (!array.length)
//             return resolve(array);
//
//         array.forEach((object) => {
//             for (let key in keyValues) {
//                 object[key] = keyValues[key]
//             }
//         });
//         resolve(array);
//     })
// };
//
// //call function to inject json key value in all array object
// injectKeyValueInArray(arrOfObj,injectObj).then((newArrOfObj)=>{
//     console.log(newArrOfObj);
// });
// Output like this:-
//
//     [ { name: 'eve',
//         isActive: true,
//         timestamp: 2017-12-16T16:03:53.083Z },
// { name: 'john',
//     isActive: true,
//     timestamp: 2017-12-16T16:03:53.083Z },
// { name: 'jane',
//     isActive: true,
//     timestamp: 2017-12-16T16:03:53.083Z } ]
