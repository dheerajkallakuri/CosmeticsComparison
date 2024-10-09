import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import CosmeticsList from './CosmeticsList';

function App() {
  const [cosmetics, setCosmetics] = useState([]);
  const [Ingredients, setIngredients] = useState(null);
  const [CosmeticName, setCosmeticName] = useState(null);

  // Fetch cosmetics data from the Flask backend
  useEffect(() => {
    axios.get('https://cosmeticscomparison-backend.onrender.com/api/cosmetics')
      .then(response => {
        setCosmetics(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  // Fetch ingredients when the button is clicked
  const handleViewIngredients = (id) => {
    axios.get(`https://cosmeticscomparison-backend.onrender.com/api/cosmetics/ingredients?id=${id}`)
      .then(response => {
        setIngredients(response.data.Ingredients);
        setCosmeticName(response.data.Name)
      })
      .catch(error => {
        console.error("There was an error fetching the ingredients!", error);
      });
  };

  return (
    <div className="App">
      <CosmeticsList 
        cosmetics={cosmetics} 
        handleViewIngredients={handleViewIngredients} 
        Ingredients={Ingredients} 
        CosmeticName={CosmeticName} 
        setIngredients={setIngredients} 
      />
    </div>
  );
}

export default App;
