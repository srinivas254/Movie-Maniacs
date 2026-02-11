package com.taskforge.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cast_crew")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CastCrew {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    private String name;

    @Enumerated(EnumType.STRING)
    private PersonType type;   // CAST or CREW

    private String role;       // Used only if CREW

    private String characterName; // Used only if CAST
}

