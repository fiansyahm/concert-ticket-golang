package database

import (
	"fmt"
	"log"
	"os"

	"github.com/fiansyahm/concert-ticket-golang/booking-service/model"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// InitDB initializes the database connection and runs migrations
func InitDB() (*gorm.DB, error) {
	dsn := os.Getenv("MYSQL_DSN")
	if dsn == "" {
		// Default DSN for local development if not set
		dsn = "root:password@tcp(127.0.0.1:3306)/booking_db?charset=utf8mb4&parseTime=True&loc=Local"
	}

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	log.Println("Database connection successful")

	// Auto-migrate models
	err = db.AutoMigrate(&model.Concert{}, &model.Ticket{}, &model.Booking{})
	if err != nil {
		return nil, fmt.Errorf("failed to migrate database: %w", err)
	}

	log.Println("Database migration successful")

	return db, nil
}
