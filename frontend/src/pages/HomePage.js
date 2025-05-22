import React, { useState } from 'react';
import "./HomePage.css";
import realimage from './real.jpg';
import houseimage from './high-view-toy-model-house-keys_23-2148301692.jpg';

const Homepage = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        console.log('Submitting feedback:', formData); // Debug log
        
        const response = await fetch('https://realestate-9evw.onrender.com/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        console.log('Response status:', response.status); // Debug log

        const result = await response.json();
        console.log('Response data:', result); // Debug log

        if (!response.ok) {
            throw new Error(result.message || 'Failed to submit feedback');
        }

        alert('Feedback submitted successfully!');

        // Clear form
        setFormData({
            name: '',
            email: '',
            message: ''
        });

    } catch (error) {
        console.error('Submission error:', error); // Debug log
        alert('Error submitting feedback: ' + error.message);
    }
  };


  const showSidebar = () => {
    document.getElementById('sidebar').style.display = 'flex';
  };

  const hideSidebar = () => {
    document.getElementById('sidebar').style.display = 'none';
  };

  return (
    <>
      <nav>
        <ul className="sidebar" id="sidebar">
          <li onClick={hideSidebar}>
            <a href="#!">
              <svg xmlns="https://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            </a>
          </li>
          <li><a href="#!">Home</a></li>
          <li><a href="/buyer">Buyers</a></li>
          <li><a href="/Advertise" >Advertise</a></li>
          <li><a href="/seller" >Sellers</a></li>
          <li><a href="/employee" >Employee</a></li>
          <li><a href="/admin" >Admin</a></li>
          <li><a href="/login" >Login</a></li>
        </ul>

        <ul className="desktop-menu">
          <li><a href="#!"><img src={realimage} alt="" width="60px" height="40px" />EstateCraft</a></li>
          <li className='hideOnMobile'><a href="/buyer">Buyers</a></li>
          <li className='hideOnMobile'><a href="/Advertise" >Advertise</a></li>
          <li className='hideOnMobile'><a href="/seller" >Sellers</a></li>
          <li className='hideOnMobile'><a href="/employee" >Employee</a></li>
          <li className='hideOnMobile'><a href="/admin" >Admin</a></li>
          <li className="hideOnMobile">
            <a href="/login" >
              <button className="si">
                <svg xmlns="https://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                  <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
                </svg>
                Login
              </button>
            </a>
          </li>
          <li className="menu-button" onClick={showSidebar}>
            <a href="#!">
              <svg xmlns="https://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
              </svg>
            </a>
          </li>
        </ul>
      </nav>

      <section className="home" id="home">
        <div className="content">
          <h3>Welcome to EstateCraft buy sell Advertise Properties</h3>
        </div>
      </section>

      <section className="about" id="about">
        <h1 className="heading">about us</h1>
        <div className="row">
          <div className="content">
            <h3>Our Mission: Place your trust.</h3>
            <ul>
              <li>We are students at IIIT Sri City, dedicated to offering you a platform where you can explore, buy, sell, and Advertise properties.</li>
              <li>We aim to not only promote real estate but also build a community of like-minded people.</li>
              <li>We are committed to helping you find your perfect property.</li>
              <li>Find your dream home with us! Real estate made easy. Buy, sell, rent—your perfect property awaits.<b>Let's make moves</b></li>
            </ul>
          </div>
          <div className="image">
            <img src={houseimage} alt="" />
          </div>
        </div>
      </section>

      <section className="feedback" id="feedback">
        <h1 className="heading">Feedback</h1>
        <div className="feedback-container">
          <form className="feedback-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn submit-btn">Submit Feedback</button>
          </form>
        </div>
      </section>


      <section className="footer">
        <div className="box-container">
          {/* Footer Boxes */}
          <div className="box">
            <h3>quick links</h3>
            <a href="#home">
              <svg xmlns="https://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20">
                <path d="m576-288-51-51 105-105H192v-72h438L525-621l51-51 192 192-192 192Z" />
              </svg> home
            </a>
            <a href="#about">
              <svg xmlns="https://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20">
                <path d="m576-288-51-51 105-105H192v-72h438L525-621l51-51 192 192-192 192Z" />
              </svg> about
            </a>
          </div>

          <div className="box">
            <h3>extra links</h3>
            <a href="#!">my account</a>
            <a href="#!">terms of use</a>
            <a href="#!">privacy policy</a>
          </div>

          <div className="box">
            <h3>contact info</h3>
            <a href="#!">+91 9963909924</a>
            <a href="#!">@iiits.in</a>
            <a href="#!">Sri City Andhra pradesh, 517646</a>
          </div>

          <div className="box">
            <h3>follow us</h3>
            <a href="#!">facebook</a>
            <a href="#!">twitter</a>
            <a href="#!">instagram</a>
            <a href="#!">linkedin</a>
            <a href="#!">github</a>
          </div>
        </div>

        <div className="credit">
          created by <span>EstateCraft reserved by Indian Institute of Information Technology SRI CITY</span> | All rights are reserved!
        </div>
      </section>
    </>
  );
};
// import React, { useState } from 'react';
// import "./HomePage.css";
// import realimage from './real.jpg';
// import houseimage from './high-view-toy-model-house-keys_23-2148301692.jpg';

// const Homepage = () => {
//   const [formData, setFormData] = useState({ name: '', email: '', message: '' });
//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch('https://realestate-9evw.onrender.com/api/feedback', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
//         body: JSON.stringify(formData)
//       });
//       const result = await res.json();
//       if (!res.ok) throw new Error(result.message || 'Failed to submit');
//       alert('Feedback submitted!');
//       setFormData({ name: '', email: '', message: '' });
//     } catch (err) {
//       alert('Error: ' + err.message);
//     }
//   };

//   const showSidebar = () => document.getElementById('sidebar').style.display = 'flex';
//   const hideSidebar = () => document.getElementById('sidebar').style.display = 'none';

//   return (
//     <>
//       <nav>
//         <ul className="sidebar" id="sidebar">
//           <li onClick={hideSidebar}><a href="#!"><svg height="24" width="24"><path d="M256-200l-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg></a></li>
//           {['Home', 'Buyers', 'Advertise', 'Sellers', 'Employee', 'Admin', 'Login'].map((item, i) => (
//             <li key={i}><a href={`/${item.toLowerCase()}`}>{item}</a></li>
//           ))}
//         </ul>

//         <ul className="desktop-menu">
//           <li><a href="#!"><img src={realimage} alt="" width="60" height="40" />EstateCraft</a></li>
//           {['Buyers', 'Advertise', 'Sellers', 'Employee', 'Admin'].map((item, i) => (
//             <li className="hideOnMobile" key={i}><a href={`/${item.toLowerCase()}`}>{item}</a></li>
//           ))}
//           <li className="hideOnMobile"><a href="/login"><button className="si">Login</button></a></li>
//           <li className="menu-button" onClick={showSidebar}><a href="#!"><svg height="24" width="24"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg></a></li>
//         </ul>
//       </nav>

//       <section className="home" id="home"><div className="content"><h3>Rama Krishna</h3></div></section>

//       <section className="about" id="about">
//         <h1 className="heading">about us</h1>
//         <div className="row">
//           <div className="content">
//             <h3>Our Mission: Place your trust.</h3>
//             <ul>
//               <li>Students at IIIT Sri City offering a real estate platform.</li>
//               <li>Promote real estate and build community.</li>
//               <li>Helping you find your perfect property.</li>
//               <li>Your dream home awaits. <b>Let's make moves</b></li>
//             </ul>
//           </div>
//           <div className="image"><img src={houseimage} alt="" /></div>
//         </div>
//       </section>

//       <section className="feedback" id="feedback">
//         <h1 className="heading">Feedback</h1>
//         <div className="feedback-container">
//           <form className="feedback-form" onSubmit={handleSubmit}>
//             {['name', 'email'].map((field, i) => (
//               <div className="form-group" key={i}>
//                 <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
//                 <input type={field === 'email' ? 'email' : 'text'} id={field} name={field} value={formData[field]} onChange={handleChange} required />
//               </div>
//             ))}
//             <div className="form-group">
//               <label htmlFor="message">Message</label>
//               <textarea id="message" name="message" value={formData.message} onChange={handleChange} required></textarea>
//             </div>
//             <button type="submit" className="btn submit-btn">Submit Feedback</button>
//           </form>
//         </div>
//       </section>

//       <section className="footer">
//         <div className="box-container">
//           <div className="box">
//             <h3>quick links</h3>
//             <a href="#home">home</a>
//             <a href="#about">about</a>
//           </div>
//           <div className="box">
//             <h3>extra links</h3>
//             <a href="#!">my account</a>
//             <a href="#!">terms</a>
//             <a href="#!">privacy</a>
//           </div>
//           <div className="box">
//             <h3>contact info</h3>
//             <a href="#!">+91 9963909924</a>
//             <a href="#!">@iiits.in</a>
//             <a href="#!">Sri City, AP</a>
//           </div>
//           <div className="box">
//             <h3>follow us</h3>
//             {['facebook', 'twitter', 'instagram', 'linkedin', 'github'].map((net, i) => (
//               <a key={i} href="#!">{net}</a>
//             ))}
//           </div>
//         </div>
//         <div className="credit">
//           created by <span>EstateCraft | IIIT Sri City</span> | All rights reserved!
//         </div>
//       </section>
//     </>
//   );
// };

// export default Homepage;


export default Homepage;
