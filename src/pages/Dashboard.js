import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import './css/Dashboard.css';
import { auth, db, logout } from "./firebase";
import * as firestore from 'firebase/firestore';
import { query, collection, getDocs, where } from "firebase/firestore";

function addToCart(quant){
  console.log(quant);
}

  function Dashboard() {
     const [user, loading, error] = useAuthState(auth);
     const [name, setName] = useState("");
     const [arra, setArra] = useState([]);
     const navigate = useNavigate();
     const fetchUserName = async () => {
       try {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
        setName(data.name);
      } catch (err) {
        console.error(err);
        alert("An error occured while fetching user data");
      }
    };
    
    useEffect(() => {
      if (loading) return;
      if (!user) return navigate("/");
      fetchUserName();
    }, [user, loading]);
    
    useEffect(() => { 
      firestore.getDocs(firestore.collection(db, "products")).then((snapshot) => {
        setArra(snapshot.docs.map(doc => ({id:doc.id,
           name:doc.data().name, 
           price:doc.data().price, 
           descr:doc.data().descr,
           img:doc.data().img,
           quantity:doc.data().quantity})))
      })
    }, []);

    return (
      <div className="dashboard">
        <div className="products">
        {arra.map(v => {
            return (
              <div key={v.id} className='prod'>
                <img src={v.img} alt="Logo" width='250vh'/>
                <div>{v.descr}</div>
                <p>
                  <span className="price">Price: {v.price}</span>
                  <span className="quantity">Quantity: {v.quantity}</span>
                </p>
                <button type="button" className="btn btn-outline-secondary">Add To Cart</button>
              </div>
            );
          })}

       </div>
       <div className="dashboard__container">
         
         <div>Hi! {name}</div>
         <div>{user?.email}</div>
         <button className="dashboard__btn" onClick={logout}>
          Logout
         </button>
       </div>
     </div>
  );
}
export default Dashboard;
