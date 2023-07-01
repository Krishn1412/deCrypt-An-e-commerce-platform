# deCrypt-An-e-commerce-platform

An e-commerce website with seller, user, and admin login functionalities. It allows users to browse and purchase products, read reviews, and make secure payments. Sellers can create accounts, request product additions, deliver items, and receive payments. Admins manage product approval, discounts, and payments. The website incorporates a content recommendation system based on the TF-IDF algorithm to provide personalized product suggestions.

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MySQL
- Smart Contracts: Solidity
- Payment: Ganache
- Content Recommendation: TF-IDF Algorithm

## Features

- User Signup and Login
- Product Search and Browsing
- Personalized Product Recommendations
- Product Reviews and Comments
- Shopping Cart Functionality
- Secure Payments with Smart Contracts
- Seller Account Creation and Management
- Admin Product Approval and Discount Management
- Database CRUD Operations

## Getting Started

1. Clone the repository.
2. Install the necessary dependencies using `npm install`.
3. Set up the MySQL database and configure the connection.
4. Start the server using `nodemon user_management.js`.
5. Open the Ganache GUI client that you downloaded and installed. This will start your local blockchain instance.
6. On the other terminal compile the smart contract using `$ truffle migrate --reset` and then run it using `npm run dev`.
7. Unlock Metamask. Connect the meta mask to your local Ethereum blockchain provided by Ganache. Import an account provided by ganache.
8. Access the website in your browser at `http://localhost:5000`.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your improvements.

## License

This project is licensed under the [MIT License](LICENSE).


