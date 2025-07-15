package handler

import (
	"net/http"

	"github.com/fiansyahm/concert-ticket-golang/booking-service/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateTicket handles the creation of a new ticket type for a concert
func CreateTicket(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var ticket model.Ticket
		if err := c.ShouldBindJSON(&ticket); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := db.Create(&ticket).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create ticket"})
			return
		}

		c.JSON(http.StatusCreated, ticket)
	}
}

// GetTicketsByConcert handles listing all tickets for a specific concert
func GetTicketsByConcert(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		concertID := c.Param("concertId")
		var tickets []model.Ticket

		if err := db.Where("concert_id = ?", concertID).Find(&tickets).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tickets"})
			return
		}

		c.JSON(http.StatusOK, tickets)
	}
}
