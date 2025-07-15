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

		// Check if a payment for this booking_id already exists
		var existingPayment model.Payment
		result := db.Where("booking_id = ?", payment.BookingID).First(&existingPayment)

		if result.Error == nil {
			// Payment exists, update its status
			existingPayment.PaymentStatus = "success"
			if err := db.Save(&existingPayment).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update payment status"})
				return
			}
			c.JSON(http.StatusOK, existingPayment)
		} else if result.Error == gorm.ErrRecordNotFound {
			// No existing payment, create a new one
			payment.PaymentStatus = "success"
			if err := db.Create(&payment).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process payment"})
				return
			}
			c.JSON(http.StatusCreated, payment)
		} else {
			// Other database error
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error checking payment status"})
			return
		}
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

// GetAllPayments handles fetching all payments
func GetAllPayments(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var payments []model.Payment
		if err := db.Find(&payments).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch payments"})
			return
		}
		c.JSON(http.StatusOK, payments)
	}
}
