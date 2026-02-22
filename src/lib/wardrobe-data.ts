import type { WardrobeItem } from './wardrobe-types';

const AARONG_LOGO = 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/Aarong_Logo.svg/200px-Aarong_Logo.svg.png';

export const defaultWardrobe: WardrobeItem[] = [
  {
    id: 'aarong-panjabi-ivory',
    name: 'Ivory Block Print Panjabi',
    url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop&q=80',
    brand: 'Aarong',
    brandLogo: AARONG_LOGO,
    price: 3200,
    buyUrl: 'https://aarong.com/men/panjabi?ref=stylevu',
    category: 'panjabi',
    isSponsored: true,
    eidCollection: true,
    discount: 10,
  },
  {
    id: 'aarong-panjabi-offwhite',
    name: 'Off-White Muslin Panjabi',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop&q=80',
    brand: 'Aarong',
    brandLogo: AARONG_LOGO,
    price: 4500,
    buyUrl: 'https://aarong.com/men/panjabi?ref=stylevu',
    category: 'panjabi',
    isSponsored: true,
    eidCollection: true,
  },
  {
    id: 'aarong-sherwani-maroon',
    name: 'Royal Maroon Sherwani',
    url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=500&fit=crop&q=80',
    brand: 'Aarong',
    brandLogo: AARONG_LOGO,
    price: 8500,
    buyUrl: 'https://aarong.com/men/sherwani?ref=stylevu',
    category: 'sherwani',
    isSponsored: true,
    eidCollection: true,
    discount: 15,
  },
  {
    id: 'aarong-fatua-blue',
    name: 'Navy Embroidered Fatua',
    url: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=500&fit=crop&q=80',
    brand: 'Aarong',
    brandLogo: AARONG_LOGO,
    price: 1800,
    buyUrl: 'https://aarong.com/men/fatua?ref=stylevu',
    category: 'fatua',
    isSponsored: true,
    eidCollection: true,
  },
  {
    id: 'aarong-kurta-white',
    name: 'White Cotton Kurta',
    url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop&q=80',
    brand: 'Aarong',
    brandLogo: AARONG_LOGO,
    price: 2200,
    buyUrl: 'https://aarong.com/men/kurta?ref=stylevu',
    category: 'kurta',
    isSponsored: true,
    eidCollection: true,
  },
  {
    id: 'casual-tshirt-black',
    name: 'Black Essential Tee',
    url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&q=80',
    category: 'tshirt',
    isSponsored: false,
  },
  {
    id: 'casual-shirt-denim',
    name: 'Denim Button-Down',
    url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop&q=80',
    category: 'shirt',
    isSponsored: false,
  },
];

export const getBrandWardrobe = (): WardrobeItem[] =>
  defaultWardrobe.filter(item => item.isSponsored);

export const getEidCollection = (): WardrobeItem[] =>
  defaultWardrobe.filter(item => item.eidCollection);

export const getByBrand = (brand: string): WardrobeItem[] =>
  defaultWardrobe.filter(item => item.brand === brand);
