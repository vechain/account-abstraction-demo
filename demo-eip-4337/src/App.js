import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import DepositFetcher from './DepositFetcher';
import AddressFetcher from './AddressFetcher';
import BalanceFetcher from './BalanceFetcher';
import DeployButton from './DeployButton';
import SendWidget from './SendButton';
import WithdrawButton from "./WithdrawButton";
import DepositButton from './DepositButton';
import ERC20Widget from './ERC20Button';

function App() {
  const [selectedWidget, setSelectedWidget] = useState('');
  const [shouldShowDeployButton, setShouldShowDeployButton] = useState(false);

  useEffect(() => {
    const fetchNonce = async () => {
      try {
        const response = await axios.post(
          'http://localhost:3001/nonce',
          {
            to: "0x94C576C6Fdf76EDdCA1e88e4A0169CDcc23e5539",
            amount: "0.01",
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

        if (response.data.result === "0x0") {
          setShouldShowDeployButton(true);
        }
      } catch (error) {
        console.error('Error fetching nonce:', error);
      }
    };

    fetchNonce();
  }, []);  // This ensures the effect runs only once when the component mounts.

  return (
    <div className="App" style={styles.container}>
        <h1 style={styles.header}>EIP-4337 Demo</h1>
        <AddressFetcher />
        <h1></h1>
        <BalanceFetcher />

        {shouldShowDeployButton && <DeployButton />}

        {!shouldShowDeployButton && (
            <div style={styles.dropdownContainer}>
                <select 
                    style={styles.dropdown}
                    value={selectedWidget} 
                    onChange={(e) => setSelectedWidget(e.target.value)}
                >
                    <option value="">Select a Widget</option>
                    <option value="send">Send</option>
                    <option value="erc20">ERC20 Send</option>
                </select>
            </div>
        )}

        {!shouldShowDeployButton && selectedWidget === 'send' && <SendWidget />}
        {!shouldShowDeployButton && selectedWidget === 'erc20' && <ERC20Widget />}
        
        {!shouldShowDeployButton && (
            <div style={styles.gasManagementContainer}>
                <h2 style={styles.gasManagementHeader}>Gas Management</h2>
                <WithdrawButton />
                <DepositButton />
            </div>
        )}
    </div>
);

}

const styles = {
    container: {
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#f7f9fc',
        height: '100vh'
    },
    header: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px'
    },
    dropdownContainer: {
        marginTop: '20px',
        marginBottom: '20px',
    },
    dropdown: {
        width: '300px',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '16px',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        transition: 'border 0.3s ease',
        outline: 'none',
    },
    gasManagementContainer: {
        marginTop: '20px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    gasManagementHeader: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '15px'
    }
};

export default App;
