import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { placeOrder } from "../api/dataService";
import { saveReceipt, makeReceiptId } from "../api/receipts";
export default function Payment({ cart, setCart, setLastOrder }) {
 const navigate = useNavigate();
 const { user } = useAuth();
 const [customerName, setCustomerName] = useState(user?.fullName || user?.username || '');
 const [transactionReference, setTransactionReference] = useState('');
 const [submitting, setSubmitting] = useState(false);
 const [error, setError] = useState('');
 const [copied, setCopied] = useState(false);
 const busy = useRef(false);
 const receiptId = useRef(null);
 const subtotal = Math.round(cart.reduce((sum,item) => sum + Number(item.price)*item.quantity,0)*100)/100;
 const cgst = Math.round(subtotal*2.5)/100;
 const sgst = cgst;
 const total = Math.round((subtotal+cgst+sgst)*100)/100;
 const upiId = 'sreevathshansridevi35@okicici';
 async function submit(event) {
  event.preventDefault();
  if (busy.current || !cart.length) return;
  busy.current=true; setSubmitting(true); setError('');
  try {
   receiptId.current ||= makeReceiptId();
   const createdAt=new Date().toISOString();
   const pickupTime=localStorage.getItem('pickupTime') || 'Now (10–15 mins)';
   const payload={receipt_id:receiptId.current,customer_name:customerName.trim(),pickup_time:pickupTime,payment_method:'upi',transaction_reference:transactionReference.trim(),total_amount:total,items:cart.map(item=>({food_id:item.id,name:item.name,quantity:item.quantity,price:Number(item.price)}))};
   const result=await placeOrder(payload);
   const order={id:receiptId.current,rawId:result.data.id,source:result.source,createdAt,items:cart.map(item=>({...item})),subtotal,cgst,sgst,total,customerName:customerName.trim(),pickupTime,paymentMethod:'UPI',paymentStatus:'Awaiting verification',transactionReference:transactionReference.trim(),status:'pending',role:user?.role || 'student',orderDate:new Date(createdAt).toLocaleDateString('en-IN',{timeZone:'Asia/Kolkata',day:'2-digit',month:'short',year:'numeric'}),orderTime:new Date(createdAt).toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',second:'2-digit'})};
   saveReceipt(order); setLastOrder(order); setCart([]); navigate(`/bill?id=${order.id}`,{replace:true});
  } catch (err) {setError(err.message || 'Could not save your bill. Please try again.');}
  finally {busy.current=false;setSubmitting(false);}
 }
 if (!cart.length) return <main className="payment-page-replica"><div className="payment-container"><h1>Your cart is empty</h1><p>Add food before making a payment.</p><Link to="/menu">Browse menu →</Link></div></main>;
 return <main className="payment-page-replica"><div className="payment-container"><div className="payment-header-row"><div><h1>UPI Payment</h1><p>Scan with any UPI app.</p></div></div><div className="upi-qr-card"><img className="supplied-upi-image" src="/upi-payment.jpeg" alt="UPI QR for Sreevathshan Sridevi, sreevathshansridevi35@okicici" /><div className="amount-payable-badge"><span>Amount to enter in your UPI app</span><strong>₹{total.toFixed(2)}</strong></div><p className="scan-helper-text">Payee: Sreevathshan Sridevi. Check the payee and enter the exact amount above. This supplied QR does not include your order total.</p><button type="button" className="upi-copy-button" onClick={async()=>{try {await navigator.clipboard.writeText(upiId);setCopied(true);}catch{setError('Copy unavailable. Select the UPI ID below manually.');}}}>{copied ? 'UPI ID copied' : 'Copy UPI ID'}</button><p className="upi-address">{upiId}</p></div><form className="receipt-payment-form" onSubmit={submit}><label>Customer name<input required maxLength={120} value={customerName} onChange={e=>setCustomerName(e.target.value)} pattern=".*\S.*" autoComplete="name" /></label><label>UPI transaction reference (optional)<input value={transactionReference} maxLength={80} onChange={e=>setTransactionReference(e.target.value)} placeholder="Reference from your UPI app" /></label><p className="payment-verification-note">Submitting creates your bill for staff verification. It does not verify a bank payment. Show your bill barcode at collection.</p>{error && <p role="alert">{error}</p>}<button className="verify-pay-btn" disabled={submitting}>{submitting ? 'Saving bill…' : "I've paid — generate bill"}</button></form></div></main>;
}
