import AdminDashboard from "pages/Admin/AdminDashboard";
import AllProducts from "pages/Admin/components/AllProducts";
import AllBrands from "pages/Admin/components/AllBrands";
import AddProduct from "pages/Admin/components/AddProduct";
import AllCategory from "pages/Admin/components/AllCategory";


const adminDashboardRoute  =  {
    path :"/auth/admin/dashboard", element: <AdminDashboard/>,
    children: [
      {path :"products", element: <AllProducts />},
      {path :"add-product", element: <AddProduct/>},
      {path :"update-product/:id", element: <AddProduct/>},
      {path :"categories", element: <AllCategory/>},
      {path :"brands", element: <AllBrands/>}
    ]
  }


export default adminDashboardRoute;