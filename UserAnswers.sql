/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE "UserAnswers" (
  "answer" int NOT NULL,
  "description" varchar(255) NOT NULL,
  "question_id" int NOT NULL,
  PRIMARY KEY ("answer","question_id")
);

INSERT INTO `UserAnswers` (`answer`, `description`, `question_id`) VALUES
(1, 'a', 1);
INSERT INTO `UserAnswers` (`answer`, `description`, `question_id`) VALUES
(1, 'aa', 2);
INSERT INTO `UserAnswers` (`answer`, `description`, `question_id`) VALUES
(1, 'asdg', 3);
INSERT INTO `UserAnswers` (`answer`, `description`, `question_id`) VALUES
(1, 'ahsd', 4),
(1, 'a', 5),
(2, 'b', 1),
(2, 'b', 2),
(2, 'adsgsadg', 3),
(2, 'hahs', 4),
(2, 'b', 5),
(3, 'c', 1),
(3, 'c', 2),
(3, 'sadg', 3),
(3, 'ahsda', 4),
(3, 'c', 5),
(4, 'd', 1),
(4, 'asdg', 2),
(4, 'sdag', 3),
(4, 'adshahdsah', 4),
(4, 'd', 5);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;