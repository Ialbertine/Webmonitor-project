import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/Landingpage";
import Homepage from "./Dashboard/Homepage";
import CreateWebsite from "./Dashboard/CreateWebsite";
import AllWebsites from "./Dashboard/All_websites";
import Settings from "./Dashboard/Setting";
import Layout from "./Dashboard/layout/Layout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route path="homepage" element={<Homepage />} />
          <Route
            path="create_website"
            element={
              <CreateWebsite
                onSubmit={(newData) => {
                  console.log(newData);
                }}
                onCancel={() => {
                  console.log("Cancelled");
                }}
              />
            }
          />
          <Route path="all_websites" element={<AllWebsites />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
