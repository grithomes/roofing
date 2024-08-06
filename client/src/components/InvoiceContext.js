// // InvoiceContext.js
// import { createContext, useContext, useState } from 'react';

// const InvoiceContext = createContext();


// export const InvoiceProvider = ({ children }) => {
//     const [teammember, setTeammember] = useState([]);

//     const addTeam = (team) => {
//         setTeammember([...teammember, team]);
//     };

//     return (
//         <InvoiceProvider value={{ teammember, addTeam }}>
//             {children}
//         </InvoiceProvider>
//     );
// };
// export const useInvoiceContext = () => useContext(InvoiceContext);
