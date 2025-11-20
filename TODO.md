# TODO: Update Base URL to Load from Environment Variable

## Overview
Replace all hardcoded "https://admin.sarvoclub.com" URLs with `import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com"` to ensure the base URL is loaded from the environment variable.

## Progress Checklist
- [ ] Update api.js: Change `const BASE_URL = "https://admin.sarvoclub.com";` to `const BASE_URL = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";`
- [ ] Update app_constants.dart: Change `static const String baseUrl = 'https://admin.sarvoclub.com';` to use environment variable
- [ ] Update src/pages/Cart.tsx: Add baseUrl and replace hardcoded URLs
- [ ] Update src/pages/CheckoutPage.tsx: Add baseUrl and replace hardcoded URLs
- [ ] Update src/pages/ProfilePage.tsx: Add baseUrl and replace hardcoded URLs
- [ ] Update src/pages/OfferDetailPage.tsx: Add baseUrl and replace hardcoded URLs
- [ ] Update src/pages/Category/SubcategoryService.tsx: Add baseUrl and replace hardcoded URLs
- [ ] Update src/pages/Category/CategoryDetail.tsx: Add baseUrl and replace hardcoded URLs
- [ ] Update src/helpers/categories.js: Replace hardcoded URL with baseUrl
- [ ] Update src/helpers/coupon.js: Add baseUrl and replace hardcoded URLs
- [ ] Update src/components/Footer.tsx: Define baseUrl if needed for privacy-policy link
- [ ] Update src/components/AdvertiseMent.tsx: Add baseUrl and replace hardcoded URL
- [ ] Update src/components/Banners.tsx: Add baseUrl and replace hardcoded URL
- [ ] Update src/components/Header.tsx: Add baseUrl and replace hardcoded URLs

## Files to Edit (Detailed)

### 1. api.js
- Change `const BASE_URL = "https://admin.sarvoclub.com";` to `const BASE_URL = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";`

### 2. src/pages/Cart.tsx
- Add `const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";` at the top of the component
- Replace `"https://admin.sarvoclub.com/api/v1/customer/cart/list?limit=100&offset=1"` with `${baseUrl}/api/v1/customer/cart/list?limit=100&offset=1`
- Replace `` `https://admin.sarvoclub.com/api/v1/customer/cart/update-quantity/${itemId}` `` with `${baseUrl}/api/v1/customer/cart/update-quantity/${itemId}`
- Replace `` `https://admin.sarvoclub.com/api/v1/customer/cart/remove/${itemId}` `` with `${baseUrl}/api/v1/customer/cart/remove/${itemId}`

### 3. src/pages/CheckoutPage.tsx
- Add `const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";` at the top
- Replace hardcoded URLs in fetch calls

### 4. src/pages/ProfilePage.tsx
- Add `const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";` at the top
- Replace hardcoded URLs

### 5. src/pages/OfferDetailPage.tsx
- Add `const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";` at the top
- Replace `"https://admin.sarvoclub.com/api/v1/customer/banner/list"` with `${baseUrl}/api/v1/customer/banner/list`

### 6. src/pages/Category/SubcategoryService.tsx
- Add `const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";` at the top
- Replace hardcoded URL

### 7. src/pages/Category/CategoryDetail.tsx
- Add `const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";` at the top
- Replace hardcoded URL

### 8. src/helpers/categories.js
- Change `const url = `https://admin.sarvoclub.com/api/v1/customer/category?offset=${offset}&limit=${limit}`;` to use baseUrl

### 9. src/helpers/coupon.js
- Add `const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";`
- Replace hardcoded URLs in fetch calls

### 10. src/components/Footer.tsx
- For the privacy-policy link, define baseUrl if needed

### 11. src/components/AdvertiseMent.tsx
- Add `const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";` at the top
- Replace hardcoded URL

### 12. src/components/Banners.tsx
- Add `const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";` at the top
- Replace hardcoded URL

### 13. src/components/Header.tsx
- Add `const baseUrl = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";` at the top
- Replace hardcoded URLs where present

## Followup Steps
- Test the application to ensure all API calls work with the new base URL
- Verify that setting VITE_API_URL in .env changes the base URL
- Check for any missed hardcoded URLs
