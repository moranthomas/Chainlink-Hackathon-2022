import  React from 'react';
import { Link } from 'react-router-dom';
import flemingLogo from '../Fleming1.png';
import { Route } from 'react-router-dom';
import SubmitResearch from './SubmitResearch.js';
import RequestAccess from './RequestAccess.js';

export default function Navbar(props) {
    const saved_props = props;
    return (
        <header style={headerStyle}>
            <div style={centerFlex}>
            <Link to="/submitResearch">
                <img src={flemingLogo} style={logoStyle} alt=''/>
                </Link>
            </div>
            <div>
                <Link style={linkStyle} to="/submitResearch"> Submit Research </Link>
                | <Link style={linkStyle} to="/requestAccess"> Request Data Access </Link>

                {/* <Route path="/" component={Home} /> */}
                {/* <Route path="/home" component={Home} /> */}
                <Route path="/submitResearch" render={(props) => (
                    <SubmitResearch {...props} {...saved_props}
                        accounts={saved_props.userAccounts}
                    />
                )}/>
                <Route path="/requestAccess" component={RequestAccess} />

            </div>
            <div style={blockchainInfoStyle}>
                <table><tbody>
                <tr><td style = {accountsStyle}>Account: </td><td>{props.displayAccount}</td></tr>
                <tr><td style = {accountsStyle}>Network ID: </td><td>{props.networkId}</td></tr>
                <tr><td style = {accountsStyle}>Chain ID: </td><td>{props.chainId}</td></tr>
                <tr><td style = {accountsStyle}>ETH Balance: </td><td>{props.balanceInEth}</td></tr>
                <tr><td style = {accountsStyle}>Fleming Balance: </td><td>{props.flemingTokenBalance}</td></tr>
                <tr><td style = {accountsStyle}>Reputation: </td><td>{props.reputationScore}</td></tr>
                </tbody></table>
            </div>

        </header>
    )
}

const accountsStyle = { fontSize: 16, marginBottom: '15px', textAlign: 'right' };

const blockchainInfoStyle = {
    position: 'fixed',
    top: '15%',
    right: '10%',
    color: '#372b25',
}

const centerFlex = {
    position: 'fixed',
    top: '7%',
    left: '8%',
    transform: 'translate( -50%)',
    width: '120px'
}

const logoStyle = {
    textAlign: 'left',
    padding: '0px',
    paddingLeft: '30px',
    float: 'left',
    width: '210px'
}

const headerStyle = {
    background: '#372b25',
    color: '#fff',
    textAlign: 'center',
    padding: '40px',
    marginTop: '40px',
    boxShadow: 'var(--box-shadow)',
    display: 'flex',
    justifyContent: 'space-between'
}

const linkStyle = {
    fontSize: '20px',
    color: '#fff',
    textDecoration: 'none',
    marginLeft: '20px',
    marginRight: '20px'
}
