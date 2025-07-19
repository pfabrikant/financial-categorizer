
import React, { useState } from 'react';
import { Button, Form, ListGroup, Modal } from 'react-bootstrap';

interface CategoryManagerProps {
  categories: any;
  setCategories: (categories: any) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, setCategories }) => {
  const [show, setShow] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const addCategory = () => {
    if (newCategory && !categories[newCategory]) {
      setCategories({ ...categories, [newCategory]: [] });
      setNewCategory('');
    }
  };

  const addSubCategory = () => {
    if (selectedCategory && newSubCategory && !categories[selectedCategory].includes(newSubCategory)) {
      const updatedCategories = { ...categories };
      updatedCategories[selectedCategory].push(newSubCategory);
      setCategories(updatedCategories);
      setNewSubCategory('');
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Manage Categories
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Manage Categories</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {Object.keys(categories).map(category => (
              <ListGroup.Item key={category}>
                <h5>{category}</h5>
                <ul>
                  {categories[category].map((subCategory: string) => (
                    <li key={subCategory}>{subCategory}</li>
                  ))}
                </ul>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <hr />
          <h5>Add New Category</h5>
          <Form.Control
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New Category Name"
          />
          <Button onClick={addCategory} className="mt-2">Add Category</Button>
          <hr />
          <h5>Add New Sub-Category</h5>
          <Form.Select onChange={(e) => setSelectedCategory(e.target.value)}>
            <option>Select Category</option>
            {Object.keys(categories).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Form.Select>
          <Form.Control
            type="text"
            value={newSubCategory}
            onChange={(e) => setNewSubCategory(e.target.value)}
            placeholder="New Sub-Category Name"
            className="mt-2"
          />
          <Button onClick={addSubCategory} className="mt-2">Add Sub-Category</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CategoryManager;
