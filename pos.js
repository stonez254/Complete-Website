/* EderStone Restaurant POS — rebuilt for reliable browser execution */
(function(){
'use strict';

var KEY='ederstone-pos-v3';
var MENU=[
['Chicken Pilau','Mains',650],['Beef Pilau','Mains',650],['Chicken Biryani','Mains',750],['Beef Biryani','Mains',800],['Chicken Curry','Mains',700],['Beef Stew','Mains',650],['Fish & Chips','Mains',700],
['Chicken Burger','Burgers',550],['Beef Burger','Burgers',600],['Cheese Burger','Burgers',650],
['Club Sandwich','Fast Food',500],['Chicken Shawarma','Fast Food',450],['Beef Shawarma','Fast Food',500],
['Chips Plain','Sides',200],['Chips Masala','Sides',300],
['Ugali & Sukuma','Local',300],['Ugali & Beef','Local',550],['Githeri Special','Local',350],['Mukimo & Beef','Local',550],
['Beef Samosa','Starters',120],['Chicken Wings','Starters',450],['Beef Sausage','Starters',180],['Vegetable Spring Rolls','Starters',250],
['Fresh Passion Juice','Drinks',180],['Fresh Mango Juice','Drinks',180],['Fresh Sugarcane Juice','Drinks',200],['Soda 500ml','Drinks',100],['Bottled Water','Drinks',80],['Tea','Drinks',100],['Coffee','Drinks',150],['Chai Latte','Drinks',220],
['Fruit Salad','Desserts',250],['Ice Cream','Desserts',220],['Chocolate Cake','Desserts',300],
['Mandazi','Breakfast',80],['Spanish Omelette','Breakfast',350],['Pancakes','Breakfast',300],['Full Breakfast','Breakfast',500]
];
var SEED={
 settings:{name:'Ederstone Restaurant',tax:0,service:0},
 tables:Array.from({length:16},function(_,i){return {id:i+1,status:'Open',order:[],paid:false,ready:false};}),
 menu:MENU.map(function(x){return x.slice();}),
 inventory:[['Rice','kg',32,10],['Chicken','kg',18,6],['Beef','kg',22,7],['Cooking Oil','L',20,5],['Potatoes','kg',45,12],['Passion','kg',8,4],['Mango','kg',12,4],['Soda','bottles',48,12],['Flour','kg',30,8],['Sugar','kg',18,5]],
 staff:[['Stone','Owner','Active'],['Cashier 01','Cashier','Active'],['Kitchen 01','Kitchen','Active'],['Waiter 01','Waiter','Active']],
 orders:[]
};
function copy(v){return JSON.parse(JSON.stringify(v));}
function freshDB(){return copy(SEED);}
function loadDB(){
 try{
   var raw=localStorage.getItem(KEY);
   var d=raw?JSON.parse(raw):freshDB();
   if(!d||typeof d!=='object') d=freshDB();
   if(!d.settings||typeof d.settings!=='object') d.settings=copy(SEED.settings);
   if(!Array.isArray(d.tables)||d.tables.length!==16) d.tables=copy(SEED.tables);
   if(!Array.isArray(d.menu)||!d.menu.length) d.menu=copy(SEED.menu);
   if(!Array.isArray(d.inventory)) d.inventory=copy(SEED.inventory);
   if(!Array.isArray(d.staff)) d.staff=copy(SEED.staff);
   if(!Array.isArray(d.orders)) d.orders=[];
   return d;
 }catch(e){return freshDB();}
}
var db=loadDB();
var cart=[];
var activeTable=null;
var orderType='Takeaway';
var payment='M-Pesa';
var category='All';
var currentView='';
var viewStack=[];
var app=null;
var modal=null;

function save(){try{localStorage.setItem(KEY,JSON.stringify(db));}catch(e){}}
function money(n){return 'KSh '+Math.round(Number(n)||0).toLocaleString('en-KE');}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function toast(msg){
 var t=document.getElementById('toast'); if(!t)return;
 t.textContent=msg; t.classList.add('show');
 clearTimeout(window.__ederToast);
 window.__ederToast=setTimeout(function(){t.classList.remove('show');},2400);
}
function setModal(html){
 if(!modal)return;
 modal.querySelector('.modal-box').innerHTML=html;
 modal.classList.add('show');
}
function closeModal(){if(modal)modal.classList.remove('show');}

function shell(title,sub,body){
 if(!app)return;
 app.innerHTML='<section class="content">'+
 '<div class="title-row"><div><div class="eyebrow">EDERSTONE / RESTAURANT POS</div><h1 class="title">'+esc(title)+'</h1><p class="sub">'+esc(sub)+'</p></div>'+
 '<div class="page-actions"><button class="action" data-action="back">← Back</button><button class="action" data-action="dashboard">⌂ Home</button></div></div>'+
 body+'</section>';
}

function dashboard(){
 var sales=db.orders.reduce(function(a,o){return a+Number(o.total||0);},0);
 var busy=db.tables.filter(function(t){return t.status==='Busy';}).length;
 shell('Command Center','Live restaurant overview.',
 '<div class="grid">'+
 '<div class="stat"><small>TODAY SALES</small><strong>'+money(sales)+'</strong><em>Live register</em></div>'+
 '<div class="stat"><small>ORDERS</small><strong>'+db.orders.length+'</strong><em>Completed</em></div>'+
 '<div class="stat"><small>BUSY TABLES</small><strong>'+busy+'/16</strong><em>Dining floor</em></div>'+
 '<div class="stat"><small>MENU ITEMS</small><strong>'+db.menu.length+'</strong><em>Ready to sell</em></div></div>'+
 '<div class="two"><div class="panel"><div class="section-head"><h3>Quick actions</h3></div><div class="actions">'+
 '<button class="action primary" data-action="new-order">＋ New order</button><button class="action" data-action="view" data-view="tables">▥ Tables</button><button class="action" data-action="view" data-view="kitchen">♨ Kitchen</button>'+
 '</div></div><div class="panel"><div class="section-head"><h3>Recent sales</h3></div><div class="list">'+
 (db.orders.slice(-5).reverse().map(function(o){return '<div class="order-card"><div class="order-line"><b>'+esc(o.id)+'</b><strong>'+money(o.total)+'</strong></div><span class="muted">'+esc(o.type)+' · '+esc(o.payment)+'</span></div>';}).join('')||'<p class="muted">No sales yet.</p>')+
 '</div></div></div>');
}

function tableCard(t){
 var total=t.order.reduce(function(a,x){return a+Number(x.price||0)*Number(x.qty||0);},0);
 var items=t.order.reduce(function(a,x){return a+Number(x.qty||0);},0);
 var busy=t.status==='Busy';
 return '<div class="table-card '+(busy?'busy':'open')+'">'+
 '<div class="table-open" data-action="open-table" data-id="'+t.id+'"><h4>Table '+t.id+'</h4><span class="badge '+(busy?'warn':'good')+'">'+(busy?(t.paid?'PAID · OCCUPIED':'BUSY'):'AVAILABLE')+'</span><p class="muted">'+(items?items+' items · '+money(total):'Ready for a new order')+'</p></div>'+
 (busy?'<button class="action danger-btn" data-action="clear-table" data-id="'+t.id+'">✓ Clear table</button>':'<button class="action primary" data-action="open-table" data-id="'+t.id+'">Start order</button>')+
 '</div>';
}
function tables(){
 var busy=db.tables.filter(function(t){return t.status==='Busy';});
 var open=db.tables.filter(function(t){return t.status!=='Busy';});
 shell('Tables','Busy tables stay occupied until explicitly cleared.',
 '<div class="table-summary"><span>🟢 '+open.length+' available</span><span>🟠 '+busy.length+' occupied</span></div>'+
 '<h3 class="table-section-title">Occupied tables</h3><div class="table-grid">'+(busy.map(tableCard).join('')||'<p class="muted">No occupied tables.</p>')+'</div>'+
 '<h3 class="table-section-title">Available tables</h3><div class="table-grid">'+(open.map(tableCard).join('')||'<p class="muted">No available tables.</p>')+'</div>');
}

function newOrder(){
 activeTable=null;cart=[];orderType='Takeaway';payment='M-Pesa';category='All';orderView();
}
function openTable(id){
 var t=db.tables[id-1];
 if(!t){toast('Table not found');return;}
 if(t.status==='Busy'&&t.paid){toast('Clear the paid table before starting another order');return;}
 activeTable=id;orderType='Dine-in';payment='M-Pesa';category='All';cart=copy(t.order||[]);orderView();
}
function subtotal(){return cart.reduce(function(a,x){return a+Number(x.price||0)*Number(x.qty||0);},0);}
function grand(){return subtotal()*(1+(Number(db.settings.tax)||0)/100+(Number(db.settings.service)||0)/100);}
function menuCards(items){
 return items.map(function(x){
   var i=db.menu.indexOf(x);
   return '<div class="item" data-action="add-item" data-index="'+i+'"><div class="category">'+esc(x[1])+'</div><div class="item-line"><b>'+esc(x[0])+'</b><span class="price">'+money(x[2])+'</span></div><small>Tap to add</small></div>';
 }).join('');
}
function orderView(){
 var cats=['All'].concat(Array.from(new Set(db.menu.map(function(x){return x[1];}))));
 var filtered=category==='All'?db.menu:db.menu.filter(function(x){return x[1]===category;});
 var catButtons=cats.map(function(c){return '<button class="filter '+(category===c?'active':'')+'" data-action="category" data-category="'+esc(c)+'">'+esc(c)+'</button>';}).join('');
 var rows=cart.map(function(x,i){return '<div class="cart-row"><div><b>'+esc(x.name)+'</b><div class="muted">'+money(x.price)+' × '+x.qty+'</div></div><div class="qty"><button data-action="qty" data-index="'+i+'" data-delta="-1">−</button><b>'+x.qty+'</b><button data-action="qty" data-index="'+i+'" data-delta="1">+</button></div></div>';}).join('');
 var delivery=orderType==='Delivery'?'<div class="delivery-box"><input id="customerName" placeholder="Customer name"><input id="customerPhone" inputmode="tel" placeholder="07XXXXXXXX"><input id="deliveryAddress" placeholder="Delivery address"></div>':'';
 shell(activeTable?'Table '+activeTable+' Order':'New Order',activeTable?'Add items, choose service type, then pay.':'Walk-in order for takeaway or delivery.',
 '<div class="order-layout"><div class="panel"><div class="order-tools"><input class="search" id="menuSearch" placeholder="Search '+db.menu.length+' menu items"><div class="chips">'+catButtons+'</div></div><div class="menu-grid" id="menuGrid">'+menuCards(filtered)+'</div></div>'+
 '<div class="panel cart"><div class="section-head"><h3>Current Ticket</h3><button class="action" data-action="clear-cart">Clear order</button></div>'+
 '<div class="chips type-switch">'+
 '<button class="filter '+(orderType==='Dine-in'?'active':'')+'" data-action="type" data-type="Dine-in">🍽 Dine-in</button>'+
 '<button class="filter '+(orderType==='Takeaway'?'active':'')+'" data-action="type" data-type="Takeaway">🥡 Takeaway</button>'+
 '<button class="filter '+(orderType==='Delivery'?'active':'')+'" data-action="type" data-type="Delivery">🛵 Delivery</button></div>'+delivery+
 (rows||'<p class="muted">Your ticket is empty. Tap food items.</p>')+
 '<div class="totals"><div>Subtotal <b>'+money(subtotal())+'</b></div><div>Tax <b>'+money(subtotal()*Number(db.settings.tax||0)/100)+'</b></div><div>Service <b>'+money(subtotal()*Number(db.settings.service||0)/100)+'</b></div><strong>Total <b>'+money(grand())+'</b></strong></div>'+
 '<div class="pay-grid">'+['M-Pesa','Cash','Card','Split'].map(function(p){return '<button class="pay-btn '+(payment===p?'selected':'')+'" data-action="payment" data-payment="'+p+'">'+p+'</button>';}).join('')+'</div>'+
 '<button class="action primary big" data-action="checkout">'+(payment==='M-Pesa'?'📱 Request M-Pesa payment · ':'Complete & Pay ')+money(grand())+'</button></div></div>');
 var search=document.getElementById('menuSearch');
 if(search)search.addEventListener('input',function(){
   var q=search.value.toLowerCase();
   var box=document.getElementById('menuGrid');
   if(box)box.innerHTML=menuCards(filtered.filter(function(x){return x[0].toLowerCase().indexOf(q)!==-1;}));
 });
}
function addItem(i){
 var x=db.menu[i];if(!x)return;
 var found=cart.find(function(c){return c.name===x[0];});
 if(found)found.qty++;else cart.push({name:x[0],price:Number(x[2]),qty:1});
 syncTable();orderView();toast(x[0]+' added');
}
function changeQty(i,d){
 if(!cart[i])return;
 cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);
 syncTable();orderView();
}
function syncTable(){
 if(activeTable){
   var t=db.tables[activeTable-1];
   t.order=copy(cart);t.status=cart.length?'Busy':'Open';t.paid=false;t.ready=false;save();
 }
}
function clearCart(){cart=[];syncTable();orderView();}
function setCategory(c){category=c;orderView();}
function setType(t){orderType=t;orderView();}
function setPay(p){payment=p;orderView();}

function checkout(){
 if(!cart.length){toast('Add food before payment');return;}
 openOrderConfirmation();
}
function openOrderConfirmation(){
 var rows=cart.map(function(x){
   return '<div class="order-line"><span>'+esc(x.name)+' ×'+x.qty+'</span><b>'+money(x.price*x.qty)+'</b></div>';
 }).join('');
 setModal('<div class="section-head"><div><div class="eyebrow">ORDER CONFIRMATION</div><h2>Confirm selected food</h2></div><button class="action" data-action="close-modal">×</button></div>'+
 '<p class="muted">Please confirm that the selected food and quantities are correct before proceeding to payment.</p>'+
 '<div class="receipt">'+rows+'<hr><div class="order-line"><strong>Total</strong><strong>'+money(grand())+'</strong></div></div>'+
 '<div class="actions"><button class="action" data-action="close-modal">Review order</button><button class="action primary big" data-action="proceed-payment">Proceed to payment</button></div>');
}
function proceedPayment(){
 closeModal();
 if(payment==='M-Pesa'){openMpesa();return;}
 if(payment==='Split'){openSplit();return;}
 openCashCardPayment(payment);
}
function openCashCardPayment(method){
 setModal('<div class="section-head"><div><div class="eyebrow">'+esc(method.toUpperCase())+' PAYMENT</div><h2>Complete payment</h2></div><button class="action" data-action="close-modal">×</button></div>'+
 '<div class="mpesa-amount">'+money(grand())+'</div>'+
 '<p class="muted">Confirm that you have received the full payment before completing this order.</p>'+
 '<div class="actions"><button class="action" data-action="close-modal">Cancel</button><button class="action primary big" data-action="confirm-sale">✓ Payment received</button></div>');
}
function validateDelivery(){
 if(orderType!=='Delivery')return true;
 var name=(document.getElementById('customerName')||{}).value||'';
 var phone=((document.getElementById('customerPhone')||{}).value||'').replace(/\s+/g,'');
 var address=(document.getElementById('deliveryAddress')||{}).value||'';
 if(!name.trim()||!/^0[17]\d{8}$/.test(phone)||!address.trim()){toast('Enter delivery name, valid phone and address');return false;}
 return true;
}
function completeSale(method,extra){
 if(!cart.length){toast('No items to complete');return;}
 if(!validateDelivery())return;
 var o={id:'ORD-'+Date.now().toString().slice(-6),table:activeTable,type:orderType,payment:method,total:grand(),subtotal:subtotal(),items:copy(cart),status:'Paid',time:new Date().toLocaleString(),customer:null,mpesa:extra||{}};
 if(orderType==='Delivery')o.customer={name:document.getElementById('customerName').value.trim(),phone:document.getElementById('customerPhone').value.trim(),address:document.getElementById('deliveryAddress').value.trim()};
 db.orders.push(o);
 if(activeTable){var t=db.tables[activeTable-1];t.order=copy(cart);t.status='Busy';t.paid=true;t.ready=false;t.lastPayment=method;}
 cart=[];activeTable=null;save();orderView();showReceipt(o);
}
function openSplit(){
 setModal('<div class="section-head"><div><div class="eyebrow">SPLIT PAYMENT</div><h2>Complete split ticket</h2></div><button class="action" data-action="close-modal">Close</button></div>'+
 '<div class="mpesa-amount">'+money(grand())+'</div><p class="muted">Enter the amount paid by M-Pesa and cash/card. The amounts must equal the ticket total.</p>'+
 '<div class="form-grid"><div class="field"><label>M-PESA</label><input id="splitMpesa" type="number" min="0" value="0"></div><div class="field"><label>CASH / CARD</label><input id="splitOther" type="number" min="0" value="'+Math.round(grand())+'"></div></div>'+
 '<button class="action primary big" data-action="split-complete">Complete split payment</button><div id="splitStatus" class="payment-status"></div>');
}
function completeSplit(){
 var a=Math.max(0,Number(document.getElementById('splitMpesa').value)||0),b=Math.max(0,Number(document.getElementById('splitOther').value)||0),total=Math.round(grand());
 if(Math.round(a+b)!==total){toast('Split amounts must equal '+money(total));return;}
 completeSale('Split',{mpesa:Math.round(a),other:Math.round(b)});
 closeModal();
}

function openMpesa(){
 setModal('<div class="mpesa-modal"><div class="section-head"><div><div class="eyebrow">LIPA NA M-PESA</div><h2>Send payment prompt</h2></div><button class="action" data-action="close-modal">Close</button></div>'+
 '<div class="mpesa-amount">'+money(grand())+'</div><p class="muted">Enter the customer phone number. They will receive an M-Pesa STK Push prompt.</p>'+
 '<div class="field"><label>PHONE NUMBER</label><input id="mpesaPhone" inputmode="tel" placeholder="07XXXXXXXX" maxlength="13"></div>'+
 '<button class="action primary big" id="mpesaSend" data-action="mpesa-send">📲 Send prompt</button><div id="mpesaStatus" class="payment-status"></div></div>');
 setTimeout(function(){var p=document.getElementById('mpesaPhone');if(p)p.focus();},50);
}
async function requestMpesa(){
 var input=document.getElementById('mpesaPhone');if(!input)return;
 var phone=(input.value||'').replace(/\s+/g,'');
 if(/^0[17]\d{8}$/.test(phone))phone='254'+phone.slice(1);
 if(!/^254[17]\d{8}$/.test(phone)){toast('Enter a valid Kenyan M-Pesa number');return;}
 var status=document.getElementById('mpesaStatus'),btn=document.getElementById('mpesaSend');
 btn.disabled=true;btn.textContent='Sending prompt…';status.textContent='Connecting to Safaricom…';
 try{
  var r=await fetch('/api/mpesa/stkpush',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:phone,amount:Math.max(1,Math.round(grand())),accountReference:'Ederstone-'+(activeTable?'T'+activeTable:'POS'),transactionDesc:'Restaurant food payment'})});
  var data=await r.json();
  if(!r.ok||data.error)throw new Error(data.error||'M-Pesa request failed');
  status.innerHTML='<span class="success">✓ Prompt sent. Waiting for confirmation…</span>';
  pollMpesa(data.checkoutRequestID,phone);
 }catch(e){status.innerHTML='<span class="danger">✕ '+esc(e.message||'Could not send prompt')+'</span><small>Configure Daraja environment variables on Vercel for live M-Pesa.</small>';btn.disabled=false;btn.textContent='📲 Retry prompt';}
}
async function pollMpesa(id,phone){
 var status=document.getElementById('mpesaStatus'),started=Date.now();
 while(Date.now()-started<120000){
  await new Promise(function(r){setTimeout(r,3000);});
  try{
   var r=await fetch('/api/mpesa/query',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({checkoutRequestID:id})});
   var d=await r.json();
   if(d.status==='success'){status.innerHTML='<span class="success">✓ Payment confirmed by M-Pesa.</span>';setTimeout(function(){completeSale('M-Pesa',{phone:phone,checkoutRequestID:id});},500);return;}
   if(d.status==='failed'){status.innerHTML='<span class="danger">✕ Payment cancelled or failed.</span>';var b=document.getElementById('mpesaSend');if(b){b.disabled=false;b.textContent='📲 Retry prompt';}return;}
   status.textContent='Waiting for the customer to complete the M-Pesa prompt…';
  }catch(e){status.innerHTML='<span class="danger">Payment status check failed. Do not assume payment was received.</span>';return;}
 }
 status.innerHTML='<span class="danger">Payment timed out. No sale was recorded.</span>';
 var btn=document.getElementById('mpesaSend');if(btn){btn.disabled=false;btn.textContent='📲 Retry prompt';}
}

function showReceipt(o){
 setModal('<div class="section-head"><h3>Receipt '+esc(o.id)+'</h3><button class="action" data-action="close-modal">Close</button></div>'+
 '<div class="receipt"><h2>'+esc(db.settings.name)+'</h2><p>'+esc(o.time)+'<br>'+esc(o.type)+(o.table?' · Table '+o.table:'')+'</p><hr>'+
 o.items.map(function(x){return '<div class="order-line"><span>'+esc(x.name)+' ×'+x.qty+'</span><b>'+money(x.price*x.qty)+'</b></div>';}).join('')+
 '<hr><div class="order-line"><b>SUBTOTAL</b><b>'+money(o.subtotal)+'</b></div><div class="order-line"><b>TOTAL</b><b>'+money(o.total)+'</b></div><p>Payment: '+esc(o.payment)+'</p>'+
 (o.mpesa&&o.mpesa.phone?'<p>M-Pesa: '+esc(o.mpesa.phone)+'</p>':'')+'<center>Thank you. Come again.</center></div>'+
 '<div class="actions"><button class="action primary big" data-action="print">Print receipt</button><button class="action big" data-action="close-modal">Close</button></div>');
}
function clearTable(id){
 var t=db.tables[id-1];if(!t||t.status!=='Busy')return;
 t.status='Open';t.order=[];t.paid=false;t.ready=false;delete t.lastPayment;save();tables();toast('Table '+id+' cleared and available');
}
function orders(){
 shell('Orders','Every completed transaction is recorded locally.','<div class="list">'+
 (db.orders.slice().reverse().map(function(o){return '<div class="order-card"><div class="order-line"><b>'+esc(o.id)+'</b><strong>'+money(o.total)+'</strong></div><div class="muted">'+esc(o.time)+' · '+esc(o.type)+' · '+esc(o.payment)+(o.table?' · Table '+o.table:'')+'</div><button class="action" data-action="receipt" data-id="'+esc(o.id)+'">View receipt</button></div>';}).join('')||'<p class="muted">No completed orders.</p>')+'</div>');
}
function showReceiptById(id){var o=db.orders.find(function(x){return x.id===id;});if(o)showReceipt(o);}
function kitchen(){
 var tickets=db.tables.filter(function(t){return t.status==='Busy'&&!t.paid;});
 shell('Kitchen Display','Live unpaid food tickets from occupied tables.','<div class="grid">'+
 (tickets.map(function(t){return '<div class="panel"><div class="section-head"><h3>Table '+t.id+'</h3><span class="badge '+(t.ready?'good':'warn')+'">'+(t.ready?'READY':'COOKING')+'</span></div>'+
 t.order.map(function(x){return '<div class="cart-row"><span>'+esc(x.name)+'</span><b>×'+x.qty+'</b></div>';}).join('')+
 (t.ready?'<button class="action" data-action="unready" data-id="'+t.id+'">Return to cooking</button>':'<button class="action primary" data-action="ready" data-id="'+t.id+'">Mark ready</button>')+
 '</div>';}).join('')||'<p class="muted">Kitchen clear. New dine-in tickets appear here.</p>')+'</div>');
}
function markReady(id){var t=db.tables[id-1];if(t&&t.status==='Busy'&&!t.paid){t.ready=true;save();kitchen();toast('Table '+id+' marked ready');}}
function unready(id){var t=db.tables[id-1];if(t){t.ready=false;save();kitchen();}}
function menu(){
 shell('Menu Manager','Your live catalogue contains '+db.menu.length+' food and drink items.','<div class="panel"><div class="section-head"><h3>Menu catalogue</h3><button class="action primary" data-action="add-menu">＋ Add item</button></div><div class="menu-grid">'+
 db.menu.map(function(x,i){return '<div class="item"><div class="category">'+esc(x[1])+'</div><div class="item-line"><b>'+esc(x[0])+'</b><strong>'+money(x[2])+'</strong></div><button class="action" data-action="edit-menu" data-index="'+i+'">Edit</button></div>';}).join('')+'</div></div>');
}
function addMenu(){
 var n=prompt('Food/drink name');if(!n)return;
 var p=Number(prompt('Price in KSh'));if(!p||p<0)return;
 var c=prompt('Category','Mains')||'Mains';
 db.menu.push([n.trim(),c.trim(),p]);save();menu();toast('Menu item added');
}
function editMenu(i){
 if(!db.menu[i])return;
 var p=Number(prompt('New price for '+db.menu[i][0],db.menu[i][2]));if(!p||p<0)return;
 db.menu[i][2]=p;save();menu();toast('Price updated');
}
function inventory(){
 shell('Inventory','Monitor stock and reorder points.','<div class="list">'+db.inventory.map(function(x,i){return '<div class="item"><div class="item-line"><b>'+esc(x[0])+'</b><strong>'+x[2]+' '+esc(x[1])+'</strong></div><div class="muted">Reorder at '+x[3]+' '+esc(x[1])+'</div><div class="actions"><button class="action" data-action="stock" data-index="'+i+'" data-delta="-1">− 1</button><button class="action" data-action="stock" data-index="'+i+'" data-delta="1">＋ 1</button></div></div>';}).join('')+'</div>');
}
function stock(i,d){if(db.inventory[i]){db.inventory[i][2]=Math.max(0,Number(db.inventory[i][2])+Number(d));save();inventory();}}
function staff(){
 shell('Staff','Roles for the restaurant team.','<div class="list">'+db.staff.map(function(x){return '<div class="item"><div class="item-line"><b>'+esc(x[0])+'</b><span class="badge good">'+esc(x[2])+'</span></div><span class="muted">'+esc(x[1])+'</span></div>';}).join('')+'</div>');
}
function reports(){
 var s=db.orders.reduce(function(a,o){return a+Number(o.total||0);},0);
 shell('Reports','Sales performance from this register.','<div class="grid"><div class="stat"><small>GROSS SALES</small><strong>'+money(s)+'</strong></div><div class="stat"><small>AVERAGE TICKET</small><strong>'+money(db.orders.length?s/db.orders.length:0)+'</strong></div><div class="stat"><small>M-PESA</small><strong>'+money(db.orders.filter(function(o){return o.payment==='M-Pesa';}).reduce(function(a,o){return a+o.total;},0))+'</strong></div><div class="stat"><small>CASH</small><strong>'+money(db.orders.filter(function(o){return o.payment==='Cash';}).reduce(function(a,o){return a+o.total;},0))+'</strong></div></div>');
}
function settings(){
 shell('Settings','Configure the register.','<div class="panel"><div class="form-grid"><div class="field"><label>RESTAURANT NAME</label><input id="rn" value="'+esc(db.settings.name)+'"></div><div class="field"><label>TAX %</label><input id="tx" type="number" min="0" value="'+Number(db.settings.tax||0)+'"></div><div class="field"><label>SERVICE %</label><input id="sv" type="number" min="0" value="'+Number(db.settings.service||0)+'"></div></div><div class="actions"><button class="action primary" data-action="save-settings">Save settings</button><button class="action" data-action="reset">Reset POS data</button></div></div>');
}
function saveSettings(){
 db.settings.name=(document.getElementById('rn')||{}).value||'Ederstone Restaurant';
 db.settings.tax=Math.max(0,Number((document.getElementById('tx')||{}).value)||0);
 db.settings.service=Math.max(0,Number((document.getElementById('sv')||{}).value)||0);
 save();settings();toast('Settings saved');
}
function resetPOS(){
 if(!window.confirm('Reset all POS data?'))return;
 db=freshDB();cart=[];activeTable=null;orderType='Takeaway';payment='M-Pesa';category='All';viewStack=[];currentView='';save();view('dashboard');toast('POS data reset');
}
function goBack(){view(viewStack.pop()||'dashboard',true);}
var VIEWS={dashboard:dashboard,tables:tables,orders:orders,menu:menu,kitchen:kitchen,inventory:inventory,staff:staff,reports:reports,settings:settings};
function view(v,fromBack){
 if(!VIEWS[v])v='dashboard';
 if(!fromBack&&currentView&&currentView!==v)viewStack.push(currentView);
 currentView=v;
 document.querySelectorAll('.nav').forEach(function(n){n.classList.toggle('active',n.getAttribute('data-view')===v);});
 VIEWS[v]();
}
function handleAction(el){
 var a=el.getAttribute('data-action');
 if(!a)return;
 if(a==='view')return view(el.getAttribute('data-view'));
 if(a==='dashboard')return view('dashboard');
 if(a==='back')return goBack();
 if(a==='new-order')return newOrder();
 if(a==='open-table')return openTable(Number(el.getAttribute('data-id')));
 if(a==='clear-table')return clearTable(Number(el.getAttribute('data-id')));
 if(a==='add-item')return addItem(Number(el.getAttribute('data-index')));
 if(a==='qty')return changeQty(Number(el.getAttribute('data-index')),Number(el.getAttribute('data-delta')));
 if(a==='clear-cart')return clearCart();
 if(a==='category')return setCategory(el.getAttribute('data-category'));
 if(a==='type')return setType(el.getAttribute('data-type'));
 if(a==='payment')return setPay(el.getAttribute('data-payment'));
 if(a==='checkout')return checkout();
 if(a==='proceed-payment')return proceedPayment();
 if(a==='confirm-sale')return completeSale(payment);
 if(a==='close-modal')return closeModal();
 if(a==='mpesa-send')return requestMpesa();
 if(a==='split-complete')return completeSplit();
 if(a==='print')return window.print();
 if(a==='receipt')return showReceiptById(el.getAttribute('data-id'));
 if(a==='ready')return markReady(Number(el.getAttribute('data-id')));
 if(a==='unready')return unready(Number(el.getAttribute('data-id')));
 if(a==='add-menu')return addMenu();
 if(a==='edit-menu')return editMenu(Number(el.getAttribute('data-index')));
 if(a==='stock')return stock(Number(el.getAttribute('data-index')),Number(el.getAttribute('data-delta')));
 if(a==='save-settings')return saveSettings();
 if(a==='reset')return resetPOS();
}
function bind(){
 app=document.getElementById('app');
 modal=document.getElementById('modal');
 if(!app){console.error('EderStone POS: #app was not found');return;}
 document.querySelectorAll('.nav').forEach(function(n){n.addEventListener('click',function(){view(n.getAttribute('data-view'));});});
 var logout=document.getElementById('logoutPos');if(logout)logout.addEventListener('click',function(){location.href='projects.html';});
 var full=document.getElementById('fullscreenPos');if(full)full.addEventListener('click',async function(){try{if(!document.fullscreenElement&&document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else if(document.exitFullscreen)await document.exitFullscreen();}catch(e){toast('Full screen is unavailable on this device');}});
 app.addEventListener('click',function(e){var el=e.target.closest('[data-action]');if(el)handleAction(el);});
 if(modal){
   modal.addEventListener('click',function(e){
     var el=e.target.closest('[data-action]');
     if(el)handleAction(el);
     else if(e.target===modal)closeModal();
   });
 }
 var clock=document.getElementById('clock');
 setInterval(function(){if(clock)clock.textContent=new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});},1000);
 view('dashboard');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();