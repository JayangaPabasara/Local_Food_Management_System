import React, { useContext, useState } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import FoodFilter from "../FoodFilter/FoodFilter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FoodDisplay = ({ category, searchTerm, setSearchTerm }) => {
  const { food_list } = useContext(StoreContext);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [noMatchMessage, setNoMatchMessage] = useState("");

  const filteredFoodList = food_list.filter((item) => {
    const matchesCategory = category === "All" || category === item.category;
    const matchesSearchTerm = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPrice =
      (minPrice === "" || item.price >= minPrice) &&
      (maxPrice === "" || item.price <= maxPrice);

    return matchesCategory && matchesSearchTerm && matchesPrice;
  });

  React.useEffect(() => {
    if (filteredFoodList.length === 0 && searchTerm) {
      setNoMatchMessage("Your search does not match any item.");
    } else {
      setNoMatchMessage("");
    }
  }, [filteredFoodList, searchTerm]);

  return (
    <div className="food-display" id="food-display">
      <FoodFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
      />
      <h2>Top Dishes Near You</h2>

      {noMatchMessage && (
        <div className="no-match-message">{noMatchMessage}</div>
      )}

      <div className="food-display-list">
        {filteredFoodList.map((item, index) => (
          <FoodItem
            key={index}
            id={item._id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
            unit={item.unit}
            quantity={item.quantity}
          />
        ))}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition:Bounce
      />
    </div>
  );
};

export default FoodDisplay;
