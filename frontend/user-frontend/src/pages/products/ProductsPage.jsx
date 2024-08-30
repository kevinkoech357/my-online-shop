import ProductGridWithSidebar from "../../components/products/ProductGridWithSidebar";

import productsData from "../../data/products.json";

const products = productsData;

const ProductsPage = () => {
	return <ProductGridWithSidebar products={products} />;
};

export default ProductsPage;
