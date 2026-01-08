import { ISanPham ,ICart} from "@/app/(client)/components/cautrucdata";
import { current } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
export const cartSlice = createSlice({
    name: "cart",
    initialState: {listSp:[] as ICart[],order:{}},
    reducers: {
        themSP: (state,param)=>{
            const sp = param.payload as ISanPham;
            const index = state.listSp.findIndex((s:ICart)=> s.id === sp.product_id);
            if(index>=0) state.listSp[index].so_luong++;
            else{
                const c:ICart={id:sp.product_id,ten_sp:sp.name,so_luong:1,gia_mua:sp.discount_price,hinh:sp.img,size:"Lớn"}
                state.listSp.push(c);
            }
            console.log("đã thêm vào store. listSP=",current(state).listSp)
         },
         themSP1: (state, param) => {
            const { sp, quantity,size } = param.payload as { sp: ISanPham; quantity: number;size:string };
            const index = state.listSp.findIndex((s: ICart) => s.id === sp.product_id);
          
            if (index >= 0) {
              state.listSp[index].so_luong += quantity; // Cộng thêm số lượng từ input
            } else {
              const c: ICart = {
                id: sp.product_id,
                ten_sp: sp.name,
                so_luong: quantity, // Gán số lượng từ input
                gia_mua: sp.discount_price,
                hinh: sp.img,
                size:size||"Lớn"
              };
              state.listSp.push(c);
            }
          
            console.log("đã thêm vào store. listSP=", current(state).listSp);
          },
          
         suaSL: (state, param) => {
            const id: number = Number(param.payload[0]);
            const so_luong: number = Number(param.payload[1]);
            const index = state.listSp.findIndex(s => s.id === id);
            if (index !== -1) state.listSp[index].so_luong = so_luong;
            console.log("Đã sửa sp ", param);
        },
        
        xoaSP: (state, param) => {
            const id: number = Number(param.payload);
            const index = state.listSp.findIndex(s => s.id === id);
            if (index !== -1) state.listSp.splice(index, 1);
            console.log("Đã xóa sp ", param);
        },
        
        xoaGH: (state) => {
            state.listSp.length = 0;
            state.listSp = [];
            console.log("Đã xóa giỏ hàng");
        },
        
    },
});
export const {themSP,suaSL,xoaGH,xoaSP,themSP1}=cartSlice.actions
export default cartSlice.reducer;