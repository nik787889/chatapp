// //
import React from 'react'
import { Line, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJs, Tooltip, Filler, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Legend, plugins, scales, } from 'chart.js'
import { getLast7Days } from '../../lib/features'
import { lightBlue, lightPurple, orange, orangeLight, purple } from '../../constants/color'


ChartJs.register(Tooltip, Filler, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Legend,)


const labels = getLast7Days();

const LineChartOptions = {
    responsive: true,
    plugins: {
        Legend: {display: false,},
        title: {display: false,},
    },
    scales:{
        x: { grid: { display: false,},},
        y: { beginAtZero: true, grid: { display: false,},},
    }
}

const LineChart = ({value}) => {

  const data = {
    labels: labels,
    datasets: [
        {
            data: value,
            label: "Revenue",
            fill: true,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
        }
    ]
  }

  return  <Line data={data} options={LineChartOptions}/>
  
}



const DoughnutChartOptions = {
    responsive: true,
    plugins: {
        Legend: {display: false,},
        title: {display: false,},
    },
    cutout: 120,
}


const DoughnutChart = ({value = [], labels = []}) => {

    const data = {
        labels: labels,
        datasets: [
            {
                data: value,
                backgroundColor: [purple, orange],
                borderColor:[purple, orange],
                hoverBackgroundColor:[lightPurple, orangeLight],
                offset: 20
            }
        ]
    }

  return (
    <Doughnut style={{zIndex:10}} data={data} options={DoughnutChartOptions}/>
  )
}


export {LineChart, DoughnutChart}