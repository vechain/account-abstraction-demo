import React, { useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

function WithdrawButton() {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                'http://localhost:3001/vthoWithdrawAll',
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
            console.log(response.data);
            // Handle the response data as needed
        } catch (error) {
            console.error('Error during withdraw:', error);
            // Handle error as needed
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <button 
                onClick={handleClick} 
                disabled={isLoading}
                style={{ ...styles.button, ...(isLoading ? styles.disabledButton : {}) }}
            >
                {isLoading ? 'Withdrawring...' : 'Withdraw All VTHO'}
            </button>
            {isLoading && <div style={styles.spinner}><ClipLoader color="#FFFFFF" /></div>}
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0px'
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
        marginTop: '10px'
    },
    disabledButton: {
        backgroundColor: '#a5c3d6',
        cursor: 'not-allowed'
    },
    spinner: {
        marginTop: '20px'
    }
};

export default WithdrawButton;
