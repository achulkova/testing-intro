function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

function addToCart(cart, product, quantity) {
  if (!isPositiveInteger(quantity)) throw new RangeError('Количество должно быть положительным целым числом.');

  const existingProduct = cart.find((item) => item.id === product.id);
  const totalQuantity = existingProduct ? existingProduct.quantity + quantity : quantity;

  if (totalQuantity > product.stock) throw new RangeError('Количество превышает остаток на складе.');

  if (!existingProduct) return [...cart, { ...product, quantity }];

  return cart.map((item) => (
    item.id === product.id ? { ...item, quantity: totalQuantity } : item
  ));
}

function changeQuantity(cart, productId, quantity) {
  const existingProduct = cart.find((item) => item.id === productId);
  if (!existingProduct) return [...cart];

  if (!isPositiveInteger(quantity)) throw new RangeError('Количество должно быть положительным целым числом.');
  if (quantity > existingProduct.stock) throw new RangeError('Количество превышает остаток на складе.');

  return cart.map((item) => (
    item.id === productId ? { ...item, quantity } : item
  ));
}

function removeFromCart(cart, productId) {
  return cart.filter((item) => item.id !== productId);
}

function calculateCartSubtotal(cart) {
  return cart.reduce((subtotal, item) => subtotal + item.price * item.quantity, 0);
}

function calculateOrderTotal(cart, promoCode) {
  const subtotal = calculateCartSubtotal(cart);
  const discount = promoCode === 'SAVE10' && subtotal >= 20000
    ? Math.round(subtotal * 0.1)
    : 0;
  const delivery = subtotal >= 50000 ? 0 : 30000;

  return {
    subtotal,
    discount,
    delivery,
    total: subtotal - discount + delivery,
  };
}

const cartApi = { addToCart, changeQuantity, removeFromCart, calculateCartSubtotal, calculateOrderTotal };

if (typeof module !== 'undefined') module.exports = cartApi;
if (typeof window !== 'undefined') window.cartApi = cartApi;
