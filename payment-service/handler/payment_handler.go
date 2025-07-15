package handler

import (
	"net/http"

	"github.com/fiansyahm/concert-ticket-golang/payment-service/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ProcessPayment handles the creation of a new payment
func ProcessPayment(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var payment model.Payment
		if err := c.ShouldBindJSON(&payment); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// In a real application, you would integrate with a payment gateway here.
		// For simplicity, we'll just assume the payment is successful.
		payment.Status = "success"

		if err := db.Create(&payment).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process payment"})
			return
		}

		// Here you would typically notify the booking service that the payment was successful.

		c.JSON(http.StatusCreated, payment)
	}
}

// GetPaymentStatus handles fetching the status of a payment
func GetPaymentStatus(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		bookingID := c.Param("bookingId")
		var payment model.Payment

		if err := db.Where("booking_id = ?", bookingID).First(&payment).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
			return
		}

		c.JSON(http.StatusOK, payment)
	}
}
