import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateCart,
  updateDeliveryOption,
} from "../data/cart.js";
import { products } from "../data/products.js";
import formatCurrency from "./utils/money.js";
import { hello } from "https://unpkg.com/supersimpledev@1.0.1/hello.esm.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions } from "../data/deliveryOptions.js";

hello();

const today = dayjs();
const deliveryDate = today.add(7, "days");
console.log(deliveryDate.format("dddd, MMMM D"));

let cartSummaryHTML = "";

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  const deliveryOptionId = cartItem.deliveryOptionId;

  let deliveryOption;

  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });

  const today = dayjs();
  const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
  const dateString = deliveryDate.format("dddd, MMMM D");
  console.log(deliveryOption);

  cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${
      matchingProduct.id
    }">
      <div class="delivery-date">Delivery date: ${dateString}</div>

      <div class="cart-item-details-grid">
        <img
          class="product-image"
          src="${matchingProduct.image}"
        />

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">$${formatCurrency(
            matchingProduct.priceCents
          )}</div>
          <div class="product-quantity">
            <span> Quantity: <span class="quantity-label js-quantity-label-${
              matchingProduct.id
            }">${cartItem.quantity}</span> </span>
            
            <span class="update-quantity-link link-primary js-update-link js-product-quantity-${
              matchingProduct.id
            }" data-product-id="${matchingProduct.id}">
              Update 
            </span>          
            <input class="quantity-input js-quantity-input js-quantity-input-${
              matchingProduct.id
            }" data-product-id="${matchingProduct.id}">
            <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${
              matchingProduct.id
            }">Save</span>

            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${
              matchingProduct.id
            }">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
  `;
});

function deliveryOptionsHTML(matchingProduct, cartItem) {
  let html = "";

  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");
    const priceString =
      deliveryOption.priceCents === 0
        ? "FREE"
        : `$${formatCurrency(deliveryOption.priceCents)} -`;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html += `    
    <div class="delivery-option js-delivery-option"
      data-product-id="${matchingProduct.id}"
      data-delivery-option-id="${deliveryOption.id}">
      <input
        type="radio"
        ${isChecked ? "checked" : ""}
        class="delivery-option-input"
        name="delivery-option-${matchingProduct.id}"
      />
      <div>
        <div class="delivery-option-date">${dateString}</div>
        <div class="delivery-option-price">${priceString} Shipping</div>
      </div>
    </div>
    `;
  });

  return html;
}

updateCartQuantity();

document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;
//Update link(When clicked give input and save link)
document.querySelectorAll(".js-update-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    container.classList.add("is-editing-quantity");
  });
});
//Save link(When clicked saves inserted value and closes)
document.querySelectorAll(".js-save-quantity-link").forEach((link) => {
  link.addEventListener("click", () => {
    handleSaveQuantity(link);
  });
});
//Use Enter to input quantity
document.querySelectorAll(".js-quantity-input").forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleSaveQuantity(input);
    }
  });
});
document.querySelectorAll(".js-delete-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    container.remove();
    removeFromCart(productId);
  });
});
function handleSaveQuantity(link) {
  const productId = link.dataset.productId;
  const container = document.querySelector(
    `.js-cart-item-container-${productId}`
  );
  container.classList.remove("is-editing-quantity");
  const containerInput = document.querySelector(
    `.js-quantity-input-${productId}`
  );
  const inputQuantity = Number(containerInput.value); //OK
  //Quantity Validation
  if (inputQuantity >= 0 && inputQuantity < 1000) {
    if (inputQuantity === 0) {
      container.remove();
      removeFromCart(productId);
      updateCartQuantity();
    } else {
      updateCart(productId, inputQuantity);
      updateQuantityLabel(productId, inputQuantity);
      updateCartQuantity();
    }
  }
  containerInput.value = "";
}

// prettier-ignore
function updateCartQuantity() {
  document.querySelector(".js-return-to-home-link")
    .innerHTML = `${calculateCartQuantity()} items`;
}
// prettier-ignore
function updateQuantityLabel(productId,quantity){
  document.querySelector(`.js-quantity-label-${productId}`).innerHTML = `${quantity}`;
}

document.querySelectorAll(".js-delivery-option").forEach((element) => {
  element.addEventListener("click", () => {
    const { productId, deliveryOptionId } = element.dataset;
    updateDeliveryOption(productId, deliveryOptionId);
  });
});
