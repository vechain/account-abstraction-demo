import React, { useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

function SendWidget() {
    const [isLoading, setIsLoading] = useState(false);
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');

    const handleClick = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                'http://localhost:3001/transfer',
                {
                    to: address,
                    amount: amount,
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
            console.log(response.data);
            // Handle the response data as needed
        } catch (error) {
            console.error('Error during the deploy:', error);
            // Handle error as needed
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>VET Transfer</div>  {/* <-- This is the added header */}
            <input
                style={styles.input}
                type="text"
                placeholder="Address"
                value={address}
                onChange={e => setAddress(e.target.value)}
            />
            <input
                style={styles.input}
                type="text"
                placeholder="Amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
            />
            <button 
                onClick={handleClick} 
                disabled={isLoading}
                style={{ ...styles.button, ...(isLoading ? styles.disabledButton : {}) }}
            >
                {isLoading ? <ClipLoader color="#FFFFFF" size={15} /> : 'Send'}
            </button>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        maxWidth: '300px',
        margin: '0 auto',
        backgroundColor: '#f7f9fc'
    },
    input: {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '16px'
    },
    button: {
        backgroundColor: '#0077cc',
        color: 'white',
        padding: '15px 30px',
        borderRadius: '5px',
        border: 'none',
        fontSize: '18px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        marginTop: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    disabledButton: {
        backgroundColor: '#a5c3d6',
        cursor: 'not-allowed'
    },
    spinner: {
        marginTop: '20px'
    }
};

export default SendWidget;
