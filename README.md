# ShopNow — E-Commerce Storefront

INT424 E-Commerce, Lab 1: Development Environment and E-Commerce Storefront.

A responsive three-page storefront built with plain HTML and CSS.

## Pages
- `index.html`: Home page with a hero section and six featured products
- `products.html`: Full product list with categories, descriptions and prices
- `about.html`: Information about the store and contact details

## Project structure
```
ecommerce-lab/
├── index.html
├── products.html
├── about.html
├── .gitignore
├── css/style.css
├── js/app.js
└── images/
```

## Responsive design
Tested at desktop (1366px), tablet (768px) and mobile (375px) widths. The product grid uses CSS Grid with `auto-fill`, so it shows three, two or one column depending on screen width, and the header stacks vertically on screens under 600px.
