floral-shop-app/
├── client/                          # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Nav.jsx             # Navigation bar with search, auth, and cart visuals
│   │   │   ├── ProductCard.jsx     # Reusable product card for Home/Search
│   │   │   └── Search.jsx          # Search component with styled input and product cards
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Authentication context for user state
│   │   ├── pages/
│   │   │   ├── Admin.jsx           # 
│   │   │   ├── AdminDashboard.jsx  # Admin dashboard with CRUD for inventory, users, orders
│   │   │   ├── Cart.jsx            # Cart page (placeholder)
│   │   │   ├── Checkout.jsx        #
│   │   │   ├── Home.jsx            # Home page with product cards
│   │   │   ├── Login.jsx           # Login page with redirect fix
│   │   │   ├── OrderHistory.jsx    # 
│   │   │   ├── Shop.jsx    # 
│   │   │   ├── ProductDetail.jsx   # Detailed product view
│   │   │   └── Signup.jsx          # Signup page (placeholder)
│   │   ├── App.css                 # 
│   │   ├── App.jsx                 # Main app with routing
│   │   ├── index.css               # Global CSS (optional)
│   │   ├── Nav.css                 # 
│   │   └── main.jsx                # Entry point for React
│   ├── .env                        # 
│   ├── .gitignore                  # 
│   ├── eslint.config.js            # 
│   ├── index.html                  # 
│   ├── package-lock.json           # 
│   ├── package.json                # Client dependencies
│   ├── README.md                   # 
│   └── vite.config.js              # Vite configuration
├── server/                         # Backend (Node.js/Express)
│   ├── config/
│   │   └── db.js                   # Database configuration
│   ├── controllers/
│   │   └── authController.js       # 
│   │   └── cartController.js 
│   │   └── paymentController.js 
│   │   └── productController.js 
│   ├── middleware/
│   │   └── auth.js                 # Authentication middleware (auth, admin)
│   ├── models/
│   │   ├── Cart.js                 # Cart schema
│   │   ├── Message.js              # Message schema
│   │   ├── Order.js                # Order schema
│   │   ├── Product.js              # Product schema
│   │   ├── Subscription.js         # Subscription schema
│   │   └── User.js                 # User schema
│   ├── routes/
│   │   ├── authRoutes.js           # Auth routes (login, signup)
│   │   ├── cartRoutes.js           # Cart routes
│   │   ├── messageRoutes.js        # Message routes
│   │   ├── orderRoutes.js          # Order CRUD routes
│   │   ├── productRoutes.js        # Product CRUD routes
│   │   ├── subscriptionRoutes.js   # Subscription routes
│   │   ├── paymentRoutes.js        # Stripe payment routes
│   │   └── userRoutes.js           # User CRUD routes
│   ├── .env                        # Environment variables
│   ├── index.js                    # Server entry point
│   ├── .gitignore                  # 
│   └── package.json                # Server 
│   └── testPassword.js             # 
│   └── verifyPassword.js           # 
├── README.md                       # Project documentation
└── .gitignore                      # Git ignore file