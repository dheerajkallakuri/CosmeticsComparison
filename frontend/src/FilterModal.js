import React, { useState } from "react";

const FilterModal = ({
  isOpen,
  onClose,
  onApply,
  availableTypes,
  availableBrands,
  skinTypes,
  selectedSortOption,
  setSortOption,
  filterTypes,
  setFilterTypes,
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [isSkinTypeFilterOpen, setIsSkinTypeFilterOpen] = useState(false);
  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  const handleTypeFilterChange = (type) => {
    setFilterTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSkinTypeFilterChange = (skintype) => {
    setFilterTypes((prev) =>
      prev.includes(skintype) ? prev.filter((st) => st !== skintype) : [...prev, skintype]
    );
  };

  const handleBrandFilterChange = (brand) => {
    setFilterTypes((prev) =>
      prev.includes(brand) ? prev.filter((st) => st !== brand) : [...prev, brand]
    );
  };

  const handlePriceRangeChange = (e) => {
    const value = e.target.value;
    setSelectedPriceRange(value);

    // Update filterTypes with the selected price range value
    setFilterTypes((prevTypes) => {
      // Remove any existing price range filter in filterTypes
      const updatedTypes = prevTypes.filter((type) => !type.includes('price'));

      // Add the new selected price range
      return [...updatedTypes, `price:${value}`];
    });
  };

  // Filter brands based on the search term
  const filteredBrands = availableBrands.filter((brand) =>
    brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleApply = () => {
    onApply();
    onClose();
  };

  return (
    isOpen && (
      <div className="filters-modal-overlay">
        <div className="filters-modal-content">
          <h2 className="filter-and-sort">
            <span className="title">Filters & Sort</span>
            <button className="close-button" onClick={onClose}>
              &times;
            </button>
          </h2>

          <div className="filters-options-scroll-container">
            <div className="sort-options">
              <div onClick={() => setIsSortOpen(!isSortOpen)} className="expandable-row">
                <h3>Sort by:</h3>
                <span>{isSortOpen ? ">" : "v"}</span>
              </div>
              {isSortOpen && (
                <select
                  value={selectedSortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="affordance">Relevance</option>
                  <option value="price_low_to_high">Price: Low to High</option>
                  <option value="price_high_to_low">Price: High to Low</option>
                </select>
              )}
            </div>

            <div className="filter-options">
              <div
                onClick={() => setIsTypeFilterOpen(!isTypeFilterOpen)}
                className="expandable-row"
              >
                <h3>Type:</h3>
                <span>{isTypeFilterOpen ? ">" : "v"}</span>
              </div>
              {isTypeFilterOpen && (
                <table className="checkbox-table">
                  <tbody>
                    {Array.from(
                      { length: Math.ceil(availableTypes.length / 3) },
                      (_, rowIndex) => (
                        <tr key={rowIndex}>
                          {availableTypes
                            .slice(rowIndex * 3, rowIndex * 3 + 3)
                            .map((type, index) => (
                              <td key={index} style={{ padding: "10px" }}>
                                <input
                                  type="checkbox"
                                  id={type}
                                  value={type}
                                  checked={filterTypes.includes(type)}
                                  onChange={() => handleTypeFilterChange(type)}
                                />
                                <label htmlFor={type}>{type}</label>
                              </td>
                            ))}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}
            </div>

            <div className="filter-options">
              <div
                onClick={() => setIsSkinTypeFilterOpen(!isSkinTypeFilterOpen)}
                className="expandable-row"
              >
                <h3>Skin Type:</h3>
                <span>{isSkinTypeFilterOpen ? ">" : "v"}</span>
              </div>
              {isSkinTypeFilterOpen && (
                <table className="checkbox-table">
                  <tbody>
                    {Array.from(
                      { length: Math.ceil(skinTypes.length / 3) },
                      (_, rowIndex) => (
                        <tr key={rowIndex}>
                          {skinTypes
                            .slice(rowIndex * 3, rowIndex * 3 + 3)
                            .map((skintype, index) => (
                              <td key={index} style={{ padding: "10px" }}>
                                <input
                                  type="checkbox"
                                  id={skintype}
                                  value={skintype}
                                  checked={filterTypes.includes(skintype)}
                                  onChange={() => handleSkinTypeFilterChange(skintype)}
                                />
                                <label htmlFor={skintype}>{skintype}</label>
                              </td>
                            ))}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}
            </div>

            <div className="brand-options">
              <div onClick={() => setIsBrandOpen(!isBrandOpen)} className="expandable-row">
                <h3>Brand:</h3>
                <span>{isBrandOpen ? ">" : "v"}</span>
              </div>
              {isBrandOpen && (
                <div className="brand-filter">
                  <input
                    type="text"
                    placeholder="Search brand"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="brand-search-input"
                  />
                  {filteredBrands.length > 0 ? (
                    <div className="brand-scroll-container">
                      <table className="brand-checkbox-table">
                        <tbody>
                          {Array.from(
                            { length: Math.ceil(filteredBrands.length / 3) },
                            (_, rowIndex) => (
                              <tr key={rowIndex}>
                                {filteredBrands
                                  .slice(rowIndex * 4, rowIndex * 4 + 4)
                                  .map((brand, index) => (
                                    <td key={index} style={{ padding: "10px" }}>
                                      <input
                                        type="checkbox"
                                        id={`brand-${brand}`}
                                        value={`brand-${brand}`}
                                        checked={filterTypes.includes(`brand-${brand}`)}
                                        onChange={() => handleBrandFilterChange(`brand-${brand}`)}
                                      />
                                      <label htmlFor={`brand-${brand}`}>{brand}</label>
                                    </td>
                                  ))}
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>

                  ) : (
                    <div className="no-results">
                      No results.{" "}
                      <button onClick={handleClearSearch} className="clear-button">
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="filter-options">
              <div onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)} className="expandable-row">
                <h3>Price Range:</h3>
                <span>{isPriceFilterOpen ? '>' : 'v'}</span>
              </div>
              {isPriceFilterOpen && (
                <div className="price-options">
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <input
                            type="radio"
                            id="pl=min_ph=25"
                            name="price"
                            value="pl=min_ph=25"
                            checked={selectedPriceRange === 'pl=min_ph=25'}
                            onChange={handlePriceRangeChange}
                          />
                          <label htmlFor="pl=min_ph=25">Under $25</label>
                        </td>
                        <td>
                          <input
                            type="radio"
                            id="pl=25_ph=50"
                            name="price"
                            value="pl=25_ph=50"
                            checked={selectedPriceRange === 'pl=25_ph=50'}
                            onChange={handlePriceRangeChange}
                          />
                          <label htmlFor="pl=25_ph=50">$25 to $50</label>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="radio"
                            id="pl=50_ph=100"
                            name="price"
                            value="pl=50_ph=100"
                            checked={selectedPriceRange === 'pl=50_ph=100'}
                            onChange={handlePriceRangeChange}
                          />
                          <label htmlFor="pl=50_ph=100">$50 to $100</label>
                        </td>
                        <td>
                          <input
                            type="radio"
                            id="pl=100_ph=max"
                            name="price"
                            value="pl=100_ph=max"
                            checked={selectedPriceRange === 'pl=100_ph=max'}
                            onChange={handlePriceRangeChange}
                          />
                          <label htmlFor="pl=100_ph=max">$100 and above</label>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>





          <div className="modal-buttons">
            <button
              className="reset-button"
              onClick={() => {
                setFilterTypes([]);
                setSortOption("affordance");
                setSelectedPriceRange("");
              }}
            >
              Clear All
            </button>
            <button className="apply-button" onClick={handleApply}>
              Show Results
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default FilterModal;
