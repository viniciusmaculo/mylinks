import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home";
import { Profile } from "../pages/profile";
import { Admin } from "../pages/admin";
import { Register } from "../pages/register";
import { Login } from "../pages/login";
import { Networks } from "../pages/admin/networks";
import { Error } from "../pages/error";

import { Private } from "./private";

const router = createBrowserRouter( [
            {
                path: '/',
                element: <Home/>
            },
            {
                path: '/:username',
                element: <Profile/>
            },
            {
                path: '/admin',
                element: <Private><Admin/></Private>
            },
            {
                path: '/registro',
                element: <Register/>
            },
            {
                path: '/login',
                element: <Login/>
            },
            {
                path: '/admin/social',
                element: <Private><Networks/></Private>
            },
            {
                path: '/404',
                element: <Error/>
            },
            {
                path: '/*',
                element: <Error/>
            }
        ],
        
)

export {router}
   