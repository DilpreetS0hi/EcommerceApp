import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import './css/Contact.css';
import './css/Cart.css';
import {Button, Toast, Form} from "react-bootstrap";
import { auth, db, logout } from "./firebase";
import * as firestore from 'firebase/firestore';
import { query, collection, getDocs, where, addDoc} from "firebase/firestore";
import { async } from "@firebase/util";
  function Dashboard() {
     const [user, loading, error] = useAuthState(auth);
     const [name, setName] = useState("");
     const [show, setShow] = useState(false);
     const navigate = useNavigate();
     const [subject, setSubject] = useState("");
     const [message, setMessage] = useState("");
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

    const send = async () => {
      await addDoc(collection(db, "users", user.uid, "message"), {
        subject: subject,
        message: message
      })
      setShow(true);
      const timer = setTimeout(() => {
        navigate("../Dashboard");
      }, 2000);
      return () => clearTimeout(timer);
    }

    return (
    <div className="dashboard">

<Toast className="d-inline-block m-1" onClose={() => setShow(false)} show={show} delay={3000} autohide>
        <Toast.Header>
          Message Sent
        </Toast.Header>
        <Toast.Body>
          You will be contacted soon
        </Toast.Body>
      </Toast>

        <div className="products">
        <Form>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Subject</Form.Label>
          <Form.Control type="name" placeholder="Your Name" value={subject}
              onChange={e => setSubject(e.target.value)}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicIssue">
          <Form.Label>Message</Form.Label>
          <Form.Control as="textarea" rows={8} value={message}
              onChange={e => setMessage(e.target.value)}/>
        </Form.Group>
        <Button variant="primary" type="button" onClick={send}>
          Submit
        </Button>
      </Form>
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
