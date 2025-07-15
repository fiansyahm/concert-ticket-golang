package model

import (
	"time"
)

// Concert represents a concert event
type Concert struct {
	ID          uint      `json:"id" gorm:"primary_key"`
	Name        string    `json:"name" gorm:"not null"`
	Venue       string    `json:"venue" gorm:"not null"`
	Date        time.Time `json:"date" gorm:"not null"`
	TotalTickets int       `json:"total_tickets" gorm:"not null"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
