import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BigNumber from 'bignumber.js';

function formatDeposit(depositString) {
    const depositBigNumber = new BigNumber(depositString);
    const divisor = new BigNumber('1e18');
    return depositBigNumber.dividedBy(divisor).toFixed(2);  // Rounds to 2 decimal places
}


function DataFetcher() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.post(
                    'http://localhost:3001/getDepositInfo', 
                    {
                        options: {
                            dryRun: false,
                            withPM: false
                        }
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                setData(response.data.result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
    
        fetchData();
    }, []);
    

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div style={{ 
            display: 'inline-block', 
            padding: '20px', 
            backgroundColor: '#f7f9fc', 
            borderRadius: '8px', 
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
            whiteSpace: 'nowrap' 
        }}>
            <h2 style={{ 
                marginBottom: '8px', 
                color: '#333', 
                display: 'inline-block', 
                marginRight: '10px'
            }}>
                EntryPoint Deposit:
            </h2>
            <div style={{ 
                fontSize: '32px', 
                fontWeight: 'bold', 
                color: '#0077cc', 
                display: 'inline-block' 
            }}>
                {(data)} 
                <span style={{ 
                    fontSize: '18px',      // Reduced font size further
                    color: 'rgba(0,119,204,0.5)', // Made text half opaque for faint appearance
                    marginLeft: '4px'      // Optional: added a little spacing from the number
                }}>
                    VTHO
                </span>
            </div>
        </div>
    );
    
    
}

export default DataFetcher;
