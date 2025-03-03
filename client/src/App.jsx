import { Suspense, useState } from "react";
import "./App.css";
import Layout from "./components/Layout/Layout";
import Website from "./pages/Website";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Properties from "./pages/Properties/Properties";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Property from "./pages/Property/Property";
import UserDetailContext from "./context/UserDetailContext";
import Bookings from "./pages/Bookings/Bookings";
import Favourites from "./pages/Favourites/Favourites";
import EditProfile from "./pages/ProfileUpdate/EditProfile";
import AdminLayout from "./components/AdminPageLayout/AdminLayout";
import DashboardMain from "./pages/DashboardMain/DashboardMain";
import UpdateProperty from "./pages/UpdateProperty/UpdateProperty";
import CustomerList from "./pages/CustomerList/CustomerList";
import AddAdmin from "./pages/AddRemoveAdmin/AddAdmin";

function App() {
  const queryClient = new QueryClient();

  const [userDetails, setUserDetails] = useState({
    favourites: [],
    bookings: [],
    token: null,
  });

  return (
    <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Website />} />
                <Route path="/properties">
                  <Route index element={<Properties />} />
                  <Route path=":propertyId" element={<Property />} />
                </Route>
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/favourites" element={<Favourites />} />
                <Route path="/dashboard" element={<AdminLayout />}>
                  <Route index element={<DashboardMain />} />
                  <Route path="/dashboard/update-property" element={<UpdateProperty />} />
                  <Route path="/dashboard/customers" element={<CustomerList />} />
                  <Route path="/dashboard/admins" element={<CustomerList admin />} />
                  <Route path="/dashboard/add-admin" element={<AddAdmin />} />
                </Route>
                <Route path="/profile" element={<EditProfile />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
        <ToastContainer />
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </UserDetailContext.Provider>
  );
}

export default App;
