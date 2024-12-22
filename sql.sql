create DATABASE meal;

use meal;

CREATE USER 'sesac'@'%' IDENTIFIED BY '1234';
INSERT INTO favorites (user_id, video_id, createdAt, updatedAt) 
VALUES 
(3, 1, NOW(), NOW()),
(3, 2 , NOW(), NOW()),
(3, 3, NOW(), NOW());
