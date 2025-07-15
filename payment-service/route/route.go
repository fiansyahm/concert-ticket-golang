package route

import (
	"github.com/fiansyahm/concert-ticket-golang/payment-service/handler"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// SetupRouter sets up the routing for the application
func SetupRouter(router *gin.Engine, db *gorm.DB) {
	api := router.Group("/api")
	{
		api.POST("/payments", handler.ProcessPayment(db))
		api.GET("/payments/:bookingId", handler.GetPaymentStatus(db))
		api.GET("/payments", handler.GetAllPayments(db))
	}
}
