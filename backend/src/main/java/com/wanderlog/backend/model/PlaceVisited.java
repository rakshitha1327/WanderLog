package com.wanderlog.backend.model;

public class PlaceVisited {

    private String name;
    private double[] coordinates; // [lat, lng]

    public PlaceVisited() {}

    public PlaceVisited(String name, double[] coordinates) {
        this.name = name;
        this.coordinates = coordinates;
    }

    public String getName() {
        return name;
    }

    public double[] getCoordinates() {
        return coordinates;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCoordinates(double[] coordinates) {
        this.coordinates = coordinates;
    }
}
