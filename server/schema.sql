DROP TABLE IF EXISTS `dates`;
CREATE TABLE `dates` (
   `date` timestamp UNIQUE,
  `commissions` decimal(8,2) NOT NULL,
  `sales` decimal(8,0) NOT NULL,
  `leads` decimal(8,0) NOT NULL,
  `clicks` decimal(8,0) NOT NULL,
  `epc` decimal(8,2) NOT NULL,
  `impressions` decimal(6,0) NOT NULL,
  `cr` decimal(8,2) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(256) NOT NULL,
  `first_name` varchar(256) NOT NULL,
  `last_name` varchar(256) NOT NULL,
  `avatar` varchar(256),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
