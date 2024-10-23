

async function cartData() {
    const response = await fetch("https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889");
    const data = await response.json();
    const data2 = data.items.map((arr) => {
        const { image, title, price } = arr;
        const cartInfo = {
            image: image,
            title: title,
            price: price,
        };
        return cartInfo;
    });


    localStorage.setItem("cartData",JSON.stringify(data2));
    return data2;
}

function loadCartData() {
    const storedData = localStorage.getItem("cartData");
    if (storedData) {
        return JSON.parse(storedData); 
    }
    return [];
}


cartData()
    .then(() => {
        const data=loadCartData();
        const headerHtml = `
        <div class="product-header">
            <h4>Product</h4>
            <h4>Price</h4>
            <h4>Quantity</h4>
            <h4>Subtotal</h4>
        </div>`;
        
        document.querySelector(".product-details-container2").innerHTML += headerHtml;

        let totalPrice = 0;

        data.forEach((item, index) => {
            const cartHTML = `
            <div class="products-container" id="product${index}">
                <img src="${item.image}" alt="${item.title}">
                <p>${item.title}</p>
                <p>Rs ${item.price.toLocaleString('en-IN')}</p>
                <input type="number" name="" id="inputvalue-${index}" value="1" min="1" oninput="updateSubtotal(${index}, ${item.price})">
                <p id="subtotal-${index}">Rs ${item.price.toLocaleString('en-IN')}</p>
                <button class="delete-btn" id="delete-btn-${index}" onclick="deleteItem(${index}, ${item.price})"><img src="./asset/delete.png" alt="Delete" class="delete-icon"></button>
            </div>`;

            document.querySelector(".product-details-container2").innerHTML += cartHTML;
            totalPrice += item.price;
        });

        const checkoutHTML = `
        <div class="cart-totals">
            <h2>Cart Totals</h2>
            <h3>Subtotal <span id="totalSubtotal">Rs ${totalPrice.toLocaleString('en-IN')}</span></h3>
            <h3>Total <span id="total">Rs ${totalPrice.toLocaleString('en-IN')}</span></h3>
            <button id="checkoutButton">Checkout</button>
        </div>`;

        document.querySelector(".product-details-container").innerHTML += checkoutHTML;

    })
    .catch((error) => {
        console.error("Error:", error);
    });

function updateSubtotal(index, price) {
    const quantity = document.getElementById(`inputvalue-${index}`).value;
    const subtotal = price * quantity;
    document.getElementById(`subtotal-${index}`).innerText = `Rs ${subtotal.toLocaleString('en-IN')}`;
    updateTotal();
}

function updateTotal() {
    let totalPrice = 0;
    document.querySelectorAll('.products-container').forEach((product, index) => {
        const price = parseFloat(document.getElementById(`subtotal-${index}`).innerText.replace('Rs ', '').replace(/,/g, ''));
        totalPrice += price;
    });
    document.getElementById('totalSubtotal').innerText = `Rs ${totalPrice.toLocaleString('en-IN')}`;
    document.getElementById('total').innerText = `Rs ${totalPrice.toLocaleString('en-IN')}`;
}

function deleteItem(index, price) {
    document.getElementById(`product${index}`).remove();
    updateTotal();
}
