import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import CartPage from "./components/CartPage";
import CursorGradient from "./components/CursorGradient";
import ProductDetailPage from "./components/ProductDetailPage";
import CollectionPage from "./pages/CollectionPage";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <CursorGradient />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/collections/:type/:value" element={<CollectionPage />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
