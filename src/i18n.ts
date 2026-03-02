// ============================================
// BDai.studio — Internationalization (i18n)
// Bengali + English with correct Aarong spellings
// Bengali digit conversion: ০১২৩৪৫৬৭৮৯
// ============================================

type Language = 'bn' | 'en';

const translations: Record<string, Record<Language, string>> = {
  // App
  'app.title': { bn: 'AI ভার্চুয়াল ট্রাই-অন', en: 'AI Virtual Try-On' },
  'app.subtitle': { bn: 'AI দিয়ে কেনার আগে পরে দেখুন', en: 'Try Before You Buy with AI' },
  'app.poweredBy': { bn: 'BDai.studio দ্বারা পরিচালিত', en: 'Powered by BDai.studio' },
  'app.loading': { bn: 'লোড হচ্ছে...', en: 'Loading...' },

  // Start Screen
  'start.welcome': { bn: 'স্বাগতম!', en: 'Welcome!' },
  'start.instruction': { bn: 'আপনার ফটো দিন, পোশাক বেছে নিন, AI দেখাবে কেমন লাগবে', en: 'Upload your photo, choose an outfit, AI shows how it looks' },
  'start.takePhoto': { bn: '📸 ছবি তুলুন', en: '📸 Take Photo' },
  'start.uploadPhoto': { bn: '📁 গ্যালারি থেকে বেছে নিন', en: '📁 Choose from Gallery' },
  'start.browseFirst': { bn: '👗 আগে পোশাক দেখুন', en: '👗 Browse Outfits First' },
  'start.photoTip': { bn: 'টিপ: সোজা হয়ে দাঁড়ান, ভালো আলোতে ছবি তুলুন', en: 'Tip: Stand straight in good lighting' },
  'start.privacy': { bn: '🔒 আপনার ছবি নিরাপদ — কোথাও সেভ হয় না', en: '🔒 Your photo is safe — never saved anywhere' },

  // Camera
  'camera.title': { bn: 'ছবি তুলুন', en: 'Take Photo' },
  'camera.switch': { bn: 'ক্যামেরা বদলান', en: 'Switch Camera' },
  'camera.capture': { bn: 'ছবি তুলুন', en: 'Capture' },
  'camera.retake': { bn: 'আবার তুলুন', en: 'Retake' },
  'camera.use': { bn: 'এই ছবি ব্যবহার করুন', en: 'Use This Photo' },
  'camera.guide': { bn: 'মুখ ও শরীর ফ্রেমে রাখুন', en: 'Keep face & body in frame' },
  'camera.error': { bn: 'ক্যামেরা চালু করা যাচ্ছে না', en: 'Cannot access camera' },

  // Wardrobe
  'wardrobe.title': { bn: 'পোশাক বেছে নিন', en: 'Choose an Outfit' },
  'wardrobe.all': { bn: 'সব', en: 'All' },
  'wardrobe.search': { bn: 'খুঁজুন...', en: 'Search...' },
  'wardrobe.tryOn': { bn: '✨ পরে দেখুন', en: '✨ Try On' },
  'wardrobe.noResults': { bn: 'কোনো পোশাক পাওয়া যায়নি', en: 'No outfits found' },
  'wardrobe.featured': { bn: 'ফিচার্ড', en: 'Featured' },
  'wardrobe.eidCollection': { bn: 'ঈদ কালেকশন', en: 'Eid Collection' },
  'wardrobe.newArrival': { bn: 'নতুন', en: 'New' },
  'wardrobe.fewLeft': { bn: 'অল্প আছে!', en: 'Few Left!' },
  'wardrobe.men': { bn: 'পুরুষ', en: "Men's" },
  'wardrobe.women': { bn: 'মহিলা', en: "Women's" },

  // Categories (corrected Bengali - শালওয়ার not সালোয়ার)
  'cat.panjabi': { bn: 'পাঞ্জাবি', en: 'Panjabi' },
  'cat.saree': { bn: 'শাড়ি', en: 'Saree' },
  'cat.shalwar-kameez': { bn: 'শালওয়ার কামিজ', en: 'Shalwar Kameez' },
  'cat.kurta': { bn: 'কুর্তা', en: 'Kurta' },
  'cat.fatua': { bn: 'ফতুয়া', en: 'Fatua' },
  'cat.shirt': { bn: 'শার্ট', en: 'Shirt' },
  'cat.panjabi-pajama-set': { bn: 'পাঞ্জাবি পায়জামা সেট', en: 'Panjabi Pajama Set' },
  'cat.coaty': { bn: 'কোটি', en: 'Coaty' },
  'cat.eid-collection': { bn: 'ঈদ কালেকশন', en: 'Eid Collection' },
  'cat.lehenga': { bn: 'লেহেঙ্গা', en: 'Lehenga' },
  'cat.abaya': { bn: 'আবায়া', en: 'Abaya' },
  'cat.western': { bn: 'ওয়েস্টার্ন', en: 'Western' },

  // Processing
  'processing.title': { bn: 'AI কাজ করছে...', en: 'AI is working...' },
  'processing.step1': { bn: 'আপনার ছবি বিশ্লেষণ করা হচ্ছে', en: 'Analyzing your photo' },
  'processing.step2': { bn: 'পোশাক প্রস্তুত করা হচ্ছে', en: 'Preparing the outfit' },
  'processing.step3': { bn: 'AI ট্রাই-অন তৈরি হচ্ছে', en: 'Generating AI try-on' },
  'processing.wait': { bn: 'অনুগ্রহ করে অপেক্ষা করুন...', en: 'Please wait...' },

  // Result
  'result.title': { bn: 'আপনার AI লুক!', en: 'Your AI Look!' },
  'result.tryAnother': { bn: 'অন্য পোশাক ট্রাই করুন', en: 'Try Another Outfit' },
  'result.share': { bn: '📤 শেয়ার করুন', en: '📤 Share' },
  'result.buy': { bn: '🛍️ কিনুন', en: '🛍️ Buy Now' },
  'result.newPhoto': { bn: '📸 নতুন ছবি', en: '📸 New Photo' },
  'result.download': { bn: '💾 ডাউনলোড', en: '💾 Download' },

  // Share
  'share.title': { bn: 'শেয়ার করুন', en: 'Share Your Look' },
  'share.facebook': { bn: 'ফেসবুক', en: 'Facebook' },
  'share.whatsapp': { bn: 'হোয়াটসঅ্যাপ', en: 'WhatsApp' },
  'share.instagram': { bn: 'ইনস্টাগ্রাম', en: 'Instagram' },
  'share.download': { bn: 'ডাউনলোড', en: 'Download' },
  'share.messenger': { bn: 'মেসেঞ্জার', en: 'Messenger' },
  'share.copied': { bn: 'কপি হয়েছে!', en: 'Copied!' },
  'share.instaTip': { bn: 'ছবি ডাউনলোড করুন, তারপর Instagram এ পোস্ট করুন', en: 'Download the image, then post on Instagram' },

  // Buy
  'buy.website': { bn: 'ওয়েবসাইট থেকে কিনুন', en: 'Buy from Website' },
  'buy.whatsapp': { bn: 'WhatsApp এ অর্ডার করুন', en: 'Order via WhatsApp' },
  'buy.facebook': { bn: 'Facebook এ অর্ডার করুন', en: 'Order via Facebook' },
  'buy.buyFromBrand': { bn: 'থেকে কিনুন', en: 'Buy from' },

  // Errors
  'error.generic': { bn: 'কিছু ভুল হয়েছে। আবার চেষ্টা করুন।', en: 'Something went wrong. Please try again.' },
  'error.rateLimit': { bn: 'মাসিক ট্রাই-অন সীমা শেষ হয়েছে', en: 'Monthly try-on limit reached' },
  'error.noPhoto': { bn: 'আগে একটি ছবি তুলুন', en: 'Please take a photo first' },
  'error.noProduct': { bn: 'একটি পোশাক বেছে নিন', en: 'Please select an outfit' },
  'error.aiError': { bn: 'AI ছবি তৈরি করতে পারেনি। অন্য ছবি বা পোশাক ট্রাই করুন।', en: 'AI could not generate the image. Try a different photo or outfit.' },
  'error.network': { bn: 'ইন্টারনেট সংযোগ চেক করুন', en: 'Please check your internet connection' },
  'error.camera': { bn: 'ক্যামেরা অ্যাক্সেস প্রয়োজন', en: 'Camera access required' },

  // Footer
  'footer.support': { bn: 'সাহায্য দরকার?', en: 'Need help?' },
  'footer.whatsapp': { bn: 'WhatsApp এ যোগাযোগ করুন', en: 'Contact via WhatsApp' },
  'footer.copyright': { bn: '© ২০২৬ BDai.studio — সর্বস্বত্ব সংরক্ষিত', en: '© 2026 BDai.studio — All rights reserved' },
  'footer.terms': { bn: 'শর্তাবলী', en: 'Terms' },
  'footer.privacy': { bn: 'গোপনীয়তা', en: 'Privacy' },
};

export function t(key: string, lang: Language): string {
  const entry = translations[key];
  if (!entry) {
    console.warn(`Missing translation: ${key}`);
    return key;
  }
  return entry[lang] || entry['en'] || key;
}

// Convert to Bengali digits: 0→০, 1→১, ..., 9→৯
const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliDigits(num: number | string): string {
  return String(num).replace(/[0-9]/g, (d) => BENGALI_DIGITS[parseInt(d)]);
}

// Format price: ৳2,500 or ৳২,৫০০
export function formatPrice(amount: number, lang: Language, currency = '৳'): string {
  const formatted = amount.toLocaleString('en-IN');
  if (lang === 'bn') {
    return `${currency}${toBengaliDigits(formatted)}`;
  }
  return `${currency}${formatted}`;
}

// Get product name in current language
export function getProductName(product: { name: string; nameBn?: string }, lang: Language): string {
  return lang === 'bn' && product.nameBn ? product.nameBn : product.name;
}

// Get category name in current language
export function getCategoryName(category: { name: string; nameBn: string }, lang: Language): string {
  return lang === 'bn' ? category.nameBn : category.name;
}
