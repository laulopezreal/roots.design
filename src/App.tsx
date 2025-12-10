import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./components/home"));
const CartPage = lazy(() => import("./components/CartPage"));
const CursorGradient = lazy(() => import("./components/CursorGradient"));
const ProductDetailPage = lazy(() => import("./components/ProductDetailPage"));
const CollectionPage = lazy(() => import("./pages/CollectionPage"));
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
