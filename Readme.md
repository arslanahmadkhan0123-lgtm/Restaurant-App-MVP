Action,Initial State,Expected State
ADD_ITEM (New item),"{ items: [], discountPercent: 0 }","{ items: [{...item, quantity: 1}], discountPercent: 0 }"
INCREMENT,"{ items: [{ id: 'm1', quantity: 1 }] }","{ items: [{ id: 'm1', quantity: 2 }] }"
DECREMENT (Qty →0),"{ items: [{ id: 'm1', quantity: 1 }] }",{ items: [] }
APPLY_PROMO ('WELCOME10'),"{ promoCode: '', discountPercent: 0 }","{ promoCode: 'WELCOME10', discountPercent: 10 }"
APPLY_PROMO ('INVALID'),"{ promoCode: '', discountPercent: 0 }","{ error: 'Invalid promo code', discountPercent: 0 }"





# Restaurant App MVP (React Native, Fall 2026)

## Author
* **Name:** Arslan Ahmad Khan
* **Roll / ID:** FA2026-REST-MVP

## Installation & Getting Started
1. Ensure Node.js (>= 18.x) and npm are installed.
2. Clone repository:
   ```bash
   git clone [https://github.com/username/restaurant-app-mvp.git](https://github.com/username/restaurant-app-mvp.git)
   cd restaurant-app-mvp