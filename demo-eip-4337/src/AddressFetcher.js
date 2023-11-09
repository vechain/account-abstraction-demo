import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddressFetcher() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.post(
                    'http://localhost:3001/address', 
                    {
  
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
            padding: '20px', 
            backgroundColor: '#f7f9fc', 
            borderRadius: '8px', 
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
            maxWidth: '400px', 
            margin: '0 auto', 
            display: 'flex',         // Use flexbox
            alignItems: 'center'     // Vertically align in the middle
        }}>
            <h2 style={{ 
                marginBottom: '0',   // Remove bottom margin
                marginRight: '10px', // Add some spacing between the label and the address
                color: '#333' 
            }}>
                Address:
            </h2>
            <div style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#0077cc', 
                wordBreak: 'break-word'
            }}>
                {data}
            </div>
        </div>
    );
    
    
}

export default AddressFetcher;
