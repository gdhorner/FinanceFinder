import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';

function App() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/transactions')
      .then(response => {
        setTransactions(response.data)
      })
  }, [])


  return (
    <div>
      <Header as='h2' icon='users' content='Transactions'/>
      <List>
        {transactions.map((transaction: any) => (
          <List.Item key={transaction.id}>
            {transaction.date} {transaction.name} {transaction.amount}
          </List.Item>
        ))}
      </List>
    </div>
    )
}

export default App
