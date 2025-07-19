
import React, { useState } from 'react';
import { Navbar, Container, Row, Col, Spinner, Button, ButtonGroup, Form } from 'react-bootstrap';
import FileUpload from './components/FileUpload';
import TransactionTable from './components/TransactionTable';
import CategoryManager from './components/CategoryManager';
import BreakdownList from './components/BreakdownList';
import BreakdownChart from './components/BreakdownChart';
import { suggestCategory } from './services/categorize';

function App() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState({
    'Wohnen': ['Miete', 'Nebenkosten'],
    'Lebensmittel': ['Supermarkt', 'Bäckerei'],
    'Transport': ['Tanken', 'Öffentliche Verkehrsmittel'],
    'Freizeit': ['Restaurant', 'Kino', 'Konzert'],
    'Einkommen': ['Gehalt', 'Sonstige Einnahmen']
  });
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('list'); // list or chart
  const [timeframe, setTimeframe] = useState('all'); // all, monthly, quarterly, yearly

  const handleFileUpload = async (data: any[]) => {
    setLoading(true);
    const categorizedTransactions = await Promise.all(
      data.map(async (item) => {
        const suggestion = await suggestCategory(item.Beschreibung || '', categories);
        return { ...item, ...suggestion, date: new Date(item.Datum) };
      })
    );
    setTransactions(categorizedTransactions);
    setLoading(false);
  };

  const handleCategoryChange = (index: number, category: string, subCategory: string) => {
    const updatedTransactions = [...transactions];
    updatedTransactions[index].category = category;
    updatedTransactions[index].subCategory = subCategory;
    setTransactions(updatedTransactions);
  };

  const getFilteredTransactions = () => {
    if (timeframe === 'all') {
      return transactions;
    }
    const now = new Date();
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      if (isNaN(transactionDate.getTime())) return false;

      switch (timeframe) {
        case 'monthly':
          return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
        case 'quarterly':
          const currentQuarter = Math.floor(now.getMonth() / 3);
          const transactionQuarter = Math.floor(transactionDate.getMonth() / 3);
          return transactionQuarter === currentQuarter && transactionDate.getFullYear() === now.getFullYear();
        case 'yearly':
          return transactionDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  };
  
  const filteredTransactions = getFilteredTransactions();

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Financial Categorizer</Navbar.Brand>
        </Container>
      </Navbar>
      <Container className="mt-4">
        {loading && <Spinner animation="border" />}
        {transactions.length === 0 && !loading ? (
          <FileUpload onFileUpload={handleFileUpload} />
        ) : (
          !loading && (
            <>
              <Row>
                <Col md={3}>
                  <CategoryManager categories={categories} setCategories={setCategories} />
                </Col>
                <Col md={9}>
                  <TransactionTable
                    transactions={transactions}
                    categories={categories}
                    onCategoryChange={handleCategoryChange}
                  />
                </Col>
              </Row>
              <Row className="mt-4">
                <Col>
                  <h2>Breakdown</h2>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <ButtonGroup>
                      <Button variant={view === 'list' ? 'primary' : 'secondary'} onClick={() => setView('list')}>List</Button>
                      <Button variant={view === 'chart' ? 'primary' : 'secondary'} onClick={() => setView('chart')}>Chart</Button>
                    </ButtonGroup>
                    <Form.Select style={{ width: '200px' }} onChange={(e) => setTimeframe(e.target.value)} value={timeframe}>
                      <option value="all">All Time</option>
                      <option value="monthly">This Month</option>
                      <option value="quarterly">This Quarter</option>
                      <option value="yearly">This Year</option>
                    </Form.Select>
                  </div>
                  {view === 'list' ? (
                    <BreakdownList transactions={filteredTransactions} />
                  ) : (
                    <BreakdownChart transactions={filteredTransactions} />
                  )}
                </Col>
              </Row>
            </>
          )
        )}
      </Container>
    </div>
  );
}

export default App;
