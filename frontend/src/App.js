import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import CosmeticsList from './CosmeticsList';
import FilterModal from "./FilterModal";

function App() {
  const [cosmetics, setCosmetics] = useState([]);
  const [Ingredients, setIngredients] = useState(null);
  const [CosmeticName, setCosmeticName] = useState(null);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [sortOption, setSortOption] = useState("affordance");
  const [filterTypes, setFilterTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const skinTypes = ["Combination", "Dry", "Normal", "Oily", "Sensitive"];
  const [showButton, setShowButton] = useState(false);

  // Fetch cosmetics data from the Flask backend
  useEffect(() => {
    fetchAvailableTypes();
    fetchAvailableBrands();
    fetchCosmetics();
    const handleScroll = () => {
      if (window.scrollY > 300) { // Show button when scrolled more than 300px
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scrolling animation
    });
  };

  const fetchAvailableTypes = () => {
    axios
      .get("https://cosmeticscomparison-backend.onrender.com/api/cosmetics/types")
      .then((response) => setAvailableTypes(response.data))
      .catch((error) => console.error("Error fetching types:", error));
  };

  const fetchAvailableBrands = () => {
    axios
      .get("https://cosmeticscomparison-backend.onrender.com/api/cosmetics/brands")
      .then((response) => setAvailableBrands(response.data))
      .catch((error) => console.error("Error fetching brands:", error));
  };

  const fetchCosmetics = () => {

    const typesQuery = filterTypes
      .map(type => {
        if (skinTypes.includes(type)) {
          return `skintype=${type}`;
        } else if (type.includes('price')) {
          return `price=${type}`;
        } else if (type.includes('brand')) {
          return `brand=${type}`;
        } else {
          return `type=${type}`;
        }
      })
      .join("&");

    axios
      .get(
        `https://cosmeticscomparison-backend.onrender.com/api/cosmetics?sort=${sortOption}&${typesQuery}`
      )
      .then((response) => {
        setCosmetics(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleApplyFilters = () => {
    fetchCosmetics();
    handleCloseModal();
  };


  return (
    <div className="App">
      <h1>Cosmetics Kart</h1>

      <button className="filter-button" onClick={handleOpenModal}>
        Filters
      </button>

      <FilterModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onApply={handleApplyFilters}
        availableTypes={availableTypes}
        availableBrands={availableBrands}
        skinTypes={skinTypes}
        selectedSortOption={sortOption}
        setSortOption={setSortOption}
        filterTypes={filterTypes}
        setFilterTypes={setFilterTypes}
      />

      <p>{cosmetics.length} results found</p>

      <CosmeticsList
        cosmetics={cosmetics}
        handleViewIngredients={handleViewIngredients}
        Ingredients={Ingredients}
        CosmeticName={CosmeticName}
        setIngredients={setIngredients}
      />

      {/* Back to Top Button */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className="backToTopButton"
        >
          Back to Top
        </button>
      )}
    </div>
  );
}

export default App;
