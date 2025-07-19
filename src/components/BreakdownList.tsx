
import React from 'react';
import { ListGroup } from 'react-bootstrap';

interface BreakdownListProps {
  transactions: any[];
}

const BreakdownList: React.FC<BreakdownListProps> = ({ transactions }) => {
  const breakdown = transactions.reduce((acc, transaction) => {
    const { category, subCategory, Betrag } = transaction;
    if (category && subCategory && Betrag) {
      if (!acc[category]) {
        acc[category] = {};
      }
      if (!acc[category][subCategory]) {
        acc[category][subCategory] = 0;
      }
      acc[category][subCategory] += parseFloat(Betrag);
    }
    return acc;
  }, {});

  return (
    <ListGroup>
      {Object.keys(breakdown).map(category => (
        <ListGroup.Item key={category}>
          <h5>{category}</h5>
          <ul>
            {Object.keys(breakdown[category]).map(subCategory => (
              <li key={subCategory}>
                {subCategory}: {breakdown[category][subCategory].toFixed(2)}
              </li>
            ))}
          </ul>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default BreakdownList;
