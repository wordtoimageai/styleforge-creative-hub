import type { WardrobeItem } from './wardrobe-types';

const AARONG_LOGO = 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/Aarong_Logo.svg/200px-Aarong_Logo.svg.png';

export const defaultWardrobe: WardrobeItem[] = [
  {
    id: 'aarong-panjabi-ivory',
    name: 'Ivory Block Print Panjabi',
    url: 'https://raw.githubusercontent.com/ammaarreshi/app-images/refs/heads/main/gemini-sweat-2.png',
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
    url: 'https://raw.githubusercontent.com/ammaarreshi/app-images/refs/heads/main/Gemini-tee.png',
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
    url: 'https://raw.githubusercontent.com/ammaarreshi/app-images/refs/heads/main/gemini-sweat-2.png',
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
    url: 'https://raw.githubusercontent.com/ammaarreshi/app-images/refs/heads/main/Gemini-tee.png',
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
    url: 'https://raw.githubusercontent.com/ammaarreshi/app-images/refs/heads/main/gemini-sweat-2.png',
    brand: 'Aarong',
    brandLogo: AARONG_LOGO,
    price: 2200,
    buyUrl: 'https://aarong.com/men/kurta?ref=stylevu',
    category: 'kurta',
    isSponsored: true,
    eidCollection: true,
  },
  {
    id: 'gemini-sweat',
    name: 'Gemini Sweat',
    url: 'https://raw.githubusercontent.com/ammaarreshi/app-images/refs/heads/main/gemini-sweat-2.png',
    category: 'custom',
    isSponsored: false,
  },
  {
    id: 'gemini-tee',
    name: 'Gemini Tee',
    url: 'https://raw.githubusercontent.com/ammaarreshi/app-images/refs/heads/main/Gemini-tee.png',
    category: 'tshirt',
    isSponsored: false,
  },
];

export const getBrandWardrobe = (): WardrobeItem[] =>
  defaultWardrobe.filter(item => item.isSponsored);

export const getEidCollection = (): WardrobeItem[] =>
  defaultWardrobe.filter(item => item.eidCollection);

export const getByBrand = (brand: string): WardrobeItem[] =>
  defaultWardrobe.filter(item => item.brand === brand);
