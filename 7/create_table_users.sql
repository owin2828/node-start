create table nodejs.users (
    id int not null auto_increment,
    name varchar(20) not null,
    age int unsigned not null,
    married tinyint not null,
    comment text null,
    created_at datetime not null DEFAULT now(),
    primary key(id),
    unique index name_UNIQUE (name ASC))
    COMMENT= '사용자 정보'
    DEFAULT CHARSET=utf8
    ENGINE=InnoDB;