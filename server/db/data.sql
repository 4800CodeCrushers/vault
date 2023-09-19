-- Sample credentials
INSERT INTO `vault`.`credentials` (`email`, `user_id`, `password`, `key`) VALUES ('123@example.com', '1', 'foo', 'key1');
INSERT INTO `vault`.`credentials` (`email`, `user_id`, `password`) VALUES ('abc@gmail.com', '2', 'fee');
INSERT INTO `vault`.`credentials` (`email`, `user_id`, `password`, `key`) VALUES ('thisisareallylongemailadressfortesting@example.com', '3', 'faa', 'key3');

-- Sample users
INSERT INTO `vault`.`users` (`id`, `email`, `code`, `joined`) VALUES ('1', '123@example.com', 'mycode', `1695087923242`);
INSERT INTO `vault`.`users` (`id`, `email`, `code`, `joined`) VALUES ('2', 'abc@gmail.com', 'abc123', `1694087923242`);
INSERT INTO `vault`.`users` (`id`, `email`, `code`, `joined`) VALUES ('3', 'thisisareallylongemailadressfortesting@exampleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.com', 'friendme', `1695086923242`);