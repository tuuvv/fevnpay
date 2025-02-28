import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  _id: string;
  name: string;
  quantity: number;
  price: number;
}

interface UserState {
  cart: CartItem[];
  user: { id: number; name: string } | null;
}

const initialState: UserState = {
  cart: [],
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const itemIndex = state.cart.findIndex(item => item._id === action.payload._id);
      if (itemIndex >= 0) {
        // Nếu sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng
        state.cart[itemIndex].quantity += action.payload.quantity;
      } else {
        // Nếu sản phẩm chưa có, thêm mới vào giỏ hàng
        state.cart.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(item => item._id !== action.payload);
    },
    clearCart: (state) => {
      state.cart = [];
    },
    setUser: (state, action: PayloadAction<{ id: number; name: string }>) => {
      state.user = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, clearCart, setUser } = userSlice.actions;
export default userSlice.reducer;