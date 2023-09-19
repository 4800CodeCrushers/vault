CREATE TABLE `vault`.`credentials` (
  `email` VARCHAR(45) NOT NULL,
  `user_id` INT NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `key` VARCHAR(45) NULL,
  PRIMARY KEY (`email`),
  UNIQUE INDEX `id_UNIQUE` (`user_id` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE
);

CREATE TABLE `vault`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(45) NOT NULL,
  `code` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NULL,
  `joined` BIGINT(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `code_UNIQUE` (`code` ASC) VISIBLE
);