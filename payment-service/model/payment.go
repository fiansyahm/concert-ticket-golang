package model

import "time"

// Payment represents a payment for a booking
type Payment struct {
	ID        uint      `json:"id" gorm:"primary_key"`
	BookingID uint      `json:"booking_id" gorm:"unique;not null"`
	Amount    float64   `json:"amount" gorm:"not null"`
	PaymentStatus    string    `json:"payment_status" gorm:"column:status;not null"` // e.g., pending, success, failed
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
