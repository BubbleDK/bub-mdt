CREATE TABLE
  IF NOT EXISTS `mdt_offenses` (
    `label` varchar(100) NOT NULL,
    `type` ENUM('misdemeanor', 'felony', 'infraction') NOT NULL,
    `category` ENUM(
      'OFFENSES AGAINST PERSONS',
      'OFFENSES INVOLVING THEFT',
      'OFFENSES INVOLVING FRAUD',
      'OFFENSES INVOLVING DAMAGE TO PROPERTY',
      'OFFENSES AGAINST PUBLIC ADMINISTRATION',
      'OFFENSES AGAINST PUBLIC ORDER',
      'OFFENSES AGAINST HEALTH AND MORALS',
      'OFFENSES AGAINST PUBLIC SAFETY',
      'OFFENSES INVOLVING THE OPERATION OF A VEHICLE',
      'OFFENSES INVOLVING THE WELL-BEING OF WILDLIFE') NOT NULL,
    `description` varchar(250) NOT NULL,
    `time` int UNSIGNED NOT NULL DEFAULT 0,
    `fine` int UNSIGNED NOT NULL DEFAULT 0,
    `points` int UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (`label`)
);

CREATE TABLE
  IF NOT EXISTS `mdt_incidents` (
    `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` varchar(50) NOT NULL,
    `description` text DEFAULT NULL,
    `author` varchar(50) DEFAULT NULL,
    `date` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);

CREATE TABLE
  IF NOT EXISTS `mdt_incidents_criminals` (
    `incidentid` INT UNSIGNED NOT NULL,
    `citizenid` VARCHAR(50) NOT NULL,
    `reduction` TINYINT UNSIGNED NULL DEFAULT NULL,
    `warrantExpiry` DATE NULL DEFAULT NULL,
    `processed` TINYINT NULL DEFAULT NULL,
    `pleadedGuilty` TINYINT NULL DEFAULT NULL,
    INDEX `incidentid` (`incidentid`),
    INDEX `FK_mdt_incidents_incidents_players` (`citizenid`),
    CONSTRAINT `mdt_incidents_criminals_ibfk_2` FOREIGN KEY (`incidentid`) REFERENCES `mdt_incidents` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE
  IF NOT EXISTS `mdt_incidents_officers` (
    `incidentid` int UNSIGNED NOT NULL,
    `citizenid` VARCHAR(50) NOT NULL,
    KEY `FK_mdt_incidents_officers_players` (`citizenid`),
    KEY `incidentid` (`incidentid`),
    CONSTRAINT `FK_mdt_incidents_officers_mdt_incidents` FOREIGN KEY (`incidentid`) REFERENCES `mdt_incidents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE
  IF NOT EXISTS `mdt_incidents_charges` (
    `incidentid` int UNSIGNED NOT NULL,
    `citizenid` VARCHAR(50) NOT NULL,
    `charge` VARCHAR(100) DEFAULT NULL,
    `type` ENUM('misdemeanor', 'felony', 'infraction') NOT NULL,
    `count` int UNSIGNED NOT NULL DEFAULT 1,
    `time` int UNSIGNED DEFAULT NULL,
    `fine` int UNSIGNED DEFAULT NULL,
    `points` int UNSIGNED DEFAULT NULL,
    KEY `FK_mdt_incidents_charges_mdt_incidents_criminals` (`incidentid`),
    KEY `FK_mdt_incidents_charges_mdt_incidents_criminals_2` (`citizenid`),
    KEY `FK_mdt_incidents_charges_mdt_offenses` (`charge`),
    CONSTRAINT `FK_mdt_incidents_charges_mdt_offenses` FOREIGN KEY (`charge`) REFERENCES `mdt_offenses` (`label`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `FK_mdt_incidents_charges_mdt_incidents_criminals_2` FOREIGN KEY (`citizenid`) REFERENCES `mdt_incidents_criminals` (`citizenid`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE
  IF NOT EXISTS `mdt_incidents_evidence` (
    `incidentid` INT UNSIGNED NOT NULL,
    `label` VARCHAR(50) NOT NULL DEFAULT '',
    `image` VARCHAR(90) NOT NULL DEFAULT '',
    INDEX `incidentid` (`incidentid`),
    CONSTRAINT `FK_mdt_incidents_evidence_mdt_incidents` FOREIGN KEY (`incidentid`) REFERENCES `mdt_incidents` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE
  IF NOT EXISTS `mdt_announcements` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `creator` VARCHAR(50) NOT NULL,
    `contents` TEXT NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `FK_mdt_announcements_players` (`creator`)
);

CREATE TABLE
  IF NOT EXISTS `mdt_warrants` (
    `incidentid` INT UNSIGNED NOT NULL,
    `citizenid` VARCHAR(50) NOT NULL,
    `expiresAt` DATETIME NOT NULL,
    CONSTRAINT `mdt_warrants_mdt_incidents_id_fk` FOREIGN KEY (`incidentid`) REFERENCES `mdt_incidents` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE
  IF NOT EXISTS `mdt_profiles` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `citizenid`  VARCHAR(50)  NOT NULL,
    `image`    VARCHAR(90) NULL,
    `notes`    TEXT        NULL,
    `callsign` VARCHAR(10) NULL,
    `apu` TINYINT NULL DEFAULT NULL,
    `air` TINYINT NULL DEFAULT NULL,
    `mc` TINYINT NULL DEFAULT NULL,
    `k9` TINYINT NULL DEFAULT NULL,
    `fto` TINYINT NULL DEFAULT NULL,
    `fingerprint` VARCHAR(90) NULL,
    `lastActive` DATETIME DEFAULT NULL,
    CONSTRAINT `mdt_profiles_pk` UNIQUE (`callsign`),
    CONSTRAINT `mdt_profiles_pk2` UNIQUE (`citizenid`)
);

CREATE TABLE
  IF NOT EXISTS `mdt_recent_activity` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `citizenid` VARCHAR(50) NOT NULL,
    `category` VARCHAR(100) DEFAULT NULL,
    `type` ENUM('created', 'updated', 'deleted') NOT NULL,
    `date` datetime DEFAULT CURRENT_TIMESTAMP,
    `activityid` INT UNSIGNED DEFAULT NULL
);

CREATE TABLE
  IF NOT EXISTS `mdt_reports` (
    `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` varchar(50) NOT NULL,
    `description` text DEFAULT NULL,
    `author` varchar(50) DEFAULT NULL,
    `date` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);

CREATE TABLE
  IF NOT EXISTS `mdt_reports_officers` (
    `reportid` int UNSIGNED NOT NULL,
    `citizenid` VARCHAR(50) NOT NULL,
    KEY `FK_mdt_reports_officers_players` (`citizenid`),
    KEY `reportid` (`reportid`),
    CONSTRAINT `FK_mdt_reports_officers_mdt_reports` FOREIGN KEY (`reportid`) REFERENCES `mdt_reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE
  IF NOT EXISTS `mdt_reports_citizens` (
    `reportid` int UNSIGNED NOT NULL,
    `citizenid` VARCHAR(50) NOT NULL,
    KEY `FK_mdt_reports_players` (`citizenid`),
    KEY `reportid` (`reportid`),
    CONSTRAINT `FK_mdt_reports_players_mdt_reports` FOREIGN KEY (`reportid`) REFERENCES `mdt_reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE
  IF NOT EXISTS `mdt_reports_evidence` (
    `reportid` INT UNSIGNED NOT NULL,
    `label` VARCHAR(50) NOT NULL DEFAULT '',
    `image` VARCHAR(90) NOT NULL DEFAULT '',
    INDEX `reportid` (`reportid`),
    CONSTRAINT `FK_mdt_reports_evidence_mdt_reports` FOREIGN KEY (`reportid`) REFERENCES `mdt_reports` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE
  IF NOT EXISTS `mdt_vehicles` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `plate`  VARCHAR(50)  NOT NULL,
    `image`    VARCHAR(90) NULL,
    `notes`    TEXT        NULL,
    `known_information` JSON NULL,
    UNIQUE (`plate`)
);

CREATE TABLE
  IF NOT EXISTS `mdt_bolos` (
    `plate` VARCHAR(50) NOT NULL,
    `reason` TEXT NOT NULL,
    `expiresAt` DATETIME NOT NULL,
    UNIQUE (`plate`)
);