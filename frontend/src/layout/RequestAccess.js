import React, { Component } from 'react'
import { Balance } from '../components/Balance.js';
import { TransactionList } from '../components/TransactionList';

export class Borrow extends Component {
    render() {
        return (
            <div className="container">
              <Balance />
              <TransactionList />
            </div>
        )
    }
}

export default Borrow
