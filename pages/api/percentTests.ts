// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import useSWR from "swr";
import {Request, Response} from "express";
import csv from 'csv-parser'
import csvFetcher from "../utils/csvFetcher";
import * as fs from "fs";
import http from 'http';
import moment from "moment";

export default async (req: Request, res: Response) => {

  fetch("http://covid-sheets-mirror.web.app/api?cache=true&sheet=1nUUU5zPRPlhAXM_-8R7lsMnAkK4jaebvIL5agAaKoXk&range=Testing!A:F")
    .then(resp => new Promise((resolve, reject) => {
      const results = []
      // @ts-ignore
      resp.body.pipe(csv({
        mapValues: ({ header, index, value }) => {
          switch(header) {
            case 'Date':
              return moment(value, 'DD/MM/YYYY')
            case 'Confirmed cases':
              return parseInt(value)
            case 'Total tested':
              return parseInt(value)
            default:
              return value
          }
        }
      }))
      .on('data', (data) => results.push(data))
      .on('end', () => {
          res.send(results)
      });
  }));

}
