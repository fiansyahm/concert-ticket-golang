package handler

import (
	"net/http"

	"github.com/fiansyahm/concert-ticket-golang/booking-service/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateConcert handles the creation of a new concert
func CreateConcert(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var concert model.Concert
		if err := c.ShouldBindJSON(&concert); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := db.Create(&concert).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create concert"})
			return
		}

		c.JSON(http.StatusCreated, concert)
	}
}

// GetConcerts handles listing all concerts
func GetConcerts(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var concerts []model.Concert
		if err := db.Find(&concerts).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch concerts"})
			return
		}

		c.JSON(http.StatusOK, concerts)
	}
}

// GetConcert handles fetching a single concert by ID
func GetConcert(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		concertID := c.Param("id")
		var concert model.Concert

		if err := db.First(&concert, concertID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Concert not found"})
			return
		}

		c.JSON(http.StatusOK, concert)
	}
}
