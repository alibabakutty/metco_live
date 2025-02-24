import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const FetchData = async () => {
   

                        try {
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
                        <DTODATE>30-07-2024</DTODATE>
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
                            const response = await axios.post('/api/', salesxml, {
                                headers: {
                                    "Content-Type": "text/xml;charset=utf-8",
                                },
                                responseType: "text", // Expecting XML response
                            });
                            console.log(response);
                            // const response = await fetch("/api", {
                            //     method: "POST",
                            //     headers: {
                            //       "Content-Type": "application/xml", // Specify the content type as
                            //     },
                            //     body: salesxml, // Sending XML data
                            //   });

                            
                    
                            let rawXml = response.data;
                    
                            // 🔥 Debug: Ensure full response is received
                            if (!rawXml || rawXml.trim() === "") {
                                throw new Error("Received empty response from the server.");
                            }
                    
                            // ✅ Fix gzip issue by ensuring text response
                            if (typeof rawXml !== "string") {
                                rawXml = rawXml.toString();
                            }
                    
                            const parser = new XMLParser();
                    
                            console.log(parser.parse(rawXml)) ;
                    
                        } catch (error) {
                            console.error("❌ Error fetching ledger data:", error.message);
                    
                            if (error.response) {
                                console.error("Response Data:", error.response.data);
                                console.error("Response Status:", error.response.status);
                                console.error("Response Headers:", error.response.headers);
                            } else if (error.request) {
                                console.error("No response received. Check if the Tally server is running.");
                            }
                        }}

export default FetchData;