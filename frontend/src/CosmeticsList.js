import React from "react";

function CosmeticsList({
  cosmetics,
  handleViewIngredients,
  Ingredients,
  CosmeticName,
  setIngredients,
}) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Brand</th>
            <th>Name</th>
            <th>Price</th>
            <th>Ingredients</th>
          </tr>
        </thead>
        <tbody>
          {cosmetics.map((cosmetic, index) => (
            <tr key={index}>
              <td>{cosmetic.Label}</td>
              <td>{cosmetic.Brand}</td>
              <td>{cosmetic.Name}</td>
              <td>${cosmetic.Price}</td>
              <td>
                <button
                  className="view-ingredients-button"
                  onClick={() => handleViewIngredients(`${cosmetic.id}`)}
                >
                  View Ingredients
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Show Ingredients Modal */}
      {Ingredients && (
        <div className="ingredients-modal">
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => setIngredients(null)}
              title="Close"
            >
              ✖️
            </button>
            <h3>Ingredients of {CosmeticName}</h3>
            <p>{Ingredients}</p>{" "}
            {/* Display the ingredients as a single string */}
            <table className="table-footer">
              <tr>
                <td>
                  <button
                    className="copy-button"
                    onClick={() => navigator.clipboard.writeText(Ingredients)} // Copy the entire string
                    title="Copy"
                    style={{ marginTop: "10px" }}
                  >
                    📋 Copy Ingredients
                  </button>
                </td>
              </tr>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default CosmeticsList;
