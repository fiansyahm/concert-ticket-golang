package main

import (
	"fmt"
	"log"
	"os"
	"time"

	bookingModel "github.com/fiansyahm/concert-ticket-golang/booking-service/model"
	paymentModel "github.com/fiansyahm/concert-ticket-golang/payment-service/model"
	userModel "github.com/fiansyahm/concert-ticket-golang/user-service/model"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func initDB(dbPath string, models ...interface{}) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database %s: %v", dbPath, err)
	}

	log.Printf("Database %s connection successful", dbPath)

	err = db.AutoMigrate(models...)
	if err != nil {
		log.Fatalf("Failed to migrate database %s: %v", dbPath, err)
	}
	log.Printf("Database %s migration successful", dbPath)
	return db
}

func main() {
	// Clean up existing databases
	os.Remove("user.db")
	os.Remove("booking.db")
	os.Remove("payment.db")

	// Initialize User DB
	userDB := initDB("user.db", &userModel.User{})

	// Insert dummy user
	user := userModel.User{
		Username:  "testuser",
		Password:  "password123", // In a real app, hash this!
		Email:     "test@example.com",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	userDB.Create(&user)
	fmt.Printf("Created user: %+v\n", user)

	// Initialize Booking DB
	bookingDB := initDB("booking.db", &bookingModel.Concert{}, &bookingModel.Ticket{}, &bookingModel.Booking{})

	// Insert dummy concert
	concert := bookingModel.Concert{
		Name:        "Rock Fest 2025",
		Venue:       "Stadium Jakarta",
		Date:        time.Now().Add(7 * 24 * time.Hour), // 7 days from now
		TotalTickets: 1000,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
	bookingDB.Create(&concert)
	fmt.Printf("Created concert: %+v\n", concert)

	// Insert dummy tickets for the concert
	ticketVIP := bookingModel.Ticket{
		ConcertID: concert.ID,
		Type:      "VIP",
		Price:     150.00,
		Quantity:  100,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	bookingDB.Create(&ticketVIP)
	fmt.Printf("Created VIP ticket: %+v\n", ticketVIP)

	ticketRegular := bookingModel.Ticket{
		ConcertID: concert.ID,
		Type:      "Regular",
		Price:     75.00,
		Quantity:  900,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	bookingDB.Create(&ticketRegular)
	fmt.Printf("Created Regular ticket: %+v\n", ticketRegular)

	// Insert dummy booking
	booking := bookingModel.Booking{
		UserID:    user.ID,
		TicketID:  ticketRegular.ID,
		Quantity:  2,
		Status:    "confirmed",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	bookingDB.Create(&booking)
	fmt.Printf("Created booking: %+v\n", booking)

	// Initialize Payment DB
	paymentDB := initDB("payment.db", &paymentModel.Payment{})

	// Insert dummy payment
	payment := paymentModel.Payment{
		BookingID: booking.ID,
		Amount:    float64(booking.Quantity) * ticketRegular.Price,
		Status:    "success",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	paymentDB.Create(&payment)
	fmt.Printf("Created payment: %+v\n", payment)

	fmt.Println("Dummy data generation complete!")
}

