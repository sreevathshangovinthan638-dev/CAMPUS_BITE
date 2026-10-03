export function readStored(key, fallback) {
 try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
}
export function makeReceiptId() { return 'CB' + BigInt('0x' + crypto.randomUUID().replaceAll('-', '')).toString().padStart(40, '0'); }
export function saveReceipt(order) {
 const receipts=readStored('campusbite_receipts',[]);
 localStorage.setItem('campusbite_receipts',JSON.stringify([order,...receipts.filter(r=>r.id!==order.id)]));
 localStorage.setItem('lastOrder',JSON.stringify(order));
 const queue=readStored('campusbite_kitchen_live',[]);
 const entry={id:order.id,orderNum:order.id,receiptId:order.id,item:order.items.map(i=>`${i.name} × ${i.quantity}`).join(', '),qty:order.items.reduce((n,i)=>n+i.quantity,0),customer:order.customerName,time:order.orderTime,status:order.status,paymentStatus:order.paymentStatus};
 localStorage.setItem('campusbite_kitchen_live',JSON.stringify([entry,...queue.filter(r=>r.id!==order.id)]));
 window.dispatchEvent(new Event('campusbite-orders-updated'));
}
export function changeReceiptStatus(id,status) {
 const receipts=readStored('campusbite_receipts',[]).map(r=>r.id===id?{...r,status}:r);
 localStorage.setItem('campusbite_receipts',JSON.stringify(receipts));
 const latest=readStored('lastOrder',null);
 if(latest?.id===id) localStorage.setItem('lastOrder',JSON.stringify({...latest,status}));
 window.dispatchEvent(new Event('campusbite-orders-updated'));
}
