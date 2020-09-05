import Head from 'next/head'
import styles from '../styles/Home.module.css'
import useSWR from "swr";
import fetcher from "./utils/fetcher";
import {Line} from "react-chartjs-2";
import moment from "moment";

const Home = () => {
  const {data, error} = useSWR('/api/percentTests', fetcher)
  if (error || !data) return null;
  const vicData = data.filter(x=> x["State/territory"] === "VIC")
  const tests = vicData.map(x=>({y: x['Total tested'], t: moment(x["Date"]).toDate()}))
  const cases = vicData.map(x=>({y: x['Confirmed cases'], t: moment(x["Date"]).toDate()}))
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Covid-19 By Testing
        </h1>
        <div style={{width: "100%", height:"500px", marginTop:"50px"}}>
          <Line
            options={{responsive: true, maintainAspectRatio: false, scales: {
              xAxes: [{
                type: 'time'
              }]
            }}}
            data={{
              datasets: [
                {
                  label: 'Total Tested',
                  data: tests,
                  backgroundColor: 'rgba(162,255,181,0.2)',
                  borderColor: 'rgba(162,255,181,0.69)',
                  borderWidth: 1
                },{
                  label: 'Confirmed Cases',
                  data: cases,
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  borderColor: 'rgba(255,99,132,0.48)',
                  borderWidth: 1
                }]
          }}/>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo}/>
        </a>
      </footer>
    </div>
  )
}

export default Home;
