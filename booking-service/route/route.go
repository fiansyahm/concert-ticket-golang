package route

import (
	"github.com/fiansyahm/concert-ticket-golang/booking-service/handler"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// SetupRouter sets up the routing for the application
func SetupRouter(router *gin.Engine, db *gorm.DB) {
	api := router.Group("/api")
	{
		// Concert routes
		api.POST("/concerts", handler.CreateConcert(db))
		api.GET("/concerts", handler.GetConcerts(db))
		api.GET("/concerts/:id", handler.GetConcert(db))

		// Ticket routes
		api.POST("/tickets", handler.CreateTicket(db))
		api.GET("/tickets/concerts/:concertId", handler.GetTicketsByConcert(db))

		// Booking routes
		api.POST("/bookings", handler.CreateBooking(db))
		api.GET("/users/:userId/bookings", handler.GetUserBookings(db))
	}
}
