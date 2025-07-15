package handler

import (
	"net/http"

	"github.com/fiansyahm/concert-ticket-golang/booking-service/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateBooking handles the creation of a new booking
func CreateBooking(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var booking model.Booking
		if err := c.ShouldBindJSON(&booking); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// In a real-world scenario, you would add more logic here:
		// 1. Check if the user is authenticated (e.g., from a JWT token)
		// 2. Verify that the ticket is available and there is enough quantity
		// 3. Use a database transaction to ensure atomicity

		booking.Status = "pending" // Initial status

		if err := db.Create(&booking).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create booking"})
			return
		}

		c.JSON(http.StatusCreated, booking)
	}
}

// GetUserBookings handles listing all bookings for a specific user
func GetUserBookings(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// In a real-world scenario, you would get the user ID from the JWT token
		userID := c.Param("userId")
		var bookings []model.Booking

		if err := db.Where("user_id = ?", userID).Find(&bookings).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bookings"})
			return
		}

		c.JSON(http.StatusOK, bookings)
	}
}
