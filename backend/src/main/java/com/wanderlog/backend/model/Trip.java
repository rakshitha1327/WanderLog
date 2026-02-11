package com.wanderlog.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "trips")
public class Trip {

    @Id
    private String id;

    private String title;
    private String location;
    private String description;
    private String date;
    private String totalBudget;
    private String foodExperience;

    private String coverImage;       // Cloudinary URL
    private List<String> images;     // Cloudinary URLs

    private boolean isPublic;
    private String userEmail;

    // 🔥 IMPORTANT
    private List<PlaceVisited> placesVisited;

    // Default constructor
    public Trip() {}

    // Constructor
    public Trip(String title, String location, String description, String date, 
                String totalBudget, String foodExperience, String coverImage, 
                List<String> images, boolean isPublic, String userEmail, 
                List<PlaceVisited> placesVisited) {
        this.title = title;
        this.location = location;
        this.description = description;
        this.date = date;
        this.totalBudget = totalBudget;
        this.foodExperience = foodExperience;
        this.coverImage = coverImage;
        this.images = images;
        this.isPublic = isPublic;
        this.userEmail = userEmail;
        this.placesVisited = placesVisited;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTotalBudget() { return totalBudget; }
    public void setTotalBudget(String totalBudget) { this.totalBudget = totalBudget; }

    public String getFoodExperience() { return foodExperience; }
    public void setFoodExperience(String foodExperience) { this.foodExperience = foodExperience; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public List<PlaceVisited> getPlacesVisited() { return placesVisited; }
    public void setPlacesVisited(List<PlaceVisited> placesVisited) { this.placesVisited = placesVisited; }
}
