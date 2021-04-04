// import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import React, { Component } from 'react'

import Chart from 'react-apexcharts';


export class DashBoard extends Component {
    componentDidMount() {


    }

    cardStatusByMember = () => {
        const { board } = this.props
        var cardsByMembers = {}
        board.groups.forEach(group => {
            group.cards.forEach(card => {
                card.members.forEach((member) => {
                    if (!cardsByMembers[member.fullname]) {
                        cardsByMembers[member.fullname] = [{ status: card.status }]

                    } else {
                        cardsByMembers[member.fullname].push({ status: card.status })

                    }
                })
            })
        })




        var prevText = ''
        var prevName = ''
        // var counter = 0
        var values = {};
        var backgroundColor = [];
        for (let key in cardsByMembers) {
            cardsByMembers[key].forEach((card) => {
                const idx = backgroundColor.indexOf(card.status.color)
                if (idx < 0) backgroundColor.push(card.status.color)

            })


            cardsByMembers[key].forEach((card, idx, arr) => {
                
                if (values[card.status.text]) {
                    if (prevName === key && prevText === card.status.text) {

                        const copy = values[card.status.text].data[values[card.status.text].data.length - 1] + 1
                        // values[card.status.text].data.pop()
                        values[card.status.text].data.splice(values[card.status.text].data.length - 1, 1, copy)

                    } else if (prevName !== key && prevText === card.status.text) {
                        values[card.status.text].data.push(1)
                    } else if (prevName === key && prevText !== card.status.text) {
                        values[card.status.text].data.push(1)
                        // values[card.status.text].data.splice(values[card.status.text].data.length - 1, 0, 1)

                    }

                } else {
                    values[card.status.text] = { data: [1], name: card.status.text }
                }
                prevName = key
                prevText = card.status.text
            })


        }
        const options = {

            colors: backgroundColor,

            // colors: backgroundColor,
            chart: {
                type: 'bar',
                height: '100%',
                width: '100%',
                stacked: true,
                toolbar: {
                    show: true
                },
                zoom: {
                    enabled: true
                }
            },
            responsive: [],
            plotOptions: {
                bar: {
                    horizontal: false,
                },
            },
            xaxis: {
                categories: Object.keys(cardsByMembers),

            },
            yaxis: {
                lines: {
                    show: true,
                }
            },
            legend: {
                position: 'right',
                offsetY: 0
            },
            fill: {
                opacity: 1
            }
        };
        const series = Object.values(values)

        return { options, series }

    }

    render() {
        const value = this.cardStatusByMember()
        // const { board } = this.props
        // const hi = this.cardStatusByMember()

        return (
            <div>
                <Chart options={value.options} series={value.series} type="bar" width={'70%'} height={'300%'} />


            </div>

        )
    }
}





