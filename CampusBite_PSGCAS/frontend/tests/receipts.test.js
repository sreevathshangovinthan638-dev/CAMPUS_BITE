import test from 'node:test';
import assert from 'node:assert/strict';
import JsBarcode from 'jsbarcode';
import {makeReceiptId,saveReceipt,readStored,changeReceiptStatus} from '../src/api/receipts.js';
const store=new Map();
globalThis.localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
globalThis.window={dispatchEvent:()=>{}};
test('unique receipt IDs produce valid CODE128 bars',()=>{
 const ids=new Set();
 for(let i=0;i<1000;i++){const id=makeReceiptId();assert.match(id,/^CB\d{40}$/);ids.add(id);}
 assert.equal(ids.size,1000);
 const encoded={};JsBarcode(encoded,[...ids][0],{format:'CODE128'});
 assert.match(encoded.encodings[0].data,/^[01]+$/);
 assert.ok(encoded.encodings[0].data.length>100);
});
test('receipt, kitchen entry and collection status keep the same ID',()=>{
 store.clear();
 const order={id:makeReceiptId(),items:[{name:'Idli Sambar',quantity:2,price:30}],customerName:'Test Customer',orderTime:'10:00 AM',status:'pending',paymentStatus:'Awaiting verification'};
 saveReceipt(order);saveReceipt(order);
 assert.equal(readStored('campusbite_receipts',[]).length,1);
 const queue=readStored('campusbite_kitchen_live',[]);
 assert.equal(queue.length,1);assert.equal(queue[0].receiptId,order.id);
 assert.equal(queue[0].item,'Idli Sambar × 2');
 changeReceiptStatus(order.id,'collected');
 assert.equal(readStored('lastOrder',null).status,'collected');
 assert.equal(readStored('campusbite_receipts',[])[0].status,'collected');
 assert.equal(readStored('lastOrder',null).paymentStatus,'Awaiting verification');
});
test('new bills preserve previous receipts and malformed storage is handled',()=>{
 store.clear();store.set('broken','{');assert.deepEqual(readStored('broken',[]),[]);
 for(let i=0;i<2;i++)saveReceipt({id:makeReceiptId(),items:[],customerName:'Test',status:'pending'});
 assert.equal(readStored('campusbite_receipts',[]).length,2);
 assert.equal(readStored('campusbite_kitchen_live',[]).length,2);
});
