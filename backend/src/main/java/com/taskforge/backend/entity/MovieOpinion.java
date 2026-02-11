package com.taskforge.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "movie_opinion",
        uniqueConstraints = @UniqueConstraint(columnNames = {"movie_id", "user_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieOpinion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private OpinionType opinionType;
}

