package model

import "time"

// Ticket represents a type of ticket for a concert
type Ticket struct {
	ID          uint      `json:"id" gorm:"primary_key"`
	ConcertID   uint      `json:"concert_id" gorm:"not null"`
	Type        string    `json:"type" gorm:"not null"`
	Price       float64   `json:"price" gorm:"not null"`
	Quantity    int       `json:"quantity" gorm:"not null"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
