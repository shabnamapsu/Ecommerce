import React from 'react'
import Navbaar from './Navbaar'
import AdminPart from './AdminPart'
import Shops from '../shops/Shops'


function AdminComponent() {
  return (
    <>
    <div>
        <Navbaar/>
         <Shops/>
        <AdminPart/>
       
        
    </div>
    </>
  )
}

export default AdminComponent