-- Sample credentials
INSERT INTO `vault`.`credentials` (`email`, `user_id`, `password`) VALUES ('cameron@cpp.com', '1', 'faa');
INSERT INTO `vault`.`credentials` (`email`, `user_id`, `password`) VALUES ('austin@cpp.com', '2', 'faa');
INSERT INTO `vault`.`credentials` (`email`, `user_id`, `password`) VALUES ('jessie@cpp.com', '3', 'faa');
INSERT INTO `vault`.`credentials` (`email`, `user_id`, `password`, `key`) VALUES ('123@example.com', '4', 'foo', 'key1');
INSERT INTO `vault`.`credentials` (`email`, `user_id`, `password`) VALUES ('abc@gmail.com', '5', 'fee');
INSERT INTO `vault`.`credentials` (`email`, `user_id`, `password`, `key`) VALUES ('thisisareallylongemailadressfortesting@example.com', '6', 'faa', 'key3');

-- Sample users
INSERT INTO `vault`.`users` (`id`, `name`, `email`, `code`, `joined`) VALUES ('1', 'Cameron Ross', 'cameron@cpp.com', '123', 1695087923242);
INSERT INTO `vault`.`users` (`id`, `name`, `email`, `code`, `joined`) VALUES ('2', 'Austin M', 'austin@cpp.com', '456', 1694087923242);
INSERT INTO `vault`.`users` (`id`, `name`, `email`, `code`, `joined`) VALUES ('3', 'Jessie C', 'jessie@cpp.com', '789', 1695086923242);
INSERT INTO `vault`.`users` (`id`, `name`, `email`, `code`, `joined`) VALUES ('4', 'John Smith', '123@example.com', 'mycode', 1695087923242);
INSERT INTO `vault`.`users` (`id`, `name`, `email`, `code`, `joined`) VALUES ('5', 'Mary Jane', 'abc@gmail.com', 'abc123', 1694087923242);
INSERT INTO `vault`.`users` (`id`, `name`, `email`, `code`, `joined`) VALUES ('6', 'Bob Johnson', 'thisisareallylongemailadressfortesting@exampleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.com', 'friendme', 1695086923242);