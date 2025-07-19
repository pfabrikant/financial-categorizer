import React from 'react';
import { Table, Form } from 'react-bootstrap';

interface TransactionTableProps {
  transactions: any[];
  categories: any;
  onCategoryChange: (index: number, category: string, subCategory: string) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, categories, onCategoryChange }) => {
  if (transactions.length === 0) {
    return null;
  }

  const headers = Object.keys(transactions[0]);

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          {headers.map(header => <th key={header}>{header}</th>)}
          <th>Category</th>
          <th>Sub-Category</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction, index) => (
          <tr key={index}>
            {headers.map(header => <td key={header}>{transaction[header]}</td>)}
            <td>
              <Form.Select onChange={(e) => onCategoryChange(index, e.target.value, '')}>
                <option>Select Category</option>
                {Object.keys(categories).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Form.Select>
            </td>
            <td>
              {transaction.category && categories[transaction.category] && (
                <Form.Select onChange={(e) => onCategoryChange(index, transaction.category, e.target.value)}>
                  <option>Select Sub-Category</option>
                  {categories[transaction.category].map((subCategory: string) => (
                    <option key={subCategory} value={subCategory}>{subCategory}</option>
                  ))}
                </Form.Select>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TransactionTable;