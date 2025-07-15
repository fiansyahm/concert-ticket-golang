package model

import "time"

// Booking represents a user's ticket booking
type Booking struct {
	ID        uint      `json:"id" gorm:"primary_key"`
	UserID    uint      `json:"user_id" gorm:"not null"`
	TicketID  uint      `json:"ticket_id" gorm:"not null"`
	Quantity  int       `json:"quantity" gorm:"not null"`
	Status    string    `json:"status" gorm:"not null"` // e.g., pending, confirmed, cancelled
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
