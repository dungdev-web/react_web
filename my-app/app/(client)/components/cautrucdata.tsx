export interface ILoai {
  category_id: number;
  name: string;
  parent_id: number;
}

export interface ISanPham {
  product_id: number;
  category_id: number;
  name: string;
  img: string;
  price: number;
  discount_price: number;
  description: string;
  stock: number;
  status: boolean;
  hot: boolean;
  created_at: Date;
  food_detail?: IFoodDetail;
  thumbnail?: IThumbnail;
}

export interface IFoodDetail {
  food_id: number;
  product_id: number;
  ingredients: string;
  calories: number;
  cooking_time: number;
  instructions: string;
}

export interface ICart {
  id: number;
  ten_sp: string;
  so_luong: number;
  gia_mua: number;
  hinh: string;
  size: string;
}

export interface IThumbnail {
  thumbnail_id: number;
  product_id: number;
  img1: string;
  img2: string;
  img3: string;
  img4: string;
}

export interface IUser {
  user_id: number;
  name: string;
  email: string;
  password: string;
  phone: number;
  role: "customer" | "admin";
  status: boolean;
  avatar: string;
  addresses?: {
    address: string;
  }[];
  created_at: Date;
}

export interface IDonHang {
  cart_id: number;
  ma_dh: string;
  created_at: Date;
  user_id: number;
  ghi_chu?: string;
  payment: 0 | 1;
  voucher: string;
  cartitem: ICartItem[];
  user: {
    email: string;
    name: string;
    role: "customer";
    addresses: {
      address: string;
    }[];
  };
  address: string;
}

export interface ICartItem {
  item_id: number;
  cart_id: number;
  quantity: number;
  price: number;
  size: string;
  status: 0 | 1;         // 0: Chưa thanh toán, 1: Đã thanh toán
  status_way: 0 | 1 | 2; // 0: Chưa vận chuyển, 1: Đang giao, 2: Đã tới nơi
  product: {
    product_id: number;
    name: string;
    img: string;
    price: number;
    discount_price: number;
  };
}

export interface IReview {
  review_id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment: string;
  review_user: {
    name: string;
    email: string;
  };
  created_at: Date;
}

export interface IBlog {
  blog_id: number;
  title: string;
  content: string;
  image: string;
  view: number;
  created_at: Date;
}

export interface IAddress {
  address_id: number;
  user_id: number;
  address: string;
  is_default: boolean;
  address_user: {
    name: string;
    email: string;
  };
}

export type Province = {
  code: number;
  name: string;
};

export type District = {
  code: number;
  name: string;
};

export type Ward = {
  code: number;
  name: string;
};

export interface VoucherDisplayProps {
  code: string;
  discountValue?: string;
  description?: string;
}
