import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import './css/Cart.css';
import { auth, db, logout } from "./firebase";
import {Card, ListGroup, ListGroupItem, Button, Toast} from "react-bootstrap";
import * as firestore from 'firebase/firestore';
import { query, collection, getDocs, where, getDoc, doc,  setDoc } from "firebase/firestore";
import { async } from "@firebase/util";
  function Cart() {
     const [user, loading, error] = useAuthState(auth);
     const [name, setName] = useState("");
     const [total, setTotal] = useState(0);
     const [count, setCount] = useState(0);
     const [arra, setArra] = useState([]);
     const [show, setShow] = useState(false);
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
      if (loading) return ;
      if (!user) return navigate("/");
      fetchUserName();
      carts();
    }, [user, loading]);
    
    const carts = async () => {
        try{
          setArra([]);
          setTotal(0);
          setCount(0);
            firestore.getDocs(firestore.collection(db, "users/" + user?.uid + "/cart")).then(async (snapshot) => {
                snapshot.forEach(async function(val){
                    if(val.data().quantity > 0){
                        const doc3 = await getDoc(doc(db, "products", val.id));
                        setArra(arra => [...arra,{id:doc3.id,
                            name:doc3.data().name,
                            img:doc3.data().img,
                            descr:doc3.data().descr,
                            quantity:val.data().quantity,
                            price:doc3.data().price
                        }]);
                        setTotal(total => total+doc3.data().price);
                        setCount(count => count+val.data().quantity);
                    }
                })
            })
        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
        }
    };

    const purchase = async () => {
      carts();
      firestore.getDocs(firestore.collection(db, "users/" + user?.uid + "/cart")).then(async (snapshot) => {
        snapshot.forEach(async function(val){
          if(val.data().quantity > 0){
            await setDoc(doc(db, "users", user.uid, "cart",val.id), {
              quantity: 0
            });
          }
        })
      })
      setShow(true);
      const timer = setTimeout(() => {
        navigate("../Dashboard");
      }, 2000);
      return () => clearTimeout(timer);
    }

    const remove = async (val) => {
      await setDoc(doc(db, "users", user.uid, "cart",val), {
        quantity: 0
      });
      carts();
    }

    return (
      <div className="dashboard">
        <div className="products">
        {arra.map(v => {
            let x = 0;
            return (
              <div key={v.id + (x++)} className='prod'>
              <p>{v.name}</p>
                <img src={v.img} alt="Logo" width='250vh'/>
                <div>{v.descr}</div>
                <p>
                  Price: {v.price}
                </p>
                <p>
                  Quantity: {v.quantity}
                </p>
                <Button variant="warning" key={v.id} onClick={() => remove(v.id)}>Remove</Button>
              </div>
            );
          })}

       </div>
       <Toast className="d-inline-block m-1" onClose={() => setShow(false)} show={show} delay={3000} autohide>
        <Toast.Header>
          Purchase Completed!
        </Toast.Header>
        <Toast.Body>
          You will recieve a notification
        </Toast.Body>
      </Toast>

       <div className="dashboard__container">
         
         <div>Hi! {name}</div>
         <div>{user?.email}</div>
         <button className="dashboard__btn" onClick={logout}>
          Logout
         </button>
       </div>
       <Card>
          <ListGroup className="list-group-flush">
            <ListGroupItem>Number of Items:<span className="values">{count}</span></ListGroupItem>
            <ListGroupItem>Total(with tax): <span className="values">{parseFloat(total*1.12).toFixed(2)}</span></ListGroupItem>
            <Button variant="primary" onClick={purchase}>Buy</Button>
          </ListGroup>
        </Card>
     </div>
  );
}
export default Cart;
