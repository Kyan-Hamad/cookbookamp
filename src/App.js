import "@aws-amplify/ui-react/styles.css";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import HomePage from "./Components/HomePage";
import DashBoard from "./Components/DashBoard";
import NewBookForm from "./Components/NewBookForm";
import BookDetails from "./Components/BookDetails";
import PageDetails from "./Components/PageDetails";

function App() {
return (
<>
<div>
<BrowserRouter>
<Navbar />
<Routes>
<Route path="/" element={withAuthenticator ? <DashBoard/> : <HomePage/>} />
<Route path="/dashboard" element={<DashBoard />} />
<Route path="/new-book" element={<NewBookForm />} />
<Route path="/books/:title" element={<BookDetails />} />
<Route path="/books/:title/:pageId" element={<PageDetails />} />
</Routes>
</BrowserRouter>
</div>
</>
);
}

  

export default withAuthenticator(App);