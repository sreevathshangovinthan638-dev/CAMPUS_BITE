import { Link } from "react-router-dom";
import { FaArrowRight, FaGraduationCap, FaChalkboardTeacher, FaUtensils, FaUserShield } from "react-icons/fa";
const portals = [
  { role: 'student', title: 'Student', icon: FaGraduationCap, description: 'Your favourites, ready for your next break.' },
  { role: 'teacher', title: 'Teacher', icon: FaChalkboardTeacher, description: 'A little convenience for your busy campus day.' },
  { role: 'kitchen', title: 'Kitchen', icon: FaUtensils, description: 'Prepare fresh meals and manage incoming orders.' },
  { role: 'admin', title: 'Admin', icon: FaUserShield, description: 'Look after the menu and food court operations.' },
];
export default function Home() {
  return <main className="outline-home">
    <div className="outline-intro"><span>PSG COLLEGE OF ARTS & SCIENCE</span><p>Good Food <i>·</i> Brighter Days</p></div>
    <section className="outline-campus" aria-label="Welcome to PSGCAS CampusBite">
      <img src="/psgcas-gateway.jpg" alt="The entrance arch of PSG College of Arts and Science" fetchPriority="high" width="584" height="342" />
      <Link to="/portals" className="outline-order-button hero-order-button">Order Now <FaArrowRight /></Link><div className="outline-photo-caption"><span>OUR CAMPUS. OUR COMMUNITY.</span><p>Same campus. More good food.</p></div>
    </section>
    <section className="outline-order" aria-labelledby="order-heading"><Link to="/portals" className="outline-order-button">Order Now <FaArrowRight /></Link><div><span>WELCOME TO CAMPUSBITE</span><h1 id="order-heading">Delicious food. Happier campus.</h1><p>Your favourite food, now a few taps away. Order ahead and enjoy your break.</p></div></section>
    <footer className="outline-footer"><span>CampusBite <b>·</b> PSGCAS Food Court</span><p>Order · Pay · Pickup · Enjoy</p></footer>
  </main>;
}
