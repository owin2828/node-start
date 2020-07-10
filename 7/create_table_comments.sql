create table nodejs.comments (
    id int not null auto_increment,
    commenter int not null,
    comment varchar(20) not null,
    created_at datetime not null DEFAULT now(),
    primary key(id),
    INDEX commenter_idx (commenter ASC),
    CONSTRAINT commenter
    FOREIGN KEY (commenter)
    REFERENCES nodejs.users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
    COMMENT = '댓글'
    DEFAULT CHARSET=utf8
    ENGINE=InnoDB;