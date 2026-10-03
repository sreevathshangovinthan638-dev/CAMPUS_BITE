import { Link } from "react-router-dom";
import { FaArrowRight, FaGraduationCap, FaChalkboardTeacher, FaUtensils, FaUserShield } from "react-icons/fa";
const roles=[['student','Student',FaGraduationCap],['teacher','Teacher',FaChalkboardTeacher],['kitchen','Kitchen',FaUtensils],['admin','Admin',FaUserShield]];
export default function Portals(){return <main className="role-outline-page"><h1>Choose your role</h1><p>Continue to sign up or log in.</p><div className="role-outline-list">{roles.map(([role,title,Icon])=><Link to={`/login?role=${role}`} key={role} className="role-outline-row"><span className="outline-role-icon"><Icon /></span><strong>{title}</strong><FaArrowRight aria-hidden="true" /></Link>)}</div></main>;}
