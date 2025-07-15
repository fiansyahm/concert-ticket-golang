package database

import (
	"fmt"
	"log"
	"os"

	"github.com/fiansyahm/concert-ticket-golang/payment-service/model"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// InitDB initializes the database connection and runs migrations
func InitDB() (*gorm.DB, error) {
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "payment.db"
	}

	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	log.Println("Database connection successful")

	// Auto-migrate the Payment model
	err = db.AutoMigrate(&model.Payment{})
	if err != nil {
		return nil, fmt.Errorf("failed to migrate database: %w", err)
	}

	log.Println("Database migration successful")

	return db, nil
}
