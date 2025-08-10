import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Login } from './views/Login';
import { SessionProvider } from './contexts/SessionContext';
import { Users } from './views/Users';
import { LayoutUser } from './views/LayoutUser';
import { RegisterSubjects } from './views/RegisterSubjects';
import { ChangePassword } from './views/ChangePassword';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/changePassword' element={<ChangePassword />} />
          <Route path='/layoutUser' element={<LayoutUser />}>
            <Route path='/layoutUser/users' element={<Users />} />
            <Route path='/layoutUser/registerSubjects' element={<RegisterSubjects />} />
          </Route>
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  </StrictMode>,
)
