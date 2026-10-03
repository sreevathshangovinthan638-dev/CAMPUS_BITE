import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
export default function ReceiptBarcode({ value }) {
 const ref=useRef(null);
 useEffect(()=>{JsBarcode(ref.current,value,{format:'CODE128',width:2,height:90,displayValue:false,margin:24,background:'#ffffff',lineColor:'#000000'});},[value]);
 return <div className="receipt-barcode"><svg ref={ref} role="img" aria-label={`Collection barcode for ${value}`} /><code>{value}</code><p>Scan this barcode to find the order at the collection counter.</p></div>;
}
