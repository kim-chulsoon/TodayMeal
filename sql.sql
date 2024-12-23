create DATABASE meal;

use meal;

CREATE USER 'sesac'@'%' IDENTIFIED BY '1234';
<<<<<<< HEAD
show tables;
desc notes;

select * from notes;
SELECT * 
FROM Notes
WHERE videoId = '1' AND userId = 'asdf1234';
=======
INSERT INTO favorites (user_id, video_id, createdAt, updatedAt) 
VALUES 
(3, 1, NOW(), NOW()),
(3, 2 , NOW(), NOW()),
(3, 3, NOW(), NOW());
>>>>>>> 64f8f4e8b43357249d8568dfa35dac31a4ba9093
