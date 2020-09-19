// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {Request, Response} from "express";
import Papa from 'papaparse';
import moment from "moment";
global.XMLHttpRequest = require('xhr2');

const toInt = (string: string) => parseInt(string.replace(/[^0-9 | ^.]/g, ''))
export default async (req: Request, res: Response) => {
  Papa.parse("http://covid-sheets-mirror.web.app/api?cache=true&sheet=1nUUU5zPRPlhAXM_-8R7lsMnAkK4jaebvIL5agAaKoXk&range=Testing!A:F",{
    download: true,
    header: true,
    transform: (value, header) => {
      switch (header) {
        case 'Date':
          return moment(value, 'DD/MM/YYYY')
        case 'Confirmed cases':
          return toInt(value)
        case 'Total tested':
          return toInt(value)
        default:
          return value
      }
    },
    complete: function(results, file) {
      res.send(results.data)
      res.status(200).end()
    }
  })
}
