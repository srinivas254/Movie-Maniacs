package com.taskforge.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "movie")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movie {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer duration;

    @Column(nullable = false)
    private String directedBy;

    @Column(nullable = false)
    private String country;

    @Column(nullable = false)
    private String language;

    @Column(nullable = false)
    private String ageRating;

    private String posterSmallUrl;
    private String posterWideUrl;

    private String overview;
    private String watchLink;
}

