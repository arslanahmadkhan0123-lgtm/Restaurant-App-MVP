export const initialState = {
  items: [],
  promoCode: "",
  discountPercent: 0,
  error: null,
};

const validPromoCodes = {
  WELCOME10: 10,
  FEAST20: 20,
};

export function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex((i) => i.id === action.payload.id);
      if (existingIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + 1,
        };
        return { ...state, items: updatedItems };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1, notes: "" }] };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case "INCREMENT":
      return {
        ...state,
        items: state.items.map((i) => (i.id === action.payload ? { ...i, quantity: i.quantity + 1 } : i)),
      };
    case "DECREMENT":
      return {
        ...state,
        items: state.items
          .map((i) => (i.id === action.payload ? { ...i, quantity: i.quantity - 1 } : i))
          .filter((i) => i.quantity > 0),
      };
    case "UPDATE_NOTE":
      return {
        ...state,
        items: state.items.map((i) => (i.id === action.payload.id ? { ...i, notes: action.payload.notes } : i)),
      };
    case "APPLY_PROMO": {
      const code = action.payload.toUpperCase();
      if (validPromoCodes[code]) {
        return { ...state, promoCode: code, discountPercent: validPromoCodes[code], error: null };
      }
      return { ...state, promoCode: "", discountPercent: 0, error: "Invalid promo code" };
    }
    case "REMOVE_PROMO":
      return { ...state, promoCode: "", discountPercent: 0, error: null };
    case "CLEAR_CART":
      return initialState;
    default:
      return state;
  }
}