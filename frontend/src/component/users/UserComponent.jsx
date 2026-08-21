import React from 'react'
import UserNav from '../UserNav'
import AdminPart from '../admin/AdminPart'
import ShopcreateAdd from '../shops/ShopcreateAdd'
import ShopDetails from '../shops/ShopDetails'
import ShopList from '../shops/Shoplist'
import Shops from '../shops/Shops'
import UserSlider from './UserSlider'
import Footer from '../Footer'

function UserComponent() {
  return (
    <div>
<UserNav/>
<Shops/>
<UserSlider/>
{/* <ShopcreateAdd/> */}
{/* <ShopDetails/> */}
{/* <ShopList/> */}
<AdminPart/>
<Footer/>
    </div>
  )
}

export default UserComponent