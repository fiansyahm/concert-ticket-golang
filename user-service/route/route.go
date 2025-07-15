package route

import (
	"github.com/fiansyahm/concert-ticket-golang/user-service/handler"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// SetupRouter sets up the routing for the application
func SetupRouter(router *gin.Engine, db *gorm.DB) {
	api := router.Group("/api")
	{
		api.POST("/register", handler.Register(db))
		api.POST("/login", handler.LoginUser(db))
		api.GET("/users/:id", handler.GetUserProfile(db))
		api.PUT("/users/:id", handler.UpdateUserProfile(db))
		api.DELETE("/users/:id", handler.DeleteUser(db))
	}
}
