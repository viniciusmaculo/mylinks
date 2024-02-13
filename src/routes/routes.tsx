import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Profile } from "../pages/profile";
import { Admin } from "../pages/admin";
import { Register } from "../pages/register";
import { Login } from "../pages/login";
import { Networks } from "../pages/admin/networks";
import { Error } from "../pages/error";

import { Private } from "./private";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:username" element={<Profile />} />
        <Route path="/admin" element={<Private><Admin/></Private>} />
        <Route path="/registro" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/social" element={<Private><Networks/></Private>} />
        <Route path="/404" element={<Error />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

   