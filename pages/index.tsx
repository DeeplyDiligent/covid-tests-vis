import Head from 'next/head'
import styles from '../styles/Home.module.css'
import useSWR from "swr";
import fetcher from "../utils/fetcher";
import {Line} from "react-chartjs-2";
import moment from "moment";
import {FaBeer, FaChevronRight} from "react-icons/fa";

const getChange = (vicData) => {
  const newVicData = []
  for (var i = 1; i < vicData.length; i++) {
    let currentData = vicData[i]
    let pastData = vicData[i - 1]
    newVicData.push({
      casesChange: currentData["Confirmed cases"] - pastData["Confirmed cases"],
      testChange: currentData["Total tested"] - pastData["Total tested"],
      ...currentData
    })
  }
  return newVicData
}

const Home = () => {
  const {data, error} = useSWR('/api/percentTests', fetcher)
  if (error || !data) return null;
  const vicData = data.filter(x => x["State/territory"] === "VIC")
  vicData.reverse()

  const tests = vicData.map(x => ({y: x['Total tested'], t: moment(x["Date"]).toDate()}))
  const cases = vicData.map(x => ({y: x['Confirmed cases'], t: moment(x["Date"]).toDate()}))
  const casespertest = vicData.map(x => ({y: x['Confirmed cases'] / x['Total tested'], t: moment(x["Date"]).toDate()}))
  const casespernewtest = getChange(vicData).map(x => ({y: x['casesChange']/x['testChange'], t: moment(x["Date"]).toDate()}))
  console.log(getChange(vicData))

  return (
    <div className={styles.container}>
      <Head>
        <title>COVID-19 Victoria Testing Analysis</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Covid-19 By Testing - Data for Victoria
        </h1><br/>
        <div style={{margin: "10px"}}>Hi, I'm Deep! I had two simple missions when creating this site: <br /><br/>
          1. To learn a new tech stack <br/>
          2. To provide an accurate picture about the tests being done as a proportion of cases in victoria.<br /> <br/>
          This website will automatically update as new data is released each day.
        </div>
        <h2 className={styles.subtitle}>
          Number of Covid-19 Tests
        </h2>
        <div style={{width: "100%", height: "500px"}}>
          <Line
            options={{
              responsive: true, maintainAspectRatio: false, scales: {
                xAxes: [{
                  type: 'time'
                }]
              }
            }}
            data={{
              datasets: [
                {
                  label: 'Total Tested',
                  data: tests,
                  backgroundColor: 'rgba(162,255,181,0.2)',
                  borderColor: 'rgba(162,255,181,0.69)',
                  borderWidth: 1
                }]
            }}/>
        </div>
        <h2 className={styles.subtitle}>
          Number of Covid-19 Cases
        </h2>
        <div style={{width: "100%", height: "500px"}}>
          <Line
            options={{
              responsive: true, maintainAspectRatio: false, scales: {
                xAxes: [{
                  type: 'time'
                }]
              }
            }}
            data={{
              datasets: [
                {
                  label: 'Confirmed Cases',
                  data: cases,
                  backgroundColor: 'rgba(255,99,132,0.2)',
                  borderColor: 'rgba(255,99,132,0.83)',
                  borderWidth: 1
                }]
            }}/>
        </div>
        <h2 className={styles.subtitle}>
          Proportion of Positive Cases in those Tested
        </h2>
        <div style={{width: "100%", height: "500px"}}>
          <Line
            options={{
              responsive: true, maintainAspectRatio: false, scales: {
                xAxes: [{
                  type: 'time'
                }],
                yAxes: [{
                  ticks: {
                    callback: (value) => (value * 100).toFixed(2) + "%"
                  },
                  scaleLabel: {
                    display: true,
                    labelString: "Percentage"
                  }
                }]
              }
            }}
            data={{
              datasets: [
                {
                  label: '% of Cases out of Tests',
                  data: casespertest,
                  backgroundColor: 'rgba(101,110,255,0.2)',
                  borderColor: 'rgba(101,110,255,0.69)',
                  borderWidth: 1
                }]
            }}/>
        </div>
        <h2 className={styles.subtitle}>
          Proportion of New Positive Cases Out of Daily Tests
        </h2>
        <div style={{width: "100%", height: "500px"}}>
          <Line
            options={{
              responsive: true, maintainAspectRatio: false, scales: {
                xAxes: [{
                  type: 'time'
                }],
                yAxes: [{
                  ticks: {
                    callback: (value) => (value * 100).toFixed(2) + "%"
                  },
                  scaleLabel: {
                    display: true,
                    labelString: "Percentage"
                  }
                }]
              }
            }}
            data={{
              datasets: [
                {
                  label: '% of Cases out of Tests',
                  data: casespernewtest,
                  backgroundColor: 'rgba(255,69,247,0.2)',
                  borderColor: 'rgba(255,69,247,0.69)',
                  borderWidth: 1
                }]
            }}/>
        </div>
      </main>

      <footer className={styles.footer}>
        <div
          style={{display:"flex"}}
        >
          See More By&nbsp;<a href={"https://deepb.co/"} style={{fontWeight: "bold"}}>DeeplyDiligent</a>&emsp;
          <FaChevronRight/>
        </div>
      </footer>
    </div>
  )
}

export default Home;
