floral-shop-app/
├── client/                          # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Nav.jsx             # Navigation bar with search, auth, and cart visuals
│   │   │   ├── ProductCard.jsx     # Reusable product card for Home/Search
│   │   │   └── Search.jsx          # Search component with styled input and product cards
│   │   │   └── Subscribe.jsx       # Subscribe component 
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Authentication context for user state
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx  # Admin dashboard with CRUD for inventory, users, orders
│   │   │   ├── Cart.jsx            # Cart page (placeholder)
│   │   │   ├── Checkout.jsx        #
│   │   │   ├── Contact.jsx         #
│   │   │   ├── Home.jsx            # Home page with product cards
│   │   │   ├── Login.jsx           # Login page with redirect fix
│   │   │   ├── OrderHistory.jsx    # 
│   │   │   ├── ProductDetail.jsx   # Detailed product view
│   │   │   ├── Shop.jsx            # 
│   │   │   └── Signup.jsx          # Signup page (placeholder)
│   │   ├── App.css                 # 
│   │   ├── App.jsx                 # Main app with routing
│   │   ├── index.css               # Global CSS (optional)
│   │   ├── main.jsx                # 
│   │   ├── Nav.css                 # 
│   │   └── Search.css              # 
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
│   │   ├── authController.js       
│   │   ├── cartController.js 
│   │   ├── paymentController.js 
│   │   └── productController.js 
│   ├── middleware/
│   │   └── auth.js                 # Authentication middleware (auth, admin)
│   │   ├── upload.js
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
│   │   ├── paymentRoutes.js        # Stripe payment routes
│   │   ├── productRoutes.js        # Product CRUD routes
│   │   ├── subscriptionRoutes.js   # Subscription routes
│   │   └── userRoutes.js           # User CRUD routes
│   ├── uploads/
│   │   ├── products/
│   ├── .env                        # Environment variables
│   ├── index.js                    # Server entry point
│   ├── .gitignore                  # 
│   ├── package-lock.json           # Server 
│   ├── package.json                # Server 
│   ├── testPassword.js             # 
│   └── verifyPassword.js           # 
├── .gitignore                      # Git ignore file
└── README.md                       # Project documentation

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    font-family: Arial, sans-serif;
    text-align: center;
    color: rgb(0, 0, 0);
    box-sizing: inherit;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;


MERN STACK floral-shop-app/
├── client/                         
│   ├── src/
│   │   ├── components/
│   │   │   ├── Nav.jsx             
│   │   │   ├── ProductCard.jsx     
│   │   │   └── Search.jsx          
│   │   │   └── Subscribe.jsx       
│   │   ├── context/
│   │   │   └── AuthContext.jsx     
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx  
│   │   │   ├── Cart.jsx            
│   │   │   ├── Checkout.jsx        
│   │   │   ├── Contact.jsx         
│   │   │   ├── Home.jsx            
│   │   │   ├── Login.jsx           
│   │   │   ├── OrderHistory.jsx     
│   │   │   ├── ProductDetail.jsx  
│   │   │   ├── Shop.jsx             
│   │   │   └── Signup.jsx          
│   │   ├── App.css                  
│   │   ├── App.jsx                
│   │   ├── index.css               
│   │   ├── main.jsx                 
│   │   ├── Nav.css                  
│   │   └── Search.css               
│   ├── .env                         
│   ├── .gitignore                   
│   ├── eslint.config.js             
│   ├── index.html                   
│   ├── package-lock.json            
│   ├── package.json                
│   ├── README.md                    
│   └── vite.config.js              

├── server/                         # Backend (Node.js/Express)
│   ├── config/
│   │   └── db.js                   
│   ├── controllers/
│   │   ├── authController.js       
│   │   ├── cartController.js 
│   │   ├── paymentController.js 
│   │   └── productController.js 
│   ├── middleware/
│   │   └── auth.js                 # Authentication middleware (auth, admin)
│   │   ├── upload.js
│   ├── models/
│   │   ├── Cart.js                 
│   │   ├── Message.js              # Message schema
│   │   ├── Order.js                # Order schema
│   │   ├── Product.js              # Product schema
│   │   ├── Subscription.js         
│   │   └── User.js                 # User schema
│   ├── routes/
│   │   ├── authRoutes.js          
│   │   ├── cartRoutes.js           
│   │   ├── messageRoutes.js        
│   │   ├── orderRoutes.js          
│   │   ├── paymentRoutes.js        
│   │   ├── productRoutes.js        
│   │   ├── subscriptionRoutes.js   
│   │   └── userRoutes.js           
│   ├── uploads/
│   │   ├── products/
│   ├── .env                        
│   ├── index.js                  
│   ├── .gitignore                   
│   ├── package-lock.json          
│   ├── package.json               
│   ├── testPassword.js              
│   └── verifyPassword.js            
├── .gitignore                      
└── README.md                     