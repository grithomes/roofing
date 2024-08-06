import React, { useEffect, useState } from 'react';

const CurrencySign = ({}) => {
    const [currencyType, setCurrencyType] = useState("");

useEffect(() => {
    const storedCurrencyType = localStorage.getItem("currencyType") || "INR";
    console.log("Stored Currency Type:", storedCurrencyType);
    setCurrencyType(storedCurrencyType);
}, [])

  const getCurrencySign = (currencyType) => {
    switch (currencyType) {
      case "AUD":
        return '$'; // Australian Dollar
      case "CAD":
        return 'C$'; // Canadian Dollar
      case "INR":
      default:
        return '₹'; // Indian Rupee
    }
  };

  return <>{getCurrencySign(currencyType)}</>;
};

export default CurrencySign;
