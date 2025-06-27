import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './dashboard';
import User from './page/user/User';
import Question from './page/question/Question';
import Discount from './page/discounts/Discount';
import Tickets from './page/ticket/tickets';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard/>}>
          <Route path='user' element={<User/>}/>
          <Route path='question' element={<Question/>}/>
          <Route path='discount' element={<Discount/>}/>
          <Route path='tickets' element={<Tickets/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
