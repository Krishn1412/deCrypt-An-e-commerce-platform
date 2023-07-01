-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 01, 2023 at 12:31 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `og-database`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `ID` int(100) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `Address` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`ID`, `Name`, `Email`, `Password`, `Address`) VALUES
(1, 'Krishn Parasar', 'k@p', 'kp', '0x3c406E8576e02C962EE87c3A0295be03BdCCb2Ea'),
(2, 'Piyush Raj', 'p@r', 'pr', '');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `ID` int(255) NOT NULL,
  `userID` int(255) NOT NULL,
  `prodID` int(255) NOT NULL,
  `Quantity` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`ID`, `userID`, `prodID`, `Quantity`) VALUES
(6, 27, 43, 2),
(15, 26, 43, 3);

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `ID` int(255) NOT NULL,
  `userEmail` varchar(255) NOT NULL,
  `prodID` int(255) NOT NULL,
  `Text` varchar(255) NOT NULL,
  `Likes` int(255) NOT NULL,
  `Stars` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`ID`, `userEmail`, `prodID`, `Text`, `Likes`, `Stars`) VALUES
(1, 'K@p', 43, 'Mast maal, sb ko le lena chahiye', 3, 0),
(3, 'K@p', 43, 'good thing', 0, 0),
(14, 'K@p', 43, 'Hiii', 0, 0),
(15, 'K@p', 43, 'Hwllo', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `cookies`
--

CREATE TABLE `cookies` (
  `ID` int(255) NOT NULL,
  `userID` int(255) NOT NULL,
  `id1` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `discount`
--

CREATE TABLE `discount` (
  `ID` int(200) NOT NULL,
  `ProdID` int(250) NOT NULL,
  `Disco` int(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `discount`
--

INSERT INTO `discount` (`ID`, `ProdID`, `Disco`) VALUES
(7, 3, 10),
(9, 40, 10);

-- --------------------------------------------------------

--
-- Table structure for table `enroute`
--

CREATE TABLE `enroute` (
  `ID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `orderID` int(11) NOT NULL,
  `prodID` int(11) NOT NULL,
  `sellerID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `enroute`
--

INSERT INTO `enroute` (`ID`, `userID`, `orderID`, `prodID`, `sellerID`) VALUES
(2, 26, 2, 43, 4),
(5, 26, 6, 43, 4);

-- --------------------------------------------------------

--
-- Table structure for table `mostfreq`
--

CREATE TABLE `mostfreq` (
  `ID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `type1` int(11) NOT NULL,
  `type2` int(11) NOT NULL,
  `type3` int(11) NOT NULL,
  `type4` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `mostfreq`
--

INSERT INTO `mostfreq` (`ID`, `userID`, `type1`, `type2`, `type3`, `type4`) VALUES
(1, 26, 1, 11, 2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `ID` int(255) NOT NULL,
  `userID` int(255) NOT NULL,
  `prodID` int(255) NOT NULL,
  `price` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `orderp`
--

CREATE TABLE `orderp` (
  `ID` int(255) NOT NULL,
  `userID` int(255) NOT NULL,
  `prodID` int(255) NOT NULL,
  `price` int(255) NOT NULL,
  `quantity` int(255) NOT NULL,
  `status` int(11) NOT NULL,
  `sellerID` int(11) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orderp`
--

INSERT INTO `orderp` (`ID`, `userID`, `prodID`, `price`, `quantity`, `status`, `sellerID`, `time`) VALUES
(1, 26, 41, 20, 5, 2, 4, '2023-02-27 11:45:06'),
(2, 26, 43, 45, 2, 1, 4, '2023-02-27 11:29:39'),
(3, 26, 43, 45, 1, 0, 4, '2023-02-27 10:56:39'),
(4, 26, 43, 45, 2, 2, 4, '2023-06-26 10:07:35'),
(5, 26, 43, 45, 2, 3, 4, '2023-06-26 10:17:54'),
(6, 26, 43, 45, 3, 1, 4, '2023-06-26 09:17:50'),
(7, 26, 43, 45, 1, 0, 4, '2023-06-26 08:11:06'),
(8, 26, 43, 45, 1, 0, 4, '2023-06-26 08:54:40');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `ID` int(254) NOT NULL,
  `Name` varchar(251) NOT NULL,
  `CategoryID` int(100) NOT NULL,
  `Inventory` int(100) NOT NULL,
  `Price` bigint(255) NOT NULL,
  `DiscountID` int(100) NOT NULL,
  `Descp` varchar(255) NOT NULL,
  `SellerID` int(100) NOT NULL,
  `Img` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`ID`, `Name`, `CategoryID`, `Inventory`, `Price`, `DiscountID`, `Descp`, `SellerID`, `Img`) VALUES
(38, 'E', 4, 4, 4, 0, 'Bandeya Manzil manzil Manzil', 4, ''),
(39, 'iPad', 2, 22, 2, 0, 'Superior tech, beyond your reach', 4, 'https://freepngimg.com/thumb/ipad/29750-3-ipad-free-download.png'),
(40, 'iPad', 2, 22, 2, 10, 'Superior tech, beyond your reach', 4, 'https://freepngimg.com/thumb/ipad/29750-3-ipad-free-download.png'),
(41, 'Gel Pen', 3, 2, 20, 2, 'writes cool', 4, 'https://www.istockphoto.com/photos/pens'),
(43, 'iPad', 2, 0, 45, 0, 'Superior technology, tech cool', 4, 'https://freepngimg.com/thumb/ipad/29750-3-ipad-free-download.png'),
(44, 'iPad', 0, 0, 45, 0, '', 4, 'https://freepngimg.com/thumb/ipad/29750-3-ipad-free-download.png'),
(45, 'iPhone', 2, 2, 1000, 0, 'Tech Super', 4, ''),
(46, 'Adidas Shoes', 2, 5, 5000, 0, 'Great shoes, really comfy and looks cool', 4, 'https://imgeng.jagran.com/images/2023/may/Best%20Adidas%20Original%20Shoes%20For%20Men1682951431717.jpg'),
(47, 'jello', 3, 5, 50, 0, 'Tasty jelly for your tase', 4, '');

-- --------------------------------------------------------

--
-- Table structure for table `product_img`
--

CREATE TABLE `product_img` (
  `ID` int(255) NOT NULL,
  `prodID` int(255) NOT NULL,
  `img1` varchar(255) NOT NULL,
  `img2` varchar(255) NOT NULL,
  `img3` varchar(255) NOT NULL,
  `img4` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product_img`
--

INSERT INTO `product_img` (`ID`, `prodID`, `img1`, `img2`, `img3`, `img4`) VALUES
(2, 43, 'https://freepngimg.com/thumb/ipad/29750-3-ipad-free-download.png', 'https://imageio.forbes.com/specials-images/imageserve/6071dceac7ba96e64941c1ef/iPad-Pro---about-to-be-updated--it-seems-/960x0.jpg?format=jpg&width=960', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNm2EAuZMb4yBNemQ3t1iiZMLQHGgFpxAyKrbMUjQw&s', 'https://freepngimg.com/thumb/ipad/29750-3-ipad-free-download.png'),
(3, 41, 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cGVufGVufDB8fDB8fA%3D%3D&w=1000&q=80', 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cGVufGVufDB8fDB8fA%3D%3D&w=1000&q=80', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQS327F8AqwLGPRUFcMmAJCsj2r-lM0O2WVYLOiqSQ5A&s', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQS327F8AqwLGPRUFcMmAJCsj2r-lM0O2WVYLOiqSQ5A&s'),
(4, 46, 'https://www.adidahttps://5.imimg.com/data5/ANDROID/Default/2022/3/WK/BP/SX/19051907/product-jpeg-500x500.jpgs.co.in/ultraboost-22-shoes/GZ0127.html', 'https://imgeng.jagran.com/images/2023/may/Best%20Adidas%20Original%20Shoes%20For%20Men1682951431717.jpg', 'https://tiimg.tistatic.com/fp/1/007/555/adidas-sport-shoes-with-white-with-red-color-and-lace-closup-tpr-insole-materials-662.jpg', 'https://5.imimg.com/data5/ANDROID/Default/2022/3/IU/RJ/CV/19051907/product-jpeg-1000x1000.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `product_req`
--

CREATE TABLE `product_req` (
  `ID` int(255) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `CategoryID` int(250) NOT NULL,
  `Inventory` int(250) NOT NULL,
  `Price` bigint(255) NOT NULL,
  `DiscountID` int(250) NOT NULL,
  `Descp` varchar(255) NOT NULL,
  `SellerID` int(250) NOT NULL,
  `Img` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `seller`
--

CREATE TABLE `seller` (
  `ID` int(100) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `Mobile` int(100) NOT NULL,
  `Eth_Address` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `seller`
--

INSERT INTO `seller` (`ID`, `Name`, `Email`, `Password`, `Mobile`, `Eth_Address`) VALUES
(1, 'Krishn', 'hfdj@pp', 'djl', 87453453, 'dfkl58f4ds4'),
(3, 'Krishn', 'jadkc@iwsj', 'ijdsj', 485948595, '8fgrvd98v0f9v9ix0fv'),
(4, 'Krishn', 'K@p', 'kp', 2147483647, '0x96EDc3d1CCE7ed4BF469d9654F6353eFe2cc704E'),
(5, 'Krishn', 'K@pp', 'kp', 2147483647, 'feskod24321wd'),
(6, 'Krishn', 'K@ppqw', 'wdfa', 2147483647, 'feskod24321wd'),
(7, 'kpef', 'wfjds@jekd', 'wjfmdsk', 0, 'fksdl'),
(8, 'kpef', 'wfjds@jekdut8', 'jf', 0, 'fksdl'),
(9, 'kpef', 'wfjds@jekdut8ws', 'sd', 0, 'fksdl'),
(10, 'Piyush Raj ', 'P@r', 'pr', 857985, 'd6h4f5gf');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `ID` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Email` varchar(1000) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `Gender` varchar(100) NOT NULL,
  `Age` int(100) NOT NULL,
  `MobileNumber` int(50) NOT NULL,
  `id1` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`ID`, `Name`, `Email`, `Password`, `Gender`, `Age`, `MobileNumber`, `id1`) VALUES
(26, 'Krishn Parasar', 'K@p', 'kp', 'Male', 20, 2147483647, 43),
(27, 'Krishn Ram', 'k@q', 'kq', 'Male', 54, 68474534, 0),
(28, 'Raja', 'Raja@ram', 'Rr', 'Male', 64, 6536843, 0);

-- --------------------------------------------------------

--
-- Table structure for table `user_address`
--

CREATE TABLE `user_address` (
  `ID` int(100) NOT NULL,
  `User_ID` int(100) NOT NULL,
  `Address_Line1` varchar(120) NOT NULL,
  `Address_Line2` varchar(120) NOT NULL,
  `City` varchar(100) NOT NULL,
  `State` varchar(100) NOT NULL,
  `Postal_Code` int(100) NOT NULL,
  `Mobile` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_address`
--

INSERT INTO `user_address` (`ID`, `User_ID`, `Address_Line1`, `Address_Line2`, `City`, `State`, `Postal_Code`, `Mobile`) VALUES
(6, 26, 'Vyas Bhavan', 'BITS Pilani', 'Hyderabad', 'West Bengal', 500078, 2147483647),
(7, 27, 'fads', 'dsf', 'sdf', 'Jharkhand', 531, 68474534),
(8, 28, 'bhas', 'jcsz', 'adjc', 'West Bengal', 54211, 6536843);

-- --------------------------------------------------------

--
-- Table structure for table `user_payment`
--

CREATE TABLE `user_payment` (
  `ID` int(100) NOT NULL,
  `User_ID` int(100) NOT NULL,
  `Payment_Type` varchar(100) NOT NULL,
  `Account_Number` varchar(100) NOT NULL,
  `Eth_Address` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_payment`
--

INSERT INTO `user_payment` (`ID`, `User_ID`, `Payment_Type`, `Account_Number`, `Eth_Address`) VALUES
(3, 26, 'ethereum', '45434168', 'd5vvd54v65sd4'),
(4, 27, 'cards', 'adfss', '4865f'),
(5, 28, 'ethereum', '845121100', '451dc8v45cz');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `cart_user` (`userID`),
  ADD KEY `cart_prod` (`prodID`);

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `prod_fk2` (`prodID`);

--
-- Indexes for table `cookies`
--
ALTER TABLE `cookies`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `discount`
--
ALTER TABLE `discount`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `enroute`
--
ALTER TABLE `enroute`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `orderp`
--
ALTER TABLE `orderp`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `product_img`
--
ALTER TABLE `product_img`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `prod_fk1` (`prodID`);

--
-- Indexes for table `product_req`
--
ALTER TABLE `product_req`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `seller`
--
ALTER TABLE `seller`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `user_address`
--
ALTER TABLE `user_address`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `User ID` (`User_ID`);

--
-- Indexes for table `user_payment`
--
ALTER TABLE `user_payment`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `User ID` (`User_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `ID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `cookies`
--
ALTER TABLE `cookies`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `discount`
--
ALTER TABLE `discount`
  MODIFY `ID` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `enroute`
--
ALTER TABLE `enroute`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orderp`
--
ALTER TABLE `orderp`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `ID` int(254) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `product_img`
--
ALTER TABLE `product_img`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `product_req`
--
ALTER TABLE `product_req`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `seller`
--
ALTER TABLE `seller`
  MODIFY `ID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `user_address`
--
ALTER TABLE `user_address`
  MODIFY `ID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `user_payment`
--
ALTER TABLE `user_payment`
  MODIFY `ID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_prod` FOREIGN KEY (`prodID`) REFERENCES `product` (`ID`),
  ADD CONSTRAINT `cart_user` FOREIGN KEY (`userID`) REFERENCES `user` (`ID`);

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `prod_fk2` FOREIGN KEY (`prodID`) REFERENCES `product` (`ID`);

--
-- Constraints for table `enroute`
--
ALTER TABLE `enroute`
  ADD CONSTRAINT `route_fk` FOREIGN KEY (`ID`) REFERENCES `orderp` (`ID`);

--
-- Constraints for table `product_img`
--
ALTER TABLE `product_img`
  ADD CONSTRAINT `prod_fk1` FOREIGN KEY (`prodID`) REFERENCES `product` (`ID`);

--
-- Constraints for table `user_address`
--
ALTER TABLE `user_address`
  ADD CONSTRAINT `address_fk` FOREIGN KEY (`User_ID`) REFERENCES `user` (`ID`);

--
-- Constraints for table `user_payment`
--
ALTER TABLE `user_payment`
  ADD CONSTRAINT `payment_fk` FOREIGN KEY (`User_ID`) REFERENCES `user` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
