import { useEffect, useState } from 'react';
import { XMLParser } from 'fast-xml-parser';
import axios from 'axios';

const LiveReport = () => {
  const [reportData, setReportData] = useState([]);

  const apiUrl = import.meta.env.VITE_APP_API_URL || "http://localhost:9000";

  let salesxml = `<?xml version="1.0" encoding="utf-8"?>
<ENVELOPE>
<HEADER>
    <VERSION>1</VERSION>
    <TALLYREQUEST>Export</TALLYREQUEST>
    <TYPE>Data</TYPE>
    <ID>MyReportLedgerTable</ID>
</HEADER>
<BODY>
    <DESC>
        <STATICVARIABLES>
            <SVEXPORTFORMAT>XML (Data Interchange)</SVEXPORTFORMAT>
            <DFROMDATE>01-07-2024</DFROMDATE>
            <DTODATE>30-03-2025</DTODATE>
        </STATICVARIABLES>
        <TDL>
            <TDLMESSAGE>
                <REPORT NAME="MyReportLedgerTable">
                    <USE>MectoSales</USE>
                </REPORT>
            </TDLMESSAGE>
        </TDL>
    </DESC>
</BODY>
</ENVELOPE>`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from:', `${apiUrl}/api/`);
        const response = await axios.post(`/api/`, salesxml, {
          headers: {
            'Content-Type': 'text/xml;charset=utf-8',
          },
          responseType: 'text', // Expecting XML response
        });

        let rawXml = response.data;
        // console.log(rawXml);

        // 🔥 Debug: Ensure full response is received
        if (!rawXml || rawXml.trim() === '') {
          throw new Error('Received empty response from the server.');
        }

        // ✅ Fix gzip issue by ensuring text response
        if (typeof rawXml !== 'string') {
          rawXml = rawXml.toString();
        }

        const parser = new XMLParser();
        const data = parser.parse(rawXml);
        console.log(data);

        setReportData(data.METCOREPORTS.METCODETAILS);
      } catch (error) {
        console.error('❌ Error fetching ledger data:', error.message);

        if (error.response) {
          console.error('Response Data:', error.response.data);
          console.error('Response Status:', error.response.status);
          console.error('Response Headers:', error.response.headers);
        } else if (error.request) {
          console.error('No response received. Check if the Tally server is running.');
        }
      }
    };

    fetchData();
  }, [salesxml, apiUrl]);

  //   useEffect(() => {
  // 	console.log(reportData);
  //   },[reportData])

  useEffect(() => {
    console.log('API URL:', import.meta.env.VITE_APP_API_URL);
  }, []);
  
  return (
    <div>
      <table className="border border-slate-300 border-collapse w-full">
        <thead className="text-[12px]">
          <tr className="border-t border-b border-slate-300">
            <th className="border-r border-slate-300 w-[100px]">Date</th>
            <th className="border-r border-slate-300 w-[800px]">Particulars</th>
            <th className="border-r border-slate-300 w-[70px]">Voucher Type</th>
            <th className="border-r border-slate-300 w-[70px]">Voucher No.</th>
            <th className="border-r border-slate-300 w-[100px]">Value</th>
            <th className="border-r border-slate-300 w-[120px]">Gross Total</th>
            <th className="border-r border-slate-300">Sales Account 18%</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((data, index) => (
            <tr key={index}>
              <td className="border-r border-slate-300 text-right">{data.DATE}</td>
              <td className="border-r border-slate-300 pl-1">{data.CUSTOMERNAME}</td>
              <td className="border-r border-slate-300">Sales</td>
              <td className="border-r border-slate-300 text-right">{data.INVOICENO}</td>
              <td style={{ textAlign: 'right' }} className="border-r border-slate-300 text-right">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
                  data.TAXABLEAMOUNT,
                )}
              </td>
              <td style={{ textAlign: 'right' }} className="border-r border-slate-300 text-right">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
                  data.INVOICEAMOUNT < 0 ? data.INVOICEAMOUNT * -1 : data.INVOICEAMOUNT,
                )}{' '}
                Dr
              </td>
              <td style={{ textAlign: 'right' }} className="border-r border-slate-300 text-right">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
                  data.TAXABLEAMOUNT,
                )}{' '}
                Cr
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default LiveReport;