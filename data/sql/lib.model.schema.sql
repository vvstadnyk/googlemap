
# This is a fix for InnoDB in MySQL >= 4.1.x
# It "suspends judgement" for fkey relationships until are tables are set.
SET FOREIGN_KEY_CHECKS = 0;

#-----------------------------------------------------------------------------
#-- category
#-----------------------------------------------------------------------------

DROP TABLE IF EXISTS `category`;


CREATE TABLE `category`
(
	`id` INTEGER  NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(100)  NOT NULL,
	`slug` VARCHAR(100)  NOT NULL,
	PRIMARY KEY (`id`),
	UNIQUE KEY `category_U_1` (`slug`)
)Type=InnoDB;

#-----------------------------------------------------------------------------
#-- place
#-----------------------------------------------------------------------------

DROP TABLE IF EXISTS `place`;


CREATE TABLE `place`
(
	`id` INTEGER  NOT NULL AUTO_INCREMENT,
	`category_id` INTEGER  NOT NULL,
	`user_id` INTEGER  NOT NULL,
	`name` VARCHAR(100)  NOT NULL,
	`lat` DOUBLE  NOT NULL,
	`lng` DOUBLE  NOT NULL,
	`created_at` DATETIME,
	`description` VARCHAR(255),
	PRIMARY KEY (`id`),
	INDEX `place_FI_1` (`category_id`),
	CONSTRAINT `place_FK_1`
		FOREIGN KEY (`category_id`)
		REFERENCES `category` (`id`),
	INDEX `place_FI_2` (`user_id`),
	CONSTRAINT `place_FK_2`
		FOREIGN KEY (`user_id`)
		REFERENCES `sf_guard_user` (`id`)
)Type=InnoDB;

# This restores the fkey checks, after having unset them earlier
SET FOREIGN_KEY_CHECKS = 1;
