import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './dashboard';
import User from './page/user/User';
import Question from './page/question/Question';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard/>}>
          <Route path='user' element={<User/>}/>
          <Route path='question' element={<Question/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
